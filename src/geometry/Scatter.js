/* eslint-disable no-useless-constructor */
import GeometryWithAxis from './GeometryWithAxis.js';
import { dataProcess, getTextWidth } from '../utils/utils.js';
import defaultConfig from '../utils/defaultConfig.js';
let { defaultFormat, defaultText } = defaultConfig;

class Scatter extends GeometryWithAxis {
  constructor (data, config) {
    super(data, config);
    this.colorScale = null;
    this.init();
  }

  init () {
    this.createContainer();
    this.xScaleConfig();
    this.yScaleConfig();
    this.addCircleColorScale();
  }

  getDomain () {
    return this.yScale.domain();
  }

  addCircleColorScale () {
    let { feature } = this.config.sizeFeature;
    if (!feature) {
      return;
    }
    let min = 0;
    let max = 0;
    let sortData = this.data.sort((a, b) => a[feature] - b[feature]);
    min = sortData[0][feature];
    max = sortData[sortData.length - 1][feature];
    this.colorScale = d3.scaleLinear().domain([min, max]).range([10, 18]);
  }

  isExistCircle (
    x,
    y,
    radius,
    xKey,
    yKey,
    yTitleWidth,
    yLabelWidth,
    textWidth,
    lineHeight
  ) {
    let match = this.data.find((i) => {
      let minX =
        this.xScale(i[xKey]) - radius - yTitleWidth - yLabelWidth - 6 - 2;
      let minY = this.yScale(i[yKey]) - radius;
      let maxY = this.yScale(i[yKey]) + radius;

      if (
        x <= minX &&
        x + textWidth >= minX + radius * 2 &&
        y >= minY &&
        y <= maxY &&
        y + lineHeight >= maxY
      ) {
        return i;
      }
      return null;
    });
    return !!match;
  }

  isExistInCoord (list, x, y, lineHeight) {
    if (list.length === 0) {
      return false;
    }
    let match = list.find((i) => {
      let { x: minX, y: minY, textWidth } = i;
      // console.log(minX, minY, textWidth);
      if (
        Math.abs(minX - x) < textWidth &&
        Math.abs(minY - y) < lineHeight / 2
      ) {
        return i;
      }

      return null;
    });
    return !!match;
  }

  labelsConfig () {
    this.geometry.selectAll('.scatter-labels').remove();
    let yTitleWidth = this.yTitleWidth;
    let yLabelWidth = this.yLabelWidth;

    let labelHeight = this.labelHeight;
    let titleHeight = this.titleHeight;
    let list = this.config.labelsList;
    if (list.length === 0) {
      return;
    }
    let {
      xAxis: { key: xKey = '' },
      yAxis: { key: yKey = '' },
      sizeFeature
    } = this.config;
    let coordList = [];
    this.geometry
      .selectAll('text')
      .data((d) => {
        let notShowCount = 0;
        let tempList = list
          .map((l, idx) => {
            let { format = defaultFormat, text = defaultText } = l;
            let radius = 16;
            if (this.colorScale) {
              radius = this.colorScale(d[sizeFeature.feature]);
            }
            let formatVal = dataProcess(d[l.key], format);
            let labelX = this.xScale(d[xKey]) - yTitleWidth - yLabelWidth + 8; // +radius

            let labelY =
              this.yScale(d[yKey]) + (idx - notShowCount) * text.lineHeight;

            let textWidth = getTextWidth(formatVal, text.fontSize + 'px');
            if (
              this.isExistInCoord(coordList, labelX, labelY, text.lineHeight)
            ) {
              notShowCount++;
              return null;
            }
            coordList.push({
              x: labelX,
              y: labelY,
              textWidth
            });
            if (
              !this.isExistCircle(
                labelX,
                labelY,
                radius,
                xKey,
                yKey,
                yTitleWidth,
                yLabelWidth,
                textWidth,
                text.lineHeight
              )
            ) {
              return {
                ...d,
                key: l.key,
                title: l.title,
                format: format,
                text: text,
                formatVal,
                labelX,
                labelY,
                textWidth
              };
            } else {
              notShowCount++;
            }
            return null;
          })
          .filter((f) => {
            if (!f) {
              return false;
            }
            if (
              f.labelX + f.textWidth >
              this.config.width - yTitleWidth - yLabelWidth - 6 - 2
            ) {
              return false;
            }
            return true;
          });

        let totalHeight = tempList.reduce((a, b) => {
          return a + b.text.lineHeight;
        }, this.yScale(d[yKey]));
        let len =
          (this.config.height -
            labelHeight -
            titleHeight -
            this.yScale(d[yKey])) /
          defaultText.lineHeight;

        if (totalHeight >= this.config.height - labelHeight - titleHeight) {
          tempList = tempList.slice(0, len);
        }
        return tempList;
      })
      .enter()
      .append('text')
      .attr('class', 'scatter-labels')
      .attr('transform', (d) => `translate(${d.labelX},${d.labelY})`)
      .attr('fill', (d) => d.text.fontColor)
      .attr('font-size', (d) => d.text.fontSize)
      .text((d) => d.formatVal);
  }

  draw () {
    let {
      xAxis: { key: xKey = '' },
      yAxis: { key: yKey = '' },
      colorFeature,
      sizeFeature
    } = this.config;
    this.className = 'scatter-circle-item';
    let { yTitleWidth, yLabelWidth } = this;
    this.geometry = this.svg
      .append('g')
      .attr('class', 'scatter-circle-bundle')
      .attr('transform', `translate(${yTitleWidth + yLabelWidth},${0})`)
      .selectAll('g')
      .data(this.data)
      .enter()
      .append('g')
      .attr('class', 'scatter-circle-item');
    let colorList = [];
    this.geometry
      .append('circle')
      .attr('cx', (d) => {
        return this.xScale(d[xKey]) - yTitleWidth - yLabelWidth - 6 - 2;
      })
      .attr('cy', (d) => {
        return this.yScale(d[yKey]);
      })
      .attr('r', (d) => {
        if (this.colorScale) {
          return this.colorScale(d[sizeFeature.feature]);
        }
        return 16;
      })
      .attr('fill', (d, idx) => {
        let feature = colorFeature ? colorFeature.feature : undefined;
        let match = null;
        let curIdx = idx;
        if (feature && colorFeature.type === 'ordinal') {
          colorList = colorList.map((i) => {
            if (i.val === d[feature]) {
              i.count++;
              match = i;
            }
            return i;
          });
          curIdx = colorList.length;
        }

        if (match) {
          return match.color;
        }

        let color = this.getItemColor(curIdx, feature && d[feature]);

        colorList.push({
          val: d[feature],
          color,
          index: 1
        });

        return color;
      });
    this.colorList = colorList;
  }

  // /**
  //  * 画图形
  //  */
  // render () {
  //   this.draw();
  //   this.tooltipConfig();
  //   this.registerEvent('click');
  // }
}
export default Scatter;
