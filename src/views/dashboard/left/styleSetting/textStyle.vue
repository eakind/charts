<template>
  <!-- 文本样式 -->
  <div class="text-style-wrap">
    <div class="flex">
      <span class="iconfont icon-dbc_textcolor"></span>
      <div class="title">文本</div>
    </div>
    <color-set
      title="文字颜色"
      :showSelectBox="false"
      :styleObj="title.colorStyle"
      :bgSelected="title.colorStyle.bgSelected"
      @changeColor="changeFontColor('title', $event)"
    ></color-set>
    <color-set
      title="文本大小"
      :hasBorder="true"
      :list="fontSizeList"
      :bgSelected="title.fontSize"
      :showColor="false"
      @changeColor="changeFontSize"
    ></color-set>
    <text-set
      type="font"
      :val="title.fontStyle"
      @update:val="fontStyleProcess"
    ></text-set>
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
    <padding-set
      :padding="title.padding"
      :isLock="title.isLock"
      @changePadding="changePadding('title', $event)"
    ></padding-set>
    <color-set
      title="边框"
      :hasBorder="true"
      :isBorder="true"
      :list="borderList"
      :styleObj="title.border"
      :bgSelected="title.border.bgSelected"
      @changeColor="changeBorderColor('title', $event)"
    ></color-set>
  </div>
</template>
<script>
import colorSet from './moduleSets/color.vue';
import textSet from './moduleSets/text.vue';
import paddingSet from './moduleSets/padding.vue';
import textMixins from './mixins/text.js';
import indexMixins from './mixins/index.js';
export default {
  name: 'textStyle',
  components: {
    colorSet,
    textSet,
    paddingSet,
  },
  mixins: [textMixins, indexMixins],
  mounted () {
    this.initStyle();
  },
};
</script>
<style lang="scss" scoped>
.flex {
  display: flex;
  align-items: center;
}
.text-style-wrap {
  font-size: 12px;
  color: hsl(0, 0%, 25.9%);
  .flex {
    margin-bottom: 0.6em;
  }
  .iconfont {
    color: hsl(0, 0%, 87.1%);
  }
  .title {
    color: hsl(0, 0%, 25.9%);
    margin-left: 0.3em;
  }
}
</style>
