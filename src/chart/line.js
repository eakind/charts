import { drawLineShape } from './shape/lineShape';
import { drawLabel } from './shape/label';
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
    this.lineContainer = this.middle.append('g').attr('class', 'line-container');
    this.labelContainer = this.middle.append('g').attr('class', 'label-container');
    if (!list) {
      this.drawLine(yAxisChild, index);
      return;
    }
    let bandwidth = this.scaleX.bandwidth();
    let labelList = this.config.labelsList;
    for (let i = 0, len = list.length; i < len; i++) {
      let height = i * this.yAxisHeight + this.topAxisHeight;
      for (let j = 0, len = yAxisChild.length; j < len; j++) {
        let keyLen = yAxisChild[j].key.length;
        let scaleY = yAxisChild[j].position === 'left' ? this.leftScaleY : this.rightScaleY;
        for (let k = 0; k < keyLen; k++) {
          let data = yAxisChild[j].data[k];
          drawLineShape(this.lineContainer, data, scaleY, bandwidth, height, this.topAxisHeight, yAxisChild[j].key[k]);
          drawLabel(this.labelContainer, data, scaleY, bandwidth, 1, 1, yAxisChild[j].key[k], labelList);
        }
      }
    }
  }

  drawCombinedCanvas (index, yAxisChild, dataIndex) {
    let height = index * this.yAxisHeight + this.topAxisHeight;
    let len = yAxisChild.length;
    let bandwidth = this.scaleX.bandwidth();
    let labelList = this.config.labelsList;
    for (let i = 0; i < len; i++) {
      let key = yAxisChild[i].key;
      let keyLen = key.length;
      let data = yAxisChild[i].data;
      let scaleY = yAxisChild[i].position === 'left' ? this.leftScaleY : this.rightScaleY;
      for (let j = 0; j < keyLen; j++) {
        drawLineShape(this.lineContainer, data[j], scaleY, bandwidth, height, this.topAxisHeight, key[j]);
        drawLabel(this.labelContainer, data, scaleY, bandwidth, 1, 1, key[j], labelList);
      };
    }
  }

  drawLine (yAxisChild, index) {
    let len = yAxisChild.length;
    let bandwidth = this.scaleX.bandwidth();
    let labelList = this.config.labelsList;
    for (let i = 0; i < len; i++) {
      let key = yAxisChild[i].key;
      let keyLen = key.length;
      let data = yAxisChild[i].data;
      let height = this.topAxisHeight;
      let scaleY = yAxisChild[i].position === 'left' ? this.leftScaleY : this.rightScaleY;
      for (let j = 0; j < keyLen; j++) {
        drawLineShape(this.lineContainer, data[j], scaleY, bandwidth, height, this.topAxisHeight, yAxisChild[i].key[j]);
        drawLabel(this.labelContainer, data[j], scaleY, bandwidth, 1, 1, yAxisChild[j].key[j], labelList);
      };
    };
  }
};
