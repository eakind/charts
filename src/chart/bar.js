import { filterPartData } from './base/dataUtils';
import { getToTalBar } from './base/utils';
import { drawBarShape } from './shape/barShape';
import Base from './base';
export default class Bar extends Base {
  constructor (data, config) {
    super(data, config);
    this.data = data;
    this.config = config;
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
    for (let i = 0, len = list.length; i < len; i++) {
      let data = filterPartData(yAxisPart, this.data[index], list[i], yPartMap, i);
      let height = i * this.yAxisHeight + this.topAxisHeight;
      for (let j = 0, len = yAxisChild.length; j < len; j++) {
        let keyLen = yAxisChild[j].key.length;
        if (j === 0) leftNum = keyLen;
        for (let k = 0; k < keyLen; k++) {
          let num = j === 0 ? j + k : leftNum + k;
          drawBarShape(this.middle, data, this.leftScaleY, this.scaleX.bandwidth(), this.yAxisHeight, height, num, total, yAxisChild[j].key[k]);
        }
      }
    }
  };

  drawBar (yAxisChild, index) {
    let len = yAxisChild.length;
    let total = getToTalBar(yAxisChild);
    let leftNum = 0;
    let data = this.data[index];
    for (let i = 0; i < len; i++) {
      let key = yAxisChild[i].key;
      let keyLen = key.length;
      let scaleY = yAxisChild[i].position === 'left' ? this.leftScaleY : this.rightScaleY;
      if (i === 0) leftNum = keyLen;
      for (let j = 0; j < keyLen; j++) {
        let num = i === 0 ? i + j : leftNum + j;
        drawBarShape(this.middle, data, scaleY, this.yAxisHeight, this.scaleX.bandwidth(), this.topAxisHeight, num, total, yAxisChild[i].key[j]);
      };
    };
  };

  drawCombinedCanvas (index, yAxisChild, dataIndex) {
    let height = index * this.yAxisHeight + this.topAxisHeight;
    let len = yAxisChild.length;
    let total = getToTalBar(yAxisChild);
    let leftNum = 0;
    let data = this.data[dataIndex];
    for (let i = 0; i < len; i++) {
      let key = yAxisChild[i].key;
      let keyLen = key.length;
      let scaleY = yAxisChild[i].position === 'left' ? this.leftScaleY : this.rightScaleY;
      if (i === 0) leftNum = keyLen;
      for (let j = 0; j < keyLen; j++) {
        let num = i === 0 ? i + j : leftNum + j;
        drawBarShape(this.middle, data, scaleY, this.scaleX.bandwidth(), this.yAxisHeight, height, num, total, key[j]);
      };
    }
  };

  render () {
  }
};
