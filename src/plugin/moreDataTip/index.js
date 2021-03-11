import moreDataTip from './src/index.vue';

moreDataTip.install = function (Vue) {
  let Constructor = Vue.extend(moreDataTip);
  let ins = new Constructor();
  ins.$mount(document.createElement('div'));
  document.body.appendChild(ins.$el);
  Vue.prototype.$showMoreDataTip = function ({
    cb,
    num,
    rowList,
    columnList,
    colorList,
    labelList
  }) {
    ins.callBack = cb;
    ins.num = num;
    ins.rowList = rowList;
    ins.columnList = columnList;
    ins.colorList = colorList;
    ins.labelList = labelList;
    ins.isMore();
    return ins;
  };
  Vue.prototype.$closeMoreDataTip = function () {
    ins.show = false;
  };
};
export default moreDataTip;
