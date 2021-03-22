// import { initTip } from '../components/textTip';
import { scaleLinear, scaleBand } from './base/scale';
import { initYAxis, initXAxis } from './base/axis';
import { setUniqueForKey, setPerKeyForKey } from './base/utils';
import { createYGrid, createYAxisPartVerLine, drawCombinedXGrid, initYPartMiddleGrid } from './base/grid';
import { getMaxArrValue, getKeyDataList } from './base/dataUtils';
import { getTopAxisHeight, setBottomLabelHeight, getMaxValueWidth } from '../utils/utils.js';
import { createFirstYPart, createLastYPart, createMiddleYPart } from './base/yAixsPart';
import { createXPartTitle, createFirstXAxisPart, createMiddleXAxisPart } from './base/xAxisPart';
import { initTooltip } from './shape/tooltip';
export default class Base {
  init () {
    // 初始化X轴数据配置跟空间
    this.initXAxisConfig();
    // 设置画图容器大小
    this.setBaseContainer();
    // 设置画布高度数据
    this.initYAxisHeight();
    // 初始化布局
    this.initContainer();
    // 初始化tooltip
    this.tooltip = initTooltip();
  };

  initYAxisHeight () {
    let { xAxis, yAxis, yAxisPart, fitModel } = this.config;
    if (!yAxis[0] && !yAxis[0][0]) {
      return;
    }
    let { data } = yAxis[0][0];
    // 一共有多少个子画布
    this.yAxisLen = yAxis.length;
    // 每个子画布的高度
    this.canvasHeight = Math.floor(this.width / this.yAxisLen);
    // 每个子画布轴的高度
    this.shapeHeight = this.canvasHeight - (this.bottomAxisHeight + this.topAxisHeight);
    // 获取Y轴刻度数组
    if (yAxisPart && yAxisPart.length) {
      let len = yAxisPart.length - 1;
      let yAxisPartMap = setUniqueForKey(xAxis[0].key, yAxisPart[len].key, data[0]);
      this.lastYPartList = [];
      for (let key in yAxisPartMap) {
        this.lastYPartList.push(...yAxisPartMap[key]);
        break;
      }
      this.yAxisHeight = (this.shapeHeight) / this.lastYPartList.length;
      switch (fitModel) {
        case 'standard':
          if (this.yAxisHeight < 150) {
            this.yAxisHeight = 150;
            this.shapeHeight = this.lastYPartList.length * 150;
            this.canvasHeight = this.shapeHeight + (this.bottomAxisHeight + this.topAxisHeight);
          }
          break;
      }
    } else {
      // 每个子画布中每个轴的高度
      this.yAxisHeight = this.shapeHeight;
    }
  }

  initXAxisConfig () {
    let { xAxis, xAxisPart, yAxis } = this.config;
    if (!yAxis[0] && !yAxis[0][0]) {
      return;
    }
    let { data } = yAxis[0][0];
    // 获取X轴刻度数组
    this.xAxisList = [];
    if (xAxisPart && xAxisPart.length) {
      let xAxisPartMap = setUniqueForKey(xAxisPart[0].key, xAxis[0].key, data[0]);
      for (let key in xAxisPartMap) {
        this.xAxisList.push(...xAxisPartMap[key]);
      }
    } else {
      this.xAxisList = [...new Set(getKeyDataList(data[0], xAxis[0].key))];
    };

    /* X轴坐标标签的高度 */
    let labelHeight = setBottomLabelHeight(xAxis[0], this.xAxisList);
    /* 底部坐标轴高度 */
    this.bottomAxisHeight = labelHeight + 50;
    /* 顶部坐标轴高度 */
    this.topAxisHeight = getTopAxisHeight(xAxisPart);
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
    dom.style.overflow = 'auto';
  }

  initContainer () {
    let { yAxis, isCombined } = this.config;
    if (isCombined) {
      // 创建合并坐标轴画布
      this.createCombinedCanvas(yAxis);
      return;
    }
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
      .style('position', 'relative')
      .style('box-sizing', 'border-box')
      .style('width', '100%')
      .style('height', `${this.canvasHeight}px`);
    this.leftAxis = this.container.append('div').attr('class', `left-axis-${index}`)
      .style('display', 'flex')
      .style('flex-direction', 'row-reverse')
      .append('svg')
      .attr('width', this.canvasHeight)
      .attr('height', this.leftAxisWidth);
    // 中间画图部分
    this.middle = this.container.append('div').attr('class', `middle-${index}`)
      .style('flex', 1)
      .style('width', 0)
      .style('overflow', 'auto hidden')
      .append('svg')
      .attr('width', this.canvasHeight)
      .attr('height', this.shapeWidth);
    // 右侧坐标轴容器
    this.rightAxis = this.container.append('div').attr('class', `right-axis-${index}`)
      .style('display', 'flex')
      .append('svg')
      .attr('width', this.canvasHeight)
      .attr('height', this.rightAxisWidth);
  }

  initCombinedYAxisConfig (yAxis) {
    let { fitModel, yAxisPart } = this.config;
    let { leftAxisWidth, leftTitleWidth } = getMaxValueWidth(yAxis, yAxisPart, 'left');
    /* 左边坐标轴宽度 */
    this.leftAxisWidth = leftAxisWidth;
    this.leftTitleWidth = leftTitleWidth;
    let { rightAxisWidth, rightTitleWidth } = getMaxValueWidth(yAxis, null, 'right');
    /* 右边坐标轴最大值 */
    this.rightAxisWidth = rightAxisWidth;
    this.rightTitleWidth = rightTitleWidth;
    /* 画布内容的宽度 */
    let len = this.xAxisList.length;
    this.shapeWidth = this.height - (this.leftAxisWidth + this.rightAxisWidth);
    switch (fitModel) {
      case 'standard':
        if (this.shapeWidth / len < 200) {
          this.shapeWidth = 200 * len;
        }
        break;
    }
  };

