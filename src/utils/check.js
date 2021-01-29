const isString = v => typeof v === 'string';
const isNumber = v => typeof v === 'number';
const isUndefined = v => typeof v === 'undefined';
const isObjectType = v => typeof v === 'object';
const isEmpty = o => (
  isUndefined(o) || o === null ||
    (isString(o) && o.length === 0) ||
    (isObjectType(o) && Object.keys(o).length === 0)
);
const notEmpty = o => !isEmpty(o);

const isArray = arr => arr && arr.constructor === Array;

const isObject = obj => obj && !obj.nodeType && isObjectType(obj) && !isArray(obj);

const hasKey = (dict, key) => {
  let found = false;
  Object.keys(dict).includes(key) && (found = true);
  return found;
};

// 字符宽度
let getTextWidth = function (text, font) {
  // re-use canvas object for better performance
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  context.font = font;
  var metrics = context.measureText(text);
  return metrics.width;
};

export {
  isArray,
  isEmpty,
  isNumber,
  isObject,
  isObjectType,
  isString,
  isUndefined,
  notEmpty,
  hasKey,
  getTextWidth
};
