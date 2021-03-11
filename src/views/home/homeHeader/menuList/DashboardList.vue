<template>
  <div class="list">
    <list-tab :btnName='btnName' :total-list="dashboardList" :board-data="boardData" @on-dropList="dropList" @onChangeListType='changeListType' @setPage="setPage"></list-tab>
    <board-list class="current-item" ref="list" v-show="listType==='page'" v-if="!fullScreen"
                :offset="offset" :limit="limit"
                :page-list="pageList"
                @pre="preHandler" @next="nextHandler" @setPage="setPage"></board-list>
    <current-item class="current-item" :item="current" v-show="listType==='current'"></current-item>
    <dashboard-handle class="dashboard-handle"></dashboard-handle>
    <goto-canvas></goto-canvas>
  </div>
</template>
<script>
import ListTab from './dashboardList/listTab.vue';
import BoardList from './dashboardList/BoardList.vue';
import CurrentItem from './dashboardList/CurrentItem.vue';
import DashboardHandle from './dashboardList/DashboardHandle.vue';
import GotoCanvas from './dashboardList/gotoCanvas.vue';
import { mapState, mapMutations } from 'vuex';
import { get, post } from '@/api/server';
export default {
  data () {
    return {
      btnName: 'dashboard',
      limit: 7,
      offset: 0,
      pageList: [],
      timer: null,
      boardData: {
        dashboard: {
          border: {
            bgSelected: 'none',
            background: '#dedede'
          },
          bgColor: {
            bgSelected: false,
            opacity: 100,
            index: -1,
            background: {
              background: '#ffffff'
            }
          },
          padding: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          },
          isLock: true,
          size: {
            width: 1366,
            height: 768,
          },
          modeType: 'fixedWidth',
          scale: 1
        },
        title: {
          showFlag: true,
          colorStyle: {
            background: '#424242',
            opacity: 100,
          },
          fontSize: 14,
          fontStyle: [],
          textAlign: 'left',
          bgColor: {
            bgSelected: false,
            opacity: 100,
            index: -1,
            background: {
              background: '#ffffff'
            }
          },
          padding: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          },
          isLock: true,
          border: {
            bgSelected: 'none',
            background: '#dedede'
          },
        },
        isShowLegend: true,
        legendWidth: 15
      }
    };
  },
  computed: {
    ...mapState('project', ['projectId', 'listType']),
    ...mapState('dashboard', ['dashboardList', 'currentDashboard', 'dashboardNum', 'fullScreen']),
    typeTxt () {
      return this.listType === 'page' ? '多列表' : '单列表';
    },
    current () {
      let obj = JSON.parse(JSON.stringify(this.currentDashboard));
      for (let i = 0; i < this.dashboardList.length; i++) {
        if (obj.dashboard_id === this.dashboardList[i].dashboard_id) {
          obj.dashboard_title = this.dashboardList[i].dashboard_title;
        }
      }
      return obj;
    }
  },
  watch: {
    fullScreen: {
      handler (val) {
        if (!val) {
          this.getDashboardList(100);
        };
      },
      deep: true
    },
    dashboardList: {
      handler (list) {
        if (this.dashboardNum >= list) return;
        this.setPageList();
      },
      deep: true,
      immediate: true
    },
    dashboardNum (val) {
      if (!val) {
        this.noneDashboard();
      }
    }
  },
  components: {
    ListTab,
    BoardList,
    CurrentItem,
    DashboardHandle,
    GotoCanvas
  },
  beforeDestroy () {
    this.bus.$off('del-dashboard');
  },
  mounted () {
    this.getDashboardList(100);
    this.bus.$on('del-dashboard', () => {
      this.setPage(0);
    });
  },
  methods: {
    ...mapMutations('project', ['setListType']),
    ...mapMutations('dashboard', ['setDashboardList', 'setDashboardNum', 'setCurrentDashboard', 'setCurrentDashboardDetail', 'setLegendList', 'setLayoutList']),
    changeListType () {
      if (this.listType === 'page') this.setListType('current');
      else this.setListType('page');
      if (this.listType === 'page') {
        this.setPageList();
      }
    },
    // 设置展板列表
    setPageList () {
      this.$nextTick(() => {
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        this.pageList = [];
        this.timer = setTimeout(() => {
          this.limit = this.getLimit();
          this.offset = this.getOffset();
          this.getDashboardList();
        }, 150);
      });
    },
    getLimit () {
      if (this.listType === 'current') return 100;
      if (!this.$refs.list && !this.$refs.list.$el) return 100;
      let width = this.$refs.list.$el.querySelector('.list').clientWidth;
      let limit = Math.floor(width / 160);
      return limit > 7 ? 7 : limit;
    },
    getOffset () {
      let index = 0;
      for (let i = 0; i < this.dashboardList.length; i++) {
        if (this.currentDashboard.dashboard_id === this.dashboardList[i].dashboard_id) {
          index = i;
        }
      }
      if (index === 0) {
        if (this.offset + this.limit >= this.dashboardList.length) {
          return this.offset;
        }
      }
      let page = Math.floor(index / this.limit);
      return page * this.limit;
    },
    preHandler () {
      if (this.offset <= 0) return;
      this.offset = this.offset - this.limit;
      this.getDashboardList();
    },
    nextHandler () {
      if (this.offset >= this.dashboardNum) return;
      this.offset = this.offset + this.limit;
      this.getDashboardList();
    },
    // 设置展板页
    setPage (index) {
      let page = Math.floor(index / this.limit);
      this.offset = page * this.limit;
      let list = this.dashboardList.slice(this.offset, this.offset + this.limit);
      this.pageList = [];
      this.pageList.splice(0, this.limit, ...list);
    },
    async noneDashboard () {
      this.pageList = [];
      this.setCurrentDashboard({});
      let param = {
        project_id: this.projectId,
        css: this.boardData
      };
      let res = await post('createDashboard', param);
      if (!res) return;
      let obj = {
        dashboard_id: res.dashboard_id,
        dashboard_idx: res.dashboard_idx,
        dashboard_name: res.dashboard_name,
        dashboard_title: res.dashboard_title
      };
      this.$emit('setPage', 0);
      this.setDashboardNum(1);
      this.setCurrentDashboardDetail({});
      this.setLegendList([]);
      this.setLayoutList([]);
      this.setCurrentDashboard(obj);
      this.dashboardList.push(obj);
      this.setDashboardList(this.dashboardList);
    },
    async getDashboardList (num) {
      let limitNum = num || this.limit;
      let param = {
        project_id: this.projectId,
        offset: this.offset,
        limit: limitNum
      };
      let list = this.dashboardList.slice(this.offset, this.offset + this.limit);
      // 展板列表中是否有当前页所需要的展板
      if (list.length) {
        this.pageList = [];
        this.pageList.splice(0, this.limit, ...list);
        return;
      }
      let res = await get('dashboardList', param);
      if (res.code === 0) {
        this.setDashboardNum(res.total_num);
        if (!res.total_num) {
          // 如果没有展板，弹出创建展板
          this.noneDashboard();
          return;
        }
        if (limitNum === 100) {
          this.setDashboardList(res.dashboard_list);
        } else {
          this.setDashboardList(this.dashboardList.concat(res.dashboard_list));
        }
        let list = this.dashboardList.slice(this.offset, this.offset + this.limit);
        this.pageList = [];
        this.pageList.splice(0, this.limit, ...list);
        // 如果没有选中展板，默认选中第一个展板
        if (!this.currentDashboard.dashboard_id && this.dashboardList.length) {
          this.setCurrentDashboard(this.dashboardList[0]);
        }
      }
    }
  }
};
</script>
<style lang='scss' scoped>
@import './scss/list.scss';
</style>
