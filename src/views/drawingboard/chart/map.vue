<template>
  <layout>
    <template #default>
      <div class="dashboard-features">
        <dc-column
          class="dc-column"
          @change="changeColumn"
          @on-remove-map-label="removeLabel"
        ></dc-column>
        <div class="map-flex">
          <color-size-label capsuleType="size"></color-size-label>
          <color-size-label capsuleType="color"></color-size-label>
        </div>
        <color-size-label
          class="map-label"
          capsuleType="labels"
          @modify-label-format="changeLabelFormat"
        ></color-size-label>
      </div>
      <div class="chart-bg" ref="chartMain">
        <bg-color :bgColor="canvasCss.bgCss"></bg-color>
        <dashboard-title
          :title="currentCanvasDetail.worksheet_title"
          :canvasCss="canvasCss"
        />
        <chart-empty v-if="showChartTip" iconName="#icon-db_chartMap" />
        <mc-chart
          v-else
          class="chart-panel"
          chartType="map"
          :chartStyle="canvasCss"
          :chartData="jsonData"
          ref="mapChart"
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
        :shapeShow="false"
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
import mcChart from '@/components/dcCharts/index';
import dashboardTitle from '../middle/dashboardTitle';
import bgColor from '../middle/bgColor';
import { mapRight } from './mixins/mapRight';
// 一些右边栏公共的东西，比如默认的属性什么的 保存css
import middleMix from '../middle/mixins/index';

import { post } from '@/api/server';
import { getDataChartList } from '@/utils/draw';
// import { getSize } from '../utils/canvasStyle';
import { isObject } from '@/utils/check.js';
import { drawMap } from '@/utils/draw/drawMap';
// import { getChartKey } from '../middle/utils/index.js';

// 胶囊
import colorSizeLabel from '../middle/colorSizeLabel.vue';
import capsuleMixin from '../middle/mixins/capsule.js';
import DcColumn from '../middle/column.vue';
import { modifyMapCanvasFeature } from '@/utils/postParam.js';

