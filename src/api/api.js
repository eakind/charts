export const api = {
  test: '/dccp/feature/detail/',
  login: '/dccp/auth/login/',
  rename: '/dccp/project/rename/',
  detail: '/dccp/project/detail/',
  geoJson: '/geoJson/',
  saveJson: '/dcbi-custom/testPost/',
  getData: '/barData/',

  /*
   * 项目列表接口地址
   * */
  project: '/bi/project/my/', // 查询我的项目列表
  allProject: '/bi/project/list/', // 查询所有项目列表
  inviteeList: '/bi/project/invitees/', // 获取项目可邀请成员列表
  setMember: '/bi/project/member/set/', // 设置项目成员】
  getMember: '/bi/project/members/', // 获取项目成员
  delete: '/dccp/project/member/delete/', // 删除项目成员
  projectDetail: '/dccp/bi/project/detail/', // 获取项目明细
  delProject: '/dccp/bi/project/delete/', // 删除项目
  projectRename: '/bi/project/rename/', // 修改项目名
  // delProFile: '/dccp/project/delete-file/', // 删除项目文件
  logout: '/bi/auth/logout/', // 退出登录
  security: '/dcau/user/security/', // 修改密码

  redo: '/dccp/bi/project/redo/', // 重做
  undo: '/dccp/bi/project/undo/', // 撤销

  /*
   * 新建项目
   * */
  userInfo: '/bi/user/info/', // 获取个人资料
  // myFile: '/bi/files/my/', // 获取文件列表
  deleteFiles: '/dccp/bi/files/delete/', // 删除文件列表

  create: '/dccp/bi/project/create/', // 新建项目
  uploadFile: '/dccp/project/upload-file/', // 上传项目文件

  addFile: '/dccp/project/add-file/', // 添加项目文件

  analyze: '/dccp/bi/project/analyze/', // 数据分析

  /*
   * 画布
   * */
  createCanvas: '/dccp/bi/worksheet/create/', // 新建画布
  deleteCanvas: '/dccp/bi/worksheet/delete/', // 删除画布
  canvasList: '/dccp/bi/worksheet/list/', // 获取画布列表（展板中获取的画布列表相同）
  canvasDetail: '/dccp/bi/worksheet/detail/', // 获取画布明细
  canvasData: '/dccp/bi/worksheet/data/', // 获取画布数据
  reviseTitle: '/dccp/bi/worksheet/title/', // 修改画布标题
  reviseCanvasFeature: '/dccp/bi/worksheet/features/', // 修改画布特征

  featureList: '/dccp/bi/feature/list/', // 获取特征列表
  searchFeature: '/dccp/bi/feature/search/', // 搜索特征
  featureGroup: '/dccp/bi/feature/group/', // 修改特征分组

  featureModify: '/dccp/bi/feature/modify/', // 修改特征

  modifyCss: '/dccp/bi/worksheet/css/', // 修改画布样式
  copyWorksheet: '/dccp/bi/worksheet/copy/', // 复制画布

  featureUnique: '/dccp/bi/feature/unique/', // 获取特征唯一值

  /*
   * 展板
   * */
  createDashboard: '/dccp/bi/dashboard/create/', // 新建展板
  dashboardList: '/dccp/bi/dashboard/list/', // 获取展板列表
  deleteDashboard: '/dccp/bi/dashboard/delete/', // 删除展板
  dashboardDetail: '/dccp/bi/dashboard/detail/', // 获得展板明细
  dashboardTitle: '/dccp/bi/dashboard/title/', // 修改展板标题
  dashboardName: '/dccp/bi/dashboard/name/', // 修改展板名称
  dashboardCss: '/dccp/bi/dashboard/css/', // 修改展板样式
  dashboardLegends: '/dccp/bi/dashboard/legends/', // 修改展板图例列表
  dashboardFloats: '/dccp/bi/dashboard/floats/', // 修改展板浮动元素列表
  dashboardWorksheets: '/dccp/bi/dashboard/worksheets/', // 修改展板画布列表

  uploadImage: '/dccp/bi/dashboard/upload-image/', // 上传展板背景图

  /*
   * 故事模块
   * */
  storyList: '/dccp/bi/story/list/', // 获取故事列表
  storyDetail: '/dccp/bi/story/detail/', // 获取故事明细
  storyModify: '/dccp/bi/story/modify/', // 修改故事

  /*
   * action
   * */
  createAction: '/dccp/bi/action/create/', // 新建action
  modifyAction: '/dccp/bi/action/modify/', // 修改action
  delAction: '/dccp/bi/action/delete/', // 删除action
  getActionList: '/dccp/bi/action/list/', // 获取action列表
  actionClear: '/dccp/bi/action/clear/', // 取消action关联
  actionBatches: '/dccp/bi/action/batches/', // 批量新建action

  /*
   * 过滤器
   * */
  filterDetail: '/dccp/bi/filter/detail/', // 获得过滤器明细
  filterList: '/dccp/bi/filter/list/', // 获取过滤器列表
  filterCreate: '/dccp/bi/filter/create/', // 新建过滤器
  filterDelete: '/dccp/bi/filter/delete/', // 删除过滤器
  filterUnlink: '/dccp/bi/filter/unlink/', // 取消关联
  filterModify: '/dccp/bi/filter/modify/', // 修改过滤器
  filterUnique: '/dccp/bi/filter/unique/', // 过滤器特征唯一值
  filterSearch: '/dccp/bi/filter/search/', // 搜索过滤器唯一值

  filterHide: '/dccp/bi/filter/hide/', // 展板中隐藏过滤器
  filterStart: '/dccp/bi/filter/start/', // 展板中启用过滤器

  /*
   * 上传文件
   * */
  myFile: '/dccp/bi/files/my/', // 获取文件列表
  proDetail: '/dccp/bi/project/detail/', // 项目详细
  setting: '/dccp/bi/project/settings/', // 本地文件设置
  modifySettings: '/dccp/bi/project/settings/modify/', // 修改文件格式设置
  projectJoin: '/dccp/bi/project/join/', // 关联文件与格式
  projectUploadFile: '/dccp/bi/project/upload-file/', // 上传项目文件
  completeUpload: '/dccp/bi/project/complete-upload/', // 完成上传
  projectPreview: '/dccp/bi/project/preview/', // 数据预览
  projectDTypes: '/dccp/bi/project/dtypes/', // 获取数据类型
  modifyDtype: '/dccp/bi/project/modify-dtype/', // 修改数据类型
  completeModify: '/dccp/bi/project/complete-modify/', // 完成修改

  dbData: '/dccp/bi/project/db/data/', // 获取数据库数据
  dbDetail: '/dccp/bi/project/db/detail/', // 获取数据库信息
  dbAllData: '/dccp/bi/project/db/alldata/', // 获取数据库全部数据
  dbSql: '/dccp/bi/project/db/sql/', // 数据库修改SQL

  addProjectFile: '/dccp/bi/project/add-file/', // 添加项目文件
  delProFile: '/dccp/bi/project/delete-file/', // 删除项目文件
  enterProject: '/dccp/bi/project/enter/', // 进入替换/增加数据模式
  exitProject: '/dccp/bi/project/exit/', // 退出替换/增加数据模式
  fileList: '/dccp/bi/project/file-list/', // 获取本地文件列表

  /*
   * 模板
   */
  templateList: '/dccp/bi/template/list/', // 获取模板列表
  templateData: '/dccp/bi/template/data/', // 获取模板数据格式
  templateExample: '/dccp/bi/template/example/', // 获取模板展板示例
  templateDownload: '/dccp/bi/template/download/', // 下载数据模板

  worksheetView: '/dccp/bi/worksheet/view/', // 查看画布原数据

  // 建模
  modelDetail: '/dccp/bi/model/detail/', // 获取建模信息
  modelSelectedStatus: '/dccp/bi/model/selected-status/', // 获取选取特征状态
  modelList: '/dccp/bi/model/list/', // 获取选取特征列表
  modelSelected: '/dccp/bi/model/selected/', // 修改选取特征
  modelSelectedList: '/dccp/bi/model/selected-list/', // 修改选取特征列表
  modelTargetDetail: '/dccp/bi/model/target-detail/', // 获取目标特征
  modifyTarget: '/dccp/bi/model/target-modify/', // 修改目标特征(接口有疑问)
  modelFilterList: '/dccp/bi/model/filter-list/', // 获取过滤器列表
  modelFilterCreate: '/dccp/bi/model/filter-create/', // 新增过滤器
  modelFilterDelete: '/dccp/bi/model/filter-delete/', // 删除过滤器

  // 开始建模(ws) modeling model
  modelBuild: '/dccp/bi/model/build/', // 开始建模
  modelParameters: '/dccp/bi/model/parameters/', // 获取建模条件
  modelStatus: '/dccp/bi/model/status/', // 获取建模的状态
  modelLiftChart: '/dccp/bi/model/lift-chart/', // 获取模型准确度
  modelImportance: '/dccp/bi/model/importances/', // 获取模型影响因子
  modelRoc: '/dccp/bi/model/roc/', // 获取模型ROC
  modelGini: '/dccp/bi/model/gini/', // 获取模型GINI
  liftChartDownload: '/dccp/bi/model/lift-chart-download/', // 下载模型准确度数据
  importanceDownload: '/dccp/bi/model/importances-download/', // 下载模型影响因子数据
  rocDownload: '/dccp/bi/model/roc-download/', // 下载模型ROC数据
  giniDownload: '/dccp/bi/model/gini-download/', // 下载GINI数据

  // formula
  fetchFunList: '/dccp/bi/formula/func/list/', // 函数列表
  createFormula: '/dccp/bi/formula/create/', // 创建formula
  editFormula: '/dccp/bi/formula/modify/', // 编辑formula
  fetchFormulaList: '/dccp/bi/formula/list/', // 获取formula 列表
  formulaDetail: '/dccp/bi/formula/detail/', // formula 明细s
  deleteFormula: '/dccp/bi/formula/delete/'

};
