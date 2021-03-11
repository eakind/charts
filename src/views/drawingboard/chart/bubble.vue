<template>
  <layout>
    <template #default>
      <div class="dashboard-features">
        <color-size-label capsuleType="size"></color-size-label>
        <color-size-label capsuleType="color"></color-size-label>
        <color-size-label
          capsuleType="labels"
          @modify-label-format="labelChange"
        ></color-size-label>
      </div>
      <div class="chart-bg" ref="chartMain">
        <bg-color :bgColor="canvasCss.bgCss"></bg-color>
        <dashboard-title
          :title="currentCanvasDetail.worksheet_title"
          :canvasCss="canvasCss"
        />
        <!-- <chart-empty v-if="showChartTip" iconName="#icon-db_chartBubble" /> -->

        <mc-chart

          class="chart-panel"
          chartType="bubble"
          :chartStyle="chartStyle"
          :chartData="chartData"
          ref="bubbleChart"
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
        @changeTitle="changeTitleStyle"
      ></canvas-color>
      <tooltip-setting
        :tooltipData="tooltipList"
        @change="tooltipChange"
      ></tooltip-setting>
    </template>
  </layout>
</template>
<script>
import { pieBubbleMixin } from './mixins/pieBubble.js';

import { bubbleRight } from './mixins/bubbleRight.js';
// 一些右边栏公共的东西，比如默认的属性什么的 保存css
import middleMix from '../middle/mixins/index';

import { modifyBubbleCanvasFeature } from '@/utils/postParam.js';

import capsuleMixin from '../middle/mixins/capsule.js';

export default {
  mixins: [bubbleRight, middleMix, capsuleMixin, pieBubbleMixin],
  beforeDestroy () {
    this.bus.$off('capsuleChange');
  },
  mounted () {
    this.bus.$off('capsuleChange');
    this.bus.$on('capsuleChange', (type, list) => {
      this.resetCanvasFeature(type, list, modifyBubbleCanvasFeature);
      this.shakeDrawChart();
    });
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
