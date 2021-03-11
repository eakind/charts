import MessageBox from './src/index.vue';
MessageBox.install = function (Vue) {
  let Cons = Vue.extend(MessageBox);
  let ins = new Cons();
  document.body.appendChild(ins.$mount().$el);
  Vue.prototype.showMessageBox = function (params) {
    let {
      title,
      content,
      sureText,
      sureCb,
      cancelText,
      cancelCb
    } = params;
    ins.title = title;
    ins.content = content;
    ins.sureCb = sureCb;
    ins.sureText = sureText;
    ins.cancelCb = cancelCb;
    ins.cancelText = cancelText;
    ins.show = true;
  };
  Vue.prototype.hideMessageBox = function () {
    ins.show = false;
  };
};
export default MessageBox;
