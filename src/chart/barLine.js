import { getKeyDataList, getMaxValue } from '../components/data';
import { scaleLinear } from '../shape/scale.js';
import Base from './base';
export default class Bar extends Base {
  constructor (data, config) {
    super(data, config);
    this.data = data;
    this.config = config;
    this.colorList = config.colorList;
    this.init();
    this.drawBarLine();
  };

  drawBarLine () {
    if (!this.config.yAxis) return;
    let yAxis = this.config.yAxis;
    let len = yAxis.length;
    for (let i = 0; i < len; i++) {
      let keys = yAxis[i].key;
      let types = yAxis[i].type;
      let yAxisMax = getMaxValue(this.data, yAxis[i].key);
      for (let j = 0; j < keys.length; j++) {
        let data = getKeyDataList(this.data, yAxis[i].key[j]);
        let scaleY = scaleLinear(yAxisMax, this.yAxisHeight);
        let chartType = types[i];
        if (chartType === 'bar') {
          this.drawBar(data, scaleY, i, j);
        } else {
          this.drawLine(data, scaleY);
        }
      };
    };
  }

  drawBar (data, scaleY, i, j) {
    let barContainer = this.middle.append('g')
      .attr('width', this.shapeWidth)
      .attr('height', this.shapeHeight)
      .attr('transform', `translate(0,${this.topAxisHeight})`);
    let bar = barContainer.selectAll('.bar').data(data);
    let druaction = this.scaleX.bandwidth();
    bar.enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d, index) => {
        return (index * druaction) + ((i + j) * druaction / 4) + (druaction / 6);
      })
      .attr('y', scaleY)
      .attr('width', druaction * 0.2)
      .attr('height', 0)
      .attr('fill', (d, index) => {
        return this.colorList[index];
      })
      .attr('opacity', 1)
      .transition().duration(600)
      .attr('height', (d) => (this.shapeHeight - scaleY(d)))
      .attr('y', (d) => scaleY(d));
  }

  drawLine (data, scaleY) {
    // d3提供的symbols，如果用户没有提供默认为圆点
    let symbol = d3.symbolCircle;
    let arc = d3.symbol().type(symbol).size(2 * 25);
    let brandWidth = this.scaleX.bandwidth();
    let valueLine = d3.line()
      .defined((d) => (d))
      .x((d, index) => {
        return brandWidth * index + brandWidth / 2;
      })
      .y((d) => {
        return scaleY(d);
      });
    let lineContainer = this.middle.append('g')
      .attr('transform', `translate(0,${this.topAxisHeight})`);
    lineContainer.append('path')
      .attr('d', valueLine(data))
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('stroke', '#4284f5')
      .attr('opacity', 1);

    let pointer = lineContainer.selectAll('.point-group')
      .data(data)
      .enter()
      .append('g');

    pointer.append('path')
      .attr('d', arc)
      .attr('transform', (d, index) => {
        let x = brandWidth * index + brandWidth / 2;
        let y = scaleY(d);
        return `translate(${x}, ${y})`;
      })
      .attr('fill', '#4284f5');
  }
};
