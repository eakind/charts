import { getFeatureObj } from '../utils.js';
function Chart (target, capsuleType, context, legend) {
  this.target = target;
  this.capsuleType = capsuleType;
  this.context = context;
  this.legend = legend;
}
Chart.prototype.judeType = function (name) {
  return this.context.aggrList.find((i) => i.feature_name === name)
    ? 'num'
    : 'type';
};
Chart.prototype.allowRepeatFeature = function ({
  target,
  featureName,
  context,
  capsuleType,
}) {
  let obj = { showTip: false };
  let typeList = ['color', 'labels', 'size', 'column', 'row'];
  let listName = [
    'colorCapsuleList',
    'labelsCapsuleList',
    'sizeCapsuleList',
    'columnList',
    'rowList',
  ];
  let index = typeList.indexOf(target);
  if (index > -1 && context[listName[index]]) {
    let match = context[listName[index]].filter(
      (i) => i.name === featureName && i.legend === (typeof this.legend === 'undefined' ? 'SUM' : this.legend) && i.rate === this.rate
    );
    return match.length > 0
      ? {
        txt: context.$t('message.allow_repeat_feature'),
        showTip: true,
      }
      : obj;
  }
  return obj;
};
Chart.prototype.swapFeature = function (list, oldFeatureName, targetType) {
  let curList = JSON.parse(JSON.stringify(list));

  let idx = curList.findIndex((i) => i.feature_name === oldFeatureName);

  if (idx > -1) {
    let obj = getFeatureObj(
      this.target,
      this.context.catList,
      this.context.aggrList
    );
    let keys = Object.keys(this.context.legendMap);
    let matchList = curList.filter((i) => i.name === obj.name);
    if (targetType === 'labels') {
      if (matchList.length > 0) {
        keys = keys.filter((i) => !list.find((m) => m.legend === i));
      }
    }
    if (keys.length > 0) {
      if (obj.dtype === 'AGGR') {
        obj.legend = keys[0];
        if (obj.legend === 'PERCENTILE') {
          obj.probability = 0.5;
        }
      }
      if (curList[idx].canvasType) {
        obj.canvasType = curList[idx].canvasType;
      }
      curList.splice(idx, 1, obj);
    }
  }
  return curList;
};
Chart.prototype.swapSingleFeature = function ([
  list,
  oldFeatureName,
  panel,
  featureName,
  dataType,
]) {
  let targetType = panel.getAttribute('type');
  let obj = this.draggingTipsFlag([targetType, true, featureName, dataType]);
  if (!obj.showTip) {
    return this.swapFeature(list, oldFeatureName, targetType);
  }
  return list;
};
/**
 * 只允许一个特征
 * @param {} target
 * @param {*} targetList ,数值  color labels size
 * @param {*} context
 */
Chart.prototype.allowOneFeatureFlag = function (target, targetList, context) {
  let listName = target + 'CapsuleList';
  if (targetList.indexOf(target) > -1 && context[listName].length > 0) {
    return true;
  }
  return false;
};
export default Chart;
