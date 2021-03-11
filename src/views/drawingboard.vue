<template>
  <div class="drawing-board">
    <drawingboard-left></drawingboard-left>
    <component :is="currentChartComp" :ref="currentChartComp" />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
// 图表DOM
import McChart from '@/components/dcChart/mcChart';
import McTable from './drawingboard/chart/table';
import McPie from './drawingboard/chart/pie';
import McBar from './drawingboard/chart/bar';
import McLine from './drawingboard/chart/line';
import McBarRotated from './drawingboard/chart/barRotated';
import McBarLine from './drawingboard/chart/barLine';
import McScatter from './drawingboard/chart/scatter';
import McBubble from './drawingboard/chart/bubble';
import McMap from './drawingboard/chart/map';
// svg 2 png download
import { downloadImage } from '@/utils/domSaver';
import DrawingboardLeft from './drawingboard/drawingboardLeft';
import { isEmpty } from '@/utils/check';
export default {
  components: {
    McChart,
    DrawingboardLeft,
    // McFunnel,
    // McArea,
    McTable,
    McPie,
    McBar,
    McLine,
    McBarLine,
    McBarRotated,
    McScatter,
    McBubble,
    McMap,
  },
  data () {
    return {
      chartComps: { // 新的图表，在以图表命名的组件内渲染
        table: 'mc-table',
        pie: 'mc-pie',
        bar: 'mc-bar',
        line: 'mc-line',
        'bar-line': 'mc-bar-line',
        'bar-rotated': 'mc-bar-rotated',
        scatter: 'mc-scatter',
        bubble: 'mc-bubble',
        map: 'mc-map'
      },
      height: null
    };
  },
  computed: {
    ...mapState('drawingboard', ['canvasList', 'canvasType', 'currentCanvasDetail', 'chartArrys', 'rowList']),
    ...mapState('project', ['worksheetTypes']),
    currentChartComp () {
      let type = this.canvasType === 'bar' ? 'line' : 'bar';
      if (!isEmpty(this.currentCanvasDetail)) {
        type = this.canvasType;
      }
      return this.chartComps[type];
    }
  },
  mounted () {
    this.$on('initData', this.initData);
    // 监听图片下载
    this.bus.$on('saveChart', obj => {
      this.downloadPNG({
        type: obj.format,
        flag: obj.all && this.chartArrys.length > 1,
        backgroundColor: obj.format === 'jpg' ? '#ffffff' : 'transparent'
      });
    });
    // 监听更新画布过滤器
    this.bus.$on('update-chart-for-filter', () => {
      let canvasCss = this.$refs[this.currentChartComp].canvasCss;
      canvasCss.colorRanges && canvasCss.colorRanges.map((m, index) => {
        let range = [];
        m.range.forEach((i, idx) => {
          if (canvasCss.colorRanges[index].check[idx]) {
            range[idx] = i;
          }
        });
        canvasCss.colorRanges[index].range = range;
      });
      const chartTarget = this.$refs[this.currentChartComp];
      chartTarget.getChartData ? chartTarget.delayFunc(true) : chartTarget.shakeDrawChart();
    });
    // 监听formula 返回画布重新画图
    this.bus.$on('formula-refresh-data', () => {
      const chartTarget = this.$refs[this.currentChartComp];
      chartTarget.getChartData ? chartTarget.delayFunc(true) : chartTarget.shakeDrawChart();
    });
    // 监听删除formula
    this.bus.$on('delete-formula-refresh', (name) => {
      this.$refs[this.currentChartComp].initData(name);
    });
  },
  destroyed () {
    this.bus.$off('update-chart-for-filter');
    this.bus.$off('saveChart');
    this.setCanvasType('');
  },
  methods: {
    ...mapMutations('drawingboard', ['setCanvasType', 'setColumnList', 'setRowList', 'setSizeCapsuleList', 'setColorCapsuleList', 'setLabelsCapsuleList']),
    initData () {
      if (isEmpty(this.currentCanvasDetail)) return;
      this.setCanvasType(this.worksheetTypes[this.currentCanvasDetail.worksheet_type]);
      setTimeout(() => {
        if (this.currentChartComp) {
          if (isEmpty(this.currentCanvasDetail)) return;
          this.$refs[this.currentChartComp] && this.$refs[this.currentChartComp].initData();
        }
      }, 0);
    },
    clearData () {
      this.setColumnList([]);
      this.setRowList([]);
      this.setSizeCapsuleList([]);
      this.setColorCapsuleList([]);
      this.setLabelsCapsuleList([]);
      this.setCanvasType('');
    },
    async downloadPNG ({
      type = 'png',
      flag = false,
      backgroundColor = 'transparent'
    }) {
      // required: node, isMap; optional: name, size, type, flag(下载整个画布)
      Array.from(document.querySelectorAll('.scale-axis')).forEach(
        n => (n.style.visibility = 'hidden')
      );
      let nodes = !flag
        ? this.chartArrys.map(c => `#${c.id}`)
        : ['.dashboard_charts'];

      if (!flag) {
        if (this.chartComps[this.canvasType]) {
          let key = this.canvasType.slice(0, 1).toUpperCase() + this.canvasType.slice(1);
          this.chartArrys = JSON.parse(sessionStorage.getItem('mc' + key + 'Chart'));
          nodes = this.chartArrys.map(c => `#${c.id}`);
        }
      }
      var tableNomalBg = Array.from(document.querySelectorAll('.ag-layout-normal')).map(
        n => n.style.background
      );
      var tableBalhamBg = Array.from(document.querySelectorAll('.ag-theme-balham')).map(
        n => n.style.background
      );
      var tableCellBg = Array.from(document.querySelectorAll('.ag-cell')).map(
        n => n.style.background
      );
      if (type === 'png') {
        Array.from(document.querySelectorAll('.ag-layout-normal')).forEach(
          n => (n.style.background = 'none')
        );
        Array.from(document.querySelectorAll('.ag-theme-balham')).forEach(
          n => (n.style.background = 'none')
        );
        Array.from(document.querySelectorAll('.ag-cell')).forEach(
          n => (n.style.background = 'none')
        );
      }
      this.height = document.querySelector('.dashboard_charts').scrollHeight;
      let size = {
        height: flag ? this.height : ''
      };
      nodes.forEach(async (node, i) => {
        var selector;
        if (!flag) {
          selector = `${node} .mc-middle`;
        } else {
          selector = `${node}`;
        }
        var height = Array.from(document.querySelectorAll(selector)).map(
          n => n.style.height
        );
        if (flag) {
          document.querySelector(node).style.overflow = 'visible';
        }
        Array.from(document.querySelectorAll(selector)).forEach(
          n => (n.style.overflow = 'visible')
        );
        Array.from(document.querySelectorAll(selector)).forEach(
          n => (n.style.height = '')
        );
        let chartName = this.currentCanvasDetail ? this.currentCanvasDetail.worksheet_title : '';
        let res = await downloadImage({
          node: node,
          name: `${chartName}-${this.canvasType}${
            i > 0 ? -i : ''
            }.${type}`, // optional
          size: size, // optional
          backgroundColor: backgroundColor, // optional
          errorMsg: this.$i18n.t('message.save_image_error'),
          tableRows: this.rowList.length - 1
        });
        if (flag) {
          document.querySelector(node).style.overflow = 'auto';
        }
        if (type === 'png') {
          Array.from(document.querySelectorAll('.ag-layout-normal')).forEach(
            (n, i) => (n.style.background = tableNomalBg[i])
          );
          Array.from(document.querySelectorAll('.ag-theme-balham')).forEach(
            (n, i) => (n.style.background = tableBalhamBg[i])
          );
          Array.from(document.querySelectorAll('.ag-cell')).forEach(
            (n, i) => (n.style.background = tableCellBg[i])
          );
        }
        Array.from(document.querySelectorAll('.scale-axis')).forEach(
          n => (n.style.visibility = 'visible')
        );
        Array.from(document.querySelectorAll(selector)).forEach(
          n => (n.style.overflow = 'auto')
        );
        Array.from(document.querySelectorAll(selector)).forEach(
          (n, i) => (n.style.height = height[i])
        );
        this.bus.$emit('downloadPNG', res);
      });
    }
  }
};
</script>

<style scoped lang="scss">
.drawing-board {
  @include wh100;
  display: flex;
  overflow: hidden;
  min-width: 1280px;
  background-color: #f6f6f6;
}
</style>
