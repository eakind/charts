import { Chart, getEngine } from '@antv/g2';

import defaultConfig from '../../utils/baseConfig.js';

import { dataProcess, styleProcess } from '../../utils/util.js';

let { colorSet, defaultText, defaultFormat } = defaultConfig;
class Geometry {
  constructor (data, config) {
    this.chart = new Chart({
      container: config.id,
      // autoFit: true,
      width: config.width,
      height: config.height,
    });
    this.data = data;
    this.geometry = null;
    this.config = config;
  }

  init () {
    // 数据绑定
    this.dataBind();

    // 主题色设置
    this.themeConfig();
  }

  dataBind () {
    this.chart.data(this.data);
  }

  themeConfig () {
    this.chart.theme({
      styleSheet: {
        paletteQualitative10: colorSet.category.slice(0, 10),
        paletteQualitative20: colorSet.category,
      },
    });
  }

  tooltipConfig (list) {
    this.chart.tooltip({
      showMarkers: false,
      customContent: (name, data) => {
        const container = document.createElement('div');
        container.className = 'g2-tooltip';
        let listItem = '';
        data.forEach((d) => {
          list.forEach((item) => {
            let prop = item.title;
            let val = d.data[item.key];
            let { text = defaultText, format = defaultFormat } = item;
            if (item.display !== 'none') {
              let curStyleObj = styleProcess(text);
              let retVal = dataProcess(val, format);
              Object.assign(curStyleObj, {
                display: 'inline-flex',
                flex: 1,
                justifyContent: 'space-between',
              });
              listItem += `<li class="g2-tooltip-list-item" style="margin-bottom:4px;display:flex;align-items: center;">
            <span style="${curStyleObj}">
            <span >${prop}:</span>
            <span>${retVal}</span>
            </span>
            </li>`;
            }
          });
        });
        container.innerHTML = listItem;
        return container;
      },
    });
  }

  labelConfig (list, labelFeature) {
    let G = getEngine('canvas');
    this.geometry.label(labelFeature, {
      lineHeight: 24,
      layout: [{ type: 'pie-spider' }, { type: 'hide-overlap' }],
      content: (obj, item) => {
        const group = new G.Group({});
        // 了解 shape 的绘制原理：y0 左下起点 y1 右上起点
        const [y0, y1] = item.y || [0, 0];
        const inRight = y0 < y1;
        const textAlign = inRight ? 'left' : 'right';

        list.forEach((i, index) => {
          let { text = defaultText, format = defaultFormat } = i;
          let retVal = dataProcess(obj[i.key], format);
          group.addShape({
            type: 'text',
            attrs: {
              x: 0,
              y: 15 * index,
              text: retVal,
              fill: text.fontColor,
              fontSize: text.fontSize,
              textBaseline: 'top',
              textAlign,
              lineHeight: text.lineHeight,
            },
          });
        });
        if (!inRight) {
          group.translate(group.getBBox().width, 0);
        }
        group.translate(0, 16);
        return group;
      },
    });
  }

  draw () {
    this.init();
    this.drawGeometry();
  }

  addEvent () {
    // this.chart.interaction('element-highlight');
    this.chart.interaction('element-highlight', {
      start: [
        {
          trigger: 'interval:click',
          action: 'element-single-highlight:highlight',
        },
      ],
      // start: [{ trigger: 'interval:click', action: 'element-highlight:highlight' }],
      end: [
        {
          trigger: 'click',
          isEnable (context) {
            return !context.event.data;
          },
          action: 'element-single-highlight:clear',
        },
      ],
    });
  }

  /**
   * 自己实现
   */
  drawGeometry () {}
  /**
   *
   * @param {data color tooltip labels} type
   * @param {新值} newData
   */
  chartUpdate (type, newData) {
    let updateFun = (function () {
      return {
        colorUpdate () {
          this.geometry.color(this.config.colorFeature.feature, newData);
        },
        labelsUpdate () {
          this.labelConfig(newData, this.config.sizeFeature.feature);
        },
        tooltipUpdate () {
          this.tooltipConfig(newData);
        },
        dataUpdate () {
          this.chart.data(newData);
        },
      };
    })();

    if (typeof this[type + 'Update'] === 'function') {
      this[type + 'Update'](type, newData);
    } else {
      typeof updateFun[type + 'Update'] === 'function' &&
        updateFun[type + 'Update'].call(this);
    }
    this.chart.render(); // 更新图表
  }
}

export default Geometry;
