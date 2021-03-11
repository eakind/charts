import { initScaleStyle, initGridStyle, initAxisStyle } from '@/views/drawingboard/middle/utils/canvas.js';
import { setGrid, setAxis, setCutOff, getColumnCat, getRowAggr, getRowCat, setBarAndLineOne, getData, getRowFeature, setOneLabel, uniqueToolTip, setDivide } from './draw.js';
const initLineCss = function (canvasFeatures, axis_style, aggrList, titleCss) {
  let xAxis = getColumnCat(canvasFeatures.x || []);
  let yAxis = getRowAggr(canvasFeatures.y || [], aggrList);
  let { scaleList, scopeList } = initScaleStyle(xAxis, yAxis, axis_style || {}, canvasFeatures.y, titleCss);
  let { grid_style, grid_show } = initGridStyle(axis_style || {}, canvasFeatures.y);
  let { fontList, axisList } = initAxisStyle(xAxis, yAxis, axis_style || {}, canvasFeatures.y, titleCss);
  let axisStyle = {
    scaleList,
    scopeList,
    grid_style,
    grid_show,
    fontList,
    axisList,
    combined: axis_style ? axis_style.combined ? axis_style.combined : false : false
  };
  return axisStyle;
};

const setLineTooltip = function (canvasFeatures, aggrList) {
  let xAxis = getColumnCat(canvasFeatures.x || []);
  let yAxis = getRowFeature(canvasFeatures.y || []);
  let tooltipList = [];
  for (let i = 0; i < xAxis.length; i++) {
    if (uniqueToolTip(xAxis[i], tooltipList)) {
      tooltipList.push({
        feature: xAxis[i],
        type: 'ordinal'
      });
    }
  };
  for (let i = 0; i < yAxis.length; i++) {
    for (let j = 0; j < yAxis[i].length; j++) {
      if (uniqueToolTip(yAxis[i][j].name, tooltipList)) {
        tooltipList.push({
          feature: yAxis[i][j].name,
          type: yAxis[i][j].type === 'AGGR' ? 'linear' : 'ordinal'
        });
      }
    }
  }
  return tooltipList;
};

const drawLine = function (configObj) {
  let {
    baseConfig,
    featureData,
    canvasCss,
    canvasFeatures,
    containerSize,
    chartSize,
    chartArr,
    aggrList
  } = configObj;
  if (!chartArr.length) return null;
  // 设置单位
  baseConfig.has = {
    unit: canvasCss.hasUnit !== 'origin'
  };
  // 设置图表容器大小
  baseConfig.container = containerSize;
  // 设置画布的大小
  baseConfig.size = chartSize;
  // 设置X轴标题
  setDivide(baseConfig.divide, canvasCss.axis_style, canvasFeatures.x || []);
  // 设置数据，设置Y轴
  setData(baseConfig.data, featureData, canvasFeatures, canvasCss, aggrList);
  // 设置网格线
  setGrid(baseConfig.grid, canvasCss.axis_style);
  // 设置斜线
  setCutOff(baseConfig.cutoff, canvasCss.axis_style);
  // 画图
  let chartIns = [];
  if (canvasCss.axis_style.combined) {
    baseConfig.bindto = `#${chartArr[0].id}`;
    setAxis(baseConfig.axis, canvasCss.axis_style, canvasFeatures.x || [], canvasCss.axis_scale, 0);
    chartIns.push(mc.generate(baseConfig));
  } else {
    let list = JSON.parse(JSON.stringify(baseConfig.data.row.aggressions));
    let label = JSON.parse(JSON.stringify(baseConfig.label));
    for (let i = 0; i < list.length; i++) {
      baseConfig.bindto = `#${chartArr[i].id}`;
      setAxis(baseConfig.axis, canvasCss.axis_style, canvasFeatures.x || [], canvasCss.axis_scale, i);
      setOneData(baseConfig.data, featureData, canvasFeatures, canvasCss, list[i], i);
      let { format, text } = setOneLabel(label, i);
      baseConfig.label.text = text;
      baseConfig.label.format = format;
      chartIns.push(mc.generate(baseConfig));
    }
  }
  return chartIns;
};

function setOneData (data, featureData, canvasFeatures, canvasCss, aggressions, index) {
  data.row.aggressions = [aggressions];
  let list = [];
  for (let i = 0; i < index; i++) {
    list.push([]);
  }
  list.push(aggressions);
  data.combined = setBarAndLineOne(JSON.parse(JSON.stringify(featureData)), list, canvasCss, canvasFeatures, 'line');
}

function setData (data, featureData, canvasFeatures, canvasCss, aggrList) {
  data.type = 'line';
  data.json = getData(featureData); // 设置json
  // 设置column跟row
  data.column.categories = getColumnCat(canvasFeatures.x || []);
  data.row.aggressions = getRowAggr(canvasFeatures.y || [], aggrList);
  data.row.categories = getRowCat(canvasFeatures.y || []);

  // 设置combined,Y轴
  data.combined = setBarAndLineOne(featureData, data.row.aggressions, canvasCss, canvasFeatures, 'line');
}
export {
  drawLine,
  initLineCss,
  setLineTooltip
};
