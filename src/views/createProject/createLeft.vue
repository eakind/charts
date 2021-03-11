<template>
  <div class="dc-create-left" v-if="isPreview">
    <div class="back-box">
      <span class="back-btn" @click="backHandler">{{
        $t('message.return_back')
      }}</span>
    </div>
    <div class="oldfile-box">
      <span class="create-left-title">{{ $t('message.add_old_file') }}</span>
      <div class="create-left-header" v-if="!searchFlag">
        <div @click="getFileList('NAME')">
          <span class="txt">{{ $t('message.file_name') }}</span>
          <span class="iconfont icon-db_sort"></span>
        </div>
        <div @click="getFileList('DATE')">
          <span class="txt">{{ $t('message.create_old_file_time') }}</span>
          <span class="iconfont icon-db_sort"></span>
        </div>
        <div @click="searchFlag = !searchFlag">
          <span class="txt">{{ $t('message.search_file') }}</span>
          <span class="iconfont icon-db_magify"></span>
        </div>
      </div>
      <div class="create-left-header" v-else>
        <span class="left-header-input">
          <input
            v-model="searchInput"
            :placeholder="$t('message.search_input_tip')"
            @blur="blurHandler"
          />
          <span
            class="iconfont icon-db_plus"
            @click="
              searchInput = '';
              searchFlag = !searchFlag;
            "
            v-if="searchInput"
          ></span>
          <span class="iconfont icon-db_magify" v-else></span>
        </span>
      </div>
      <div class="create-left-body">
        <div class="left-body-list">
          <div
            class="body-list-item"
            @click="addFileHandler(item, index)"
            v-for="(item, index) in fileList"
            :key="index"
            @mouseover.stop="mouseEnter(item, index, $event)"
            @mouseout.stop="mouseOut(item, index, $event)"
          >
            <span
              class="radius"
              :class="checkHasFile(item, index) ? 'radius-check' : ''"
            ></span>
            <span class="file-name" :title="item.file_name">{{
              item.file_name
            }}</span>
            <span
              class="item-del-btn"
              v-if="!checkHasFile(item, index)"
              @click.stop="delFile(item, index)"
              >{{ $t('message.delete') }}</span
            >
          </div>
          <div class="list-item-tip" v-if="fileList.length === 0">
            {{ $t('message.no_file_tip') }}
          </div>
        </div>
      </div>

      <div
        class="create-left-tip"
        v-if="itemDetail"
        :style="{ top: itemDetail.top, left: itemDetail.left }"
      >
        <div class="triangle_tip"></div>
        {{ Math.ceil(itemDetail.file_size / 1024 / 1024) }}MB,
        {{ itemDetail.file_columns }}{{ $t('message.has_feature') }}，
        {{ itemDetail.file_rows }}{{ $t('message.line_record') }}
        <div>
          MD5: <span>{{ itemDetail.md5 }}</span>
        </div>
        <div>
          {{ $t('message.create_old_file_time') }}:<span>{{
            itemDetail.upload_time
          }}</span>
        </div>
      </div>

      <dc-alert class="dc-alert" v-if="showDel">
        <div class="dc-alert-header">
          {{ $t('message.del_tip') }}
        </div>
        <div class="dc-alert-footer">
          <button class="dc-alert-confirm" @click="deleteFiles">
            {{ $t('message.confirm') }}
          </button>
          <button
            class="dc-alert-cancel"
            @click="
              showDel = false;
              delObj = null;
            "
          >
            {{ $t('message.cancel') }}
          </button>
        </div>
      </dc-alert>

      <dc-alert class="save_project" v-if="showReturnAlert">
        <div class="dc-alert-header">
          <span>{{backListTip.title}}</span>
          <span class="iconfont icon-db_plus" @click="closeAlert"></span>
        </div>
        <div class="dc-alert-message">
          <p>{{ backListTip.keep_content }}</p>
        </div>
        <div class="dc-alert-footer">
          <div class="dc-save-confirm" @click="sureHandle">
            {{ backListTip.save_and_return }}
          </div>
          <div class="dc-save-cancel" @click="cancelHandle">
            {{ backListTip.only_return }}
          </div>
        </div>
      </dc-alert>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { get, post } from '@/api/server.js';
