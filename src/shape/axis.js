import { tipTpl } from './tip';

// 初始化X轴
const initXAxis = (middle, scaleX, width, height, option) => {
  let position = option.position;
  let axis = getAxis(scaleX, position, 0);
  let axisPanel = setAxisX(middle, axis, width, height, position);
  setAxisLine(axisPanel, option.line.style);
  setAxisLabel(axisPanel, option.label, scaleX.bandwidth(), tipTpl);
  setAxisXtitle(axisPanel, option.title, width);
};

const setAxisX = (axisPanel, axis, width, height, position) => {
  const posObj = {
    bottom: height + 100,
    top: 100
  };
  let axisX = axisPanel.append('g')
    .attr('width', width)
    .attr('height', 100)
    .append('g')
    .attr('transform', () => {
      return `translate(${0},${posObj[position]})`;
    });
  axisX.call(axis);
  return axisX;
};

const initYAxis = (axisYContainer, scaleY, option, tipTpl, height, topAxisHeight) => {
  let position = option.position;
  if (position === 'left') {
    setAxisYTitle(axisYContainer, option.title, height);
  }
  let axis = getAxis(scaleY, position, 0);
  let axisPanel = setAxisY(axisYContainer, axis, position, topAxisHeight);
  setAxisLine(axisPanel, option.line.style);
  if (position === 'right') {
    setAxisYTitle(axisYContainer, option.title, height);
  };
  setAxisLabel(axisPanel, option.label, tipTpl);
};

const setAxisY = (axisPanel, axis, position, topAxisHeight) => {
  let scalePanel = axisPanel.append('svg');
  scalePanel.attr('width', 70)
    .append('g')
    .attr('transform', () => {
      let translateX = 69;
      if (position === 'right') {
        translateX = 0;
      }
      return `translate(${translateX},${topAxisHeight})`;
    })
    .call(axis);
  return scalePanel;
};

const getAxis = (scale, position, height) => {
  const scaleObj = {
    top: d3.axisTop(scale),
    bottom: d3.axisBottom(scale),
    left: d3.axisLeft(scale),
    right: d3.axisRight(scale)
  };
  let axis = scaleObj[position]
    .tickPadding(6)
    .tickSizeInner(-height)
    .tickSizeOuter(0);
  return axis;
};

const setAxisLine = (scalePanel, option) => {
  scalePanel.select('path')
    .attr('stroke-dasharray', option.lineDash.join(',')) // 虚实线
    .attr('stroke', option.fontColor) // 坐标轴线颜色
    .attr('stroke-width', option.lineWidth) // 坐标轴线宽度
    .attr('opacity', option.opacity); // 坐标轴线透明度
};

const setAxisYTitle = (axisPanel, titleOption) => {
  let titleStyle = titleOption.style;
  axisPanel.append('svg')
    .attr('width', 30)
    .append('text')
    .attr('transform', 'translate(5, 5) rotate(90)')
    .attr('fill', titleStyle.fontColor) // 标题颜色
    .attr('font-size', titleStyle.fontSize) // 标题大小
    .text(titleOption.value) // 标题名称
    .attr('title', titleOption.value);
};

const setAxisXtitle = (axisPanel, option, width) => {
  let titleStyle = option.style;
  axisPanel.append('g')
    .attr('height', 30)
    .attr('width', width)
    .append('text')
    .attr('transform', 'translate(700,60)')
    .attr('fill', titleStyle.fontColor)
    .attr('font-size', titleStyle.fontSize)
    .text(option.value)
    .attr('title', option.value);
};

const setAxisLabel = (scalePanel, option, width, textTip) => {
  let position = option.position;
  let labelStyle = option.style;
  let rotate = option.rotate;
  let allText = scalePanel.selectAll('text');
  let fullLen = getTxtLen(width, labelStyle.fontSize);
  allText.attr('font-size', labelStyle.fontSize) // 标签文本大小
    .attr('fill', labelStyle.fontColor) // 标签文本颜色
    .attr('opacity', labelStyle.opacity) // 标签文本透明度
    .attr('lengthAdjust', 'spacingAndGlyphs')
    .text((d, index, node, a) => {
      if (position === 'bottom') {
        let len = getTxtWidth(d, 18);
        if (len < width) {
          return d;
        } else {
          return rotate !== 90 ? d.slice(0, fullLen) + '...' : d;
        }
      }
      return d;
    })
    .on('mouseenter', (d) => {
      let len = getTxtWidth(d, 18);
      if (len > width) {
        tipTpl(d, true, textTip);
      }
    })
    .on('mouseout', () => {
      tipTpl('', false, textTip);
    });
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
      let offsetY = position === 'left' ? -28 : -18;
      let offsetX = position === 'left' ? 8 : -8;
      allText.attr('x', offsetX)
        .attr('y', offsetY);
    }
    allText.attr('transform', `rotate(${rotate})`);
  }
};

const getTxtLen = (width, font) => {
  let textDom = document.createElement('div');
  textDom.style.width = width + 'px';
  textDom.style.fontSize = font + 'px';
  textDom.style.overflowX = 'auto';
  textDom.style.whiteSpace = 'nowrap';
  let txt = '';
  for (let i = 0; i < width; i++) {
    txt = txt + '哈';
    textDom.innerText = txt;
    document.body.appendChild(textDom);
    if (textDom.scrollWidth >= width) {
      document.body.removeChild(textDom);
      return { limit: i, space: 1 };
    };
    document.body.removeChild(textDom);
  }

  return -1;
};

const getTxtWidth = (text, font) => {
  let textDom = document.createElement('span');
  textDom.innerText = text;
  textDom.style.fontSize = font + 'px';
  textDom.style.position = 'fixed';
  document.body.appendChild(textDom);
  let width = textDom.clientWidth;
  document.body.removeChild(textDom);
  return width;
};

export {
  setAxisLine,
  setAxisYTitle,
  setAxisLabel,
  setAxisY,
  initYAxis,
  initXAxis
  // initXAxis1
};
