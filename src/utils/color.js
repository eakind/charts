import colorConfig from './defaultConfig.js';
let { colorSet } = colorConfig;
let getItemColor = function (
  index,
  colorList,
  colorFeatureType = 'ordinal',
  minVal,
  maxVal,
  curVal,
  feature,
  flag,
  opacity
) {
  let colorProcess = (function () {
    return {
      getOrdinalItemColor: function () {
        if (!feature) {
          return colorSet.category[0];
        }
        if (colorList && colorList.length > 0) {
          let match = colorList.find((i) => i.val === curVal);
          if (match) {
            return match.color;
          }
        }
        colorList = colorSet.category;
        if (colorList.length <= index) {
          return colorList[index % colorList.length];
        }
        return colorList[index];
      },
      getLinearItemColor: function () {
        let tempColorList = colorSet.numeric;
        let curColorList = colorList.map((i) => i.color || i);
        let opacity1 = opacity;
        let opacity2 = opacity;
        if (curColorList && curColorList.length > 0) {
          opacity1 = colorList[0].opacity ? (colorList[0].opacity / 100).toFixed(2) : opacity;
          opacity2 = colorList[1].opacity ? (colorList[1].opacity / 100).toFixed(2) : opacity; ;
          if (!(curColorList[0] === curColorList[1] && flag)) {
            tempColorList = curColorList;
          }
        }
        let startColor = d3.rgb(tempColorList[0]);
        let endColor = d3.rgb(tempColorList[1]);
        startColor.opacity = opacity1;
        endColor.opacity = opacity2;
        let compute = d3.interpolate(startColor, endColor);
        if (maxVal === minVal) {
          return tempColorList[0];
        }
        if (!flag) {
          return tempColorList[0];
        }
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
