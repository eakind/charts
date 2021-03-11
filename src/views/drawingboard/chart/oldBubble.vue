<template>
  <layout>
    <template #default>
      <div class="dashboard-features">
           <color-size-label capsuleType='size'></color-size-label>
        <color-size-label capsuleType='color' ></color-size-label>
        <color-size-label capsuleType='labels' @modify-label-format="changeLabelFormat"></color-size-label>
      </div>
      <div class="chart-bg" ref="chartMain">
        <bg-color :bgColor="canvasCss.bgCss"></bg-color>
        <dashboard-title :title="currentCanvasDetail.worksheet_title"
                         :canvasCss="canvasCss" />
        <chart-empty v-if="showChartTip" iconName="#icon-db_chartBubble" />
        <mc-chart v-else class="chart-panel"
                  :chartArrs="chartArrs"
                  :showLoading="showLoading"
                  :showScaleAxis="false"></mc-chart>
      </div>
    </template>
    <template #right-data>
      <data-color @on-range-change="rangeProcess"
                  @on-cat-color-change="catColorProcess"
                  :setFlag="false"
                  :showColorRangeFlag="true"
                  :showFillFlag="false"
                  :colorList="colorList"
                  @on-template-change="dataTempChangeProcess"
                  @change="dataColorProcess"></data-color>
      <chart-style :shapeObj="shapeObj" :radiusObj="radiusObj" @change="chartStyleProcess"></chart-style>
      <data-setting :dataSetting="dataSetting"
                    @on-canvasCss-change="updateCanvasCss"></data-setting>
    </template>
    <template #right-canvas>
      <canvas-color :bgCss="canvasCss.bgCss"
                    :titleCss="canvasCss.titleCss"
                    @change="updateCanvasCss('bgCss',$event)"
                    @changeTitle="titleStyleProcess"></canvas-color>
      <tooltip-setting :tooltipData="tooltipList"
                       @change="updateCanvasCss('tooltipFormat',$event)"></tooltip-setting>
    </template>
  </layout>
</template>
<script>
import layout from '../middle/chartsLayout';
import mcChart from '@/components/dcChart/mcChart';
import dashboardTitle from '../middle/dashboardTitle';
import bgColor from '../middle/bgColor';

import { bubbleRight } from './mixins/bubbleRight.js';
// 一些右边栏公共的东西，比如默认的属性什么的 保存css
import middleMix from '../middle/mixins/index';

import { post } from '@/api/server';
import { getDataChartList } from '@/utils/draw';
import { getSize } from '../utils/canvasStyle';
import { isObject } from '@/utils/check.js';
import { drawBubble } from '@/utils/draw/drawBubble';
import { getChartKey } from '../middle/utils/index.js';

