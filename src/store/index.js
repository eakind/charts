import Vue from 'vue';
import Vuex from 'vuex';
import state from './state';
import mutations from './mutations';
import project from './project/index';
import drawingboard from './drawingboard/index';
import dashboard from './dashboard/index';
import colors from './colors/index';
import Persistedstate from 'vuex-persistedstate';
import formula from './formula/index';

Vue.use(Vuex);

export default new Vuex.Store({
  state,
  mutations,
  modules: {
    project,
    dashboard,
    colors,
    formula,
    drawingboard,
  },
  plugins: [
    new Persistedstate({
      storage: window.sessionStorage,
      reducer (state) {
        return {
          userInfo: state.userInfo,
          project: {
            projectId: state.project.projectId,
            projectName: state.project.projectName,
            projectStatus: state.project.projectStatus,
            locale: state.project.locale,
            listType: state.project.listType,
            exportPare: state.project.exportPare,
            settingsId: state.project.settingsId,
            createType: state.project.createType,
            templateId: state.project.templateId,
          },
          formula: {
            formulaId: (state) => state.formula.formulaId,
            formulaObj: (state) => state.formula.formulaObj,
            formulaContent: (state) => state.formula.formulaContent,
            formulaFunList: (state) => state.formula.formulaFunList,
            operator: (state) => state.formula.operator,
            condition: (state) => state.formula.condition,
            string: (state) => state.formula.string,
            formulaType: (state) => state.formula.formulaType,
            dataType: (state) => state.formula.dataType,
          },
          drawingboard: {
            canvasList: state.drawingboard.canvasList,
            canvasNum: state.drawingboard.canvasNum,
            aggrList: state.drawingboard.aggrList,
            catList: state.drawingboard.catList,
            currentCanvas: state.drawingboard.currentCanvas,
            currentCanvasDetail: state.drawingboard.currentCanvasDetail,
            canvasType: state.drawingboard.canvasType,
            viewMode: state.drawingboard.viewMode,
          },
          dashboard: {
            dashboardList: state.dashboard.dashboardList,
            dashboardNum: state.dashboard.dashboardNum,
            currentDashboard: state.dashboard.currentDashboard,
            currentDashboardDetail: state.dashboard.currentDashboardDetail,
            // currentTarget: state.dashboard.currentTarget,
            layoutList: state.dashboard.layoutList,
            workSheetList: state.dashboard.workSheetList,
            filterUniqueList: state.dashboard.filterUniqueList,
            floatComponents: state.dashboard.floatComponents,
          },
          initState: state.initState,
        };
      },
    }),
    new Persistedstate({
      reducer (state) {
        return {
          colors: {
            colorsRecentlyUsed: state.colors.colorsRecentlyUsed,
            colorsCustomRecent: state.colors.colorsCustomRecent,
          }
        };
      },
    }),
  ],
});
