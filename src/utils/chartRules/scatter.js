import ChartRule from './chart.js';
import ChainFactory from '../chainFactory.js';

function ScatterRule (target, capsuleType, context) {
  ChartRule.call(this, target, capsuleType, context);
}
ScatterRule.prototype = Object.create(ChartRule.prototype);
/**
 *
 * @param {*} targetType
 * @param {是否是交换特征} flag
 */
ScatterRule.prototype.draggingTipsFlag = function ([targetType, flag, featureName]) {
  let that = this;
  var chainAllowCat = new ChainFactory(that.allowCatFlag);
  let chainAllowRepeatFeature = new ChainFactory(that.allowRepeatFeature);
  let chainColorMaxFeature = new ChainFactory(that.colorSizeMaxFeatureFlag);
  chainAllowCat.setNext(chainColorMaxFeature).setNext(chainAllowRepeatFeature);
  return chainAllowCat.start({
    target: targetType,
    capsuleType: that.capsuleType,
    context: that.context,
    curContext: that,
    flag: flag,
    featureName: featureName
  });
};
// ScatterRule.prototype.swapSingleFeature = function ([list, oldFeatureName, panel]) {
//   let targetType = panel.getAttribute('type');
//   let obj = this.draggingTipsFlag([targetType, true, oldFeatureName]);
//   if (!obj.showTip) {
//     return this.swapFeature(list, oldFeatureName);
//   }
//   return list;
// };
ScatterRule.prototype.allowCatFlag = function ({
  capsuleType,
  target,
  featureName,
  context,
  flag,
  curContext
}) {
  if ((capsuleType === 'cat' && target === 'size') || (capsuleType === 'cat' && target === 'row') || (capsuleType === 'cat' && target === 'column')) {
    return {
      txt: context.$t('message.allow_cat_tip'),
      showTip: true
    };
  }
  return this.toNext({
    capsuleType,
    target,
    featureName,
    context,
    flag,
    curContext
  });
};
ScatterRule.prototype.colorSizeMaxFeatureFlag = function ({
  capsuleType,
  target,
  featureName,
  context,
  flag,
  curContext
}) {
  let showFlag = curContext.allowOneFeatureFlag(target, ['color', 'size'], context);
  if (showFlag && !flag) {
    return {
      showTip: true,
      txt: context.$t('message.allow_one_feature'),
    };
  }
  let list = context[target + 'List'] || [];
  if (!flag && (target === 'column' || target === 'row') && list.find(i => i.dtype === 'AGGR')) {
    return {
      showTip: true,
      txt: context.$t('message.allow_one_num_feature'),
    };
  }

  return this.toNext({
    capsuleType,
    target,
    featureName,
    context,
    curContext
  });
};
export default ScatterRule;
