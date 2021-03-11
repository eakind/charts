import { isEmpty } from './check.js';

const getFeatureObj = (el, catList, aggrList) => {
  let name = el.dataset.name;
  let property = el.dataset.property;
  let featureObj = null;
  if (property === 'CAT') {
    featureObj = initCatObj(name, catList);
  } else {
    featureObj = initAggrObj(name, aggrList);
  }
  return featureObj;
};

/*
 获取初始化CAT特征对象
*/
const initCatObj = (name, list, split, order) => {
  let len = list.length;
  let featureObj = null;
  for (let i = 0; i < len; i++) {
    if (list[i].data_type === 'GROUP') {
      let groupLen = list[i].groups.length;
      for (let j = 0; j < groupLen; j++) {
        if (name === list[i].groups[j].feature_name) {
          featureObj = JSON.parse(JSON.stringify(list[i].groups[j]));
          featureObj.groupIndex = j;
          featureObj.groupLen = groupLen;
        }
      }
    } else {
      if (name === list[i].feature_name) {
        featureObj = JSON.parse(JSON.stringify(list[i]));
      }
    }
  }
  if (!featureObj) return null;
  featureObj.property = 'CAT';
  featureObj.type = 'CAT';
  featureObj.dtype = 'CAT';
  featureObj.name = featureObj.feature_name;
  if (featureObj.data_type === 'DATETIME') {
    // 时间类型默认为年
    featureObj.split = split || 'YEAR';
  }
  if (order) {
    featureObj.order = order;
  }
  return featureObj;
};

/*
  获取初始化Aggr特征对象
*/
const initAggrObj = (name, list, chartType, legend, probability, rate) => {
  let match = list.find((item) => item.feature_name === name);
  if (!match) {
    return null;
  }
  let featureObj = JSON.parse(JSON.stringify(match));
  featureObj.property = 'AGGR';
  featureObj.type = 'NUM';
  featureObj.dtype = 'AGGR';
  featureObj.name = featureObj.feature_name;
  // 添加默认聚合函数, area图默认Count，且不可以修改聚合函数
  if (legend) {
    featureObj.legend = legend;
  } else {
    featureObj.legend = chartType === 'area' ? 'Count' : 'SUM';
  }
  if (probability) {
    featureObj.probability = probability;
  }
  if (rate) {
    featureObj.rate = rate;
  }
  return JSON.parse(JSON.stringify(featureObj));
};

/*
  将catList拆分成一维数组
*/
const setCatUniqueArr = (list) => {
  let arr = [];
  for (let i = 0; i < list.length; i++) {
    if (list[i].data_type === 'GROUP') {
      for (let j = 0; j < list[i].groups.length; j++) {
        arr.push(JSON.parse(JSON.stringify(list[i].groups[j])));
      }
    } else {
      arr.push(JSON.parse(JSON.stringify(list[i])));
    }
  }
  return arr;
};

// 转成一维数组
const setList = (list) => {
  let arr = [];
  for (let i = 0; i < list.length; i++) {
    if (list[i].left) {
      setLeftRight(list[i].left, arr, i, 'left');
      setLeftRight(list[i].right, arr, i, 'right');
    } else {
      if (list[i].legend) {
        arr.push(setObj(list[i], i));
      }
    }
  }
  function setLeftRight (list, arr, index, dir) {
    if (isEmpty(list)) return;
    for (let i = 0; i < list.length; i++) {
      arr.push(setObj(list[i], index, i, dir));
    }
  }
  function setObj (listObj, index, children, dir) {
    let obj = {
      value: dir ? `${index},${children},${dir}` : `${index}`,
      ...listObj,
    };
    return obj;
  }
  return arr;
};

const isFormulaType = (list, name) => {
  for (let i = 0; i < list.length; i++) {
    if (list[i].feature_name === name) {
      if (list[i].formula_type) return true;
    }
  }
  return false;
};

