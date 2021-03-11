import ChartRule from './chart.js';
import ChainFactory from '../chainFactory.js';

function BarRotatedRule (target, capsuleType, context) {
  ChartRule.call(this, target, capsuleType, context);
}
BarRotatedRule.prototype = Object.create(ChartRule.prototype);
BarRotatedRule.prototype.draggingTipsFlag = function ([targetType, flag, featureName]) {
  let that = this;
  let chainAllowNum = new ChainFactory(that.allowNumFlag);
  let chainSameFeature = new ChainFactory(that.sameFeatureFlag);
  chainAllowNum.setNext(chainSameFeature);
  return chainAllowNum.start({
    target: targetType,
    capsuleType: that.capsuleType,
    context: that.context,
    curContext: that,
    flag: flag,
    featureName: featureName
  });
};
BarRotatedRule.prototype.allowNumFlag = function ({
  target,
  capsuleType,
  context,
  flag,
  featureName
}) {
  if (capsuleType === 'int' && target === 'row') {
    return {
      txt: context.$t('message.allow_num_tip'),
      showTip: true
    };
  }
  if (capsuleType === 'cat' && target === 'axisLabel') {
    let list = context.columnList;
    let isLimit = true;
    for (let i = 0; i < list.length; i++) {
      if (list[i].left || list[i].right) {
        let left = list[i].left;
        let right = list[i].right;
        for (let j = 0; j < left.length; j++) {
          if (!left[j].color) continue;
          if (left[j].color.feature_name === featureName) {
            isLimit = false;
          }
        }
        for (let j = 0; j < right.length; j++) {
          if (!right[j].color) continue;
          if (right[j].color.feature_name === featureName) {
            isLimit = false;
          }
        }
      } else {
        if (!list[i].color) continue;
        if (list[i].color.feature_name === featureName) {
          isLimit = false;
        }
      }
    }
    if (isLimit) {
      return {
        txt: '只支持数值特征或颜色对应的分类特征',
        showTip: true
      };
    }
  }
  return this.toNext({
    target,
    capsuleType,
    context,
    flag,
    featureName
  });
};

BarRotatedRule.prototype.sameFeatureFlag = function ({
  target,
  capsuleType,
  context,
  flag,
  featureName
}) {
  if (target === 'column' || target === 'row') {
    let listName = target === 'column' ? 'rowList' : 'columnList';
    let list = context[listName];
    let match = list.filter(i => i.name === featureName);
    if (match.length > 0) {
      return {
        txt: context.$t('message.drag_tip'),
        showTip: true
      };
    }
  }
  return {
    showTip: false
  };
};

export default BarRotatedRule;
