<template>
  <div class="dc-chart">
    <!-- <chart-title
      class="chart-header"
      v-if="chartTitle"
      :chart-title="chartTitle"
    ></chart-title> -->
      <component
      v-if="hasData"
      :class="chartBody"
      :is="currentChart[chartType]"
      :ref="currentChart[chartType]"
      :chartData="chartData"
      :id="chartStyle.id"
    ></component>
    <empty-chart v-else :chartType="chartType"></empty-chart>

  </div>
</template>
<script>
import ChartTitle from './components/chartTitle.vue';
import EmptyChart from './components/emptyChart.vue';
import BarChart from './components/barChart.vue';
import PieChart from './components/pieChart.vue';
import mcChart from './components/mcChart.vue';
import GeometryDrawingProcess from './draw/index.js';
// import { getComponents } from './utils/util.js';
export default {
  components: {
    ChartTitle,
    BarChart,
    EmptyChart,
    PieChart,
    mcChart,
  },
  data () {
    return {
      currentChart: {
        bar: 'barChart',
        pie: 'pieChart',
        bubble: 'mcChart',
        scatter: 'mcChart',
        map: 'mcChart',
        table: 'mcChart'
      },
      instance: null,
      vueCharts: ['pie'],
    };
  },
  props: {
    chartTitle: {
      type: String,
      default: '',
    },
    // 图表类型
    chartType: {
      type: String,
      default: 'bar',
    },
    // 图表样式
    chartStyle: {
      type: Object,
    },
    // 图表数据
    chartData: {
      type: [Object, Array],
    },
    // 图表特征
    chartFeature: {
      type: [Object]
    }
  },
  mounted () {
    setTimeout(() => {
      console.log('title', this.ChartTitle, 'type', this.chartType, 'style', this.chartStyle, 'data', this.chartData, 'feature', this.chartFeature);
    }, 1000);
  },
  computed: {
    hasData () {
      return true;
    },
    chartBody () {
      return 'chart-body';
      // return this.chartTitle ? 'chart-body' : 'full-body';
    },
  },
  methods: {
    draw () {
      this.$nextTick(() => {
        this.instance = GeometryDrawingProcess(
          this.chartType,
          this.chartData,
          this.chartStyle
        );
        this.instance.draw();
      });
    },
    /**
     * type: 更新属性
     * data 如果是更新数据，则需要传入新的数据
     */
    update (type, data) {
      this.instance.chartUpdate(type, data);
    },
    getColorList () {
      return this.instance.getColorList();
    },
    getDomain () {
      return this.instance.getDomain();
    }
  },
};
</script>
<style lang="scss" scoped>
.dc-chart {
   height: calc(100% - 50px);
    width: 100%;
  position: relative;
  // .chart-header {
  //   height: 50px;
  //   line-height: 50px;
  // }
  .chart-body {
    height:100%;// calc(100% - 50px);
    width: 100%;
  }
  // .full-body {
  //   height: 100%;
  //   width: 100%;
  // }
}
</style>
