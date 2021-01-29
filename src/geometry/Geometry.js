import { getItemColor } from '../utils/color.js';
import { dataProcess, styleProcess } from '../utils/utils.js';
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
      .attr('style', `width:${width}px;height:${height}px;position:relative`);

    // 待补充
    this.svg = this.container
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('transform', 'translate(10,10)');
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

    this.geometry.on('touchstart', (d) => {
      if (list.length === 0) {
        return;
      }
      tooltipContentProcess(d);
    });

    this.geometry.on('touchmove', () => {
      // this.container.selectAll('.dc-tooltip').remove();
      d3.select('body').selectAll('.dc-tooltip').remove();
    });

    this.geometry.on('touchend', () => {
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
      let left = event.offsetX + 20;
      let top = event.offsetY + 20;

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
    this.geometry.on(eventType, function (d) {
      // 待修改
      // d3.select(this).transition().duration(500).attr('opacity', 0.2);
      typeof that.config.data_click === 'function' && that.config.data_click(d);
    });
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
    }

    return getItemColor(
      index,
      this.config.colorList,
      this.config.colorFeature.type,
      min,
      max,
      curVal
    );
  }
}

export default Geometry;
