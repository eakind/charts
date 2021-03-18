import Base from './base';
import { getKeyDataList, getMaxValue } from './base/dataUtils';
import { scaleLinear } from './base/scale';
export default class Line extends Base {
  constructor (data, config) {
    super(data, config);
    this.data = data;
    this.config = config;
    this.colorList = config.colorList;
    this.init();
  };

  drawCanvas () {
    console.log('这个是画线形图');
  };

  render () {
  }

  drawLine () {
    // d3提供的symbols，如果用户没有提供默认为圆点
    let symbol = d3.symbolCircle;
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
    let arc = d3.symbol().type(symbol).size(2 * 25);
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
      };
    };
  }
};
