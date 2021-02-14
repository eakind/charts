import { initTip } from '../components/textTip';
import { scaleLinear, scaleBand } from '../shape/scale.js';
import { initYAxis, initXAxis } from '../shape/axis';
import { initGrid } from '../shape/grid';
import { getMaxValue, getKeyDataList } from '../components/data.js';
export default class Base {
  init () {
    this.xAxisHeight = 100;
    this.initContainer();
    this.tipTpl = initTip();
    if (this.config.yAxis) {
      this.yAxisMax = getMaxValue(this.data, this.config.yAxis.key);
      this.scaleY = scaleLinear(this.yAxisMax, this.height - this.xAxisHeight);
      initYAxis(this.leftAxis, this.scaleY, this.config.yAxis, this.tipTpl, 'left');
      initGrid(this.middle, this.width, this.height - this.xAxisHeight, this.scaleY);
    }
    if (this.config.yAxis1) {
      this.yAxis1Max = getMaxValue(this.data, this.config.yAxis1.key);
      this.scaleY1 = scaleLinear(this.yAxis1Max, this.height - this.xAxisHeight);
      initYAxis(this.rightAxis, this.scaleY1, this.config.yAxis1, this.tipTpl, 'right');
    }
    if (this.config.xAxis) {
      let xAxisList = getKeyDataList(this.data, this.config.xAxis.key);
      console.log(xAxisList);
      this.scaleX = scaleBand(xAxisList, this.width + 200);
      initXAxis(this.middle, this.scaleX, this.width + 200, this.scaleX.bandwidth());
    }
  }

  render () {

  }

  update () {

  }

  getColorList () {

  }

  initContainer () {
    const { id, autoFit, width, height } = this.config;
    let dom = document.querySelector(`#${id}`);
    if (autoFit) {
      this.width = dom.clientWidth;
      this.height = dom.clientHeight;
    } else {
      this.width = width;
      this.height = height;
      dom.style.width = `${width}px`;
      dom.style.height = `${height}px`;
    }
    // 图表容器
    this.container = d3.select(`#${id}`).attr('class', 'chart-container');
    // 左侧坐标轴容器
    this.leftAxis = this.container.append('div').attr('class', 'left-axis')
      .style('display', 'flex')
      .style('max-width', '100px');
    // 中间画图部分
    this.middle = this.container.append('div').attr('class', 'middle')
      .style('flex', 1)
      .style('width', 0)
      .style('overflow', 'auto hidden')
      .append('svg')
      .attr('width', this.width + 200)
      .attr('height', this.height);
    // 右侧坐标轴容器
    this.rightAxis = this.container.append('div').attr('class', 'right-axis')
      .style('display', 'flex')
      .style('max-width', '100px');
  }
};
