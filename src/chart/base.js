// import { initTip } from '../components/textTip';
import { scaleLinear, scaleBand } from '../shape/scale.js';
import { initYAxis, initXAxis } from '../shape/axis';
import { initXGrid, initYGrid, initYAxisGrid, initMiddleGrid, initYAxisLine } from '../shape/grid';
import { getMaxValue, getKeyDataList } from '../utils/data';
import { getTopAxisHeight, setAsideWidth, setBottomLabelHeight, getMaxValueWidth } from '../utils/utils.js';
export default class Base {
  init () {
    // 初始化X轴的空间
    this.initXAxisConfig();
    // 设置画图容器大小
    this.setBaseContainer();
    // 初始化布局
    this.initContainer();
  }

  initXAxisConfig () {
    /* X轴底部坐标的数据 */
    this.xAxisList = getKeyDataList(this.data[0], this.config.xAxis[0].key);
    /* X轴坐标标签的高度 */
    this.labelHeight = setBottomLabelHeight(this.config.xAxis[0], this.xAxisList);
    console.log(this.labelHeight);
    /* 底部坐标轴高度 */
    this.bottomAxisHeight = this.labelHeight + 10;
    /* 顶部坐标轴高度 */
    this.topAxisHeight = getTopAxisHeight(this.config.xAxisPart);
  };

  setBaseContainer () {
    /* 判断是否自适应宽高，设置画图空间 */
    const { id, autoFit, fitWidth, fitHeight, width, height } = this.config;
    let dom = document.querySelector(`#${id}`);
    let domWidth = dom.clientWidth;
    let domHeight = dom.clientHeight;
    this.width = fitWidth || autoFit ? domWidth : width;
    this.height = fitHeight || autoFit ? domHeight : height;
    dom.style.width = `${this.width}px`;
    dom.style.height = `${this.height}px`;
  }

  initContainer () {
    let { yAxis, isCombined } = this.config;
    if (isCombined) {
      // 创建合并坐标轴画布
      this.createCombinedCanvas(yAxis);
      return;
    }
    // 一共有多少个子画布
    this.yAxisLen = yAxis.length;
    // 每个子画布的高度
    this.canvasHeight = Math.floor(this.height / this.yAxisLen);
    for (let i = 0; i < this.yAxisLen; i++) {
      // 初始化Y轴配置
      this.initYAxisConfig(yAxis[i], i);
      // 初始化单个画布容器
      this.initCanvasContainer(i);
      // 创建底部X轴
      this.createBottomXAxis();
      // 创建顶部X轴
      this.createXPart();
      // 创建Y轴并画图
      this.createYPart(yAxis[i], i);
    };
  }

  createCombinedCanvas (yAxis) {
    this.yAxisLen = yAxis.length;
    this.canvasHeight = this.height;
    this.initCombinedYAxisConfig(yAxis);
    this.initCanvasContainer(0);
    this.createBottomXAxis();
    // 创建顶部X轴
    this.createXPart();
    this.createCombinedYPart(yAxis);
  }

  // 初始化单个画布容器
  initCanvasContainer (index) {
    // 图表容器
    this.container = d3.select(`#${this.config.id}`).append('div').attr('class', `chart-container-${index}`)
      .style('display', 'flex')
      .style('position', 'relative')
      .style('box-sizing', 'border-box')
      .style('width', '100%')
      .style('height', `${this.canvasHeight}px`);
    this.leftAxis = this.container.append('div').attr('class', `left-axis-${index}`)
      .style('display', 'flex')
      .style('flex-direction', 'row-reverse')
      .append('svg')
      .attr('width', this.leftAxisWidth)
      .attr('height', this.canvasHeight);
    // 中间画图部分
    this.middle = this.container.append('div').attr('class', `middle-${index}`)
      .style('flex', 1)
      .style('width', 0)
      .style('overflow', 'auto hidden')
      .append('svg')
      .attr('width', this.shapeWidth)
      .attr('height', this.canvasHeight);
    // 右侧坐标轴容器
    this.rightAxis = this.container.append('div').attr('class', `right-axis-${index}`)
      .style('display', 'flex')
      .append('svg')
      .attr('width', this.rightAxisWidth)
      .attr('height', this.canvasHeight);
  }

