import Base from './base';
import { getKeyDataList, getMaxValue } from '../components/data';
import { scaleLinear } from '../shape/scale.js';
export default class Line extends Base {
  constructor (data, config) {
    super(data, config);
    this.data = data;
    this.config = config;
    this.colorList = config.colorList;
    this.init();
    this.drawLine();
  };

  drawLine () {
    // d3提供的symbols，如果用户没有提供默认为圆点
    // let symbol = d3.symbolCircle;
    // let rotated = 0;
    // const symbols = {
    //   cross: d3.symbolCross,
    //   cross45: d3.symbolCross,
    //   triangle: d3.symbolTriangle,
    //   triangle180: d3.symbolTriangle,
    //   square: d3.symbolSquare,
    //   star: d3.symbolStar,
    //   diamond: d3.symbolDiamond,
    //   wye: d3.symbolWye
    // };
    // const rotateds = {
    //   cross45: 45,
    //   triangle180: 180
    // };
    // let arc = d3.symbol().type(symbol).size(2 * 25);
    if (!this.config.yAxis) return;
    let yAxis = this.config.yAxis;
    let len = yAxis.length;
    for (let i = 0; i < len; i++) {
      let key = yAxis[i].key;
      let yAxisMax = getMaxValue(this.data, yAxis[i].key);
      for (let j = 0; j < key.length; j++) {
        let data = getKeyDataList(this.data, yAxis[i].key[j]);
        let scaleY = scaleLinear(yAxisMax, this.yAxisHeight);
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
          .transition().duration(600)
          .attr('d', valueLine(data))
          .attr('fill', 'none')
          .attr('stroke-width', 2)
          .attr('stroke', '#424242')
          .attr('opacity', 1);

        // lineContainer.append('g')
        //   .data(data)
        //   .enter()
        //   .selectAll('path')
        //   .attr('d', d => arc(d))
        //   .attr('fill', 'none')
        //   .attr('opacity', 1)
        //   .attr('transform', (d, index) => {
        //     let x = brandWidth * index + brandWidth / 2;
        //     let y = scaleY(d[1] - Math.max(d[0], 0));
        //     return `translate(${x}, ${y})rotate(${rotated})`;
        //   });
      };
    };
  }
};
