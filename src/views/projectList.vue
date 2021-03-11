<template>
  <div class="project-list">
    <div class="list-left" v-if="isCreator">
      <div class="create-title">{{$t('projectList.new_project')}}</div>
      <create-item v-for="(item, index) in btnList" :key="index" :item="item"></create-item>
    </div>
    <div class="list-right">
      <div class="projectlist-header">
        <dc-el-select :list="sortList" v-model="sortType" @on-change="selectChange"></dc-el-select>
        <search-input :value="projectName" @change="searchChange"></search-input>
      </div>
      <project-list class="projectlist-list" v-if="reload" :list="list" :direction="direction" :searchProjectName="projectName" :roleType="userInfo.role_type" @edit="editUsers" @on-clear="clearHandler"></project-list>
    </div>
    <user-center
      v-if="isUserCenter"
      :showDialog="isUserCenter"
      :projectName="project_name"
      :userList="userList"
      @addTo="addTo"
      @cancel="cancelAdd"
      :pointerEvents="pointerEvents"
      :errorMsg="errorMsg"
    ></user-center>
  </div>
</template>
<script>
import DcElSelect from '@/components/dcelselect/dcelselect.vue';
import SearchInput from '@/components/searchinput/searchInput.vue';
import userCenter from '@/components/usercenter/userCenter.vue';
import CreateItem from './projectList/createItem.vue';
import projectList from './projectList/index.vue';
import { mapMutations, mapState } from 'vuex';
import { jsxMix } from './projectList/mixins/jsxMix.js';
import { get, post } from '@/api/server.js';
import { isEmpty } from '../utils/check';
export default {
  mixins: [jsxMix],
  data () {
    return {
      btnList: [{
        borderColor: 'linear-gradient(270deg, #77BAFB 0%, #4284F5 100%);',
        title: this.$t('projectList.hand_create'),
        tip: '',
        desc: this.$t('projectList.self_canvas_board'),
        url: 'createProject'
      }, {
        borderColor: 'linear-gradient(270deg, #FDE82D 0%, #FACC14 100%);',
        title: this.$t('projectList.use_template'),
        tip: '(beta)',
        desc: this.$t('projectList.use_template_tip'),
        url: 'useTemplate'
      }],
      sortList: [{
        label: this.$t('projectList.create_recently'),
        value: 'recently'
      }, {
        label: this.$t('projectList.create_early'),
        value: 'early'
      }],
      sortType: 'recently',
      reload: true, // 刷新列表
      projectName: null,
      direction: null,
      sortObj: {
        recently: 'desc',
        early: 'asc'
      },
      roleType: '',
      exitFlag: false,
      isUserCenter: false,
      project_name: '',
      userList: {
        allUsers: [],
        admin: [],
        editors: [],
        viewers: []
      },
      pointerEvents: 'auto',
      errorMsg: ''
    };
  },
  computed: {
    ...mapState('project', ['projectId']),
    ...mapState(['userInfo', 'initState']),
    ...mapState('drawingboard', ['currentCanvas']),
    isCreator () {
      return this.userInfo.role_type === 'CREATOR';
    }
  },
  components: {
    CreateItem,
    DcElSelect,
    SearchInput,
    projectList,
    userCenter
  },
  mounted () {
    this.exitFlag = false;
    if (isEmpty(this.initState)) {
      this.setInitState();
    }
    this.resetVuex();
    this.setProjectId('');
    this.setSettingsId('');
    this.setCanvasList([]);
    this.setCurrentCanvas({});
  },
  destroyed () {
    this.exitFlag = true;
    this.setInitState();
  },
  methods: {
    ...mapMutations(['resetVuex', 'setInitState']),
    ...mapMutations('project', ['setProjectId', 'setProjectName', 'setSettingsId']),
    ...mapMutations('drawingboard', ['setCurrentCanvas', 'setCanvasList', 'setCanvasNum']),
    searchChange (val) {
      this.projectName = val;
    },
    selectChange (item) {
      this.direction = this.sortObj[item];
    },
    async editUsers (item) {
      this.setProjectId(item.project_id);
      this.setProjectName(item.project_name);
      this.project_name = item.project_name;
      let all_users = await get('inviteeList', {
        offset: 0,
        limit: 10000,
        project_id: item.project_id
      });
      if (!all_users) return;
      let project_users = await get('getMember', {
        project_id: item.project_id
      });
      if (!project_users) return;

      this.userList.allUsers = all_users.user_list;
      this.userList.allUsers.forEach(p => {
        p.id = p.user_id;
        p.userName = p.user_name;
        p.userType = p.role_type;
      });

      this.userList.admin = project_users.user_list.filter(
        p => p.permission === 'O'
      );
      this.userList.admin.forEach(p => {
        p.id = p.user_id;
        if (p.role_type === undefined) {
          p.role_type = this.userList.allUsers.filter(
            a => a.id === p.id
          )[0].role_type;
        }
        p.userName = p.user_name;
        p.userType = p.role_type;
      });

      this.userList.editors = project_users.user_list.filter(
        p => p.permission === 'E'
      );
      this.userList.editors.forEach(p => {
        p.id = p.user_id;
        if (p.role_type === undefined) {
          p.role_type = this.userList.allUsers.filter(
            a => a.id === p.id
          )[0].role_type;
        }
        p.userName = p.user_name;
        p.userType = p.role_type;
      });

      this.userList.viewers = project_users.user_list.filter(
        p => p.permission === 'V'
      );
      this.userList.viewers.forEach(p => {
        p.id = p.user_id;
        if (p.role_type === undefined) {
          p.role_type = this.userList.allUsers.filter(
            a => a.id === p.id
          )[0].role_type;
        }
        p.userName = p.user_name;
        p.userType = p.role_type;
      });
      this.isUserCenter = true;
      this.pointerEvents = 'none';
    },
    async addTo (obj) {
      // axios
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
      this.setProjectId('');
      this.setProjectName('');
      sessionStorage.clear();
      if (res) {
        this.reload = false;
        setTimeout(() => {
          this.reload = true;
        }, 0);
        // this.list.filter(l => l.project_id === this.projectId)[0].user_abbr_list = user_list
        this.cancelAdd();
        this.exitFlag = true;
        this.offset = 0;
        this.list = [];
        // this.getList();
        this.errorMsg = '';
      } else {
        // 修改不成功
        this.errorMsg =
          localStorage.getItem('localLang') === 'en'
            ? 'Unknow Error, Please try again or refresh'
            : '未知错误，请重试或者刷新页面';
      }
    },
    cancelAdd (flag) {
      if (flag) {
        this.setProjectId('');
        this.setProjectName('');
        sessionStorage.clear();
        this.reload = false;
        setTimeout(() => {
          this.reload = true;
        }, 0);
      };
      this.isUserCenter = false;
      this.setProjectId('');
      this.setProjectName('');
      sessionStorage.clear();
      this.pointerEvents = 'auto';
    },
    clearHandler () {
      this.projectName = '';
    }
  }
};
</script>
<style lang='scss' scoped>
.project-list {
  display: flex;
  height: 100%;
  .list-left{
    min-width: 260px;
    background-color: #FBFCFF;
    height: 100%;
  }
  .create-title{
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    color: #666666;
    padding: 0px 20px;
    box-sizing: border-box;
  }
  .list-right {
    flex: 1;
    height: 100%;
    background: #E7EAF0;
  }
  .projectlist-header {
    display: flex;
    justify-content: space-between;
    padding: 9px 60px 0 24px;
  }
  .projectlist-list {
    padding: 0px 24px 0 24px;
    height: calc(100% - 100px);
    overflow: auto;
    margin: 10px auto;
    margin-top: 20px;
    display: flex;
    flex-wrap:  wrap;
    justify-content: flex-start;
    align-content: flex-start;
    .projectlist_item {
      border: none;
    }
  }
};
</style>
