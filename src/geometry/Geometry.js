import { getItemColor } from '../utils/color.js';
import {
  dataProcess,
  styleProcess,
  toScientificNotation
} from '../utils/utils.js';
import defaultConfig from '../utils/defaultConfig.js';
let { defaultText, defaultFormat, fontColor } = defaultConfig;
class Geometry {
  constructor (data, config) {
    this.data = data;
    this.config = config;
    this.container = null;
    this.geometry = null;
  }

  /**
   * 创建容器
   */
  createContainer () {
    let { id, width, height } = this.config;
    this.container = d3
      .select(`#${id}`)
      .append('div')
      .attr('class', 'chart-container')
      .attr(
        'style',
        `width:${width}px;height:${height}px;position:relative;display:inline-block;vertical-align:middle`
      );

    // 待补充
    this.svg = this.container
      .append('svg')
      .attr('width', width)
      .attr('height', height);
    // .attr('transform', 'translate(10,10)');
  }

  /**
   * 标签配置
   */
  labelsConfig () {}

  /**
   * 提示框配置
   */
  tooltipConfig () {
    if (!this.geometry) {
      return;
    }
    let list = this.config.tooltipList;
    if (list.length === 0) {
      return;
    }
    // let { width, height } = this.config;
    let tooltipWrap;
    let style = `
    position:absolute;
    z-index:3;
    transition:left 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s, top 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s;
    padding:8px 12px;
    color:${fontColor};
    background: #fff;
  box-shadow: rgb(174, 174, 174) 0px 0px 10px;
  border-radius: 3px;`;

    this.geometry.on('mouseover', (d) => {
      if (list.length === 0) {
        return;
      }
      tooltipContentProcess(d);
    });

    this.geometry.on('mouseout', () => {
      // this.container.selectAll('.dc-tooltip').remove();
      d3.select('body').selectAll('.dc-tooltip').remove();
    });

    this.geometry.on('mousemove', () => {
      let { left, top, translateX } = retLeftTop();
      let curStyle =
        style +
        ` left:${left}px;top:${top}px;transform:translateX(${translateX}`;
      // this.container.selectAll('.dc-tooltip').attr('style', curStyle);
      d3.select('body').selectAll('.dc-tooltip').attr('style', curStyle);
    });

    function retLeftTop () {
      let { clientWidth: tempWidth, clientHeight: tempHeight } = document.body;
      let translateX = 0;
      let left = event.x + 20;
      let top = event.y + 20;

      if (top + list.length * 30 > tempHeight) {
        top = top - list.length > 0 ? top - list.length * 30 : 0;
      }
      if (left + 150 > tempWidth) {
        left = left - 150 > 0 ? left - 30 : 0;
        translateX = '-100%';
      }
      return {
        left,
        top,
        translateX
      };
    }

    function tooltipContentProcess (d) {
      // 鼠标的offsetX offsetY
      // 弹框最大高度  30 * list.length
      // 容器的高度
      let { left, top, translateX } = retLeftTop();
      let curStyle =
        style +
        ` left:${left}px;top:${top}px;transform:translateX(${translateX})`;

      tooltipWrap = d3
        .select('body') //  this.container //
        .append('div')
        .attr('class', 'dc-tooltip')
        .attr('style', curStyle);

      let listItem = '';
      list.forEach((item) => {
        let prop = item.title;
        let val = d[item.key];
        let { text = defaultText, format = defaultFormat } = item;
        if (item.display !== 'none') {
          let curStyleObj = styleProcess(text);
          let retVal = dataProcess(val, format);
          Object.assign(curStyleObj, {
            display: 'inline-flex',
            flex: 1,
            justifyContent: 'space-between'
          });
          listItem += `<li class="dc-tooltip-list-item" style="margin-bottom:4px;display:flex;align-items: center;">
            <span style="${curStyleObj}">
            <span >${prop}:</span>
            <span>${retVal}</span>
            </span>
            </li>`;
        }
      });
      tooltipWrap.html(listItem);
    }
  }

  registerEvent (eventType) {
    if (!this.geometry) {
      return;
    }
    let that = this;
    this.geometry.on(
      eventType,
      function (d) {
        // 待修改selectAll(`.${that.className}`)
        d3.event.stopPropagation();
        that.geometry.attr('opacity', that.config.opacity * 0.2);
        d3.select(this).transition().duration(500).attr('opacity', 1);
        that.config.clkFlag = true;
        typeof that.config.data_click === 'function' &&
          that.config.data_click(d);
      },
      false
    );

    this.container.on(
      eventType,
      function (d) {
        // 待修改selectAll(`.${that.className}`)
        that.geometry.attr('opacity', that.config.opacity);
        if (that.config.clkFlag) {
          typeof that.config.data_click === 'function' &&
            that.config.data_click();
          that.config.clkFlag = false;
        }
      },
      false
    );
  }

  /**
   * 画图形
   */
  render () {
    this.draw();
    this.labelsConfig();
    this.tooltipConfig();
    this.registerEvent('click');
  }

  getItemColor (index, curVal) {
    let { type, feature } = this.config.colorFeature;
    let min = 0;
    let max = 0;
    if (type === 'linear') {
      let sortData = this.data.sort((a, b) => a[feature] - b[feature]);
      min = sortData[0][feature];
      max = sortData[sortData.length - 1][feature];
      if (this.data.length === 1) {
        if (min > 0) {
          min = 0;
        } else {
          max = 0;
        }
      }
    }

    return getItemColor(
      index,
      this.config.colorList,
      this.config.colorFeature.type,
      min,
      max,
      curVal,
      feature
    );
  }

  update (type, data) {
    let updateFun = {
      tooltip: () => {
        this.config.tooltipList = data;
        this.tooltipConfig();
      },
      labels: () => {
        this.config.labelsList = data;
        this.labelsConfig();
      }
    };

    if (typeof updateFun[type] === 'function') {
      updateFun[type]();
    }
  }

  getColorList () {
    let { colorFeature, colorOpacity } = this.config;
    if (!colorFeature.feature) {
      return [];
    }
    if (!this.colorList || this.colorList.length === 0) {
      return [];
    }
    let colorList = [];
    let obj = {};
    obj.key = colorFeature;
    obj.opacity = colorOpacity;
    obj.list = [];
    obj.name = colorFeature.feature;
    obj.colored_type = colorFeature.type;
    /**
     * 处理数据 取最大值和最小值
     */
    if (colorFeature.type === 'linear') {
      let sortList = this.colorList
        .filter((i) => typeof i.val !== 'undefined')
        .sort((a, b) => a.val - b.val);
      let minObj = sortList[0];
      minObj.rangeType = 'min';
      minObj.originalVal = minObj.val;
      minObj.val = toScientificNotation(minObj.val);
      minObj.color = this.getItemColor(0, minObj.val);
      let maxObj = JSON.parse(JSON.stringify(sortList[0]));
      if (sortList.length > 1) {
        maxObj.originalVal = sortList[sortList.length - 1].val;
      }
      maxObj.color = this.getItemColor(1, maxObj.originalVal);
      maxObj.rangeType = 'max';
      maxObj.val = toScientificNotation(maxObj.originalVal);

      obj.list = [minObj, maxObj];
    } else {
      obj.list = this.colorList;
    }
    colorList.push(obj);
    return colorList;
  }

  getDomain () {}
}

export default Geometry;
