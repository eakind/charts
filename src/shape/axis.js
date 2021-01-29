const getAxisY = (scale, position) => {
  const scaleObj = {
    left: d3.axisLeft(scale),
    right: d3.axisRight(scale)
  };
  let axis = scaleObj[position].ticks(5)
    .tickPadding(6)
    .tickSizeInner(0)
    .tickSizeOuter(0);
  return axis;
};

const setAxisY = (axisPanel, axis, width, height, translateX) => {
  let scalePanel = axisPanel.append('svg');
  scalePanel.attr('width', width + 1)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${translateX},10)`)
    .call(axis);
  return scalePanel;
};

const setAxisYTitle = (axisPanel, name, height) => {
  axisPanel.append('svg')
    .attr('width', 30)
    .attr('height', height)
    .append('text')
    .attr('transform', 'translate(10, 5) rotate(90)')
    .attr('fill', 'blue') // 标题颜色
    .attr('font-size', 18) // 标题大小
    .text(name) // 标题名称
    .attr('title', name);
};

const setAxisLine = (scalePanel) => {
  scalePanel.select('path')
    .attr('stroke', 'red') // 坐标轴线颜色
    .attr('stroke-width', 1) // 坐标轴线宽度
    .attr('opacity', 1); // 坐标轴线透明度
};

const setAxisLabel = (scalePanel, position, rotate) => {
  let allText = scalePanel.selectAll('text');
  allText.attr('font-size', 18) // 标签文本大小
    .attr('fill', 'red') // 标签文本颜色
    .attr('opacity', 1); // 标签文本透明度
  if (position === 'bottom') {
    allText.attr('transform', (d) => {
      let len = String(d).length;
      const transfromObj = {
        45: `translate(0, ${6 * len}) rotate(45)`,
        '-45': `translate(0, ${6 * len}) rotate(-45)`,
        90: `translate(0, ${10 * len}) rotate(90)`,
        0: 'translate(0, 5)'
      };
      return transfromObj[rotate];
    });
  } else {
    if (rotate === 90) {
      let offsetY = position === 'left' ? 18 : -18;
      let offsetX = position === 'left' ? 6 : -6;
      allText.attr('x', offsetX)
        .attr('y', offsetY);
    }
    allText.attr('transform', `rotate(${rotate})`);
  }
};

export {
  setAxisLine,
  setAxisYTitle,
  setAxisLabel,
  getAxisY,
  setAxisY
};
