import i18n from '@/i18n';
import {
  initScaleStyle,
  initGridStyle,
  initAxisStyle,
} from '@/views/drawingboard/middle/utils/canvas.js';
import { setGrid, setAxis } from './draw';
import { isEmpty } from 'lodash';

import {
  modifyAggrFeature,
  getColorSizeLabel,
  defaultConfig,
} from './baseConfig';

import { pieDrawingChartStyleProcess } from './drawPie';

let {
  axisDefaultStyle: { title, line, label },
} = defaultConfig;

const initScatterCss = function (
  canvasFeatures,
  axis_style,
  aggrList,
  titleCss
) {
  let xAxis = getColumnAggr(canvasFeatures.x || [], aggrList);
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

const setScatterTooltip = function (canvasFeatures, aggrList) {
  let xAxis = getColumnAggr(canvasFeatures.x || [], aggrList);
  let yAxis = getRowAggr(canvasFeatures.y || [], aggrList);
  let tooltipList = [];
  for (let i = 0; i < xAxis.length; i++) {
    tooltipList.push({
      feature: xAxis[i][0],
      type: 'linear',
    });
  }
  for (let i = 0; i < yAxis.length; i++) {
    for (let j = 0; j < yAxis[i].length; j++) {
      tooltipList.push({
        feature: yAxis[i][j],
        type: 'linear',
      });
    }
  }
  let colored = canvasFeatures.color || null;
  colored &&
    tooltipList.push({
      type: colored.dtype === 'AGGR' ? 'linear' : 'ordinal',
      feature: modifyAggrFeature(colored),
    });
  let sized = canvasFeatures.size || null;
  sized = sized && getColorSizeLabel('size', sized);
  !isEmpty(sized) &&
    tooltipList.push({
      type: 'linear',
      feature: sized.feature,
    });

  let labels = getRowAggr(canvasFeatures.labels || [], aggrList);
  for (let i = 0; i < labels.length; i++) {
    tooltipList.push({
      feature: labels[i][0],
      type: 'linear',
    });
  }

  let uniqueList = [];
  tooltipList.forEach((t) => {
    let exit = uniqueList.filter((old) => old.feature === t.feature);
    if (isEmpty(exit)) {
      uniqueList.push(t);
    }
  });
  return uniqueList;
};

const drawScatter = function (configObj) {
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
  // 绑定图表DOM
  if (!chartArr.length) return null;
  baseConfig.bindto = `#${chartArr[0].id}`;
  // 设置图表容器大小
  baseConfig.container = containerSize;
  // 设置画布的大小
  baseConfig.size = chartSize;
  // 设置单位
  baseConfig.has = {
    unit: canvasCss.hasUnit !== 'origin',
  };
  // 设置X轴
  setAxis(
    baseConfig.axis,
    canvasCss.axis_style,
    canvasFeatures.x || [],
    canvasCss.axis_scale,
    0
  );
  baseConfig.axis.type = 'numeric';
  // 设置数据，设置Y轴
  setData(baseConfig.data, featureData, canvasFeatures, canvasCss, aggrList);
  // 设置线
  setLine(baseConfig.line);
  // 设置网格线
  setGrid(baseConfig.grid, canvasCss.axis_style);
  // 设置斜线
  setCutOff(baseConfig.cutoff, canvasCss.axis_style);

  // 设置颜色
  setScatterColor(baseConfig.color, canvasCss);
  baseConfig.data.range.color = canvasCss.colorRanges
    ? canvasCss.colorRanges.map((c) => c.range)
    : [];
  baseConfig.data.range.size = canvasCss.sizeRanges
    ? canvasCss.sizeRanges.map((c) => c.range)
    : [];
  // 画图
  const chartIns = mc.generate(baseConfig);
  return chartIns;
};

function setScatterColor (color, canvasCss) {
  let colorList = [];
  let opacity = 1;
  if (canvasCss.colors) {
    colorList = canvasCss.colors.length > 0 && canvasCss.colors[0].colors;
  }
  if (canvasCss.colors_and_opacities_list) {
    // opacity =
    //   canvasCss.colors_and_opacities_list.length > 0 &&
    //   canvasCss.colors_and_opacities_list[0].opacity / 100;
    if (canvasCss.colors_and_opacities_list.length > 0) {
      opacity = canvasCss.colors_and_opacities_list[0].opacity / 100;
    }
  }
  color.colors = [colorList];
  color.opacity = [opacity];
}

function setData (data, featureData, canvasFeatures, canvasCss, aggrList) {
  data.type = 'scatter';
  data.json = featureData; // getData(featureData); // 设置json
  // 设置column跟row
  data.column.aggressions = getColumnAggr(canvasFeatures.x || [], aggrList);
  data.row.aggressions = getRowAggr(canvasFeatures.y || [], aggrList);

  // 设置combined,Y轴
  data.combined = setCombined(
    featureData,
    data.row.aggressions,
    canvasCss,
    canvasFeatures
  );
  data.sized = setSize(canvasFeatures.size);
  data.colored = setColor(canvasFeatures.color);
  data.labeled = setLabel(canvasFeatures.labels);
}

function setLabel (labels) {
  let arr = [];
  if (isEmpty(labels)) return [];
  for (let i = 0; i < labels.length; i++) {
    if (labels[i].legend && labels[i].formulaType !== 'AGGR') {
      let name = `${labels[i].legend.toLocaleLowerCase()}(${labels[i].name})`;
      if (labels[i].legend === 'PERCENTILE') {
        name = `${labels[i].legend.toLocaleLowerCase()}${
          labels[i].probability
        }(${labels[i].name})`;
      }
      arr.push(name);
    } else {
      arr.push(labels[i].name);
    }
  }
  return arr;
}

function setColor (color) {
  if (isEmpty(color)) {
    return {};
  }
  let obj = {
    feature: color.legend
      ? `${color.legend.toLocaleLowerCase()}(${color.name})`
      : color.name,
    stacked: true,
    type: color.legend ? 'linear' : 'ordinal',
  };
  if (color.formulaType === 'AGGR') {
    obj.feature = color.name;
  }
  return obj;
}

function setSize (size) {
  if (size) {
    if (size.formulaType === 'AGGR') {
      return {
        feature: size.name,
      };
    } else {
      return {
        feature: `${size.legend.toLocaleLowerCase()}(${size.name})`,
      };
    }
  }
  return {};
}

function setLine () {}

function setCutOff (cutoff, axisStyle) {
  // console.log(axisStyle)
  // cutoff.style = axisStyle.grid_style;
  cutoff.show = true;
}

function setCombined (featureData, aggrList, canvasCss, canvasFeatures) {
  let len = canvasFeatures.y.length;
  let combined = [];
  for (let i = 0; i < len; i++) {
    let item = [];
    item.push(
      getItem(
        featureData,
        aggrList[i][0],
        canvasCss,
        canvasFeatures,
        'y',
        aggrList[i][0]
      )
    );
    combined.push(item);
  }
  return combined;
}

function getItem (data, aggr, canvasCss, canvasFeatures, type, aggrTxt) {
  let item = {
    axis: type,
    bars: setBars(aggr, canvasCss, canvasFeatures),
    type: 'scatter',
    axis_style: setAxisStyle(aggr, aggrTxt, canvasCss.axis_style),
    color_style: colorStyle(),
    data: data,
  };
  return item;
}

function setBars (aggr, canvasCss, canvasFeatures) {
  let bars = {
    aggr: aggr,
    colored: {
      // feature: '', //canvasFeatures.color ? canvasFeatures.color.name : '',
      // type: 'ordinal',
      // stacked: true
    },
    labels: [], // canvasCss.isShowLabel ? aggrList : []
  };
  return bars;
}

function setAxisStyle (aggr, aggrTxt, axis_style) {
  axis_style = axis_style || {};
  const defaultColor = '#424242';
  let fontObj = !axis_style.fontList
    ? {}
    : axis_style.fontList.filter(
      (item) =>
        item.axis === i18n.t('message.y_axle') && item.feature === aggrTxt
    )[0];
  let lineObj = !axis_style.axisList
    ? {}
    : axis_style.axisList.filter(
      (item) =>
        item.axis === i18n.t('message.y_axle') && item.feature === aggrTxt
    )[0];
  let scaleObj = !axis_style.scaleList
    ? {}
    : axis_style.scaleList.filter(
      (item) =>
        item.axis === i18n.t('message.y_axle') && item.feature === aggrTxt
    )[0];
  let scopeObj = !axis_style.scopeList
    ? {}
    : axis_style.scopeList.filter(
      (item) =>
        item.axis === i18n.t('message.y_axle') && item.feature === aggrTxt
    )[0];
  let axisStyle = {
    show: true,
    tick: {
      style: {
        fill: scaleObj.color || defaultColor,
        'font-size': scaleObj.fontSize || 12,
      },
      counts: scopeObj.tick_counts || null,
      range: scopeObj.tick_range || [],
      rotate: !scaleObj.rotate
        ? 0
        : Number(scaleObj.rotate.split('rotate')[1]) || 0, // 文字旋转角度
    },
    text: {
      style: {
        fill: fontObj.color || defaultColor,
        'font-size': fontObj.fontSize || 12,
      },
      title: fontObj.title, // aggrList[0],
      show: fontObj.show,
    },
    line: {
      style: {
        stroke: lineObj.color,
        'stroke-width': lineObj.thickness,
        'stroke-dasharray': lineObj.style === 'line' ? '0,0' : '5,5',
      },
      show: lineObj.show,
    },
  };
  return axisStyle;
}

function colorStyle () {
  let colorStyle = {
    opacity: 1,
    schemes: [],
    colors: [],
    patterns: [],
    range: [],
  };
  return colorStyle;
}

function getColumnAggr (list, aggrList) {
  let len = list.length;
  let arr = [];
  for (let i = 0; i < len; i++) {
    let str = `${list[i].legend.toLocaleLowerCase()}(${list[i].name})`;
    if (list[i].formulaType === 'AGGR') {
      str = list[i].name;
    }
    arr.push([str]);
  }
  return arr;
}

function getRowAggr (list, aggrList) {
  let len = list.length;
  let arr = [];
  for (let i = 0; i < len; i++) {
    let str;
    if (list[i].legend) {
      str = `${list[i].legend.toLocaleLowerCase()}(${list[i].name})`;
    } else {
      str = list[i].name;
    }
    // let str = `${list[i].legend.toLocaleLowerCase()}(${list[i].name})`;
    if (list[i].formulaType === 'AGGR') {
      str = list[i].name;
    }
    arr.push([str]);
  }
  return arr;
}

// function getData (featureData) {
//   let arr = [];
//   let len = featureData.length;
//   for (let i = 0; i < len; i++) {
//     if (featureData[i].feature) {
//       arr.push(...featureData[i].feature);
//     } else {
//       for (let j = 0; j < featureData[i].left.length; j++) {
//         arr.push(...featureData[i].left[j]);
//       }
//       for (let j = 0; j < featureData[i].right.length; j++) {
//         arr.push(...featureData[i].right[j]);
//       }
//     }
//   }
//   return arr;
// }

let scatterDrawingChartStyleProcess = function ({
  featureList,
  canvasCss,
  chartType,
}) {
  let chartStyle = pieDrawingChartStyleProcess({
    featureList,
    canvasCss,
    chartType,
  });
  let funObj = chartStyleProcess(featureList, canvasCss);

  chartStyle.hasUnit = canvasCss.hasUnit !== 'origin';

  chartStyle.xAxis = funObj.axisStyleProcess('x');

  chartStyle.yAxis = funObj.axisStyleProcess('y');

  chartStyle.scopeObj = {
    num: 12,
    select: 1,
    tick_counts: '',
    tick_range: [],
    max: 1.1,
    min: 0,
    name: chartStyle.yAxis.key,
    align: true,
    scale: canvasCss.scopeObj ? canvasCss.scopeObj.scale || 1 : 1,
  };

  return chartStyle;
};

let chartStyleProcess = function (featureList, canvasCss) {
  return {
    tooltipList () {},
    axisStyleProcess: (axisType) => {
      let curFeatureList = featureList[axisType];
      if (curFeatureList.length === 0) {
        return {};
      }

      let curFeatureObj = (canvasCss.axis_style &&
        canvasCss.axis_style.length > 0 &&
        canvasCss.axis_style.find((i) => i.axisType === axisType)) || {
        title: {},
        line: {},
        label: {},
        grid: {},
      };
      let {
        title: { style: titleStyle = title, show: showTitle },
        line: { style: lineStyle = line, show: showLine },
        label: { style: labelStyle = label },
        grid,
      } = curFeatureObj;
      let featureName = modifyAggrFeature(curFeatureList[0]);

      let curAxisStyle = {
        axisType,
        position: axisType === 'x' ? 'bottom' : 'left',
        key: featureName,
        title: {
          value: featureName,
          show: typeof showTitle === 'undefined' ? true : showTitle,
          style: titleStyle,
        },
        line: {
          show: typeof showLine === 'undefined' ? true : showLine,
          style: lineStyle,
        },
        label: {
          style: labelStyle,
        },
        grid: {
          line: {
            style: grid.line && grid.line.style ? grid.line.style : line,
            show: grid.line && grid.line.show,
          },
        },
        tickLine: {
          style: line,
        },
      };
      return curAxisStyle;
    },
  };
};

export {
  drawScatter,
  initScatterCss,
  setScatterTooltip,
  scatterDrawingChartStyleProcess,
};
