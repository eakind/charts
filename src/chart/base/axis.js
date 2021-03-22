import { tipTpl } from '../../shape/tip';
import { getTxtLen, getTxtWidth } from '../../utils/utils';
// 初始化X轴
const initXAxis = (middle, scaleX, width, height, option, topAxisHeight, bottomAxisHeight, xAxisList) => {
  let position = option.position;
  // 生成坐标轴
  let axis = createAxis(scaleX, position);
  // 轴绑定刻度
  let axisPanel = setScaleForAxisX(middle, axis, height, position, topAxisHeight);
  // 配置轴线样式
  setAxisLineStyle(axisPanel, option.line.style);
  // 配置轴标签样式
  setAxisLabelStyle(axisPanel, option.label, scaleX.bandwidth(), tipTpl, position);
  // 配置轴标题样式
  setAxisXTitleStyle(axisPanel, option.title, width, bottomAxisHeight);
};

const initYAxis = (axisYContainer, scaleY, option, tipTpl, height, topAxisHeight, width, titleWidth, index, isLast) => {
  let position = option.position;
  // 生成坐标轴
  let axis = createAxis(scaleY, position);
  // 轴绑定刻度值
  let axisPanel = setScaleForAxisY(axisYContainer, axis, position, topAxisHeight, width, index, height);
  // 配置轴样式
  setAxisLineStyle(axisPanel, option.line.style);
  // 配置轴标签样式
  setAxisLabelStyle(axisPanel, option.label, width, tipTpl, position, index, isLast);
  // 配置轴标题样式
  setAxisYTitleStyle(axisYContainer, option.title, position, width, titleWidth, topAxisHeight, height, index);
};

const createAxis = (scale, position) => {
  const scaleObj = {
    top: d3.axisTop(scale),
    bottom: d3.axisBottom(scale),
    left: d3.axisLeft(scale),
    right: d3.axisRight(scale)
  };
  let axis = scaleObj[position]
    .tickPadding(6)
    .tickSizeInner(0)
    .tickSizeOuter(0);
  if (position === 'left' || position === 'right') {
    let arr = setTickValues(scale.domain(), 5);
    axis.tickValues(arr);
  }
  return axis;
};

const setTickValues = (domain, counts) => {
  let tickArray = [];
  let gap = Math.floor((domain[1] - domain[0]) / counts);
  for (let i = 0; i <= counts; i++) {
    tickArray.push(domain[0] + gap * i);
  }
  return tickArray;
};

const setAxisLineStyle = (scalePanel, option) => {
  scalePanel.select('path')
    .attr('stroke-dasharray', option.lineDash.join(',')) // 虚实线
    .attr('stroke', option.fontColor) // 坐标轴线颜色
    .attr('stroke-width', option.lineWidth) // 坐标轴线宽度
    .attr('opacity', option.opacity); // 坐标轴线透明度
};

const setAxisLabelStyle = (scalePanel, option, width, textTip, position, yIndex, isLast) => {
  let labelStyle = option.style;
  let rotate = option.rotate;
  let allText = scalePanel.selectAll('text');
  let txtNum = allText._groups[0].length - 1;
  let fullLen = getTxtLen(width, labelStyle.fontSize);
  allText.attr('font-size', labelStyle.fontSize) // 标签文本大小
    .attr('fill', labelStyle.fontColor) // 标签文本颜色
    .attr('opacity', labelStyle.opacity) // 标签文本透明度
    .attr('text-anchor', () => {
      if (position === 'bottom') {
        let obj = {
          90: 'end',
          0: 'middle',
          45: 'end',
          '-45': 'start'
        };
        return obj[rotate];
      }
    })
    .text((d, index) => {
      if (position === 'bottom') {
        let txt = String(d).split('|~|')[0];
        let len = getTxtWidth(txt, labelStyle.fontSize);
        if (len < width) {
          return txt;
        } else {
          return rotate !== 90 ? txt.slice(0, fullLen) + '...' : txt;
        }
      }
      return yIndex !== 0 && txtNum === index ? '' : d;
    })
    .on('mouseenter', (d) => {
      let txt = d.split('|~|')[0];
      let len = getTxtWidth(txt, labelStyle.fontSize);
      if (len > width) {
        tipTpl(txt, true, textTip);
      }
    })
    .on('mouseout', () => {
      tipTpl('', false, textTip);
    });
  if (position === 'bottom') {
    allText.attr('transform', (d) => {
      let len = getTxtWidth(d, labelStyle.fontSize) + 4;
      const transfromObj = {
        45: `translate(0, ${len}) rotate(45)`,
        '-45': `translate(0, ${len}) rotate(-45)`,
        90: `translate(0, ${len}) rotate(90)`,
        0: 'translate(0, 5)'
      };
      return transfromObj[rotate];
    });
  } else {
    if (rotate === 90) {
      let offsetY = position === 'left' ? -28 : -28;
      let offsetX = position === 'left' ? 8 : -8;
      allText.attr('x', offsetX)
        .attr('y', offsetY);
    }
    allText.attr('text-anchor', position === 'right' ? 'start' : '');
    allText.attr('transform', `rotate(${rotate})`);
  }
};

const setScaleForAxisX = (axisPanel, axis, height, position, topAxisHeight) => {
  const posObj = {
    bottom: height + topAxisHeight,
    top: topAxisHeight
  };
  let axisX = axisPanel.append('g')
    .attr('transform', () => {
      return `translate(${0},${posObj[position]})`;
    });
  axisX.call(axis);
  return axisX;
};

const setAxisXTitleStyle = (axisPanel, option, width, bottomAxisHeight) => {
  let titleStyle = option.style;
  axisPanel.append('g')
    .append('text')
    .attr('text-anchor', 'end')
    .attr('transform', `translate(${width - 10},${bottomAxisHeight - 25 || 40})`)
    .attr('fill', titleStyle.fontColor)
    .attr('font-size', titleStyle.fontSize)
    .text(option.value)
    .attr('title', option.value);
};

const setScaleForAxisY = (axisPanel, axis, position, topAxisHeight, translateX, index, height) => {
  let scalePanel = axisPanel.append('g');
  scalePanel.attr('transform', () => {
    if (position === 'right') {
      translateX = 1;
    }
    return `translate(${translateX - 1},${topAxisHeight + (height * index)})`;
  })
    .call(axis);
  return scalePanel;
};

const setAxisYTitleStyle = (axisPanel, titleOption, position, width, titleWidth, topAxisHeight, height, index, yAxisMax) => {
  let titleStyle = titleOption.style;
  console.log(titleStyle.fontColor);
  axisPanel.append('g')
    .attr('transform', () => {
      let translateX = width - titleWidth + 12;
      if (position === 'right') {
        translateX = width - 12;
      }
      return `translate(${translateX}, ${topAxisHeight + 2 + (height * index)})`;
    })
    .append('text')
    .attr('text-anchor', 'start')
    .attr('font-size', titleStyle.fontSize) // 标题大小
    .attr('fill', titleStyle.fontColor) // 标题颜色
    .style('writing-mode', 'tb')
    .text(titleOption.value) // 标题名称
    .attr('title', titleOption.value);
};

export {
  initYAxis,
  initXAxis
};
