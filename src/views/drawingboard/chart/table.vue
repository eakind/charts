<template>
  <layout>
    <template #default>
      <div class="dashboard-features">
        <dc-column
          class="dc-column"
          @change="changeColumnList"
          @modify-label-format="changeLabelFormat"
        ></dc-column>
        <dc-row
          class="dc-row"
          @change="changeRowList"
          @modify-label-format="changeLabelFormat"
        ></dc-row>

        <div class="flex">
          <color-size-label
            capsuleType="color"
            class="color"
          ></color-size-label>
          <color-size-label
            capsuleType="labels"
            @modify-label-format="changeLabelFormat"
            class="labels"
            :totalList="labelsCapsuleList"
            :isCollapse="true"
          ></color-size-label>
        </div>
      </div>
      <div class="chart-bg" ref="chartMain">
        <bg-color :bgColor="canvasCss.bgCss"></bg-color>
        <dashboard-title
          :title="currentCanvasDetail.worksheet_title"
          :canvasCss="canvasCss"
        />
        <chart-empty v-if="showChartTip" iconName="#icon-db_chartTable" />
        <mc-chart
          class="chart-panel"
          v-else
          chartType="table"
          :chartStyle="canvasConfig"
          :chartData="jsonData"
          ref="tableChart"
        ></mc-chart>
      </div>
    </template>
    <template #right-data>
      <data-color
        @on-template-change="dataTempChangeProcess"
        @on-range-change="rangeProcess"
        :showColorRangeFlag="true"
        :showFillFlag="false"
        :colorList="color_list"
        @change="dataColorProcess"
      ></data-color>
      <data-setting
        :dataSetting="dataSetting"
        @on-canvasCss-change="updateCanvasCss"
      ></data-setting>
    </template>
    <template #right-canvas>
      <view-setting
        v-model="canvasCss.dashboard_viewMode"
        @change="modeChange"
      ></view-setting>
      <table-head-setting
        :tableTitleData="table_title_list"
        @on-canvasCss-change="updateCanvasCss"
      ></table-head-setting>
      <table-cell-setting
        :tableSetting="tableCellSetting"
        @on-canvasCss-change="updateCanvasCss"
      ></table-cell-setting>
      <canvas-color
        :bgCss="canvasCss.bgCss"
        :titleCss="canvasCss.titleCss"
        @change="updateCanvasCss('bgCss', $event)"
        @changeTitle="titleStyleProcess"
      ></canvas-color>
      <tooltip-setting
        :tooltipData="tooltip_list"
        @change="updateCanvasCss('tooltipFormat', $event)"
      ></tooltip-setting>
    </template>
  </layout>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

import layout from '../middle/chartsLayout.vue';
import dashboardTitle from '../middle/dashboardTitle.vue';
import bgColor from '../middle/bgColor.vue';
import mcChart from '@/components/dcCharts/index.vue';

import { getDataChartList } from '@/utils/draw';
import { drawTable } from '@/utils/draw/drawTable';

// 右边栏相关方法 组件
import { tableRight } from './mixins/tableRight.js';

// 胶囊
import DcColumn from '../middle/column.vue';
import DcRow from '../middle/row.vue';
import colorSizeLabel from '../middle/colorSizeLabel.vue';
import { modifyTableCanvasFeature } from '@/utils/postParam.js';

import capsuleMixin from '../middle/mixins/capsule.js';
// // 一些右边栏公共的东西，比如默认的属性什么的 保存css
// import middleMix from '../middle/mixins/index';
import { post } from '@/api/server';
import { getSize } from '../utils/canvasStyle';
import { isObject } from '@/utils/check.js';

