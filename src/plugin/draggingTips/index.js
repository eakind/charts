import draggingTips from './src/index.vue';
draggingTips.install = function (Vue) {
  let Cons = Vue.extend(draggingTips);
  let ins = new Cons();
  ins.$mount(document.createElement('div'));
  document.body.appendChild(ins.$el);
  Vue.prototype.showDraggingTips = function ({ txt, pos }) {
    ins.pos = pos;
    ins.show = true;
    ins.txt = txt;
  };
  Vue.prototype.hideDraggingTips = function () {
    ins.show = false;
  };
  Vue.prototype.modifyPosition = function ({ pos }) {
    ins.pos = pos;
  };
};
export default draggingTips;
