const getMaxValue = (data, keyList) => {
  let mergeList = [];
  for (let i = 0, len = keyList.length; i < len; i++) {
    for (let j = 0, len = data.length; j < len; j++) {
      mergeList.push(isNaN(data[j][keyList[i]]) ? 0 : data[j][keyList[i]]);
    }
  }
  return Math.max(...mergeList);
};

const getKeyDataList = (data, key, isNum) => {
  let list = [];
  for (let i = 0, len = data.length; i < len; i++) {
    let num = isNum && isNaN(data[i][key]) ? 0 : data[i][key];
    list.push(num);
  }
  return list;
};

const getKeyValueDataList = (data, key, value) => {
  let list = [];
  for (let i = 0, len = data.length; i < len; i++) {
    if (data[i][key] === value) {
      list.push(data[i]);
    }
  }
  return list;
};

const filterPartData = (yAxisPart, data, key, yPartMap, index) => {
  let i = 0;
  let keyArr = [];
  for (let key in yPartMap) {
    if (i === index) {
      keyArr = key.split(',');
    }
    i++;
  }
  let filterData = JSON.parse(JSON.stringify(data));
  let len = yAxisPart.length - 1;
  if (!yPartMap) {
    filterData = getKeyValueDataList(filterData, yAxisPart[len - i].key[0], key);
    return filterData;
  }
  for (let i = 0; i < keyArr.length; i++) {
    filterData = getKeyValueDataList(filterData, yAxisPart[len - i].key[0], keyArr[i]);
  }
  return filterData;
};

export {
  getMaxValue,
  getKeyDataList,
  getKeyValueDataList,
  filterPartData
};
