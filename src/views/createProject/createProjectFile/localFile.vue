<template>
  <div class="local-file">
    <div class="local-file-header">
      <div class="select-file-type">
        {{$t('message.file_type_tip')}}
        <dc-radius :label="$t('message.csv_file')" :select="fileType==='csv'" @click.native="fileType='csv'"></dc-radius>
        <dc-radius :label="$t('message.excel_file')" :select="fileType==='excel'" :showBeta="true" @click.native="fileType='excel'"></dc-radius>
        <label class="select-file-btn" :class="selectFile ? 'select-active' : ''">
          {{$t('message.select_file')}}
          <input type="file" ref="inputFile" @change="handler" multiple="multiple" />
        </label>
      </div>
      <div class="set-file-format" v-if="fileType === 'csv'">
        <span class="file-format-title" :class="projectName ? '' : 'enable-active'" @click="finishHandler"><span v-show="!setFormatFlag">{{$t('message.set_format')}}</span><span v-show="setFormatFlag">{{$t('message.finish_set')}}</span></span>
        <span class="file-format-tip" v-show="!setFormatFlag">{{$t('message.set_all_file')}}</span>
        <set-format :formatObj="formatObj" @change="changeFormat" v-show="setFormatFlag"></set-format>
      </div>
    </div>
    <div class="local-file-body">
      <span class="body-title">{{$t('message.upload_queue')}}</span>
      <div class="file-body">
        <span class="file-body-tip" v-if="fileList.length === 0">{{$t('message.no_file')}}</span>
        <upload-item :fileList="fileList" @del="delUpload" @finish="uploadFinish" @upload="uploading" v-else></upload-item>
      </div>
    </div>
  </div>
</template>

