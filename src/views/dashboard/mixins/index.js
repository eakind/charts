import { mapMutations, mapState } from 'vuex';
import { get } from '@/api/server.js';

export default {
  data () {
    return {
      // workSheetList: [],
      css: {},
      titleCss: {},
      activeWorkSheet: [],
    };
  },
  computed: {
    ...mapState('project', [
      'projectId',
      'newWorksheetTypesIconMap',
      'worksheetTypes',
    ]),
    ...mapState('dashboard', ['currentDashboard', 'workSheetList']),
    ...mapState('drawingboard', ['numList', 'currentCanvas']),
  },
  // watch: {
  //   'currentDashboard.dashboard_id' () {
  //     this.workSheetList.map((i) => {
  //       this.$set(i, 'active', false);
  //     });
  //     this.setLegendList([]);
  //     this.setWorkSheetList(this.workSheetList);
  //   },
  // },
  methods: {
    ...mapMutations('drawingboard', ['setCanvasNum']),
    ...mapMutations('dashboard', [
      'setWorkSheetList',
      'setFilterUniqueList',
      'setLegendList',
    ]),
    initDashboardData () {
      this.getWorkSheetList();
      this.getFilterList();
    },
    // 画布列表
    async getWorkSheetList () {
      let param = {
        project_id: this.projectId,
        offset: 0,
        limit: 100,
      };
      let res = await get('canvasList', param);
      if (res && res.code === 0) {
        let workSheetList = res.worksheet_list || [];
        this.setCanvasNum(res.total_num);
        this.setWorkSheetList(workSheetList);
        this.getDashboardDetail();
      }
    },
    async getFilterList () {
      let param = {
        project_id: this.projectId,
        worksheet_id: this.currentCanvas.worksheet_id,
        offset: 0,
        limit: 100,
      };
      let res = await get('filterList', param);
      if (res.code === 0) {
        let filterList = res.filter_list;
        this.setFilterUniqueList(filterList);
      }
    },
    async getDashboardDetail () {
      let param = {
        project_id: this.projectId,
        dashboard_id: this.currentDashboard.dashboard_id,
      };
      let list = this.workSheetList;
      let res = await get('dashboardDetail', param);
      if (res.code === 0) {
        let { worksheets } = res;
        if (worksheets) {
          list = this.workSheetList.map((i) => {
            if (
              worksheets.find((item) => item.worksheetId === i.worksheet_id)
            ) {
              i.active = true;
            } else {
              i.active = false;
            }
            return i;
          });
        }
        this.setWorkSheetList(list);
      }
    },
  },
};
