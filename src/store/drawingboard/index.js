const state = {
  canvasList: [], // 画布列表
  currentCanvas: {}, // 当前画布
  currentCanvasDetail: {}, // 当前画布详情
  canvasNum: 0, // 项目画布数
  canvasType: '', // 画布类型
  catList: [], // 分类特征列表
  aggrList: [], // 数值特征列表
  columnList: [], // 画布列特征
  rowList: [], // 画布行特征
  colorCapsuleList: [], // 颜色胶囊特征
  labelsCapsuleList: [], // 标签胶囊特征
  sizeCapsuleList: [], // 大小胶囊特征
  barLineList: [], // 组合图临时特征
  openStatus: 0, // 画布左右两边展开状态, 0:两边都收起,1:左边展开，右边收起，2:右边展开,左边收起,
  filterList: [], // 当前画布关联的过滤器列表
  filterAllList: [], // 过滤器列表
  fontColor: '#6B6B6B', // 画布字体颜色
  chartConfig: {}, // 画图后的ins // add by lss 20200701
  chartFormat: {}, // 图表格式存储
  loAndLatFlag: false,
  fontSizeOptions: [
    { name: 12, id: 12 },
    { name: 14, id: 14 },
    { name: 16, id: 16 },
    { name: 18, id: 18 },
    { name: 20, id: 20 },
    { name: 22, id: 22 },
    { name: 26, id: 26 },
    { name: 28, id: 28 },
    { name: 36, id: 36 },
    { name: 48, id: 48 },
    { name: 56, id: 56 },
  ],
  modelFilterShow: false, // 建模特征过滤panel
  modelResultShow: false, // 建模结果展示
  modelStatus: '', // 建模状态
  modelTime: '', // 建模时间
  chartArrys: [],
  viewMode: 'standard',
};

const mutations = {
  setCanvasList (state, array) {
    state.canvasList = array;
  },
  setCurrentCanvas (state, object) {
    state.currentCanvas = JSON.parse(JSON.stringify(object));
  },
  setCurrentCanvasDetail (state, object) {
    state.currentCanvasDetail = JSON.parse(JSON.stringify(object));
  },
  setCanvasNum (state, number) {
    state.canvasNum = number;
  },
  setCanvasType (state, string) {
    state.canvasType = string;
  },
  setCatList (state, array) {
    state.catList = array;
  },
  setAggrList (state, array) {
    state.aggrList = array;
  },
  setColumnList (state, array) {
    state.columnList = array;
  },
  setRowList (state, array) {
    state.rowList = array;
  },
  setColorCapsuleList (state, array) {
    state.colorCapsuleList = array;
  },
  setLabelsCapsuleList (state, array) {
    state.labelsCapsuleList = array;
  },
  setSizeCapsuleList (state, array) {
    state.sizeCapsuleList = array;
  },
  setBarLineList (state, array) {
    state.barLineList = array;
  },
  setOpenStatus (state, number) {
    state.openStatus = number;
  },
  setFilterList (state, array) {
    state.filterList = array;
  },
  setFilterAllList (state, array) {
    state.filterAllList = array;
  },
  setFontColor (state, string) {
    state.fontColor = string;
  },
  setChartConfig (state, object) {
    state.chartConfig = object;
  },
  setChartFormat (state, object) {
    state.chartFormat = object;
  },
  setLoAndLatFlag (state, boolean) {
    state.loAndLatFlag = boolean;
  },
  setChartArrys (state, array) {
    state.chartArrys = array;
  },
  setViewMode (state, val) {
    state.viewMode = val;
  },
  setModelFilterShow (state, boolean) {
    state.modelFilterShow = boolean;
  },
  setModelStatus (state, str) {
    state.modelStatus = str;
  },
  setModelResultShow (state, boolean) {
    state.modelResultShow = boolean;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
};
