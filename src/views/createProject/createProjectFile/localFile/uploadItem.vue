<template>
  <div class="dc-upload-item">
    <div class="upload-item"  v-for="(item, index) in fileList" :key="index">
      <div class="item-up">
        <div class="close-btn" v-show="!item.uploadFlag" @click="delFile(item, index)"><span class="iconfont icon-db_plus"></span></div>
        <div class="upload-txt" :title="item.name"><span>{{item.name}}</span></div>
        <div class="upload-size"><span>{{(item.size / 1024 / 1024).toFixed(2)}}M</span></div>
        <div class="upload-btn">
          <button @click="uploadHandler(item, index)">
            <span v-if="item.uploadFlag&&item.precent < 98">{{$t('message.uploading')}}</span>
            <span v-if="!item.uploadFlag && item.precent === 0">{{$t('message.begin_upload')}}</span>
            <span v-if="item.uploadFlag&&item.precent >98">{{$t('message.end_upload')}}</span>
          </button>
        </div>
      </div>
      <upload-bar v-if="item.uploadFlag" :precent="item.precent"></upload-bar>
    </div>
  </div>
</template>

<script>
import UploadBar from './uploadBar';
import { post } from '@/api/server';
import { mapState, mapMutations } from 'vuex';
// import { flatten } from '../../../../utils/utils';
export default {
  components: {
    UploadBar
  },
  data () {
    return {
      uploader: null,
      uploadFileList: [],
      clickFlag: false
    };
  },
  props: {
    fileList: {
      type: [Array, Object]
    }
  },
  computed: {
    ...mapState({
      projectId: state => state.project.projectId,
      projectName: state => state.project.projectName,
      settingsId: state => state.project.settingsId,
      templateId: state => state.project.templateId
    })
  },
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
  },
  mounted () {
  },
  destroyed () {
  },
  methods: {
    ...mapMutations('project', ['setProjectId']),
    uploadHandler (item, index) {
      if (this.projectName.length > 64) return;
      if (item.precent >= 99) return;
      if (!this.projectId) {
        this.$emit('upload', item, index, false);
        this.createProject(item, index);
      } else {
        this.$emit('upload', item, index, false);
        this.uploadFile(item, index);
      }
    },
    delFile (item, index) {
      this.$emit('del', item, index);
    },
    async createProject (item, index) {
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
      this.uploadFile(item, index);
    },
    async uploadFile (item, index) {
      if (this.clickFlag) return;
      this.clickFlag = true;
      let formData = new FormData();
      formData.append('project_id', this.projectId);
      if (this.settingsId) {
        formData.append('settings_id', this.settingsId);
      } else {
        formData.append('settings_id', 'auto');
      }
      formData.append('file', item);
      let res = await post('projectUploadFile', formData);
      this.clickFlag = false;
      if (res) {
        item.precent = 98;
        item.uploadFlag = true;
        this.$emit('finish', item, index, res);
        this.$emit('upload', item, index, true);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.dc-upload-item{
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  padding: 0px 20px;
  max-height: 300px;
  overflow-x: hidden;
  overflow-y: auto;
  .upload-item{
    overflow: hidden;
    &:nth-child(n + 2) {
      border-top: 1px solid #e1e1e1;
    }
    .item-up {
      height: 35px;
      line-height: 35px;
      display: flex;
      .close-btn{
        cursor: pointer;
        .iconfont {
          color: #4284F5;
          transform: rotate(45deg);
          display: inline-block;
        }
      }
      .upload-txt{
        color: #424242;
        padding: 0px 20px;
        flex: 1;
        width:calc(100% - 200px);
        @include ellipsis;
      }
      .upload-size{
        width: 80px;
      }
      .upload-btn{
        width: 100px;
        button{
          border: none;
          color: #4284F5;
          padding: 3px 15px;
          outline: none;
          background-color: transparent;
        }
      }
    }
  }
}
</style>
