import Geometry from './chart.js';
import { rgbToHex } from '@/utils/utils.js';
import { toScientificNotation } from '../../utils/util.js';
class Pie extends Geometry {
  // eslint-disable-next-line no-useless-constructor
  constructor (data, config) {
    super(data, config);
  }

  drawGeometry () {
    let radiusObj = {
      radius: this.config.size,
    };
    if (this.config.innerRadius === 1) {
      radiusObj.innerRadius = radiusObj.radius - 0.15;
    }

    let colorList = this.config.colorList;
    let curColorList = colorList.map(i => i?.color || i);
    // 饼图
    this.chart.coordinate('theta', radiusObj);

    this.chart.legend(false);

    this.tooltipConfig(this.config.tooltipList);
    let colorFeature = this.config.colorFeature.feature;
    this.geometry = this.chart
      .interval()
      .adjust('stack')
      .position(this.config.sizeFeature.feature);
    let match = this.config.labelsList.find((i) => i.type === 'ordinal');
    if (colorFeature) {
      if (this.config.colorFeature.type === 'linear') {
        colorFeature = match ? match.key : colorFeature;
      }
      this.geometry.color(colorFeature, curColorList);
    } else {
      if (match) {
        this.geometry.color(match.key, curColorList);
      }
    }

    if (this.config.labelsList.length > 0) {
      this.labelConfig(this.config.labelsList, this.config.sizeFeature.feature);
    }

    this.chart.render();

    this.addEvent();
  }

  // 处理颜色
  getColorList () {
    let dataList = this.geometry.dataArray || [];
    let colorFeature = this.config.colorFeature.feature;
    let colorList = [];
    if (dataList.length > 0 && colorFeature) {
      let obj = {};
      obj.key = colorFeature;
      obj.opacity = this.config.colorOpacity;
      obj.list = [];
      obj.name = colorFeature;
      obj.colored_type = this.config.colorFeature.type;
      dataList.map((d) => {
        let colorDetail = {};
        let color = d[0].color;
        // 转成十六进制
        if (color) {
          if (color.indexOf('#') > -1) {
            colorDetail.color = color;
          } else {
            let { hex, opacity } = rgbToHex(color);
            colorDetail.color = hex;
            colorDetail.opacity = opacity;
          }
        }
        colorDetail.originalVal = d[0]._origin[colorFeature];
        if (this.config.colorFeature.type === 'linear') {
          colorDetail.rangeType = 'min';
          colorDetail.val = toScientificNotation(colorDetail.originalVal);
        } else {
          colorDetail.val = colorDetail.originalVal;
        }
        obj.list.push(colorDetail);
      });
      if (obj.colored_type === 'linear') {
        let match = this.config.labelsList.find((i) => i.type === 'ordinal');
        if (match) {
          let orderList = obj.list.sort(
            (a, b) => a.originalVal - b.originalVal
          );
          let min = orderList[0];
          min.rangeType = 'min';
          let max = orderList[orderList.length - 1];
          min.rangeType = 'max';
          obj.list = [min, max];
        } else {
          let temObj = JSON.parse(JSON.stringify(obj.list[0]));
          temObj.rangeType = 'max';
          obj.list.push(temObj);
        }
      }
      colorList.push(obj);
    }
    return colorList;
  }
}

export default Pie;
