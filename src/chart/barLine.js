// import { filterPartData } from './base/dataUtils';
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
    this.barContainer = this.middle.append('g').attr('class', 'bar-container');
    this.lineContainer = this.middle.append('g').attr('class', 'line-container');
    this.labelContainer = this.middle.append('g').attr('class', 'label-container');
    if (!list) {
      this.drawBarLine(yAxisChild, index);
      return;
    }
    let leftNum = 0;
    let total = getToTalBar(yAxisChild);
    let bandwidth = this.scaleX.bandwidth();
    let labelList = this.config.labelsList;
    let colorFeature = this.config.colorFeature;
    for (let i = 0, len = list.length; i < len; i++) {
      let height = i * this.yAxisHeight + this.topAxisHeight;
      let scaleY = this.leftScaleY;
      for (let j = 0, len = yAxisChild.length; j < len; j++) {
        let keyLen = yAxisChild[j].key.length;
        let types = yAxisChild[i].type;
        if (j === 0) leftNum = keyLen;
        for (let k = 0; k < keyLen; k++) {
          let num = j === 0 ? j + k : leftNum + k;
          let chartType = types[k];
          let data = yAxisChild[j].data[k];
          if (chartType === 'bar') {
            drawBarShape(this.barContainer, data, scaleY, bandwidth, this.yAxisHeight, height, num, total, yAxisChild[j].key[k], colorFeature);
          } else {
            drawLineShape(this.lineContainer, data, scaleY, bandwidth, this.yAxisHeight, height, yAxisChild[j].key[k], colorFeature);
          }
          drawLabel(this.labelContainer, data, scaleY, bandwidth, num, total, yAxisChild[j].key[k], labelList);
        }
      }
    }
  };

  drawBarLine (yAxisChild, index) {
    let len = yAxisChild.length;
    let total = getToTalBar(yAxisChild);
    let leftNum = 0;
    let height = this.topAxisHeight;
    let bandwidth = this.scaleX.bandwidth();
    let labelList = this.config.labelsList;
    let colorFeature = this.config.colorFeature;
    for (let i = 0; i < len; i++) {
      let key = yAxisChild[i].key;
      let keyLen = key.length;
      let barLen = yAxisChild[i].type.filter(item => item === 'bar').length;
      let types = yAxisChild[i].type;
      let scaleY = yAxisChild[i].position === 'left' ? this.leftScaleY : this.rightScaleY;
      if (i === 0) leftNum = barLen;
      let data = yAxisChild[i].data;
      for (let j = 0; j < keyLen; j++) {
        let num = i === 0 ? i + j : leftNum + j;
        let chartType = types[j];
        if (chartType === 'bar') {
          drawBarShape(this.barContainer, data[j], scaleY, bandwidth, this.yAxisHeight, height, num, total, yAxisChild[i].key[j], colorFeature);
        } else {
          drawLineShape(this.lineContainer, data[j], scaleY, bandwidth, this.yAxisHeight, height, yAxisChild[i].key[j], colorFeature);
        }
        drawLabel(this.labelContainer, data[j], scaleY, bandwidth, num, total, yAxisChild[i].key[j], labelList);
      };
    };
  };

  drawCombinedCanvas (index, yAxisChild, dataIndex) {
    this.barContainer = this.middle.append('g').attr('class', 'bar-container');
    this.lineContainer = this.middle.append('g').attr('class', 'line-container');
    this.labelContainer = this.middle.append('g').attr('class', 'label-container');
    let height = index * this.yAxisHeight + this.topAxisHeight;
    let len = yAxisChild.length;
    let total = getToTalBar(yAxisChild);
    let leftNum = 0;
    let bandwidth = this.scaleX.bandwidth();
    let labelList = this.config.labelsList;
    let colorFeature = this.config.colorFeature;
    for (let i = 0; i < len; i++) {
      let key = yAxisChild[i].key;
      let keyLen = key.length;
      let types = yAxisChild[i].type;
      let scaleY = yAxisChild[i].position === 'left' ? this.leftScaleY : this.rightScaleY;
      if (i === 0) leftNum = keyLen;
      let data = yAxisChild[i];
      for (let j = 0; j < keyLen; j++) {
        let num = i === 0 ? i + j : leftNum + j;
        let chartType = types[j];
        if (chartType === 'bar') {
          drawBarShape(this.barContainer, data[j], scaleY, bandwidth, this.yAxisHeight, height, num, total, yAxisChild[i].key[j], colorFeature);
        } else {
          drawLineShape(this.lineContainer, data[j], scaleY, bandwidth, this.yAxisHeight, height, yAxisChild[i].key[j], colorFeature);
        }
        drawLabel(this.labelContainer, data[j], scaleY, bandwidth, num, total, yAxisChild[i].key[j], labelList);
      };
    }
  };

  render () {
  }
};
