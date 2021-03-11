<template>
  <layout>
    <template #default>
      <div class="dashboard-features">
        <column ref="column"
                @change="changeColumn"
                @showSort="showDrag = true">
        </column>
        <row ref="row" @change="changeRow"></row>
        <compare ref="compare" @change="changeCompare" @cmp-groups-change="onCmpGroupsChange" />
        <div class="feature-mark" v-show="isFeaturesMasked"></div>
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
      <dc-collapse-item :title="$t('message.data_label')">
        <!-- 标签样式 -->
        <style-label :fontStyles.sync="canvasCss.textSettings"
                     @pick-color="onLabelColorChange"
                     @change-size="onLabelSizeChange"
        />
        <!-- 显示字段 -->
        <div class="style-item style-title">{{$t('message.data_label_show')}}</div>
        <dc-checkbox :options="labelOptions" v-model="canvasCss.labeled" @input="onLabeledChange" />
      </dc-collapse-item>
      <data-color :colorList="colorList" @change="onDataColorChange"></data-color>
      <view-setting v-model="canvasCss.dashboard_viewMode" @change="drawChart"></view-setting>
      <style-funnel v-model="canvasCss.funnel" @change="onFunnelStyleChange" />
    </template>
    <template #right-canvas>
      <tooltip-setting :tooltip-data="tooltipData" @change="changeTooltip"></tooltip-setting>
      <canvas-color :bgCss="canvasCss.bgCss" :titleCss="canvasCss.titleCss"
                    @change="changeBg" @changeTitle="changeTitleFont"></canvas-color>
    </template>
  </layout>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

import { postParam } from '@/mixins/dashboard/postParam';

import DcCheckbox from '@/components/dccheckbox/DcCheckbox';

import layout from '../middle/chartsLayout';
import column from './funnelColumn';
import row from './funnelRow';
import Compare from './funnelCompare';
import dashboardTitle from '../middle/dashboardTitle';
import chartEmpty from '../middle/chartEmpty';
import McChart from '@/components/dcChart/mcChart';
import BgColor from '../middle/bgColor';
import styleLabel from '../right/data/styleLabel';
import DataColor from '../right/data/dataColor.vue';
import ViewSetting from '../right/canvas/viewSetting.vue';
import styleFunnel from './styleFunnel';

import TooltipSetting from '../right/canvas/tooltipSetting.vue';
import CanvasColor from '../right/canvas/canvasColor.vue';

import { post } from '@/api/server';
import { draw, getDataChartList } from '@/utils/draw';
import { delayFunc } from '@/utils/utils';
import { isObject, dcDeepClone } from '@/utils/check.js';

import { getSize, modifyCss, changeAllLabelsStyle } from '../utils/canvasStyle';
import { judgeFeatureType } from '@/utils/drawHelpers';

