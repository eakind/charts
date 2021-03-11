<template>
  <div class="dc-file-content">
    <div class="file-content-header">
      <div :class="[selectUpload === 0 ? 'file-active' : '']" @click="selectUploadHandler(0)">
        <span>{{$t('message.native_file')}}</span>
      </div>
      <div :class="[selectUpload === 2 ? 'file-active' : '']" @click="selectUploadHandler(2)">
        <span>{{$t('message.db_file')}}</span>
      </div>
    </div>
    <div class="file-content-body">
      <local-file v-if="selectUpload===0" @finish="finishSetting" @changeType="changeType"></local-file>
      <db-file v-if="selectUpload===2"></db-file>
    </div>
  </div>
</template>

<script>
import LocalFile from './localFile.vue';
import DbFile from './dbFile.vue';
import { get, post } from '@/api/server';
import { mapState, mapMutations } from 'vuex';
export default {
  components: {
    DbFile,
    LocalFile
  },
  data () {
    return {
    };
  },
  computed: {
    ...mapState('project', ['projectName', 'projectId', 'settingsId', 'successFileList', 'selectUpload', 'templateId'])
  },
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
  },
  mounted () {
    this.getProDetail();
  },
  destroyed () {
  },
  methods: {
    ...mapMutations('project', ['setSettingsId', 'setProjectId', 'setSelectUpload', 'setSuccessFileList',
      'setFaileFileList', 'setProjectStatus', 'setDbObj', 'setIsPreview', 'setCreateChart', 'setTemplateId']),
    selectUploadHandler (num) {
      for (let i = 0; i < this.successFileList.length; i++) {
        if (this.successFileList[i].code === 0) {
          return;
        }
      }
      this.setSelectUpload(num);
    },
    finishSetting (item, fileType) {
      if (this.projectId) {
        this.setSettingsParam(item, fileType);
      } else {
        this.createProject(item, fileType);
      }
    },
    changeType (item, fileType) {
      if (this.projectId) {
        this.setSettingsParam(item, fileType);
      }
    },
    setSettingsParam (item, fileType) {
      let param = {
        project_id: this.projectId,
        file_type: fileType
      };
      if (fileType === 'csv') {
        param.encoding = item.encoding;
        param.seq = item.seq;
        param.wrap = item.wrap;
        param.quotechar = item.quotechar;
        param.thousands = item.thousands;
        param.startrows = item.startrows;
        param.header = item.header;
      }
      if (this.settingsId) {
        param.settings_id = this.settingsId;
        this.modifySettingsId(param);
      } else {
        this.setting(param);
      }
    },
    async getProDetail () {
      let param = {
        project_id: this.projectId,
        project_name: this.projectName,
        project_type: 'BI'
      };
      if (!this.projectId) return;
      let res = await get('projectDetail', param);
      if (res.code === 0) {
        if (res.setting && res.setting.settings_id) {
          this.setSettingsId(res.setting.settings_id);
        }
        this.setProjectStatus(res.status);
        if (res.template_idx) {
          this.setTemplateId(res.template_idx);
        }
        switch (res.status) {
          case 'UPLOADED':
            this.setIsPreview(true);
            setTimeout(() => {
              this.setCreateChart(true);
            }, 0);
            break;
          case 'ANALYZING':
            if (res.source_type === 'DATABASE') {
              this.setIsPreview(true);
            }
            break;
        }
        let selectObj = {
          LOCAL: 0,
          NETWORK: 1,
          DATABASE: 2
        };
        if (res.source_type) {
          this.setSelectUpload(selectObj[res.source_type]);
        } else {
          this.setSelectUpload(0);
        }
        if (res.setting) {
          let obj = res.setting;
          sessionStorage.setItem('formatobj', JSON.stringify(obj));
        }
        if (res.db_settings) {
          this.setDbObj(res.db_settings);
        } else {
          this.setDbObj({
            dialect: 'mysql',
            database: '',
            host: '',
            port: '3306',
            user: '',
            password: '',
            sql: ''
          });
        }
        if (res.file_list) {
          let list = res.file_list;
          this.setSuccessFileList([]);
          for (let i = 0; i < list.length; i++) {
            this.successFileList.push({
              fileName: list[i].file_name ? list[i].file_name : '',
              fileId: list[i].file_id,
              msg: list[i].status_msg ? list[i].status_msg : '',
              code: list[i].status_code
            });
          }
          this.setSuccessFileList(this.successFileList);
        }
      }
    },
    async createProject (item, fileType) {
      let param = {
        project_name: this.projectName,
        project_type: 'BI'
      };
      if (this.templateId) {
        param.template_idx = this.templateId;
      }
      if (this.projectName.length > 64) return;
      let res = await post('create', param);
      this.setProjectId(res.project_id);
      this.setSettingsParam(item, fileType);
    },
    async modifySettingsId (param) {
      let res = await post('modifySettings', param);
      if (res.code === 0) {
        this.getFileList();
      }
    },
    async getFileList () {
      let param = {
        project_id: this.projectId
      };
      if (!this.projectId) return;
      // this.setSuccessFileList([]);
      let successFileIdList = this.successFileList.map((item) => { return item.fileId; });
      this.setFaileFileList([]);
      let res = await get('fileList', param);
      if (res.code === 0) {
        for (let i = 0; i < res.file_list.length; i++) {
          if (!res.file_list[i].file_name) continue;
          if (successFileIdList.indexOf(res.file_list[i].file_id) === -1) {
            this.successFileList.push({
              fileName: res.file_list[i].file_name,
              fileId: res.file_list[i].file_id,
              msg: res.file_list[i].status_msg,
              code: res.file_list[i].status_code
            });
          }
        }
        this.setSuccessFileList(this.successFileList);
        this.bus.$emit('joinFile'); // 更新数据类型预览
      }
    },
    async setting (param) {
      let res = await post('setting', param);
      if (res.code === 0) {
        this.setSettingsId(res.settings_id);
        this.bus.$emit('joinFile'); // 更新数据类型预览
      }
    }
  }
};
</script>

<style scoped lang="scss">
.dc-file-content{
  margin: 5px 0px;
  .file-content-header{
    display: flex;
    div{
      width: 200px;
      color: #8C8C8C;
      font-size: 16px;
      padding: 5px 20px;
      text-align: center;
      cursor: pointer;
      position: relative;
      span{
        &::after {
          content: "";
          width: 0;
          height: 4px;
          background-color: #4284F5;
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto;
          transition: width .3s;

        }
      }
    }
    .file-active{
      span{
        color: #4284F5;
        display: inline-block;
        &::after{
          content: '';
          width: 40px;
          height: 4px;
          border-radius: 20px;
          background-color: #4284F5;
          display: block;
          margin: 0 auto;
          top: 3px;
          position: relative;
        }
      }
    }
  }
  .file-content-body{
    > div{
      max-width: 840px;
    }
  }

}
</style>
