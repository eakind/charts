<template>
  <div class="dc-create-project-preview">
    <div class="content-section">
      <div class = "back-box">
        <span class="back-btn" @click="backHandler">{{$t('message.return_back')}}</span>
      </div>
      <div class="upload-content-header project-content">
        <span class="header-title">{{$t('message.project_data')}}</span>
        <span class="body-title-name">{{projectName}}</span>
      </div>
      <div class="section-header-body" v-if="selectUpload !== 2">
        <span class="body-has-file">{{$t('message.added_file')}}</span>
        <button class="finish-btn" :class="successFileList.length > 0 ? 'finish-btn-active' : ''" v-if="selectUpload !== 2 && !createChart" @click="returnChange">
          {{$t('message.back_modify')}}
        </button>
        <div class="file-list">
          <div class="list-item" :title="item.fileName" v-for="(item, index) in successFileList" :key="index">{{item.fileName}}</div>
        </div>
      </div>
      <div class="section-header-body" v-else>
        <span class="header-body-txt">{{$t('message.db_type')}}</span>
        <span class="body-data">{{dbObj.dialect}}</span>
        <span class="header-body-txt">{{$t('message.db_name')}}</span>
        <span class="body-data">{{dbObj.database}}</span>
        <span class="header-body-txt">{{$t('message.db_server')}}</span>
        <span  class="body-data">{{dbObj.host}}</span>
        <span class="header-body-txt">{{$t('message.db_port')}}</span>
        <span  class="body-data">{{dbObj.port}}</span>
        <span class="header-body-txt">{{$t('message.db_username')}}</span>
        <span  class="body-data">{{dbObj.user}}</span>
      </div>
    </div>
    <div class="dc-preview">
      <div class="dc-preview-header">
        <div class="project-preview-name">
            <span class="body-preview-title">{{$t('message.data_preview')}}</span>
            <div class="body-preview-next" @click="previewNextStep">{{$t('message.submit_data')}}</div>
        </div>
        <div v-if = "!templateId" class="project-preview-message">
            <p class="body-preview-message"
             v-if="projectStatus === 'REPLACE' || projectStatus === 'APPEND' || projectStatus === 'REPLACING' || projectStatus === 'APPENDING'">
              各列数据类型已由系统自动识别得出
            </p>
            <p class="body-preview-message" v-else>{{$t('message.preview_message')}}</p>
        </div>
        <div class="project-preview-info">
          <span class="preview-type" v-if="!templateId">
            <template  v-if="projectStatus !== 'REPLACE' && projectStatus !== 'APPEND' && projectStatus !== 'REPLACING' && projectStatus !== 'APPENDING'">
              <span class="iconfont icon-db_refresh suggestChange"></span>
              <span class="suggest">{{$t('message.suggest_modification')}}</span>
              <span class="iconfont icon-db_refresh systemLoad"></span>
              <span class="system">{{$t('message.system_identification')}}</span>
            </template>
          </span>
          <span class="preview-opeate" ref="opeateRef">
            <dc-square :label="$t('message.only_show_modify')"
             :checked="checkFlag"
             @click.native.stop="checkFlag=!checkFlag"
             v-if="!templateId && projectStatus !== 'REPLACE' && projectStatus !== 'APPEND' && projectStatus !== 'REPLACING' && projectStatus !== 'APPENDING'">
            </dc-square>
            <span>{{$t('message.show_pre')}}
              <input class="data-input" v-model="lineNum" @click.stop="">
              {{$t('message.line_data')}}
            </span>
          </span>
        </div>
      </div>
      <div class="preview-body">
        <pre-table :headList="typeList" :checkFlag="checkFlag" :noModify="templateId?true:false"  :previewList="previewList" @modifyDtype="modifyDtype"></pre-table>
      </div>
    </div>

    <dc-alert class="save_project" v-if="showReturnAlert">
        <div class="dc-alert-header">
            <span>{{$t('message.back_list')}}</span>
            <span class="iconfont icon-db_plus" @click="closeAlert"></span>
        </div>
        <div class="dc-alert-message">
            <p>{{backListTip.keep_content}}</p>
        </div>
        <div class="dc-alert-footer">
            <div class="dc-save-confirm" @click="sureHandle">{{backListTip.save_and_return}}</div>
            <div class="dc-save-cancel" @click="cancelHandle">{{backListTip.only_return}}</div>
        </div>
    </dc-alert>

    <dc-alert v-if="showTip" class="commit-data">
      <div class="dc-alert-header">
        <span>{{$t('message.submit_data')}}</span>
        <span class="iconfont icon-db_plus" @click="showTip = false"></span>
      </div>
      <div class="dc-alert-body alert-tip">
        {{$t('message.upgrade_complete_tip')}}
      </div>
      <div class="dc-alert-footer">
        <button class="dc-alert-confirm" @click="confirmHandler">{{$t('message.confirm')}}</button>
        <button class="dc-alert-cancel" @click="showTip=false">{{$t('message.cancel')}}</button>
      </div>
    </dc-alert>

    <dc-alert class="show-alldata" v-if="showAllDataTip">
      <div class="dc-alert-header">

      </div>
      <div class="dc-alert-body all-data-tip">
        <div class="body-data-tip">
          {{$t('message.all_data_tip')}}
        </div>
      </div>
      <div class="dc-alert-footer">
        <button class="dc-alert-confirm" @click="getAllData">{{$t('message.confirm')}}</button>
        <button class="dc-alert-cancel" @click="showAllDataTip=!showAllDataTip">{{$t('message.cancel')}}</button>
      </div>
    </dc-alert>
    <load-or-return v-if="showLoading">
      <div class="loading-text">
        <p class="loading-wait">创建中，请稍候...</p>
        <p class="loading-return">数据处理时间可能较长，可先返回项目列表。</p>
        <p class="loading-return">处理完成后，即可进入项目。</p>
        <div class="loading-button" @click="backToList">项目列表</div>
      </div>
    </load-or-return>
  </div>
