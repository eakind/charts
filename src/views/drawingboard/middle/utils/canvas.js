import i18n from '@/i18n';
import { notEmpty } from '@/utils/check.js';

// 设置刻度
const initScaleStyle = function (xAxis, yAxis, axisStyle, yList, titleCss) {
  let scaleList = [];
  let scopeList = [];
  let scales = axisStyle.scaleList || [];
  let scopes = axisStyle.scopeList || [];
  titleCss = titleCss || {};
  for (let i = 0; i < xAxis.length; i++) {
    // 筛选已经有设置过样式的feature
    let list = scales.filter((item) => item.axis === i18n.t('message.x_axis') && item.feature === xAxis[i]);
    let boolean = xAxis[i] instanceof Array;
    if (boolean) {
      list = scales.filter((item) => item.axis === i18n.t('message.x_axis') && item.feature === xAxis[i][0]);
    }
    if (!list.length) {
      if (boolean) {
        scaleList.push(setScale(xAxis[i][0], xAxis[i][0], i18n.t('message.x_axis'), titleCss));
      } else {
        scaleList.push(setScale(xAxis[i], xAxis[i], i18n.t('message.x_axis'), titleCss));
      }
    } else {
      scaleList.push(list[0]);
    }
  }
  for (let i = 0; i < yAxis.length; i++) {
    let leftLen = 0; let leftTitle = ''; let leftFeature = ''; let leftStr = '';
    let rightLen = 0; let rightTitle = ''; let rightFeature = ''; let rightStr = '';
    console.log(leftStr);
    console.log(rightStr);
    let tempAxis = JSON.parse(JSON.stringify(yAxis[i]));
    if (notEmpty(yList[i].left)) {
      leftLen = yList[i].left.length;
      leftStr = String(tempAxis.splice(0, leftLen));
      leftTitle = leftStr.split(',').join('&');
      leftFeature = leftStr.split(',').join('');
    };
    if (notEmpty(yList[i].right)) {
      rightLen = yList[i].right.length;
      rightStr = String(tempAxis.splice(0, rightLen));
      rightTitle = rightStr.split(',').join('&');
      rightFeature = rightStr.split(',').join('');
    }
    if (notEmpty(yList[i].pills)) {
      let pills = yList[i].pills;
      for (let j = 0; j < pills.length; j++) {
        if (pills[j].status === 'left') {
          leftLen++;
        } else {
          rightLen++;
        }
      }
      leftStr = String(tempAxis.splice(0, leftLen));
      leftTitle = leftStr.split(',').join('&');
      leftFeature = leftTitle.split('&').join('');
      rightStr = String(tempAxis.splice(0, rightLen));
      rightTitle = rightStr.split(',').join('&');
      rightFeature = rightStr.split(',').join('');
    }
    for (let j = 0; j < yAxis[i].length; j++) {
      if (leftLen && rightLen) {
        if ((leftLen - 1) === j) {
          scaleList.push(getScale(scales, leftTitle, leftFeature, titleCss));
          scopeList.push(getScope(scopes, leftTitle, leftFeature, i));
        }
        if ((rightLen + leftLen - 1) === j) {
          scaleList.push(getScale(scales, rightTitle, rightFeature, titleCss));
          scopeList.push(getScope(scopes, rightTitle, rightFeature, i));
        }
      } else {
        scaleList.push(getScale(scales, yAxis[i][j], yAxis[i][j], titleCss));
        scopeList.push(getScope(scopes, yAxis[i][j], yAxis[i][j], i));
      }
    }
  }
  return { scaleList, scopeList };
};

function getScope (scopes, title, feature, index) {
  let scope = scopes.filter(item => item.axis === i18n.t('message.y_axle') && item.feature === feature);
  if (!scope.length) {
    return setScope(title, feature, i18n.t('message.y_axle'), index, scopes[0]);
  } else {
    return scope[0];
  }
}

function getScale (scales, title, feature, titleCss) {
  let scale = scales.filter(item => item.axis === i18n.t('message.y_axle') && item.feature === feature);
  if (!scale.length) {
    return setScale(title, feature, i18n.t('message.y_axle'), titleCss);
  } else {
    return scale[0];
  }
}

/*
 初始化设置刻度值样式
 item: 坐标轴名字
 type: 坐标轴类型
 legend: 坐标轴特征聚合函数
*/
function setScale (item, feature, type, titleCss) {
  let obj = {
    axis: type,
    color: titleCss.color ? titleCss.color : '#6B6B6B',
    fontSize: 12,
    rotate: 'rotate0',
    name: item,
    feature: feature,
    belongTo: [{
      name: item
    }]
  };
  return obj;
}

