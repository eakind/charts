import { getAxisY, setAxisY, setAxisYTitle, setAxisLine, setAxisLabel } from './shape/axis';
import { scaleLinear, scaleOrdinal } from './shape/scale';
import { getTextLegend } from './utils/utils';
import Bar from './chart/bar';
import Line from './chart/line';
export default class ChartOption {
  axisY (name, axisOption) {
    let rotate = 0;
    let position = axisOption.position || 'left';
    let axisPanel = this[`${position}Axis`];
    if (!axisPanel) return;
    let maxValue = 1300;
    // 获取坐标轴刻度比例
    let scale = scaleLinear(maxValue, this.height);
    // 获取坐标轴
    let axis = getAxisY(scale, position);
    let axisWidth = getTextLegend(maxValue, 18);
    let translateX = position === 'left' ? axisWidth : 0;
    if (position === 'left') {
      // 左坐标轴标题
      setAxisYTitle(axisPanel, name, this.height);
    }
    // 画坐标轴
    let scalePanel = setAxisY(axisPanel, axis, axisWidth, this.height, translateX);
    if (position === 'right') {
      // 右坐标轴标题
      setAxisYTitle(axisPanel, name, this.height);
    }
    // 坐标轴线
    setAxisLine(scalePanel);
    // 坐标轴标签文本
    setAxisLabel(scalePanel, position, rotate);
  };

  axisX (name, axisOption) {
    let rotate = 90;
    let position = axisOption.position || 'bottom';
    let axisPanel = this[`${position}Axis`];
    if (!axisPanel) return;
    let data = ['', '广东哈哈', '广西', '福建', '江西', '湖南', '海南', ''];
    let barWidth = this.width - 170;
    let scale = scaleOrdinal(data, barWidth);
    var axis = d3.axisBottom(scale).tickPadding(6).tickSizeOuter(0).tickSizeInner(0);
    let scalePanel = this.middle.append('svg');
    scalePanel.attr('width', barWidth)
      .attr('transform', `translate(0, ${20})`)
      .append('g')
      .call(axis);
    setAxisLabel(scalePanel, 'bottom', rotate);
  };

  render (type) {
    const instanceMap = {
      bar: new Bar(this.config, this.middle),
      line: new Line(this.config, this.middle)
    };
    let chart = instanceMap[type];
    chart.drawChart();
  };
};
