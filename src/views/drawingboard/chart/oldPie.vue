<template>
  <layout>
    <template #default>
      <div class="dashboard-features">
        <color-size-label capsuleType="size"></color-size-label>
        <color-size-label capsuleType="color"></color-size-label>
        <color-size-label
          capsuleType="labels"
          @modify-label-format="changeLabelFormat"
          @change-percent="changePercent"
        ></color-size-label>
      </div>
      <div class="chart-bg" ref="chartMain">
        <bg-color
          :bgColor="canvasCss.bgCss"
          :titleCss="canvasCss.titleCss"
        ></bg-color>
        <dashboard-title
          :title="currentCanvasDetail.worksheet_title"
          :canvasCss="canvasCss"
        />
        <chart-empty v-if="showChartTip" iconName="#icon-db_chartPie" />
        <mc-chart
          v-else
          class="chart-panel"
          :chartArrs="chartArrs"
          :showLoading="showLoading"
          :showScaleAxis="false"
        ></mc-chart>
      </div>
    </template>
    <template #right-data>
      <data-color
        @on-range-change="rangeProcess"
        @on-cat-color-change="catColorProcess"
        @on-template-change="dataTempChangeProcess"
        :setFlag="false"
        :showColorRangeFlag="true"
        :showFillFlag="false"
        :colorList="colorList"
        @change="dataColorProcess"
      ></data-color>
      <chart-style
        :shapeObj="shapeObj"
        :radiusObj="radiusObj"
        @change="chartStyleProcess"
      ></chart-style>
      <data-setting
        :dataSetting="dataSetting"
        @on-canvasCss-change="updateCanvasCss"
      ></data-setting>
    </template>
    <template #right-canvas>
      <canvas-color
        :bgCss="canvasCss.bgCss"
        :titleCss="canvasCss.titleCss"
        @change="updateCanvasCss('bgCss', $event)"
        @changeTitle="titleStyleProcess"
      ></canvas-color>
      <tooltip-setting
        :tooltipData="tooltipList"
        @change="updateCanvasCss('tooltipFormat', $event)"
      ></tooltip-setting>
    </template>
  </layout>
</template>
<script>
import layout from '../middle/chartsLayout';
import mcChart from '@/components/dcChart/mcChart';
import dashboardTitle from '../middle/dashboardTitle';
import bgColor from '../middle/bgColor';

import { pieRight } from './mixins/pieRight.js';
// 一些右边栏公共的东西，比如默认的属性什么的 保存css
import middleMix from '../middle/mixins/index';

import { post } from '@/api/server';
// import { getDataChartList } from '@/utils/draw';
import { getSize } from '../utils/canvasStyle';
import { isObject } from '@/utils/check.js';
import { drawPie } from '@/utils/draw/drawPie';

// 胶囊
import colorSizeLabel from '../middle/colorSizeLabel.vue';
import {
  modifyPieCanvasFeature,
  getPieDataChartList,
} from '@/utils/postParam.js';
import capsuleMixin from '../middle/mixins/capsule.js';

