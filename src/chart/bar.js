// import { filterPartData } from './base/dataUtils';
import { getToTalBar } from './base/utils';
import { drawBarShape } from './shape/barShape';
import { drawLabel } from './shape/label';
import Base from './base';
export default class Bar extends Base {
  constructor (data, config) {
    super(data, config);
    this.data = data;
    this.config = config;
    this.init();
  };

  drawCanvas (list, index, yAxisChild, yPartMap) {
    this.barContainer = this.middle.append('g').attr('class', 'bar-container');
    this.labelContainer = this.middle.append('g').attr('class', 'label-container');
    if (!list) {
      this.drawBar(yAxisChild, index);
      return;
    }
    let leftNum = 0;
    let total = getToTalBar(yAxisChild);
    let labelList = this.config.labelsList;
    let bandwidth = this.scaleX.bandwidth();
    for (let i = 0, len = list.length; i < len; i++) {
      let height = i * this.yAxisHeight + this.topAxisHeight;
      for (let j = 0, len = yAxisChild.length; j < len; j++) {
        let keyLen = yAxisChild[j].key.length;
        if (j === 0) leftNum = keyLen;
        let scaleY = yAxisChild[j].position === 'left' ? this.leftScaleY : this.rightScaleY;
        for (let k = 0; k < keyLen; k++) {
          let key = yAxisChild[j].key[k];
          let num = j === 0 ? j + k : leftNum + k;
          let data = yAxisChild[j].data[k];
          drawBarShape(this.barContainer, data, scaleY, bandwidth, this.yAxisHeight, height, num, total, key);
          drawLabel(this.labelContainer, data, scaleY, bandwidth, num, total, key, labelList);
        }
      }
    }
  };

  drawBar (yAxisChild, index) {
    let len = yAxisChild.length;
    let total = getToTalBar(yAxisChild);
    let leftNum = 0;
    let labelList = this.config.labelsList;
    let bandwidth = this.scaleX.bandwidth();
    for (let i = 0; i < len; i++) {
      let key = yAxisChild[i].key;
      let keyLen = key.length;
      let data = yAxisChild[i].data;
      let scaleY = yAxisChild[i].position === 'left' ? this.leftScaleY : this.rightScaleY;
      if (i === 0) leftNum = keyLen;
      for (let j = 0; j < keyLen; j++) {
        let num = i === 0 ? i + j : leftNum + j;
        drawBarShape(this.barContainer, data[j], scaleY, bandwidth, this.yAxisHeight, this.topAxisHeight, num, total, yAxisChild[i].key[j]);
        drawLabel(this.labelContainer, data[j], scaleY, bandwidth, num, total, yAxisChild[i].key[j], labelList);
      };
    };
  };

  drawCombinedCanvas (index, yAxisChild, dataIndex) {
    this.barContainer = this.middle.append('g').attr('class', 'bar-container');
    this.labelContainer = this.middle.append('g').attr('class', 'label-container');
    let height = index * this.yAxisHeight + this.topAxisHeight;
    let len = yAxisChild.length;
    let total = getToTalBar(yAxisChild);
    let leftNum = 0;
    let labelList = this.config.labelsList;
    let bandwidth = this.scaleX.bandwidth();
    for (let i = 0; i < len; i++) {
      let key = yAxisChild[i].key;
      let keyLen = key.length;
      let data = yAxisChild[i];
      let scaleY = yAxisChild[i].position === 'left' ? this.leftScaleY : this.rightScaleY;
      if (i === 0) leftNum = keyLen;
      for (let j = 0; j < keyLen; j++) {
        let num = i === 0 ? i + j : leftNum + j;
        drawBarShape(this.barContainer, data[j], scaleY, bandwidth, this.yAxisHeight, height, num, total, key[j]);
        drawLabel(this.labelContainer, data[j], scaleY, bandwidth, num, total, key[j], labelList);
      };
    }
  };

  render () {
  }
};
