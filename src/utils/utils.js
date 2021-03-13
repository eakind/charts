import { getMaxValue } from './data';
const getTextLegend = (text, fontSize) => {
  let textLen = String(text).length;
  return (textLen * fontSize) / 2 + fontSize;
};

let dataProcess = function (val, format) {
  if (!val) {
    return;
  }
  let ret = val;
  if (format.decimal) {
    if (format.isPercent) {
      ret = ret * 100;
    }
    ret = ret.toFixed(format.decimal);
    if (format.isPercent) {
      ret = ret + '%';
    }
  }

  ret = unitProcess(ret, format.unit);

  ret = displayFormatProcess(ret, format.format, format.zone);
  ret = prefSuffixProcess(ret, format.prefix, format.suffix, format.isPercent);
  return ret;
};

let unitProcess = function (val, unit, micrometerFlag) {
  let unitPare = {
    'K 千': 1000,
    'M 百万': 1000000,
    'G 十亿': 1000000000,
    'T 千亿': 100000000000
  };
  if (!unit) {
    return val;
  }
  let ret = val / unitPare[unit];
  return micrometerProcess(ret, micrometerFlag) + unit;
};

let displayFormatProcess = function (val, format, zone) {
  if (!format) {
    return val;
  }
  if (format === 'percent') {
    return val * 100 + '%';
  }
  let formatPare = {
    CN: '￥',
    JP: '¥',
    HK: 'HK$',
    US: '＄',
    EUR: '€',
    GBP: '£'
  };
  return formatPare[zone] + val;
};

let prefSuffixProcess = function (val, prefix, suffix, isPercent) {
  if (prefix) {
    val = prefix + val;
  }
  if (suffix && !isPercent) {
    val = val + suffix;
  }
  return val;
};

let micrometerProcess = function (val, flag) {
  if (!flag || val < 1000) {
    return val;
  }
  let ret = '';
  for (let i = 0; i < val.length; i++) {
    ret += val[i];
    if (i % 3 === 2) {
      ret += ',';
    }
  }
  return parseFloat(ret);
};

let styleProcess = function (styleObj) {
  return ` textAlign: ${styleObj.align};
  color:  ${styleObj.fontColor};
  fontSize:  ${styleObj.fontSize + 'px'};
  fontStyle:  ${styleObj.fontStyle};
  lineHeight:  ${styleObj.lineHeight + 'px'};
  letterSpacing:  ${styleObj.letterSpacing + 'px'}`;
};

let toScientificNotation = function (val) {
  if (!val) {
    return;
  }
  let ret = val.toString();
  if (ret.length <= 4) {
    return ret;
  } else if (ret.length <= 6) {
    return (ret / 1000).toFixed(2) + 'k';
  } else if (ret.length <= 9) {
    return (ret / 1000000).toFixed(2) + 'm';
  } else {
    return (ret / 1000000000).toFixed(2) + 'g';
  }
};

let getTextWidth = function (str, font) {
  let canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  context.font = font || '12px sans-serif';
  let { width } = context.measureText(str);
  return width;
};

let fontSizeLineHeightPair = {
  8: 12,
  9: 12,
  10: 12,
  12: 18,
  14: 20,
  16: 24,
  18: 26,
  20: 30,
  24: 34,
  28: 36,
  30: 40,
  32: 44,
  36: 54,
  40: 56,
  48: 60,
  56: 64,
  64: 72,
  72: 88
};

const hasValue = (arr, key, value) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === value) {
      return true;
    }
  }
  return false;
};

const uniqueKeyArr = (key, list) => {
  let arr = [];
  for (let i = 0, len = list.length; i < len; i++) {
    if (!hasValue(arr, key, list[i][key])) {
      arr.push(list[i]);
    }
  }
  return arr;
};

const setUnitHeight = (height, text, data, axisKey, isUnit, index) => {
  let num = 0;
  let start = 0;
  let arr = uniqueKeyArr(axisKey, data);
  for (let i = 0, len = arr.length; i < len; i++) {
    for (let key in arr[i]) {
      if (arr[i][key] === text) {
        if (num === 0) {
          start = i;
        }
        num++;
      }
    }
  }
  console.log(start);
  return num * height * index - (getTxtWidth(text, 14) / 2);
  // return isUnit ? num * height * index : (height * start) + (num * height - getTxtWidth(text, 14)) / 2;
};

const setPartHeight = (d, data, perKey, key) => {
  let arr = data.filter(item => item[key[0]] === d);
  let len = arr.length;
  let perArr = [];
  for (let i = 0; i < len; i++) {
    perArr.push(arr[i][perKey[0]]);
  }
  perArr = [...new Set(perArr)];
  return perArr.length;
};