export default {
  components: {
    DcCheckbox,
    layout, // common
    column,
    row,
    Compare, // features
    chartEmpty,
    dashboardTitle,
    McChart,
    BgColor, // chart
    styleLabel,
    DataColor,
    ViewSetting,
    styleFunnel, // chart styling
    TooltipSetting,
    CanvasColor
  },
  mixins: [
    postParam,
  ],
  data () {
    return {
      featureData: null,
      canvasCss: {},
      chartName: '',
      changeTitle: false,
      showChartTip: false,
      chartArrs: [],
      mc_insts: [],
      labelOptions: [], // labeled选项列表
      showLoading: false,
      isFeaturesMasked: false,
      tooltipData: [] // tooltip
    };
  },
  computed: {
    ...mapState({
      projectId: state => state.project.projectId,
      worksheetTypes: state => state.project.worksheetTypes,
      worksheetId: state => state.dashboard.worksheetId,
      chart_type: state => state.dashboard.chartType,
      canvasFeatures: state => state.dashboard.canvasFeatures,
      catList: state => state.dashboard.catList,
      aggrList: state => state.dashboard.aggrList,
    }),
    colorList () {
      const colorList = this.mc_insts?.[0]?.config?.colorList || [];
      if (!colorList.length) { return []; }
      const combinedList = [];
      colorList.forEach(({ list }) => {
        list.forEach((el) => {
          if (combinedList.every(i => i.val !== el.val)) {
            combinedList.push(el);
          }
        });
      });
      const combinedColorList = [{
        colors: colorList.reduce((acc, cur) => ({ ...acc, ...cur }), {}),
        list: combinedList,
        ...colorList[0]
      }];
      return combinedColorList;
    }
  },
  watch: {
    canvasFeatures: {
      handler: delayFunc(
        async function () {
          this.clearColorSizeRanges();
          await this.getFeaturesData();
          this.drawChart();
        },
        200
      ),
      deep: true
    },
  },
  methods: {
    ...mapMutations('dashboard', [
      'setCanvasType',
      'setCanvasFeatures',
      'setHasData',
      'setCatList',
      'setAggrList',
    ]),
    changeTooltip (item) {
      console.log(item);
    },
    changeBg (bgCss) {
      this.$set(this.canvasCss, 'bgCss', bgCss);
      this.drawChart();
    },
    // 修改画布标题样式
    changeTitleFont (fontColor) {
      let titleCss = {
        color: fontColor
      };
      this.$set(this.canvasCss, 'titleCss', titleCss);
      this.saveData('css', this.canvasCss);
    },
    resetData () {
      this.setCanvasFeatures({});
      this.canvasCss = {};
      this.chartName = '';
      this.chartArrs = [];
      this.mc_insts = [];
    },
    initData () {
      if (!this.worksheetId) {
        return;
      }
      let res = JSON.parse(sessionStorage.getItem(this.worksheetId));
      this.resetData();
      if (!res) return;
      this.chartName = res.worksheet_title || '';
      this.setCanvasType(this.worksheetTypes[res.worksheet_type]);
      this.setCanvasFeatures(JSON.parse(JSON.stringify(res.features)) || {});
      const resCss = res.css || {};
      if (!resCss.labeled) { resCss.labeled = []; }
      this.canvasCss = resCss;
      setTimeout(() => {
        this.$nextTick(() => {
          // This block sets canvas-features into features comps, then canvasFeatures watcher triggers from comps;
          // trigger draw-chart by canvasFeatures watcher.
          this.bus.$emit('setRow', this.canvasFeatures, this.chart_type);
          this.bus.$emit('setColumn', this.canvasFeatures, this.chart_type);
          this.bus.$emit('setCompare', this.canvasFeatures, this.chart_type);
        });
      }, 0);
    },
    changeColumn (list) {
      // 选中维度时，若有多个度量，清空度量
      if (this.canvasFeatures.y.length > 1 && list.length > 0) {
        this.$refs.row.featureList = [];
        this.$set(this.canvasFeatures, 'y', []);
      }
      this.$set(this.canvasFeatures, 'x', this.setColumnParam(list));
    },
    setColumnParam (list) {
      let arr = [];
      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list[i].length; j++) {
          let obj = {
            name: list[i][j].feature_name
          };
          if (list[i][j].order) {
            obj.order = list[i][j].order;
          }
          arr.push(obj);
        }
      }
      return arr || null;
    },
    changeRow (list) {
      // 选中为多个度量时，清空维度及对比
      const canvasFeatures = Object.assign({}, this.canvasFeatures);
      if (list.length > 1) {
        this.$refs.column.featureList = [];
        const compareCmpnt = this.$refs.compare;
        compareCmpnt.featureList = [];
        compareCmpnt.cmpGroups = [];
        canvasFeatures.x = [];
        canvasFeatures.cmp = {};
        delete canvasFeatures.cmpGroups;
      }
      canvasFeatures.y = this.setRowParam(list);
      this.setCanvasFeatures(canvasFeatures);
    },
    setRowParam (list) {
      return this.setBarRowParam(list); // in postParam mixin, handle feature to [{ feature: { name, legend } }]
    },
    changeCompare ({ cmp }) {
      // 加入对比时，若有多个度量，清空度量
      if (this.canvasFeatures.y.length > 1 && cmp && cmp.name) {
        this.$refs.row.featureList = [];
        this.$set(this.canvasFeatures, 'y', []);
      }
      this.$set(this.canvasFeatures, 'cmp', cmp);
    },
    onCmpGroupsChange (cmpGroups) {
      const canvasFeatures = Object.assign({}, this.canvasFeatures);
      canvasFeatures['cmp-groups'] = cmpGroups;
      if (!cmpGroups || !cmpGroups.length) {
        delete canvasFeatures['cmp-groups'];
      }
      this.setCanvasFeatures(canvasFeatures);
    },
    onLabelColorChange (color) {
      // Set label color
      this.setTextSetting({ fontColor: color });
    },
    onLabelSizeChange (size) {
      // Set label color
      this.setTextSetting({ fontSize: size, lineHeight: size * 1.4 });
    },
    onLabeledChange: delayFunc(function () {
      // Fill new label styles.
      this.setTextSetting({});
    }, 300),
    // 设置 label 样式
    // params { fontSize: 12, fontColor: '', fontStyle: 'italic' }
    setTextSetting (params) {
      const labelsNum = this.canvasCss?.labeled?.length || 0;
      let settingsList = dcDeepClone(this.canvasCss.textSettings);
      settingsList = changeAllLabelsStyle(settingsList, labelsNum, params);
      this.$set(this.canvasCss, 'textSettings', settingsList);
      // draw
      this.drawChart();
    },
    onDataColorChange (params) {
      this.canvasCss = Object.assign({}, this.canvasCss, params);
      this.drawChart();
    },
    onFunnelStyleChange (funnelConfigs) {
      this.canvasCss.funnel = Object.assign({}, this.canvasCss.funnel, funnelConfigs);
      this.drawChart();
    },
    async drawChart () {
      this.clearCanvas();
      const detail = JSON.parse(sessionStorage.getItem(this.worksheetId));
      const featureData = this.featureData;
      if (!detail || !featureData) {
        this.showChartTip = true;
        this.setHasData(false);
        return;
      }
      this.setHasData(true);
      this.showChartTip = false;

      // 获取画图所需的数据和页面元素
      const chartType = this.chart_type;
      let data = null;
      let newData = getDataChartList({
        data: featureData,
        chart_type: chartType,
        canvasCss: detail.css
          ? JSON.parse(JSON.stringify(detail.css))
          : {},
        id: detail.worksheet_id,
        feature_list: JSON.parse(JSON.stringify(detail.features))
      });

      data = newData.data;
      this.chartArrs = newData.chartArrs;
      await this.$nextTick();
      let { chart_size, container_size } = getSize(this.$refs.chartMain, this.canvasCss.dashboard_viewMode, this.chartArrs, false);

      let ins = draw({
        data: data,
        feature_list: this.canvasFeatures, // 维度, 度量等数据
        chart_type: this.chart_type, // map
        canvasCss: this.canvasCss, // 画布CSS
        ids: this.chartArrs.map(d => d.id), // 根据ID找到图表的DOM载体
        chart_size: chart_size, // 图表的大小，格式为{width: 1080, height: 480}，可不提供
        container: container_size, // 可滚动时候提供外div的宽高
      });
      this.mc_insts = ins.instances;
      if (!isObject(ins)) {
        this.chartArrs = [];
        return;
      }
      this.setLabelList(
        ins?.configs?.[0]?.config?.data?.json,
        ins?.configs?.[0]?.config?.data?.compare,
        judgeFeatureType(this.canvasFeatures.cmp?.name)
      );
      // this.configs = ins.configs;
      this.saveData('css', this.canvasCss);
    },
    setLabelList (dataJson = [], dataCompare = [], cmpType) {
      if (!dataJson.length) { return; }
      const labelObj = dataJson[0];
      const list = [];
      const isSystemKey = _key => _key === 'MC-HIDDEN-KEY';
      const isConversion = _key => _key.indexOf('conversion') !== -1;
      for (let key in labelObj) {
        if (isSystemKey(key) || isConversion(key)) { continue; }
        list.push(key);
      }
      if (cmpType === 'int' && dataCompare?.[0]) {
        for (let key in dataCompare?.[0]) {
          if (isSystemKey(key) || isConversion(key)) { continue; }
          if (list.indexOf(key) !== -1) { continue; }
          list.push(key);
        }
      }
      this.labelOptions = list;
      this.canvasCss.labeled = this.canvasCss.labeled.filter(el => list.indexOf(el) !== -1);
    },
    saveData (key, value, flag) {
      let worksheet = JSON.parse(sessionStorage.getItem(this.worksheetId));
      if (worksheet) {
        worksheet[key] = value;
        sessionStorage.setItem(this.worksheetId, JSON.stringify(worksheet));
        if (key === 'css') {
          this.canvasCss.worksheetId = this.worksheetId;
          modifyCss(
            flag,
            { canvasCss: this.canvasCss, projectId: this.projectId },
          );
        }
      }
    },
    // 获取绘图数据
    async getFeaturesData () {
      this.clearCanvas();
      this.showLoading = true;
      const detail = JSON.parse(sessionStorage.getItem(this.worksheetId));
      let param = {
        project_id: this.projectId,
        worksheet_id: detail.worksheet_id,
        dashboard_id: this.dashboardId,
        features: this.canvasFeatures,
        offset: 0,
        limit: 9999
      };
      // param.features = Object.assign({}, param.features, { cmp: { name: 'Age' } });
      this.saveData('features', this.canvasFeatures);
      let dataRes = await post('reviseCanvasFeature', param);
      this.showLoading = false;
      this.featureData = dataRes?.features_data || null;
    },
    clearCanvas () {
      this.chartArrs = [];
      this.mc_insts = [];
    },
    clearColorSizeRanges () {
      this.canvasCss.colorRanges = [];
      this.canvasCss.sizeRanges = [];
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-features {
  flex-shrink: 0;
  box-sizing: border-box;
  position: relative;
  .column,
  .row,
  .compare {
    margin-bottom: 8px;
    min-height: 48px;
    line-height: 48px;
    align-items: center;
    background: #fff;
  }
  .feature-mark {
    position: absolute;
    z-index: 99;
    left: 0;
    top: 0;
    bottom: 8px;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.8);
  }
}
.dashboard_chart_bg {
  position: relative;
  flex-grow: 1;
  // margin: 0px 10px;
  // width: calc(100% - 20px);
  // height: calc(100% - 210px);
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
