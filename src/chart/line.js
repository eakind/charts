/* eslint-disable no-unreachable */
import { filterPartData } from './base/dataUtils';
// import { getToTalBar } from './base/utils';
import { drawLineShape } from './shape/lineShape';
import Base from './base';
export default class Line extends Base {
  constructor (data, config) {
    super(data, config);
    this.data = data;
    this.config = config;
    this.init();
  };

  render () {
  };

  drawCanvas (list, index, yAxisChild, yPartMap) {
    if (!list) {
      this.drawLine(yAxisChild, index);
      return;
    }
    // let leftNum = 0;
    // let total = getToTalBar(yAxisChild);
    let yAxisPart = this.config.yAxisPart;
    for (let i = 0, len = list.length; i < len; i++) {
      let data = filterPartData(yAxisPart, this.data[index], list[i], yPartMap, i);
      let height = i * this.yAxisHeight + this.topAxisHeight;
      for (let j = 0, len = yAxisChild.length; j < len; j++) {
        let keyLen = yAxisChild[j].key.length;
        // if (j === 0) leftNum = keyLen;
        for (let k = 0; k < keyLen; k++) {
          // let num = j === 0 ? j + k : leftNum + k;
          drawLineShape(this.middle, data, this.leftScaleY, this.scaleX.bandwidth(), height, yAxisChild[j].key[k]);
        }
      }
    }
  }

  drawCombinedCanvas (index, yAxisChild, dataIndex) {
    let height = index * this.yAxisHeight + this.topAxisHeight;
    let len = yAxisChild.length;
    // let total = getToTalBar(yAxisChild);
    // let leftNum = 0;
    let data = this.data[dataIndex];
    for (let i = 0; i < len; i++) {
      let key = yAxisChild[i].key;
      let keyLen = key.length;
      let scaleY = yAxisChild[i].position === 'left' ? this.leftScaleY : this.rightScaleY;
      // if (i === 0) leftNum = keyLen;
      for (let j = 0; j < keyLen; j++) {
        // let num = i === 0 ? i + j : leftNum + j;
        drawLineShape(this.middle, data, scaleY, this.scaleX.bandwidth(), height, key[j]);
      };
    }
  }

  drawLine (yAxisChild, index) {
    let len = yAxisChild.length;
    // let total = getToTalBar(yAxisChild);
    // let leftNum = 0;
    let data = this.data[index];
    for (let i = 0; i < len; i++) {
      let key = yAxisChild[i].key;
      let keyLen = key.length;
      let scaleY = yAxisChild[i].position === 'left' ? this.leftScaleY : this.rightScaleY;
      // if (i === 0) leftNum = keyLen;
      for (let j = 0; j < keyLen; j++) {
        // let num = i === 0 ? i + j : leftNum + j;
        drawLineShape(this.middle, data, scaleY, this.scaleX.bandwidth(), this.topAxisHeight, yAxisChild[i].key[j]);
      };
    };
  }
};
