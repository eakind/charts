let modifyPieCanvasFeature = function (type, list) {
  if (type !== 'labels') {
    if (list.length > 0) {
      return retSingleFeature(list[0]);
    } else {
      return null;
    }
  }
  let ret = [];
  list.map(i => {
    ret.push(retSingleFeature(i));
  });

  function retSingleFeature (i) {
    let obj = JSON.parse(JSON.stringify(i));
    i.dtype = i.type === 'CAT' ? 'CAT' : i.dtype === 'CAT' ? 'CAT' : 'AGGR';
    obj.formulaType = i.formula_type;
    if (i.legend) {
      obj.dtype = 'AGGR';
      if (obj.legend === 'PERCENTILE') {
        obj.probability = Number(i.probability);
      }
    }
    return obj;
  }
  return ret;
};
let getPieDataChartList = function ({
  data,
  id,
}) {
  let item = {
    data: JSON.parse(JSON.stringify(data)),
    chartArrs: []
  };
  let chart = {
    id: `mc_pie_${id}`,
    chart_type: 'pie',
    hover: false
  };
  item.chartArrs.push(chart);
  return item;
};

let modifyBubbleCanvasFeature = function (type, list) {
  return modifyPieCanvasFeature(type, list);
};
let modifyTableCanvasFeature = function (type, list) {
  list.forEach(i => {
    i.dtype = i.type === 'CAT' ? 'CAT' : i.dtype === 'CAT' ? 'CAT' : 'AGGR';
    i.formulaType = i.formula_type;
  });
  if (type === 'color') {
    return list.length > 0 ? list[0] : null;
  }
  return list;
};
let modifyMapCanvasFeature = function (type, list) {
  list.forEach(i => {
    i.dtype = i.type === 'CAT' ? 'CAT' : i.dtype === 'CAT' ? 'CAT' : 'AGGR';
    i.formulaType = i.formula_type;
  });
  if (type === 'labels' || type === 'area') {
    return list;
  }
  return list[0];
};
let modifyScatterCanvasFeature = function (type, list) {
  list.forEach(i => {
    i.dtype = i.type === 'CAT' ? 'CAT' : i.dtype === 'CAT' ? 'CAT' : 'AGGR';
    i.formulaType = i.formula_type;
  });
  if (type === 'labels' || type === 'x' || type === 'y') {
    return list;
  }
  return list[0];
};
export {
  modifyPieCanvasFeature,
  getPieDataChartList,
  modifyBubbleCanvasFeature,
  modifyTableCanvasFeature,
  modifyMapCanvasFeature,
  modifyScatterCanvasFeature
};
