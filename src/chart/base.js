// import { initTip } from '../components/textTip';
import { scaleLinear, scaleBand } from './base/scale';
import { initYAxis, initXAxis } from './base/axis';
import { setUniqueForKey, setPerKeyForKey } from './base/utils';
import { createYGrid, createYAxisPartHorGrid, createYAxisPartVerLine, drawCombinedXGrid, initYPartMiddleGrid } from './base/grid';
import { getMaxValue, getKeyDataList } from './base/dataUtils';
import { getTopAxisHeight, setBottomLabelHeight, getMaxValueWidth } from '../utils/utils.js';
import { createFirstYPart, createLastYPart, createMiddleYPart } from './base/yAixsPart';
import { createXPartTitle, createFirstXAxisPart, createMiddleXAxisPart } from './base/xAxisPart';
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
    let labelHeight = setBottomLabelHeight(this.config.xAxis[0], this.xAxisList);
    /* 底部坐标轴高度 */
    this.bottomAxisHeight = labelHeight + 30;
    /* 顶部坐标轴高度 */
    this.topAxisHeight = getTopAxisHeight(this.config.xAxisPart);
  };

  setBaseContainer () {
    /* 判断是否自适应宽高，设置画图空间 */
    const { id } = this.config;
    let dom = document.querySelector(`#${id}`);
    dom.innerHTML = '';
    let domWidth = dom.clientWidth;
    let domHeight = dom.clientHeight;
    this.width = domWidth;
    this.height = domHeight;
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
    this.initCombinedYAxisConfig(yAxis);
    for (let i = 0; i < this.yAxisLen; i++) {
      // 初始化Y轴配置
      this.initYAxisConfig(yAxis[i], i);
      // 初始化单个画布容器
      this.initCanvasContainer(i);
      // 创建底部X轴
      this.createBottomXAxis();
      // 创建顶部X轴
      this.initXAxisPart();
      // 创建Y轴并画图
      this.createYAxisPart(yAxis[i], i);
    };
  }

  createCombinedCanvas (yAxis) {
    this.yAxisLen = yAxis.length;
    this.canvasHeight = this.height;
    this.initCombinedYAxisConfig(yAxis);
    this.initCanvasContainer(0);
    this.createBottomXAxis();
    // 创建顶部X轴
    this.initXAxisPart();
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
    // let { fitModel } = this.config;
    let { leftAxisWidth, leftTitleWidth } = getMaxValueWidth(yAxis, this.data, this.config.yAxisPart, 'left');
    /* 左边坐标轴宽度 */
    this.leftAxisWidth = leftAxisWidth;
    this.leftTitleWidth = leftTitleWidth;
    let { rightAxisWidth, rightTitleWidth } = getMaxValueWidth(yAxis, this.data, null, 'right');
    /* 右边坐标轴最大值 */
    this.rightAxisWidth = rightAxisWidth;
    this.rightTitleWidth = rightTitleWidth;
    /* 画布内容高度 */
    this.shapeHeight = this.canvasHeight - (this.bottomAxisHeight + this.topAxisHeight);
    /* 画布内容的宽度 */
    // let width = this.xAxisList.length * 200;
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
  }

  createBottomXAxis () {
    let xAxis = this.config.xAxis;
    if (!xAxis || !xAxis.length) return;
    let xAxisObj = xAxis[0];
    let xAxisPart = this.config.xAxisPart || [];
    let isFlag = !xAxisPart.length;
    this.scaleX = scaleBand(this.xAxisList, this.shapeWidth, isFlag);
    // 中间容器， x的刻度， 画布宽度， 画布高度， x轴的配置信息， 顶部X轴的高度, 标签的高度， x轴的值
    initXAxis(this.middle, this.scaleX, this.shapeWidth, this.shapeHeight, xAxisObj, this.topAxisHeight, this.bottomAxisHeight, this.xAxisList);
  };

  initXAxisPart () {
    let xAxisPart = this.config.xAxisPart;
    if (!xAxisPart || !xAxisPart.length) return;
    let xAxis = this.config.xAxis;
    let data = this.data[0];
    let len = xAxisPart.length;
    let group = this.middle.append('g').attr('transform', `translate(${0}, ${20})`);
    let title = xAxisPart[0].title.value;
    let bandwidth = this.scaleX.bandwidth();
    createXPartTitle(this.shapeWidth, group, title);
    let uniqueList = [];
    let partMap = setUniqueForKey(xAxisPart[0].key, xAxis[0].key, data);
    for (let key in partMap) {
      uniqueList.push(key);
    }
    createFirstXAxisPart(group, uniqueList, 30, bandwidth, this.canvasHeight, partMap);
    for (let i = 1; i < len; i++) {
      let partMap = setPerKeyForKey(xAxisPart[i - 1].key, xAxisPart[i].key, data, xAxisPart[i - 2] ? xAxisPart[i - 2].key : '');
      let top = i * 30 + 25;
      let perLen = 0;
      for (let key in partMap) {
        createMiddleXAxisPart(group, partMap[key], top, bandwidth, this.canvasHeight, key, partMap, perLen);
        perLen = perLen + partMap[key].length;
      }
    }
  };

  createYAxis (len, yAxisChild) {
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < yAxisChild.length; j++) {
        let position = yAxisChild[j].position;
        let yAxisMax = position === 'left' ? this.leftMaxValue : this.rightMaxValue; // getMaxValue(this.data, yAxis[j].key);
        let scaleY = scaleLinear(yAxisMax, this.yAxisHeight);
        if (position === 'left') {
          this.leftScaleY = scaleY;
          createYGrid(this.middle, this.shapeWidth, this.yAxisHeight, scaleY, this.topAxisHeight, i);
        } else {
          this.rightScaleY = scaleY;
        }
        initYAxis(this[`${position}Axis`], scaleY, yAxisChild[j], this.tipTpl, this.yAxisHeight, this.topAxisHeight, this[`${position}AxisWidth`], this[`${position}TitleWidth`], i, i === len - 1);
      }
    };
  }

  createYAxisPart (yAxisChild, index) {
    let yAxisPart = this.config.yAxisPart;
    if (!yAxisPart || !yAxisPart.length) {
      this.createYAxis(1, yAxisChild);
      this.drawCanvas(null, index, yAxisChild, 0);
    } else {
      let data = this.data[index];
      let partLen = yAxisPart.length;
      this.initYAxisPart(yAxisPart, partLen, data, yAxisChild, index);
    }
  }

  initYAxisPart (yAxisPart, len, data, yAxisChild, index) {
    let yAxisPartList = getKeyDataList(data, yAxisPart[0].key);
    let uniqueList = [...new Set(yAxisPartList)];
    if (len < 2) {
      let uniqueLen = uniqueList.length;
      this.yAxisHeight = this.shapeHeight / uniqueLen;
      this.createYAxis(uniqueLen, yAxisChild);
      this.drawCanvas(uniqueList, index, yAxisChild, 0);
      initYPartMiddleGrid(this.middle, this.yAxisHeight, uniqueList, this.shapeWidth, this.topAxisHeight);
      createFirstYPart(this.leftAxis, uniqueList, this.yAxisHeight, this.leftAxisWidth, this.topAxisHeight, len);
    } else {
      let xAxis = this.config.xAxis;
      let lastMap = setUniqueForKey(xAxis[0].key, yAxisPart[0].key, data);
      let lastList = [];
      let yAxisLen = 0;
      for (let key in lastMap) {
        if (!lastList.length) {
          yAxisLen = lastMap[key].length;
          lastList.push(...lastMap[key]);
          break;
        }
      }
      this.yAxisHeight = this.shapeHeight / yAxisLen;
      this.createYAxis(yAxisLen, yAxisChild);
      createLastYPart(this.leftAxis, lastList, this.yAxisHeight, this.leftAxisWidth, this.topAxisHeight, 0);
      createYAxisPartVerLine(this.leftAxis, this.topAxisHeight, this.shapeHeight, 1);
      let firstMap = setUniqueForKey(xAxis[0].key, yAxisPart[len - 1].key, data);
      let firstList = [];
      for (let key in firstMap) {
        if (!firstList.length) {
          firstList.push(...firstMap[key]);
          break;
        }
      }
      createYAxisPartVerLine(this.leftAxis, this.topAxisHeight, this.shapeHeight, len - 1);
      createFirstYPart(this.leftAxis, firstList, this.yAxisHeight, this.leftAxisWidth, this.topAxisHeight, len);
      initYPartMiddleGrid(this.middle, this.yAxisHeight, firstList, this.shapeWidth, this.topAxisHeight);
      this.drawCanvas(firstList, index, yAxisChild, len - 1);
      for (let i = 1; i < (len - 1); i++) {
        let middleMap = setUniqueForKey(yAxisPart[i - 1].key, yAxisPart[i].key, data);
        let perLen = 0;
        for (let key in middleMap) {
          createMiddleYPart(this.leftAxis, this.yAxisHeight, this.leftAxisWidth, this.topAxisHeight, middleMap, key, perLen, i);
          perLen = perLen + middleMap[key].length;
        }
        createYAxisPartVerLine(this.leftAxis, this.topAxisHeight, this.shapeHeight, i);
      }
    }
  }

  createCombinedYPart (yAxis) {
    let yAxisPart = this.config.yAxisPart;
    if (!yAxisPart || !yAxisPart.length) {
      this.createCombinedYAxis(yAxis);
    } else {
      let len = yAxis.length;
      for (let i = 0; i < len; i++) {
        this.initYAxisConfig(yAxis[i], i);
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
        createYAxisPartVerLine(this.leftAxis, this.topAxisHeight, this.shapeHeight, i);
      }
      createYAxisPartHorGrid(this.leftAxis, this.yAxisHeight * len, uniquePartList, this.leftAxisWidth, (partLen - i - 1), this.topAxisHeight, yAxisPart[0].key, yAxisPart[i].key, data, i, yAxisPartList);
    }
  };

  createCombinedYAxisYPart (uniquePartList, yAxisChild, index, len) {
    for (let i = 0; i < uniquePartList.length; i++) {
      let sum = (i * len) + index;
      this.drawCombinedYAxis(yAxisChild, sum);
      this.drawCombinedCanvas(null, sum, yAxisChild, index);
      if (sum !== 0) {
        drawCombinedXGrid(this.middle, this.topAxisHeight, sum, this.shapeWidth, this.yAxisHeight);
      }
    }
  };

  createCombinedYAxis (yAxis) {
    let len = yAxis.length;
    this.yAxisHeight = this.shapeHeight / len;
    for (let i = 0; i < len; i++) {
      this.initYAxisConfig(yAxis[i], i);
      this.drawCombinedYAxis(yAxis[i], i);
      this.drawCombinedCanvas(null, i, yAxis[i], i);
      if (i !== 0) {
        drawCombinedXGrid(this.middle, this.topAxisHeight, i, this.shapeWidth, this.yAxisHeight);
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
        createYGrid(this.middle, this.shapeWidth, this.yAxisHeight, scaleY, this.topAxisHeight, index);
      } else {
        this.rightScaleY = scaleY;
      }
      initYAxis(this[`${position}Axis`], scaleY, yAxisChild[i], this.tipTpl, this.yAxisHeight, this.topAxisHeight, this[`${position}AxisWidth`], this[`${position}TitleWidth`], index);
    }
  }
};
