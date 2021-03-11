<template>
  <layout>
    <template #default>
      <div class="dashboard-features">
        <dc-column class="dc-column" @change="changeColumnList"></dc-column>
        <dc-row class="dc-row" @change="changeRowList"></dc-row>
        <!-- 颜色标签改变特征时，同样会触发changeRowList -->
        <color-label @change-style="changeLabelStyle"></color-label>
      </div>
      <div class="chart-bg" ref="chartMain">
        <bg-color :bgColor="canvasCss.bgCss"></bg-color>
        <dashboard-title :title="currentCanvasDetail.worksheet_title"
                         :canvasCss="canvasCss" />
        <chart-empty iconName="#icon-db_chartColumn"
                     v-if="isEmptyChartTip" />
        <mc-chart class="chart-panel"
                  :chartArrs="chartArrs"
                  :showLoading="isLoading"
                  :showScaleAxis="canvasCss.selectFromChart"
                  @zoom="zoomAxis"></mc-chart>
        <!-- <dc-chart
          class="chart-panel"
          :chart-type="canvasType"
          :chart-title="currentCanvasDetail.worksheet_title"
          :chart-style="canvasCss"
          :chart-feature="canvasFeatures"
          :chart-data="canvasData"
        ></dc-chart> -->
      </div>
    </template>
    <template #right-data>
      <data-color
        :colorList="colorList"
        @change="changeDataColor"
        @on-range-change="onRangeChange"
        :showFillFlag="false"
        @on-template-change="changeTemplate"
        @on-cat-color-change="changeCatColor"
      ></data-color>
      <shape-and-size
        :radiusObj="radiusObj"
        :shapeList="shapeList"
        :list="rowList"
        @changeShape="changeShape"
        @change="changeSize"
      ></shape-and-size>
      <data-setting
        :dataSetting="dataSetting"
        @on-canvasCss-change="changeSetting"
      ></data-setting>
    </template>
    <template #right-canvas>
      <view-setting
        v-model="canvasCss.dashboard_viewMode"
        @change="drawChart"
      ></view-setting>
      <axis-setting
        :axis-style="canvasCss.axis_style"
        @change="changeAxis"
        @combined="combinedHandler"
      ></axis-setting>
      <scale-and-grid
        :axis-style="canvasCss.axis_style"
        :has-unit="canvasCss.hasUnit"
        @changeUnit="changeUnit"
        @changeGrid="changeGrid"
        @changeScale="changeScale"
        @changeScope="changeScope"
      ></scale-and-grid>
      <tooltip-setting
        :tooltip-data="tooltipData"
        @change="changeTooltip"
      ></tooltip-setting>
      <canvas-color
        :bgCss="canvasCss.bgCss"
        :titleCss="canvasCss.titleCss"
        @change="changeBg"
        @changeTitle="changeTitleFont"
      ></canvas-color>
    </template>
  </layout>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

import { isNoData } from '@/utils/utils.js';
import { drawBar, initBarCss, setBarTooltip } from '@/utils/draw/drawBar';
import { getBaseConfig } from '@/utils/draw/baseConfig.js';
import { getDataChartList } from '@/utils/draw.js';
import { getSize } from '../utils/canvasStyle';

import { rightDataMix } from './mixins/rightData';
import { rightCanvasMix } from './mixins/rightCanvas.js';
import { middleMix } from './mixins/middleMixin.js';

// 中间栏这一块的组件
import DcColumn from '../middle/column.vue';
import DcRow from '../middle/row.vue';
import ColorLabel from '../middle/colorLabel';
import BgColor from '../middle/bgColor.vue';
import dashboardTitle from '../middle/dashboardTitle.vue';
import layout from '../middle/chartsLayout.vue';
import McChart from '@/components/dcChart/mcChart.vue';

import { initToolTipStyle } from '../middle/utils/canvas.js';
import { setColumnParam, setRowParam } from '../middle/utils/setParam.js';
import { setRow, setCol } from '../middle/utils/initRowAndCol.js';

// 右边栏
import DataColor from '../right/data/dataColor.vue';
import DataSetting from '../right/data/dataSetting.vue';
import ShapeAndSize from '../right/data/shapeAndSize.vue';
import ViewSetting from '../right/canvas/viewSetting.vue';
import AxisSetting from '../right/canvas/axisSetting.vue';
import ScaleAndGrid from '../right/canvas/scaleAndGrid.vue';
import TooltipSetting from '../right/canvas/tooltipSetting.vue';
import CanvasColor from '../right/canvas/canvasColor.vue';

