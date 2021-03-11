import confirmBox from './src/index.vue';

confirmBox.install = function (Vue) {
  let Constructor = Vue.extend(confirmBox);
  let ins = new Constructor();
  ins.$mount(document.createElement('div'));
  document.body.appendChild(ins.$el);
  Vue.prototype.$showConfirmBox = function ({
    title,
    message,
    confirmText = '确定',
    cancelText = '取消',
    confirm,
    cancel,
    hasSelect,
    hasInput,
    inputValue,
    selectList,
    selectText = '指定特征'
  }) {
    ins.show = true;
    ins.title = title;
    ins.message = message;
    ins.confirmText = confirmText;
    ins.cancelText = cancelText;
    ins.clickConfirm = confirm;
    ins.clickCancel = cancel;
    ins.hasSelect = hasSelect;
    ins.hasInput = hasInput;
    ins.selectList = selectList;
    ins.selectText = selectText;
    ins.inputValue = inputValue;
    ins.selectValue = '';
    return ins;
  };
  Vue.prototype.$closeConfirmBox = function () {
    ins.show = false;
  };
};
export default confirmBox;