const isNoData = (data, type) => {
  if (isEmpty(data)) return true;
  let barObj = {
    'bar-rotated': true,
    line: true,
    bar: true,
  };
  let noAxisObj = {
    scatter: true,
    bubble: true,
    // 'table': true,
    pie: true,
    // 'map': true
  };
  if (barObj[type]) {
    for (let i = 0; i < data.length; i++) {
      if (
        isEmpty(data[i].feature) &&
        isEmptyList(data[i].left) &&
        isEmptyList(data[i].right)
      ) {
        return true;
      }
    }
  }

  if (noAxisObj[type]) {
    if (isEmpty(data)) return true;
  }
  return false;
};

function isEmptyList (list) {
  if (!list) return true;
  for (let i = 0; i < list.length; i++) {
    if (isEmpty(list[i])) {
      return true;
    }
  }
  return false;
}

/*
 * 本地有存储值返回本地存储值，否则返回null
 * */
const getStorage = (key) => {
  if (sessionStorage.getItem(key)) {
    if (
      sessionStorage.getItem(key) !== 'null' &&
      sessionStorage.getItem(key) !== 'undefined'
    ) {
      return sessionStorage.getItem(key);
    }
  }
  if (localStorage.getItem(key)) {
    if (
      localStorage.getItem(key) !== 'null' &&
      sessionStorage.getItem(key) !== 'undefined'
    ) {
      return localStorage.getItem(key);
    }
  }
  return null;
};

/*
 * true表示数据不为空，false表示数据为空
 * */
const hasData = (data, type) => {
  let flag = true;
  if (!data) return flag;
  if (!type) return flag;
  switch (type) {
    case 'bar-rotated':
    case 'line':
    case 'bar':
      // if(data[0].feature.length === 0){
      //   flag = false
      // }
      break;
    case 'scatter':
    case 'bubble':
    case 'table':
    case 'pie':
    case 'map':
      if (data.length === 0) {
        flag = false;
      }
      break;
    case 'bar-line':
      break;
  }
  return flag;
};

/*
 * 延时执行函数
 * */
const delayFunc = (fn, delay = 500) => {
  let timer;
  return function () {
    let args = arguments;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn.apply(this, args);
    }, delay);
  };
};

const isTarget = (target, str) => {
  if (!target.classList) return null;
  if (!target.classList.contains('home')) {
    if (target.classList.contains(str)) {
      return target;
    } else {
      return isTarget(target.parentNode, str);
    }
  } else {
    return null;
  }
};

const hexToRgba = (hex, opacity) => {
  if (typeof hex === 'object') hex = hex.background;
  if (hex === '#fff') hex = '#ffffff';
  if (hex === '#000') hex = '#000000';
  if (!opacity && opacity !== 0) opacity = 100;
  if (!hex) return 'rbga(255,255,255,0)';
  let r = parseInt('0x' + hex.slice(1, 3));
  let g = parseInt('0x' + hex.slice(3, 5));
  let b = parseInt('0x' + hex.slice(5, 7));
  let a = opacity / 100;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const uuid = () => {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (
    c
  ) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
};

const rgbaToHex = (rgb) => {
  let regexp = /[0-9]{0,3}/g;
  let re = rgb.match(regexp);
  let hexColor = '#';
  var hex = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
  ];
  for (var i = 0; i < re.length; i++) {
    var r = null;
    var c = re[i];
    var l = c;
    var hexAr = [];
    while (c > 16) {
      r = c % 16;
      c = (c / 16) >> 0;
      hexAr.push(hex[r]);
    }
    hexAr.push(hex[c]);
    if (l < 16 && l !== '') {
      hexAr.push(0);
    }
    hexColor += hexAr.reverse().join('');
  }
  return hexColor;
};

let isType = function (type) {
  return function (obj) {
    return Object.prototype.toString.call(obj) === `[object ${type}]`;
  };
};

