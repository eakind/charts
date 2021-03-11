<template>
  <div class="global-style">
    <div class="global">
      <title-set title="展板整体" :showCheckBox="false"></title-set>
      <device-set v-model="device"></device-set>
      <size-set
        @changeSize="changeSize"
        :sizeObj="dashboard.size"
        :modeType="dashboard.modeType"
        v-if="device === 'pc'"
      ></size-set>
      <mobile-set
        v-if="device === 'mobile'"
        @changeSize="changeMobileSize"
        :sizeObj="dashboard.mobileSize"
      >
      </mobile-set>
      <color-set
        title="背景颜色"
        :bgSelected="dashboard.bgColor.bgSelected"
        :styleObj="dashboard.bgColor"
        :showPresetColor="true"
        :idx="dashboard.bgColor.index"
        @changeColor="changeColor('dashboard', $event, true)"
        @change="changePresetColor"
      ></color-set>
      <padding-set
        :padding="dashboard.padding"
        :isLock="dashboard.isLock"
        @changePadding="changePadding('dashboard', $event)"
      ></padding-set>
      <color-set
        title="边框"
        :hasBorder="true"
        :isBorder="true"
        :list="borderList"
        :bgSelected="dashboard.border.bgSelected"
        :styleObj="dashboard.border"
        @changeColor="changeBorderColor('dashboard', $event)"
      ></color-set>
    </div>
    <div class="global-title">
      <title-set title="展板标题" v-model="title.showFlag"></title-set>
      <color-set
        title="文字颜色"
        :showSelectBox="false"
        :bgSelected="true"
        :styleObj="title.colorStyle"
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
        :bgSelected="title.bgColor.bgSelected"
        :styleObj="title.bgColor"
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
    <div>
      <title-set title="画布图例" v-model="isShowLegend"></title-set>
    </div>
  </div>
</template>
<script>
import titleSet from './moduleSets/title.vue';
import colorSet from './moduleSets/color.vue';
import textSet from './moduleSets/text.vue';
import paddingSet from './moduleSets/padding.vue';
import sizeSet from './moduleSets/size.vue';
import deviceSet from './moduleSets/device.vue';
import mobileSet from './moduleSets/mobile.vue';
import globalMixins from './mixins/global.js';
import indexMixins from './mixins/index.js';
import { refreshCanvasMixin } from '../../boardLayout/mixins/refreshCanvas';
export default {
  name: 'globalStyle',
  components: {
    titleSet,
    colorSet,
    paddingSet,
    sizeSet,
    textSet,
    deviceSet,
    mobileSet
  },
  mixins: [globalMixins, indexMixins, refreshCanvasMixin],
  mounted () {
    this.initStyle();
  },
};
</script>
<style lang="scss" scoped>
.global,
.global-title {
  border-bottom: 1px solid #e1e1e1;
  margin-bottom: 0.6em;
}
</style>
