import { filterPartData } from './base/dataUtils';
import { getToTalBar } from './base/utils';
import { drawBarShape } from './shape/barShape';
import { drawLineShape } from './shape/lineShape';
import { drawLabel } from './shape/label';
import Base from './base';
export default class Bar extends Base {
  constructor (data, config) {
    super(data, config);
    this.data = data;
    this.config = config;
    this.colorList = config.colorList;
    this.init();
  };

  drawCanvas (list, index, yAxisChild, yPartMap) {
    if (!list) {
      this.drawBar(yAxisChild, index);
      return;
    }
    let leftNum = 0;
    let total = getToTalBar(yAxisChild);
    let yAxisPart = this.config.yAxisPart;
    let bandwidth = this.scaleX.bandwidth();
    let labelList = this.config.labelsList;
    for (let i = 0, len = list.length; i < len; i++) {
      let data = filterPartData(yAxisPart, this.data[index], list[i], yPartMap, i);
      let height = i * this.yAxisHeight + this.topAxisHeight;
      let scaleY = this.leftScaleY;
      for (let j = 0, len = yAxisChild.length; j < len; j++) {
        let keyLen = yAxisChild[j].key.length;
        let types = yAxisChild[i].type;
        if (j === 0) leftNum = keyLen;
        for (let k = 0; k < keyLen; k++) {
          let num = j === 0 ? j + k : leftNum + k;
          let chartType = types[i];
          if (chartType === 'bar') {
            drawBarShape(this.middle, data, scaleY, bandwidth, this.yAxisHeight, height, num, total, yAxisChild[j].key[k]);
          } else {
            drawLineShape(this.middle, data, scaleY, bandwidth, this.yAxisHeight, height, yAxisChild[j].key[k]);
          }
          drawLabel(this.middle, data, scaleY, bandwidth, num, total, yAxisChild[j].key[k], labelList);
        }
      }
    }
  };

  drawBar (yAxisChild, index) {
    let len = yAxisChild.length;
    let total = getToTalBar(yAxisChild);
    let leftNum = 0;
    let data = this.data[index];
    let height = this.topAxisHeight;
    let bandwidth = this.scaleX.bandwidth();
    let labelList = this.config.labelsList;
    for (let i = 0; i < len; i++) {
      let key = yAxisChild[i].key;
      let keyLen = key.length;
      let types = yAxisChild[i].type;
      let scaleY = yAxisChild[i].position === 'left' ? this.leftScaleY : this.rightScaleY;
      if (i === 0) leftNum = keyLen;
      for (let j = 0; j < keyLen; j++) {
        let num = i === 0 ? i + j : leftNum + j;
        let chartType = types[i];
        if (chartType === 'bar') {
          drawBarShape(this.middle, data, scaleY, bandwidth, this.yAxisHeight, height, num, total, yAxisChild[i].key[j]);
        } else {
          drawLineShape(this.middle, data, scaleY, bandwidth, this.yAxisHeight, height, yAxisChild[i].key[j]);
        }
        drawLabel(this.middle, data, scaleY, bandwidth, num, total, yAxisChild[i].key[j], labelList);
      };
    };
  };

  drawCombinedCanvas (index, yAxisChild, dataIndex) {
    let height = index * this.yAxisHeight + this.topAxisHeight;
    let len = yAxisChild.length;
    let total = getToTalBar(yAxisChild);
    let leftNum = 0;
    let data = this.data[dataIndex];
    let bandwidth = this.scaleX.bandwidth();
    let labelList = this.config.labelsList;
    for (let i = 0; i < len; i++) {
      let key = yAxisChild[i].key;
      let keyLen = key.length;
      let types = yAxisChild[i].type;
      let scaleY = yAxisChild[i].position === 'left' ? this.leftScaleY : this.rightScaleY;
      if (i === 0) leftNum = keyLen;
      for (let j = 0; j < keyLen; j++) {
        let num = i === 0 ? i + j : leftNum + j;
        let chartType = types[i];
        if (chartType === 'bar') {
          drawBarShape(this.middle, data, scaleY, bandwidth, this.yAxisHeight, height, num, total, yAxisChild[i].key[j]);
        } else {
          drawLineShape(this.middle, data, scaleY, bandwidth, this.yAxisHeight, height, yAxisChild[i].key[j]);
        }
        drawLabel(this.middle, data, scaleY, bandwidth, num, total, yAxisChild[i].key[j], labelList);
      };
    }
  };

  render () {
  }
};
