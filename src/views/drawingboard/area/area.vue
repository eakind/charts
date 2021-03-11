<template>
  <layout>
    <template #default>
      <div class="dashboard-features">
        <dc-column></dc-column>
        <dc-row></dc-row>
      </div>
      <div class="dashboard_chart_bg" :class="'chart-background'" ref="chartMain">
        <dashboard-title :title="chartName" :canvasCss="canvasCss" />
        <chart-empty v-if="showChartTip" />
        <mc-chart
          class="chart-panel"
          :chartArrs="chartArrs"
          :showLoading="showLoading"
          :showScaleAxis="false"
        ></mc-chart>
        <bg-color
          :bgColor="canvasCss.bgCss"
        ></bg-color>
      </div>
    </template>
    <template #right-data>
      <data-label @change="toggleLabel" :is-label="canvasCss.isShowLabel"></data-label>
      <data-color v-model="canvasCss.isFillArea"  :colorList="colorList" @change="changeColor"></data-color>
      <view-setting v-model="canvasCss.dashboard_viewMode" @change="drawChart"></view-setting>
    </template>
    <template #right-canvas>
      <axis-setting :axis-style="canvasCss.axis_style" @change="changeAxis"></axis-setting>
      <scale-and-grid :axis-style="canvasCss.axis_style" @changeGrid="changeGrid" @changeScale="changeScale" @changeScope="changeScope"></scale-and-grid>
      <!-- <grid-setting :axis-style="canvasCss.axis_style" @change="changeGrid"></grid-setting> -->
      <!-- <scale-setting :axis-style="canvasCss.axis_style" @change="changeScale"></scale-setting> -->
      <tooltip-setting :tooltip-data="tooltipData" @change="changeTooltip"></tooltip-setting>
      <canvas-color :bgCss="canvasCss.bgCss" :titleCss="canvasCss.titleCss"
                    @change="changeBg" @changeTitle="changeTitleFont"></canvas-color>
    </template>
  </layout>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

import McChart from '@/components/dcChart/mcChart';

import { post } from '@/api/server';
import { initCatObj, initAggrObj } from '@/utils/utils';
import { getDataChartList } from '@/utils/draw.js';
import { drawArea, initAreaCss, setAreaTooltip } from '@/utils/draw/drawArea.js';
import { getBaseConfig } from '@/utils/draw/baseConfig.js';

import { getSize, modifyCss, formatOneNumber } from '../utils/canvasStyle';
import { getChartKey } from '../middle/utils/index.js';

// 中间栏这一块的组件
import DcColumn from '../middle/column.vue';
import DcRow from '../middle/row.vue';
import BgColor from '../middle/bgColor';
import dashboardTitle from '../middle/dashboardTitle';
import layout from '../middle/chartsLayout';
import chartEmpty from '../middle/chartEmpty';
import { initToolTipStyle } from '../middle/utils/canvas.js';

// 右边栏数据这一块的组件
import DataLabel from '../right/data/dataLabel.vue';
import DataColor from '../right/data/dataColor.vue';
import ViewSetting from '../right/canvas/viewSetting.vue';

// 右边栏画布这一块的组件
import AxisSetting from '../right/canvas/axisSetting.vue';
// import GridSetting from '../right/canvas/gridSetting.vue';
// import ScaleSetting from '../right/canvas/scaleSetting.vue';
import ScaleAndGrid from '../right/canvas/scaleAndGrid.vue';
import TooltipSetting from '../right/canvas/tooltipSetting.vue';
import CanvasColor from '../right/canvas/canvasColor.vue';

