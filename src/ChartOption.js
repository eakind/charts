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
    this.scaleY = scaleLinear(maxValue, this.height);
    // 获取坐标轴
    let axis = getAxisY(this.scaleY, position);
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
    let rotate = 0;
    let position = axisOption.position || 'bottom';
    let data = ['广东哈哈哈哈哈', '广西', '福建', '江西', '湖南', '海南'];
    let barWidth = this.width - 170;
    let height = position === 'top' ? 0 - 20 : this.height - 20;
    this.scaleX = scaleOrdinal(data, barWidth);
    var axis = d3.axisBottom(this.scaleX).tickPadding(6).tickSizeOuter(0).tickSizeInner(0);
    let scalePanel = this.middle.append('svg');
    scalePanel.attr('width', barWidth)
      .attr('transform', `translate(0, ${height})`)
      .append('g')
      .call(axis);
    setAxisLabel(scalePanel, 'bottom', rotate, this.scaleX.bandwidth(), this.tipTpl);
  };

  gridX () {
    let gridX = this.middle.append('g').attr('width', this.width).attr('height', this.height);
    console.log(gridX);
  };

  gridY () {
    let gridY = this.middle.append('g').attr('height', this.height).attr('width', this.width);
    console.log(gridY);
  };

  render (type) {
    const instanceMap = {
      bar: new Bar(this, this.middle),
      line: new Line(this, this.middle)
    };
    let chart = instanceMap[type];
    console.log(chart);
    chart.drawChart();
  };
};
