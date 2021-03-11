import dcMessage from './src/index.vue';

dcMessage.install = function (Vue) {
  let Constr = Vue.extend(dcMessage);
  let ins = new Constr();
  ins.$mount(document.createElement('div'));
  document.body.appendChild(ins.$el);
  Vue.prototype.$showMessage = function ({
    msgType = 'error',
    show = false,
    content = ''
  }) {
    ins.content = content;
    ins.msgType = msgType;
    ins.show = true;
  };
  Vue.prototype.$closeMessage = function () {
    ins.show = false;
  };
};
export default dcMessage;