import DcAlert from '@/components/dcalert/dcAlert.vue';
export default {
  components: {
    DcAlert,
  },
  data () {
    return {
      itemDetail: null,
      searchFlag: false,
      searchInput: '',
      list: [],
      fileList: [],
      showDel: false,
      delObj: null,
      reverse: false,
      showReturnAlert: false,
    };
  },
  computed: {
    ...mapState('project', ['isPreview', 'successFileList', 'faileFileList', 'settingsId', 'projectId', 'projectName', 'projectStatus', 'templateId']),
    backListTip () {
      let obj = {
        REPLACING: true,
        REPLACE: true,
        APPEND: true,
        APPENDING: true,
      };
      if (obj[this.projectStatus]) {
        return {
          title: '退出更新',
          keep_content: '返回项目列表将不保存本次更新数据，确定退出更新？',
          save_and_return: '确定',
          only_return: '取消',
        };
      } else {
        return {
          title: '返回项目列表',
          keep_content: this.$t('message.keep_content'),
          save_and_return: this.$t('message.save_and_return'),
          only_return: this.$t('message.only_return'),
        };
      }
    },
  },
  watch: {
    searchInput (val) {
      this.fileList = this.list.filter(
        (item) => item.file_name.indexOf(val) > -1
      );
    },
  },
  beforeCreate () {},
  created () {},
  beforeMount () {},
  mounted () {
    this.getFileList('NAME');
  },
  destroyed () {},
  methods: {
    ...mapMutations('project', [
      'setSuccessFileList',
      'setSuccessFileList',
      'setFaileFileList',
      'setProjectId',
      'setSettingsId',
    ]),
    addFileHandler (item, index) {
      if (this.projectId) {
        this.addProjectFile(item);
      } else {
        if (this.projectName) {
          this.createProject(item);
        } else {
          this.bus.$emit('tipName');
        }
      }
    },
    checkHasFile (item, index) {
      let arr = this.successFileList;
      for (let i = 0; i < arr.length; i++) {
        if (item.file_id === arr[i].fileId) {
          return true;
        }
      }
      return false;
    },
    backHandler () {
      // 更新数据跟新增数据返回项目列表时都需要提示
      let obj = {
        REPLACING: true,
        REPLACE: true,
        APPEND: true,
        APPENDING: true,
      };
      if (obj[this.projectStatus]) {
        this.showReturnAlert = true;
        return;
      }
      if (this.projectId && this.successFileList.length > 0) {
        this.showReturnAlert = true;
      } else {
        this.$router.push({ path: '/' });
      }
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
          project_id: this.projectId,
        };
        if (!this.projectId) return;
        this.$router.push({ path: '/' });
        let res = await post('exitProject', param);
        if (res.code === 0) {
          this.$router.push({ path: '/' });
        }
      } else {
        let param = {
          project_id: this.projectId,
        };
        await post('delProject', param);
        this.$router.push({ path: '/' });
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
    blurHandler () {
      if (this.searchInput === '') {
        this.searchFlag = false;
      }
    },
    mouseEnter (item, index, event) {
      this.itemDetail = item;
      this.itemDetail.index = index;
      this.itemDetail.top =
        event.target.getBoundingClientRect().top - 45 + 'px';
      this.itemDetail.left = 280 + 'px';
    },
    mouseOut (item, index, event) {
      this.itemDetail = null;
    },
    delFile (item, index) {
      this.showDel = true;
      this.delObj = item;
      this.delObj.index = index;
    },
    async getFileList (sort) {
      this.reverse = !this.reverse;
      let param = {
        offset: 0,
        limit: 100,
        order_by: sort,
        reverse: this.reverse,
        key: this.key,
      };
      let res = await get('myFile', param);
      if (res.code === 0) {
        this.fileList = JSON.parse(JSON.stringify(res.file_list));
        this.list = JSON.parse(JSON.stringify(res.file_list));
      }
    },
    async createProject (item, index) {
      let param = {
        project_name: this.projectName,
        project_type: 'BI',
      };
      if (this.templateId) {
        param.template_idx = this.templateId;
      }
      if (this.projectName.length > 64) return;
      let res = await post('create', param);
      if (res.code === 0) {
        this.setProjectId(res.project_id);
        this.addProjectFile(item);
      }
    },
    async addProjectFile (item) {
      let param = {
        project_id: this.projectId,
        file_id: item.file_id,
      };
      let csvFlag = false;
      let formatList = [
        '.csv',
        '.CSV',
        '.zip',
        '.ZIP',
        '.gz',
        '.GZ',
        '.xz',
        '.XZ',
        '.bz2',
        '.BZ2',
      ];
      for (let i = 0; i < formatList.length; i++) {
        if (item.file_name.includes(formatList[i])) {
          csvFlag = true;
        }
      }
      if (csvFlag) {
        if (this.settingsId) {
          param.settings_id = this.settingsId;
          this.addFile(item, param);
        } else {
          this.setting(item, param);
        }
      } else {
        if (this.settingsId) {
          param.settings_id = this.settingsId;
          this.addFile(item, param);
        } else {
          this.setting(item, param, true);
        }
      }
    },
    async setting (item, paramObj, flag) {
      let param = {
        project_id: this.projectId,
        file_type: 'csv',
        encoding: 'AUTO',
        seq: 'COMMA',
        wrap: false,
        quotechar: 'DOUBLE',
        thousands: false,
        startrows: 1,
        header: true,
      };
      if (flag) {
        param = {
          project_id: this.projectId,
          file_type: 'excel',
        };
      }
      let res = await post('setting', param);
      if (res.code === 0) {
        this.setSettingsId(res.settings_id);
        paramObj.settings_id = res.settings_id;
        this.addFile(item, paramObj);
      }
    },
    async addFile (item, param) {
      this.bus.$emit('showFullLoading', true);
      let res = await post('addProjectFile', param);
      this.bus.$emit('showFullLoading', false);
      if (res.code === 0) {
        this.getList();
      } else {
        this.successFileList.push({
          fileName: item.file_name,
          fileId: item.file_id,
          msg: res.msg,
          code: res.code,
        });
      }
    },
    async getList () {
      let param = {
        project_id: this.projectId,
      };
      if (!this.projectId) return;
      // this.setSuccessFileList([]);
      let successFileIdList = this.successFileList.map((item) => {
        return item.fileId;
      });
      this.setFaileFileList([]);
      let res = await get('fileList', param);
      if (res.code === 0) {
        for (let i = 0; i < res.file_list.length; i++) {
          if (successFileIdList.indexOf(res.file_list[i].file_id) === -1) {
            this.successFileList.push({
              fileName: res.file_list[i].file_name,
              fileId: res.file_list[i].file_id,
              msg: res.file_list[i].status_msg,
              code: res.file_list[i].status_code,
            });
          }
        }
        this.setSuccessFileList(this.successFileList);
        if (this.settingsId) {
          this.bus.$emit('joinFile');
        }
      }
    },
    async deleteFiles () {
      if (!this.delObj) return;
      let param = {
        file_list: [this.delObj.file_id],
      };
      let res = await post('deleteFiles', param);
      this.showDel = false;
      if (res.code === 0) {
        this.fileList.splice(this.delObj.index, 1);
        this.list.splice(this.delObj.index, 1);
        this.delObj = null;
      }
    },
    closeAlert () {
      this.showReturnAlert = false;
    },
  },
};
</script>

