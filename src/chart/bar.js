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
    // this.drawBar();
    this.drawMultBar();
  };

  drawMultBar () {
    if (!this.config.yAxis) return;
    let yAxis = this.config.yAxis;
    let yAxisPart = this.config.yAxisPart;
    let len = yAxis.length;
    let partLen = yAxisPart.length;
    for (let i = 0; i < len; i++) {

    }
    console.log(partLen);
  };

  drawBar () {
    if (!this.config.yAxis) return;
    let yAxis = this.config.yAxis;
    // let yAxisPart = this.config.yAxisPart;
    let len = yAxis.length;
    for (let i = 0; i < len; i++) {
      let key = yAxis[i].key;
      let yAxisMax = getMaxValue(this.data, yAxis[i].key);
      let keyLen = key.length;
      let leftLen = yAxis[0].key.length;
      for (let j = 0; j < keyLen; j++) {
        let data = getKeyDataList(this.data, yAxis[i].key[j]);
        let scaleY = scaleLinear(yAxisMax, this.yAxisHeight);
        let barContainer = this.middle.append('g')
          .attr('width', this.shapeWidth)
          .attr('height', this.shapeHeight)
          .attr('transform', `translate(0,${this.topAxisHeight})`);
        let bar = barContainer.selectAll('.bar').data(data);
        let bandwidth = this.scaleX.bandwidth();
        let barWidth = bandwidth / (leftLen + keyLen + 1);
        let barGap = barWidth / (leftLen + keyLen);
        let barIndex = i + j;
        if (i !== 0) {
          barIndex = leftLen + j;
        }
        bar.enter()
          .append('rect')
          .attr('class', 'bar')
          .attr('x', (d, index) => {
            return (index * bandwidth) + (barIndex * (barWidth + 2)) + barGap;
          })
          .attr('y', scaleY)
          .attr('width', barWidth)
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
