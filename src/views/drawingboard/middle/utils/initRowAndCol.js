import { isEmpty } from 'lodash';
import { initCatObj, initAggrObj } from '@/utils/utils.js';

const setCombinedList = (list, catList, aggrList, chartType) => {
  let arr = [];
  if (!list) return arr;
  for (let i = 0; i < list.length; i++) {
    let featureObj = initAggrObj(list[i].name, aggrList, chartType, list[i].legend, list[i].probability);
    if (!featureObj) {
      continue;
    }
    // 如果有颜色
    if (list[i] && list[i].color) {
      featureObj.color = setColorObj(list[i].color, catList, aggrList, chartType);
    }
    // 如果有标签
    if (list[i] && list[i].labels) {
      featureObj.labels = setLabelsList(list[i].labels, catList, aggrList, chartType);
    }
    // 如果有同比环比
    if (list[i] && list[i].rate) {
      featureObj.rate = list[i].rate;
    }
    arr.push(featureObj);
  }
  return arr;
};

const setColorObj = (object, catList, aggrList, chartType) => {
  let colorObj = null;
  if (object.legend) {
    colorObj = initAggrObj(object.name, aggrList, chartType, object.legend, object.probability);
    // 如果有同比环比
    if (object.rate) {
      colorObj.rate = object.rate;
    }
  } else {
    colorObj = initCatObj(object.name, catList, object.split, object.order);
  }
  return colorObj;
};

const setLabelsList = (list, catList, aggrList, chartType) => {
  let arr = [];
  for (let i = 0; i < list.length; i++) {
    let obj = null;
    if (list[i].legend) {
      obj = initAggrObj(list[i].name, aggrList, chartType, list[i].legend, list[i].probability);
      if (!obj) {
        continue;
      }
      // 如果有同比环比
      if (list[i].rate) {
        obj.rate = list[i].rate;
      }
    } else {
      obj = initCatObj(list[i].name, catList, list[i].split, list[i].order);
    }
    arr.push(obj);
  }
  return arr;
};

const setRow = (list, catList, aggrList, chartType) => {
  let arr = [];
  if (isEmpty(list)) return arr;
  for (let i = 0; i < list.length; i++) {
    let featureObj = null;
    if (!isEmpty(list[i].left) || !isEmpty(list[i].right)) {
      featureObj = {
        left: setCombinedList(list[i].left, catList, aggrList, chartType),
        right: setCombinedList(list[i].right, catList, aggrList, chartType)
      };
    } else {
      if (list[i].feature.legend) {
        featureObj = initAggrObj(list[i].feature.name, aggrList, chartType, list[i].feature.legend, list[i].feature.probability);
        if (!featureObj) {
          continue;
        }
        // 如果有同比环比
        if (list[i].feature.rate) {
          featureObj.rate = list[i].feature.rate;
        }
      } else {
        featureObj = initCatObj(list[i].feature.name, catList, list[i].feature.split, list[i].feature.order);
      }
      // 如果有颜色
      if (list[i] && list[i].feature && list[i].feature.color) {
        let color = setColorObj(list[i].feature.color, catList, aggrList, chartType);
        color && (featureObj.color = color);
      }
      // 如果有标签
      if (list[i] && list[i].feature && list[i].feature.labels) {
        let labels = setLabelsList(list[i].feature.labels, catList, aggrList, chartType);
        labels && (featureObj.labels = labels);
      }
    }
    arr.push(featureObj);
  }
  return arr;
};

const setCol = (list, catList) => {
  let arr = [];
  if (isEmpty(list)) return arr;
  for (let i = 0; i < list.length; i++) {
    let featureObj = initCatObj(list[i].name, catList, list[i].split, list[i].order);
    featureObj && arr.push(featureObj);
  }
  return arr;
};

// 设置组合图Row
const setCombinedRow = (list, catList, aggrList, chartType) => {
  let arr = [];
  if (isEmpty(list)) return arr;
  for (let i = 0; i < list.length; i++) {
    let featureObj = null;
    if (list[i].pills) {
      let pills = list[i].pills;
      let left = [];
      let right = [];
      for (let j = 0; j < pills.length; j++) {
        let tempObj = {};
        if (pills[j].status === 'left') {
          tempObj = setColumnFeature(pills[j], catList, aggrList, chartType);
          left.push(tempObj);
        } else {
          tempObj = setColumnFeature(pills[j], catList, aggrList, chartType);
          right.push(tempObj);
        }
      }
      featureObj = { left, right };
    } else {
      if (list[i].level === 0) {
        featureObj = initCatObj(list[i].name, catList, list[i].split, list[i].order);
      }
      if (list[i].level === 1) {
        featureObj = setColumnFeature(list[i], catList, aggrList, chartType);
      }
      if (!featureObj) {
        continue;
      }
    }
    arr.push(featureObj);
  }
  return arr;
};

const setColumnFeature = (featureObj, catList, aggrList, chartType) => {
  let obj = initAggrObj(featureObj.name, aggrList, chartType, featureObj.legend, featureObj.probability);
  if (!obj) {
    return null;
  }
  // 如果有类型
  if (featureObj.type) {
    obj.canvasType = featureObj.type;
  }
  // 如果有颜色
  if (featureObj.color) {
    obj.color = setColorObj(featureObj.color, catList, aggrList, chartType);
  }
  // 如果有标签
  if (featureObj.labels) {
    obj.labels = setLabelsList(featureObj.labels, catList, aggrList, chartType);
  }
  // 如果有同比环比
  if (featureObj.rate) {
    obj.rate = featureObj.rate;
  }
  return obj;
};

export {
  setRow,
  setCol,
  setCombinedRow
};
