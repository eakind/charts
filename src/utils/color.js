import colorConfig from './defaultConfig.js';
let { colorSet } = colorConfig;
let getItemColor = function (
  index,
  colorList,
  colorFeatureType = 'ordinal',
  minVal,
  maxVal,
  curVal,
  feature
) {
  let colorProcess = (function () {
    return {
      getOrdinalItemColor: function () {
        if (!feature) {
          return colorSet.category[0];
        }
        colorList = colorList && colorList.length > 0 ? colorList : colorSet.category;
        if (colorList.length <= index) {
          return colorList[index % colorList.length];
        }
        return colorList[index];
      },
      getLinearItemColor: function () {
        colorList = colorList && colorList.length > 0 ? colorList : colorSet.numeric;
        let startColor = d3.rgb(colorList[0]);
        let endColor = d3.rgb(colorList[1]);
        let compute = d3.interpolate(startColor, endColor);
        return compute((curVal - minVal) / (maxVal - minVal));
      }
    };
  })();
  let funName =
    'get' +
    colorFeatureType.slice(0, 1).toUpperCase() +
    colorFeatureType.slice(1) +
    'ItemColor';

  if (typeof colorProcess[funName] === 'function') {
    return colorProcess[funName]();
  }
  return ''; // 随便
};

export { getItemColor };
