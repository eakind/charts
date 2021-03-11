<template>
  <div class="mc-chart-bg" :style="curCanvasStyle">
    <div class="title" ref="chartTile" :style="curStyle">{{ title }}</div>
    <div class="dashboard-charts-bg" ref="chartMain">
      <mc-chart
        v-if="showFlag"
        @click.native="clickHandler"
        :chartArrs="chartArrs"
        :showLoading="showLoading"
        :showScaleAxis="showScaleAxis"
        :id="'mc_' + chartType + '_' + workSheetId"
      ></mc-chart>
      <chart-empty v-else :chartType="chartType" />
    </div>
  </div>
</template>
<script>
// #mc_table_d3757ca41d9a11eb9ed0fa163e6b7e99
import { getDataChartList } from '@/utils/draw';
import drawMixin from './mixins/draw.js';
import textDrawMixin from './mixins/textDraw.js';
import actionMixin from './mixins/actionMixin.js';
import McChart from '@/components/dcChart/mcChart.vue';
import { mapState, mapMutations } from 'vuex';
import { isEmpty } from '../../utils/check.js';
export default {
  mixins: [drawMixin, actionMixin, textDrawMixin],
  components: {
    McChart,
  },
  props: {
    workSheetId: {
      type: String,
      default: '',
    },
    needRequest: {
      type: Boolean,
      default: false,
    },
    styleObj: {
      type: Object,
    },
  },
  data () {
    return {
      times: '',
      chartArrs: [],
      currentAction: {},
      chartType: '',
      showFlag: true,
      showLoading: false,
      showScaleAxis: false,
      timer: null
    };
  },
  computed: {
    ...mapState('dashboard', ['workSheetList', 'actionList', 'currentDashboardDetail']),
    ...mapState('project', ['projectId', 'worksheetTypes']),
    ...mapState('dashboard', ['currentDashboard']),
    title () {
      let item = this.workSheetList.find(
        (i) => i.worksheet_id === this.workSheetId
      );
      return item ? item.worksheet_title : '';
    },
  },
  watch: {
    workSheetId: {
      handler (val) {
        if (val) {
          if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
          }
          this.showFlag = false;
          setTimeout(() => {
            this.showFlag = true;
          }, 0);
          this.timer = setTimeout(() => {
            this.drawChartById(val);
          }, 300);
        }
      },
      deep: true,
    },
    needRequest: {
      handler (val) {
        if (val) {
          if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
          }
          this.showFlag = false;
          setTimeout(() => {
            this.showFlag = true;
          }, 0);
          this.timer = setTimeout(() => {
            this.drawChartById();
          }, 300);
        }
      },
      deep: true
    },
  },
  mounted () {
  },
  methods: {
    ...mapMutations('dashboard', ['setWorkSheetList']),
    clickHandler () {
      let actionInfo = JSON.parse(sessionStorage.getItem('userClickItem'));
      sessionStorage.removeItem('userClickItem');
      if (this.actionList.length === 0) return;
      let tempAction = [];
      for (let i in this.actionList) {
        if (this.workSheetId === this.actionList[i].origin_worksheet_id) {
          tempAction.push(this.actionList[i]);
        }
      }
      this.currentAction = this.actionList.find(
        (i) => i.origin_worksheet_id === this.workSheetId
      );
      if (tempAction.length !== 0) {
        for (let i in tempAction) {
          this.modifyAction(tempAction[i], actionInfo);
        }
      }
    },
    async drawChartById (val) {
      this.chartArrs = [];
      let id = val || this.workSheetId;
      let curWorkSheet = this.workSheetList.find((i) => i.worksheet_id === id);
      if (!curWorkSheet) {
        this.$emit('no-chart');
        return;
      }
      let workSheetType = curWorkSheet.worksheet_type;
      let chartType = this.worksheetTypes[workSheetType];
      this.chartType = chartType;
      let { features, css, data } = curWorkSheet;
      let obj = await this.getWorkSheetDetail(id);
      features = obj.features;
      css = obj.css;

      data = await this.getData(id, features, obj.css);
      if (JSON.stringify(features) === '{}' || !data || data.length === 0 || (data[0].feature && data[0].feature.length === 0)) {
        this.showFlag = false;
        curWorkSheet.active = true;
        this.workSheetList.map((i, idx) => {
          if (i.worksheet_id === id) {
            this.$set(this.workSheetList, idx, curWorkSheet);
          }
        });
        return;
      }
      this.showFlag = true;
      let newData = getDataChartList({
        data,
        chart_type: chartType,
        canvasCss: obj.css ? JSON.parse(JSON.stringify(obj.css)) : {},
        id,
        feature_list: JSON.parse(JSON.stringify(features)),
      });
      this.chartArrs = newData.chartArrs;
      await this.$nextTick();
      curWorkSheet = this.workSheetList.find((i) => i.worksheet_id === id);
      curWorkSheet.newData = newData;
      curWorkSheet.data = data;
      curWorkSheet.features = features;
      curWorkSheet.css = css;
      // curWorkSheet.active = true;
      this.workSheetList.map((i, idx) => {
        if (i.worksheet_id === id) {
          this.$set(this.workSheetList, idx, curWorkSheet);
        }
      });
      // this.setWorkSheetList(this.workSheetList);
      this.$nextTick(() => {
        if (isEmpty(this.currentDashboardDetail)) return;
        this.drawChartByItem(curWorkSheet);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.mc-chart-bg {
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  /deep/ .mc-middle {
    &::-webkit-scrollbar {
      height: 0px;
      width: 0px;
      background-color: #f6f6f6;
    }
  }
  &:hover {
    overflow: auto !important;
    /deep/ .mc-middle {
      &::-webkit-scrollbar {
        height: 12px;
        width: 12px;
        background-color: #f6f6f6;
      }
    }
    /deep/ .dashboard_charts {
      overflow: auto !important;
    }
  }
  .title {
    display: block;
    height: 36px;
    line-height: 36px !important;
    padding: 0px 8px;
    box-sizing: border-box;
  }
  .dashboard-charts-bg {
    box-sizing: border-box;
    position: relative;
    padding: 8px;
    height: calc(100% - 36px);
    /deep/ .dashboard_charts {
      height: 100%;
      overflow: hidden;
    }
  }
}
</style>
