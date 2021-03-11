<template>
  <layout>
    <template #default>
      <div class="dashboard-features">
        <dc-column class="dc-column"
                   @change="changeColumnList"></dc-column>
        <dc-row class="dc-row"
                @change="changeRowList"></dc-row>
        <!-- 颜色标签改变特征时，同样会触发changeRowList -->
        <color-label @change-style="changeLabelStyle"></color-label>
      </div>
      <div class="chart-bg" :class="'chart-background'" ref="chartMain">
        <bg-color :bgColor="canvasCss.bgCss"></bg-color>
        <dashboard-title :title="currentCanvasDetail.worksheet_title" :canvasCss="canvasCss" />
        <chart-empty iconName="#icon-db_chartBar" v-if="isEmptyChartTip" />
        <mc-chart
          class="chart-panel"
          :chartArrs="chartArrs"
          :showLoading="isLoading"
          :showScaleAxis="canvasCss.selectFromChart"
          @zoom="zoomAxis"
        ></mc-chart>
      </div>
    </template>
    <template #right-data>
      <data-color  :colorList="colorList"  @on-range-change="onRangeChange"  @change="changeDataColor" :showFillFlag="false"
                    @on-template-change="changeTemplate" @on-cat-color-change="changeCatColor"></data-color>
      <shape-and-size  :list="columnList" :radiusObj="radiusObj" :shapeList="shapeList" @changeShape="changeShape" @change="changeSize"></shape-and-size>
      <data-setting :dataSetting="dataSetting"
                    @on-canvasCss-change="changeSetting"></data-setting>
    </template>
    <template #right-canvas>
      <view-setting v-model="canvasCss.dashboard_viewMode" @change="drawChart"></view-setting>
      <axis-setting :axis-style="canvasCss.axis_style" @change="changeAxis" @combined="combinedHandler"></axis-setting>
      <scale-and-grid :axis-style="canvasCss.axis_style" :has-unit="canvasCss.hasUnit" @changeUnit="changeUnit"
                      @changeGrid="changeGrid" @changeScale="changeScale" @changeScope="changeScope"></scale-and-grid>
      <tooltip-setting :tooltip-data="tooltipData" @change="changeTooltip"></tooltip-setting>
      <canvas-color :bgCss="canvasCss.bgCss" :titleCss="canvasCss.titleCss"
                    @change="changeBg" @changeTitle="changeTitleFont"></canvas-color>
    </template>
  </layout>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

import { isNoData } from '@/utils/utils';
import { getDataChartList } from '@/utils/draw.js';
import { drawBarRotated, initBarRotatedCss, setBarRotatedTooltip } from '@/utils/draw/drawBarRotated';
import { getBaseConfig } from '@/utils/draw/baseConfig.js';

import { getSize } from '../utils/canvasStyle.js';
import { rightDataMix } from './mixins/rightData.js';
import { rightCanvasMix } from './mixins/rightCanvas.js';
import { middleMix } from './mixins/middleMixin.js';

// 中间栏这一块的组件
import DcColumn from '../middle/column.vue';
import DcRow from '../middle/row.vue';
import ColorLabel from '../middle/colorLabel.vue';
import BgColor from '../middle/bgColor.vue';
import dashboardTitle from '../middle/dashboardTitle.vue';
import layout from '../middle/chartsLayout.vue';
import McChart from '@/components/dcChart/mcChart.vue';

import { initToolTipStyle } from '../middle/utils/canvas.js';
import { setRow, setCol } from '../middle/utils/initRowAndCol.js';
import { setColumnParam, setRowParam } from '../middle/utils/setParam.js';

// 右边栏
import ShapeAndSize from '../right/data/shapeAndSize.vue';
import DataColor from '../right/data/dataColor.vue';
import DataSetting from '../right/data/dataSetting.vue';
import ViewSetting from '../right/canvas/viewSetting.vue';
import AxisSetting from '../right/canvas/axisSetting.vue';
import ScaleAndGrid from '../right/canvas/scaleAndGrid.vue';
import TooltipSetting from '../right/canvas/tooltipSetting.vue';
import CanvasColor from '../right/canvas/canvasColor.vue';

