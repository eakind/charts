<template>
  <div class="dc-create-project-file">
    <div class="project-file-header">
      <span class="body-title">{{ $t("message.project_name") }}</span>
      <div class="body-name" :title="projectName">{{ projectName }}</div>
      <div class="file-nextstep" @click="fileNextstep">
        {{ $t("message.next_step") }}
      </div>
    </div>
    <div class="project-file-body">
      <div class="content-body-left">
        <span class="body-title add-file">{{ $t("message.add_files") }}</span>
        <create-file-content></create-file-content>
      </div>
      <div class="content-body-right" v-if="selectUpload !== 2">
        <span class="right-title">{{ $t("message.added_file") }}</span>
        <span
          class="right-tip"
          v-if="successFileList.length === 0 && faileFileList.length === 0"
          >{{ $t("message.no_file") }}</span
        >
        <div class="right-list" v-else>
          <div
            class="right-list-item"
            v-for="(item, index) in successFileList"
            :key="index"
          >
            <span
              class="iconfont icon-db_plus"
              @click="delFile(item, index, true)"
            ></span>
            <span class="item-filename" :title="item.fileName">{{
              item.fileName
            }}</span>
            <span class="faile-tip" v-if="item.code !== 0">{{
              $t(`backend[${item.code}]`)
            }}</span>
          </div>
          <div
            class="right-list-item"
            v-for="(faileItem, faileIndex) in faileFileList"
            :key="faileIndex"
          >
            <span
              class="iconfont icon-db_plus faile-btn"
              @click="delFile(faileItem, faileIndex, false)"
              :key="faileIndex"
            ></span>
            <span class="item-filename">{{ faileItem.fileName }}</span>
            <span class="faile-tip">{{
              $t(`backend[${faileItem.code}]`)
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <dc-alert class="" v-if="delFlag">
      <div class="dc-alert-header"></div>
      <div class="dc-alert-body">
        {{ $t("message.del_tip") }}
      </div>
      <div class="dc-alert-footer">
        <button class="dc-alert-confirm" @click="confirmDel">
          {{ $t("message.confirm") }}
        </button>
        <button class="dc-alert-cancel" @click="cancelDel">
          {{ $t("message.cancel") }}
        </button>
      </div>
    </dc-alert>

    <div class="project-file-tip" v-if="showTip">
      <svg class="icon svg-icon" aria-hidden="true">
        <use xlink:href="#icon-db10_noticeError"></use>
      </svg>
      <span class="input-tip">{{ allownextTip }}</span>
      <span class="iconfont icon-db_plus" @click="closeTip"></span>
    </div>
  </div>
</template>

<script>
import { get, post } from '@/api/server';
import CreateFileContent from './createProjectFile/createFileContent.vue';
import DcAlert from '@/components/dcalert/dcAlert';
import { mapState, mapMutations } from 'vuex';
export default {
  components: {
    CreateFileContent,
    DcAlert,
  },
  data () {
    return {
      delFlag: false,
      delObj: null,
      showTip: false,
      allownextTip: '',
    };
  },
  computed: {
    ...mapState('project', ['projectName', 'projectId', 'faileFileList', 'settingsId', 'selectUpload', 'successFileList'])
  },
  mounted () {
    this.setIsPreview(true); // 显示左边栏
    this.bus.$on('joinFile', () => {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.projectJoin(true);
      }, 300);
    });
  },
  destroyed () {
    this.bus.$off('joinFile');
  },
  methods: {
    ...mapMutations('project', [
      'setIsPreview',
      'setSuccessFileList',
    ]),
    delFile (item, index, flag) {
      this.delFlag = true;
      this.delObj = item;
      this.delObj.index = index;
      this.delObj.flag = flag;
    },
    cancelDel () {
      this.delFlag = false;
      this.delObj = null;
    },
    confirmDel () {
      if (this.delObj.flag) {
        this.delProjectFile(this.delObj, this.delObj.index);
      } else {
        if (this.delObj.fileId) {
          this.delProjectFile(this.delObj, this.delObj.index, true);
        } else {
          this.successFileList.splice(this.delObj.index, 1);
          this.delFlag = false;
          this.delObj = null;
        }
      }
    },
    async delProjectFile (item, index, flag) {
      let param = {
        project_id: this.projectId,
        file_id: item.fileId,
      };
      if (item.code === 0) {
        let res = await post('delProFile', param);
        this.getList();
        if (res.code === 0) {
          this.bus.$emit('getPreviewType');
        }
      }
      this.successFileList.splice(index, 1);
      this.delFlag = false;
      this.delObj = null;
    },
    async projectJoin (flag) {
      let arr = [];
      for (let i = 0; i < this.successFileList.length; i++) {
        arr.push({
          file_id: this.successFileList[i].fileId,
        });
      }
      let param = {
        settings_id: this.settingsId,
        file_list: arr,
        project_id: this.projectId,
      };
      if (!this.settingsId) return;
      let res = await post('projectJoin', param);
      if (res.code === 0) {
        this.getList();
      }
    },
    async getList () {
      let param = {
        project_id: this.projectId,
      };
      if (!this.projectId) return;
      let res = await get('fileList', param);
      if (res.code === 0) {
        this.setSuccessFileList([]);
        for (let i = 0; i < res.file_list.length; i++) {
          if (!res.file_list[i].file_name) continue;
          this.successFileList.push({
            fileName: res.file_list[i].file_name,
            fileId: res.file_list[i].file_id,
            msg: res.file_list[i].status_msg,
            code: res.file_list[i].status_code,
          });
        }
      }
      this.setSuccessFileList(this.successFileList);
    },
    fileNextstep: function () {
      if (this.selectUpload === 2) {
        this.bus.$emit('dbPreview');
      } else {
        if (
          this.successFileList.length === 0 &&
          this.faileFileList.length === 0
        ) {
          this.allownextTip = this.$t('message.upload_file_tip');
          this.showTip = true;
          setTimeout(() => {
            this.showTip = false;
          }, 1000);
        } else {
          let fileCorrect = this.successFileList.some((item, index) => {
            return item.code !== 0;
          });
          if (fileCorrect) {
            this.allownextTip = this.$t('message.upload_wrong');
            this.showTip = true;
            setTimeout(() => {
              this.showTip = false;
            }, 1000);
          } else {
            this.$router.push({
              name: 'createprojectpreview',
            });
          }
        }
      }
    },
    closeTip () {
      this.showTip = false;
    },
  },
};
</script>