function getSize (parent, view_mode, chartArrs, fixedWH, chartType, diffFlag) {
  if (!parent) {
    return { chartSize: {}, containerSize: {} };
  }
  let containerWidth = parent.offsetWidth - 20; // 距离右侧有一些距离
  let containerHeight = diffFlag
    ? parent.offsetHeight - 150
    : parent.offsetHeight; // 留点位置给画布标题和滚动条

  let size = {};
  let width = containerWidth;
  let height = containerHeight;
  if (fixedWH) {
    if (view_mode === 'standard') {
      size = { width: width / 2, height: (height * 4) / 5 };
    } else if (view_mode === 'fitWidth') {
      size = { width: width, height: (height * 4) / 5 };
    } else if (view_mode === 'fitHeight') {
      size = { width: width / 2, height: height };
    } else {
      size = { width: width, height: height };
    }
  } else {
    let setType = {
      bar: true,
      line: true,
      'bar-line': true,
      'bar-rotated': false,
    };
    if (view_mode === 'full') {
      if (setType[chartType]) {
        size.width = width;
        height /= chartArrs.length;
        size.height = height;
      } else {
        size.width = width / chartArrs.length;
        size.height = height;
      }
    } else if (view_mode === 'fitWidth') {
      if (setType[chartType]) {
        // width /= chartArrs.length;
        size.width = width - 50;
      } else {
        width /= chartArrs.length;
        size.width = width - 10;
      }
    } else if (view_mode === 'fitHeight') {
      if (setType[chartType]) {
        height /= chartArrs.length;
        size.height = height;
      } else {
        size.height = height;
      }
    }
    console.log(size);
  }
  return {
    chartSize: size,
    containerSize: {
      width: containerWidth,
      height: containerHeight,
    },
  };
}
const flatten = (list) => {
  return [].concat(
    ...list.map((item) => [].concat(item, ...flatten(item.children)))
  );
};

const setLineHeight = (size) => {
  let obj = {
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
    72: 88,
  };
  return `${obj[size]}px`;
};

const getLayoutCompStyle = (type, canvasType) => {
  const viewObj = {
    '01': 'standard',
    '02': 'fitHeight',
    '03': 'fitWidth',
    '04': 'fitHeight',
    '05': 'fitHeight',
    '06': 'full',
    '07': 'full',
    '08': 'full',
    '09': 'full',
  };
  let obj = {
    canvas: {
      title: {
        showFlag: true,
        colorStyle: {
          background: '#000', // {}
          opacity: 100,
          bgSelected: true
        },
        fontSize: 14,
        textAlign: 'left',
        bgColor: {
          bgSelected: false,
          opacity: 100,
          index: -1,
          background: {
            background: '#ffffff'
          }
        },
      },
      chart: {
        mode: viewObj[canvasType],
        bgColor: {
          bgSelected: false,
          opacity: 100,
          index: -1,
          background: {
            background: '#ffffff'
          }
        },
      },
      global: {
        padding: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
        isLock: true,
        border: {
          bgSelected: 'none',
          background: '#dedede',
        },
      },
    },
    text: {
      title: {
        colorStyle: {
          background: '#000',
          opacity: 100,
          bgSelected: true
        },
        showFlag: true,
        fontSize: 14,
        textAlign: 'left',
        fontStyle: [],
        bgColor: {
          bgSelected: false,
          opacity: 100,
          index: -1,
          background: {
            background: '#ffffff'
          }
        },
        padding: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
        isLock: true,
        border: {
          bgSelected: 'none',
          background: '#dedede',
        },
      },
      value: '',
    },
    filter: {
      title: {
        showFlag: true,
        fontSize: 14,
        textAlign: 'left',
        colorStyle: {
          background: '#4284F5',
          opacity: 100,
        },
      },
      global: {
        bgColor: {
          bgSelected: false,
          opacity: 100,
          index: -1,
          background: {
            background: '#ffffff'
          },
        },
        border: {
          bgSelected: 'none',
          background: '#dedede',
        },
      },
    },
  };
  return obj[type] || {};
};

