import backend from './backend';
import projectList from './pages/projectList';
import dashboard from './pages/dashboard';
import home from './pages/home';

let message = {
  view_name: '比例大小',
  name: 'English',
  user_management: 'USERS',
  search: 'Search',
  project_search: 'Search',
  sort_by_time: 'Sort by time',
  filter: 'Filter',
  upload: 'Upload',
  analyze: 'Analysis',
  model: 'Model',
  deploy: 'Deployed',
  delete: 'Delete',
  view_all: 'all projects',
  view_mine: 'my projects',
  new_project: 'New Project',
  time_updated: 'Modified',
  time_created: 'Created',
  files_uploaded: 'files',
  etc: 'and other',
  unit: 'files',
  edit: 'Edit',
  project_name: 'Project Name',
  create_new_project: 'new project',
  named_new_project: 'New Project Name',
  upload_new_files: 'Upload new data files',
  add_files: 'Add Files',
  add_old_files_from_list: 'Select from existing data files',
  old_files_list: 'Existing data files',
  create_canvas: 'Create new canvas',
  new_canvas: 'New canvas',
  dashboard: 'Dashboard',
  canvas: 'Canvas',
  classification_features: 'Categorical',
  numerical_features: 'Numeric',
  filters: 'Filter',
  drop_features: 'Drag Features',
  drop_int_features: 'Drag Numeric Features',
  drop_cat_features_max_one: 'At most 1 categorical feature.',
  drop_num_features_min_one: 'Drag numeric feature.',
  drop_num_max_one_while_cat_exists: 'At most 1 numeric feature while categorical feature effects',
  feature_engineering: 'Feature Calculation',
  save: 'Save',
  labels: 'Label',
  size: 'Size',
  columns: 'Column',
  rows: 'Row',
  dimensions: 'Dimension',
  measures: 'Measure',
  compare: 'Compare',
  legends: 'Colors',
  fills_and_size: 'Size',
  small: 'Small',
  big: 'Large',
  location: 'Geocoding',
  color: 'Color',
  collapse: 'Collapse',
  remove: 'Remove',
  link_canvas: 'Linked Canvas',
  select: 'Select',
  exclude: 'Exclude',
  select_all: 'All',
  filter_value: 'Values',
  create_group: 'Create Group',
  drill_down: 'Drill Down',
  drill_up: 'Drill Up',
  aggregate_function: 'Aggregation Functions',
  digit_format: 'Data Format',
  percent: 'Percentage',
  currency_format: 'Currency',
  sum: 'Sum',
  median: 'Median',
  mode: 'Mode',
  max: 'Max',
  min: 'Min',
  percentile: 'Percentile',
  sample_variance: 'Variance',
  overall_variance: 'Variance(pop.)',
  sample_sd: 'Std. Dev',
  overall_sd: 'Std. Dev(pop.)',
  mean: 'Average',
  count: 'Count',
  dimension: 'Dimension',
  unique: 'Unique',
  decimal_number: 'Decimal',
  negative_val_dispaly: 'Negative Values',
  units: 'Unit',
  preffix: 'Prefix',
  suffix: 'Suffix',
  select_zone: 'Locale',
  create_combined_features: 'Create Combined Feature',
  create_group_features: 'Create Hierarchy',
  create_level_features: 'Create Group Feature',
  group_name: 'Group Name',
  loading: 'Loading data, please wait…',
  zoom_in_out: 'Zoom in/out',
  table: 'Table',
  pie: 'Pie Chart',
  map: 'Map',
  bar: 'Bar Chart',
  bar_rotate: 'Horizontal Bar',
  bubble: 'Bubble Chart',
  scatter: 'Scatter Plot',
  line: 'Line Chart',
  bar_line: 'Combined Chart',
  area: 'Area Chart',
  funnel: 'Funnel Plot',
  place_left: 'Left',
  place_right: 'Right',
  add_features: 'Add features',
  all: 'All',
  confirmed: 'Confirm',
  cancel: 'Cancel',
  back: 'Back',
  logout: 'Logout',
  view_data: 'View data',
  next_step: 'next',
  set_name: 'Please set a name',
  check_projectname: 'project name',
  submit_data: 'submit data',
  preview_message: 'Click the button to change the data type。',
  suggest_modification: 'suggest modification',
  system_identification: 'system identification',
  keep_content: 'Please choose whether to keep the content',
  save_and_return: 'save and return',
  only_return: 'only return',
  keep_modify: 'Please choose whether to keep the content',
  save_data_return: 'save and return',
  save_update_return: '保留更新并返回',
  give_up_return: ' 放弃更新并返回',
  only_return_data: 'only return',
  select_chart_type: 'Please select a chart type to create the first canvas. ',
  canvas_background: 'The system provides color and picture background for reference',
  start_edit: 'Start editing',
  add_canvas: 'Add canvas',

  data: 'Data',
  data_label: 'Data labels',
  data_label_show: 'Visible labels',
  data_color: 'Data colors',
  color_schemes: 'Schemes',
  color_pure: 'Pure colors',
  color_palette: 'Palette',
  color_recently: 'Recently used',
  color_custom_tip: 'Pick color from the palette',

  funnel_shape: 'Funnel shape',
  trapezium: 'Trapezium',
  pyramid: 'Pyramid',
  funnel_conversion: 'Conversion',
  funnel_compare_layout: 'Comparing layout',
  inner_outer: 'Inner & outer',
  left_right: 'Horizontal',

  selected_files: 'Selected Files',
  standard_view: 'Standard',
  fit_width: 'Fit Width',
  fit_height: 'Fit Height',
  full_view: 'Full',
  text_setting: 'Font',
  table_setting: 'Table Format',
  font_size: 'Font Size',
  font_height: 'Spacing',
  line_height: 'Line',
  inner_height: 'Padding',
  outter_border: 'Outline',
  inner_border: 'Inside Borders',
  top: 'Top',
  bottom: 'Bottom',
  left: 'Left',
  right: 'Right',
  line_width: 'Line Width',
  point_style: 'Data Point',
  chart_layout: 'Layout',
  opacity: 'Opacity',
  use_palette: 'Palette',
  no_charts: 'No charts available',
  please: 'Please ',
  input: 'drag in ',
  feaures: 'feaures',
  default: 'Default',
  cross: 'Cross',
  cross45: 'X',
  triangle: 'Triangle',
  triangle180: 'Inverted Triangle',
  square: 'Square',
  diamond: 'Diamond',
  star: 'Star',
  layout1: 'Layout 1',
  layout2: 'Layout 2',
  type_line: 'L',
  type_bar: 'C',
  folding: 'Fold',
  add: 'Add',
  pack_up: 'Fold',
  unfold: 'Unfold',

  cancel_calculation: 'Quit',
  string: 'String',
  numeric: 'Numeric',
  float: 'Float',
  map: 'Geocoding',
  operate: 'Operate',
  wait_while_operating: 'Under calculating...',
  know_it: 'Get it',
  fail_and_the_reason_is: 'Calculation failed. Beacause',
  operate_success: 'Successed',
  operate_fail: 'Failed',
  calculation: 'Calculation',
  time_variable: 'Time Variables',
  spatial_variable: 'Geocoding',
  fill_missing: 'Data Filling',
  section: 'Section',
  int: 'Int',
  float_to_int: 'Float to Int',

  db_space_for_title: 'Title',
  db_space_for_canvas: 'Canvas',
  db_put_canvas_here: 'Canvas here',
  db_place_for_filters: 'Colors & Filters',
  db_create_new_dashboard: 'New Dashboard',
  db_pre_set: 'Presets',
  db_dashboard: 'Dashboard ',
  db_width: 'Width',
  db_height: 'Height',
  db_border: 'Border',
  db_color_pattern: 'Colors',
  db_background_color: 'Background Color',
  db_uploaded_pic: 'Uploaded Pics',

  db_or: 'or',
  db_print: 'Print',
  db_present: 'Present',
  db_projection: 'Projection',
  db_normal: 'General',
  db_web: 'Web-Large',
  db_choose_pic: 'Choose a pic',
  db_canvas_list: 'Canvas List',
  db_add_element: 'Add Elements',
  db_text: 'Text',
  db_pic: 'Pic',
  db_remove_element: 'Reduce Elements',
  db_hide: 'Hide',
  db_display: 'Display',
  db_title: 'Title',
  db_location: 'Position & Size',
  db_setting: 'Setting',
  db_done: 'Done',
  db_start_using: 'Use',
  db_format: 'Format',
  db_filter_info: 'Apply actions to check the connection between canvas.',
  db_interaction: 'Action',
  db_unfold_all: 'unfold',
  db_fold_fail: 'hide invalid data',
  db_canvas_filter: 'Canvas Filters',
  db_filter_warm: 'Changes here will affect the datas in canvas.',
  db_action_list: 'Linked Canvas',
  db_canvas_start: 'Source',
  db_canvas_end: 'Target',
  db_edit_filter: 'Edit Filter',
  db_auto_interact: 'Features Linked automatically',
  db_handly_interact: 'Manual Action',
  db_action_info: 'Hints',
  db_action_info1: 'Choose a canvas as the source.',
  db_action_info2: 'Choose a canvas as the target.',
  db_action_info3: 'Arrows show the relations between canvas.',
  db_action_info4: 'Choose the action from the list on the left side. You will find features linked automatically and can manually edit them.',
  db_finish_action: 'Quit action',
  db_action_fail: 'Unable to create the action, please choose canvas again.',
  db_layout_fixed: 'Fix',
  db_layout_float: 'Float',
  db_layout: 'Layout',
  db_zoom: 'Zoom',
  db_full_screen: 'Fullscreen',
  db_exit_full_screen: 'Quit',

  year: 'Year',
  season: 'Quarter',
  month: 'Month',
  day: 'Day',
  hour: 'Hour',
  minute: 'Minute',
  second: 'Second',
  year_month: 'YYYY-MM',
  year_season: 'Quarter(Y)',
  year_month_day: 'YYYY-MM-DD',
  date_time: 'Date & Time',
  appoint_time_format: 'Specify a time format',
  user_defined: 'Custom',
  or_select_time: 'or select a format',
  select_time_format: 'Select a format',
  equal_partition: 'Equal Partition',
  portion: 'Portion',
  select_spatial_type: 'Select a geocoding type',
  empty_tip: 'Null as default',
  select_fill_value: 'Select a function',
  select_value: 'Specify Value',
  user_defined_value: 'Custom',
  user_defined_deficiency: 'Custom nulls',
  invalid_numeric_value: 'Replace invalid numerics with nulls',
  select_tip: 'Please select',
  no_appoint: 'unspecific',
  semicolon: 'permillage(‰)',
  percent_sign: 'percent(%)',
  province: 'Province',
  city: 'City',
  district: 'District',
  zip_code: 'Zip Code',
  area_code: 'Area Code',
  city_code: 'District Code',
  address: 'Location',
  lo_and_lat: 'Long & Lat',
  latitude_tip: 'Latitude',
  longitude_tip: 'Longitude',
  save_chart: 'Save as pics',
  export_data: 'Export Data',
  whole_chart: 'Whole Canvas',
  split_chart: 'Separate Charts',
  select_canvas: 'Select a canvas',
  select_save_format: 'Choose a format',
  alpha_bg: 'transparent background',
  format: 'format',
  save_single: 'Charts will be saved separately.',
  select_data: 'Select the data',
  canvas_data: 'Canvas',
  origin_data: 'Source',
  save_board_pic: 'Save as pics',
  create_pic_ing: 'Pics generating...',
  dashboard_set: 'Set',
  dashboard_filter: 'Filter',
  width: 'width',
  height: 'height',

  reset: 'reset',
  used: 'use',
  standard: 'Standard',
  business: 'Business',
  vitality: 'Dynamic',
  simple: 'Simple',
  strong: 'Strong',
  fresh: 'Fresh',
  template: 'Palette',
  color_tpl_tip: 'Colors will be used repeatedly.',
  color_tpl_que: 'Colors are not enough for this, still use the template?',
  chart_tip: 'proper',
  origin_canvas: 'Source Features',
  target_canvas: 'Target Features',
  allow_pos_tip: 'Only Geocoding features',
  allow_cat_tip: 'CAT features not supported',
  allow_num_tip: 'AGGR features not supported',
  allow_one_cat: 'Only 1 CAT features',
  allow_drag_tip: 'the features not supported',
  allow_num_color: 'Only AGGR features or features in Colors',
  allow_num_pos: 'Only for Numeric or features that added to Geocoding area.',
  allow_col_tip: 'Repeated CAT features not supported',
  allow_one_feature: 'Only one Feature',
  allow_one_num_feature: '只支持一个数值特征',
  allow_repeat_feature: '不能拖入重复特征',
  allow_one_table_num_tip: '数值特征不能同时存在于标签和行（或列）中',
  rmb: 'RMB',
  jpy: 'JPY',
  hkd: 'HKD',
  usd: 'USD',
  euro: 'EUR',
  gbp: 'GBP',
  thousand: 'thousand',
  million: 'million',
  billion: 'billion',
  myriads: '100 billion',
  cancel_group: 'Ungroup',
  operate_tip: 'Please choose a module.',
  confirm_delete: 'Do you want to delete it?',
  save_image_error: 'Error! Canvas size is too large! Change the view to the full view and try again.',

  color_range: 'Colors',
  size_range: 'Value',
  size_control: 'Overall size',
  example: 'Example',
  applied_in_all_labels: 'Apply to all tags.',
  range: 'Range',
  set_font: 'Font',
  set_data: 'Quantity of Data',
  story_model: 'Story Line',
  exit_story: 'Quit',
  story_message: 'Browse data according to the time sequence in canvas.',
  story_time: 'Create timing',
  story_time_feature: '1.Choose a time feature.',
  story_time_format: '2.Choose a time format.',
  story_show_time: '3.Choose the timing to show the data',
  pre_page: 'Previous',
  next_page: 'Next',
  data_tip: 'Better not to use all the datas when the quantity is too large',
  self_data: 'Quantity of data',
  all_data: 'all datas',
  auto_data: 'The feature includes a large amount of data.',
  set_data_tip: 'You may edit the quantity on the right side.',
  other_data_tip: 'Here show you the top 1000 proportions and the rest as others.',
  more_data_tip: 'It takes times to add this feature due to its large amount of data. Are you sure to add it?',
  yes: 'Yes',
  no: 'No',
  open_edit: 'Edit',
  use_thousand: 'Permillage Mark',
  label_font: 'Font of Tags',
  confirm: 'Confirm',
  story_tip: 'Please add a time feature to your canvas.',
  refresh_story: 'Refresh',
  create_story: 'Create Storyline',
  create_time: 'Please add a timing.',
  undo: 'undo',
  redo: 'redo',
  copy: 'copy',
  export: 'export',
  return_back: 'Project',
  close: 'Collapse',

  filter_tip: 'Edit up to 3 filters at the same time.',

  add_old_file: 'Previous files',
  file_name: 'File Name',
  create_old_file_time: 'Create Time',
  search_file: 'Search',
  search_input_tip: 'Search by name',
  no_file_tip: 'No related files',
  create_project: 'Create A Project',
  project_data: 'Project Data',
  finish_upload: 'Upload Data',
  back_modify: 'Modify data',
  project_name_tip: 'Project Name',
  added_file: 'Added files',
  no_file: 'No related files',
  db_type: 'Database Type',
  db_name: 'Database Name',
  db_server: 'Server',
  db_port: 'Port',
  db_username: 'Username',
  native_file: 'Local files',
  network_file: 'Network files',
  db_file: 'Database',
  file_type_tip: 'Select a file type',
  select_file: 'Select',
  set_format: 'Format Setting',
  finish_set: 'Done',
  set_all_file: 'Apply to all files',
  upload_queue: 'Upload Queue',
  csv_file: 'csv',
  excel_file: 'excel',
  file_code: 'file code',
  auto: 'auto',
  separ_option: 'Separator',
  input_tip: ' ',
  select_str_separ: 'Separator of string',
  str_wrap: 'Line break',
  int_symbol: 'with Thousand Separator?',
  begin_row: 'Start from：',
  line_tip: 'Line',
  line_tip_head: ' ',
  has_title: 'with title?',
  comma: 'Comma(,)',
  y_axis: 'vertical line(|)',
  tab_character: 'Tab(Tab)',
  space: 'Space( )',
  semicolon_character: 'Semicolon',
  colon: 'Colon',
  db_quota: 'Double quotes(")',
  sign_quota: 'Single quotes(\')',
  uploading: 'Uploading',
  begin_upload: 'Upload',
  end_upload: 'Finish',
  get_btn: 'Get',
  no_get_file_tip: 'No files found. Please check your info and try again.',
  input_url_tip: 'http, ftp, hdfs, nfs supportted',
  db_password: 'Password',
  self_sql: 'Custom SQL',
  preview: 'Preview',
  data_preview: 'Data Preview',
  data_type_change: 'Change data type',
  modify_sql: 'Modify SQL',
  get_all_data: 'Get data',
  show_pre: 'Data before line',
  line_data: ' ',
  only_show_modify: 'Only suggested rows',
  upload_file_tip: 'Upload a file.',
  upload_wrong: 'add a file correctly',
  feature_name: 'Feature name',
  data_type: 'Data type',
  no_data_file_tip: 'Please check the data files.',
  time: 'Time',
  into_project: 'Start the project',
  into_canvas: 'To canvas',
  create_project_type: 'Select a type to start your project',
  analyse_project_tip: 'Data will be updated after processing. And you may check it in canvas. ',
  create_chart: 'Creat a canvas',
  begin_analyse: 'Start analyzing',
  del_tip: 'Do you want to delete it?',
  line_record: 'lines',
  has_feature: 'features',
  all_data_tip: 'You may not modify data source after getting all data. Do you want to get all data now?',
  time_date: 'Time',
  input_project_name: 'Please set a project name.',
  upgrade_data: 'Update data',
  giveup_btn: 'Quit update',
  modify_add: 'Replace / Add',
  upgrade_complete_tip: 'You may not modify data source after uploading. Do you want to upload now?',
  hand_create: 'Create manually',
  self_canvas_board: 'Custom your canvas and dashboard',
  use_template: 'Apply to template',
  use_template_tip: 'Apply to given templates(manual modification available)',
  creating_project: 'Creating',
  data_upgrade: 'Updating',
  upgrade_tip: 'Select a way to update data',
  upgrade_alert: 'Please notice that data may be changed after updating',
  replace_data: 'Replace',
  replace_tip: 'Replace previous data with new files.',
  add_data: 'Add',
  add_data_tip: 'Add files to existing data.',
  pie_donut: 'Donut chart',
  pie_circle: 'Pie Chart',

  canvas_format: 'Canvas Style',
  coordinate_axis: 'Axis',
  grid_line: 'Gridlines',
  scale: 'Axis Value',
  axis_line: 'Line',
  product_list: 'Product list',
  layout: 'Layout',
  thicking: 'Weight',
  show_hide: 'Display',
  show_title: 'Title',
  show: 'Show',
  x_axis: 'X',
  y_axle: 'Y',
  grid_color: 'Color',
  line_color: 'Color',
  font_rotate: 'Text orientation.',
  scope_num: 'Scale & Numbers',
  scope_int: 'Scale',
  align_dot: 'Align to origin',
  use_one_method: 'Select a mode',
  select_for_chart: 'Zooming(on canvas)',

  sort_title: 'Sort',
  sort_accord: 'Order',
  add_filter_field: 'Add fields',
  screened: '',
  clear_sort: 'Remove',
  field: 'Field',
  manual_appoint: 'Manual',
  asce_order: 'Ascending(default)',
  desce_order: 'Descending',
  letter: 'In alphabetical order',
  source_order: 'In document order(default)',
  conduct_sort_accord: 'added.',
  etcs: ',etc.',
  sticky_top: 'Top',
  up: 'Up',
  down: 'Down',
  data_loading_tip: 'Loading...',

  show_percent: 'use percentage',
  project_members: 'Project members',
  project_members: 'Project members',
  check_limits: 'Permission Rules',
  remove_from_project: 'remove',
  creator: 'Creator',
  editor: 'Editor',
  viewer: 'Viewer',
  creator_info: 'Assign and edit projects.',
  editor_info: 'Edit projects.',
  viewer_info: 'Browse projects.',
  new_creator_info: 'Assign and edit projects.',
  new_editor_info: 'Edit projects.',
  new_viewer_info: 'Browse projects.',
  creator_warning: 'Please  at least assign one Creator',
  editor_viewer_warning: 'no members',
  new_creator_warning: 'one Creator',
  new_editor_viewer_warning: 'no members',
  member_management: 'member management',
  permission_rules: 'permission rules',
  administrator: 'administrator',
  editor: 'editor',
  viewer: 'viewer',
  all_permissions: 'all permissions',

  input_name_tip: 'New project name',
  back_list: 'Back to project list',
  main_project_name: 'Project name',
  select_format: 'select a format',

  pre_btn: 'Prev',
  next_btn: 'Next',
  sys_busy_tip: 'System busy',
  back_project_list: 'Back to project list',
  drag_tip: 'Do not drag the same feature to row and column',
  unknow_tip: 'Unknow Error, Please try again or refresh',
  reset_password: 'Reset password',
  log_out: 'Log out',
  modify_title: 'Reset personal password',
  old_pw: 'Original password',
  new_pw: 'New password',
  confirm_pw: 'Confirm new password',
  modify_tip: 'password with 6-32 digits',
  log_tip: 'Do not drag latitude and logitude again.',

  select_temp: 'Select a template',
  temp_tip: 'To create Canvas and Dashboard automatically. Fast way to present projects.',
  selected_temp: 'Selected template',
  data_format: 'Data Format',
  download_temp: 'Download a data format',
  temp_example: 'Sample',
  temp_has: 'Dashboard contains canvases as below.',
  custom: 'Chinese',
  min_val: 'Min',
  max_val: 'Max',
  color_template: 'Palette',
  download_tip: 'Please adjust zoom scale to 100% if the dashboard contains map chart.',

  tooltip_box: 'Tooltip Box',
  tooltip_str: 'Tooltip',
  tooltip_data: 'data',
  tooltip_all: 'Applied to all',

  // 未翻译
  add_element: 'Add',
  title: 'Title',
  dashboard_title: 'Dashboard Title',
  set_padding: 'padding',
  element_format: 'Element',
  txt_color: 'Font color',
  txt_size: 'Font size',
  pos: 'position',
  standard_name_tip: '60 bytes at most.',
  select_chart: 'Select a canvas',
  close_btn: 'Close',
  canvas_type: 'Canvas Type',
  background: 'Background',
  canvas_title_tip: '64 bytes at most.',
  board_title_tip: '64 bytes at most.',
  default_color: 'Default',
  first_bg: 'background of 1st canvas',
  self_color: 'Custom Color',
  board_title_txt: 'Dashboard Title',
  board_title_bg: 'Dashboard Background',
  canvas_bg: 'Canvas Background',
  bg_color: 'Background Color',

  on_rate: 'Same period',
  on_rate_grow: 'Same period growth',
  ring_rate: 'Last period',
  ring_rate_grow: 'Last period growth',
  calculate: 'Calculate',
  remove_cal: 'Remove',
  period: 'Period',
  rate_input_tip: 'positive integer',
  default_ring_tip: 'According to Row',
  default_on_tip: 'According to Row',
  default_period: 'Default',
  use_weekly: '(weekly)',
  use_year: '(yearly)',
  on_title: 'Compare with the same period',
  ring_title: 'Compare with last period',
  set_period_tip: 'Please use a positive integer in period.',

  // 未翻译
  title_txt: 'Canvas Title',
  merge_axis: 'share the same axis',
  perfect_align: 'Same scale',
  modify_table_header: 'Header',
  table_header: 'Header',
  table_field: 'Field name',
  default_data: 'Default',
  custom_data: 'Custom',
  table_data_tip: 'the first 100 lines and 1000 rows',
  the_first_1000: 'the first 1000',
  table_all_data_tip: 'deprecated with large amount of data',
  cell_width: 'Cell Width',
  one_more_tip: '最多可放1个分类特征',
  marginStyle: '边框外观',
  tableTitleName: '表头字段名称',
  tableTitleTips: '标题编辑仅用于显示，不对数据名称进行修改',
  resetDefault: '恢复默认',
  originalName: '原名',
  showColumnName: '显示列名',

  area_column: '请放入数值特征',
  fieldName: '字段名称',
  formulaText: 'Equation Formula',
  formulaEditText: 'Edit Formula',
  formulaAddText: 'Add Formula',
  cancelEdit: 'Cancel Edit',
  formulaName: 'Name',
  formulaConfirmBoxText: 'When unediting, do not save the currently edited changes, ok to leave the edit page?',
  formulaTips: 'Currently, it supports three kinds of operations: row-level operation, aggregation operation and fixed aggregation operation',
  formulaAddSuccessText: 'Saved successfully.The result is a string.Has been added to feature list.',
  formulaToDashboard: 'Return to the canvas',
  formulaToList: 'Returns a list of formula',
  editFormulaText: 'Edit formula',
  deleteFormulaText: 'Delete formula',
};
let print = {
  select_boards: 'Dashboards',
  use_print_temp: 'Print Templates',
  exchange_tip: 'A PDF file will be generated by the selected dashboards.',
  print_sort: 'Sort',
  reselect_boards: 'Select',
  dashboard_total: '{n} dashboard selected.',
};

let result = {
  message,
  print,
  backend: backend.enBackend,
  projectList: projectList.enProjectList,
  dashboard: dashboard.enDashboard,
  home: home.enHome
};
export default result;
