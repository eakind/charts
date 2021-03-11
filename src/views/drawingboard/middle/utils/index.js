import { isEmpty } from '@/utils/check';
// import { groupBy } from 'lodash';
let chartKeyProcessObj = (function () {
  function tableProcess (feature, id) {
    let key = id;
    for (const prop in feature) {
      if (feature.hasOwnProperty(prop)) {
        const list = feature[prop] || [];
        if (Object.prototype.toString.call(list) === '[object Array]') {
          list.map(i => {
            let { name, legend = undefined, split = undefined, order = null, rate = null } = i;
            key += '_' + name;
            legend && (key += '_' + legend);
            split && (key += '_' + split);
            if (order) {
              key += retOrderJoin(order);
            }
            if (rate) {
              let { growth = undefined, period = 0, type = 'ON' } = rate;
              growth && (key += '_' + growth);
              period && (key += '_' + period);
              type && (key += '_' + type);
            }
          });
        } else {
          let { name, legend = undefined, split = undefined, order = null, rate = null } = list;
          key += '_' + name;
          legend && (key += '_' + legend);
          split && (key += '_' + split);
          if (order) {
            key += retOrderJoin(order);
          }
          if (rate) {
            let { growth = undefined, period = 0, type = 'ON' } = rate;
            growth && (key += '_' + growth);
            period && (key += '_' + period);
            type && (key += '_' + type);
          }
        }
        if (list) {
          key += '_' + prop + '_';
        }
      }
    }
    function retOrderJoin (order) {
      let str = '';
      for (const prop in feature) {
        if (feature.hasOwnProperty(prop)) {
          let { ascending = undefined, by = undefined, categories = [], col = null } = order;
          ascending && (str += '_' + ascending);
          by && (str += '_' + by);
          col && (str += '_' + col.name + '_' + col.legend);
          categories.forEach(i => {
            str += i.name;
          });
        }
      }
      return str;
    }
    return key;
  }
  function pieProcess (feature, id) {
    return tableProcess(feature, id);
  }
  function bubbleProcess (feature, id) {
    return tableProcess(feature, id);
  }
  function mapProcess (feature, id) {
    return tableProcess(feature, id);
  }
  return {
    pieProcess,
    tableProcess,
    bubbleProcess,
    mapProcess
  };
})();
/*
  获取存储画布数据的key
*/
const getChartKey = (obj, id, type, canvasFeatureStr) => {
  if (type) {
    return typeof chartKeyProcessObj[type + 'Process'] === 'function' && chartKeyProcessObj[type + 'Process'](obj, id);
  }
  return `${id}-${canvasFeatureStr}`;
};

const isEmptyChartData = (data, chartType) => {
  let isNoData = false;
  if (chartType === 'bar') {
    if (isEmpty(data)) isNoData = true;
    if (isEmpty(data[0].feature) || isEmpty()) isNoData = true;
  }
  return isNoData;
};

export {
  getChartKey,
  isEmptyChartData
};