<style scoped lang="scss">
.dc-create-project-file {
  width: 100%;
  padding-left: 24px;
  padding-top: 16px;
  background: #FFFFFF;
  border-radius: 4px;
  margin: 0 8px 8px;
  .project-file-header {
    position: relative;
    .body-title {
      font-size: 12px;
      color: #424242;
    }
    .body-name {
      width: 400px;
      border: none;
      outline: none;
      font-size: 20px;
      color: #424242;
      height: 30px;
      line-height: 30px;
      padding: 5px;
      // border-bottom: 2px solid #4284f5;
      margin-bottom: 16px;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .file-nextstep {
      width: 120px;
      height: 40px;
      position: absolute;
      top: 0;
      right: 40px;
      background: #4284F5;
      border-radius: 4px;
      font-size: 16px;
      color: #FFFFFF;
      text-align: center;
      line-height: 40px;
      cursor: pointer;
    }
  }
  .project-file-body {
    display: flex;
    height: calc(100% - 70px);
    .content-body-left {
      width: 75%;
      // flex: 1;
      // width: 851px;
      // @media only screen and (max-width: 1366px) {
      //   width: 805px;
      // }
      position: relative;
      .add-file {
        font-size: 12px;
        color: #424242;
        margin-top: 20px;
      }
    }
    .content-body-right {
      flex: 1;
      height: 100%;
      border-left: 1px solid #E1E1E1;
      .right-title {
        font-size: 12px;
        color: #424242;
        display: block;
        padding: 5px 40px;
      }
      .right-tip {
        font-size: 12px;
        color: #a4a4a4;
        padding: 0px 40px;
        display: block;
      }
      .right-list {
        height: calc(100% - 50px);
        overflow-x: hidden;
        overflow-y: auto;
        .right-list-item {
          padding: 2px 15px;
          position: relative;
          .item-filename {
            position: absolute;
            display: inline-block;
            word-break: break-word;
            @include ellipsis;
            width: 220px;
          }
          .iconfont {
            color: #4284F5;
            cursor: pointer;
            margin: 0px 10px 0px 0px;
            transform: rotate(45deg);
            display: inline-block;
          }
          .faile-btn {
            color: #F5282D;
          }
          .faile-tip {
            font-size: 12px;
            color: #F5282D;
            padding: 3px 0px 3px 25px;
            display: block;
          }
        }
      }
    }
  }
  .dc-alert-body {
    text-align: center;
    padding: 20px 40px !important;
  }
  .dc-alert-footer {
    padding: 20px 40px !important;
  }
  .project-file-tip {
    width: 240px;
    height: 36px;
    background: #FFE8E8;
    border-radius: 4px;
    font-size: 12px;
    color: #424242;
    letter-spacing: 0;
    position: fixed;
    top: 70px;
    left: 50%;
    transform: translateX(-50%);
    line-height: 36px;
    .icon {
      width: 16px;
      height: 36px;
      fill: #e6585c;
      vertical-align: middle;
      margin: 0 10px 2px;
    }
    .icon-db_plus {
      color: #A4A4A4;
      cursor: pointer;
      position: absolute;
      right: 12px;
      transform: rotate(45deg);
      display: inline-block;
    }
  }
}
</style>
