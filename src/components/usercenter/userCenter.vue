<template>
  <div>
    <el-dialog :title="$t('message.member_management')" width="768px"  :visible="showDialog" :close-on-click-modal="false" @close="cancel">
      <div class="tips">权限规则：已有管理者角色的用户可赋予所有类型的权限。编辑者角色可赋予编辑者/浏览者权限。浏览者角色只能赋予浏览者权限。</div>
      <div class="project-name">项目名称：{{ projectName }}</div>
      <div class="content-box">
        <el-collapse v-model="activeNames" @change="handleChange">
          <template v-for="(item, index) in itemList">
            <el-collapse-item :name="item.value" :key="index">
              <template slot="title">
                <span class="tip">{{item.tip}}</span>
                {{item.title}}
                <span class="circle" :style="{background: item.color}"></span>
              </template>
              <div class="content">
                <div class="left">
                  <div class="btn" @click="chooseClick(item)">选择<i class="iconfont icon-db_plus"></i></div>
                </div>
                <div class="right">
                  <template v-for="(l, idx) in item.list">
                    <div :key="idx">— {{l.user_name}}</div>
                  </template>
                </div>
              </div>
            </el-collapse-item>
          </template>
        </el-collapse>
      </div>
    </el-dialog>
    <user-edit v-if="editFlag" :editUserList="myUserList" :itemDetail="itemDetail" @on-cancel="cancelHandler" @on-confirm="confirmHandler"></user-edit>
  </div>
</template>

<script>
import UserEdit from './userEdit.vue';
import { post } from '@/api/server.js';
import { mapState } from 'vuex';
export default {
  name: 'user-center',
  components: {
    UserEdit
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    userList: {
      type: Object,
      default: function () {
        return {
          allUsers: [],
          admin: [],
          editors: [],
          viewers: []
        };
      }
    },
    projectName: {
      type: String,
      default: ''
    },
    pointerEvents: {
      type: String,
      default: 'auto'
    },
    errorMsg: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      activeNames: ['admin', 'editors', 'viewers'],
      itemList: [{
        title: '管理者（单选）',
        tip: '指派项目成员，修改项目。',
        value: 'admin',
        color: '#4284F5',
        list: []
      }, {
        title: '编辑者（多选）',
        tip: '项目内编辑。',
        value: 'editors',
        color: '#03B98C',
        list: []
      }, {
        title: '浏览者（多选）',
        tip: '浏览项目内已创建的展板。',
        value: 'viewers',
        color: '#FACC14',
        list: []
      }],
      editFlag: false,
      isRefresh: false,
      cssStyle: {
        all: { width: 252, height: 488, background: '#E7EBF2', showTitle: false, showRemove: false },
        admin: { width: 320, height: 72, background: '#ECF3FE', showTitle: true, showRemove: true },
        editors: { width: 320, height: 200, background: '#EBFAF6', showTitle: true, showRemove: true },
        viewers: { width: 320, height: 200, background: '#FEF9E7', showTitle: true, showRemove: true }
      },
      userInfo: {
        admin: { color: '#4284F5', info: this.$i18n.t('message.new_creator_info'), type: this.$i18n.t('message.creator'), width: 232, height: 30, warning: this.$i18n.t('message.new_creator_warning'), warningStyle: { height: '32px' } },
        editors: { color: '#03B98C', info: this.$i18n.t('message.new_editor_info'), type: this.$i18n.t('message.editor'), width: 232, height: 30, warning: this.$i18n.t('message.new_editor_viewer_warning'), warningStyle: { height: '160px' } },
        viewers: { color: '#FACC14', info: this.$i18n.t('message.new_viewer_info'), type: this.$i18n.t('message.viewer'), width: 232, height: 30, warning: this.$i18n.t('message.new_editor_viewer_warning'), warningStyle: { height: '160px' } }
      },
      clickEnable: {
        all: true
      },
      myUserList: {
        admin: [],
        editors: [],
        viewers: []
      },
      selectedList: [],
      arrow_style: [0, 0, 0]
    };
  },
  computed: {
    ...mapState('project', ['projectId'])
  },
  watch: {
    selectedList (val) {
      let roles = this.selectedList.map(l => l.userType);

      if (roles.includes('VIEWER')) {
        this.arrow_style = [0, 0, 1];
      } else if (roles.includes('EXPLORER')) {
        this.arrow_style = [0, 1, 1];
      } else if (roles.includes('CREATOR')) {
        this.arrow_style = [1, 1, 1];
      } else {
        this.arrow_style = [0, 0, 0];
      }
    }
  },
  methods: {
    confirmed () {
      if (this.myUserList.admin.length === 0) return;
      this.$emit('addTo', this.myUserList);
    },
    cancel () {
      this.selectedList = [];
      this.$emit('cancel', this.isRefresh);
    },
    chooseClick (item) {
      this.itemDetail = item;
      this.editFlag = true;
    },
    async confirmHandler (obj) {
      let user_list = obj.admin
        .concat(obj.editors)
        .concat(obj.viewers)
        .map(u => {
          return {
            user_id: u.user_id,
            permission: u.permission
          };
        });
      let res = await post('getMember', {
        project_id: this.projectId,
        user_list: user_list
      });
      if (res) {
        this.itemList[0].list = obj.admin;
        this.itemList[1].list = obj.editors;
        this.itemList[2].list = obj.viewers;
        this.myUserList.allUsers.forEach(item => {
          if (user_list.find(_item => item.user_id === _item.user_id)) {
            item.disabled = true;
          } else {
            item.disabled = false;
          }
        });
        this.editFlag = false;
        this.isRefresh = true;
      } else {
        this.isRefresh = false;
        this.$message({
          message: '未知错误，请重试或者刷新页面',
          type: 'warning'
        });
      }
    },
    cancelHandler () {
      this.editFlag = false;
    },
    remove (list, userType) {
      if (userType === this.$i18n.t('message.creator')) {
        this.myUserList.admin = [];
      } else if (userType === this.$i18n.t('message.editor')) {
        this.myUserList.editors = this.myUserList.editors.filter(l => l.id !== list.id);
      } else {
        this.myUserList.viewers = this.myUserList.viewers.filter(l => l.id !== list.id);
      }
      let item = this.myUserList.allUsers.filter(ll => ll.id === list.id)[0];
      item.disabled = false;
      item.itemId = new Date().getTime();
    },
    addToGroup (group) {
      if (!this.selectedList.length) return;
      if (group === 'admin') {
        if (this.arrow_style[0] === 0) return;
        if (this.myUserList.admin.length > 0) return;
        this.selectedList[0].permission = 'O';
        this.myUserList.admin = [this.selectedList[0]];
      } else if (group === 'editor') {
        if (this.arrow_style[1] === 0) return;
        this.selectedList.forEach(p => { p.permission = 'E'; });
        this.myUserList.editors = this.myUserList.editors.concat(this.selectedList);
      } else {
        if (this.arrow_style[2] === 0) return;
        this.selectedList.forEach(p => { p.permission = 'V'; });
        this.myUserList.viewers = this.myUserList.viewers.concat(this.selectedList);
      }

      this.selectedList.forEach((l, idx) => {
        let item = this.myUserList.allUsers.filter(ll => ll.id === l.id)[0];
        item.disabled = group === 'admin' ? (idx === 0) : true;
        item.selected = false;
        item.itemId = new Date().getTime();
      });

      this.selectedList = [];
    },
    selected (list, status) {
      let item = this.myUserList.allUsers.filter(ll => ll.id === list.id)[0];
      item.selected = status;
      item.itemId = new Date().getTime();

      if (status) {
        this.selectedList.filter(l => l.id === list.id).length === 0 && this.selectedList.push(list);
      } else {
        this.selectedList = this.selectedList.filter(l => l.id !== list.id);
      }
    },
    checkColor (userType) {
      return userType === 'CREATOR' ? '#4284F5' : userType === 'EXPLORER' || userType === 'USER' ? '#03B98C' : '#FACC14';
    }
  },
  mounted () {
    document.body.style.pointerEvents = this.pointerEvents;
    this.$el.style.pointerEvents = 'auto';

    let userList_copy = JSON.parse(JSON.stringify(this.userList));
    this.myUserList = {
      allUsers: userList_copy.allUsers.map((l, idx) => {
        l.selected = false;
        l.disabled = false;
        if ([...userList_copy.admin, ...userList_copy.editors, ...userList_copy.viewers].map(d => d.id).includes(l.id)) {
          l.disabled = true;
        }
        l.color = this.checkColor(l.userType);
        l.itemId = l.id;
        return l;
      }),
      admin: userList_copy.admin.slice().map((l, idx) => {
        l.color = this.checkColor(l.userType);
        l.itemId = l.id;
        return l;
      }),
      editors: userList_copy.editors.slice().map((l, idx) => {
        l.color = this.checkColor(l.userType);
        l.itemId = l.id;
        return l;
      }),
      viewers: userList_copy.viewers.slice().map((l, idx) => {
        l.color = this.checkColor(l.userType);
        l.itemId = l.id;
        return l;
      })
    };
    this.itemList[0].list = this.myUserList.admin;
    this.itemList[1].list = this.myUserList.editors;
    this.itemList[2].list = this.myUserList.viewers;
  },
  destroyed () {
    document.body.style.pointerEvents = 'auto';
  }
};
</script>

