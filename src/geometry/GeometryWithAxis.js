/* eslint-disable no-useless-constructor */
import Geometry from './Geometry.js';
import { fontSizeLineHeightPair, getTextWidth } from '../utils/utils.js';
import defaultObj from '../utils/defaultConfig.js';
let { defaultText } = defaultObj;
class GeometryWithAxis extends Geometry {
  constructor (data, config) {
    super(data, config);
    this.xScale = null;
    this.yScale = null;
    this.xAxisG = null;
    this.yAxisG = null;
  }

  /**
   * 定义比例尺
   */
  xScaleConfig () {
    this.xScale = d3.scaleLinear().domain([371, 1856]); // 待修改
    this.xScale.nice();
  }

  yScaleConfig () {
    this.yScale = d3.scaleLinear().domain([520507, 12566111]); // 待修改
    let {
      yTitleWidth,
      yLabelWidth,
      xLabelWidth,
      labelHeight,
      titleHeight
    } = this.getTransformData();

    this.xScale
      .range([yTitleWidth + yLabelWidth, this.config.width - xLabelWidth])
      .nice();

    this.yScale
      .range([this.config.height - labelHeight - titleHeight, 12]) // 半个字体高度
      .nice();

    this.xAxisConfig(labelHeight, titleHeight);

    this.yAxisConfig(yLabelWidth, yTitleWidth);

    this.xTitleConfig(labelHeight);

    this.yTitleConfig(labelHeight, titleHeight, yTitleWidth);

    this.gridLineConfig();
    this.diagonalLineConfig();
  }

  /**
   *
   */
  getTransformData () {
    let { hasUnit } = this.config;
    let {
      titleValue,
      title: { style = defaultText },
      label: { style: labelStyle = defaultText }
    } = this.config.yAxis;

    let yTitleWidth = getTextWidth(titleValue, style.fontSize + 'px');
    let yTicks = this.yScale.ticks();
    let yMaxLabel = yTicks[yTicks.length - 1];
    let yLabelWidth = getTextWidth(yMaxLabel, labelStyle.fontSize + 'px');

    let xTicks = this.xScale.ticks();
    let xMaxLabel = xTicks[xTicks.length - 1];
    let xLabelWidth = getTextWidth(xMaxLabel, labelStyle.fontSize + 'px') / 2;

    if (hasUnit) {
      yLabelWidth = getTextWidth(
        d3.format('~s')(yMaxLabel),
        labelStyle.fontSize + 'px'
      );
      xLabelWidth =
        getTextWidth(d3.format('~s')(xMaxLabel), labelStyle.fontSize + 'px') /
        2;
    }
    let { label, title } = this.config.xAxis;

    let labelHeight = fontSizeLineHeightPair[label.style.fontSize];
    let titleHeight = fontSizeLineHeightPair[title.style.fontSize];

    return {
      yTitleWidth,
      yLabelWidth,
      xLabelWidth,
      labelHeight,
      titleHeight
    };
  }

  /**
   * 定义坐标轴
   */
  xAxisConfig (labelHeight, titleHeight) {
    let { hasUnit } = this.config;
    let xAxis = d3.axisBottom(this.xScale).tickFormat((d) => {
      if (hasUnit) {
        return d3.format('~s')(d);
      }
      return d;
    });
    this.xAxisG = this.svg
      .append('g')
      .attr('class', 'x-axis')
      .attr(
        'transform',
        `translate(0,${this.config.height - labelHeight - titleHeight})`
      );

    this.xAxisG.call(xAxis);
  }