<script>
import DcRadius from './localFile/dcRadius';
import SetFormat from './localFile/setFormat';
import UploadItem from './localFile/uploadItem';
import { post, get } from '@/api/server';
import { mapState, mapMutations } from 'vuex';
export default {
  components: {
    UploadItem,
    SetFormat,
    DcRadius
  },
  data () {
    return {
      fileType: 'csv',
      selectFile: false,
      setFormatFlag: false,
      formatObj: {
        encoding: 'AUTO',
        seq: 'COMMA',
        quotechar: 'DOUBLE',
        wrap: false,
        thousands: false,
        startrows: 1,
        header: true
      },
      fileList: [],
      file: [],
      progress: null,
      uploader: null,
      uploadType: 'text/csv'
    };
  },
  props: {
    format: {
      type: Object,
      default: () => {
        return null;
      }
    }
  },
  computed: {
    ...mapState('project', ['projectId', 'projectName', 'successFileList', 'faileFileList', 'settingsId'])
  },
  watch: {
    projectName (val) {
      this.selectFile = false;
      if (!val) return;
      if (val.length > 0) {
        this.selectFile = true;
      }
    },
    fileType (val) {
      this.$emit('changeType', this.formatObj, this.fileType);
    }
  },
  mounted () {
    this.getFileList();
    if (this.projectName) {
      this.selectFile = true;
    }
    let formatStr = sessionStorage.getItem('formatobj');
    if (formatStr) {
      let formatObj = JSON.parse(formatStr);
      this.fileType = formatObj.file_type;
      this.$set(this.formatObj, 'encoding', formatObj.encoding);
      this.$set(this.formatObj, 'seq', formatObj.seq);
      this.$set(this.formatObj, 'quotechar', formatObj.quotechar);
      this.$set(this.formatObj, 'wrap', formatObj.wrap);
      this.$set(this.formatObj, 'thousands', formatObj.thousands);
      this.$set(this.formatObj, 'startrows', formatObj.startrows);
      this.$set(this.formatObj, 'header', formatObj.header);
    }
  },
  methods: {
    ...mapMutations('project', ['setSuccessFileList', 'setFaileFileList', 'setSettingsId', 'setProjectStatus']),
    changeFormat (obj) {
      this.formatObj = obj;
      sessionStorage.setItem('formatobj', JSON.stringify(obj));
    },
    handler (event) {
      let list = event.target.files;
      for (let key in list) {
        if (typeof list[key] === 'object') {
          let obj = list[key];
          obj.uploadFlag = false;
          obj.precent = 0;
          this.fileList.push(obj);
        }
      }
    },
    uploading (item, index, flag) {
      this.changeProgress(item, index, 60);
    },
    delUpload (item, index) {
      this.fileList.splice(index, 1);
    },
    uploadFinish (item, index, res) {
      let obj = {};
      if (res.code !== 0) {
        obj.msg = res.msg;
        obj.code = res.code;
        obj.fileName = item.name;
        this.successFileList.push(obj);
        this.setSuccessFileList(this.successFileList);
      } else {
        if (this.settingsId) {
          this.getFileList(true, item);
          return;
        }
        let formatList = ['.csv', '.CSV', '.zip', '.ZIP', '.gz', '.GZ', '.xz', '.XZ', '.bz2', '.BZ2'];
        let csvFlag = false;
        for (let i = 0; i < formatList.length; i++) {
          if (item.name.includes(formatList[i])) {
            csvFlag = true;
          }
        }
        this.setting(csvFlag, null, item);
      }
      let file = this.$refs.inputFile;
      file.value = '';
    },
    changeProgress (item, index, time) {
      if (this.progress) {
        clearInterval(this.progress);
        this.progress = null;
      }
      this.progress = setInterval(() => {
        if (item.precent > 98) {
          clearInterval(this.progress);
          this.progress = null;
          this.fileList.splice(index, 1);
          return;
        }
        if (item.precent > 80 && item.precent < 90) {
          clearInterval(this.progress);
          this.progress = null;
          this.changeProgress(item, index, 40);
          return;
        }
        item.precent++;
        item.uploadFlag = true;
        this.fileList.splice(index, 1, item);
      }, time);
    },
    finishHandler () {
      this.setFormatFlag = !this.setFormatFlag;
      if (this.setFormatFlag) return;
      this.$emit('finish', this.formatObj, this.fileType);
    },
    async getFileList (flag, item) {
      let param = {
        project_id: this.projectId
      };
      if (!this.projectId) return;
      this.setSuccessFileList([]);
      this.setFaileFileList([]);
      let res = await get('fileList', param);
      if (res.code === 0) {
        for (let i = 0; i < res.file_list.length; i++) {
          if (!res.file_list[i].file_name) continue;
          this.successFileList.push({
            fileName: res.file_list[i].file_name,
            fileId: res.file_list[i].file_id,
            msg: res.file_list[i].status_msg,
            code: res.file_list[i].status_code
          });
        }
        this.setSuccessFileList(this.successFileList);
        if (this.settingsId && flag) {
          this.bus.$emit('joinFile');
        } else {
          if (!this.settingsId && flag) {
            let formatList = ['.csv', '.CSV', '.zip', '.ZIP', '.gz', '.GZ', '.xz', '.XZ', '.bz2', '.BZ2'];
            let csvFlag = false;
            for (let i = 0; i < formatList.length; i++) {
              if (item.name.includes(formatList[i])) {
                csvFlag = true;
              }
            }
            this.setting(csvFlag);
          } else {
            this.bus.$emit('joinFile');
          }
        }
      }
    },
    async setting (flag, type, item) {
      let param = {
        project_id: this.projectId,
        file_type: type || 'csv',
        encoding: 'AUTO',
        seq: 'COMMA',
        wrap: false,
        quotechar: 'DOUBLE',
        thousands: false,
        startrows: 1,
        header: true
      };
      if (!flag) {
        param = {
          project_id: this.projectId,
          file_type: 'excel'
        };
      }
      let res = await post('setting', param);
      if (res.code === 0) {
        this.setSettingsId(res.settings_id);
        if (item) {
          this.getFileList(flag, item);
          return;
        }
        this.bus.$emit('joinFile');
      }
    }
  }
};
</script>

<style scoped lang="scss">
.local-file{
  padding: 5px;
  .local-file-header{
    padding: 10px 15px;
    border: 1px solid #E1E1E1;
    border-radius: 4px;
    min-height: 50px;
    .select-file-type{
      padding: 0px 25px 12px;
      position: relative;
      font-size: 14px;
      border-bottom: 1px solid #e1e1e1;
      .select-file-btn{
        background-color: #d8d8d8;
        color: white;
        height: 26px;
        line-height: 26px;
        width: 90px;
        right: 15px;
        top: -2px;
        font-size: 14px;
        text-align: center;
        position: absolute;
        border-radius: 25px;
        pointer-events: none;
        display: inline-block;
        input{
          visibility: hidden;
          width: 100%;
          height: 100%;
          position: absolute;
        }
      }
      .select-active{
        pointer-events: auto;
        cursor: pointer;
        background-color: #4284F5;
      }
    }
    .set-file-format{
      text-align: center;
      .file-format-title{
        display: block;
        padding: 6px 10px 0px;
        color: #4284F5;
        cursor: pointer;
      }
      .enable-active{
        cursor: default;
        pointer-events: none;
      }
      .file-format-tip{
        color: #8c8c8c;
        font-size: 12px;
        font-weight: 100;
      }
    }
  }
  .local-file-body{
    padding: 5px 0px;
    .body-title{
      padding: 10px 0px;
      color: #424242;
      font-size: 12px;
      display: block;
    }
    .file-body{
      .file-body-tip{
        font-size: 12px;
        color: #a4a4a4;
        font-weight: 100;
      }
    }
  }
}
</style>