import { mapState, mapMutations } from 'vuex';
export default {
  components: { layout, dashboardTitle, bgColor, mcChart, colorSizeLabel },
  mixins: [pieRight, middleMix, capsuleMixin],
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
    };
  },
  computed: {
    ...mapState('project', ['projectId', 'worksheetTypes', 'chartDataMap']),
    ...mapState('drawingboard', [
      'fontColor',
      'catList',
      'aggrList',
      'canvasType',
    ]),
    ...mapState('drawingboard', [
      'colorCapsuleList',
      'labelsCapsuleList',
      'sizeCapsuleList',
      'currentCanvasDetail',
    ]),
  },
  destroyed () {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.bus.$off('capsuleChange');
  },
  mounted () {
    this.bus.$off('capsuleChange');
    this.bus.$on('capsuleChange', (type, list, aggrFlag) => {
      if (type === 'size') {
        this.sizeProcess(list, aggrFlag);
      }
      this.resetCanvasFeature(type, list, modifyPieCanvasFeature);
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
      'setViewMode',
      'currentCanvasDetail',
    ]),
    ...mapMutations('project', ['setChartDataMap']),
    ...mapMutations('drawingboard', [
      'setColorCapsuleList',
      'setLabelsCapsuleList',
      'setSizeCapsuleList',
      'setCurrentCanvasDetail',
      'setChartArrys',
    ]),
    //
    sizeProcess (list, aggrFlag) {
      let curList = this.labelsCapsuleList;
      if (aggrFlag) {
        let match = this.labelsCapsuleList.find(
          (i) => i.name === list[0].name && i.legend === list[0].legend
        );
        if (match) {
          let tempList = this.labelsCapsuleList.filter(
            (i) => !(i.name === list[0].name && i.legend === list[0].legend)
          );
          tempList.unshift(match);
          this.resetCanvasFeature('labels', curList, modifyPieCanvasFeature);
          this.setLabelsCapsuleList(curList);
          return;
        }
      }
      let size = this.canvasFeatures.size;
      if (size) {
        curList = this.labelsCapsuleList.filter(
          (i) => !(i.name === size.name && i.legend === size.legend)
        );
      }
      if (list.length > 0) {
        curList.unshift(list[0]);
      } else {
        this.$set(this.currentCanvasDetail.css, 'checked', false);
        this.$set(this.currentCanvasDetail.css, 'originalChecked', false);
        this.$set(this.canvasCss, 'checked', false);
        this.$set(this.canvasCss, 'originalChecked', false);
      }
      this.resetCanvasFeature('labels', curList, modifyPieCanvasFeature);
      this.setLabelsCapsuleList(curList);
    },
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
      this.setLabelsCapsuleList([]);
      this.setColorCapsuleList([]);
      this.setSizeCapsuleList([]);
      this.canvasFeatures = {};
      this.canvasCss = {};
      this.chartArrs = [];
    },
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
      // this.canvasFeatures = JSON.parse(JSON.stringify(res.features)) || {};
      this.canvasCss = res.css || {};
      this.setViewMode(this.canvasCss.mode || 'full');
      this.shakeDrawChart();
    },
    // 获取绘图数据
    async fetchFeatureData (param) {
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
      const detail = this.currentCanvasDetail;
      let featureData = await this.fetchFeatureData(param).finally(() => {
        this.showLoading = false;
      });
      // 暂时去掉
      // let key = getChartKey(this.canvasFeatures, this.worksheetId, 'pie');
      // if (this.requestFlag || this.chartDataMap[key] === undefined) {
      //   featureData = await this.fetchFeatureData(param, detail)
      //     .finally(() => { this.showLoading = false; });
      //   this.chartDataMap[key] = featureData;
      //   this.setChartDataMap(this.chartDataMap);
      // } else {
      //   featureData = this.chartDataMap[key] || [];
      // }
      this.requestFlag = false;
      this.showLoading = false;
      if (!detail || !featureData) {
        this.showChartTip = true;
        sessionStorage.removeItem('mcPieChart');
        return {};
      }
      this.showChartTip = false;
      // 获取画图所需的数据和页面元素
      let newData = getPieDataChartList({
        data: featureData,
        id: detail.worksheet_id,
      });
      return newData;
    },
    // 画图
    async drawChart (param) {
      this.showLoading = true;
      let newData = await this.fetchDataProcess(param);
      if (!newData || !newData.data) {
        this.showLoading = false;
        this.showChartTip = true;
        sessionStorage.removeItem('mcPieChart');
        return;
      }
      this.jsonData = newData.data || [];
      this.chartArrs = newData.chartArrs;
      sessionStorage.setItem('mcPieChart', JSON.stringify(this.chartArrs));
      this.setChartArrys(this.chartArrs);
      await this.$nextTick();
      let { chartSize: chart_size, containerSize: container_size } = getSize(
        this.$refs.chartMain,
        'full',
        this.chartArrs,
        true
      );

      let { ins, tooltipList, styles } = drawPie({
        data: this.jsonData,
        featureList: this.canvasFeatures,
        canvasCss: this.canvasCss, // 画布CSS
        ids: this.chartArrs.map((d) => d.id), // 根据ID找到图表的DOM载体
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
        n: 1000,
      };
      let data_setting = this.canvasCss.data_setting;
      if (data_setting && data_setting.length > 0) {
        let match = data_setting.find((i) => i.selected);
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
  },
};
</script>
<style lang="scss" scoped>
@import './scss/index.scss';
.bg-color {
  z-index: 0;
}
.dc-color-size-label + .dc-color-size-label {
  margin: 8px 0;
}
</style>
