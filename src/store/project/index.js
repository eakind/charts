import i18n from '@/i18n';

const state = {
  projectId: '', // 项目ID
  projectName: '', // 项目名字
  locale: 'zh', // 当前语言
  listType: 'page', // 列表类型，page:显示一页画布/展板，current:显示当前画布/展板
  /**
   * enum 图表类型 db 和 frontend 的映射
   * key: chart type to database, id for alias
   * value: chart type for web and mc(multiCat), type for alias
   * 注意同时修改 state, getters 中的各枚举
   */
  worksheetTypesList: [ // 图表列表渲染顺序
    '02', '01', '03', '04', '05', '06', '07', '08', '09', // '10', '11',
  ],
  worksheetTypes: { // chart types
    '02': 'bar',
    '01': 'table',
    '03': 'bar-rotated',
    '04': 'bar-line',
    '05': 'line',
    '06': 'pie',
    '07': 'bubble',
    '08': 'map',
    '09': 'scatter',
    10: 'area',
    11: 'funnel',
  },
  worksheetTypesIconMap: { // icons
    '02': 'icon-chart_gray_columnar',
    '01': 'icon-chart_gray_table',
    '03': 'icon-chart_gray_bar',
    '04': 'icon-chart_gray_multi',
    '05': 'icon-chart_gray_line',
    '06': 'icon-chart_gray_pie',
    '07': 'icon-chart_gray_bubble',
    '08': 'icon-chart_gray_map',
    '09': 'icon-chart_gray_scatter',
    10: 'icon-chart_gray_line',
    11: 'icon-chart_gray_scatter',
  },
  worksheetTypesIconActiveMap: {
    '02': 'icon-chart_gray_columnar-active',
    '01': 'icon-chart_gray_table-active',
    '03': 'icon-chart_gray_bar-active',
    '04': 'icon-chart_gray_multi-active',
    '05': 'icon-chart_gray_line-active',
    '06': 'icon-chart_gray_pie-active',
    '07': 'icon-chart_gray_bubble-active',
    '08': 'icon-chart_gray_map-active',
    '09': 'icon-chart_gray_scatter-active',
    // 10: 'icon-chart_gray_line-active',
    // 11: 'icon-chart_gray_scatter-active',
  },
  newWorksheetTypesIconMap: { // icons
    '02': 'icon-db_chartColumn',
    '01': 'icon-db_chartTable',
    '03': 'icon-db_chartBar',
    '04': 'icon-db_chartCombine',
    '05': 'icon-db_chartLine',
    '06': 'icon-db_chartPie',
    '07': 'icon-db_chartBubble',
    '08': 'icon-db_chartMap',
    '09': 'icon-db_chartScatter',
    10: 'icon-db_chartArea',
    11: 'icon-db_chartFunnel',
  },
  isPreview: false,
  createChart: false,
  successFileList: [],
  faileFileList: [],
  settingsId: '',
  selectUpload: 0,
  dbObj: {
    dialect: 'mysql',
    database: '',
    host: '',
    port: '3306',
    user: '',
    password: '',
    sql: ''
  },
  createType: '',
  projectStatus: '',
  templateId: '',
  isModifyPw: false,
  timeMap: {
    YEAR: i18n.t('message.year'),
    SEASON: i18n.t('message.season'),
    MONTH: i18n.t('message.month'),
    DAY: i18n.t('message.day'),
    'YEAR,MONTH': i18n.t('message.year_month'),
    'YEAR,MONTH,DAY': i18n.t('message.year_month_day'),
    'YEAR,SEASON': i18n.t('message.year_season'),
    HOUR: i18n.t('message.hour'),
    MINUTE: i18n.t('message.minute'),
    SECOND: i18n.t('message.second')
  }, // 时间特征映射
  legendMap: {
    SUM: i18n.t('message.sum'),
    MEDIAN: i18n.t('message.median'),
    MODE: i18n.t('message.mode'),
    MAX: i18n.t('message.max'),
    MIN: i18n.t('message.min'),
    PERCENTILE: i18n.t('message.percentile'),
    VAR: i18n.t('message.sample_variance'),
    VARP: i18n.t('message.overall_variance'),
    STDEV: i18n.t('message.sample_sd'),
    STDEVP: i18n.t('message.overall_sd'),
    MEAN: i18n.t('message.mean'),
    Count: i18n.t('message.count'),
    CountD: `${i18n.t('message.dimension')}`
  }, // 聚合函数对象
  chartDataMap: {
  }, // 存储项目画布数据
  exportPare: {
    table: 'mcTableChart',
    pie: 'mcPieChart',
    map: 'mcMapChart',
    bubble: 'mcBubbleChart',
    bar: 'mcBarChart',
    line: 'mcLineChart',
    scatter: 'mcScatterChart',
    'bar-line': 'mcBarLineChart',
    'bar-rotated': 'mcBarRotatedChart'
  }
};

const getters = {
  worksheetTypesNameMap: state => type => { // chart names
    const strMap = {
      '02': i18n.t('message.bar'),
      '01': i18n.t('message.table'),
      '03': i18n.t('message.bar_rotate'),
      '04': i18n.t('message.bar_line'),
      '05': i18n.t('message.line'),
      '06': i18n.t('message.pie'),
      '07': i18n.t('message.bubble'),
      '08': i18n.t('message.map'),
      '09': i18n.t('message.scatter'),
    };
    return strMap[type];
  }
};

const mutations = {
  setProjectId (state, projectId) {
    state.projectId = projectId;
  },
  setProjectName (state, projectName) {
    state.projectName = projectName;
  },
  setLocale (state, str) {
    state.locale = str;
  },
  setListType (state, str) {
    state.listType = str;
  },
  setIsPreview (state, boolean) {
    state.isPreview = boolean;
  },
  setCreateChart (state, boolean) {
    state.createChart = boolean;
  },
  setSuccessFileList (state, array) {
    state.successFileList = array;
  },
  setFaileFileList (state, array) {
    state.faileFileList = array;
  },
  setSettingsId (state, id) {
    state.settingsId = id;
  },
  setSelectUpload (state, num) {
    state.selectUpload = num;
  },
  setDbObj (state, obj) {
    state.dbObj = obj;
  },
  setCreateType (state, str) {
    state.createType = str;
  },
  setProjectStatus (state, str) {
    state.projectStatus = str;
  },
  setTemplateId (state, str) {
    state.templateId = str;
  },
  setChartDataMap (state, object) {
    state.chartDataMap = object;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};
