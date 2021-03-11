<template>
  <div class="bar-chart">
  </div>
</template>
<script>
import * as G2 from '@antv/g2';
import { bar } from '../utils/shape';
import axis from '../utils/axis';
import tooltip from '../utils/tooltip';
export default {
  data () {
    return {
    };
  },
  props: {
    chartData: {
      type: [Array, Object]
    },
    chartFeature: {
      type: [Object]
    }
  },
  watch: {
    chartData: {
      handler (val) {
        console.log(val);
      },
      deep: true
    },
  },
  mounted () {
    // this.initChart();
  },
  methods: {
    initChart () {
      const chart = new G2.Chart({
        container: this.id,
        autoFit: true,
        defaultInteractions: ['tooltip', 'ellipsis-text'],
        renderer: 'svg', // 指定渲染引擎，默认是cavnas
      });
      tooltip(chart, true);
      bar(chart, '市', '门店数', {});
      axis(chart, '门店数', 'left', {});
    }
  }
};
</script>
<style lang='scss' scoped>
.bar-chart{
}
</style>