  initCombinedYAxisConfig (yAxis) {
    let { leftMaxValue, leftAxisWidth } = getMaxValueWidth(yAxis, this.data, this.config.yAxisPart, 'left');
    /* 左边坐标轴最大值 */
    this.leftMaxValue = leftMaxValue;
    /* 左边坐标轴宽度 */
    this.leftAxisWidth = leftAxisWidth;
    let { rightMaxValue, rightAxisWidth } = getMaxValueWidth(yAxis, this.data, this.config.yAxisPart, 'right');
    /* 右边坐标轴最大值 */
    this.rightMaxValue = rightMaxValue;
    this.rightAxisWidth = rightAxisWidth;
    /* 画布内容高度 */
    this.shapeHeight = this.canvasHeight - (this.bottomAxisHeight + this.topAxisHeight);
    /* 画布内容的宽度 */
    this.shapeWidth = this.width - (this.leftAxisWidth + this.rightAxisWidth);
    /* Y坐标轴的高度 */
    this.yAxisHeight = this.shapeHeight;
  };

  initYAxisConfig (yAxisChild, index) {
    /* 左边轴数组 */
    this.leftAxisList = yAxisChild.filter(item => item.position === 'left');
    /* 右边轴数组 */
    this.rightAxisList = yAxisChild.filter(item => item.position === 'right');
    /* 左边轴最大值 */
    if (this.leftAxisList.length) {
      this.leftMaxValue = getMaxValue(this.data[index], this.leftAxisList[0].key);
    }
    /* 右边轴最大值 */
    if (this.rightAxisList.length) {
      this.rightMaxValue = getMaxValue(this.data[index], this.rightAxisList[0].key);
    }
    /* 左边坐标轴宽度 */
    this.leftAxisWidth = setAsideWidth(this.leftAxisList[0], this.leftMaxValue, this.config.yAxisPart);
    /* 右边坐标轴宽度  */
    this.rightAxisWidth = setAsideWidth(this.rightAxisList[0], this.leftMaxValue);
    /* 画布内容高度 */
    this.shapeHeight = this.canvasHeight - (this.bottomAxisHeight + this.topAxisHeight);
    /* 画布内容的宽度 */
    this.shapeWidth = this.width - (this.leftAxisWidth + this.rightAxisWidth);
    /* Y坐标轴的高度 */
    this.yAxisHeight = this.shapeHeight;
  }

  createBottomXAxis () {
    let xAxis = this.config.xAxis;
    if (!xAxis || !xAxis.length) return;
    let xAxisObj = xAxis[0];
    this.scaleX = scaleBand(this.xAxisList, this.shapeWidth, true);
    // 中间容器， x的刻度， 画布宽度， 画布高度， x轴的配置信息， 顶部X轴的高度, 标签的高度， x轴的值
    initXAxis(this.middle, this.scaleX, this.shapeWidth, this.shapeHeight, xAxisObj, this.topAxisHeight, this.labelHeight, this.xAxisList);
  };

  createXPart () {
    let partList = this.config.xAxisPart;
    if (!partList || !partList.length) return;
    let len = partList.length;
    let topAxisIndex = 0;
    let perKey = null;
    let perList = [];
    for (let i = 0; i < len; i++) {
      let xAxisList = getKeyDataList(this.data[0], partList[i].key);
      let topAxis = topAxisIndex * 30 + 52;
      let title = partList[i].title.value;
      let key = partList[i].key;
      let height = this.shapeHeight + 30 * (i + len - 1);
      initXGrid(this.middle, this.shapeWidth, height, topAxis, this.scaleX.bandwidth(), xAxisList, this.data[0], title, perKey, perList, key);
      perKey = partList[0].key;
      perList = xAxisList;
      topAxisIndex++;
    }
  }

  createYAxis (list, yAxisChild) {
    for (let i = 0, len = list.length; i < len; i++) {
      for (let j = 0; j < yAxisChild.length; j++) {
        let position = yAxisChild[j].position;
        let yAxisMax = position === 'left' ? this.leftMaxValue : this.rightMaxValue; // getMaxValue(this.data, yAxis[j].key);
        let scaleY = scaleLinear(yAxisMax, this.yAxisHeight);
        if (position === 'left') {
          this.leftScaleY = scaleY;
          initYGrid(this.middle, this.shapeWidth, this.yAxisHeight, scaleY, this.topAxisHeight, i);
        } else {
          this.rightScaleY = scaleY;
        }
        initYAxis(this[`${position}Axis`], scaleY, yAxisChild[j], this.tipTpl, this.yAxisHeight, this.topAxisHeight, this[`${position}AxisWidth`], i, i === len - 1);
      }
    };
  }

