/* eslint-disable no-useless-constructor */
import GeometryWithAxis from './GeometryWithAxis.js';
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
    this.colorScale = d3.scaleLinear().domain([min, max]).range([10, 24]);
  }

  labelsConfig () {

  }

  draw () {
    let {
      xAxis: { key: xKey = '' },
      yAxis: { key: yKey = '' },
      colorFeature,
      sizeFeature
    } = this.config;
    let { yTitleWidth, yLabelWidth } = this.getTransformData();
    this.geometry = this.svg
      .append('g')
      .attr('class', 'scatter-circle-bundle')
      .attr('transform', `translate(${yTitleWidth + yLabelWidth},12)`)
      .selectAll('circle')
      .data(this.data)
      .enter()
      .append('circle')
      .attr('class', 'scatter-circle-item')
      .attr('cx', (d) => {
        return this.xScale(d[xKey]) - yTitleWidth - yLabelWidth;
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
        return this.getItemColor(idx, colorFeature && d[colorFeature.feature]);
      });
  }
}
export default Scatter;
