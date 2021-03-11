<template>
  <dc-collapse-item :title="$t('dashboard.scale')">
    <div class="scale-setting">
      <!-- <canvas-checked title="刻度文字" :active="isScale"></canvas-checked> -->
      <font-style :has-dir="true" @change="changeFont" :title-css="titleCss"></font-style>
      <scale-range :scope-list="scopeList" @change="changeRange"></scale-range>
    </div>
  </dc-collapse-item>
</template>
<script>
import CanvasChecked from './components/canvasChecked.vue';
import FontStyle from './components/fontStyle.vue';
import ScaleRange from './components/scaleRange.vue';
export default {
  data () {
    return {
      isScale: true,
      titleCss: {
        fontSize: 14,
        fontColor: '#6B6B6B'
      },
      scopeList: [], // 范围列表
      scaleList: [], // 刻度文字列表
    };
  },
  props: {
    axisStyle: {
      type: Object
    }
  },
  watch: {
    axisStyle: {
      handler (obj) {
        if (!obj) return;
        let scaleObj = obj.scaleList[0];
        if (!scaleObj) return;
        this.$set(this.titleCss, 'fontSize', scaleObj.fontSize);
        this.$set(this.titleCss, 'fontColor', scaleObj.color);
        this.$set(this.titleCss, 'rotate', scaleObj.rotate);
        this.scopeList = JSON.parse(JSON.stringify(obj.scopeList));
        this.scaleList = JSON.parse(JSON.stringify(obj.scaleList));
      },
      immediate: true
    }
  },
  components: {
    CanvasChecked,
    FontStyle,
    ScaleRange
  },
  mounted () {
  },
  methods: {
    // 更改刻度字体样式
    changeFont (fontColor, fontSize, direct) {
      this.$set(this.titleCss, 'fontSize', fontSize);
      this.$set(this.titleCss, 'fontColor', fontColor);
      this.$set(this.titleCss, 'rotate', direct);
      for (let i = 0; i < this.scaleList.length; i++) {
        this.scaleList[i].fontSize = fontSize;
        this.scaleList[i].color = fontColor;
        this.scaleList[i].rotate = direct;
      }
      this.$emit('change', this.scaleList, this.scopeList);
    },
    // 更改刻度范围跟对齐方式
    changeRange (scopeList) {
      this.scopeList = JSON.parse(JSON.stringify(scopeList));
      this.$emit('change', this.scaleList, this.scopeList);
    }
  }
};
</script>
<style lang='scss' scoped>
.scale-setting {
  display: block;
  padding-bottom: 10px;
}
</style>
