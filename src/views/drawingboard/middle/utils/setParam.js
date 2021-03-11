
const setColumnParam = (list) => {
  let arr = [];
  for (let i = 0; i < list.length; i++) {
    let obj = {
      name: list[i].feature_name,
      dtype: list[i].type
    };
    // 如果有时间函数
    if (list[i].split) {
      obj.split = list[i].split;
    }
    // 如果有排序
    if (list[i].order) {
      obj.order = list[i].order;
    }
    if (list[i].formula_type) {
      obj.formulaType = list[i].formula_type;
    }
    arr.push(obj);
  }
  return arr;
};

const setListParam = (list) => {
  let arr = [];
  for (let i = 0; i < list.length; i++) {
    arr.push(setObjParam(list[i]));
  }
  return arr;
};

const setLabelsParam = (list) => {
  let arr = [];
  for (let i = 0; i < list.length; i++) {
    if (list[i]) {
      arr.push(setLabelObj(list[i]));
    }
  }
  return arr;
};

const setLabelObj = (featureObj) => {
  const typeObj = {
    NUM: 'AGGR',
    CAT: 'CAT'
  };
  let obj = {
    name: featureObj.feature_name,
    dtype: typeObj[featureObj.type]
  };
  // 如果有聚合函数
  if (featureObj.legend) obj.legend = featureObj.legend;
  // 如果聚合函数是分位数
  if (obj.legend === 'PERCENTILE') obj.probability = featureObj.probability;
  // 如果有同比/环比
  if (featureObj.rate) obj.rate = featureObj.rate;
  if (featureObj.formula_type) {
    obj.formulaType = featureObj.formula_type;
  };
  return obj;
};

const setObjParam = (featureObj) => {
  const typeObj = {
    NUM: 'AGGR',
    CAT: 'CAT'
  };
  let obj = {
    name: featureObj.feature_name,
    dtype: typeObj[featureObj.type]
  };
  // 如果有聚合函数
  if (featureObj.legend) obj.legend = featureObj.legend;
  // 如果聚合函数是分位数
  if (obj.legend === 'PERCENTILE') obj.probability = featureObj.probability;
  // 如果有颜色特征
  if (featureObj.color) {
    let colorObj = {
      name: featureObj.color.feature_name,
      dtype: typeObj[featureObj.color.type]
    };
    // 如果颜色有聚合函数
    if (featureObj.color.legend) colorObj.legend = featureObj.color.legend;
    // 如果聚合函数是分位数
    if (colorObj.legend === 'PERCENTILE') colorObj.probability = featureObj.color.probability;
    // 如果颜色有同比环比
    if (featureObj.color.rate) colorObj.rate = featureObj.color.rate;
    if (featureObj.color.formula_type) {
      colorObj.formulaType = featureObj.color.formula_type;
    };
    obj.color = colorObj;
  }
  // 如果有标签
  if (featureObj.labels) {
    obj.labels = setLabelsParam(featureObj.labels);
  }
  // 如果是时间特征
  if (featureObj.split) {
    obj.split = featureObj.split;
  }
  // 如果有设置同比/环比
  if (featureObj.rate) {
    obj.rate = featureObj.rate;
  }
  // 如果有排序
  if (featureObj.order) {
    obj.order = featureObj.order;
  }
  if (featureObj.formula_type) {
    obj.formulaType = featureObj.formula_type;
  }
  return obj;
};

const setRowParam = (list) => {
  let arr = [];
  for (let i = 0; i < list.length; i++) {
    let obj = null;
    if (list[i].left) {
      obj = {
        left: setListParam(list[i].left),
        right: setListParam(list[i].right)
      };
    } else {
      obj = {
        feature: setObjParam(list[i])
      };
    }
    arr.push(obj);
  }
  return arr;
};

const setCombinedRowParam = (list) => {
  let arr = [];
  for (let i = 0; i < list.length; i++) {
    if (list[i].left || list[i].right) {
      let pills = [];
      pills = pills.concat(setPills(list[i].left, 'left',));
      pills = pills.concat(setPills(list[i].right, 'right'));
      arr.push({
        level: 1,
        pills
      });
    } else {
      let obj = setPillObj(list[i], list[i].legend ? 1 : 0);
      arr.push(obj);
    }
  }
  return arr;
};

const setPillObj = (featureObj, level) => {
  let obj = setObjParam(featureObj);
  obj.level = level;
  if (obj.legend) {
    obj.type = featureObj.canvasType || 'bar';
  }
  return obj;
};

const setPills = (list, dir) => {
  let arr = [];
  for (let i = 0; i < list.length; i++) {
    let obj = setPillObj(list[i], 2);
    obj.status = dir;
    if (!obj.type) {
      obj.type = dir === 'left' ? 'bar' : 'line';
    }
    arr.push(obj);
  }
  return arr;
};

export {
  setColumnParam,
  setRowParam,
  setCombinedRowParam
};
