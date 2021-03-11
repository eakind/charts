import ChartRule from './chart.js';
import ChainFactory from '../chainFactory.js';

function PieRule (target, capsuleType, context, legend) {
  ChartRule.call(this, target, capsuleType, context, legend);
}
PieRule.prototype = Object.create(ChartRule.prototype);
/**
 *
 * @param {*} targetType
 * @param {是否是交换特征} flag
 */
PieRule.prototype.draggingTipsFlag = function ([targetType, flag, featureName]) {
  let that = this;
  var chainSize = new ChainFactory(that.catSizeFlag);
  var chainAllowCatMax = new ChainFactory(that.allowCatMaxFlag);

  let chainAllowFeatureMax = new ChainFactory(that.allowFeatureMaxFlag);
  let chainAllowRepeatFeature = new ChainFactory(that.allowRepeatFeature);
  chainSize.setNext(chainAllowCatMax).setNext(chainAllowFeatureMax).setNext(chainAllowRepeatFeature);

  return chainSize.start({
    target: targetType,
    capsuleType: that.capsuleType,
    context: that.context,
    curContext: that,
    flag: flag,
    featureName: featureName
  });
};
// PieRule.prototype.swapSingleFeature = function ([list, oldFeatureName, panel]) {
//   let targetType = panel.getAttribute('type');
//   let obj = this.draggingTipsFlag([targetType, true, oldFeatureName]);
//   if (!obj.showTip) {
//     return this.swapFeature(list, oldFeatureName);
//   }
//   return list;
// };
/**
 *
 * @param {*} param0
 */
PieRule.prototype.catSizeFlag = function ({
  target,
  capsuleType,
  context,
  curContext,
  flag,
  featureName
}) {
  if (capsuleType === 'cat' && target === 'size') {
    return {
      txt: context.$t('message.allow_cat_tip'),
      showTip: true
    };
  }
  return this.toNext({
    target,
    capsuleType,
    context,
    curContext,
    flag,
    featureName
  });
};
PieRule.prototype.allowCatMaxFlag = function ({
  target,
  capsuleType,
  context,
  curContext,
  flag,
  featureName
}) {
  if (capsuleType === 'cat' && target === 'labels') {
    let match = context.labelsCapsuleList.find(i => i.dtype === 'CAT');
    if (!flag && match) {
      return {
        txt: context.$t('message.allow_one_cat'),
        showTip: true
      };
    }
  }
  return flag ? { showTip: false } : this.toNext({
    target,
    capsuleType,
    context,
    curContext,
    flag,
    featureName
  });
};
PieRule.prototype.allowFeatureMaxFlag = function ({
  target,
  capsuleType,
  context,
  curContext,
  flag,
  featureName
}) {
  let showFlag = curContext.allowOneFeatureFlag(target, ['color', 'size'], context);
  if (showFlag && !flag) {
    return {
      showTip: true,
      txt: context.$t('message.allow_one_feature'),
    };
  }
  return this.toNext({
    target,
    capsuleType,
    context,
    curContext,
    flag,
    featureName
  });
};
export default PieRule;
