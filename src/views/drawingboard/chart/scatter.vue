<template>
  <layout>
    <template #default>
      <div class="dashboard-features">
        <dc-column class="dc-column" @change="changeColumnList"></dc-column>
        <dc-row class="dc-row" @change="changeRowList"></dc-row>
        <div class="color-size-label-flex">
          <color-size-label capsuleType="size"></color-size-label>
          <color-size-label capsuleType="color"></color-size-label>
          <color-size-label
            class="labels"
            capsuleType="labels"
            :totalList="labelsCapsuleList"
            @modify-label-format="labelChange"
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
        <!-- <chart-empty iconName="#icon-db_chartScatter" v-if="showChartTip" /> -->
        <scale-axis
          v-show="chartStyle.scopeObj && chartStyle.scopeObj.select === 1"
          @zoom="zoomAxis"
        ></scale-axis>
        <mc-chart
          class="chart-panel"
          chartType="scatter"
          :chartStyle="chartStyle"
          :chartData="chartData"
          ref="scatterChart"
        ></mc-chart>
      </div>
    </template>
    <template #right-data>
      <data-color
        @on-range-change="colorRangeProcess"
        @change="colorListProcess"
        @on-template-change="dataTempChangeProcess"
        :setFlag="false"
        :showColorRangeFlag="true"
        :showFillFlag="false"
        :colorList="colorList"
      ></data-color>
      <data-setting
        :dataSetting="dataSetting"
        @on-canvasCss-change="updateCanvasCss"
      ></data-setting>
    </template>
    <template #right-canvas>
      <!-- <view-setting
        v-model="canvasCss.dashboard_viewMode"
        @change="drawChart"
      ></view-setting> -->
      <axis-setting
        :axis-style="canvasCss.axis_style"
        @change="changeAxis"
      ></axis-setting>
      <scale-and-grid
        :axis-style="canvasCss.axis_style"
        :scope-obj="canvasCss.scopeObj"
        :has-unit="canvasCss.hasUnit"
        @changeUnit="changeUnit"
        @changeGrid="changeAxis"
        @changeScale="changeAxis"
        @changeScope="changeScope"
      ></scale-and-grid>
      <tooltip-setting
        :tooltipData="tooltipList"
        @change="tooltipChange"
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

import { pieBubbleMixin } from './mixins/pieBubble.js';
import capsuleMixin from '../middle/mixins/capsule.js';
import middleMix from '../middle/mixins/index';

// 胶囊
import DcColumn from '../middle/column.vue';
import DcRow from '../middle/row.vue';

import { modifyScatterCanvasFeature } from '@/utils/postParam.js';

