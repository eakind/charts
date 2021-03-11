<template>
  <layout>
    <template #default>
      <div class="dashboard-features">
        <color-size-label capsuleType="size"></color-size-label>
        <color-size-label capsuleType="color"></color-size-label>
        <color-size-label
          capsuleType="labels"
          @modify-label-format="labelChange"
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
        <!-- <chart-empty :chartTitle="currentCanvasDetail.worksheet_title" v-if="showChartTip" iconName="#icon-db_chartPie" /> -->
        <mc-chart

          class="chart-panel"
          chartType="pie"
          :chartStyle="chartStyle"
          :chartData="chartData"
          ref="pieChart"
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
        @changeTitle="titleStyleProcess"
      ></canvas-color>
      <tooltip-setting
        :tooltipData="tooltipList"
        @change="tooltipChange"
      ></tooltip-setting>
    </template>
  </layout>
</template>
<script>

import { pieRight } from './mixins/pieRight.js';

import { pieBubbleMixin } from './mixins/pieBubble.js';

// // 一些右边栏公共的东西，比如默认的属性什么的 保存css
import middleMix from '../middle/mixins/index';

import { modifyPieCanvasFeature } from '@/utils/postParam.js';

import capsuleMixin from '../middle/mixins/capsule.js';

export default {

  mixins: [pieRight, middleMix, capsuleMixin, pieBubbleMixin],

  destroyed () {
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
  },
  methods: {
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
