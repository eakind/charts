const setUniqueForKey = (perKey, key, data) => {
  let len = data.length;
  let uniqueValue = '';
  let uniqueObj = {};
  for (let i = 0; i < len; i++) {
    if (uniqueValue !== data[i][perKey]) {
      uniqueValue = data[i][perKey];
      uniqueObj[uniqueValue] = [data[i][key]];
    } else {
      if (uniqueObj[uniqueValue]) {
        uniqueObj[uniqueValue].push(data[i][key]);
      }
    }
  }
  return uniqueObj;
};

const setPerKeyForKey = (perKey, key, data, xAxisPart, partLen) => {
  let len = data.length;
  let uniqueValue = '';
  let uniqueObj = {};
  let perUniqueKey = '';
  let perKeyArr = perKeyValue(xAxisPart, partLen);
  for (let i = 0; i < len; i++) {
    perUniqueKey = getPerUniqueKey(perKeyArr, data[i]);
    if (uniqueValue !== data[i][perKey]) {
      uniqueValue = data[i][perKey];
      uniqueObj[perUniqueKey] = [data[i][key]];
    } else {
      if (uniqueObj[perUniqueKey]) {
        uniqueObj[perUniqueKey].push(data[i][key]);
      } else {
        uniqueValue = data[i][perKey];
        uniqueObj[perUniqueKey] = [data[i][key]];
      }
    }
  }
  return uniqueObj;
};

const getPerUniqueKey = (perKeyArr, dataObj) => {
  let perUniqueKey = [];
  for (let i = 0; i < perKeyArr.length; i++) {
    perUniqueKey.push(dataObj[perKeyArr[i]]);
  }
  return perUniqueKey.join(',');
};

const perKeyValue = (xAxisPart, parLen) => {
  let perKeyArr = [];
  for (let i = parLen; i >= 0; i--) {
    perKeyArr.push(xAxisPart[i].key);
  }
  return perKeyArr;
};

const getToTalBar = (yAxis) => {
  let index = 0;
  for (let i = 0; i < yAxis.length; i++) {
    for (let j = 0; j < yAxis[i].key.length; j++) {
      if (yAxis[i].type[j] === 'bar') {
        index++;
      }
    }
  }
  return index;
};

export {
  setUniqueForKey,
  setPerKeyForKey,
  getToTalBar
};