/*
  初始化设置刻度值范围
  item: 坐标轴名字
  type: 坐标轴类型
  index: 下标
  axisDomain: 存储刻度值范围的数组
  legend: 坐标轴特征聚合函数
*/
function setScope (item, feature, type, index, scopeObj) {
  let obj = {
    axis: type,
    name: item,
    select: scopeObj ? scopeObj.select : 0,
    align: true,
    feature: feature,
    index: index,
    belongTo: [{
      feature: {
        name: item
      }
    }]
  };
  // for (let key in axisDomain) {
  //   if (key.includes(item)) {
  //     obj.min = axisDomain[key].domain[0];
  //     obj.max = axisDomain[key].domain[1];
  //     obj.num = axisDomain[key].ticks_length;
  //   }
  // }
  return obj;
}

// 设置网格线
const initGridStyle = function (axisStyle) {
  let grid_style = {
    stroke: '#c2c9d1',
    'stroke-width': 1,
    'stroke-dasharray': '0,0'
  };
  let grid_show = false;
  if (axisStyle.grid_style) {
    grid_style = axisStyle.grid_style;
    grid_show = axisStyle.grid_show;
  }
  return {
    grid_style,
    grid_show: grid_show
  };
};

// 设置坐标轴样式
const initAxisStyle = function (xAxis, yAxis, axisStyle, yList, titleCss) {
  let fontList = [];
  let axisList = [];
  let fonts = axisStyle.fontList || [];
  let axiss = axisStyle.axisList || [];
  titleCss = titleCss || {};
  for (let i = 0; i < xAxis.length; i++) {
    // 筛选判断有设置过样式的feature
    let font = fonts.filter((item) => item.axis === i18n.t('message.x_axis') && item.feature === xAxis[i]);
    let axis = axiss.filter((item) => item.axis === i18n.t('message.x_axis') && item.feature === xAxis[i]);
    if (xAxis[i] instanceof Array) {
      font = fonts.filter((item) => item.axis === i18n.t('message.x_axis') && item.feature === xAxis[i][0]);
      axis = axiss.filter((item) => item.axis === i18n.t('message.x_axis') && item.feature === xAxis[i][0]);
    }
    if (!font.length) {
      let list = fonts.filter((item) => item.axis === i18n.t('message.x_axis'));
      if (xAxis[i] instanceof Array) {
        fontList.push(setFont(xAxis[i][0], xAxis[i][0], i18n.t('message.x_axis'), list, titleCss));
      } else {
        fontList.push(setFont(xAxis[i], xAxis[i], i18n.t('message.x_axis'), list, titleCss));
      }
    } else {
      fontList.push(font[0]);
    }
    if (!axis.length) {
      let list = axiss.filter((item) => item.axis === i18n.t('message.x_axis'));
      if (xAxis[i] instanceof Array) {
        axisList.push(setAxis(xAxis[i][0], xAxis[i][0], i18n.t('message.x_axis'), list));
      } else {
        axisList.push(setAxis(xAxis[i], xAxis[i], i18n.t('message.x_axis'), list));
      }
    } else {
      axisList.push(axis[0]);
    }
  }

  for (let i = 0; i < yAxis.length; i++) {
    let leftLen = 0; let leftTitle = ''; let leftFeature; let leftStr = '';
    let rightLen = 0; let rightTitle = ''; let rightFeature; let rightStr = '';
    let tempAxis = JSON.parse(JSON.stringify(yAxis[i]));
    if (notEmpty(yList[i].left)) {
      leftLen = yList[i].left.length;
      leftStr = String(tempAxis.splice(0, leftLen));
      leftTitle = leftStr.split(',').join('&');
      leftFeature = leftStr.split(',').join('');
    };
    if (notEmpty(yList[i].right)) {
      rightLen = yList[i].right.length;
      rightStr = String(tempAxis.splice(0, rightLen));
      rightTitle = rightStr.split(',').join('&');
      rightFeature = rightStr.split(',').join('');
    }
    if (notEmpty(yList[i].pills)) {
      let pills = yList[i].pills;
      for (let j = 0; j < pills.length; j++) {
        if (pills[j].status === 'left') {
          leftLen++;
        } else {
          rightLen++;
        }
      }
      leftStr = String(tempAxis.splice(0, leftLen));
      leftTitle = leftStr.split(',').join('&');
      leftFeature = leftTitle.split(',').join('');
      rightStr = String(tempAxis.splice(0, rightLen));
      rightTitle = rightStr.split(',').join('&');
      rightFeature = rightStr.split(',').join('');
    }
    for (let j = 0; j < yAxis[i].length; j++) {
      if (leftLen && rightLen) {
        if ((leftLen - 1) === j) {
          fontList.push(getFont(fonts, leftTitle, leftFeature, titleCss));
          axisList.push(getAxis(axiss, leftTitle, leftFeature));
        }
        if ((rightLen + leftLen - 1) === j) {
          fontList.push(getFont(fonts, rightTitle, rightFeature, titleCss));
          axisList.push(getAxis(axiss, rightTitle, rightFeature));
        }
      } else {
        fontList.push(getFont(fonts, yAxis[i][j], yAxis[i][j], titleCss));
        axisList.push(getAxis(axiss, yAxis[i][j], yAxis[i][j]));
      }
    }
  };
  return {
    fontList,
    axisList
  };
};

