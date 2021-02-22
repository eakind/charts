import { initTip } from '../components/textTip';
import { scaleLinear, scaleBand } from '../shape/scale.js';
import { initYAxis, initXAxis } from '../shape/axis';
import { initXGrid, initYGrid } from '../shape/grid';
import { getMaxValue, getKeyDataList } from '../components/data.js';
export default class Base {
  init () {
    // 初始化各个部分的空间
    this.initConfig();
    // 初始化布局
    this.initContainer();
    // 初始化提示信息
    this.tipTpl = initTip();
    // 生成Y轴
    this.createYAxis();
    // 生成X轴
    this.createXAxis();
    // let yHeight = this.height - this.xAxisHeight;
    // if (this.config.yAxis.length) {
    //   let yAxis = this.config.yAxis;
    //   for (let i = 0; i < yAxis.length; i++) {
    //   }
    //   this.yAxisMax = getMaxValue(this.data, this.config.yAxis.key);
    //   this.scaleY = scaleLinear(this.yAxisMax, yHeight);
    //   initYAxis(this.leftAxis, this.scaleY, this.config.yAxis, this.tipTpl, yHeight);
    //   initYGrid(this.middle, this.width - 200, yHeight, this.scaleY);
    // }
    // if (this.config.yAxis1) {
    //   this.yAxis1Max = getMaxValue(this.data, this.config.yAxis1.key);
    //   this.scaleY1 = scaleLinear(this.yAxis1Max, yHeight);
    //   initYAxis(this.rightAxis, this.scaleY1, this.config.yAxis1, this.tipTpl, yHeight);
    // }
    // if (this.config.xAxis.length) {
    //   let xAxis = this.config.xAxis;
    //   let xAxisList = getKeyDataList(this.data, this.config.xAxis.key);
    //   for (let i = 0; i < xAxis.length; i++) {
    //     let width = xAxisList.length * 50;
    //     let allWidth = this.width - 200;
    //     let xAxisWidth = width;
    //     if (width < allWidth) {
    //       xAxisWidth = allWidth;
    //     }
    //     this.scaleX = scaleBand(xAxisList, xAxisWidth);
    //     initXAxis(this.middle, this.scaleX, xAxisWidth, yHeight + 10, this.config.xAxis);
    //   };
    // }
  }

  render () {

  }

  update () {

  }

  getColorList () {

  }

  initContainer () {
    // 图表容器
    this.container = d3.select(`#${this.config.id}`).attr('class', 'chart-container');
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
      .attr('width', this.shapeWidth)
      .attr('height', this.height);
    // 右侧坐标轴容器
    this.rightAxis = this.container.append('div').attr('class', 'right-axis')
      .style('display', 'flex')
      .style('max-width', '100px');
  }

  initConfig () {
    /* 初始化整个画布的宽高 */
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
    /* 左边坐标轴宽度 */
    this.leftAxisWidth = 100;
    /* 右边坐标轴宽度  */
    this.rightAxisWidth = 100;
    /* 底部坐标轴高度 */
    this.bottomAxisHeight = 100;
    /* 顶部坐标轴高度 */
    this.topAxisHeight = 100;
    /* 画布内容高度 */
    this.shapeHeight = this.height - 200;
    /* 画布内容的宽度 */
    this.shapeWidth = this.width - 200;
  }

  createXAxis () {
    let xAxis = this.config.xAxis;
    if (!xAxis.length) return;
    let topAxisIndex = 0;
    for (let i = 0; i < xAxis.length; i++) {
      let xAxisList = getKeyDataList(this.data, xAxis[i].key);
      let scaleX = scaleBand(xAxisList, this.shapeWidth);
      if (xAxis[i].position === 'top') {
        let topAxis = topAxisIndex * 30;
        initXGrid(this.middle, this.shapeWidth, this.shapeHeight, scaleX, this.topAxisHeight, topAxis);
        topAxisIndex++;
      } else {
        initXAxis(this.middle, scaleX, this.shapeWidth, this.shapeHeight, xAxis[i]);
      }
    }
  }

  createYAxis () {
    let yAxis = this.config.yAxis;
    if (!yAxis.length) return;
    for (let i = 0; i < yAxis.length; i++) {
      let position = yAxis[i].position;
      let yAxisMax = getMaxValue(this.data, yAxis[i].key);
      let scaleY = scaleLinear(yAxisMax, this.shapeHeight);
      initYAxis(this[`${position}Axis`], scaleY, yAxis[i], this.tipTpl, this.shapeHeight, this.topAxisHeight);
      if (position === 'left') {
        initYGrid(this.middle, this.shapeWidth, this.shapeHeight, scaleY, this.topAxisHeight);
      }
    }
  }
};
