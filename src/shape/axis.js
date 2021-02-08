import { tipTpl } from './tip';

const initXAxis = (middle, scaleX, width) => {
  let axis = getAxisX(scaleX, 'bottom');
  let axisPanel = setAxisX(middle, axis, 'bottom');
  setAxisLine(axisPanel);
  // setAxisXtitle(middle, '哈哈哈', tipTpl);
  // setAxisLabel(axisPanel, 'bottom', 0, tipTpl);
};

const initYAxis = (axisYContainer, scaleY, option, tipTpl, position) => {
  if (position === 'left') {
    setAxisYTitle(axisYContainer, '哈哈哈', 600);
  }
  let axis = getAxisY(scaleY, position);
  let axisPanel = setAxisY(axisYContainer, axis, position);
  setAxisLine(axisPanel);
  if (position === 'right') {
    setAxisYTitle(axisYContainer, '哈哈哈', 600);
  };
  setAxisLabel(axisPanel, position, 0, tipTpl);
};

const getAxisX = (scale, position) => {
  const scaleObj = {
    top: d3.axisTop(scale),
    bottom: d3.axisBottom(scale)
  };
  let axis = scaleObj[position]
    .tickPadding(6)
    .tickSizeInner(0)
    .tickSizeOuter(0);
  return axis;
};

const setAxisX = (axisPanel, axis, position) => {
  let scalePanel = axisPanel.append('svg');
  scalePanel.attr('width', 800)
    .attr('height', 60)
    .append('g')
    .attr('transform', () => {
      return `translate(${0},520)`;
    })
    .call(axis);
  return scalePanel;
};

const getAxisY = (scale, position) => {
  const scaleObj = {
    left: d3.axisLeft(scale),
    right: d3.axisRight(scale)
  };
  let axis = scaleObj[position]
    .tickPadding(6)
    .tickSizeInner(0)
    .tickSizeOuter(0);
  return axis;
};

const setAxisY = (axisPanel, axis, position) => {
  let scalePanel = axisPanel.append('svg');
  scalePanel.attr('width', 70)
    .attr('height', 600)
    .append('g')
    .attr('transform', () => {
      let translateX = 69;
      if (position === 'right') {
        translateX = 0;
      }
      return `translate(${translateX},10)`;
    })
    .call(axis);
  return scalePanel;
};

const setAxisYTitle = (axisPanel, name, height) => {
  axisPanel.append('svg')
    .attr('width', 30)
    .attr('height', height)
    .append('text')
    .attr('transform', 'translate(5, 5) rotate(90)')
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

const setAxisLabel = (scalePanel, position, rotate, width, textTip) => {
  let allText = scalePanel.selectAll('text');
  let fullLen = getTxtLen(width);
  allText.attr('font-size', 18) // 标签文本大小
    .attr('fill', 'red') // 标签文本颜色
    .attr('opacity', 1) // 标签文本透明度
    .text((d, index, node, a) => {
      if (position === 'bottom') {
        console.log(width);
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
      let offsetY = position === 'left' ? 18 : -18;
      let offsetX = position === 'left' ? 6 : -6;
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
      return i;
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
  getAxisY,
  setAxisY,
  initYAxis,
  initXAxis
};