export default {
  components: {
    // DcChart,
    layout,
    dashboardTitle,
    BgColor,
    DcColumn,
    DcRow,
    McChart,
    DataColor,
    ViewSetting,
    DataSetting,
    ShapeAndSize,
    AxisSetting,
    ScaleAndGrid,
    TooltipSetting,
    CanvasColor,
    ColorLabel,
  },
  mixins: [rightDataMix, rightCanvasMix, middleMix],
  data () {
    return {
      timer: null, // 防抖
      canvasData: [],
      chartArrs: [],
      isLoading: false, // 请求画布时是否显示loading
      canvasFeatures: {}, // 画布请求特征参数
      canvasCss: {}, // 存储画布样式
      shapeList: [], // 形状大小
      isEmptyChartTip: false, // 是否是空数据画布
      tooltipData: [], // 提示框信息
      dataKey: '', // 用来取画布数据用的key
      colorList: [], // 数据颜色
      dataSetting: [], // 数据设置
      defaultSetting: 1000, // 默认数据设置
      defaultDataSetting: [
        {
          title: this.$t('dashboard.default_data'),
          content: '默认显示前1000列',
          selected: true,
          values: [
            {
              val: 1000,
            },
          ],
        },
        {
          title: this.$t('dashboard.all_data'),
          content: this.$t('dashboard.table_all_data_tip'),
          selected: false,
          values: [
            {
              val: null,
            },
            {
              val: null,
            },
          ],
        },
        {
          title: this.$t('dashboard.custom_data'),
          selected: false,
          content: [
            {
              val: 1000,
              unit: this.$t('dashboard.columns'),
              disabled: true,
            },
          ],
        },
      ], // 数据设置选项
      radiusObj: {
        text: '大小',
        size: 50,
        textObj: {
          left: '细',
          right: '粗',
        },
      }, // 柱状图柱子粗细
    };
  },
  beforeDestroy () {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  },
  computed: {
    ...mapState('project', ['chartDataMap', 'projectId']),
    ...mapState('drawingboard', [
      'rowList',
      'columnList',
      'currentCanvasDetail',
    ]),
    ...mapState('drawingboard', [
      'canvasType',
      'catList',
      'aggrList',
      'viewMode',
    ]),
  },
  methods: {
    ...mapMutations('drawingboard', [
      'setRowList',
      'setColumnList',
      'setViewMode',
      'setChartArrys',
    ]),
    ...mapMutations('project', ['setChartDataMap']),
    initData (name) {
      this.chartArrs = [];
      // 初始化特征参数
      if (this.currentCanvasDetail.features) {
        let colList = setCol(this.currentCanvasDetail.features.x, this.catList);
        this.setColumnList(this.filterList(colList, name));
        let rowList = setRow(
          this.currentCanvasDetail.features.y,
          this.catList,
          this.aggrList,
          this.canvasType
        );
        this.setRowList(this.filterList(rowList, name));
      }
      // 初始化样式
      const resCss =
        JSON.parse(JSON.stringify(this.currentCanvasDetail.css)) || {};
      this.canvasCss = {
        selectFromChart: false,
        dashboard_viewMode: 'fitHeight',
        ...resCss,
        worksheetId: this.currentCanvasDetail.worksheet_id,
      };
      // 初始化数据设置
      if (this.canvasCss.data_setting) {
        this.defaultSetting = this.getDefaulstSetting(
          this.canvasCss.data_setting
        );
      }
      // 初始化画布视图
      this.setViewMode(this.canvasCss.dashboard_viewMode);
    },
    changeColumnList (list) {
      this.$set(this.canvasFeatures, 'x', []);
      this.$set(this.canvasFeatures, 'x', setColumnParam(list));
      this.delayFunc();
    },
    changeRowList (list) {
      this.$set(this.canvasFeatures, 'y', []);
      this.$set(this.canvasFeatures, 'y', setRowParam(list));
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
      this.$set(
        this.canvasCss,
        'axis_style',
        initBarCss(
          this.canvasFeatures,
          this.canvasCss.axis_style,
          this.aggrList,
          this.canvasCss.titleCss
        )
      );
      // 获取tooltip数据，设置tooltip样式
      let tooltipList = setBarTooltip(this.canvasFeatures, this.aggrList);
      this.tooltipData = initToolTipStyle(
        tooltipList,
        this.canvasCss.tooltipFormat,
        this.canvasCss.tooltipNumberFormat,
        this.canvasCss.tooltipTextFormat
      );
      this.dataSettingInit();
      this.drawChart();
    },
    async drawChart () {
      let featureData = this.chartDataMap[this.dataKey] || []; // 当前图表的数据
      this.canvasData = featureData;
      let newData = getDataChartList({
        data: featureData,
        chart_type: this.canvasType,
        canvasCss: JSON.parse(JSON.stringify(this.canvasCss)),
        id: this.currentCanvasDetail.worksheet_id,
        feature_list: JSON.parse(JSON.stringify(this.canvasFeatures)),
      });
      featureData = newData.data;
      this.chartArrs = newData.chartArrs || [];
      this.setChartArrys(this.chartArrs);
      await this.$nextTick();
      let { chartSize, containerSize } = getSize(
        this.$refs.chartMain,
        this.viewMode,
        this.chartArrs,
        false,
        this.canvasType
      );
      this.isEmptyChartTip = false;
      if (isNoData(featureData, this.canvasType)) {
        this.chartArrs = [];
        this.isEmptyChartTip = true;
        sessionStorage.removeItem('mcBarChart');
      } else {
        sessionStorage.setItem('mcBarChart', JSON.stringify(this.chartArrs));
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
        aggrList: this.aggrList,
      };
      if (!this.canvasCss.dashboard_viewMode) {
        this.$set(this.canvasCss, 'dashboard_viewMode', 'fitHeight');
      }
      let chartIns = drawBar(configObj);
      this.colorList = [];
      this.shapeList = [];
      if (!chartIns) return;
      for (let i = 0; i < chartIns.length; i++) {
        this.getChartStyle(chartIns[i], i);
      }
      this.saveCss();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./scss/index.scss";
</style>
