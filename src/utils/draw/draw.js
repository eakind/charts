import i18n from '@/i18n';
import { notEmpty, isEmpty } from '@/utils/check.js';

// 设置网格线
const setGrid = (grid, axisStyle) => {
  axisStyle = axisStyle || {};
  grid.show = axisStyle.grid_show;
  grid.style = axisStyle.grid_style;
};

// 设置斜线
const setCutOff = (cutoff) => {
  // cutoff.style = axisStyle.grid_style;
  cutoff.show = false;
};

// 获取Column中的分类变量
const getColumnCat = (list) => {
  let len = list.length;
  let arr = [];
  for (let i = 0; i < len; i++) {
    let item = setCatName(list[i]);
    if (item instanceof Array) {
      arr.push(...item);
    } else {
      arr.push(item);
    }
  }
  return arr;
};

const setDivide = (divide, axisStyle, yList) => {
  axisStyle = axisStyle || {};
  let arr = [];
  // let yListName = yList.map((item) => {
  //   let itemName;
  //   if (item.split) {
  //     if (Array.isArray(item.split)) {
  //       itemName = item.name + ' ' + item.split.join('-').toLowerCase();
  //     } else {
  //       itemName = item.name + ' ' + (item.split ? item.split.split(',').join('-').toLowerCase() : item.split);
  //     }
  //   } else {
  //     itemName = item.name;
  //   }
  //   return itemName;
  // });
  let yListName = yList.map((item) => {
    let itemName;
    if (item.split) {
      if (Array.isArray(item.split)) {
        // itemName = item.name + ' ' + item.split.join('-').toLowerCase();
        itemName = {
          name: item.name,
          split: item.split.join('-').toLowerCase()
        };
      } else {
        // itemName = item.name + ' ' + (item.split ? item.split.split(',').join('-').toLowerCase() : item.split);
        itemName = {
          name: item.name,
          split: item.split ? item.split.split(',').join('-').toLowerCase() : item.split
        };
      }
    } else {
      itemName = {
        name: item.name
      };
    }
    return itemName;
  });
  axisStyle.fontList.forEach((item, idnex) => {
    yListName.forEach(yItem => {
      if (item.feature === yItem.name) {
        let itemTitle = item.title + (yItem.split ? yItem.split : '');
        arr.push(itemTitle);
      }
    });
  });
  // axisStyle.fontList.forEach((item, idnex) => {
  //   if (yListName.indexOf(item.feature) >= 0) {
  //     arr.push(item.title);
  //   }
  // });
  // for (let i = 0; i < yList.length; i++) {
  //   arr.push(yList[i].name);
  // }
  // arr = yListName;
  if (!arr.length) return;
  const defaultColor = '#424242';
  let fontObj = !axisStyle.fontList
    ? {}
    : axisStyle.fontList.filter(
      (item) => item.axis === i18n.t('message.x_axis')
    )[0];
  let scaleList = !axisStyle.scaleList
    ? {}
    : axisStyle.scaleList.filter(
      (item) => item.axis === i18n.t('message.x_axis')
    );
  let column = divide.column;
  column.text.show = true;
  column.text.title = arr.join('/');
  column.text.style = {
    fill: fontObj.color || defaultColor,
    'font-size': fontObj.fontSize || 12,
    'font-style': 'normal',
    'text-decoration': 'normal',
  };
  for (let i = 0; i < scaleList.length; i++) {
    column.tick.styleList.push({
      name: scaleList[i].feature,
      rotate: Number(scaleList[i].rotate.split('rotate')[1]) || 0,
      style: {
        fill: scaleList[i].color,
        'font-size': scaleList[i].fontSize,
      },
    });
  }
};

function setCatName (feature) {
  let name = feature.name;
  if (feature.split) {
    if (feature.split instanceof Array) {
      let arr = [];
      let list = feature.split;
      for (let i = 0; i < list.length; i++) {
        arr.push(
          `${name}${' '}${list[i]
            .split(',')
            .join('-')
            .toLocaleLowerCase()}`
        );
      }
      return arr;
    } else {
      name = `${name}${' '}${feature.split
        .split(',')
        .join('-')
        .toLocaleLowerCase()}`;
    }
  }
  return name;
}

