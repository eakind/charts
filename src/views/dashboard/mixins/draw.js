import { get, post } from '@/api/server.js';
import { setCanvasColor } from '../../drawingboard/utils/canvasStyle';
import { getSize, isType, hexToRgba } from '@/utils/utils.js';
import { getBaseConfig } from '@/utils/draw/baseConfig.js';
import { drawLine } from '@/utils/draw/drawLine.js';
import { drawBarLine } from '@/utils/draw/drawBarLine.js';
import { drawBar } from '@/utils/draw/drawBar.js';
import { drawBarRotated } from '@/utils/draw/drawBarRotated.js';
import { drawScatter } from '@/utils/draw/drawScatter.js';
import { drawTable } from '@/utils/draw/drawTable';
import { drawPie } from '@/utils/draw/drawPie';
import { drawMap } from '@/utils/draw/drawMap';
import { drawBubble } from '@/utils/draw/drawBubble';
import { mapMutations, mapState } from 'vuex';
export default {
  data () {
    return {
      drawMethods: {
        '02': drawBar, // 'bar',
        '01': drawTable, // 'table',
        '03': drawBarRotated, // 'bar-rotated',
        '04': drawBarLine, // 'bar-line',
        '05': drawLine, // 'line',
        '06': drawPie, // 'pie',
        '07': drawBubble, // 'bubble',
        '08': drawMap, // 'map',
        '09': drawScatter, // 'scatter',
      },
    };
  },
  computed: {
    ...mapState('dashboard', ['legendList', 'currentDashboardDetail']),
    curCanvasStyle () {
      let obj = {};
      let opactiy = 100;
      if (
        this.styleObj &&
        this.styleObj.chart &&
        this.styleObj.chart.bgColor.bgSelected
      ) {
        obj.background = this.styleObj.chart.bgColor.background;
        opactiy = this.styleObj.chart.bgColor.opacity;
      } else {
        obj.background = this.styleObj.chart.bgColor.background;
        opactiy = 0;
      }
      if (this.styleObj && this.styleObj.global) {
        Object.assign(obj, this.retBorderStyle(this.styleObj.global.border));
      }
      if (this.styleObj && this.styleObj.global) {
        let { top, left, right, bottom } = this.styleObj.global.padding || {};
        obj.padding = `${top}px ${right}px ${bottom}px ${left}px`;
      }
      obj.background = hexToRgba(obj.background, opactiy);
      // this.$set(obj, 'background', hexToRgba(obj.background, opactiy));
      return obj;
    },
  },
  methods: {
    ...mapMutations('dashboard', ['setLegendList']),
    /**
     * 画图
     * @param {*} 对象
     */
    drawChartByItem (i) {
      // let worksheetId = i.worksheet_id;
      let { newData, features } = i;
      // 画图
      let workSheetType = i.worksheet_type;
      let chartType = this.worksheetTypes[workSheetType];
      let mode = this.styleObj.chart
        ? this.styleObj.chart.mode || 'standard'
        : 'standard';
      let { background } = this.currentDashboardDetail.css.dashboard.bgColor;
      let dashboardBg =
        this.currentDashboardDetail.css.dashboard &&
        this.currentDashboardDetail.css.dashboard.bgColor.bgSelected
          ? typeof background === 'object'
            ? background
            : this.currentDashboardDetail.css.dashboard.bgColor
          : null;

      i.css.dashboardBgCss = this.styleObj.chart.bgColor.bgSelected
        ? this.styleObj.chart.bgColor
        : dashboardBg && typeof this.styleObj.chart.bgColor.index !== 'undefined' ? dashboardBg : {
          background: '#fff',
          opacity: 100,
        };

      i.css.bgCss = this.styleObj.chart.bgColor.bgSelected
        ? this.styleObj.chart.bgColor
        : dashboardBg && typeof this.styleObj.chart.bgColor.index !== 'undefined' ? dashboardBg : {
          background: dashboardBg ? dashboardBg.background : '#fff',
          opacity: 100,
        };

      if (dashboardBg) {
        i.css.dashboardBgCss.color = dashboardBg.color || '';
      }
      let css = {};
      if (['table', 'map', 'pie', 'bubble'].indexOf(chartType) > -1) {
        css = this.bgCssProcess(i.css);
      } else {
        css = JSON.parse(JSON.stringify(i.css));
        let bgCssObj = css.dashboardBgCss;
        if (bgCssObj.color) {
          css.bgCss.color = bgCssObj.color;
        }
        setCanvasColor(css.axis_style, css.textSettings, bgCssObj.color);
      }

      let configObj = this.retConfigObj(
        newData,
        features,
        css,
        chartType,
        mode
      );
      if (!configObj) return;
      configObj.canvasCss.mode = mode;
      this.$nextTick(() => {
        let ins =
          typeof this.drawMethods[workSheetType] === 'function' &&
          this.drawMethods[workSheetType](configObj);
        this.colorListProcess(ins, i.worksheet_id);
      });
    },
    colorListProcess (ins, id) {
      let curLegendList = this.legendList;
      let colorList = [];
      let aggr = '';
      if (isType('Array')(ins)) {
        aggr = [];
        // colorList = ins.map((i) => {
        //   if (i.config.colorList.length > 0) {
        //     aggr.push(i.config.colorList[0].name || i.config.colorList[0].aggr);
        //   }
        //   return i.config.colorList.length > 0
        //     ? i.config.colorList[0].list
        //     : [];
        // });
        for (let i = 0; i < ins.length; i++) {
          let list = ins[i].config.colorList;
          for (let j = 0; j < list.length; j++) {
            aggr.push(list[j].name || list[j].aggr);
            colorList.push(list[j].list);
          }
        }
      } else {
        if (ins.config) {
          colorList = [];
          if (ins.config.colorList.length > 0) {
            colorList = ins.config.colorList[0].list;
            aggr = ins.config.colorList[0].name || ins.config.colorList[0].aggr;
          }
        } else {
          colorList = [];
          if (ins.styles) {
            if (ins.styles.colors.length > 0) {
              colorList = ins.styles.colors[0].list;
              aggr = ins.styles.colors[0].name || ins.styles.colors[0].aggr;
            }
          }
        }
      }
      let obj = {
        aggr,
        id,
        list: colorList,
      };
      let match =
        curLegendList.length > 0
          ? curLegendList.find((i) => i.id === id) || {}
          : {};
      if (match.id) {
        match.list = colorList;
        curLegendList = curLegendList.map((i) => {
          if (i.id === id) {
            i.list = colorList;
            i.aggr = aggr;
          }
          return i;
        });
      } else {
        curLegendList.push(obj);
      }
      // this.setLegendList(curLegendList);
    },
    retConfigObj (newData, features, css, chartType, viewMode) {
      // 获取size
      if (!this.$refs.chartMain) return null;
      let { chartSize, containerSize } = getSize(
        this.$refs.chartMain,
        viewMode,
        newData.chartArrs,
        false,
        chartType,
        false
      );
      let height = this.$refs.chartTile.clientHeight;
      if (chartType === 'bar-rotated') {
        if (chartSize.height) chartSize.height = chartSize.height - 26 - height;
        if (containerSize.height) {
          containerSize.height = containerSize.height - 26 - height;
        }
      } else {
        if (chartSize.height) chartSize.height = chartSize.height - height - 16;
        if (containerSize.height) {
          containerSize.height = containerSize.height - height - 16;
        }
      }
      let numList = this.numList;
      if (['table', 'map', 'pie', 'bubble'].indexOf(chartType) > -1) {
        return retOthersConfigObj();
      } else {
        return retBarConfigObj();
      }
      function retBarConfigObj () {
        let baseConfig = getBaseConfig(JSON.parse(JSON.stringify(css))); // 画图表基础参数
        let configObj = {
          baseConfig,
          featureData: newData.data,
          canvasCss: JSON.parse(JSON.stringify(css)),
          canvasFeatures: JSON.parse(JSON.stringify(features)),
          containerSize,
          chartSize,
          chartArr: newData.chartArrs,
          numList,
        };
        return configObj;
      }
      function retOthersConfigObj () {
        return {
          data: chartType === 'map' ? newData.data.data : newData.data,
          featureList: features,
          canvasCss: css, // 画布CSS
          ids: newData.chartArrs.map((d) => d.id), // 根据ID找到图表的DOM载体
          chartSize, // 图表的大小，格式为{width: 1080, height: 480}，可不提供
          containerSize, // 可滚动时候提供外div的宽高
        };
      }
    },
    // 获取 worksheet 详情
    async getWorkSheetDetail (worksheetId) {
      let param = {
        project_id: this.projectId,
        worksheet_id: worksheetId,
      };
      let res = await get('canvasDetail', param);
      if (res && res.code === 0) {
        return res;
      }
      return {};
    },

    async getData (worksheetId, features, css) {
      let param = {
        dashboard_id: this.currentDashboard.dashboard_id,
        features: features,
        limit: 9999,
        // ncols: 1000, // 待修改
        // nrows: 1000,
        offset: 0,
        project_id: this.projectId,
        worksheet_id: worksheetId,
      };
      //
      Object.assign(param, this.dataSettingProcess(css));
      let res = await post('reviseCanvasFeature', param);
      if (res && res.code === 0) {
        return res.features_data;
      }
      return [];
    },

    async modifyCss (css) {
      let param = {
        dashboard_id: this.currentDashboard.dashboard_id,
        project_id: this.projectId,
        css,
      };
      await post('dashboardCss', param);
    },

    bgCssProcess (css) {
      let canvasCss = JSON.parse(JSON.stringify(css));
      let bgCssObj = css.dashboardBgCss; // || this.currentDashboardDetail.dashboard.bgColor.background;// canvasCss.bgCss;
      canvasCss.bgCss.background = typeof canvasCss.bgCss.background === 'object' ? canvasCss.bgCss.background.background : canvasCss.bgCss.background;
      //  canvasCss.bgCss = JSON.parse(JSON.stringify(bgCssObj));
      if (bgCssObj.color) {
        let titleCss = {
          color: bgCssObj.color,
        };
        canvasCss.titleCss = titleCss;
      }
      if (this.chartType === 'map') {
        canvasCss.bgCss.color = '#6b6b6b';
      }
      let { textSettings } = canvasCss;
      if (textSettings && bgCssObj.color) {
        for (let index = 0; index < textSettings.length; index++) {
          textSettings[index].list.forEach((i) => {
            i.format.fontColor = bgCssObj.color;
          });
        }
        canvasCss.textSettings = textSettings;
      }
      return canvasCss;
    },
    dataSettingProcess (css) {
      let { data_setting } = css;
      let chartType = this.chartType;
      let ret = {};
      if (chartType !== 'table') {
        ret.limit = 9999;
        ret.offset = 0;
      }

      let obj = data_setting ? data_setting.find((i) => i.selected) : {};

      let content = obj.values ? obj.values || null : obj.content || null;
      if (chartType === 'table') {
        ret.nrows = content ? content[1].val : 1000;
        ret.ncols = content ? content[0].val : 100;
      } else if (
        chartType === 'pie' ||
        chartType === 'bubble' ||
        chartType === 'scatter'
      ) {
        ret.n = content ? content[0].val : 1000;
      } else if (chartType === 'map') {
        ret.n = content ? content[0].val : 1000;
        ret.nrows = content ? content[0].val : 1000;
      } else {
        switch (this.chartType) {
          case 'bar-rotated':
            ret.nrows = content ? content[0].val : 1000;
            break;
          case 'scatter':
            ret.n = content ? content[0].val : 1000;
            break;
          default:
            ret.ncols = content ? content[0].val : 1000;
            break;
        }
      }

      return ret;
    },
  },
};
