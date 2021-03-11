import { cloneDeep } from 'lodash';

const mutations = {
  // 设置用户信息
  setUserInfo (state, object) {
    state.userInfo = object;
  },
  // 设置是否修改密码
  setIsModifyPw (state, boolean) {
    state.isModifyPw = boolean;
  },
  // 设置是否创建画布
  setIsCreateCanvas (state, boolean) {
    state.isCreateCanvas = boolean;
  },
  // 设置是否创建展板
  setIsCreateDashboard (state, boolean) {
    state.isCreateDashboard = boolean;
  },
  setIsExport (state, boolean) {
    state.isExport = boolean;
  },
  setInitState (state) {
    state.initState = cloneDeep(state); // JSON.parse(JSON.stringify(state));
  },
  // 重置vuex状态
  resetVuex (state) {
    const other = {
      userInfo: true,
      colors: true,
      initState: true
    };
    Object.keys(state).forEach(item => {
      if (!other[item]) {
        if (state[item] instanceof Object) {
          Object.keys(state[item]).forEach(childItem => {
            state[item][childItem] = state.initState[item][childItem];
          });
        } else {
          state[item] = state.initState[item];
        }
      }
    });
  }
};

export default mutations;
