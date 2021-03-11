import { post } from '@/api/server';
const state = {
  dashboardList: [], // 展板列表
  currentDashboard: {}, // 当前展板
  currentDashboardDetail: {}, // 当前展板详情
  dashboardNum: 0, // 项目展板数
  zoomSize: 1, // 展板缩放倍数
  /**
   * 用户选中的组件
   * type: canvas - 画布  text - 文本  pic-图例  过滤 -filter
   */
  currentTarget: {},
  workSheetList: [], // 画布列表
  fullScreen: false,
  layoutList: [], // 布局数据
  legendList: [], // 图例  {id :'',list:[]}
  actionFlag: false, // 联动交互设置弹框
  actionList: [], // 当前展板下的action列表
  filterUniqueList: [], // 项目已有的过滤器
  textEditObj: {}, // 文本编辑弹框内容
  chartList: [], // 选中的画布列表
  selectedTarget: {}, // 当前选中元素
  currentFilterList: [], // 当前展板的过滤器列表
  floatComponents: [],
  mobileLayoutList: [],
};

const mutations = {
  setDashboardList (state, array) {
    state.dashboardList = array;
  },
  setCurrentDashboard (state, object) {
    state.currentDashboard = JSON.parse(JSON.stringify(object));
  },
  setCurrentDashboardDetail (state, object) {
    state.currentDashboardDetail = JSON.parse(JSON.stringify(object));
  },
  setDashboardNum (state, number) {
    state.dashboardNum = number;
  },
  setZoomSize (state, number) {
    state.zoomSize = number;
  },
  setCss (state, { attr, css }) {
    state.currentDashboardDetail.css[attr] = JSON.parse(JSON.stringify(css));
  },
  setTargetCss (state, { attr, css }) {
    state.currentTarget.style[attr] = css;
  },
  setWorkSheetList (state, list) {
    state.workSheetList = list;
  },
  setFullScreen (state, boolean) {
    state.fullScreen = boolean;
  },
  setLayoutList (state, list) {
    state.layoutList = list;
  },
  changeZoomSize (state, size) {
    if (size) {
      state.zoomSize = size || 1;
    }
  },
  setLegendList (state, list) {
    state.legendList = list;
  },
  setActionFlag (state, boolean) {
    state.actionFlag = boolean;
  },
  setActionList (state, array) {
    state.actionList = array;
  },
  setCurrentTarget (state, object) {
    state.currentTarget = object;
  },
  setLayoutStyle (state) {
    state.currentDashboardDetail.css.layoutList = state.layoutList;
  },
  setFilterUniqueList (state, array) {
    state.filterUniqueList = array;
  },
  setTextEditObj (state, object) {
    state.textEditObj = object;
  },
  setChartList (state, array) {
    state.chartList = array;
  },
  setSelectedTarget (state, object) {
    state.selectedTarget = object;
  },
  setCurrentFilterList (state, object) {
    state.currentFilterList = object;
  },
  setFloatComponents (state, object) {
    state.floatComponents = object;
  },
  setMobileLayoutList (state, object) {
    state.mobileLayoutList = object;
  }
};

async function modifyCss (dashboard_id, projectId, css) {
  let param = {
    dashboard_id,
    project_id: projectId,
    css,
  };
  await post('dashboardCss', param);
}

const actions = {
  setCss ({ commit, state }, { attr, css, projectId }) {
    commit('setCss', { attr, css });
    modifyCss(
      state.currentDashboardDetail.dashboard_id,
      projectId,
      state.currentDashboardDetail.css
    );
  },
  setTargetCss ({ commit, state }, { id, attr, css, projectId }) {
    commit('setTargetCss', { attr, css });
    commit('setLayoutStyle');
    // 应该还有逻辑
    modifyCss(
      state.currentDashboardDetail.dashboard_id,
      projectId,
      state.currentDashboardDetail.css
    );
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