function setAggrName (feature) {
  if (feature.legend && feature.formulaType !== 'AGGR') {
    if (feature.legend === 'PERCENTILE') {
      return `${feature.legend.toLocaleLowerCase()}${feature.probability}(${
        feature.name
      })`;
    }
    return aggrName(feature.rate, `${feature.legend.toLocaleLowerCase()}(${feature.name})`);
  } else {
    return aggrName(feature.rate, feature.name);
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

function setToolTipName (feature) {
  if (feature.legend && feature.formulaType !== 'AGGR') {
    let name = `${feature.legend.toLocaleLowerCase()}(${feature.name})`;
    return {
      name: aggrName(feature.rate, name),
      type: feature.legend ? 'AGGR' : 'CAT',
    };
  }
  return {
    name: feature.name,
    type: feature.legend ? 'AGGR' : 'CAT',
  };
}

function setToolTipList (feature) {
  let arr = [];
  arr.push(setToolTipName(feature));
  if (feature.color) {
    arr.push(setToolTipName(feature.color));
  }
  if (feature.labels) {
    for (let i = 0; i < feature.labels.length; i++) {
      arr.push(setToolTipName(feature.labels[i]));
    }
  }
  return arr;
}

const getBarLineFeature = (list) => {
  let len = list.length;
  let arr = [];
  for (let i = 0; i < len; i++) {
    let item = [];
    if (list[i].pills) {
      let pills = list[i].pills;
      for (let j = 0; j < pills.length; j++) {
        item.push(...setToolTipList(pills[j]));
      }
    } else {
      item.push(...setToolTipList(list[i]));
    }
    arr.push(item);
  }
  return arr;
};

const getRowFeature = (list) => {
  let len = list.length;
  let arr = [];
  for (let i = 0; i < len; i++) {
    let item = [];
    if (list[i].feature) {
      item.push(...setToolTipList(list[i].feature));
    } else {
      for (let j = 0; j < list[i].left.length; j++) {
        item.push(...setToolTipList(list[i].left[j]));
      }
      for (let j = 0; j < list[i].right.length; j++) {
        item.push(...setToolTipList(list[i].right[j]));
      }
    }
    arr.push(item);
  }
  return arr;
};

// 获取Row中的数值变量
const getRowAggr = (list) => {
  let len = list.length;
  let arr = [];
  for (let i = 0; i < len; i++) {
    if (list[i].feature) {
      if (list[i].feature.hasOwnProperty('legend')) {
        arr.push([setAggrName(list[i].feature)]);
      }
    } else {
      let leftAndRight = [];
      for (let j = 0; j < list[i].left.length; j++) {
        leftAndRight.push(setAggrName(list[i].left[j]));
      }
      for (let j = 0; j < list[i].right.length; j++) {
        leftAndRight.push(setAggrName(list[i].right[j]));
      }
      arr.push(leftAndRight);
    }
  }
  return arr;
};

const uniqueToolTip = (feature, list) => {
  for (let i = 0; i < list.length; i++) {
    if (feature === list[i].feature) {
      return false;
    }
  }
  return true;
};

// 获取Row中的分类变量
const getRowCat = (list) => {
  let len = list.length;
  let arr = [];
  for (let i = 0; i < len; i++) {
    if (list[i].feature) {
      if (!list[i].feature.hasOwnProperty('legend')) {
        let item = setCatName(list[i].feature);
        if (item instanceof Array) {
          arr.push(...item);
        } else {
          arr.push(item);
        }
      }
    }
  }
  return arr;
};

// 设置X轴样式
const setAxis = (axis, axisStyle, xList, axisScale, idx) => {
  axisStyle = axisStyle || {};
  let xAxis = axis.x;
  let lastX = xList[xList.length - 1];
  if (!lastX) return;
  const defaultColor = '#424242';
  xAxis.type = 'category';
  // 是否合并坐标轴
  axis.combined = axisStyle.combined;
  // 设置x轴的线
  let xLine = xAxis.line;
  // 筛选x轴线
  let lineObj = !axisStyle.axisList
    ? {}
    : axisStyle.axisList.filter(
      (item) => item.axis === i18n.t('message.x_axis')
    )[0] || {};
  xLine.show = lineObj.show; // 是否显示
  xLine.style = {
    stroke: lineObj.color || defaultColor,
    'stroke-width': lineObj.thickness,
    'stroke-dasharray': lineObj.style === 'line' ? '0,0' : '5,5',
  };
  // 设置x轴的文字
  let xText = xAxis.text;
  // 筛选x轴刻度
  // let fontObj = !axisStyle.fontList
  //   ? {}
  //   : axisStyle.fontList.filter(
  //     (item) => item.axis === i18n.t('message.x_axis')
  //   )[0];
  let fontObj = {};
  if (axisStyle.fontList) {
    let xList = axisStyle.fontList.filter((item) => {
      return item.axis === i18n.t('message.x_axis');
    });
    fontObj = xList[xList.length - 1];
  };
  xText.show = fontObj.show; // 是否显示
  xText.title = fontObj.title; // x轴标题
  xText.style = {
    fill: fontObj.color || defaultColor,
    'font-size': fontObj.fontSize,
  };

  // 设置x轴的刻度
  let xTick = xAxis.tick;
  let scaleObj = !axisStyle.scaleList
    ? {}
    : axisStyle.scaleList.filter(
      (item) => item.axis === i18n.t('message.x_axis')
    )[0] || {};
  xTick.style = {
    fill: scaleObj.color || defaultColor,
    'font-size': scaleObj.fontSize,
  };
  xTick.counts = null; // 设置x轴刻度个数
  xTick.range = []; // 设置X轴的刻度范围
  xTick.rotate = !scaleObj.rotate
    ? 0
    : Number(scaleObj.rotate.split('rotate')[1]) || 0; // 文字旋转角度

  // 设置缩放情况
  let zoom = axis.zoom;
  let temp = axisScale
    ? axisScale.filter((c) => c.target_index === idx)[0]
    : {};
  if (isEmpty(temp)) return;
  zoom.scale = temp.scale;
  zoom.translate = temp.translate;
  zoom.panning = zoomPanning(temp);
};

const setOneLabel = (label, index) => {
  let formatList = JSON.parse(JSON.stringify(label.format));
  let textList = JSON.parse(JSON.stringify(label.text));
  let format = [];
  let text = [];
  for (let i = 0; i < formatList.length; i++) {
    let nameIndex = Number(formatList[i].name.split('-')[0]);
    if (index === nameIndex) {
      let obj = formatList[i];
      if (index !== 0) {
        obj.name = '0-0';
      }
      format.push(obj);
    }
  }
  for (let i = 0; i < textList.length; i++) {
    let nameIndex = Number(textList[i].name.split('-')[0]);
    if (index === nameIndex) {
      let obj = textList[i];
      if (index !== 0) {
        obj.name = '0-0';
      }
      text.push(obj);
    }
  }
  return {
    format,
    text,
  };
};

function zoomPanning (temp) {
  return (id, value) => {
    if (isEmpty(temp)) {
      if (value.k === 1 && value.x === 0 && value.y === 0) {
      }
    } else {
      if (temp.translate) {
        if (
          value.k === temp.translate.k &&
          value.x === temp.translate.x &&
          value.y === temp.translate.y
        ) {
          return;
        }
        temp.translate = value;
      } else {
        if (value.k === 1 && value.x === 0 && value.y === 0) {
          return;
        }
        temp.translate = value;
      }
    }
  };
}

function setBarAndLineOne (
  featureData,
  aggrList,
  canvasCss,
  canvasFeatures,
  canvasType,
  flag) {
  let combined = [];
  let list = flag ? canvasFeatures.x : canvasFeatures.y;
  setCombinedData(combined, list, canvasType, featureData, canvasCss, aggrList);
  return JSON.parse(JSON.stringify(combined));
};

function setCombinedData (combined, list, canvasType, featureData, canvasCss, aggrList) {
  let aggrIndex = -1;
  for (let i = 0; i < list.length; i++) {
    let combinedItem = [];
    if (list[i].feature && list[i].feature.dtype === 'CAT') continue;
    aggrIndex++;
    if (!aggrList[aggrIndex]) continue;
    if (!aggrList[aggrIndex][0]) continue;
    if (list[i].feature) {
      combinedItem.push(setCombinedItem('y', canvasType, featureData[aggrIndex].feature, list[i].feature, canvasCss, aggrIndex, 0));
    } else {
      let leftList = list[i].left;
      let rightList = list[i].right;
      let totalIndex = 0;
      for (let j = 0; j < leftList.length; j++) {
        combinedItem.push(setCombinedItem('y', canvasType, featureData[aggrIndex].left[j], list[i].left[j], canvasCss, aggrIndex, totalIndex));
        totalIndex++;
      }
      for (let j = 0; j < rightList.length; j++) {
        combinedItem.push(setCombinedItem('y2', canvasType, featureData[aggrIndex].right[j], list[i].right[j], canvasCss, aggrIndex, totalIndex));
        totalIndex++;
      }
    }
    combined.push(combinedItem);
  }
}
function setColorLabels (feature) {
  let isAggrColor = false;
  let colorFeature = '';
  let labels = feature.labels || [];
  if (feature.color) {
    if (feature.color.legend) {
      isAggrColor = true;
    }
    colorFeature = setAggrName(feature.color);
  }
  return {
    colorFeature,
    isAggrColor,
    labels,
  };
}

function setCombinedItem (type, cavnasType, data, featureObj, canvasCss, index, childIndex) {
  let aggr = setAggrName(featureObj);
  let { colorFeature, isAggrColor, labels } = setColorLabels(featureObj);
  return {
    axis: type,
    bars: setBars(aggr, colorFeature, labels, isAggrColor),
    type: cavnasType,
    axis_style: setItemAxis(canvasCss.axis_style, aggr),
    color_style: setItemColor(canvasCss, aggr, index, childIndex),
    data: data,
  };
}

function setItemAxis (axis_style, aggrTxt) {
  axis_style = axis_style || {};
  const defaultColor = '#424242';
  let fontObj = !axis_style.fontList
    ? {}
    : axis_style.fontList.filter(
      (item) =>
        item.axis === i18n.t('message.y_axle') && (item.feature.includes(aggrTxt) || aggrTxt.includes(item.feature))
    )[0] || {};
  let lineObj = !axis_style.axisList
    ? {}
    : axis_style.axisList.filter(
      (item) =>
        item.axis === i18n.t('message.y_axle') && (item.feature.includes(aggrTxt) || aggrTxt.includes(item.feature))
    )[0] || {
      show: true
    };
  let scaleObj = !axis_style.scaleList
    ? {}
    : axis_style.scaleList.filter(
      (item) =>
        item.axis === i18n.t('message.y_axle') && (item.feature.includes(aggrTxt) || aggrTxt.includes(item.feature))
    )[0] || {};
  let scopeObj = !axis_style.scopeList
    ? {}
    : axis_style.scopeList.filter(
      (item) =>
        item.axis === i18n.t('message.y_axle') && (item.feature.includes(aggrTxt) || aggrTxt.includes(item.feature))
    )[0] || {};
  let axisStyle = {
    show: true,
    align: scopeObj.select === 2,
    tick: {
      style: {
        fill: scaleObj.color || defaultColor,
        'font-size': scaleObj.fontSize || 12,
      },
      counts: scopeObj.select !== 0 ? scopeObj.tick_counts || null : null,
      range: scopeObj.select !== 0 ? scopeObj.tick_range || null : null,
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
    zeroAligned: scopeObj.align, // 原点对齐
  };
  return axisStyle;
}

function setItemColor (canvasCss, aggr, objIndex, childIndex) {
  let opacityList = canvasCss.colors_and_opacities_list
    ? canvasCss.colors_and_opacities_list
    : [];
  let patternList = canvasCss.patterns ? canvasCss.patterns : [];
  let colorsList = canvasCss.colors ? canvasCss.colors : [];
  let rangeList =
    canvasCss.colorRanges &&
    canvasCss.colorRanges.find((i) => i && i.aggr === aggr);
  let colorStyle = {
    opacity: setOpacity(opacityList, aggr, objIndex, childIndex),
    schemes: [],
    colors: setColor(colorsList, aggr, objIndex, childIndex),
    patterns: setPatternList(patternList, aggr, objIndex, childIndex),
    range: rangeList ? rangeList.range : [],
  };
  return colorStyle;
}

function setPatternList (patternList, aggr, objIndex, childIndex) {
  let pattern = [];
  for (let i = 0; i < patternList.length; i++) {
    if (!patternList[i]) continue;
    if (patternList[i].id) {
      let id = Number(patternList[i].id.split('_')[2]);
      if (!id && id !== 0) {
        id = Number(patternList[i].key_id.split('-')[0]);
      }
      let keyId = Number(patternList[i].key_id.split('-')[1]);
      if (!patternList[i].id || !patternList[i].key_id) continue;
      if (patternList[i].aggr === aggr && id === objIndex && keyId === childIndex) {
        pattern = patternList[i].patternList;
      }
    } else {
      if (patternList[i].aggr === aggr) {
        pattern = patternList[i].patternList;
      }
    }
  }
  return pattern;
}

function setColor (colorsList, aggr, objIndex, childIndex) {
  let colors = [];
  for (let i = 0; i < colorsList.length; i++) {
    if (!colorsList[i]) continue;
    if (!colorsList[i].id || !colorsList[i].key_id) continue;
    let id = Number(colorsList[i].id.split('_')[2]);
    if (!id && id !== 0) {
      id = Number(colorsList[i].key_id.split('-')[0]);
    }
    let keyId = Number(colorsList[i].key_id.split('-')[1]);
    if (colorsList[i].aggr === aggr && id === objIndex && keyId === childIndex) {
      if (
        colorsList[i].colored_type === 'linear' &&
        colorsList[i].list.length > 1
      ) {
        for (let key in colorsList[i].colors) {
          colors.push(colorsList[i].colors[key]);
        }
      } else {
        colors = colorsList[i].colors;
      }
    }
  }
  return colors;
}

function setOpacity (opacityList, aggr, objIndex, childIndex) {
  let opacity = 1;
  for (let i = 0; i < opacityList.length; i++) {
    if (!opacityList[i]) continue;
    if (!opacityList[i].id || !opacityList[i].key_id) continue;
    let id = Number(opacityList[i].id.split('_')[2]);
    if (!id && id !== 0) {
      id = Number(opacityList[i].key_id.split('-')[0]);
    }
    let keyId = Number(opacityList[i].key_id.split('-')[1]);
    if (opacityList[i].aggr === aggr && id === objIndex && keyId === childIndex) {
      opacity = opacityList[i].opacity / 100;
    }
  }
  return opacity;
}

function setBars (aggr, colorName, labels, isAggrColor) {
  let bars = {
    aggr: aggr,
    labels: setLabel(labels),
  };
  if (colorName) {
    if (!isAggrColor) {
      bars.colored = {
        feature: colorName,
        type: 'ordinal',
        stacked: true,
      };
    } else {
      bars.colored = {
        feature: colorName,
        type: 'linear',
        stacked: false,
      };
    }
  }
  return bars;
}

function setLabel (list) {
  let arr = [];
  for (let i = 0; i < list.length; i++) {
    arr.push(setAggrName(list[i]));
  }
  return arr;
}

const getData = (featureData) => {
  let arr = [];
  let len = featureData.length;
  for (let i = 0; i < len; i++) {
    if (featureData[i].feature) {
      arr.push(...featureData[i].feature);
    } else {
      for (let j = 0; j < featureData[i].left.length; j++) {
        arr.push(...featureData[i].left[j]);
      }
      for (let j = 0; j < featureData[i].right.length; j++) {
        arr.push(...featureData[i].right[j]);
      }
    }
  }
  return arr;
};

export {
  setGrid,
  setCutOff,
  getColumnCat,
  getRowAggr,
  getRowCat,
  getRowFeature,
  setAxis,
  getData,
  getBarLineFeature,
  setOneLabel,
  uniqueToolTip,
  setDivide,
  setBarAndLineOne,
  setCombinedItem,
  setAggrName
};
