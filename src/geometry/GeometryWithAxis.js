/* eslint-disable no-useless-constructor */
import Geometry from './Geometry.js';
import { fontSizeLineHeightPair, getTextWidth } from '../utils/utils.js';
import defaultObj from '../utils/defaultConfig.js';
let { defaultText, defaultLineStyle } = defaultObj;
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
    this.xScale = d3
      .scaleLinear()
      .domain(this.getMinMaxData(this.config.xAxis.title.value)); // 待修改
    this.xScale.nice();
  }

  yScaleConfig () {
    this.yScale = d3
      .scaleLinear()
      .domain(this.getMinMaxData(this.config.yAxis.title.value)); // 待修改
    let {
      yTitleWidth,
      yLabelWidth,
      xLabelWidth,
      labelHeight,
      titleHeight
    } = this.getTransformData();

    this.xScale
      .range([
        yTitleWidth + yLabelWidth + 6 + 2,
        this.config.width - xLabelWidth
      ])
      .nice();

    this.yScale
      .range([
        this.config.height -
          labelHeight -
          titleHeight -
          6 -
          2 -
          (this.xLabelWidth * 2) / 3,
        labelHeight + yLabelWidth / 2
      ]) // 半个字体高度
      .nice();

    this.xAxisConfig(labelHeight, titleHeight);

    this.yAxisConfig(yLabelWidth, yTitleWidth);

    this.xTitleConfig(labelHeight);

    this.yTitleConfig(labelHeight, titleHeight, yTitleWidth, yLabelWidth);

    this.gridLineConfig();
    this.diagonalLineConfig();
  }

  getMinMaxData (feature) {
    if (this.data.length === 1) {
      if (this.data[0][feature] > 0) {
        return [0, this.data[0][feature]];
      } else {
        return [this.data[0][feature], 0];
      }
    }
    let sortData = this.data.sort((a, b) => a[feature] - b[feature]);
    let min = sortData[0][feature];
    let max = sortData[sortData.length - 1][feature];

    return [min, max];
  }

  /**
   *
   */
  getTransformData () {
    let { hasUnit } = this.config;
    let {
      title: { style = defaultText, value },
      label: { style: labelStyle = defaultText }
    } = this.config.yAxis;

    let yTitleWidth = getTextWidth(value, style.fontSize + 'px');
    let yTicks = this.yScale.ticks();
    let yMaxLabel = yTicks[yTicks.length - 1];
    let yLabelWidth = getTextWidth(yMaxLabel, labelStyle.fontSize + 'px');

    let xTicks = this.xScale.ticks();
    let xMaxLabel = xTicks[xTicks.length - 1];
    let xLabelWidth = getTextWidth(xMaxLabel, labelStyle.fontSize + 'px');

    if (hasUnit) {
      yLabelWidth = getTextWidth(
        d3.format('~s')(yMaxLabel),
        labelStyle.fontSize + 'px'
      );
      xLabelWidth = getTextWidth(
        d3.format('~s')(xMaxLabel),
        labelStyle.fontSize + 'px'
      );
    }
    let { label, title } = this.config.xAxis;

    let labelHeight = fontSizeLineHeightPair[label.style.fontSize];
    let titleHeight = fontSizeLineHeightPair[title.style.fontSize];

    // titleHeight = titleHeight + titleHeight / 2;

    this.yTitleWidth = yTitleWidth;
    this.yLabelWidth = yLabelWidth;
    this.xLabelWidth = xLabelWidth;
    this.labelHeight = labelHeight;
    this.titleHeight = titleHeight;
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
    let ticks = this.xScale.ticks();
    let width = getTextWidth(ticks[ticks.length - 1], '14px');
    let len = parseInt(Math.round(ticks.length / (this.config.width / width)));
    len = len ? len + 1 : 1;
    let xAxis = d3.axisBottom(this.xScale).tickFormat((d, idx) => {
      if (idx % len === 0) {
        let val = d;
        if (hasUnit) {
          val = d3.format('~s')(d);
        }
        return val;
      } else {
        return '';
      }
    });
    this.xAxisG = this.svg
      .append('g')
      .attr('class', 'x-axis')
      .attr(
        'transform',
        `translate(0,${
          this.config.height -
          labelHeight -
          titleHeight -
          6 -
          2 -
          (this.xLabelWidth * 2) / 3
        })`
      );

    this.xAxisG.call(xAxis);

    this.setAxisStyle(this.config.xAxis, 'x');
  }

  setAxisStyle (AxisConfig, type) {
    let {
      tickLine: { style: tickLineStyle = defaultLineStyle },
      line: { style: lineStyle = defaultLineStyle, show: showLine },
      label: { style: labelStyle = defaultLineStyle }
    } = AxisConfig;

    console.log(lineStyle);
    let AxisG = this[type + 'AxisG'];
    let { rotate } = labelStyle;
    let transformValue = `rotate(${rotate})`;
    if (rotate !== 0 && rotate !== 90) {
      if (type === 'x') {
        transformValue += `translate(${
          rotate < 0 ? (-this.xLabelWidth * 2) / 3 : (this.xLabelWidth * 2) / 3
        },0)`;
      } else {
        transformValue += `translate(0,${
          rotate < 0 ? (-this.yLabelWidth * 2) / 3 : (this.yLabelWidth * 2) / 3
        })`;
      }
    } else if (rotate === 90) {
      if (type === 'x') {
        transformValue += `translate(${this.xLabelWidth / 2 + 7},-10)`;
      } else {
        transformValue += `translate(${this.yLabelWidth},${this.yLabelWidth})`;
      }
    }
    AxisG.selectAll('text')
      .attr('transform', transformValue)
      .attr('stroke', 'none')
      .attr('fill', labelStyle.fontColor)
      .attr('font-size', labelStyle.fontSize)
      .attr('font-weight', labelStyle.fontWeight)
      .attr('font-style', labelStyle.fontStyle);

    AxisG.selectAll('line')
      .attr('stroke', tickLineStyle.fontColor)
      .attr('stroke-opacity', tickLineStyle.opacity || 1)
      .attr('stroke-width', tickLineStyle.lineWidth);

    if (!showLine) {
      AxisG.selectAll('path').remove();
      return;
    }
    AxisG.selectAll('path')
      .attr('stroke', lineStyle.fontColor)
      .attr('stroke-width', lineStyle.lineWidth)
      .attr('stroke-opacity', lineStyle.opacity)
      .attr('stroke-dasharray', lineStyle.lineDash);
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
      .attr('transform', `translate(${yLabelWidth + yTitleWidth + 6 + 2},0)`);

    this.yAxisG.call(yAxis);

    this.setAxisStyle(this.config.yAxis, 'y');
  }

  xTitleConfig (labelHeight) {
    let {
      title: { value, style = defaultText, show: showTitle }
    } = this.config.xAxis;
    if (!showTitle) {
      return;
    }
    let xTitleWidth = getTextWidth(value, style.fontSize + 'px');

    this.xAxisG
      .append('text')
      .attr('class', 'x-title')
      .attr(
        'transform',
        `translate(${this.config.width - xTitleWidth},${
          labelHeight + 6 + 2 + labelHeight / 2 + (this.xLabelWidth * 2) / 3
        })`
      )
      .attr('stroke', 'none')
      .attr('fill', style.fontColor)
      .attr('font-size', style.fontSize)
      .attr('font-weight', style.fontWeight)
      .attr('font-style', style.fontStyle)
      .attr('text-decoration', style.textDecoration)
      .text(value);
  }

  yTitleConfig (labelHeight, titleHeight, yTitleWidth, yLabelWidth) {
    let {
      title: { style = defaultText, value, show: showTitle }
    } = this.config.yAxis;
    // let { style = defaultText } = title;
    if (!showTitle) {
      return;
    }
    let curHeight = fontSizeLineHeightPair[style.fontSize] * value.length;

    this.yAxisG
      .append('text')
      .attr('class', 'y-title')
      .attr(
        'transform',
        `translate(${-yTitleWidth / 2 - yLabelWidth - 6 - 2},${
          curHeight - labelHeight - titleHeight
        })`
      )
      .attr('writing-mode', 'tb')
      .attr('stroke', 'none')
      .attr('fill', style.fontColor)
      .attr('font-size', style.fontSize)
      .attr('font-weight', style.fontWeight)
      .attr('font-style', style.fontStyle)
      .attr('text-decoration', style.textDecoration)
      .text(value);
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
      .attr('x1', () => that.xScale(xTicks[0]))
      .attr('y1', () => that.yScale(yTicks[0]))
      .attr('x2', () => that.xScale(xTicks[xTicks.length - 1]))
      .attr('y2', () => that.yScale(yTicks[yTicks.length - 1]))
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
      line: { style = {}, show }
    } = this.config.yAxis.grid || {};
    if (!show) {
      return;
    }
    let {
      line: { style: xLineStyle = {} }
    } = this.config.xAxis.grid || {};

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
