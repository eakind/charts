<template>
  <div class="pic-style-wrap">
    <div class="flex">
      <div class="icon-box"></div>
      <div class="title">图例名称</div>
    </div>
    <div class="title-box">
      <title-set title="组件标题" v-model="title.showFlag"></title-set>
      <color-set
        title="文字颜色"
        :showSelectBox="false"
        :styleObj="title.colorStyle"
        :bgSelected="title.colorStyle.bgSelected"
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
    </div>
    <div class="global-box">
      <title-set title="组件整体" :showCheckBox="false"></title-set>
      <color-set title="背景颜色" :styleObj="global.bgColor" :bgSelected="global.bgColor.bgSelected"
        @changeColor="changeColor('global', $event)"></color-set>
      <color-set
        title="边框"
        :hasBorder="true"
        :isBorder="true"
        :list="borderList"
        :styleObj="global.border"
        :bgSelected="global.border.bgSelected"
        @changeColor="changeBorderColor('global', $event)"
      ></color-set>
    </div>
  </div>
</template>
<script>
import titleSet from './moduleSets/title.vue';
import colorSet from './moduleSets/color.vue';
import textSet from './moduleSets/text.vue';

import picMixins from './mixins/pic.js';
import indexMixins from './mixins/index.js';
export default {
  name: 'picStyle',
  components: {
    titleSet,
    colorSet,
    textSet,
  },
  mixins: [indexMixins, picMixins],
  mounted () {
    this.initStyle();
  }
};
</script>
<style lang="scss" scoped>
.flex {
  display: flex;
  align-items: center;
}
.pic-style-wrap {
  font-size: 12px;
  color: hsl(0, 0%, 25.9%);
  .icon-box {
    width: 14px;
    height: 14px;
    background-color: hsl(0, 0%, 87.1%);
    border-radius: 4px;
    margin-right: 0.8em;
  }
  .title-box {
    border-bottom: 1px solid #e1e1e1;
    margin-bottom: 0.6em;
  }
}
</style>
