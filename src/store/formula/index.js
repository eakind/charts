let state = {
  //  ['+','-','*','/','||','AND','OR','NOT','ISNULL','=','==','!=','>','>=','<','<=','()'],
  // ['IF','CASE','WHEN','ELSE','END']
  operator: /[\S\s]*(\+|-|\*|\/|\|\||\b(AND)\b|\b(OR)\b|\b(NOT)\b|\b(ISNULL)\b|=|==|!=|^(?!span)>|>=|<(?<!span)$|<=|\(\))/gi,
  condition: /IF|CASE|WHEN|ELSE|END|THEN|GROUPBY/gi,
  string: /\"[^"]*\"/gi,
  formulaId: '',
  formulaObj: {},
  formulaContent: '',
  formulaFunList: [],
  formulaType: {
    ROW: '行级运算',
    AGGR: '聚合运算',
    GROUPBY: '固定聚合运算',
  },
  dataType: {
    STRING: '字符串类型',
    DATETIME: '日期类型',
    INT: '数值类型',
    FLOAT: '浮点数',
  },
  enabled: false,
};
let mutations = {
  setFormulaId(state, id) {
    state.formulaId = id;
  },
  setFormulaContent(state, content) {
    state.formulaContent = content;
  },
  setFormulaFunList(state, list) {
    state.formulaFunList = list;
  },
  setFormulaObj(state, obj) {
    state.formulaObj = obj;
  },
  setEnabled(state, val) {
    state.enabled = val;
  },
  setString(state, val) {
    state.string = val;
  },
  setCondition(state, val) {
    state.condition = val;
  },
  setOperator(state, val) {
    state.operator = val;
  },
};
export default {
  state,
  namespaced: true,
  mutations,
};
