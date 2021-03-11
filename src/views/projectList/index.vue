<template>
  <div class="project-list" v-infinite-scroll="scrollProcess">
    <template v-for="(lItem,lIdx) in list">
      <div :key="lIdx" v-if="list.length !== 0"
           class="project-item" :class="!lItem.showUpdate && showUpdating ? 'shouldOpacity' : ''">
        <div :key="lIdx" class="otherproject"
             v-mask="{flag:lItem.showUpdate,updateTime:$t('projectList.last_update')+lItem.update_time,updateObj,cancelFun,id:lItem.project_id,replace,append,manual}">
          <div class="list-top-box">
            <span class="projectitem_name"
                v-if="!lItem.showModify">
              <span class="name-txt">{{lItem.project_name}}</span>
            </span>
            <span class="projectitem_edit_name" v-else>
              <input v-model="projectName"
                    :placeholder="$t('projectList.input_name_tip')">
              <button @click="sureModifyName(lItem,lIdx)">{{$t('projectList.confirm')}}</button>
              <button @click="lItem.showModify=false;projectName=''">{{$t('projectList.cancel')}}</button>
            </span>
            <div class="item-setting" v-if="String(lItem.permission).toLocaleLowerCase() === 'o'" @click="projectSetting(lItem,lIdx)">
              <div class="iconfont icon-db10_setting">
              </div>
            </div>
            <div class="update-data">
              <span class="projectitem-filename"
                    :title="lItem.file_name">{{lItem.file_name}}</span>
              <span class="file-name-tip">{{$t('projectList.etc')}} {{lItem.file_num}} {{$t('projectList.unit')}}</span>
            </div>
            <div class="bottom">
              <div class="time-info">
                {{$t('projectList.built_in')}} {{lItem.insert_time}}
              </div>
            </div>
          </div>
          <div class="update-operate" :class="(lItem.status !== 'UPLOADED' && lItem.status !== 'REPLACE' && lItem.status !== 'APPEND' || lItem.permission.toLocaleLowerCase() !== 'o') ? 'notupdate' : ''" @click.stop="updateClick(lItem)">
            <div class="update" v-if="lItem.permission.toLocaleLowerCase() ==='o'">
              <span class="iconfont icon-db_refresh"></span>
              <single-span-create :items="lItem"></single-span-create>
            </div>
            <div class="update-tip">
              <div v-if="lItem.status === 'REPLACING' || lItem.status === 'APPENDING'">{{$t('projectList.updating_tip')}}</div>
              <div v-if="lItem.status === 'ANALYZING' || lItem.status === 'UPLOADING'">{{$t('projectList.creating_tip')}}</div>
              <div v-if="lItem.status === 'UPLOADED' || lItem.status === 'REPLACE' || lItem.status === 'APPEND'">{{$t('projectList.last_update')}}: {{lItem.update_time}}</div>
            </div>
            <span class="iconfont icon-db_arrow" v-if="(lItem.status === 'UPLOADED' || lItem.status === 'REPLACE' || lItem.status === 'APPEND') && lItem.permission.toLocaleLowerCase() === 'o'"></span>
          </div>
          <div class="enter-project" @click.stop="editorProject(lItem)">
            <div class="enter" v-if="lItem.status === 'REPLACE' || lItem.status === 'APPEND'">{{$t('projectList.enter_project')}}</div>
            <div class="updata-and-enter" v-if="lItem.status === 'REPLACING' || lItem.status === 'APPENDING'">{{$t('projectList.update_enter')}}</div>
            <div class="create-and-enter" v-if="lItem.status === 'ANALYZING' || lItem.status === 'UPLOADING'">{{$t('projectList.create_enter')}}</div>
            <div class="enter" v-if="!lItem.showModify && lItem.status === 'UPLOADED'">{{$t('projectList.enter_project')}}</div>
          </div>
          <div class="top-circle"></div>
          <div class="right-circle"></div>
        </div>
        <div class="item-setting-list" v-if="showProjectSetting && curSettingIndex === lIdx" v-click-out="hideSetting">
          <div class="setting-row" @click="shareProject(lItem)">分享项目</div>
          <div class="setting-row" @click="memberFunc(lItem)" v-if='roleType === "CREATOR" && lItem.permission.toLocaleLowerCase() ==="o"'>{{$t('projectList.member_management')}}</div>
          <div class="setting-row" @click.stop="modifyFunc(lItem)">{{$t('projectList.change_name')}}</div>
          <div class="setting-row" v-if="false">{{$t('projectList.export_project')}}</div>
          <div class="setting-row" @click="delHandler(lItem)" v-if='roleType === "CREATOR" && lItem.permission.toLocaleLowerCase() ==="o"'>{{$t('projectList.delete_project')}}</div>
        </div>
      </div>
    </template>
    <blank :content="blankContent" :blankIcon="blankIcon" v-if="list.length === 0" @on-clear="clear"></blank>
    <div class="dc-dialog-box">
      <dc-dialog
      :dislogTitle="$t('projectList.delete_project')"
      contentAlign="left"
      v-if="isAlert"
      :dialogVisible="isAlert"
      @dialogCancel="delCancel"
      @dialogSure="delConfirm">
      {{$t('projectList.delete_project_tip')}}
      </dc-dialog>
    </div>
    <div class="dc-dialog-box">
      <dc-dialog
      :dislogTitle="$t('projectList.change_project_name')"
      contentAlign="left"
      v-if="showChangenameAlert"
      :dialogVisible="showChangenameAlert"
      @dialogCancel="showChangenameAlert=false;projectName=''"
      @dialogSure="sureModifyName(curSettingItem,curSettingIndex)">
        <div class="input-box">
          <div class="original">原名称：{{curSettingItem.project_name}}</div>
          <div class="input">
            <input v-model="projectName" :placeholder="$t('projectList.input_new_name')">
          </div>
        </div>
      </dc-dialog>
    </div>
    <share-project :shareFlag="shareFlag" :projectDetail="projectDetail" @on-close="closeHandeler"></share-project>
  </div>