<style scoped lang='scss'>
.tips {
  font-size: 12px;
  color: #A4A4A4;
}
.project-name {
  font-size: 14px;
  color: #424242;
  margin-top: 12px;
}
.content-box {
  height: 360px;
  overflow-y: auto;
  .circle {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin: 0 10px;
  }
  .tip {
    color: #A4A4A4;
  }
  .content {
    display: flex;
    .left {
      width: 90px;
      .btn {
        height: 24px;
        line-height: 24px;
        width: 56px;
        text-align: center;
        border: 1px solid #DEDEDE;
        border-radius: 4px;
        cursor: pointer;
        .icon-db_plus {
          color: #F59E28;
          font-size: 12px;
          padding-left: 5px;
        }
      }
    }
    .right {
      width: calc(100% - 90px);
    }
  }
}
</style>
<style lang="scss">
.el-dialog__body {
  padding: 0px 20px 20px 20px;
}
.el-dialog__title {
  color: #424242;
  font-weight: bold;
  font-size: 16px;
}
.el-dialog__headerbtn .el-dialog__close {
  color: #A4A4A4;
  font-size: 18px;
  font-weight: 600;
}
</style>
<style lang="scss">
.content-box {
  .el-collapse {
    border: none;
    font-size: 12px;
  }
  .el-collapse-item {
    .el-collapse-item__header {
      height: 32px;
      line-height: 32px;
      display: flex;
      flex-direction: row-reverse;
      justify-content: flex-end;
      color: hsl(0, 0%, 25.9%);
      font-size: 14px;
      background: #F9F9F9;
      border-radius: 4px;
      border-bottom: none;
      .el-collapse-item__arrow {
        margin: 0 8px 0 8px;
      }
    }
    .el-collapse-item__wrap {
      border: none;
    }
    .el-collapse-item__content {
      padding-bottom: 16px;
      padding-left: 16px;
      padding-top: 7px;
      max-height: 200px;
      overflow: auto;
    }
  }
}
</style>