export default {
  mixins: [rightDataMix, rightCanvasMix, middleMix],
  components: {
    layout,
    dashboardTitle,
    BgColor,
    DcColumn,
    DcRow,
    ColorLabel,
    McChart,
    DataColor,
    ViewSetting,
    DataSetting,
    AxisSetting,
    ScaleAndGrid,
    TooltipSetting,
    CanvasColor,
    ShapeAndSize
  },
  data () {
    return {
      timer: null,
      chartArrs: [],
      canvasFeatures: {}, // 画布请求特征参数
      canvasCss: {}, // 存储画布样式
      isEmptyChartTip: false, // 画布是否空数据
      isLoading: false, // 请求画布时显示loading
      tooltipData: [], // 提示框信息
      colorList: [], // 数据颜色
      shapeList: [],
      dataKey: '', // 用来取画布数据用的key
      dataSetting: [], // 数据设置
      defaultSetting: 1000, // 默认数据设置
      defaultDataSetting: [{
        title: this.$t('dashboard.default_data'),
        content: '默认显示前1000行',
        selected: true,
        values: [{
          val: 1000
        }]
      },
      {
        title: this.$t('dashboard.all_data'),
        content: this.$t('dashboard.table_all_data_tip'),
        selected: false,
        values: [{
          val: null
        }, {
          val: null
        }]
      },
      {
        title: this.$t('dashboard.custom_data'),
        selected: false,
        content: [{
          val: 1000,
          unit: this.$t('dashboard.rows'),
          disabled: true
        }]
      }], // 数据设置选项
      radiusObj: {
        text: '大小',
        size: 50,
        textObj: {
          left: '细',
          right: '粗',
        }
      } // 柱子粗细
    };
  },
  computed: {
    ...mapState('project', ['projectId', 'chartDataMap']),
    ...mapState('drawingboard', ['columnList', 'rowList', 'currentCanvasDetail']),
    ...mapState('drawingboard', ['canvasType', 'catList', 'aggrList', 'viewMode']),
  },
  beforeDestroy () {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  },
  methods: {
    ...mapMutations('drawingboard', ['setRowList', 'setColumnList', 'setViewMode', 'setChartArrys']),
    ...mapMutations('project', ['setChartDataMap']),
    initData (name) {
      this.chartArrs = [];
      // 初始化特征参数
      if (this.currentCanvasDetail.features) {
        // 条形图中column跟row以及x跟y调转
        let colList = setRow(this.currentCanvasDetail.features.x, this.catList, this.aggrList, this.canvasType);
        this.setColumnList(this.filterList(colList, name));
        let rowList = setCol(this.currentCanvasDetail.features.y, this.catList);
        this.setRowList(this.filterList(rowList, name));
      }
      // 初始化样式
      const resCss = this.currentCanvasDetail.css || {};
      this.canvasCss = {
        selectFromChart: false,
        ...JSON.parse(JSON.stringify(resCss)),
        worksheetId: this.currentCanvasDetail.worksheet_id
      };
      // 初始化数据设置
      if (this.canvasCss.data_setting) {
        this.defaultSetting = this.getDefaulstSetting(this.canvasCss.data_setting);
      }
      // 初始化画布视图
      this.setViewMode(this.canvasCss.dashboard_viewMode || 'fitWidth');
    },
    changeColumnList (list) {
      // 条形图cloumn跟row、x跟y调转,
      this.$set(this.canvasFeatures, 'x', []);
      this.$set(this.canvasFeatures, 'x', setRowParam(list));
      this.delayFunc();
    },
    changeRowList (list) {
      // 条形图cloumn跟row、x跟y调转
      this.$set(this.canvasFeatures, 'y', []);
      this.$set(this.canvasFeatures, 'y', setColumnParam(list));
      this.delayFunc();
    },
    changeLabelStyle (labelList, textSettings, flag) {
      this.$set(this.canvasCss, 'labelList', labelList);
      this.$set(this.canvasCss, 'textSettings', textSettings);
      if (!flag) {
        this.setTooltipForStyle(labelList, textSettings);
        this.changeTooltip(this.tooltipData);
      }
    },
    setChartStyle () {
      this.isLoading = false;
      // 设置画布样式
      this.$set(this.canvasCss, 'axis_style', initBarRotatedCss(this.canvasFeatures, this.canvasCss.axis_style, this.aggrList, this.canvasCss.titleCss));
      // 获取tooltip数据，设置tooltip样式
      let tooltipList = setBarRotatedTooltip(this.canvasFeatures, this.aggrList);
      this.tooltipData = initToolTipStyle(tooltipList, this.canvasCss.tooltipFormat, this.canvasCss.tooltipNumberFormat, this.canvasCss.tooltipTextFormat);
      this.dataSettingInit();
      this.drawChart();
    },
    async drawChart () {
      let featureData = this.chartDataMap[this.dataKey] || []; // 当前图表的数据
      let newData = getDataChartList({
        data: featureData,
        chart_type: this.canvasType,
        canvasCss: JSON.parse(JSON.stringify(this.canvasCss)),
        id: this.worksheetId,
        feature_list: JSON.parse(JSON.stringify(this.canvasFeatures))
      });
      featureData = newData.data;
      this.chartArrs = newData.chartArrs || [];
      this.setChartArrys(this.chartArrs);
      await this.$nextTick();
      let { chartSize, containerSize } = getSize(this.$refs.chartMain, this.viewMode, this.chartArrs, false, this.canvasType);
      this.isEmptyChartTip = false;
      if (isNoData(featureData, this.canvasType)) {
        this.chartArrs = [];
        this.isEmptyChartTip = true;
        sessionStorage.removeItem('mcBarRotatedChart');
      } else {
        sessionStorage.setItem('mcBarRotatedChart', JSON.stringify(this.chartArrs));
      }
      let baseConfig = getBaseConfig(this.canvasCss); // 画图表基础参数
      let configObj = {
        baseConfig,
        featureData,
        canvasCss: JSON.parse(JSON.stringify(this.canvasCss)),
        canvasFeatures: JSON.parse(JSON.stringify(this.canvasFeatures)),
        containerSize,
        chartSize,
        chartArr: this.chartArrs,
        aggrList: this.aggrList
      };
      if (!this.canvasCss.dashboard_viewMode) {
        this.$set(this.canvasCss, 'dashboard_viewMode', 'fitWidth');
      };
      this.saveCss();
      let chartIns = drawBarRotated(configObj);
      this.colorList = [];
      this.shapeList = [];
      if (!chartIns) return;
      for (let i = 0; i < chartIns.length; i++) {
        this.getChartStyle(chartIns[i], i);
      }
    }
  },
};
</script>

<style lang="scss" scoped>
@import './scss/index.scss';
</style>