  initYAxisConfig (yAxisChild, index) {
    /* 左边轴数组 */
    this.leftAxisList = yAxisChild.filter(item => item.position === 'left');
    /* 右边轴数组 */
    this.rightAxisList = yAxisChild.filter(item => item.position === 'right');
    /* 左边轴最大值 */
    if (this.leftAxisList.length) {
      this.leftMaxValue = getMaxArrValue(this.leftAxisList[0].data, this.leftAxisList[0].key);
    }
    /* 右边轴最大值 */
    if (this.rightAxisList.length) {
      this.rightMaxValue = getMaxArrValue(this.rightAxisList[0].data, this.rightAxisList[0].key);
    }
  }

  createBottomXAxis () {
    let xAxis = this.config.xAxis;
    if (!xAxis || !xAxis.length) return;
    let xAxisObj = xAxis[0];
    this.scaleX = scaleBand(this.xAxisList, this.shapeWidth);
    // 中间容器， x的刻度， 画布宽度， 画布高度， x轴的配置信息， 顶部X轴的高度, 标签的高度， x轴的值
    initXAxis(this.middle, this.scaleX, this.shapeWidth, this.shapeHeight, xAxisObj, this.topAxisHeight, this.bottomAxisHeight, this.xAxisList);
  };

  initXAxisPart () {
    let xAxisPart = this.config.xAxisPart;
    if (!xAxisPart || !xAxisPart.length) return;
    let xAxis = this.config.xAxis;
    let data = this.config.yAxis[0][0].data[0];
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
      let partMap = setPerKeyForKey(xAxisPart[i - 1].key, xAxisPart[i].key, data, xAxisPart, i - 1);
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
        let yAxisMax = position === 'left' ? this.leftMaxValue : this.rightMaxValue;
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
      this.drawCanvas(null, index, yAxisChild);
    } else {
      let partLen = yAxisPart.length;
      this.initYAxisPart(yAxisPart, partLen, yAxisChild, index);
    }
  }

  initYAxisPart (yAxisPart, len, yAxisChild, index) {
    if (len < 2) {
      let uniqueLen = this.lastYPartList.length;
      this.createYAxis(uniqueLen, yAxisChild);
      this.drawCanvas(this.lastYPartList, index, yAxisChild);
      initYPartMiddleGrid(this.middle, this.yAxisHeight, this.lastYPartList, this.shapeWidth, this.topAxisHeight);
      createFirstYPart(this.leftAxis, this.lastYPartList, this.yAxisHeight, this.leftAxisWidth, this.topAxisHeight, len);
    } else {
      let xAxis = this.config.xAxis;
      let data = this.config.yAxis[0][0].data[0];
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
      for (let i = 1; i < (len - 1); i++) {
        let middleMap = setPerKeyForKey(yAxisPart[i].key, yAxisPart[len - 1].key, data, yAxisPart, i);
        let uniqueList = [];
        for (let key in middleMap) {
          uniqueList.push({
            name: key.split(',')[0],
            len: middleMap[key].length
          });
        }
        createMiddleYPart(this.leftAxis, this.yAxisHeight, this.leftAxisWidth, this.topAxisHeight, uniqueList, i);
        createYAxisPartVerLine(this.leftAxis, this.topAxisHeight, this.shapeHeight, i);
      }
      let yPartMap = setPerKeyForKey(yAxisPart[len - 2].key, yAxisPart[len - 1].key, data, yAxisPart, len - 1);
      this.drawCanvas(firstList, index, yAxisChild, yPartMap);
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
    let data = yAxisChild[0].data[0];
    for (let i = 0; i < partLen; i++) {
      let yAxisPartList = getKeyDataList(data, yAxisPart[i].key);
      let uniquePartList = [...new Set(yAxisPartList)];
      if (i === 0) {
        this.uniquePartList = uniquePartList;
        this.createCombinedYAxisYPart(uniquePartList, yAxisChild, index, len);
      } else {
        createYAxisPartVerLine(this.leftAxis, this.topAxisHeight, this.shapeHeight, i);
      }
      createLastYPart(this.leftAxis, uniquePartList, this.yAxisHeight * len, this.leftAxisWidth, this.topAxisHeight, 0);
    }
  };

  createCombinedYAxisYPart (uniquePartList, yAxisChild, index, len, flag) {
    for (let i = 0; i < uniquePartList.length; i++) {
      let sum = (i * len) + index;
      this.drawCombinedYAxis(yAxisChild, sum);
      this.drawCombinedCanvas(sum, yAxisChild, index);
      if (sum !== 0) {
        drawCombinedXGrid(this.middle, this.topAxisHeight, sum, this.shapeWidth, this.yAxisHeight);
      }
    }
  };

  createCombinedYAxis (yAxis) {
    let len = yAxis.length;
    for (let i = 0; i < len; i++) {
      this.initYAxisConfig(yAxis[i], i);
      this.drawCombinedYAxis(yAxis[i], i);
      this.drawCombinedCanvas(i, yAxis[i], i);
      if (i !== 0) {
        drawCombinedXGrid(this.middle, this.topAxisHeight, i, this.shapeWidth, this.yAxisHeight);
      }
    }
  };

  drawCombinedYAxis (yAxisChild, index) {
    for (let i = 0; i < yAxisChild.length; i++) {
      let position = yAxisChild[i].position;
      let yAxisMax = position === 'left' ? this.leftMaxValue : this.rightMaxValue;
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