</template>

<script>
import PreTable from '@/components/preTable/preTable.vue';
import LoadOrReturn from '@/components/loading/loadOrReturn';
import DcAlert from '@/components/dcalert/dcAlert';
import DcSquare from './createProjectPreview/dcSquare';
import { mapState, mapMutations } from 'vuex';
import { get, post } from '@/api/server';
export default {
  components: {
    PreTable,
    DcSquare,
    DcAlert,
    LoadOrReturn
  },
  data () {
    return {
      lineNum: 100,
      checkFlag: false,
      typeList: [],
      previewList: [],
      showReturnAlert: false,
      showTip: false,
      showLoading: false,
      showAllDataTip: false,
      isBackToList: false,
      completeTo: ['APPEND', 'REPLACE', 'APPENDING', 'REPLACING'],
      successFileList: []
    };
  },
  computed: {
    ...mapState('project', ['isPreview', 'createChart', 'projectName', 'projectId', 'selectUpload', 'dbObj', 'projectStatus', 'templateId']),
    backListTip () {
      let obj = {
        REPLACING: true,
        REPLACE: true,
        APPEND: true,
        APPENDING: true,
      };
      if (obj[this.projectStatus]) {
        return {
          keep_content: '返回项目列表将不保存本次更新数据，确定退出更新？',
          save_and_return: '确定',
          only_return: '取消',
        };
      } else {
        return {
          keep_content: this.$t('message.keep_content'),
          save_and_return: this.$t('message.save_and_return'),
          only_return: this.$t('message.only_return')
        };
      }
    },
    commitdataTip () {
      if (this.projectStatus === 'REPLACE') {
        return this.$t('message.replace_data');
      } else if (this.projectStatus === 'APPEND') {
        return this.$t('message.upgrade_data');
      } else {
        return this.$t('message.create_project');
      }
    }
  },
  watch: {
    lineNum (val) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.projectPreview();
      }, 1000);
    }
  },
  mounted () {
    this.setIsPreview(false);
    this.projectDtypes();
    this.projectPreview();
    this.getFileList();
    this.bus.$on('getPreviewType', (flag) => {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.projectDtypes(flag);
      }, 300);
    });
    this.bus.$on('getPreview', () => {
      this.projectPreview();
    });
  },
  destroyed () {
    this.bus.$off('getPreviewType');
    this.bus.$off('getPreview');
  },
  methods: {
    ...mapMutations('project', ['setCreateChart', 'setIsPreview', 'setSuccessFileList']),
    async getFileList () {
      this.setSuccessFileList([]);
      let param = {
        project_id: this.projectId
      };
      if (!this.projectId) return;
      let res = await get('fileList', param);
      if (res.code === 0) {
        this.setSuccessFileList([]);
        this.successFileList = [];
        for (let i = 0; i < res.file_list.length; i++) {
          if (!res.file_list[i].file_id) continue;
          this.successFileList.push({
            fileName: res.file_list[i].file_name,
            fileId: res.file_list[i].file_id,
            msg: res.file_list[i].status_msg,
            code: res.file_list[i].status_code
          });
        }
        this.setSuccessFileList(this.successFileList);
      };
    },
    modifyDtype () {
      this.projectDtypes();
      this.projectPreview();
    },
    setPreview () {
      if (this.createChart) return;
      if (this.isPreview) return;
      if (this.typeList.length === 0) return;
      this.setIsPreview(true);
      this.projectPreview();
    },
    async projectPreview () {
      let param = {
        project_id: this.projectId,
        file_id: '',
        limit: this.lineNum
      };
      if (!this.projectId) return;
      let res = await get('projectPreview', param);
      this.previewList = res.data;
    },
    async projectDtypes (flag) {
      let param = {
        project_id: this.projectId
      };
      if (!this.projectId) return;
      let res = await get('projectDTypes', param);
      if (res.code === 0) {
        this.typeList = res.feature_list;
        if (flag) {
          this.setPreview();
        }
      } else {
        this.typeList = [];
      }
    },
    returnChange () {
      this.$router.back();
    },
    backHandler () {
      this.showReturnAlert = true;
    },
    saveProject () {
      this.$router.push({ path: '/' });
    },
    async returnProject () {
      let obj = {
        REPLACING: true,
        REPLACE: true,
        APPEND: true,
        APPENDING: true,
      };
      if (obj[this.projectStatus]) {
        let param = {
          project_id: this.projectId
        };
        if (!this.projectId) return;
        let res = await post('exitProject', param);
        if (res.code === 0) {
          this.$router.push({ path: '/' });
        }
      } else {
        let param = {
          project_id: this.projectId
        };
        let res = await post('delProject', param);
        if (res.code === 0) {
          this.$router.push({ path: '/' });
        }
      }
    },
    async sureHandle () {
      let obj = {
        REPLACING: true,
        REPLACE: true,
        APPEND: true,
        APPENDING: true,
      };
      if (obj[this.projectStatus]) {
        let param = {
          project_id: this.projectId,
        };
        if (!this.projectId) return;
        let res = await post('exitProject', param);
        if (res.code === 0) {
          this.$router.push({ path: '/' });
        }
      } else {
        this.$router.push({ path: '/' });
      }
    },
    async cancelHandle () {
      let obj = {
        REPLACING: true,
        REPLACE: true,
        APPEND: true,
        APPENDING: true,
      };
      if (obj[this.projectStatus]) {
        this.showReturnAlert = false;
      } else {
        let param = {
          project_id: this.projectId,
        };
        await post('delProject', param);
        this.$router.push({ path: '/' });
      }
    },
    closeAlert () {
      this.showReturnAlert = false;
    },
    previewNextStep () {
      if (this.selectUpload === 2) {
        this.showAllDataTip = true;
      } else {
        switch (this.projectStatus) {
          case 'APPEND':
          case 'REPLACE':
          case 'APPENDING':
          case 'REPLACEING':
          case 'ANALYZING':
          case 'UPLOADING':
            this.showTip = true;
            break;
          default:
            this.finishUpload();
            break;
        }
      }
    },
    confirmHandler () {
      this.finishUpload();
      this.showTip = false;
    },
    finishUpload () {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.completeUpload();
      }, 300);
    },
    async completeUpload () {
      let param = {
        project_id: this.projectId
      };
      this.showLoading = true;
      let res = await post('completeUpload', param);
      if (!this.isBackToList) {
        if (res.code === 0) {
          this.$router.push({
            name: 'createprojecttype'
          });
          this.showLoading = false;
          if (this.templateId) {
            this.$router.push({ path: '/drawingboard' });
            return;
          }
          if (this.completeTo.indexOf(this.projectStatus) >= 0) {
            this.$router.push({ path: '/drawingboard' });
          } else {
            this.setCreateChart(true);
          }
        }
      } else {
        this.showLoading = false;
      }
    },
    getAllData () {
      this.dbAll();
    },
    async dbAll () {
      let fileId = this.successFileList[0].fileId || this.successFileList[0].file_id;
      let param = {
        project_id: this.projectId,
        file_id: fileId
      };
      if (!this.projectId) return;
      this.showAllDataTip = false;
      this.bus.$emit('showLoadTip', true);
      let res = await post('dbAllData', param);
      this.bus.$emit('showLoadTip', false);
      if (res.code === 0) {
        this.setPreview();
        this.$router.push({
          name: 'createprojecttype'
        });
      }
    },
    backToList () {
      this.isBackToList = true;
      this.$router.push({ path: '/' });
    }
  }
};
</script>

