import Alert from './src/index.vue';
Alert.install = function (Vue) {
  let Constr = Vue.extend(Alert);
  let instance = new Constr();
  instance.$mount(document.createElement('div'));
  document.body.append(instance.$el);
  Vue.prototype.$showAlert = function ({
    type = 'info',
    message = '',
    showIcon = true,
    center = false,
    showConfirmButton = true,
    confirmButtonText = '确定',
    confirmButtonClass = '',
    showCancelButton = false,
    cancelButtonText = '取消',
    cancelButtonClass = '',
    callback = null
  } = {}) {
    instance.type = type;
    instance.message = message;
    instance.center = center;
    instance.showConfirmButton = showConfirmButton;
    instance.confirmButtonText = confirmButtonText;
    instance.confirmButtonClass = confirmButtonClass;
    instance.showCancelButton = showCancelButton;
    instance.cancelButtonText = cancelButtonText;
    instance.cancelButtonClass = cancelButtonClass;
    instance.show = true;
    instance.showIcon = showIcon;
    instance.callback = callback;
  };

  Vue.prototype.$closeAlert = function () {
    instance.show = false;
  };
};
export default Alert
;
