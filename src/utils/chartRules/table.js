import ChartRule from './chart.js';
import ChainFactory from '../chainFactory.js';
/**
 *
 * @param {目标对象} target
 * @param {胶囊类型 cat num } capsuleType
 * @param {vue 实例} context
 */
function TableRule (target, capsuleType, context) {
  ChartRule.call(this, target, capsuleType, context);
}
TableRule.prototype = Object.create(ChartRule.prototype);

/**
 *
 * @param {column row color label 等等} targetType
 * @param {是否是交换特征} flag
 */
TableRule.prototype.draggingTipsFlag = function ([targetType, flag, featureName]) {
  let that = this;
  var chainAllowCat = new ChainFactory(that.allowCatFlag);
  let chainNumLabel = new ChainFactory(that.labelNumFlag);
  let chainSameFeature = new ChainFactory(that.sameFeatureFlag);
  let chainMaxNum = new ChainFactory(that.maxNumFlag);
  let chainMaxColor = new ChainFactory(that.maxColorFlag);
  let chainAllowRepeatFeature = new ChainFactory(that.allowRepeatFeature);
  chainAllowCat.setNext(chainNumLabel).setNext(chainSameFeature).setNext(chainMaxNum).setNext(chainMaxColor).setNext(chainAllowRepeatFeature);

  return chainAllowCat.start({
    target: targetType,
    capsuleType: that.capsuleType,
    context: that.context,
    curContext: that,
    flag: flag,
    featureName: featureName
  });
};
// TableRule.prototype.swapSingleFeature = function ([list, oldFeatureName, panel]) {
//   let targetType = panel.getAttribute('type');
//   let obj = this.draggingTipsFlag([targetType, true, oldFeatureName]);
//   if (!obj.showTip) {
//     return this.swapFeature(list, oldFeatureName);
//   }
//   return list;
// };
/**
 * target {column row color label 等等} targetType
 * @param {*} param0
 */
TableRule.prototype.allowCatFlag = function ({
  target,
  capsuleType,
  context,
  flag,
  featureName,
  curContext
}) {
  if ((capsuleType === 'cat' && target === 'color') || (capsuleType === 'cat' && target === 'labels')) {
    return {
      txt: context.$t('message.allow_cat_tip'),
      showTip: true
    };
  }
  return this.toNext({
    target,
    capsuleType,
    context,
    flag,
    featureName,
    curContext
  });
};

TableRule.prototype.labelNumFlag = function ({
  target,
  capsuleType,
  context,
  flag,
  featureName,
  curContext
}) {
  if (capsuleType === 'int' && target === 'labels') {
    // 判断是否有数值特征，有就提示
    let matchCol = context.columnList.filter(i => i.type !== 'CAT');
    let matchRow = context.rowList.filter(i => i.type !== 'CAT');
    if (matchCol.length > 0 || matchRow.length > 0) {
      return {
        txt: context.$t('message.allow_one_table_num_tip'),
        showTip: true
      };
    }
  }
  return this.toNext({
    target,
    capsuleType,
    context,
    flag,
    featureName,
    curContext
  });
};

TableRule.prototype.sameFeatureFlag = function ({
  target,
  capsuleType,
  context,
  flag,
  featureName,
  curContext
}) {
  if ((capsuleType === 'cat' && target === 'row') || (capsuleType === 'cat' && target === 'column')) {
    let list = target === 'row' ? context.columnList : context.rowList;
    let match = list.find(i => i.name === featureName);
    if (match) {
      return {
        txt: context.$t('message.drag_tip'),
        showTip: true
      };
    }
  }
  return this.toNext({
    target,
    capsuleType,
    context,
    flag,
    featureName,
    curContext
  });
};
TableRule.prototype.maxNumFlag = function ({
  target,
  capsuleType,
  flag,
  context,
  featureName,
  curContext
}) {
  if ((capsuleType === 'int' && target === 'row') || (capsuleType === 'int' && target === 'column')) {
    let list = target === 'row' ? context.columnList : context.rowList;
    let matchLabel = context.labelsCapsuleList.filter(i => i.type !== 'CAT');
    let match = list.find(i => context.aggrList.filter(n => n.feature_name === i.name).length > 0);
    if (match || matchLabel.length > 0) {
      return {
        txt: context.$t('message.allow_one_table_num_tip'),
        showTip: true
      };
    }
  }
  return this.toNext({
    target,
    capsuleType,
    flag,
    context,
    featureName,
    curContext
  });
};

TableRule.prototype.maxColorFlag = function ({
  target,
  capsuleType,
  flag,
  context,
  featureName,
  curContext
}) {
  let showFlag = curContext.allowOneFeatureFlag(target, ['color'], context);
  if (showFlag && !flag) {
    return {
      showTip: true,
      txt: context.$t('message.allow_one_feature'),
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

export default TableRule;