  createYPart (yAxisChild, index) {
    let yAxisPart = this.config.yAxisPart;
    if (!yAxisPart || !yAxisPart.length) {
      this.createYAxis([''], yAxisChild);
      this.drawCanvas(null, index, yAxisChild);
    } else {
      let data = this.data[index];
      for (let i = 0, len = yAxisPart.length; i < len; i++) {
        let yAxisPartList = getKeyDataList(data, yAxisPart[i].key);
        let uniquePartList = [...new Set(yAxisPartList)];
        if (i === 0) {
          this.yAxisHeight = this.shapeHeight / uniquePartList.length;
          this.uniquePartList = uniquePartList;
          this.createYAxis(uniquePartList, yAxisChild);
          initMiddleGrid(this.middle, this.yAxisHeight, uniquePartList, this.shapeWidth, this.topAxisHeight);
          this.drawCanvas(uniquePartList, index, yAxisChild);
        } else {
          initYAxisLine(this.leftAxis, this.topAxisHeight, this.shapeHeight, i);
        }
        initYAxisGrid(this.leftAxis, this.yAxisHeight, uniquePartList, this.leftAxisWidth, (len - i - 1), this.topAxisHeight, yAxisPart[0].key, yAxisPart[i].key, data, i, yAxisPartList);
      }
    };
  };

  createCombinedYPart (yAxis) {
    let yAxisPart = this.config.yAxisPart;
    if (!yAxisPart || !yAxisPart.length) {
      this.createCombinedYAxis(yAxis);
    } else {
      let len = yAxis.length;
      for (let i = 0; i < len; i++) {
        this.drawCombinedYPart(yAxisPart, yAxis[i], i, len);
      }
    }
  };

  drawCombinedYPart (yAxisPart, yAxisChild, index, len) {
    let partLen = yAxisPart.length;
    let data = this.data[index];
    for (let i = 0; i < partLen; i++) {
      let yAxisPartList = getKeyDataList(data, yAxisPart[i].key);
      let uniquePartList = [...new Set(yAxisPartList)];
      if (i === 0) {
        this.yAxisHeight = this.shapeHeight / (uniquePartList.length * len);
        this.uniquePartList = uniquePartList;
        this.createCombinedYAxisYPart(uniquePartList, yAxisChild, index, len);
      } else {
        initYAxisLine(this.leftAxis, this.topAxisHeight, this.shapeHeight, i);
      }
      initYAxisGrid(this.leftAxis, this.yAxisHeight * len, uniquePartList, this.leftAxisWidth, (partLen - i - 1), this.topAxisHeight, yAxisPart[0].key, yAxisPart[i].key, data, i, yAxisPartList);
    }
  }

  createCombinedYAxisYPart (uniquePartList, yAxisChild, index, len) {
    for (let i = 0; i < uniquePartList.length; i++) {
      let sum = (i * len) + index;
      this.drawCombinedYAxis(yAxisChild, sum);
      this.drawCombinedCanvas(null, sum, yAxisChild, index);
      if (sum !== 0) {
        this.drawCombinedXGrid(this.middle, this.topAxisHeight, sum, this.shapeWidth, this.yAxisHeight);
      }
    }
  }

  createCombinedYAxis (yAxis) {
    let len = yAxis.length;
    this.yAxisHeight = this.shapeHeight / len;
    for (let i = 0; i < len; i++) {
      this.drawCombinedYAxis(yAxis[i], i);
      this.drawCombinedCanvas(null, i, yAxis[i], i);
      if (i !== 0) {
        this.drawCombinedXGrid(this.middle, this.topAxisHeight, i, this.shapeWidth, this.yAxisHeight);
      }
    }
  };

  drawCombinedYAxis (yAxisChild, index) {
    for (let i = 0; i < yAxisChild.length; i++) {
      let position = yAxisChild[i].position;
      let yAxisMax = position === 'left' ? this.leftMaxValue : this.rightMaxValue; // getMaxValue(this.data, yAxis[j].key);
      let scaleY = scaleLinear(yAxisMax, this.yAxisHeight);
      if (position === 'left') {
        this.leftScaleY = scaleY;
        initYGrid(this.middle, this.shapeWidth, this.yAxisHeight, scaleY, this.topAxisHeight, index);
      } else {
        this.rightScaleY = scaleY;
      }
      initYAxis(this[`${position}Axis`], scaleY, yAxisChild[i], this.tipTpl, this.yAxisHeight, this.topAxisHeight, this[`${position}AxisWidth`], index);
    }
  }

  drawCombinedXGrid (middle, topAxisHeight, index, width, height) {
    let grid = middle.append('g').attr('class', 'line');
    let y = topAxisHeight + height * index;
    grid.append('line')
      .attr('x1', 0)
      .attr('y1', y)
      .attr('x2', width)
      .attr('y2', y)
      .attr('stroke-width', 1)
      .attr('stroke', '#c2c9d1');
  }
};
