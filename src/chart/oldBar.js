import { getKeyDataList, getKeyValueDataList } from '../utils/data';
import defaultConfig from '../utils/defaultConfig';
import Base from './base';
export default class Bar extends Base {
  constructor (data, config) {
    super(data, config);
    this.data = data;
    this.config = config;
    this.init();
    // this.drawMultBar();
  };

  drawMultBar () {
    if (!this.config.yAxis) return;
    if (!this.config.yAxisPart || !this.config.yAxisPart.length) {
      this.drawBar();
      return;
    }
    let yAxis = this.config.yAxis;
    let partList = this.uniquePartList;
    let key = this.config.yAxisPart[0].key[0];
    let total = this.getToTalBar(yAxis);
    let leftNum = 0;
    for (let i = 0, len = partList.length; i < len; i++) {
      let data = getKeyValueDataList(this.data, key, partList[i]);
      let height = i * this.yAxisHeight + this.topAxisHeight;
      for (let j = 0, len = yAxis.length; j < len; j++) {
        let keyLen = yAxis[j].key.length;
        if (j === 0) leftNum = keyLen;
        for (let k = 0; k < keyLen; k++) {
          let valData = getKeyDataList(data, yAxis[j].key[k]);
          let num = j === 0 ? j + k : leftNum + k;
          this.drawShape(valData, this.leftScaleY, this.yAxisHeight, height, num, total);
        }
      }
    }
  };

  drawBar () {
    if (!this.config.yAxis) return;
    let yAxis = this.config.yAxis;
    let len = yAxis.length;
    let total = this.getToTalBar(yAxis);
    let leftNum = 0;
    for (let i = 0; i < len; i++) {
      let key = yAxis[i].key;
      let keyLen = key.length;
      if (i === 0) leftNum = keyLen;
      for (let j = 0; j < keyLen; j++) {
        let data = getKeyDataList(this.data, yAxis[i].key[j]);
        let num = i === 0 ? i + j : leftNum + j;
        this.drawShape(data, this.leftScaleY, this.shapeHeight, this.topAxisHeight, num, total);
      };
    };
  }

  drawShape (data, scaleY, height, yAxisY, num, total) {
    let barContainer = this.middle.append('g')
      .attr('width', this.shapeWidth)
      .attr('height', height)
      .attr('transform', `translate(0,${yAxisY})`);
    let bar = barContainer.selectAll(`bar_${num}`).data(data);
    let bandwidth = this.scaleX.bandwidth();
    let barWidth = bandwidth / (total * 2);
    bar.enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d, index) => {
        return (index * bandwidth) + (num * (barWidth + 1)) + barWidth * (total / 2);
      })
      .attr('y', scaleY)
      .attr('width', barWidth)
      .attr('height', 0)
      .attr('fill', (d, index) => {
        return defaultConfig.colorSet.category[index];
      })
      .attr('opacity', 1)
      .transition().duration(600)
      .attr('height', (d) => (height - scaleY(d)))
      .attr('y', (d) => scaleY(d));
  };

  getToTalBar (yAxis) {
    let index = 0;
    for (let i = 0; i < yAxis.length; i++) {
      for (let j = 0; j < yAxis[i].key.length; j++) {
        index++;
      }
    }
    return index;
  };

  render () {

  }
};
