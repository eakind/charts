import { initScaleStyle, initGridStyle, initAxisStyle } from '@/views/drawingboard/middle/utils/canvas.js';
import { setGrid, setAxis, setCutOff, getColumnCat, getRowAggr, getRowCat, getData, getRowFeature, setOneLabel, uniqueToolTip, setDivide, setBarAndLineOne } from './draw.js';

const initBarCss = function (canvasFeatures, axis_style, aggrList, titleCss) {
  let xAxis = getColumnCat(canvasFeatures.x || []);
  let yAxis = getRowAggr(canvasFeatures.y || []);
  let { scaleList, scopeList } = initScaleStyle(xAxis, yAxis, axis_style || {}, canvasFeatures.y, titleCss);
  let { grid_style, grid_show } = initGridStyle(axis_style || {}, canvasFeatures.y, titleCss);
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

const setBarTooltip = function (canvasFeatures, aggrList) {
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
const drawBar = function (configObj) {
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
  // 绑定图表DOM
  if (!chartArr.length) return null;
  // 设置图表容器大小
  baseConfig.container = containerSize;
  // 设置画布的大小
  baseConfig.size = chartSize;
  // 设置单位
  baseConfig.has = {
    unit: canvasCss.hasUnit !== 'origin'
  };
  // 设置X轴标题
  setDivide(baseConfig.divide, canvasCss.axis_style, canvasFeatures.x || []);
  // 设置数据，设置Y轴,颜色
  setRowAggr(baseConfig.data, featureData, canvasFeatures, canvasCss, aggrList);
  // 设置网格线
  setGrid(baseConfig.grid, canvasCss.axis_style);
  // 设置斜线
  setCutOff(baseConfig.cutoff, canvasCss.axis_style);
  // // 设置颜色
  // setColor(baseConfig.color, canvasCss);
  // baseConfig.data.range.color = canvasCss.colorRanges ? canvasCss.colorRanges.map(c => c.range) : [];
  // baseConfig.data.range.size = canvasCss.sizeRanges ? canvasCss.sizeRanges.map(c => c.range) : [];
  // 画图
  let chartIns = [];
  if (canvasCss.axis_style.combined) {
    baseConfig.bindto = `#${chartArr[0].id}`;
    setAxis(baseConfig.axis, canvasCss.axis_style, canvasFeatures.x || [], canvasCss.axis_scale, 0, bgCss);
    setData(baseConfig.data, featureData, canvasFeatures, canvasCss, aggrList, bgCss);
    chartIns.push(mc.generate(baseConfig));
  } else {
    let list = JSON.parse(JSON.stringify(baseConfig.data.row.aggressions));
    let label = JSON.parse(JSON.stringify(baseConfig.label));
    for (let i = 0; i < list.length; i++) {
      let config = baseConfig;
      config.bindto = `#${chartArr[i].id}`;
      setAxis(config.axis, canvasCss.axis_style, canvasFeatures.x || [], canvasCss.axis_scale, i, bgCss);
      setOneData(config.data, featureData, canvasFeatures, canvasCss, list[i], i, bgCss);
      let { format, text } = setOneLabel(label, i);
      config.label.text = text;
      config.label.format = format;
      chartIns.push(mc.generate(config));
    }
  }
  return chartIns;
};

function setRowAggr (data, featureData, canvasFeatures, canvasCss, aggrList) {
  data.type = 'bar';
  data.json = getData(featureData); // 设置json
  // 设置column跟row
  data.column.categories = getColumnCat(canvasFeatures.x || []);
  data.row.aggressions = getRowAggr(canvasFeatures.y || [], aggrList);
  data.row.categories = getRowCat(canvasFeatures.y || []);
}

function setOneData (data, featureData, canvasFeatures, canvasCss, aggressions, index) {
  data.row.aggressions = [aggressions];
  let list = [];
  for (let i = 0; i < index; i++) {
    list.push([]);
  }
  list.push(aggressions);
  data.combined = setBarAndLineOne(featureData, list, canvasCss, canvasFeatures, 'bar');
}

function setData (data, featureData, canvasFeatures, canvasCss, aggrList) {
  data.type = 'bar';
  data.json = getData(featureData); // 设置json
  // 设置column跟row
  data.column.categories = getColumnCat(canvasFeatures.x || []);
  data.row.aggressions = getRowAggr(canvasFeatures.y || [], aggrList);
  data.row.categories = getRowCat(canvasFeatures.y || []);
  // 设置combined,Y轴
  data.combined = setBarAndLineOne(featureData, data.row.aggressions, canvasCss, canvasFeatures, 'bar');
}
export {
  drawBar,
  initBarCss,
  setBarTooltip
};
