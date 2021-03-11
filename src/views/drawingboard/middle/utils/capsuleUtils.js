/*
  针对胶囊操作的一些方法
*/
import { isEmpty } from '@/utils/check';
// 删除胶囊
const removeFeature = (index, childIndex, dir, list) => {
  let arr = JSON.parse(JSON.stringify(list));
  if (!dir) {
    arr.splice(index, 1);
  } else {
    let obj = arr[index];
    if (dir === 'left') {
      obj.left.splice(childIndex, 1);
      // 当左胶囊为空，且右胶囊只有1个时，取消组合状态
      if (isEmpty(obj.left) && !isEmpty(obj.right) && obj.right.length === 1) {
        arr.splice(index, 1, obj.right[0]);
      }
      if (isEmpty(obj.right) && obj.left.length === 1) {
        arr.splice(index, 1, obj.left[0]);
      }
    } else {
      obj.right.splice(childIndex, 1);
      // 当右胶囊为空，且左胶囊只有1个时，取消组合状态
      if (isEmpty(obj.right) && !isEmpty(obj.left) && obj.left.length === 1) {
        arr.splice(index, 1, obj.left[0]);
      }
      if (isEmpty(obj.left) && obj.right.length === 1) {
        arr.splice(index, 1, obj.right[0]);
      }
    }
    // 当左右胶囊都移除后，需要移除组合胶囊
    if (isEmpty(obj.left) && isEmpty(obj.right)) {
      arr.splice(index, 1);
    }
  }
  return arr;
};

// 修改特征聚合函数
const changeLegend = (legend, index, childIndex, dir, probability, list) => {
  if (!list[index]) {
    return list;
  }
  let obj = JSON.parse(JSON.stringify(list[index]));
  if (dir) {
    obj[dir][childIndex].legend = legend;
    // this.$set(obj[dir][childIndex], 'legend', legend);
    // 如果是分位数，需要设置probability
    setProbability(obj[dir][childIndex], legend, probability);
  } else {
    obj.legend = legend;
    // this.$set(obj, 'legend', legend);
    // 如果是分位数，需要设置probability
    setProbability(obj, legend, probability);
  }
  list.splice(index, 1, obj);
  return list;
};

// 设置probability
function setProbability (obj, legend, probability) {
  if (legend === 'PERCENTILE') {
    obj.probability = probability;
    // this.$set(obj, 'probability', probability);
  } else {
    obj.probability = null;
  }
}

// 创建组合特征
const createGroup = (item, index, list) => {
  let obj = null;
  let arr = JSON.parse(JSON.stringify(list));
  if (isEmpty(item.left) && isEmpty(item.right)) {
    obj = {
      left: [item],
    };
  } else if (isEmpty(item.left) && !isEmpty(item.right)) {
    obj = {
      left: [],
      right: item.right,
    };
  }
  if (!obj) return arr;
  arr.splice(index, 1, obj);
  return arr;
};

// 取消创建组合特征
const cancelGroup = (item, index, list) => {
  let arr = JSON.parse(JSON.stringify(list));
  if (isEmpty(item.right)) {
    if (item.left.length === 1) {
      arr.splice(index, 1, item.left[0]);
    }
  }
  return arr;
};

// 修改时间特征split
const changeSplit = (split, index, list) => {
  let arr = JSON.parse(JSON.stringify(list));
  let obj = arr[index];
  if (!obj) return arr;
  obj.split = split;
  arr.splice(index, 1, obj);
  return arr;
};

// 创建时间分级特征
const combinedSplit = (split, index, list) => {
  let arr = JSON.parse(JSON.stringify(list));
  let obj = arr[index];
  if (!obj) return arr;
  obj.split = split.split(',');
  arr.splice(index, 1, obj);
  return arr;
};

// 取消分级特征
const cancelTimeGroup = (item, index, list) => {
  let arr = JSON.parse(JSON.stringify(list));
  item.split = 'YEAR';
  arr.splice(index, 1, item);
  return arr;
};

const changeProp = ({ index, list, val, attr }) => {
  let arr = JSON.parse(JSON.stringify(list));
  arr[index][attr] = val;
  return arr;
};

// 修改同比环比
const changeCapsuleRate = (rate, index, children, dir, list) => {
  let arr = JSON.parse(JSON.stringify(list));
  if (dir) {
    arr[index][dir][children].rate = rate;
  } else {
    arr[index].rate = rate;
  }
  return arr;
};

// 移除同比环比
const removeCapsuleCount = (index, children, dir, list) => {
  let arr = JSON.parse(JSON.stringify(list));
  if (dir) {
    delete arr[index][dir][children].rate;
  } else {
    delete arr[index].rate;
  }
  return arr;
};

const clearCapsuleSort = (index, list) => {
  let arr = JSON.parse(JSON.stringify(list));
  delete arr[index].order;
  return arr;
};

const changeDrillUp = (index, list) => {
  let arr = JSON.parse(JSON.stringify(list));
  let len = 0;
  for (let i = 0; i < arr.length; i++) {
    if (i >= index && arr[i].groupIndex) {
      len++;
    }
  }
  arr.splice(index, len);
  return arr;
};

const changeDrillDown = (item, index, list, catList) => {
  let arr = JSON.parse(JSON.stringify(list));
  let featureObj = null;
  for (let i = 0; i < catList.length; i++) {
    if (catList[i].groups) {
      let groups = catList[i].groups;
      for (let j = 0; j < groups.length; j++) {
        if (item.feature_name === groups[j].feature_name) {
          if (!groups[j + 1]) break;
          featureObj = JSON.parse(JSON.stringify(groups[j + 1]));
          featureObj.property = 'CAT';
          featureObj.type = 'CAT';
          featureObj.dtype = 'CAT';
          featureObj.groupIndex = j + 1;
          featureObj.groupLen = groups.length;
          featureObj.name = featureObj.feature_name;
          if (featureObj.data_type === 'DATETIME') {
            // 时间类型默认为年
            featureObj.split = 'YEAR';
          }
          break;
        }
      }
    }
  }
  if (!featureObj) return arr;
  arr.splice(index + 1, 0, featureObj);
  return arr;
};

export {
  removeFeature,
  changeLegend,
  createGroup,
  cancelGroup,
  changeSplit,
  changeProp,
  combinedSplit,
  cancelTimeGroup,
  changeCapsuleRate,
  removeCapsuleCount,
  clearCapsuleSort,
  changeDrillUp,
  changeDrillDown
};
