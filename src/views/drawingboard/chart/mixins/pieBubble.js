import { post } from '@/api/server';

import { mapState, mapMutations } from 'vuex';

import { getSize } from '../../utils/canvasStyle.js';
import { getChatArr } from '../utils/drawDataProcess.js';

import { initMixin } from './init.js';
import { modifyMixin } from './modify.js';
import { commonComponentsMixin } from './commonComponents.js';

import { pieDrawingChartStyleProcess } from '@/utils/draw/drawPie.js';
import { bubbleDrawingChartStyleProcess } from '@/utils/draw/drawBubble.js';
import { scatterDrawingChartStyleProcess } from '@/utils/draw/drawScatter.js';

let drawFunObj = {
  pie: pieDrawingChartStyleProcess,
  bubble: bubbleDrawingChartStyleProcess,
  scatter: scatterDrawingChartStyleProcess,
};
export const pieBubbleMixin = {
  mixins: [initMixin, modifyMixin, commonComponentsMixin],
  data () {
    return {
      canvasFeatures: {},
      showChartTip: false,
      canvasCss: {},
      showLoading: false,
      chartArrs: [],
      chartData: [],
      chartStyle: {},
    };
  },

  computed: {
    ...mapState('project', ['projectId', 'worksheetTypes']),
  },
  methods: {
    ...mapMutations('drawingboard', ['setFontColor', 'setViewMode']),
    /**
     *初始化数据
     */
    initData (name) {
      let res = this.currentCanvasDetail;
      if (!res) return;
      this.resetData();
      if (res.features) {
        this.initCapsuleData(res.features, name);
      }
      this.canvasCss = res.css || {};

      this.setViewMode(this.canvasCss.mode || 'full');

      this.initWidthHeight();

      this.shakeDrawChart();

      this.$set(
        this.chartStyle,
        'id',
        `mc_${this.canvasType}_${this.currentCanvasDetail.worksheet_id}`
      );
    },
    async fetchDataProcess (param) {
      let type =
        this.canvasType.slice(0, 1).toUpperCase() + this.canvasType.slice(1);
      const detail = this.currentCanvasDetail;
      let featureData = await this.fetchFeatureData(param).finally(() => {
        this.showLoading = false;
      });

      this.showLoading = false;
      if (!detail || !featureData) {
        this.showChartTip = true;
        sessionStorage.removeItem(`mc${type}Chart`);
        return {};
      }
      this.showChartTip = false;
      return JSON.parse(JSON.stringify(featureData));
    },

    // 获取绘图数据
    async fetchFeatureData (param) {
      if (!param) {
        param = {
          limit: 9999,
          offset: 0,
          project_id: this.projectId,
          worksheet_id: this.currentCanvasDetail.worksheet_id,
          dashboard_id: this.dashboardId,
          features: this.canvasFeatures,
        };
      }
      Object.assign(param, this.retRowColCount());

      this.saveData('features', this.canvasFeatures);

      let dataRes = await post('reviseCanvasFeature', param);

      return dataRes && dataRes.features_data;
    },
    // 画图
    async drawChart (param) {
      let type =
        this.canvasType.slice(0, 1).toUpperCase() + this.canvasType.slice(1);
      this.showLoading = true;
      let newData = await this.fetchDataProcess(param);
      if (!newData || !newData.length) {
        this.showLoading = false;
        this.showChartTip = true;
        sessionStorage.removeItem(`mc${type}Chart`);
        return;
      }
      this.chartData = newData || [];
      this.chartArrs = getChatArr(
        this.canvasType,
        this.currentCanvasDetail.worksheet_id
      );

      sessionStorage.setItem(`mc${type}Chart`, JSON.stringify(this.chartArrs));
      this.setChartArrys(this.chartArrs);

      this.drawCanvas();
    },

    retRowColCount () {
      let obj = {
        // nrows: 1000,
        n: 1000,
      };
      if (this.canvasType !== 'scatter') {
        obj.nrows = 1000;
      }
      let data_setting = this.canvasCss.data_setting;
      if (data_setting && data_setting.length > 0) {
        let match = data_setting.find((i) => i.selected);
        if (match) {
          if (match.values) {
            if (this.canvasType !== 'scatter') {
              obj.nrows = match.values[0].val;
            }

            obj.n = obj.nrows;
          } else if (match.content && typeof match.content === 'object') {
            if (this.canvasType !== 'scatter') {
              obj.nrows = match.content[0].val;
            }
            obj.n = obj.nrows;
          }
        }
        return obj;
      }
      return obj;
    },

    initWidthHeight () {
      let { chartSize: chart_size } = getSize(
        this.$refs.chartMain,
        this.viewMode || 'full',
        [1],
        true
      );
      this.$set(this.chartStyle, 'width', chart_size.width);
      this.$set(this.chartStyle, 'height', chart_size.height);
    },

    resetData () {
      this.setLabelsCapsuleList([]);
      this.setColorCapsuleList([]);
      this.setSizeCapsuleList([]);
      this.canvasFeatures = {};
      this.canvasCss = {};
      this.chartArrs = [];
      this.chartStyle = {};
      this.chartData = [];
    },

    drawCanvas () {
      // 初始化图表样式
      typeof this.initShape === 'function' && this.initShape();
      // 初始化数据设置
      this.initDataSetting();
      // 初始化 画布颜色
      this.initBgCss();

      let chartStyle = drawFunObj[this.canvasType]({
        featureList: this.canvasFeatures,
        canvasCss: this.canvasCss, // 画布CSS
        chartType: this.canvasType,
      });
      let dom = document.getElementById(
        `mc_${this.canvasType}_${this.currentCanvasDetail.worksheet_id}`
      );
      if (dom) {
        dom.innerHTML = '';
      }
      Object.assign(this.chartStyle, chartStyle);

      this.$refs[`${this.canvasType}Chart`].draw();

      this.initChartStyle();
    },

    // 初始化图表数据
    initChartStyle () {
      this.$nextTick(() => {
        this.colorList =
          this.$refs[`${this.canvasType}Chart`].getColorList() || [];

        this.$set(this.canvasCss, 'colorList', this.colorList);

        this.initTooltipList();

        this.initLabelsList();

        typeof this.initOtherConfig === 'function' && this.initOtherConfig();

        this.saveData('css', this.canvasCss);
      });
    },
  },
};
