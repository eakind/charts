import ChartRule from './chart.js';
import ChainFactory from '../chainFactory.js';

function MapRule (target, capsuleType, context) {
  ChartRule.call(this, target, capsuleType, context);
}
MapRule.prototype = Object.create(ChartRule.prototype);
/**
 *
 * @param {*} targetType
 * @param {是否是交换特征} flag
 */
MapRule.prototype.draggingTipsFlag = function ([
  targetType,
  flag,
  featureName,
  type,
]) {
  let that = this;
  var chainIsMap = new ChainFactory(that.isMap);
  var chainAllowLoAndLat = new ChainFactory(that.allowLoAndLat);
  var chainAllowCat = new ChainFactory(that.allowCatFlag);
  let chainAllowNum = new ChainFactory(that.allowNumFlag);
  let chainAllowFeatureDrag = new ChainFactory(that.allowFeatureDragFlag);
  let chainIsExist = new ChainFactory(that.isExist);
  let chainAllowRepeatFeature = new ChainFactory(that.allowRepeatFeature);
  let chainMaxFeatureFlag = new ChainFactory(that.allowFeatureMaxFlag);
  chainIsMap
    .setNext(chainAllowLoAndLat)
    .setNext(chainAllowCat)
    .setNext(chainAllowNum)
    .setNext(chainAllowFeatureDrag)
    .setNext(chainIsExist)
    .setNext(chainMaxFeatureFlag)
    .setNext(chainAllowRepeatFeature);
  type = type && type.toLowerCase();
  return chainIsMap.start({
    target: targetType,
    capsuleType: that.capsuleType,
    context: that.context,
    curContext: that,
    flag: flag,
    featureName: featureName,
    type,
  });
};
// MapRule.prototype.swapSingleFeature = function ([list, oldFeatureName, panel, featureName, type]) {
//   let targetType = panel.getAttribute('type');
//   let obj = this.draggingTipsFlag([targetType, true, featureName, type]);
//   if (!obj.showTip) {
//     return this.swapFeature(list, oldFeatureName);
//   }
//   return list;
// };

MapRule.prototype.isMap = function ({
  target,
  capsuleType,
  context,
  featureName,
  curContext,
  flag,
  type, // 特征type
}) {
  let typeList = [
    'city',
    'province',
    'district',
    'areacode',
    'zipcode',
    'int',
    'float',
  ];
  if (target === 'column' && typeList.indexOf(type) === -1) {
    return { txt: context.$t('message.allow_pos_tip'), showTip: true };
  }
  let match = context.columnList.find((i) => i.dtype === 'CAT');
  if (
    !flag &&
    target === 'column' &&
    match &&
    ['int', 'float'].indexOf(type) > -1
  ) {
    return { txt: context.$t('message.allow_pos_tip'), showTip: true };
  }
  match = context.columnList.filter((i) => i.dtype === 'AGGR');
  if (target === 'column' && ['city', 'province', 'district', 'areacode', 'zipcode'].indexOf(type) > -1) {
    if ((!flag && match.length > 0) || (flag && match.length > 1)) {
      return { txt: context.$t('message.allow_cat_tip'), showTip: true };
    }
  }

  return this.toNext({
    target,
    capsuleType,
    context,
    featureName,
    curContext,
    flag,
    type,
  });
};
MapRule.prototype.allowLoAndLat = function ({
  target,
  capsuleType,
  context,
  curContext,
  featureName,
  flag,
  type,
}) {
  // if (context.loAndLatFlag && target === 'column' && (featureName !== 'longitude' && featureName !== 'latitude')) {
  //   return {
  //     txt: context.$t('message.allow_num_pos'),
  //     showTip: true
  //   };
  // }
  return this.toNext({
    target,
    capsuleType,
    context,
    curContext,
    featureName,
    flag,
    type,
  });
};
MapRule.prototype.allowCatFlag = function ({
  target,
  capsuleType,
  context,
  curContext,
  featureName,
  flag,
  type,
}) {
  if (
    (capsuleType === 'cat' && target === 'size') ||
    (capsuleType === 'cat' && target === 'color')
  ) {
    return {
      txt: context.$t('message.allow_cat_tip'),
      showTip: true,
    };
  }
  return this.toNext({
    target,
    capsuleType,
    context,
    curContext,
    featureName,
    flag,
    type,
  });
};

MapRule.prototype.allowNumFlag = function ({
  target,
  capsuleType,
  context,
  curContext,
  featureName,
  flag,
  type,
}) {
  if (target === 'labels' && capsuleType === 'cat') {
    let match = context.columnList.find((i) => i.name === featureName);
    if (!match) {
      return {
        txt: context.$t('message.allow_num_pos'),
        showTip: true,
      };
    }
  }
  return this.toNext({
    target,
    capsuleType,
    context,
    curContext,
    featureName,
    flag,
    type,
  });
};
MapRule.prototype.allowFeatureDragFlag = function ({
  target,
  capsuleType,
  context,
  featureName,
  flag,
  curContext,
  type,
}) {
  if (target === 'labels' && capsuleType === 'cat') {
    let item = context.columnList[0];
    let match = context.aggrList.find((i) => i.feature_name === item.name);
    let dataTypeList = [
      'zipcode',
      'district',
      'province',
      'city',
      'areacode',
      'citycode',
      'map',
    ];
    if (match && dataTypeList.indexOf(type) === -1) {
      return {
        txt: context.$t('message.allow_drag_tip'),
        showTip: true,
      };
    }
  }
  return this.toNext({
    target,
    capsuleType,
    context,
    curContext,
    featureName,
    flag,
    type,
  });
};

MapRule.prototype.isExist = function ({
  target,
  capsuleType,
  context,
  curContext,
  featureName,
  flag,
  type,
}) {
  if (
    !flag &&
    (target === 'labels' || target === 'color' || target === 'size') &&
    capsuleType === 'int'
  ) {
    let match = context.columnList.find((i) => i.name === featureName);
    if (match) {
      return {
        txt: context.$t('message.log_tip'),
        showTip: true,
      };
    }
  }
  return this.toNext({
    target,
    capsuleType,
    context,
    curContext,
    featureName,
    flag,
    type,
  });
};

MapRule.prototype.allowFeatureMaxFlag = function ({
  target,
  capsuleType,
  context,
  curContext,
  featureName,
  flag,
  type,
}) {
  let showFlag = curContext.allowOneFeatureFlag(
    target,
    ['color', 'size'],
    context
  );
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
    featureName,
    flag,
    type,
  });
};

export default MapRule;
