import { judgeFeatureType } from './drawHelpers';

function generateMultiMeasuresData ({ y, data }) {
  const resData = data[0]; // 返回的数据
  if (!resData) { return []; }
  const resKeys = Object.keys(resData);
  // 生成与选中度量长度相同的数组[{}, {}]
  let funnelMeasuresData = Array.from(
    { length: y.length },
    () => ({})
  );
  funnelMeasuresData.forEach((item, i) => {
    const name = y?.[i]?.feature?.name || null;
    if (name) {
      // 获取与当前项相关的返回数据
      const relatedKeys = resKeys.filter(key => key.indexOf(name) !== -1);
      // 获取第一项, name: value
      const nameKey = relatedKeys.shift();
      item.name = nameKey;
      item.value = resData[nameKey];
      // 其他项作为值放进 item
      relatedKeys.forEach(key => {
        const _key = key.replace(item.name, '').trim();
        item[_key] = resData[key];
      });
    }
  });
  return funnelMeasuresData;
}

function generateCmpData ({ x, y, cmp, cmpGroups, data }) {
  let new_data = [];
  let cmp_data = [];
  const cmpType = judgeFeatureType(cmp.name);
  if (cmpType === 'int') {
    if (!x.length) {
      new_data = generateMultiMeasuresData({ y, data });
      cmp_data = generateMultiMeasuresData({ y: [{ feature: cmp }], data });
    } else {
      new_data = _filterDataKeys(data, cmp.name);
      cmp_data = _filterDataKeys(data, y[0].feature.name);
    }
  } else if (cmpType === 'cat') {
    if (!x.length) {
      // Do not render, feature x needed
    } else if (!cmpGroups || !cmpGroups.length) {
      // Do not render, cmpGroups needed
    } else {
      data.forEach(el => {
        const [value_1, value_2] = cmpGroups;
        if (el[cmp.name] === value_1) {
          new_data.push(el);
        } else if (el[cmp.name] === value_2) {
          cmp_data.push(el);
        }
      });
    }
  }

  return {
    new_data,
    cmp_data,
  };
}

export {
  generateMultiMeasuresData,
  generateCmpData
};

function _filterDataKeys (data, filterKey) {
  return data.map(el => {
    let obj = {};
    for (let key in el) {
      if (key.indexOf(filterKey) === -1) {
        obj[key] = el[key];
      }
    }
    return obj;
  });
}