export default {
  components: {
    layout,
    chartEmpty,
    dashboardTitle,
    BgColor,
    DcColumn,
    DcRow,
    McChart,
    DataLabel,
    DataColor,
    ViewSetting,
    AxisSetting,
    // GridSetting,
    // ScaleSetting,
    TooltipSetting,
    CanvasColor,
    ScaleAndGrid
  },
  data () {
    return {
      canvasCss: {},
      chartName: '',
      changeTitle: false,
      showChartTip: false,
      chartArrs: [],
      mc_insts: [],
      configs: [], // 画布配置项
      showLoading: false,
      isShowTitle: true, // 是否显示画布标题
      tooltipData: [], // 提示框信息
      timer: null, // 防抖
      dataKey: '' // 用来取画布数据用的key
    };
  },
  computed: {
    ...mapState('project', ['projectId', 'worksheetTypes', 'chartDataMap']),
    ...mapState('displayboard', ['dashboard_viewMode']),
    ...mapState('dashboard', ['columnList', 'rowList']),
    ...mapState('dashboard', ['worksheetId', 'chartType', 'canvasFeatures', 'catList', 'aggrList']),
    colorList () {
      return this.mc_insts?.[0]?.config?.colorList || [];
    }
  },
  watch: {
    columnList: {
      handler (list) {
        if (!list.length) {
          this.$set(this.canvasFeatures, 'x', []);
          delete this.canvasFeatures.x;
          this.setCanvasFeatures(this.canvasFeatures);
          this.delayFunc();
          return;
        }
        this.setCanvasFeatureX(list);
      },
      deep: true
    },
    rowList: {
      handler (list) {
        if (!list.length) {
          this.$set(this.canvasFeatures, 'color', {});
          delete this.canvasFeatures.color;
          this.setCanvasFeatures(this.canvasFeatures);
          this.delayFunc();
          return;
        }
        this.setCanvasFeaturesColor(list);
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations('dashboard', ['setCanvasType', 'setCanvasFeatures', 'setRowList', 'setColumnList']),
    ...mapMutations('displayboard', ['setViewMode']),
    ...mapMutations('project', ['setChartDataMap']),
    initData () {
      if (!this.worksheetId) {
        return;
      }
      let res = JSON.parse(sessionStorage.getItem(this.worksheetId));
      if (!res) return;
      this.chartName = res.worksheet_title;
      this.setCanvasType(this.worksheetTypes[res.worksheet_type]);
      this.setCanvasFeatures(res.features || {});
      this.canvasCss = {
        ...res.css,
        isShowLabel: true,
        isFillArea: true,
        worksheetId: this.worksheetId
      };
      this.setViewMode(this.canvasCss.dashboard_viewMode || 'standard');
      this.setAreaRow();
      this.setAreaColumn();
    },
    // 初始化设置rowList
    setAreaRow () {
      let color = this.canvasFeatures.color;
      this.setRowList([]);
      if (!color) {
        this.setRowList([]);
        return;
      }
      if (!color.name) {
        this.setRowList([]);
      } else {
        let featureObj = initCatObj(color.name, this.catList);
        this.rowList.push(featureObj);
        this.setRowList(this.rowList);
      }
    },
    // 初始化设置columnList
    setAreaColumn () {
      let xList = this.canvasFeatures.x;
      this.setColumnList([]);
      if (!xList) {
        this.setColumnList([]);
        return;
      }
      if (!xList.length) {
        this.setColumnList([]);
      } else {
        let len = xList.length;
        for (let i = 0; i < len; i++) {
          let featureObj = initAggrObj(xList[i].name, this.aggrList, this.chartType);
          if (!featureObj) continue;
          this.columnList.push(featureObj);
        }
        this.setColumnList(this.columnList);
      }
    },
    // 设置请求参数x属性
    setCanvasFeatureX (list) {
      let arr = [];
      let len = list.length;
      for (let i = 0; i < len; i++) {
        arr.push({
          name: list[i].feature_name,
          legend: list[i].legend
        });
      }
      this.$set(this.canvasFeatures, 'x', arr);
      this.delayFunc();
    },
    // 设置请求参数color属性
    setCanvasFeaturesColor (list) {
      let colorObj = {
        name: list[0].feature_name
      };
      this.$set(this.canvasFeatures, 'color', colorObj);
      this.delayFunc();
    },
    delayFunc () {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.getChartData();
      }, 300);
    },
    async getChartData () {
      // 获取存储画布数据的key
      this.dataKey = getChartKey({ rowList: this.rowList, columnList: this.columnList }, this.worksheetId);
      this.showLoading = true;
      if (!this.chartDataMap[this.dataKey]) {
        let featureData = await this.getFeaturesData();
        if (featureData) {
          // 将画布数据存储在本地
          this.chartDataMap[this.dataKey] = featureData;
          this.setChartDataMap(this.chartDataMap);
        }
      }
      this.showLoading = false;
      // 设置画布样式
      this.$set(this.canvasCss, 'axis_style', initAreaCss(this.canvasFeatures, this.canvasCss.axis_style));
      // 获取tooltip数据，设置tooltip样式
      let tooltipList = setAreaTooltip(this.canvasFeatures);
      this.tooltipData = initToolTipStyle(tooltipList, this.canvasCss.tooltipFormat, this.canvasCss.tooltipNumberFormat, this.canvasCss.tooltipTextFormat);
      this.drawChart();
    },
    async drawChart () {
      let featureData = this.chartDataMap[this.dataKey] || []; // 当前图表的数据
      let newData = getDataChartList({
        data: featureData,
        chart_type: this.chartType,
        canvasCss: JSON.parse(JSON.stringify(this.canvasCss)),
        id: this.worksheetId,
        feature_list: JSON.parse(JSON.stringify(this.canvasFeatures))
      });
      featureData = newData.data;
      this.chartArrs = newData.chartArrs;
      await this.$nextTick();
      let { chartSize, containerSize } = getSize(this.$refs.chartMain, this.dashboard_viewMode, this.chartArrs, false);
      if (this.dashboard_viewMode === 'standard') {
        let arr = [];
        for (let i = 0; i < featureData.length; i++) {
          arr.push(featureData[i].length);
        }
        let max = Math.max(...arr);
        chartSize = {
          width: 50 * max
        };
      }
      let baseConfig = getBaseConfig(this.canvasCss); // 画图表基础参数
      let configObj = {
        baseConfig,
        featureData,
        canvasCss: JSON.parse(JSON.stringify(this.canvasCss)),
        canvasFeatures: JSON.parse(JSON.stringify(this.canvasFeatures)),
        containerSize,
        chartSize,
        chartArr: this.chartArrs
      };
      let chartIns = drawArea(configObj);
      console.log(chartIns);
    },
    // 获取绘图数据
    async getFeaturesData () {
      let param = {
        project_id: this.projectId,
        worksheet_id: this.worksheetId,
        dashboard_id: this.dashboardId,
        features: this.canvasFeatures,
        offset: 0,
        limit: 9999
      };
      let dataRes = await post('reviseCanvasFeature', param);
      return dataRes && dataRes.features_data;
    },
    // 是否显示数据标签
    toggleLabel (val) {
      this.isShowLabel = val;
      this.$set(this.canvasCss, 'isShowLabel', val);
      this.drawChart();
      this.saveCss();
    },
    // 刻度值
    changeAxis (fontList, axisList) {
      this.$set(this.canvasCss.axis_style, 'fontList', fontList);
      this.$set(this.canvasCss.axis_style, 'axisList', axisList);
      this.drawChart();
      this.saveCss();
    },
    // 修改网格线
    changeGrid (gridStyle, gridShow) {
      this.$set(this.canvasCss.axis_style, 'grid_style', gridStyle);
      this.$set(this.canvasCss.axis_style, 'grid_show', gridShow);
      this.drawChart();
      this.saveCss();
    },
    // 修改刻度值
    changeScale (scaleList) {
      this.$set(this.canvasCss.axis_style, 'scaleList', scaleList);
      this.drawChart();
      this.saveCss();
    },
    // 修改刻度范围
    changeScope (scopeList) {
      this.$set(this.canvasCss.axis_style, 'scopeList', scopeList);
      this.drawChart();
      this.saveCss();
    },
    // 修改tooltip
    changeTooltip (data) {
      this.toolTipData = data;
      this.canvasCss.tooltipFormat = data;
      let format = {}; let text = {}; let show = false;
      JSON.parse(JSON.stringify(data)).forEach(d => {
        let format_d3 = formatOneNumber(d.format, 0, this.$i18n);
        format[d.key] = format_d3;
        let new_d = JSON.parse(JSON.stringify(d));
        let text_modified = new_d.text;
        text_modified.title = new_d.title;
        text_modified.display = new_d.display;
        text[d.key] = text_modified;
        if (text_modified.display === 'auto') show = true;
      });
      this.configs.forEach(c => {
        c.config.tooltip.format = format;
        c.config.tooltip.text = text;
        c.config.tooltip.show = show;
      });

      this.canvasCss.tooltipNumberFormat = format;
      this.canvasCss.tooltipTextFormat = text;
      this.drawChart();
      this.saveCss();
    },
    changeBg (bgCss) {
      this.$set(this.canvasCss, 'bgCss', bgCss);
      this.saveCss();
    },
    // 修改画布标题样式
    changeTitleFont (fontColor) {
      let titleCss = {
        color: fontColor
      };
      this.$set(this.canvasCss, 'titleCss', titleCss);
      this.saveCss();
    },
    // 是否填充面积
    changeColor (val) {
      this.$set(this.canvasCss, 'isFillArea', val);
      this.drawChart();
    },
    saveCss () {
      let detail = JSON.parse(sessionStorage.getItem(this.worksheetId));
      if (detail) {
        detail.css = this.canvasCss;
        sessionStorage.setItem(this.worksheetId, JSON.stringify(detail));
        modifyCss({
          canvasCss: this.canvasCss,
          projectId: this.projectId
        });
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.dashboard-features {
  flex-shrink: 0;
  box-sizing: border-box;
  position: relative;
}
.dashboard_chart_bg {
  position: relative;
  flex-grow: 1;
  background: #FFFFFF;
  box-shadow: 0 0 10px -4px rgba(0, 0, 0, .5);
  border-radius: 4px;
  overflow: hidden;
  .set-chart-background {
    width: 100%;
    height: 100%;
  }
  .chart-panel {
    padding: 0px 10px;
  }
}
</style>
