<template>
  <div class="home">
    <home-header v-show="isFull"></home-header>
    <div class="home-body" :class="fullScreen ? 'body-full' : ''">
      <router-view ref="routerView"></router-view>
    </div>
    <create-canvas @hide="hideCanvas" v-if="isCreateCanvas"></create-canvas>
    <save-chart
      v-if="isExportChart"
      :isExportChart="isExportChart"
      @cancel="cancelSaveChart"
    ></save-chart>
    <preview-data
      v-if="isExportData"
      @closePreview="cancelExportChart"
    ></preview-data>
    <modify-pw v-if="isModifyPw"></modify-pw>
  </div>
</template>

<script>
import SaveChart from '@/components/dcexport/saveChart';
import PreviewData from '@/components/dcexport/previewData';
import HomeHeader from './home/HomeHeader.vue';
import ModifyPw from './home/ModifyPw.vue';
import CreateCanvas from './home/CreateCanvas.vue';
import { get } from '@/api/server';
import { mapState, mapMutations } from 'vuex';
import { isEmpty } from '../utils/check';
export default {
  components: {
    SaveChart,
    CreateCanvas,
    PreviewData,
    HomeHeader,
    ModifyPw,
  },
  data () {
    return {
      isExportChart: false,
      isExportData: false,
      canvasTimer: null
    };
  },
  computed: {
    ...mapState(['userInfo', 'isModifyPw', 'isCreateCanvas', 'initState']),
    ...mapState('project', ['projectId']),
    ...mapState('drawingboard', [
      'canvasList',
      'currentCanvas',
      'currentCanvasDetail',
      'catList',
      'aggrList'
    ]),
    ...mapState('dashboard', [
      'dashboardList',
      'currentDashboard',
      'currentDashboardDetail',
      'dashboardNum',
      'fullScreen',
      'workSheetList',
    ]),
    isFull () {
      if (!this.fullScreen) {
        return true;
      }
      return false;
    },
  },
  watch: {
    currentCanvas: {
      handler (obj) {
        if (obj.worksheet_id) {
          if (this.canvasTimer) {
            setTimeout(this.canvasTimer);
            this.canvasTimer = null;
          }
          this.canvasTimer = setTimeout(() => {
            setTimeout(this.canvasTimer);
            this.canvasTimer = null;
            this.changeCanvasHandler(obj);
          }, 300);
        } else {
          if (this.canvasList.length) {
            this.setCurrentCanvasDetail({});
            this.setColumnList([]);
            this.setRowList([]);
            this.setLabelsCapsuleList([]);
            this.setColorCapsuleList([]);
            this.setSizeCapsuleList([]);
            this.setCurrentCanvas(this.canvasList[0]);
          }
        }
      },
      deep: true,
    },
    currentDashboard: {
      handler (obj) {
        if (obj.dashboard_id) {
          if (this.canvasTimer) {
            setTimeout(this.canvasTimer);
            this.canvasTimer = null;
          }
          this.canvasTimer = setTimeout(() => {
            setTimeout(this.canvasTimer);
            this.canvasTimer = null;
            this.changeDashboardHandler(obj);
          }, 300);
        } else {
          if (this.dashboardList.length) {
            this.setCurrentDashboard(this.dashboardList[0]);
          }
        }
      },
      deep: true,
    },
    $route: {
      handler () {
        let routeName = this.$route.name;
        switch (routeName) {
          case 'drawingboard':
            this.getDashboardList(100, true);
            this.getFeatureList('CAT');
            this.getFeatureList('NUM');
            if (!this.currentCanvas) return;
            this.getCanvasDetail();
            break;
          case 'dashboard':
            this.getFeatureList('CAT');
            this.getFeatureList('NUM');
            if (!this.currentDashboard) return;
            this.setDashboardDetai();
            break;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created () {
    if (isEmpty(this.initState)) {
      this.setInitState();
    }
  },
  mounted () {
    this.getUserInfo();
    this.bus.$on('selectExport', this.selectExport);
    this.aiManager();
  },
  destroyed () {
    this.bus.$off('selectExport');
  },
  methods: {
    ...mapMutations('project', ['setProjectId']),
    ...mapMutations(['setUserInfo', 'setIsCreateCanvas', 'setInitState']),
    ...mapMutations('drawingboard', [
      'setCatList',
      'setAggrList',
      'setCanvasList',
      'setCurrentCanvas',
      'setCurrentCanvasDetail',
      'setColumnList',
      'setRowList',
      'setLabelsCapsuleList',
      'setColorCapsuleList',
      'setSizeCapsuleList',
      'setCanvasNum'
    ]),
    ...mapMutations('dashboard', [
      'setDashboardNum',
      'setCurrentDashboardDetail',
      'setLegendList',
      'setWorkSheetList',
      'setFullScreen',
      'setFloatComponents'
    ]),
    aiManager () {
      let projectId = this.$route.query.aiManager;
      if (!projectId) return;
      this.setProjectId(projectId);
      this.setFullScreen(true);
      // this.$router.push({ path: '/dashboard' });
      // this.getProjectDetail(projectId);
    },
    hideCanvas () {
      if (this.canvasList.length > 0) {
        this.setIsCreateCanvas(false);
      } else {
        this.$router.push({ path: '/list' });
        this.setIsCreateCanvas(false);
      }
    },
    hideBoard () {
      this.setIsCreateDashboard(false);
      if (!this.dashboardList.length) {
        this.$router.push({
          path: '/drawingboard',
        });
      }
    },
    selectExport (flag) {
      if (flag) {
        this.isExportChart = true;
      } else {
        this.isExportData = true;
      }
    },
    cancelSaveChart (flag) {
      // 图片下载
      if (flag) {
        // 在dashboard中接收
        this.bus.$emit('saveChart', flag);
      } else {
        this.isExportChart = false;
      }
    },
    cancelExportChart () {
      this.isExportData = false;
    },
    changeCanvasHandler (item) {
      if (!item) return;
      if (this.currentCanvasDetail.worksheet_id === item.worksheet_id) {
        this.setCurrentCanvasDetail(
          JSON.parse(JSON.stringify(this.currentCanvasDetail))
        );
      } else {
        this.getCanvasDetail();
      }
    },
    changeDashboardHandler (item) {
      if (this.currentDashboardDetail.dashboard_id === item.dashboard_id) {
        this.setCurrentDashboardDetail(this.currentDashboardDetail);
        this.$refs.routerView.$emit('initData');
      } else {
        this.setDashboardDetai();
      }
    },
    async getFeatureList (type) {
      if (type === 'CAT' && this.catList.length) return;
      if (type === 'NUM' && this.aggrList.length) return;
      let param = {
        project_id: this.projectId,
        feature_type: type,
        order_by: '',
        direction: '',
        offset: 0,
        limit: 1000,
      };
      let res = await get('featureList', param);
      if (!res) return;
      if (type === 'CAT') this.setCatList(res.feature_list);
      if (type === 'NUM') this.setAggrList(res.feature_list);
    },
    async getDashboardList (num, flag) {
      let param = {
        project_id: this.projectId,
        offset: 0,
        limit: num || 100,
      };
      if (!this.projectId) return;
      let res = await get('dashboardList', param);
      if (res.code === 0) {
        this.setDashboardNum(res.total_num);
        if (!flag) {
          this.setDashboardList(res.dashboard_list);
        }
      }
    },
    async getWorkSheetList () {
      let param = {
        project_id: this.projectId,
        offset: 0,
        limit: 100,
      };
      let res = await get('canvasList', param);
      let workSheetList = res.worksheet_list || [];
      this.setWorkSheetList(workSheetList);
      return workSheetList;
    },
    async setDashboardDetai () {
      let param = {
        project_id: this.projectId,
        dashboard_id: this.currentDashboard.dashboard_id,
      };
      if (!this.currentDashboard.dashboard_id) return;
      let list = this.workSheetList;
      if (this.workSheetList.length === 0) {
        list = await this.getWorkSheetList();
        this.getDashboardDetail(list, param);
      } else {
        this.getDashboardDetail(list, param);
      }
    },
    async getDashboardDetail (list, param) {
      list = this.workSheetList.map((i) => {
        i.active = false;
        return i;
      });
      let res = await get('dashboardDetail', param);
      if (res.code === 0) {
        if (this.currentDashboard.dashboard_id !== res.dashboard_id) return;
        this.setCurrentDashboardDetail(res);
        this.setCanvasNum(res.total_num);
        let { worksheets } = res;
        if (worksheets) {
          list = this.workSheetList.map((i) => {
            if (
              worksheets.find((item) => item.worksheetId === i.worksheet_id)
            ) {
              i.active = true;
            }
            return i;
          });
        }
        if (res.floats) {
          this.setFloatComponents(res.floats);
        } else {
          this.setFloatComponents([]);
        }
        this.setLegendList([]);
        this.setWorkSheetList(list);
        this.$refs.routerView.$emit('initData');
      }
    },
    async getCanvasDetail () {
      let param = {
        project_id: this.projectId,
        worksheet_id: this.currentCanvas.worksheet_id,
      };
      if (!this.currentCanvas.worksheet_id) return;
      let res = await get('canvasDetail', param);
      if (res.code === 0) {
        if (this.currentCanvas.worksheet_id !== res.worksheet_id) return;
        this.setCurrentCanvasDetail(res);
        this.$refs.routerView.$emit('initData');
      }
    },
    async getUserInfo () {
      let param = {
        product_id: 1,
      };
      let res = await get('userInfo', param);
      if (res.code === 0) {
        this.setUserInfo(res);
      }
    },
  },
};
</script>
<style scoped lang="scss">
.home {
  @include wh100;
  overflow: hidden;
  background: #e7eaf0;
  .home-body {
    width: 100%;
    height: calc(100% - 68px);
    overflow: hidden;
    background-color: #e7eaf0;
  }
  .body-full {
    height: 100%;
  }
}
</style>
