import { getKeyDataList, getKeyValueDataList } from '../components/data';
// import { scaleLinear } from '../shape/scale.js';
import Base from './base';
export default class Bar extends Base {
  constructor (data, config) {
    super(data, config);
    this.data = data;
    this.config = config;
    this.colorList = config.colorList;
    // getTxtWidth(String(100), 12);
    this.init();
    this.drawMultBar();
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
    for (let i = 0, len = partList.length; i < len; i++) {
      let data = getKeyValueDataList(this.data, key, partList[i]);
      let height = i * this.yAxisHeight + this.topAxisHeight;
      for (let j = 0, len = yAxis.length; j < len; j++) {
        let valData = getKeyDataList(data, yAxis[j].key);
        this.drawShape(valData, this.leftScaleY, this.yAxisHeight, height, j);
      }
    }
  };

  drawBar () {
    if (!this.config.yAxis) return;
    let yAxis = this.config.yAxis;
    let len = yAxis.length;
    for (let i = 0; i < len; i++) {
      let key = yAxis[i].key;
      let keyLen = key.length;
      for (let j = 0; j < keyLen; j++) {
        let data = getKeyDataList(this.data, yAxis[i].key[j]);
        this.drawShape(data, this.leftScaleY, this.shapeHeight, this.topAxisHeight, j);
      };
    };
  }

  drawShape (data, scaleY, height, yAxisY, j) {
    let barContainer = this.middle.append('g')
      .attr('width', this.shapeWidth)
      .attr('height', height)
      .attr('transform', `translate(0,${yAxisY})`);
    let bar = barContainer.selectAll(`bar_${j}`).data(data);
    let bandwidth = this.scaleX.bandwidth();
    let barWidth = bandwidth / 4;
    bar.enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d, index) => {
        return (index * bandwidth) + barWidth + barWidth / 2;
      })
      .attr('y', scaleY)
      .attr('width', barWidth)
      .attr('height', 0)
      .attr('fill', (d, index) => {
        return this.colorList[index];
      })
      .attr('opacity', 1)
      .transition().duration(600)
      .attr('height', (d) => (height - scaleY(d)))
      .attr('y', (d) => scaleY(d));
  };
};