<style scoped lang="scss">
.dc-create-left {
  background: #424242;
  width: 300px;
  box-sizing: content-box;
  padding: 10px;
  box-shadow: -2px 0 4px 0 rgba(0, 0, 0, 0.2);
  .back-btn {
    font-size: 16px;
    color: white;
    margin: 10px 0px;
    display: block;
    width: 280px;
    cursor: pointer;
    padding: 0px 20px;
    box-sizing: border-box;
    &::before {
      content: '';
      height: 10px;
      width: 10px;
      border-top: 2px solid white;
      border-left: 2px solid white;
      transform: rotate(-45deg);
      display: inline-block;
    }
  }
  .oldfile-box {
    height: 100%;
  }
  .create-left-title {
    font-size: 16px;
    color: white;
    padding: 10px 35px;
    display: block;
  }
  .create-left-header {
    display: flex;
    padding: 0px 0px 30px 35px;
    > div {
      font-size: 16px;
      color: white;
      cursor: pointer;
      margin-right: 3px;
      padding-right: 3px;
      height: 15px;
      border-right: 1px solid white;
      &:nth-child(2) {
        padding-right: 6px;
      }
      &:last-child {
        border-right: none;
      }
      > span {
        top: -2px;
        position: relative;
      }
      .icon-db_magify {
        margin-left: 3px;
      }
      .iconfont {
        font-size: 14px;
      }
    }
    .left-header-input {
      padding: 0px;
      display: block;
      border-radius: 4px;
      width: 225px;
      background-color: #222222 !important;
      > input {
        height: 26px;
        line-height: 26px;
        outline: none;
        font-size: 16px;
        color: white;
        border: none;
        width: calc(100% - 25px);
        padding: 0px 3px;
        background-color: transparent;
      }
      .iconfont {
        font-size: 16px;
        color: white;
        top: 3px;
        position: relative;
        display: inline-block;
      }
      .icon-db_plus {
        transform: rotate(45deg);
      }
    }
  }
  .create-left-body {
    height: calc(100% - 100px);
    .left-body-list {
      height: calc(100% - 20px);
      overflow-x: hidden;
      overflow-y: auto;
      padding: 5px 0px;
      .body-list-item {
        padding: 5px 0px 10px 10px;
        display: flex;
        width: 100%;
        font-size: 16px;
        color: white;
        cursor: pointer;
        box-sizing: border-box;
        &:hover {
          box-shadow: -1px 0 4px 0 #f59e28;
        }
        span {
          display: inline-block;
        }
        .radius {
          width: 13px;
          height: 13px;
          margin: 3px 6px;
          border-radius: 50%;
          display: inline-block;
          border: 1px solid #4284f5;
        }
        .radius-check {
          &::after {
            content: '';
            width: 10px;
            height: 6px;
            border-top: 1px solid #4284f5;
            border-right: 1px solid #4284f5;
            transform: rotate(130deg);
            display: inline-block;
            top: -11.8px;
            left: 1.3px;
            position: relative;
          }
        }
        .file-name {
          font-size: 14px;
          width: 200px;
          @include ellipsis;
        }
        .item-del-btn {
          font-size: 12px;
          color: #f59e28;
          text-align: center;
          top: 2px;
          position: relative;
        }
      }
      .list-item-tip {
        padding: 0px 35px;
        font-size: 12px;
        color: white;
        box-sizing: border-box;
      }
    }
  }
  .create-left-tip {
    display: inline-block;
    height: auto;
    color: white;
    padding: 10px 15px;
    border-radius: 5px;
    background-color: black;
    margin: 5px;
    position: fixed;
    z-index: 9999;
    .triangle_tip {
      display: inline-block;
      border-bottom: 12px solid black;
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      position: absolute;
      left: -12px;
      top: 50%;
      transform: translateY(-50%) rotate(-90deg);
    }
    div {
      padding: 3px 0px;
      span {
        font-size: 14px;
        top: 0px;
        position: relative;
      }
    }
  }
  .save_project {
    .dc-alert-header {
      text-align: left;
      padding: 0;
      opacity: 0.7;
      .icon-db_plus {
        color: #a4a4a4;
        cursor: pointer;
        position: absolute;
        right: 18px;
        transform: rotate(45deg);
        display: inline-block;
      }
    }
    .dc-alert-message {
      width: 390px;
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
        color: #4284f5;
      }
      .dc-save-cancel {
        color: #a4a4a4;
      }
    }
  }
}
.hide {
  animation: move 0.3s linear forwards;
}

.show {
  animation: back 0.3s linear forwards;
}

@keyframes back {
  0% {
    width: 0px;
  }
}

@keyframes move {
  100% {
    width: 0px;
  }
}
.dc-alert {
  padding: 20px;
  .dc-alert-header {
    padding: 20px;
  }
}
</style>
