import { getKeyDataList, getMaxValue } from './base/dataUtils';
import { scaleLinear } from './base/scale.js';
import Base from './base';
export default class Bar extends Base {
  constructor (data, config) {
    super(data, config);
    this.data = data;
    this.config = config;
    this.colorList = config.colorList;
    this.init();
    // this.drawBar();
  };

  drawCanvas () {
    console.log('这个是画条形图');
  }

  render () {
  }

  drawBar () {
    if (!this.config.yAxis) return;
    let yAxis = this.config.yAxis;
    let len = yAxis.length;
    for (let i = 0; i < len; i++) {
      let key = yAxis[i].key;
      let yAxisMax = getMaxValue(this.data, yAxis[i].key);
      for (let j = 0; j < key.length; j++) {
        let data = getKeyDataList(this.data, yAxis[i].key[j]);
        let scaleY = scaleLinear(yAxisMax, this.yAxisHeight);
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
      };
    };
  }
};
