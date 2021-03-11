// import i18n from '@/i18n';
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
  getBarLineFeature,
  uniqueToolTip,
  setDivide,
  setCombinedItem
} from './draw.js';
import { isEmpty, notEmpty } from '../check.js';

const initBarLineCss = function (canvasFeatures, axis_style, aggrList, titleCss) {
  let xAxis = getColumnCat(canvasFeatures.x || []);
  let yAxis = getRowAggr(canvasFeatures.y || [], aggrList);
  let { scaleList, scopeList } = initScaleStyle(
    xAxis,
    yAxis,
    axis_style || {},
    canvasFeatures.y,
    titleCss
  );
  let { grid_style, grid_show } = initGridStyle(
    axis_style || {},
    canvasFeatures.y
  );
  let { fontList, axisList } = initAxisStyle(
    xAxis,
    yAxis,
    axis_style || {},
    canvasFeatures.y,
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

const setBarLineTooltip = function (canvasFeatures, aggrList) {
  let xAxis = getColumnCat(canvasFeatures.x || []);
  let yAxis = getBarLineFeature(canvasFeatures.y || [], aggrList);
  let tooltipList = [];
  for (let i = 0; i < xAxis.length; i++) {
    if (uniqueToolTip(xAxis[i], tooltipList)) {
      tooltipList.push({
        feature: xAxis[i],
        type: 'ordinal',
      });
    }
  }
  for (let i = 0; i < yAxis.length; i++) {
    for (let j = 0; j < yAxis[i].length; j++) {
      if (uniqueToolTip(yAxis[i][j].name, tooltipList)) {
        tooltipList.push({
          feature: yAxis[i][j].name,
          type: yAxis[i][j].type === 'AGGR' ? 'linear' : 'ordinal',
        });
      }
    }
  }
  return tooltipList;
};

const drawBarLine = function (configObj) {
  let {
    baseConfig,
    featureData,
    canvasCss,
    canvasFeatures,
    containerSize,
    chartSize,
    chartArr,
    aggrList,
  } = configObj;

  if (!chartArr.length) return null;
  // 设置图表容器大小
  baseConfig.container = containerSize;
  // 设置画布的大小
  baseConfig.size = chartSize;
  // 设置单位
  baseConfig.has = {
    unit: canvasCss.hasUnit !== 'origin',
  };
  // 设置X轴标题
  setDivide(baseConfig.divide, canvasCss.axis_style, canvasFeatures.x || []);
  // 设置数据，设置Y轴
  setRowAndCol(baseConfig.data, featureData, canvasFeatures, canvasCss, aggrList);
  // 设置网格线
  setGrid(baseConfig.grid, canvasCss.axis_style);
  // 设置斜线
  setCutOff(baseConfig.cutoff, canvasCss.axis_style);
  // 画图
  let chartIns = [];
  if (canvasCss.axis_style.combined) {
    baseConfig.bindto = `#${chartArr[0].id}`;
    setAxis(
      baseConfig.axis,
      canvasCss.axis_style,
      canvasFeatures.x || [],
      canvasCss.axis_scale,
      0
    );
    setData(baseConfig.data, featureData, canvasFeatures, canvasCss, aggrList);
    chartIns.push(mc.generate(baseConfig));
  } else {
    let list = JSON.parse(JSON.stringify(baseConfig.data.row.aggressions));
    for (let i = 0; i < list.length; i++) {
      baseConfig.bindto = `#${chartArr[i].id}`;
      setAxis(
        baseConfig.axis,
        canvasCss.axis_style,
        canvasFeatures.x || [],
        canvasCss.axis_scale,
        i
      );
      setOneData(
        baseConfig.data,
        featureData,
        canvasFeatures,
        canvasCss,
        list[i],
        i
      );
      chartIns.push(mc.generate(baseConfig));
    }
  }
  return chartIns;
};

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
  data.combined = setBarLineOne(
    JSON.parse(JSON.stringify(featureData)),
    list,
    canvasCss,
    canvasFeatures
  );
}

function setRowAndCol (data, featureData, canvasFeatures, canvasCss, aggrList) {
  data.type = 'bar-line';
  data.json = getData(featureData); // 设置json
  // 设置column跟row
  data.column.categories = getColumnCat(canvasFeatures.x || []);
  data.row.aggressions = getRowAggr(canvasFeatures.y || [], aggrList);
  data.row.categories = getRowCat(canvasFeatures.y || []);
}

function setData (data, featureData, canvasFeatures, canvasCss, aggrList) {
  data.type = 'bar-line';
  data.json = getData(featureData); // 设置json
  // 设置column跟row
  data.column.categories = getColumnCat(canvasFeatures.x || []);
  data.row.aggressions = getRowAggr(canvasFeatures.y || [], aggrList);
  data.row.categories = getRowCat(canvasFeatures.y || []);

  // 设置combined,Y轴
  data.combined = setBarLineOne(
    featureData,
    data.row.aggressions,
    canvasCss,
    canvasFeatures,
  );
}

function setBarLineOne (featureData,
  aggrList,
  canvasCss,
  canvasFeatures) {
  let combined = [];
  let list = canvasFeatures.y;
  setCombinedData(combined, list, featureData, canvasCss, aggrList);
  return JSON.parse(JSON.stringify(combined));
}

function setCombinedData (combined, list, featureData, canvasCss, aggrList) {
  let aggrIndex = -1;
  for (let i = 0; i < list.length; i++) {
    let combinedItem = [];
    if (list[i].dtype === 'CAT') continue;
    aggrIndex++;
    if (!aggrList[aggrIndex]) continue;
    if (!aggrList[aggrIndex][0]) continue;
    if (!list[i].pills) {
      combinedItem.push(setCombinedItem('y', list[i].type, featureData[aggrIndex], list[i], canvasCss, aggrIndex, 0));
    } else {
      let leftList = list[i].pills.filter(item => item.status === 'left');
      let rightList = list[i].pills.filter(item => item.status === 'right');
      let totalIndex = 0;
      for (let j = 0; j < leftList.length; j++) {
        combinedItem.push(setCombinedItem('y', leftList[j].type, featureData[aggrIndex][j], list[i].pills[j], canvasCss, aggrIndex, totalIndex));
        totalIndex++;
      }
      let childIndex = leftList.length;
      for (let j = 0; j < rightList.length; j++) {
        combinedItem.push(setCombinedItem('y2', rightList[j].type, featureData[aggrIndex][childIndex + j], list[i].pills[childIndex + j], canvasCss, aggrIndex, totalIndex));
        totalIndex++;
      }
    }
    combined.push(combinedItem);
  }
}

function setAggrName (feature) {
  if (feature.legend && feature.formulaType !== 'AGGR') {
    if (feature.legend === 'PERCENTILE') {
      return `${feature.legend.toLocaleLowerCase()}${feature.probability}(${
        feature.name
      })`;
    }
    return `${feature.legend.toLocaleLowerCase()}(${feature.name})`;
  } else {
    return feature.name;
  }
}

function aggrName (rate, newName) {
  if (notEmpty(rate)) {
    let { type, growth } = rate;
    if (growth) {
      newName = `${
        type === 'RING' ? 'Last Period' : 'Same Period'
      } Growth ${newName}`;
    } else {
      newName = `${type === 'RING' ? 'Last Period' : 'Same Period'} ${newName}`;
    }
  }
  return newName;
}

function getRowCat (list) {
  let len = list.length;
  let arr = [];
  for (let i = 0; i < len; i++) {
    if (list[i].level === 0) {
      arr.push(list[i].name);
    }
  }
  return arr;
}

function getRowAggr (list, aggrList) {
  let len = list.length;
  let arr = [];
  for (let i = 0; i < len; i++) {
    let pillArr = [];
    if (list[i].pills) {
      let pillList = list[i].pills;
      for (let j = 0; j < pillList.length; j++) {
        let name = setAggrName(pillList[j]);
        name = aggrName(pillList[j].rate, name);
        pillArr.push(name);
      }
    } else {
      if (list[i].level === 1) {
        let name = setAggrName(list[i]);
        name = aggrName(list[i].rate, name);
        pillArr.push(name);
      }
    }
    if (!isEmpty(pillArr)) {
      arr.push(pillArr);
    }
  }
  return arr;
}

function getData (featureData) {
  let arr = [];
  let len = featureData.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < featureData[i].length; j++) {
      if (featureData[i][j] instanceof Array) {
        arr.push(...featureData[i][j]);
      } else {
        arr.push(featureData[i][j]);
      }
    }
  }
  return arr;
}

export { drawBarLine, initBarLineCss, setBarLineTooltip };
