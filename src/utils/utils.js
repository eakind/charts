const getTextLegend = (text, fontSize) => {
  let textLen = String(text).length;
  return (textLen * fontSize) / 2 + fontSize;
};

let dataProcess = function (val, format) {
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
  let ret = val;
  if (ret.length < 4) {
    return ret;
  } else if (ret < 6) {
    return (ret / 1000).toFixed(2) + 'k';
  } else if (ret < 9) {
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

export {
  getTextLegend,
  dataProcess,
  styleProcess,
  toScientificNotation,
  getTextWidth,
  fontSizeLineHeightPair
};
