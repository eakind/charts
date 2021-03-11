import {
  initScaleStyle,
  initGridStyle,
  initAxisStyle,
} from '@/views/drawingboard/middle/utils/canvas.js';
import {
  setGrid,
  setAxis,
  setCutOff,
  getColumnCat,
  getRowAggr,
  getRowCat,
  setBarAndLineOne,
  getData,
  getRowFeature,
  setOneLabel,
  uniqueToolTip,
  setDivide,
} from './draw.js';

const initBarRotatedCss = function (canvasFeatures, axis_style, aggrList, titleCss) {
  let xAxis = getRowAggr(canvasFeatures.x || [], aggrList);
  let yAxis = getColumnCat(canvasFeatures.y || []);
  let { scaleList, scopeList } = initScaleStyle(
    yAxis,
    xAxis,
    axis_style || {},
    canvasFeatures.x,
    titleCss
  );
  let { grid_style, grid_show } = initGridStyle(
    axis_style || {},
    canvasFeatures.x
  );
  let { fontList, axisList } = initAxisStyle(
    yAxis,
    xAxis,
    axis_style || {},
    canvasFeatures.x,
    titleCss
  );
  let axisStyle = {
    scaleList,
    scopeList,
    grid_style,
    grid_show,
    fontList,
    axisList,
    combined: axis_style
      ? axis_style.combined
        ? axis_style.combined
        : false
      : false,
  };
  return axisStyle;
};

const setBarRotatedTooltip = function (canvasFeatures, aggrList) {
  let yAxis = getColumnCat(canvasFeatures.y || []);
  let xAxis = getRowFeature(canvasFeatures.x || []);
  let tooltipList = [];
  for (let i = 0; i < yAxis.length; i++) {
    if (uniqueToolTip(yAxis[i], tooltipList)) {
      tooltipList.push({
        feature: yAxis[i],
        type: 'ordinal',
      });
    }
  }
  for (let i = 0; i < xAxis.length; i++) {
    for (let j = 0; j < xAxis[i].length; j++) {
      if (uniqueToolTip(xAxis[i][j].name, tooltipList)) {
        tooltipList.push({
          feature: xAxis[i][j].name,
          type: xAxis[i][j].type === 'AGGR' ? 'linear' : 'ordinal',
        });
      }
    }
  }
  return tooltipList;
};
// function setColor (color, canvasCss) {
//   let colorList = [];
//   let opacity = 1;
//   if (canvasCss.colors) {
//     colorList = canvasCss.colors.length > 0 && canvasCss.colors[0].colorList;
//   }
//   if (canvasCss.colors_and_opacities_list) {
//     opacity =
//       canvasCss.colors_and_opacities_list.length > 0 &&
//       canvasCss.colors_and_opacities_list[0].opacity / 100;
//   }
//   color.colors = [colorList];
//   color.opacity = opacity;
// }

const drawBarRotated = function (configObj) {
  let {
    baseConfig,
    featureData,
    canvasCss,
    canvasFeatures,
    containerSize,
    chartSize,
    chartArr,
    aggrList,
    bgCss
  } = configObj;
  if (!chartArr.length) {
    return null;
  }
  // 设置图表容器大小
  baseConfig.container = containerSize;
  // 设置画布的大小
  baseConfig.size = chartSize;
  // 设置单位
  baseConfig.has = {
    unit: canvasCss.hasUnit !== 'origin',
  };
  // 设置X轴
  // setAxis(baseConfig.axis, canvasCss.axis_style, canvasFeatures.y || []);
  // 设置X轴标题
  setDivide(baseConfig.divide, canvasCss.axis_style, canvasFeatures.y || []);
  // 设置数据，设置Y轴,颜色
  setRowAggr(baseConfig.data, featureData, canvasFeatures, canvasCss, aggrList);
  // 设置数据，设置Y轴
  // setData(baseConfig.data, featureData, canvasFeatures, canvasCss, aggrList);
  // 设置网格线
  setGrid(baseConfig.grid, canvasCss.axis_style);
  // 设置斜线
  setCutOff(baseConfig.cutoff, canvasCss.axis_style);
  // 设置颜色
  // 设置颜色
  // setColor(baseConfig.color, canvasCss);
  // baseConfig.data.range.color = canvasCss.colorRanges
  //   ? canvasCss.colorRanges.map((c) => c.range)
  //   : [];
  // baseConfig.data.range.size = canvasCss.sizeRanges
  //   ? canvasCss.sizeRanges.map((c) => c.range)
  //   : [];
  // 画图
  let chartIns = [];
  // canvasCss.axis_style = canvasCss.axis_style || {};
  if (canvasCss.axis_style.combined) {
    baseConfig.bindto = `#${chartArr[0].id}`;
    setAxis(baseConfig.axis, canvasCss.axis_style, canvasFeatures.y || [], canvasCss.axis_scale, 0, bgCss);
    setData(baseConfig.data, featureData, canvasFeatures, canvasCss, aggrList, bgCss);
    baseConfig.axis.rotated = true;
    chartIns.push(mc.generate(baseConfig));
  } else {
    let list = JSON.parse(JSON.stringify(baseConfig.data.row.aggressions));
    let label = JSON.parse(JSON.stringify(baseConfig.label));
    for (let i = 0; i < list.length; i++) {
      let config = baseConfig;
      config.bindto = `#${chartArr[i].id}`;
      setAxis(baseConfig.axis, canvasCss.axis_style, canvasFeatures.y || [], canvasCss.axis_scale, i);
      baseConfig.axis.rotated = true;
      setOneData(baseConfig.data, featureData, canvasFeatures, canvasCss, list[i], i);
      let { format, text } = setOneLabel(label, i);
      baseConfig.label.text = text;
      baseConfig.label.format = format;
      chartIns.push(mc.generate(baseConfig));
    }
  }
  return chartIns;
};

function setRowAggr (data, featureData, canvasFeatures, canvasCss, aggrList) {
  data.type = 'bar';
  data.json = getData(featureData); // 设置json
  // 设置column跟row
  data.column.categories = getColumnCat(canvasFeatures.y || []);
  data.row.aggressions = getRowAggr(canvasFeatures.x || [], aggrList);
  data.row.categories = getRowCat(canvasFeatures.x || []);
}

function setOneData (
  data,
  featureData,
  canvasFeatures,
  canvasCss,
  aggressions,
  index
) {
  data.row.aggressions = [aggressions];
  let list = [];
  for (let i = 0; i < index; i++) {
    list.push([]);
  }
  list.push(aggressions);
  data.combined = setBarAndLineOne(
    JSON.parse(JSON.stringify(featureData)),
    list,
    canvasCss,
    canvasFeatures,
    'bar',
    true
  );
}

function setData (data, featureData, canvasFeatures, canvasCss, aggrList) {
  data.type = 'bar';
  data.json = getData(featureData); // 设置json
  // 设置column跟row
  data.column.categories = getColumnCat(canvasFeatures.y || []);
  data.row.aggressions = getRowAggr(canvasFeatures.x || [], aggrList);
  data.row.categories = getRowCat(canvasFeatures.x || []);

  // 设置combined,Y轴
  data.combined = setBarAndLineOne(
    featureData,
    data.row.aggressions,
    canvasCss,
    canvasFeatures,
    'bar',
    true
  );
}

export { drawBarRotated, initBarRotatedCss, setBarRotatedTooltip };
