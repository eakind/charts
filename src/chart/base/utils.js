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

const setPerKeyForKey = (perKey, key, data, judge) => {
  let len = data.length;
  let uniqueValue = '';
  let uniqueObj = {};
  let uniqueKey = '';
  let perUniqueKey = '';
  for (let i = 0; i < len; i++) {
    if (uniqueValue !== data[i][perKey]) {
      uniqueValue = data[i][perKey];
      uniqueKey = `${uniqueValue}|^~^|${i}`;
      uniqueObj[uniqueKey] = [data[i][key]];
      if (judge) {
        perUniqueKey = data[i][judge];
      }
    } else {
      if (uniqueObj[uniqueKey]) {
        if (judge === '' || perUniqueKey === data[i][judge]) {
          uniqueObj[uniqueKey].push(data[i][key]);
        } else {
          uniqueValue = data[i][perKey];
          uniqueKey = `${uniqueValue}|^~^|${i}`;
          uniqueObj[uniqueKey] = [data[i][key]];
        }
      }
    }
  }
  return uniqueObj;
};

export {
  setUniqueForKey,
  setPerKeyForKey
};