// 胶囊
import colorSizeLabel from '../middle/colorSizeLabel.vue';
import { modifyBubbleCanvasFeature } from '@/utils/postParam.js';
import capsuleMixin from '../middle/mixins/capsule.js';
import { mapState, mapMutations } from 'vuex';
export default {
  components: { layout, dashboardTitle, bgColor, mcChart, colorSizeLabel },
  mixins: [bubbleRight, middleMix, capsuleMixin],
  data () {
    return {
      canvasFeatures: {},
      showChartTip: false,
      canvasCss: {},
      showLoading: false,
      jsonData: [],
      chartArrs: [],
      requestFlag: false,
      timer: null,
      timerFeature: null
    };
  },
  computed: {
    ...mapState('project', ['projectId', 'worksheetTypes', 'chartDataMap']),
    ...mapState('drawingboard', ['fontColor', 'catList', 'aggrList']),
    ...mapState('drawingboard', ['colorCapsuleList', 'labelsCapsuleList', 'sizeCapsuleList', 'currentCanvasDetail']),
  },
  beforeDestroy () {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.timerFeature) {
      clearTimeout(this.timerFeature);
      this.timerFeature = null;
    }
    this.bus.$off('capsuleChange');
  },
  mounted () {
    this.bus.$off('capsuleChange');
    this.bus.$on('capsuleChange', (type, list) => {
      this.resetCanvasFeature(type, list, modifyBubbleCanvasFeature);
      this.shakeDrawChart();
    });
    // this.initData();
    // this.shakeDrawChart();
  },
  methods: {
    ...mapMutations('drawingboard', [
      'setFontColor',
      'setChartFormat',
      'setChartConfig',
      'setViewMode'
    ]),
    ...mapMutations('project', ['setChartDataMap']),
    ...mapMutations('drawingboard', ['setColorCapsuleList', 'setLabelsCapsuleList', 'setSizeCapsuleList', 'setChartArrys']),
    updateCanvasCss (type, value, drawFlag) {
      this.$set(this.canvasCss, type, value);
      typeof this[type + 'Process'] === 'function' && this[type + 'Process']();
      // 是否需要请求
      drawFlag ? this.mediaProcessBeforeDraw() : this.drawCanvas({});
    },
    mediaProcessBeforeDraw () {
      this.requestFlag = true;
      this.drawChart();
    },
    resetData () {
      this.canvasCss = {};
      this.chartName = '';
      this.chartArrs = [];
      this.canvasFeatures = {};
      this.setLabelsCapsuleList([]);
      this.setColorCapsuleList([]);
      this.setSizeCapsuleList([]);
    },
    /**
       *初始化数据
    */
    initData (name) {
      this.resetData();
      let res = this.currentCanvasDetail;// JSON.parse(sessionStorage.getItem(this.worksheetId));
      if (!res) return;
      if (res.features) {
        this.initCapsuleData(res.features, name);
      }
      // this.canvasFeatures = JSON.parse(JSON.stringify(res.features)) || {};
      this.canvasCss = res.css || {};
      this.setViewMode(this.canvasCss.mode);
      if (this.timerFeature) {
        clearTimeout(this.timerFeature);
        this.timerFeature = null;
      }
      this.shakeDrawChart();
    },

    // 获取绘图数据
    async fetchFeatureData (param, detail) {
      if (!param) {
        param = {
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
    async fetchDataProcess (param) {
      const detail = this.currentCanvasDetail;// JSON.parse(sessionStorage.getItem(this.worksheetId));

      let featureData = [];

      let key = getChartKey(this.canvasFeatures, this.currentCanvasDetail.worksheet_id, 'bubble');
      if (this.requestFlag || this.chartDataMap[key] === undefined) {
        featureData = await this.fetchFeatureData(param, detail)
          .finally(() => { this.showLoading = false; });
        this.chartDataMap[key] = featureData;
        this.setChartDataMap(this.chartDataMap);
      } else {
        featureData = this.chartDataMap[key] || [];
      }
      this.requestFlag = false;
      this.showLoading = false;
      if (!detail || !featureData) {
        this.showChartTip = true;
        sessionStorage.removeItem('mcBubbleChart');
        return {};
      }
      this.showChartTip = false;
      // 获取画图所需的数据和页面元素
      let newData = getDataChartList({
        data: featureData,
        chart_type: 'bubble',
        canvasCss: detail.css
          ? JSON.parse(JSON.stringify(detail.css))
          : {},
        id: detail.worksheet_id,
        feature_list: JSON.parse(JSON.stringify(detail.features))
      });
      return newData;
    },
    // 画图
    async drawChart (param) {
      this.showLoading = true;
      let newData = await this.fetchDataProcess(param);
      if (!newData.data) {
        return;
      }
      this.jsonData = newData.data || [];
      this.chartArrs = newData.chartArrs;
      sessionStorage.setItem('mcBubbleChart', JSON.stringify(this.chartArrs));
      this.setChartArrys(this.chartArrs);
      await this.$nextTick();
      let { chartSize: chart_size, containerSize: container_size } = getSize(this.$refs.chartMain, 'full', this.chartArrs, true);

      let {
        ins,
        tooltipList,
        styles
      } = drawBubble({
        data: this.jsonData,
        featureList: this.canvasFeatures,
        canvasCss: this.canvasCss, // 画布CSS
        ids: this.chartArrs.map(d => d.id), // 根据ID找到图表的DOM载体
        chartSize: chart_size, // 图表的大小，格式为{width: 1080, height: 480}，可不提供
        containerSize: container_size, // 可滚动时候提供外div的宽高
      });
      if (!isObject(ins)) {
        this.chartArrs = [];
        return;
      } else {
        this.curStyle = styles;
        this.tooltipList = tooltipList;
        this.initPieConfig();
      }
      this.saveData('css', this.canvasCss);
    },
    retRowColCount () {
      let obj = {
        nrows: 1000,
        // ncols: 100,
        n: 1000
      };
      let data_setting = this.canvasCss.data_setting;
      if (data_setting && data_setting.length > 0) {
        let match = data_setting.find(i => i.selected);
        if (match) {
          if (match.values) {
            obj.nrows = match.values[0].val;
            obj.n = obj.nrows;
          } else if (match.content && typeof match.content === 'object') {
            obj.nrows = match.content[0].val;
            obj.n = obj.nrows;
          }
        }
        return obj;
      }
      return obj;
    },
  }
};
</script>
<style lang="scss" scoped>
@import './scss/index.scss';
.bg-color{
  z-index: 0;
}
.dc-color-size-label + .dc-color-size-label {
  margin: 8px 0;
}
</style>
