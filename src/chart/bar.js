/* eslint-disable no-unreachable */
import { getKeyDataList, getKeyValueDataList } from './base/dataUtils';
import defaultConfig from '../utils/defaultConfig';
import Base from './base';
export default class Bar extends Base {
  constructor (data, config) {
    super(data, config);
    this.data = data;
    this.config = config;
    this.init();
  };

  drawCanvas (list, index, yAxisChild, uniqueIndex) {
    if (!list) {
      this.drawBar(yAxisChild, index);
      return;
    }
    let key = this.config.yAxisPart[uniqueIndex].key[0];
    let leftNum = 0;
    let total = this.getToTalBar(yAxisChild);
    for (let i = 0, len = list.length; i < len; i++) {
      let data = getKeyValueDataList(this.data[index], key, list[i]);
      let height = i * this.yAxisHeight + this.topAxisHeight;
      for (let j = 0, len = yAxisChild.length; j < len; j++) {
        let keyLen = yAxisChild[j].key.length;
        if (j === 0) leftNum = keyLen;
        for (let k = 0; k < keyLen; k++) {
          let valData = getKeyDataList(data, yAxisChild[j].key[k], true);
          let num = j === 0 ? j + k : leftNum + k;
          this.drawShape(valData, this.leftScaleY, this.yAxisHeight, height, num, total);
          this.drawLabel(valData, this.leftScaleY, this.yAxisHeight, this.topAxisHeight, num, total, index);
        }
      }
    }
  }

  drawCombinedCanvas (list, index, yAxisChild, dataIndex) {
    let height = index * this.yAxisHeight + this.topAxisHeight;
    let len = yAxisChild.length;
    let total = this.getToTalBar(yAxisChild);
    let leftNum = 0;
    let data = this.data[dataIndex];
    for (let i = 0; i < len; i++) {
      let key = yAxisChild[i].key;
      let keyLen = key.length;
      let scaleY = yAxisChild[i].position === 'left' ? this.leftScaleY : this.rightScaleY;
      if (i === 0) leftNum = keyLen;
      for (let j = 0; j < keyLen; j++) {
        let list = getKeyDataList(data, yAxisChild[i].key[j], true);
        let num = i === 0 ? i + j : leftNum + j;
        this.drawShape(list, scaleY, this.yAxisHeight, height, num, total);
        this.drawLabel(list, scaleY, this.yAxisHeight, this.topAxisHeight, num, total, index);
      };
    }
  }

  drawBar (yAxisChild, index) {
    let len = yAxisChild.length;
    let total = this.getToTalBar(yAxisChild);
    let leftNum = 0;
    let data = this.data[index];
    for (let i = 0; i < len; i++) {
      let key = yAxisChild[i].key;
      let keyLen = key.length;
      let scaleY = yAxisChild[i].position === 'left' ? this.leftScaleY : this.rightScaleY;
      if (i === 0) leftNum = keyLen;
      for (let j = 0; j < keyLen; j++) {
        let list = getKeyDataList(data, yAxisChild[i].key[j], true);
        let num = i === 0 ? i + j : leftNum + j;
        this.drawShape(list, scaleY, this.yAxisHeight, this.topAxisHeight, num, total);
        this.drawLabel(list, scaleY, this.yAxisHeight, this.topAxisHeight, num, total, index);
      };
    };
  }

  drawLabel (data, scaleY, height, topAxisHeight, num, total, index) {
    return '';
    let labelContainer = this.middle.append('g');
    let label = labelContainer.selectAll(`label_${num}`).data(data);
    let bandwidth = this.scaleX.bandwidth();
    let barWidth = bandwidth / (total * 2);
    label.enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('class', 'label')
      .attr('x', (d, index) => {
        return (index * bandwidth) + (num * (barWidth + 1)) + barWidth * (total / 2) + barWidth / 2;
      })
      .attr('y', d => scaleY(d) + height * index)
      .text(d => d);
  };

  drawShape (data, scaleY, height, topAxisHeight, num, total) {
    let barContainer = this.middle.append('g')
      .attr('transform', `translate(0,${topAxisHeight})`);
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