// 右边栏
// import ViewSetting from '../right/canvas/viewSetting.vue';
import AxisSetting from '../right/canvas/axisSetting.vue';
import ScaleAndGrid from '../right/canvas/scaleAndGrid.vue';
import scaleAxis from '@/components/minMaxRange/scaleAxis.vue';
export default {
  mixins: [capsuleMixin, pieBubbleMixin, middleMix],
  components: {
    // dashboardTitle,
    // ViewSetting,
    AxisSetting,
    ScaleAndGrid,
    DcColumn,
    DcRow,
    scaleAxis,
  },
  data () {
    return {
      canvasCss: {}, // 存储画布样式
      canvasFeatures: {}, // 画布请求特征参数
      isEmptyChartTip: false,
      chartArrs: [],
      isLoading: false, // 请求画布时是否显示loading
    };
  },
  computed: {
    ...mapState('project', ['projectId', 'chartDataMap']),

    ...mapState('drawingboard', ['columnList', 'rowList', 'viewMode']),
  },
  beforeDestroy () {
    this.bus.$off('capsuleChange');
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  },
  mounted () {
    this.bus.$off('capsuleChange');
    this.bus.$on('capsuleChange', (type, list) => {
      this.resetCanvasFeature(type, list, modifyScatterCanvasFeature);
      this.shakeDrawChart();
    });
  },
  methods: {
    ...mapMutations('drawingboard', [
      'setRowList',
      'setColumnList',
      'setViewMode',
    ]),
    ...mapMutations('project', ['setChartDataMap']),

    resetData () {
      this.setRowList([]);
      this.setColumnList([]);
      this.setColorCapsuleList([]);
      this.setLabelsCapsuleList([]);
      this.setSizeCapsuleList([]);
      this.canvasFeatures = {};
      this.canvasCss = {};
      this.chartArrs = [];
    },

    changeColumnList (list) {
      this.resetCanvasFeature('x', list, modifyScatterCanvasFeature);
      this.shakeDrawChart();
    },
    changeRowList (list) {
      this.resetCanvasFeature('y', list, modifyScatterCanvasFeature);
      this.shakeDrawChart();
    },
    changeAxis (list) {
      this.$set(this.canvasCss, 'axis_style', list);
      let xAxis = list.find((i) => i.axisType === 'x');
      let yAxis = list.find((i) => i.axisType === 'y');
      this.$set(this.chartStyle, 'xAxis', xAxis);
      this.$set(this.chartStyle, 'yAxis', yAxis);
      this.updateCanvas();
    },
    changeScope (item) {
      this.$set(this.canvasCss, 'scopeObj', item);
      this.$set(this.chartStyle, 'scopeObj', item);
      this.updateCanvas();
    },
    changeUnit (val) {
      let flag = val !== 'origin';
      this.$set(this.canvasCss, 'hasUnit', val);
      this.$set(this.chartStyle, 'hasUnit', flag);
      this.updateCanvas();
    },

    updateCanvas () {
      let dom = document.getElementById(
        `mc_${this.canvasType}_${this.currentCanvasDetail.worksheet_id}`
      );
      if (dom) {
        dom.innerHTML = '';
      }
      this.$refs[`${this.canvasType}Chart`].draw();
      this.saveData('css', this.canvasCss);
    },

    initOtherConfig () {
      let { xAxis, yAxis, scopeObj, hasUnit } = this.chartStyle;
      let axisStyle = [xAxis, yAxis];
      let range = this.$refs[`${this.canvasType}Chart`].getDomain();
      if (range.length > 0) {
        scopeObj.min = range[0];
        scopeObj.max = range[1];
      }
      scopeObj.tickRange = range;
      this.$set(this.canvasCss, 'axis_style', axisStyle);
      this.$set(this.canvasCss, 'scopeObj', scopeObj);
      this.$set(this.canvasCss, 'hasUnit', hasUnit ? 'auto' : 'origin');
    },
    zoomAxis (divid) {
      let scale = this.chartStyle.scopeObj.scale;
      if (divid === 0) {
        this.$set(this.chartStyle.scopeObj, 'scale', 1);
        this.$set(this.canvasCss.scopeObj, 'scale', 1);
        scale = 1;
      } else if (divid === 1) {
        scale *= 2;
      } else if (divid === -1) {
        scale = scale / 2;
      }
      if (scale > 64 || scale < 1 / 64) {
        return;
      }
      this.$set(this.chartStyle.scopeObj, 'scale', scale);
      this.$set(this.canvasCss.scopeObj, 'scale', scale);
      this.updateCanvas();
      this.saveData('css', this.canvasCss);
    },
  },
};
</script>

<style lang="scss" scoped>
@import './scss/index.scss';
.color-size-label-flex {
  position: relative;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  margin-bottom: 8px;
  .dc-color-size-label {
    width: calc(33% - 5px);
  }
  .dc-color-size-label + .dc-color-size-label {
    margin-left: 16px;
  }
}

.dc-color-size-label.labels {
  position: absolute;
  right: 0px;
  top: 0;
  z-index: 2;
  box-shadow: 0 6px 14px 0 rgba(0, 0, 0, 0.1);
}
</style>
