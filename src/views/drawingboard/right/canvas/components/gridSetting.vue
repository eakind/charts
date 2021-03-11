<template>
  <div class="grid-setting">
    <canvas-checked title="网格线" :active="isGrid" @click.native="toggleGrid"></canvas-checked>
    <line-style class="grid-line-style" :line-style="curGridLine.style" @change="changeGrid"></line-style>
    <div v-if="false">
      <canvas-checked title="斜线" :active="isLine" @click.native="toggleLine"></canvas-checked>
      <line-style :line-style="lineStyle" @change="changeLine"></line-style>
    </div>
  </div>
</template>
<script>
import CanvasChecked from './canvasChecked.vue';
import LineStyle from './lineStyle.vue';
import { mapState } from 'vuex';
export default {
  data () {
    return {
      isGrid: true, // 是否显示网格线
      isLine: true, // 是否显示斜线,
      gridStyle: { // 显示网格线样式
        color: '#424242',
        style: 'line',
        thickness: 1
      },
      tempGrid: { // 传出去的网格线样式
        stroke: '#424242',
        'stroke-dasharray': 'line',
        'stroke-width': 1
      },
      lineStyle: { // 斜线样式
        color: '#424242',
        style: 'line',
        thickness: 1
      },
      tempLine: { // 传出去的斜线样式
        stroke: '#424242',
        'stroke-dasharray': 'line',
        'stroke-width': 1
      },
      transform: {
        '0,0': 'line',
        '5,5': 'dot'
      },
      reTransform: {
        line: '0,0',
        dot: '5,5'
      },
      curGridLine: {}
    };
  },
  props: {
    axisStyle: {
      type: Array
    }
  },
  watch: {
    axisStyle: {
      handler (val) {
        if (!val) return;
        if (val.length === 0) return;
        this.curGridLine = val[0].grid.line;
        this.isGrid = this.curGridLine.show;
        // if (!obj.grid_style) return;
        // this.isGrid = obj.grid_show;
        // this.$set(this.gridStyle, 'color', obj.grid_style.stroke);
        // this.$set(this.gridStyle, 'style', this.transform[obj.grid_style['stroke-dasharray']]);
        // this.$set(this.gridStyle, 'thickness', obj.grid_style['stroke-width']);
        // this.tempGrid = JSON.parse(JSON.stringify(obj.grid_style));
        // if (!obj.cutoffShow) return;
        // this.isLine = obj.cutoffShow;
        // this.$set(this.lineStyle, 'color', obj.lineStyle.stroke);
        // this.$set(this.lineStyle, 'style', this.transform[obj.lineStyle['stroke-dasharray']]);
        // this.$set(this.lineStyle, 'thickness', obj.lineStyle['stroke-width']);
        // this.tempLine = JSON.parse(JSON.stringify(obj.lineStyle));
      },
      immediate: true
    }
  },
  computed: {
    ...mapState('project', ['chartType'])
  },
  components: {
    CanvasChecked,
    LineStyle
  },
  mounted () {
  },
  methods: {
    toggleGrid () {
      this.isGrid = !this.isGrid;
      this.curGridLine.show = this.isGrid;
      this.$emit('change', this.curGridLine);
    },
    toggleLine () {
      this.isLine = !this.isLine;
    },
    changeGrid (style) {
      this.curGridLine.style = style;
      this.curGridLine.show = this.isGrid;
      // let obj = {
      //   stroke: style.color,
      //   'stroke-width': style.thickness,
      //   'stroke-dasharray': this.reTransform[style.style]
      // };
      // this.tempGrid = obj;
      this.$emit('change', this.curGridLine);
    },
    changeLine (style) {
      let obj = {
        stroke: style.color,
        'stroke-width': style.thickness,
        'stroke-dasharray': this.reTransform[style.style]
      };
      this.tempLine = obj;
      this.$emit('change', this.tempLine, this.isLine);
    }
  }
};
</script>
<style lang='scss' scoped>
.grid-setting{
  margin-top: 10px;
  display: block;
  .grid-line-style{
    margin: 0px 0px 10px 0px;
    padding: 10px 0px;
    border-bottom: 1px solid #e1e1e1;
  }
}
</style>