function getFont (fonts, title, feature, titleCss) {
  let font = fonts.filter((item) => item.axis === i18n.t('message.y_axle') && item.feature === feature);
  if (!font.length) {
    let list = fonts.filter((item) => item.axis === i18n.t('message.y_axle'));
    return setFont(title, feature, i18n.t('message.y_axle'), list, titleCss);
  } else {
    return font[0];
  }
}

function getAxis (axiss, title, feature) {
  let axis = axiss.filter((item) => item.axis === i18n.t('message.y_axle') && item.feature === feature);
  if (!axis.length) {
    let list = axiss.filter((item) => item.axis === i18n.t('message.y_axle'));
    return setAxis(title, feature, i18n.t('message.y_axle'), list);
  } else {
    return axis[0];
  }
}

/*
  初始化设置坐标轴字体
  item: 坐标轴特征名字
  type: 坐标轴类型
  legend: 坐标轴特征聚合函数
*/
function setFont (item, feature, type, list, titleCss) {
  let defaultColor = titleCss.color ? titleCss.color : '#6B6B6B';
  let defaultSize = 12;
  for (let i = 0; i < list.length; i++) {
    if (list[i].color !== defaultColor) {
      defaultColor = list[i].color;
    }
    if (list[i].fontSize !== defaultSize) {
      defaultSize = list[i].fontSize;
    }
  }
  let obj = {
    fontSize: defaultSize,
    fontStyle: 'normal',
    show: true,
    feature: feature,
    title: item,
    color: defaultColor,
    axis: type,
    belongTo: [{
      name: item
    }]
  };
  // if (type === i18n.t('message.y_axle')) {
  //   obj.belongTo = [{
  //     feature: {
  //       name: item,
  //       legend: legend
  //     }
  //   }];
  // }
  return obj;
}

/*
  初始化设置坐标轴
  item: 坐标轴名字
  type: 坐标轴类型
  legend: 坐标轴特征聚合函数
*/
function setAxis (item, feature, type, list, legend) {
  let defaultColor = '#c2c9d1';
  let defaultStyle = 'line';
  let defaultThickness = 1;
  for (let i = 0; i < list.length; i++) {
    if (list[i].color !== defaultColor) {
      defaultColor = list[i].color;
    }
    if (list[i].style !== defaultStyle) {
      defaultStyle = list[i].style;
    }
    if (list[i].thickness !== defaultThickness) {
      defaultThickness = list[i].thickness;
    }
  }
  let obj = {
    axis: type,
    style: defaultStyle,
    color: defaultColor,
    feature: feature,
    title: item,
    thickness: defaultThickness,
    show: true,
    belongTo: [{
      name: item
    }]
  };
  if (type === i18n.t('message.y_axle')) {
    obj.belongTo = [{
      feature: {
        name: item,
        legend: legend
      }
    }];
  }
  return obj;
}

// 设置提示框样式
const initToolTipStyle = function (list, tooltipFormat, numberFormat, textFormat) {
  let tooltipData = [];
  for (let i = 0; i < list.length; i++) {
    if (!list[i].feature) continue;
    let format = {};
    if (list[i].type === 'linear') {
      if (notEmpty(numberFormat) && notEmpty(numberFormat[list[i].feature])) {
        format = numberFormat[list[i].feature];
      } else {
        format = {
          useThousandMark: true,
          selectFormat: -1,
          decimal: '',
          negative: '-1234',
          unit: '',
          prefix: '',
          suffix: '',
          zone: `¥ ${i18n.t('message.rmb')}`
        };
      }
    };
    let temp = {};
    if (notEmpty(textFormat) && notEmpty(textFormat[list[i].feature])) {
      let obj = textFormat[list[i].feature];
      temp = {
        key: list[i].feature,
        display: obj.display ? obj.display : 'auto',
        title: obj.title ? obj.title : list[i].feature,
        text: {
          align: obj.align,
          fontSize: obj.fontSize,
          fontColor: obj.fontColor,
          fontStyle: obj.fontStyle,
          decoration: obj.decoration,
          letterSpacing: obj.letterSpacing,
          lineHeight: obj.lineHeight,
          sketchStyle: obj.sketchStyle
        }
      };
    } else {
      temp = {
        key: list[i].feature,
        display: 'auto',
        title: list[i].feature,
        text: {
          align: 'left',
          fontSize: 12,
          fontColor: '#6B6B6B',
          fontStyle: 'normal',
          decoration: '',
          letterSpacing: '0',
          lineHeight: '24',
          sketchStyle: {}
        }
      };
    }
    tooltipData.push({ ...temp, format, type: list[i].type });
  }
  return tooltipData;
};

export {
  initScaleStyle,
  initGridStyle,
  initAxisStyle,
  initToolTipStyle
};
