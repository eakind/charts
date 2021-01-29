import { isType } from '../utils/check';
import { retValue, drawSymbol } from './shape/index.js';
import { drawLabel } from './labels.js';
// let typeDrawPare = {
//   line: 'drawLine',
//   bar: 'drawPillar'
// };
const drawPillar = (container, config, xScale, yScale) => {
  let { xValue, yValue, tempXScale, tempYScale } = retValue(xScale, yScale);
  config.series.map((s) => {
    if (s.type && s.type !== 'bar') {
      // 画其他图
      return;
    }
    let {
      itemStyle = {
        color: '#3162B9',
        borderColor: 'none',
        borderWidth: 0,
        borderType: 'solid',
        barBorderRadius: 0,
        opacity: 1
      }
    } = s;
    let bandWidth = s.barWidth || 30;
    let type = '';
    if (isType('Array')(config.xAxis)) {
      type = config.xAxis[0].type;
    } else {
      type = config.xAxis.type;
    }
    if (type !== 'value') {
      bandWidth = tempXScale.bandwidth();
    }
    let svg = container
      .append('g')
      .selectAll('rect')
      .data(s.data)
      .enter()
      .append('rect')
      .attr('class', 'my-bar')
      .attr('transform', `translate(${config.xOffset},${config.yOffset})`)
      .attr('fill', itemStyle.color)
      .attr('stroke', itemStyle.borderColor)
      .attr('stroke-width', itemStyle.borderWidth)
      .attr('fill-opacity', itemStyle.opacity)
      .attr('style', `border-radius:${itemStyle.barBorderRadius}`);
    if (itemStyle.borderType !== 'solid') {
      svg.attr('stroke-dasharray', '5 5');
    }
    svg
      .attr('x', (d) => {
        return xValue(d) - bandWidth / 2;
      })
      .attr('y', () => {
        let min = tempYScale.domain()[0];
        return tempYScale(min);
      })
      .attr('data-data', (d) => {
        return d;
      })
      .attr('data-index', (d, index) => index)
      .attr('height', 0)
      .attr('width', bandWidth)
      .transition()
      .duration(300)
      .ease(d3.easeLinear)
      .attr('y', (d) => {
        return yValue(d);
      })
      .attr('height', (d) => {
        return config.height - config.grid.y - yValue(d);
      });
    let { label = {} } = s;
    // 画标签
    if (label.show) {
      drawLabel(container, s.data, xValue, yValue, label, config);
    }
  });
};
const drawLine = function (container, config, xScale, yScale) {
  let { xValue, yValue, tempXScale, tempYScale } = retValue(xScale, yScale);

  let symbolFun = drawSymbol(config, container, tempXScale, tempYScale);
  config.series.map((s) => {
    if (s.type && s.type !== 'line') {
      // 画其他图
      return;
    }
    let { smooth } = s;
    let d3Line = d3.line();
    if (smooth) {
      d3Line.curve(d3.curveBundle.beta(1));// d3.curveBundle.beta(1)
    }
    let dFun = d3Line
      .x((d) => xValue(d) + config.xOffset)
      .y((d) => yValue(d) + config.yOffset);
    var { color = '#a4a4a4', width = 1, type = 'solid', opacity = 1 } =
      s.lineStyle || {};

    container
      .append('g')
      .selectAll('path')
      .data([s.data])
      .enter()
      .append('path')
      // .attr('transform', `translate(${config.xOffset},${config.yOffset})`)
      .attr('class', 'my-line')
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-opacity', opacity)
      .attr('stroke-width', width)
      .attr('stroke-dasharray', type)
      .attr('d', dFun);
    let { symbolShow, symbol, label = {} } = s;
    // 画symbol
    if (symbolShow && isType('Function')(symbolFun[symbol])) {
      symbolFun[symbol](s);
    }
    // 画标签
    if (label.show) {
      drawLabel(container, s.data, xValue, yValue, label, config);
    }
  });
};
export { drawPillar, drawLine };
