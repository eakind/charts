<template>
  <!-- 画布样式 -->
  <div class="canvas-style-wrap">
    <div class="flex">
      <span
        class="iconfont"
        :class="newWorksheetTypesIconMap[workSheetType]"
      ></span>
      <div class="title">当前选择的画布</div>
    </div>
    <div class="title-box">
      <title-set title="组件标题" v-model="title.showFlag"></title-set>
      <color-set
        title="文字颜色"
        :showSelectBox="false"
        :bgSelected="title.colorStyle.bgSelected"
        :styleObj="title.colorStyle"
        @changeColor="changeFontColor('title', $event)"
      ></color-set>
      <color-set
        title="标题大小"
        :hasBorder="true"
        :list="fontSizeList"
        :bgSelected="title.fontSize"
        :showColor="false"
        @changeColor="changeFontSize"
      ></color-set>
      <text-set
        type="align"
        title="文本对齐"
        :val.sync="title.textAlign"
      ></text-set>
      <color-set
        title="背景颜色"
        :styleObj="title.bgColor"
        :bgSelected="title.bgColor.bgSelected"
        @changeColor="changeColor('title', $event)"
      ></color-set>
    </div>
    <div class="chart-box">
      <title-set title="图表组件" :showCheckBox="false"></title-set>
      <color-set
        title="画布视图"
        :hasBorder="true"
        :list="curModeList"
        :bgSelected="chart.mode || 'standard'"
        :showColor="false"
        @changeColor="changeMode"
      ></color-set>
      <color-set
        title="背景颜色"
        :styleObj="chart.bgColor"
        :bgSelected="chart.bgColor.bgSelected"
        @changeColor="changeColor('chart', $event)"
      ></color-set>
    </div>
    <div class="global-box">
      <title-set title="组件整体" :showCheckBox="false"></title-set>
      <padding-set
        :padding="global.padding"
        :isLock="global.isLock"
        @changePadding="changePadding('global', $event)"
      ></padding-set>
      <color-set
        title="边框"
        :hasBorder="true"
        :isBorder="true"
        :list="borderList"
        :bgSelected="global.border.bgSelected"
        :styleObj="global.border"
        @changeColor="changeBorderColor('global', $event)"
      ></color-set>
    </div>
  </div>
</template>
<script>
import titleSet from './moduleSets/title.vue';
import colorSet from './moduleSets/color.vue';
import textSet from './moduleSets/text.vue';
import paddingSet from './moduleSets/padding.vue';
import canvasMixins from './mixins/canvas.js';
import indexMixins from './mixins/index.js';

export default {
  name: 'canvasStyle',
  components: {
    titleSet,
    colorSet,
    textSet,
    paddingSet,
  },
  mixins: [canvasMixins, indexMixins],
  data () {
    return {
      workSheetType: '',
      curModeList: []
    };
  },
  watch: {
    'currentTarget.worksheetId': {
      handler (val) {
        this.initStyle(val);
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  align-items: center;
}
.canvas-style-wrap {
  font-size: 12px;
  color: hsl(0, 0%, 25.9%);
  .iconfont {
    color: hsl(0, 0%, 87.1%);
  }
  .title {
    color: hsl(0, 0%, 25.9%);
    margin-left: 0.3em;
  }
  .title-box,
  .chart-box {
    border-bottom: 1px solid #e1e1e1;
    margin-bottom: 0.6em;
  }
}
</style>