<style scoped lang="scss">

.dc-create-project-preview {
  width: 100%;
  margin: 8px;
  display: flex;
  flex: 1;
  .content-section{
    width: 180px;
    height: 100%;
    background: #FFFFFF;
    border-radius: 4px;
    padding: 9px 19px;
    box-sizing: border-box;
    .back-btn{
      font-size: 16px;
      color: #424242;
      display: block;
      width: 280px;
      cursor: pointer;
      box-sizing: border-box;
      &::before{
        content: '';
        height: 10px;
        width: 10px;
        border-top: 2px solid #4284F5;
        border-left: 2px solid #4284F5;
        transform: rotate(-45deg);
        display: inline-block;
      }
    }
    .section-header-body{
      .header-body-title{
        font-size: 12px;
        color: #424242;
        display: block;
      }
      .header-body-txt{
        font-size: 12px;
        color: #a4a4a4;
        font-weight: 100;
        display: block;
      }
      .body-data{
        color: #424242;
        font-size: 16px;
        padding: 5px 0px;
        min-height: 10px;
        display: block;
      }
      .body-has-file{
        font-size: 12px;
        color: #424242;
        display: block;
        padding: 0px 0px 6px;
      }
      .file-list{
        .list-item{
          color: #424242;
          font-size: 16px;
          padding: 2px 0px;
          @include ellipsis;
        }
      }
      .finish-btn{
        width: 120px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border-radius: 4px;
        color: #ffffff;
        outline: none;
        border: none;
        font-size: 16px;
        position: relative;
        background: #4284F5;
        margin: 10px 0;
      }
      // .finish-btn-active{
      //   pointer-events: auto;
      //   color: #4284F5;
      //   cursor: pointer;
      // }
    }
  }
  .upload-content-header{
    font-size: 12px;
    color: #424242;
    margin-top: 25px;
    margin-bottom: 16px;
    .body-title-name{
      padding: 5px 0px;
      font-size: 20px;
      display: block;
      color: #424242;
      border-bottom: 2px solid #4284F5;
    }
  }
  .dc-preview {
    width: 100%;
    background: #ffffff;
    margin-left: 10px;
    border-radius: 4px;
    .dc-preview-header{
      padding: 20px 15px 0px;
      font-size: 16px;
      position: relative;
      cursor: pointer;
      .project-preview-name {
        width: calc(100% - 40px);
        height: 40px;
        position: relative;
        box-sizing: content-box;
        background: #E7EBF2;
        border-radius: 4px;
        font-size: 16px;
        color: #424242;
        line-height: 40px;
        padding-left: 8px;
        margin-bottom: 14px;
        .body-preview-next {
          position: absolute;
          top: 0;
          right: 0;
          width: 120px;
          height: 40px;
          background: #4284F5;
          border-radius: 4px;
          font-size: 16px;
          color: #FFFFFF;
          text-align: center;
          cursor: pointer;
        }
      }
      .project-preview-message {
        .body-preview-message {
          font-size: 14px;
          color: #A4A4A4;
          margin-left: 8px;
          margin-top: 0;
        }
      }
      .project-preview-info {
        width: 100%;
        height: 40px;
        position: relative;
        line-height: 40px;
        .preview-type {
            .suggestChange {
                color: #F5282D;
            }
            .systemLoad {
                color: #4284F5;
                margin-left: 48px;
            }
        }
        .preview-opeate{
          right: 5px;
          color: #424242;
          font-size: 14px;
          display:inline-block;
          position: absolute;
          > span{
            &:nth-child(2){
              margin-left: 15px;
            }
          }
          .data-input {
            width: 45px;
            height: 20px;
            line-height: 20px;
            outline: none;
            background: #FFFFFF;
            font-size: 12px;
            border: 1px solid #4284F5;
            border-radius: 4px;
            text-align: center;
          }
        }
      }
    }
    .preview-body {
      width: 100%;
      padding: 6px 0px 0px 15px;
      box-sizing: border-box;
      height: calc(100% - 50px);
      overflow: hidden;
    }
  }
  .save_project {
    padding: 20px;
    .dc-alert-header {
      text-align: left;
      padding: 0;
      opacity: 0.7;
      .icon-db_plus {
        color: #A4A4A4;
        cursor: pointer;
        position: absolute;
        right: 18px;
        transform: rotate(45deg);
        display: inline-block;
      }
    }
    .dc-alert-message {
      width: 360px;
      height: 86px;
      margin: 10px 0;
      background: #e2e2e2;
      border-radius: 4px;
      padding: 16px 19px;
      box-sizing: border-box;
      word-break: break-all;
      color: #68686e;
      p {
        margin: 0;
      }
    }
    .dc-alert-footer {
      display: flex;
      justify-content: space-around;
      div {
        font-size: 16px;
        cursor: pointer;
      }
      .dc-save-confirm {
        color: #4284F5;
      }
      .dc-save-cancel{
        color: #A4A4A4;
      }
    }
  }

  .commit-data {
    padding: 20px;
    .dc-alert-header {
      text-align: left;
      padding: 0;
      opacity: 0.7;
      .icon-db_plus {
        color: #A4A4A4;
        cursor: pointer;
        position: absolute;
        right: 18px;
        transform: rotate(45deg);
        display: inline-block;
      }
    }
    .alert-tip {
      width: 420px;
      height: 88px;
      display: flex;
      align-items: center;
      background: #E7EBF2;
      border-radius: 4px;
      margin: 12px auto;
      font-size: 16px;
      color: #424242;
      padding: 0 20px;
      box-sizing: border-box;
    }
    .dc-alert-footer {
      display: flex;
      justify-content: space-around;
      div {
        font-size: 16px;
        cursor: pointer;
      }
      .dc-save-confirm {
        color: #4284F5;
      }
      .dc-save-cancel{
        color: #A4A4A4;
      }
    }
  }

  .show-alldata {
    .all-data-tip {
      text-align: center;
      padding: 20px 100px!important;
    }
    .dc-alser-footer {
      padding: 20px 0!important;
    }
  }

  .loading-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .loading-wait {
      font-size: 14px;
      color: #000000;
    }
    .loading-return {
      font-size: 14px;
      color: #424242;
      margin: 0;
    }
    .loading-button {
      width: 120px;
      height: 40px;
      background: #4284F5;
      border-radius: 4px;
      font-size: 16px;
      color: #FFFFFF;
      line-height: 40px;
      margin-top: 28px;
    }
  }

}

</style>
