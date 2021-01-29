let getItemColor = function (
  index,
  colorList,
  colorFeatureType = 'ordinal',
  minVal,
  maxVal,
  curVal
) {
  let colorProcess = (function () {
    return {
      getOrdinalItemColor: function () {
        return colorList[index];
      },
      getLinearItemColor: function () {
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
