import { initScaleStyle, initGridStyle, initAxisStyle } from '@/views/drawingboard/middle/utils/canvas.js';

function getColumnCat (list) {
  let len = list.length;
  let arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(`${list[i].name}-DUMMY`);
  }
  return arr;
}

function getRowAgg (list) {
  let len = list.length;
  let arr = [];
  for (let i = 0; i < len; i++) {
    arr.push([`${list[i].legend.toLocaleLowerCase()}(${list[i].name})`]);
  }
  return arr;
}

const initStyle = (canvasFeatures, axis_style) => {
  let xAxis = getColumnCat(canvasFeatures.x || []);
  let yAxis = getRowAgg(canvasFeatures.y || []);
  let { scaleList, scopeList } = initScaleStyle(xAxis, yAxis, axis_style || {});
  let { grid_style, grid_show } = initGridStyle(axis_style || {});
  let { fontList, axisList } = initAxisStyle(xAxis, yAxis, axis_style || {});
  let axisStyle = {
    scaleList,
    scopeList,
    grid_style,
    grid_show,
    fontList,
    axisList
  };
  return axisStyle;
};

export {
  initStyle
};