</template>
<script>
import DcDialog from '@/components/dcDialog/dcDialog.vue';
import ShareProject from './sharePoject.vue';
import blank from './blank.vue';
import { mapMutations } from 'vuex';
import { jsxMix } from './mixins/jsxMix';
import { updateProject } from './mixins/update';
import { list } from './mixins/list';
import { get } from '@/api/server';
export default {
  mixins: [jsxMix, updateProject, list],
  components: { DcDialog, blank, ShareProject },
  props: {
    roleType: {
      type: String,
      default: ''
    },
    searchProjectName: {
      type: String
    },
    direction: {
      type: String
    },
    reload: {
      type: Boolean
    }
  },
  data () {
    return {
      updateFlag: false,
      projectName: '',
      isAlert: false,
      showProjectSetting: false,
      curSettingItem: null,
      curSettingIndex: -1,
      showChangenameAlert: false,
      shareFlag: false,
      projectDetail: {}
    };
  },
  computed: {
    showUpdating () {
      return this.list.some((item, index) => {
        return item.showUpdate === true;
      });
    }
  },
  watch: {
    reload () {
      this.getList();
    }
  },
  mounted () {
    this.getList();
  },
  methods: {
    ...mapMutations('project', ['setProjectId', 'setProjectName', 'setProjectStatus']),

    addProject (type) {
      if (type === 'hand') {
        this.setProjectStatus('UPLOADING');
        this.$router.push({ path: '/createProject' });
      } else {
        // 套用模板
        this.$router.push({ path: '/useTemplate' });
      }
    },

    async editorProject (item) {
      if (item.status === 'REPLACEING' || item.status === 'APPENDING') return;
      this.setProjectId(item.project_id);
      this.setProjectName(item.project_name);
      switch (item.status) {
        case 'ANALYZING':
        case 'UPLOADING':
        case 'APPEND':
        case 'REPLACE':
        case 'APPENDING':
        case 'REPLACING':
          this.$router.push({ path: '/createproject/createprojectfile' });
          break;
        default:
          var param = {
            project_id: item.project_id,
            offset: 0,
            limit: 100
          };
          var res = await get('canvasList', param);
          if (!res.total_num) {
            this.$router.push({ path: '/createproject/createprojecttype' });
          } else {
            this.$router.push({ path: '/drawingboard' });
          }
          break;
      }
    },
    projectSetting (item, index) {
      this.curSettingItem = item;
      this.curSettingIndex = index;
      this.showProjectSetting = true;
    },
    hideSetting () {
      this.showProjectSetting = false;
    },
    clearSettingData () {
      this.curSettingItem = null;
      this.curSettingIndex = -1;
    },
    memberFunc (item) {
      this.$emit('edit', item);
    },
    modifyFunc () {
      this.showChangenameAlert = true;
    },
    updateClick (item) {
      if (item.status === 'UPLOADED' || item.status === 'REPLACE' || item.status === 'APPEND') {
        this.setProjectId(item.project_id);
        this.setProjectName(item.project_name);
        item.showUpdate = true;
      }
    },
    clear () {
      this.$emit('on-clear');
    },
    shareProject (list) {
      this.projectDetail = list;
      this.shareFlag = true;
    },
    closeHandeler () {
      this.shareFlag = false;
    }
  }
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.project-list {
    width: 100%;
    height: 100%;
}
.project-item {
  width: 376px;
  box-sizing: border-box;
  margin-bottom: 24px;
  margin-right: 24px;
  border-radius: 10px;
  position: relative;
  box-shadow: 0 4px 12px 0 rgba(196,196,196,0.20);
  border: 2px solid transparent;
  &:hover {
    border-radius: 5px;
    border: 2px solid #4284f5;
  }

  .otherproject {
    background-color: white;
    border-radius: 10px;
    height: 238px; //250px;
    padding: 8px 10px;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    .list-top-box {
      height: 120px;
    }
    .notupdate {
      pointer-events: none;
      background: #f2f2f2 !important;
    }

    .projectitem_name {
      font-size: 24px;
      font-weight: bold;
      display: block;
      font-size: 18px;
      color: #424242;
      padding-left: 8px;
      .name-txt {
        max-width: 250px;
        cursor: text;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
      .iconfont {
        cursor: pointer;
        color: #a4a4a4;
        position: relative;
        top: -8px;
        left: 4px;
      }
    }
    .projectitem_edit_name {
      font-size: 18px;
      height: 35px;
      font-weight: bold;
      display: block;
      background: #ffffff;
      box-shadow: inset 0 0 4px 0 rgba(66, 132, 245, 0.5);
      border-radius: 4px;
      input {
        height: 90%;
        padding: 0px 5px;
        width: 60%;
        box-sizing: border-box;
        outline: none;
        border: none;
        font-size: 14px;
        margin: 2px 0px 0px 2px;
      }
      > button {
        border: none;
        outline: none;
        margin: 0px 5px;
        padding: 0px;
        font-size: 14px;
        background-color: white;
        cursor: pointer;
        color: #4284f5;
        &:last-child {
          color: #424242;
        }
      }
    }
    .item-setting {
      display: inline-block;
      right: 12px;
      top: 8px;
      width: 32px;
      height: 32px;
      text-align: center;
      line-height: 32px;
      cursor: pointer;
      position: absolute;
      .iconfont {
        font-size: 18px;
      }
    }
    .update-data {
      height: 25px;
      line-height:25px;
      font-size: 14px;
      color: #A4A4A4;
      padding-left: 8px;
      margin-top: 10px;
      .update {
        display: inline-block;
        .iconfont {
          color: #4284f5;
          margin-right: 5px;
        }
      }
    }
    .update-operate {
      width: 100%;
      height: 60px;
      background: #FBFCFF;
      border-radius: 4px;
      padding: 6px;
      position: relative;
      cursor: pointer;
      .update {
        font-size: 14px;
        color: #666666;
        cursor: pointer;
        display: inline-block;
        .iconfont {
          color: #03B98C;
          margin-right: 5px;
        }
      }
      .update-tip {
        font-size: 12px;
        color: #A4A4A4;
        margin-top: 4px;
      }
      .icon-db_arrow {
        position: absolute;
        top: 50%;
        right: 16px;
        transform: translateY(-50%);
      }
    }
    .enter-project {
      width: 100%;
      height: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
      .enter {
        width: 120px;
        height: 32px;
        background: #4284F5;
        border-radius: 4px;
        font-size: 16px;
        color: #FFFFFF;
        text-align: center;
        line-height: 32px;
        cursor: pointer;
      }
      .updata-and-enter, .create-and-enter {
        font-size: 14px;
        color: #A4A4A4;
        text-align: center;
        cursor: pointer;
      }
    }
  }
  &.shouldOpacity {
    opacity: 0.5;
  }
  .item-setting-list {
    width: 120px;
    position: absolute;
    top: 42px;
    right: -32px;
    background: #424242;
    font-size: 14px;
    color: #FFFFFF;
    text-align: center;
    z-index: 99;
    border-radius: 4px;
    .setting-row {
      width: 120px;
      height: 36px;
      text-align: center;
      line-height: 36px;
      cursor: pointer;
    }
    &::before {
      content: "";
      display: inline-block;
      width: 0;
      height: 0;
      border-width: 6px;
      border-style: solid;
      border-color: transparent #424242 transparent transparent;
      transform: rotate(90deg);
      position: absolute;
      top: -12px;
      left: 54px;
    }
  }
  .top-circle {
    position: absolute;
    top: 0;
    left: 0;
    width: 64px;
    height: 32px;
    background-color: rgba($color: #03B98C, $alpha: 0.1);
    border-radius: 0px 0px 64px 64px;
  }
  .right-circle {
    position: absolute;
    top: -2px;
    left: 0;
    width: 32px;
    height: 64px;
    background-color: rgba($color: #4284F5, $alpha: 0.1);
    border-radius: 0px 64px 64px 0px;
  }
}
.projectitem-filename {
  max-width: 180px;
  vertical-align: bottom;
  @include ellipsis;
  display: inline-block;
  margin-right: 6px;
}
.none-pointer {
  pointer-events: none;
}
</style>
<style lang="scss" >
@import './style/index';
</style>