  yAxisConfig (yLabelWidth, yTitleWidth) {
    let { hasUnit } = this.config;

    let yAxis = d3.axisLeft(this.yScale).tickFormat((d) => {
      if (hasUnit) {
        return d3.format('~s')(d);
      }
      return d;
    });

    this.yAxisG = this.svg
      .append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${yLabelWidth + yTitleWidth},0)`);

    this.yAxisG.call(yAxis);
  }

  xTitleConfig (labelHeight) {
    let { titleValue, title } = this.config.xAxis;
    let { style = defaultText } = title;

    let xTitleWidth = getTextWidth(titleValue, style.fontSize + 'px');

    this.xAxisG
      .append('text')
      .attr('class', 'x-title')
      .attr(
        'transform',
        `translate(${this.config.width - xTitleWidth},${labelHeight + 16})`
      )
      .attr('fill', style.fontColor)
      .attr('font-size', style.fontSize)
      .attr('font-weight', style.fontWeight)
      .attr('font-style', style.fontStyle)
      .attr('text-decoration', style.textDecoration)
      .text(titleValue);
  }

  yTitleConfig (labelHeight, titleHeight, yTitleWidth) {
    let { titleValue, title } = this.config.yAxis;
    let { style = defaultText } = title;

    let curHeight = fontSizeLineHeightPair[style.fontSize] * titleValue.length;

    this.yAxisG
      .append('text')
      .attr('class', 'y-title')
      .attr(
        'transform',
        `translate(${-yTitleWidth - 8},${
          curHeight - labelHeight - titleHeight
        })`
      )
      .attr('writing-mode', 'tb')
      .attr('fill', style.fontColor)
      .attr('font-size', style.fontSize)
      .attr('font-weight', style.fontWeight)
      .attr('font-style', style.fontStyle)
      .attr('text-decoration', style.textDecoration)
      .text(titleValue);
  }

  diagonalLineConfig () {
    let xTicks = this.xScale.ticks();
    let yTicks = this.yScale.ticks();

    let that = this;
    that.svg
      .append('g')
      .attr('class', 'diagonal-line')
      .selectAll('line')
      .data([1])
      .enter()
      .append('line')
      .attr('x1', (d) => that.xScale(xTicks[0]))
      .attr('y1', (d) => that.yScale(yTicks[0]))
      .attr('x2', (d) => that.xScale(xTicks[xTicks.length - 1]))
      .attr('y2', (d) => that.yScale(yTicks[yTicks.length - 1]))
      .attr('fill', 'none')
      .attr('stroke', '#c2c9d1')
      .attr('stroke-opacity', 1)
      .attr('stroke-width', 1);
  }

  /**
   * 网格线
   */
  gridLineConfig () {
    let {
      line: { style = {} }
    } = this.config.yAxis;

    let {
      line: { xLineStyle = {} }
    } = this.config.xAxis;
    let that = this;
    let xTicks = this.xScale.ticks();
    let yTicks = this.yScale.ticks();

    drawGridLine('y-grid-line', xTicks, style)
      .attr('x1', (d) => that.xScale(d)) // + config.xOffset
      .attr('x2', (d) => that.xScale(d))
      .attr('y1', that.yScale(yTicks[0]))
      .attr('y2', that.yScale(yTicks[yTicks.length - 1]));

    drawGridLine('x-grid-line', yTicks, xLineStyle)
      .attr('y1', (d) => that.yScale(d)) // + config.xOffset
      .attr('y2', (d) => that.yScale(d))
      .attr('x1', that.xScale(xTicks[0]))
      .attr('x2', that.xScale(xTicks[xTicks.length - 1]));

    function drawGridLine (className, ticks, curStyle) {
      return that.svg
        .append('g')
        .attr('class', className)
        .selectAll('line')
        .data(ticks)
        .enter()
        .append('line')
        .attr('class', 'grid-line-item')
        .attr('stroke', curStyle.fontColor || '#c2c9d1')
        .attr('stroke-width', curStyle.lineWidth || 1)
        .attr('stroke-opacity', curStyle.opacity || 1)
        .attr('stroke-dasharray', curStyle.lineDash || [0, 0])
        .attr('fill', 'none');
    }
  }

  draw () {}
}
export default GeometryWithAxis;