export default {
  components: {
    layout,
    dashboardTitle,
    bgColor,
    mcChart,
    DcColumn,
    DcRow,
    colorSizeLabel,
  },
  mixins: [tableRight, capsuleMixin],
  data () {
    return {
      canvasCss: {},
      canvasFeatures: {},
      chartName: '',
      changeTitle: false,
      showChartTip: false,
      chartArrs: [],
      mc_insts: [],
      showLoading: false,
      changeColorSizeRanges: false,
      showMark: false,
      jsonData: [],
      timerFeature: null,
      canvasConfig: {}
    };
  },
  computed: {
    ...mapState('project', ['chartDataMap', 'projectId']),
    ...mapState('drawingboard', [
      'canvasType',
      'fontColor',
      'catList',
      'aggrList',
    ]),
    ...mapState('drawingboard', [
      'colorCapsuleList',
      'labelsCapsuleList',
      'currentCanvasDetail',
    ]),
    ...mapState({ dashboard_viewMode: (state) => state.drawingboard.viewMode }),
  },
  beforeDestroy () {
    this.bus.$off('capsuleChange');
  },
  mounted () {
    this.bus.$off('capsuleChange');
    this.bus.$on('capsuleChange', (type, list) => {
      this.resetCanvasFeature(type, list, modifyTableCanvasFeature, true);
      this.shakeDrawChart();
    });
  },
  methods: {
    ...mapMutations('drawingboard', [
      'setFontColor',
      'setChartFormat',
      'setChartConfig',
      'setColorCapsuleList',
      'setLabelsCapsuleList',
      'setViewMode',
      'setChartArrys',
    ]),
    ...mapMutations('project', ['setChartDataMap']),
    ...mapMutations('drawingboard', {
      setColCapsuleList: 'setColumnList',
      setRowCapsuleList: 'setRowList',
    }),
    initData (name) {
      this.resetData();
      let res = this.currentCanvasDetail;
      if (!res) return;
      if (res.features) {
        this.initCapsuleData(
          JSON.parse(JSON.stringify(res.features)),
          name,
          true
        );
      }

      this.canvasCss = res.css || {};
      this.canvasCss.mode = this.dashboard_viewMode;
      this.setViewMode(this.canvasCss.dashboard_viewMode || 'standard');

      this.$set(
        this.canvasConfig,
        'id',
        `mc_${this.canvasType}_${this.currentCanvasDetail.worksheet_id}`
      );
    },
    // 表格右边栏
    updateCanvasCss (type, value, drawFlag) {
      this.$set(this.canvasCss, type, value);
      typeof this[type + 'Process'] === 'function' && this[type + 'Process']();
      // 是否需要请求
      drawFlag ? this.mediaProcessBeforeDraw() : this.drawCanvas({});
    },
    mediaProcessBeforeDraw () {
      this.drawChart();
    },
    modeChange () {
      this.canvasCss.mode = this.dashboard_viewMode;
      this.drawChart();
    },
    resetData () {
      this.setColCapsuleList([]);
      this.setRowCapsuleList([]);
      this.setColorCapsuleList([]);
      this.setLabelsCapsuleList([]);
      this.canvasFeatures = {};
      this.canvasCss = {};
      this.chartName = '';
      this.chartArrs = [];
      this.mc_insts = [];
      this.configs = [];
    },
    changeColumnList (list) {
      this.resetCanvasFeature('col', list, modifyTableCanvasFeature, true);
      this.shakeDrawChart();
    },
    changeRowList (list) {
      this.resetCanvasFeature('row', list, modifyTableCanvasFeature, true);
      this.shakeDrawChart();
    },
    updateCSS (css) {
      // 记住视图
      this.setViewMode(css.dashboard_viewMode || 'standard');
    },
    clearCanvas () {
      this.chartArrs = [];
      this.mc_insts = [];
      this.canvasCss.check = [];
      this.canvasCss.range = [];
      this.canvasCss.val = [];
    },
    async drawChart (param) {
      this.clearCanvas();
      this.showLoading = true;
      const detail = this.currentCanvasDetail;
      let featureData = await this.getFeaturesData(param).finally(() => {
        this.showLoading = false;
      });
      // let key = getChartKey(this.canvasFeatures, this.worksheetId, 'table');
      // console.log(key);
      // if (this.requestFlag || this.chartDataMap[key] === undefined) {
      //   featureData = await this.getFeaturesData(param)
      //     .finally(() => { this.showLoading = false; });
      //   this.chartDataMap[key] = featureData;
      //   this.setChartDataMap(this.chartDataMap);
      // } else {
      //   featureData = this.chartDataMap[key] || [];
      // }
      this.showLoading = false;
      if (!detail || !featureData) {
        this.showChartTip = true;
        sessionStorage.removeItem('mcTableChart');
        return;
      }
      this.showChartTip = false;
      // 获取画图所需的数据和页面元素
      let data = null;
      let newData = getDataChartList({
        data: featureData,
        chart_type: this.canvasType,
        canvasCss: detail.css ? JSON.parse(JSON.stringify(detail.css)) : {},
        id: detail.worksheet_id,
        feature_list: this.canvasFeatures, // JSON.parse(JSON.stringify(detail.features)),
      });
      data = newData.data;
      this.chartArrs = newData.chartArrs;
      sessionStorage.setItem('mcTableChart', JSON.stringify(this.chartArrs));
      this.setChartArrys(this.chartArrs);
      await this.$nextTick();
      let { chartSize: chart_size, containerSize: container_size } = getSize(
        this.$refs.chartMain,
        this.dashboard_viewMode,
        this.chartArrs,
        false
      );
      this.canvasCss.mode = this.dashboard_viewMode;
      this.jsonData = data;
      let { chartIns, tableTitleList, tooltipList, styles, baseConfig } = drawTable({
        data: this.jsonData,
        featureList: this.canvasFeatures,
        canvasCss: this.canvasCss, // 画布CSS
        ids: this.chartArrs.map((d) => d.id), // 根据ID找到图表的DOM载体
        chartSize: chart_size, // 图表的大小，格式为{width: 1080, height: 480}，可不提供
        containerSize: container_size, // 可滚动时候提供外div的宽高
      });
      this.canvasConfig = Object.assign(this.canvasConfig, baseConfig);
      this.$refs[`${this.canvasType}Chart`].draw();
      if (!isObject(chartIns)) {
        this.chartArrs = [];
        return;
      } else {
        // this.dataProcessAfterDraw(ins);
        this.table_title_list = JSON.parse(JSON.stringify(tableTitleList));
        this.tooltip_list = tooltipList;
        this.curStyle = styles;
        this.initTableConfig();
      }
      this.saveData('css', this.canvasCss);
    },
    dataProcessAfterDraw (ins) {
      this.configs = ins.configs;
      this.configs.forEach((c) => {
        c.config.table.mode = this.dashboard_viewMode;
      });

      this.setChartConfig(ins);
      // 初始化表格数据
      this.initTableConfig();
    },
    // 获取绘图数据
    async getFeaturesData (param) {
      param = {
        project_id: this.projectId,
        worksheet_id: this.currentCanvasDetail.worksheet_id,
        dashboard_id: this.dashboardId,
        features: this.canvasFeatures,
      };
      console.log(this.canvasFeatures, '*****************');
      Object.assign(param, this.retRowColCount());
      this.saveData('features', this.canvasFeatures);
      let dataRes = await post('reviseCanvasFeature', param);
      return dataRes && dataRes.features_data;
    },
    retRowColCount () {
      let obj = {
        nrows: 1000,
        ncols: 100,
        n: 1000,
      };
      let data_setting = this.canvasCss.data_setting;
      if (data_setting && data_setting.length > 0) {
        let match = data_setting.find((i) => i.selected);
        if (match) {
          if (match.values) {
            obj.nrows = match.values[1].val;
            obj.ncols = match.values[0].val;
            obj.n = obj.nrows;
          } else if (match.content && typeof match.content === 'object') {
            obj.nrows = match.content[1].val;
            obj.ncols = match.content[0].val;
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
<style scoped lang="scss">
@import './scss/index.scss';
.bg-color {
  z-index: 0;
}
.flex {
  position: relative;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  min-height: 40px;
  margin-bottom: 8px;
  .dc-color-size-label {
    width: calc(50% - 8px);
  }
  .dc-color-size-label + .dc-color-size-label {
    margin-left: 16px;
  }
}

.dc-color-size-label.labels {
  position: absolute;
  right: 0px;
  top: 0;
  z-index: 1;
  box-shadow: 0 6px 14px 0 rgba(0, 0, 0, 0.1);
}
.dc-color-size-label.color {
  position: absolute;
  left: 0px;
  top: 0;
  z-index: 2;
  box-shadow: 0 6px 14px 0 rgba(0, 0, 0, 0.1);
}
</style>