const setTextPos = (width, text, data, axisKey) => {
  let num = 0;
  let start = 0;
  let arr = uniqueKeyArr(axisKey, data);
  for (let i = 0; i < arr.length; i++) {
    for (let key in arr[i]) {
      if (arr[i][key] === text) {
        if (num === 0) {
          start = i;
        }
        num++;
      }
    }
  }
  return (width * start) + ((width * num - getTxtWidth(text, 14)) / 2);
};

const setLinePos = (width, text, data, axisKey) => {
  let num = 0;
  let start = 0;
  let arr = uniqueKeyArr(axisKey, data);
  for (let i = 0; i < arr.length; i++) {
    for (let key in arr[i]) {
      if (arr[i][key] === text) {
        if (num === 0) {
          start = i;
        }
        num++;
      }
    }
  }
  return (width * start) + (width * num);
};

const getTxtLen = (width, font) => {
  let textDom = document.createElement('div');
  textDom.style.width = width + 'px';
  textDom.style.fontSize = font + 'px';
  textDom.style.overflowX = 'auto';
  textDom.style.whiteSpace = 'nowrap';
  let txt = '';
  for (let i = 0; i < width; i++) {
    txt = txt + '哈';
    textDom.innerText = txt;
    document.body.appendChild(textDom);
    if (textDom.scrollWidth >= width) {
      document.body.removeChild(textDom);
      return { limit: i, space: 1 };
    };
    document.body.removeChild(textDom);
  }

  return -1;
};

const getTxtWidth = (text, font) => {
  let textDom = document.createElement('span');
  textDom.innerText = text;
  textDom.style.fontSize = font + 'px';
  textDom.style.position = 'fixed';
  document.body.appendChild(textDom);
  let width = textDom.clientWidth;
  document.body.removeChild(textDom);
  return width;
};

const getTxtHeight = (text, font) => {
  let textDom = document.createElement('span');
  textDom.innerText = text;
  textDom.style.fontSize = font + 'px';
  textDom.style.position = 'fixed';
  document.body.appendChild(textDom);
  let height = textDom.clientHeight;
  document.body.removeChild(textDom);
  return height;
};

const getTopAxisHeight = (xAxisPart) => {
  if (!xAxisPart || xAxisPart.length === 0) return 16;
  else return (xAxisPart.length) * 32 + 16;
};

const setAsideWidth = (yAxis, maxValue, yAxisPart) => {
  if (!yAxis) return 16;
  let txtLen = getTxtWidth(String(Math.floor(maxValue)), 14) + 20;
  let titleLen = getTxtWidth('哈', 16);
  if (!yAxisPart) return txtLen + titleLen;
  return yAxisPart.length * 50 + txtLen + titleLen;
};

const setBottomLabelHeight = (xAxis, xData) => {
  let label = xAxis.label;
  let longest = xData.reduce((a, b) => String(a).length > String(b).length ? a : b);
  let height = getTxtHeight(String(longest), label.style.fontSize);
  let width = getTxtWidth(String(longest), label.style.fontSize);
  let rotate = label.rotate;
  if (rotate !== 0) {
    return width;
  }
  return height;
};

const getMaxValueWidth = (yAxis, data, yAxisPart, position) => {
  let leftMaxValueArr = [];
  let leftMaxWidthArr = [];
  for (let i = 0; i < yAxis.length; i++) {
    let leftAxisList = yAxis[i].filter(item => item.position === position);
    if (leftAxisList.length) {
      let leftMaxValue = getMaxValue(data[i], leftAxisList[0].key);
      let leftAxisWidth = setAsideWidth(leftAxisList[0], Math.floor(leftMaxValue), yAxisPart);
      leftMaxValueArr.push(leftMaxValue);
      leftMaxWidthArr.push(leftAxisWidth);
    }
  };
  let obj = {};
  obj[`${position}MaxValue`] = Math.max(...leftMaxValueArr);
  obj[`${position}AxisWidth`] = Math.max(...leftMaxWidthArr);
  return obj;
};

export {
  getTextLegend,
  dataProcess,
  styleProcess,
  toScientificNotation,
  getTextWidth,
  fontSizeLineHeightPair,
  setTextPos,
  setLinePos,
  getTxtLen,
  getTxtWidth,
  getTopAxisHeight,
  setAsideWidth,
  setBottomLabelHeight,
  setUnitHeight,
  setPartHeight,
  getMaxValueWidth
};
