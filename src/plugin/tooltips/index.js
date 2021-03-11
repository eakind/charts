import tooltips from './src/index.vue';

tooltips.install = function (Vue) {
  let Constructor = Vue.extend(tooltips);
  let ins = new Constructor();
  ins.$mount(document.createElement('div'));
  document.body.appendChild(ins.$el);
  Vue.prototype.$showTooltips = function ({
    target,
    firstText,
    secondText,
    thirdText,
    firstFunc,
    secondFunc,
    thirdFunc
  }) {
    ins.show = true;
    ins.setPos.left = target.getBoundingClientRect().left - 60 + 'px';
    ins.setPos.top = target.getBoundingClientRect().bottom + 10 + 'px';
    ins.firstText = firstText;
    ins.secondText = secondText;
    ins.thirdText = thirdText;
    ins.firstCallBack = firstFunc;
    ins.secondCallBack = secondFunc;
    ins.thirdCallBack = thirdFunc;
    return ins;
  };
  Vue.prototype.$closeTooltips = function () {
    ins.show = false;
  };
};
export default tooltips;
