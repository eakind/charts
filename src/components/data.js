const getMaxValue = (data, keyList) => {
  let mergeList = [];
  for (let i = 0, len = keyList.length; i < len; i++) {
    for (let j = 0, len = data.length; j < len; j++) {
      mergeList.push(data[j][keyList[i]]);
    }
  }
  return Math.max(...mergeList);
};

const getKeyDataList = (data, key) => {
  let list = [];
  for (let i = 0, len = data.length; i < len; i++) {
    list.push(data[i][key]);
  }
  return list;
};

export {
  getMaxValue,
  getKeyDataList
};