import { mapState, mapMutations } from 'vuex';
export default {
  components: {
    layout,
    dashboardTitle,
    bgColor,
    mcChart,
    colorSizeLabel,
    DcColumn,
  },
  mixins: [mapRight, middleMix, capsuleMixin],
  data () {
    return {
      canvasFeatures: {},
      showChartTip: false,
      canvasCss: {},
      showLoading: false,
      jsonData: [],
      chartArrs: [],
      requestFlag: false,
      isFlag: false,
      timer: null,
      chartType: 'map',
      mapIsLoAndLat: false,
    };
  },
  computed: {
    ...mapState('project', ['projectId', 'worksheetTypes', 'chartDataMap']),
    ...mapState('drawingboard', [
      'canvasView',
      'fontColor',
      'catList',
      'aggrList',
    ]),
    ...mapState('drawingboard', [
      'canvasType',
      'columnList',
      'colorCapsuleList',
      'labelsCapsuleList',
      'sizeCapsuleList',
      'currentCanvasDetail',
    ]),
  },
  mounted () {
    this.bus.$off('capsuleChange');
    this.bus.$on('capsuleChange', (type, list) => {
      if (type === 'col') {
        // 过滤标签
        let labelsCapsuleList = this.labelsCapsuleList.filter((i) => {
          let match = list.find((item) => item.feature_name === i.feature_name || i.dtype === 'AGGR');
          if (match) {
            return true;
          }
          return false;
        });
        this.setLabelsCapsuleList(labelsCapsuleList);
        this.resetCanvasFeature('labels', labelsCapsuleList, modifyMapCanvasFeature);
      }
      type = type === 'col' ? 'area' : type;
      this.resetCanvasFeature(type, list, modifyMapCanvasFeature);
      this.shakeDrawChart();
    });
  },
  beforeDestroy () {
    this.bus.$off('capsuleChange');
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.timerFeature) {
      clearTimeout(this.timerFeature);
      this.timerFeature = null;
    }
  },
  methods: {
    ...mapMutations('drawingboard', [
      'setCanvasType',
      'setFontColor',
      'setChartFormat',
      'setChartConfig',
    ]),
    ...mapMutations('project', ['setChartDataMap']),
    ...mapMutations('drawingboard', [
      'setColorCapsuleList',
      'setLabelsCapsuleList',
      'setSizeCapsuleList',
      'setChartArrys',
    ]),
    ...mapMutations('drawingboard', {
      setColumnCapsuleList: 'setColumnList',
    }),
    removeLabel (item) {
      let list = this.labelsCapsuleList.filter((i) => i.name !== item.name);
      this.setLabelsCapsuleList(list);
      this.resetCanvasFeature('labels', list, modifyMapCanvasFeature);
    },
    updateCanvasCss (type, value, drawFlag) {
      this.$set(this.canvasCss, type, value);
      typeof this[type + 'Process'] === 'function' && this[type + 'Process']();
      // 是否需要请求
      drawFlag ? this.mediaProcessBeforeDraw() : this.drawCanvas({});
      if (type === 'tooltipFormat') {
        this.initData();
      }
    },
    mediaProcessBeforeDraw () {
      this.requestFlag = true;
      this.drawChart();
    },
    resetData () {
      this.setColumnCapsuleList([]);
      this.setColorCapsuleList([]);
      this.setLabelsCapsuleList([]);
      this.setSizeCapsuleList([]);
      this.canvasFeatures = {};
      this.canvasCss = {};
      this.chartName = '';
      this.chartArrs = [];
    },
    /**
     *初始化数据
     */
    initData (name) {
      this.resetData();
      let res = this.currentCanvasDetail;
      if (!res) return;
      if (res.features) {
        this.initCapsuleData(res.features, name);
      }

      this.chartName = res.worksheet_title || '';
      // this.canvasFeatures = JSON.parse(JSON.stringify(res.features)) || {};
      this.canvasCss = res.css || {};
      this.canvasCss.mode = this.viewMode;
      if (this.timerFeature) {
        clearTimeout(this.timerFeature);
        this.timerFeature = null;
      }

      this.$set(
        this.canvasCss,
        'id',
        `mc_${this.canvasType}_${this.currentCanvasDetail.worksheet_id}`
      );
      // this.$set(
      //   this.canvasCss,
      //   'bindto',
      //   `mc_${this.canvasType}_${this.currentCanvasDetail.worksheet_id}`
      // );
    },
    changeColumn (list, flag) {
      this.isFlag = flag; // 是否是经纬度
      this.resetCanvasFeature('area', list, modifyMapCanvasFeature);
      this.shakeDrawChart();
    },
    // 获取绘图数据
    async fetchFeatureData (param, detail) {
      if (this.canvasFeatures && this.canvasFeatures.area) {
        this.canvasFeatures.area.map((i) => {
          delete i.legend;
        });
        let matchList = this.canvasFeatures.area.filter(
          (i) => i.dtype === 'AGGR'
        );
        if (matchList.length === 1) {
          return;
        }
      }
      // if (!this.canvasFeatures.size || this.canvasFeatures.size.length === 0) {
      //   return;
      // }
      if (!param) {
        param = {
          project_id: this.projectId,
          worksheet_id: detail.worksheet_id,
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
      let featureData = [];

      // let key = getChartKey(this.canvasFeatures, this.currentCanvasDetail.worksheet_id, 'map');
      // if (this.requestFlag || this.chartDataMap[key] === undefined) {
      featureData = await this.fetchFeatureData(param, detail).finally(() => {
        this.showLoading = false;
      });
      //   this.chartDataMap[key] = featureData;
      //   this.setChartDataMap(this.chartDataMap);
      // } else {
      //   featureData = this.chartDataMap[key] || [];
      // }
      this.requestFlag = false;
      this.showLoading = false;

      if (!detail || !featureData) {
        this.showChartTip = true;
        sessionStorage.removeItem('mcMapChart');
        return {};
      }
      this.showChartTip = false;
      // 获取画图所需的数据和页面元素
      let newData = getDataChartList({
        data: featureData,
        chart_type: 'map',
        canvasCss: detail.css ? JSON.parse(JSON.stringify(detail.css)) : {},
        id: detail.worksheet_id,
        feature_list: JSON.parse(JSON.stringify(detail.features)),
      });
      return newData;
    },
    // 画图
    async drawChart (param) {
      // console.log(this.canvasFeatures);
      this.showLoading = true;
      let newData = await this.fetchDataProcess(param);
      if (!newData.data || !newData.data.data) {
        return;
      }
      this.jsonData = newData.data.data || [];
      this.jsonData = this.jsonData.filter((item) => {
        return (item.latitude && item.longitude);
      });
      this.chartArrs = newData.chartArrs;
      sessionStorage.setItem('mcMapChart', JSON.stringify(this.chartArrs));
      this.setChartArrys(this.chartArrs);
      await this.$nextTick();
      let {
        chartSize: chart_size,
        containerSize: container_size,
      } = this.getSize();
      this.$set(this.canvasCss, 'width', chart_size.width);
      this.$set(this.canvasCss, 'height', chart_size.height);
      let { baseConfig, ins, tooltipList, styles } = drawMap({
        data: this.jsonData,
        featureList: this.canvasFeatures,
        mapChange: this.mapChange(),
        canvasCss: this.canvasCss, // 画布CSS
        ids: this.chartArrs.map((d) => d.id), // 根据ID找到图表的DOM载体
        chartSize: chart_size, // 图表的大小，格式为{width: 1080, height: 480}，可不提供
        containerSize: container_size, // 可滚动时候提供外div的宽高
      });
      this.$set(this.canvasCss, 'labelFeature', tooltipList);
      this.$set(this.canvasCss, 'point', baseConfig.point);
      this.$set(this.canvasCss, 'column', baseConfig.data.column);
      this.$set(this.canvasCss, 'row', baseConfig.data.row);
      this.$set(this.canvasCss, 'colorFeature', baseConfig.data.colored);
      this.$set(this.canvasCss, 'sizeFeature', baseConfig.data.sized);
      let curTooltipList = baseConfig.tooltip;
      let getTooltipConf = [];
      if (curTooltipList && curTooltipList.name) {
        for (let i = 0; i < curTooltipList.name.length; i++) {
          let obj = {
            key: curTooltipList.name[i],
            title: curTooltipList.name[i],
            format: curTooltipList.format[curTooltipList.name[i]] || {},
            text: curTooltipList.text[curTooltipList.name[i]] || {},
          };
          getTooltipConf.push(obj);
        }
      };
      this.$set(this.canvasCss, 'tooltipList', getTooltipConf);
      this.$refs[`${this.canvasType}Chart`].draw();
      if (!isObject(ins)) {
        this.chartArrs = [];
        return;
      } else {
        this.curStyle = styles;
        this.tooltipList = tooltipList;
        this.initMapConfig();
      }
      this.saveData('css', this.canvasCss);
    },
    getSize () {
      let obj = {};
      let parent = this.$refs.chartMain;
      let containerWidth = parent.offsetWidth - 20; // 距离右侧有一些距离
      let containerHeight = parent.offsetHeight - 90; // 留点位置给画布标题和滚动条
      obj.chartSize = {
        width: containerWidth,
        height: containerHeight,
      };
      obj.containerSize = {
        width: containerWidth,
        height: containerHeight,
      };
      return obj;
    },
    retRowColCount () {
      let obj = {
        nrows: 1000,
        // ncols: 100,
        n: 1000,
      };
      let data_setting = this.canvasCss.data_setting;
      if (data_setting && data_setting.length > 0) {
        let match = data_setting.find((i) => i.selected);
        if (match) {
          if (match.values) {
            obj.nrows = match.values[0].val;
            // obj.ncols = match.values[0].val;
            obj.n = obj.nrows;
          } else if (match.content && typeof match.content === 'object') {
            obj.nrows = match.content[0].val;
            // obj.ncols = match.content[0].val;
            obj.n = obj.nrows;
          }
        }
        return obj;
      }
      return obj;
    },
    mapChange () {
      let that = this;
      return function (type, value) {
        if (type === 'zoom') {
          that.canvasCss.mapZoom = value;
        }
        if (type === 'move') {
          that.canvasCss.mapCenter = value;
        }
        that.saveData('css', that.canvasCss, true);
      };
    },
  },
};
</script>
<style lang="scss" scoped>
@import './scss/index.scss';
.bg-color {
  z-index: 0;
}
.map-flex {
  position: relative;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  min-height: 40px;
  margin-bottom: 8px;
  width: 100%;
  > div {
    flex: 1;
    &:first-child {
      margin-right: 16px;
    }
  }
}
.map-label {
  margin-bottom: 8px;
}
</style>