let deepClone = function (obj) {
  let targetObj = {};
  if (isType(obj)('Array')) {
    for (let i = 0; i < obj.length; i++) {
      let ele = obj[i];
      if (typeof ele === 'object') {
        targetObj[i] = deepClone(ele);
      } else {
        targetObj[i] = ele;
      }
    }
  } else {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const ele = obj[key];
        if (typeof ele === 'object') {
          targetObj[key] = deepClone(ele);
        } else {
          targetObj[key] = ele;
        }
      }
    }
  }
  return targetObj;
};

const setColorListKey = (list, index) => {
  if (!list) return [];
  for (let i = 0; i < list.length; i++) {
    if (!list[i].id || !list[i].key_id) continue;
    let id = Number(list[i].id.split('_')[2]);
    if (index === id) {
      let childKey = Number(list[i].key_id.split('-')[1]) + 1;
      list[i].key_id = `0-${childKey}`;
    }
  }
  return list;
};

const removeCombinedStyle = (index, key, list) => {
  if (!list) return;
  for (let i = 0; i < list.length; i++) {
    if (!list[i].id || !list[i].key_id) continue;
    let idKey = Number(list[i].id.split('_')[2]);
    let childKey = Number(list[i].key_id.split('-')[1]);
    if (idKey === index && childKey === key) {
      list.splice(i, 1);
      resetCombinedKey(i, idKey, childKey, list);
    }
  }

  function resetCombinedKey (index, idKey, childKey, list) {
    for (let i = index; i < list.length; i++) {
      if (!list[i].id || !list[i].key_id) continue;
      let key = Number(list[i].id.split('_')[2]);
      let childIndex = Number(list[i].key_id.split('-')[1]);
      if (idKey === key && childIndex > childKey) {
        childIndex = childIndex - 1;
        let arr = list[i].key_id.split('-');
        arr[1] = String(childIndex);
        list[i].key_id = arr.join('-');
      }
    }
  }
};

const removeStyle = (index, list) => {
  if (!list) return;
  for (let i = 0; i < list.length; i++) {
    if (!list[i].id) continue;
    let key = Number(list[i].id.split('_')[2]);
    if (key === index) {
      list.splice(i, 1);
      resetKey(list, i);
      return;
    }
  }

  function resetKey (list, index) {
    for (let i = index; i < list.length; i++) {
      let key = Number(list[i].id.split('_')[2]) - 1;
      let arr = list[i].id.split('_');
      arr[2] = String(key);
      list[i].id = arr.join('_');
    }
  }
};

const getAttrDeep = (obj, attrName, attrArr) => {
  obj.forEach((item) => {
    if (item.type && item.type === attrName) {
      attrArr.push(item.filterId);
    }
    if (item.children && item.children.length > 0) {
      getAttrDeep(item.children, attrName, attrArr);
    }
  });
  return attrArr;
};

var rgbToHex = function (rgb) {
  // rgb(x, y, z)
  var color = rgb.toString().match(/\d+/g); // 把 x,y,z 推送到 color 数组里
  var hex = '#';

  for (var i = 0; i < 3; i++) {
    // 'Number.toString(16)' 是JS默认能实现转换成16进制数的方法.
    // 'color[i]' 是数组，要转换成字符串.
    // 如果结果是一位数，就在前面补零。例如： A变成0A
    hex += ('0' + Number(color[i]).toString(16)).slice(-2);
  }
  let opacity = 1;
  if (color.length > 3) {
    opacity = color.slice(3).join('.');
  }
  return { hex, opacity };
};

export {
  initCatObj,
  initAggrObj,
  getFeatureObj,
  setCatUniqueArr,
  isNoData,
  getStorage,
  hasData,
  delayFunc,
  isTarget,
  hexToRgba,
  uuid,
  isFormulaType,
  rgbaToHex,
  isType,
  getSize,
  flatten,
  setLineHeight,
  getLayoutCompStyle,
  deepClone,
  setList,
  setColorListKey,
  getAttrDeep,
  removeStyle,
  removeCombinedStyle,
  rgbToHex,
};
