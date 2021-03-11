<template>
  <div class="filter-style-wrap">
    <div class="flex">
      <div class="icon-box"></div>
      <div class="title">{{currentFilter.filter_name}}</div>
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

import { mapState, mapActions } from 'vuex';
import indexMixins from './mixins/index.js';

// import picMixins from './mixins/pic.js';
// import indexMixins from './mixins/index.js';
export default {
  name: 'filterStyle',
  data () {
    return {
      title: {
        showFlag: true,
        colorStyle: {
          bgSelected: true,
          background: '#000',
          opacity: 100,
        },
        fontSize: 14,
        textAlign: 'left',
      },
      global: {
        bgColor: {
          bgSelected: false,
        },
        border: {
          bgSelected: 'none',
        },
      }
    };
  },
  components: {
    titleSet,
    colorSet,
    textSet,
  },
  mixins: [indexMixins],
  mounted () {
    this.initStyle();
  },
  computed: {
    ...mapState('dashboard', ['currentTarget', 'selectedTarget', 'filterUniqueList']),
    currentFilter () {
      let cur = this.filterUniqueList.filter(item => {
        return item.filter_id === this.selectedTarget.filterId;
      });
      return cur[0];
    }
  },
  methods: {
    ...mapActions('dashboard', ['setTargetCss']),
    initStyle () {
      if (!this.currentTarget.style) {
        this.emitSetCss('title', this.title);
        this.emitSetCss('global', this.global);
        return;
      }
      if (!this.currentTarget.style.global) {
        this.emitSetCss('global', this.global);
      }
      this.title = JSON.parse(JSON.stringify(this.currentTarget.style.title));
      this.global = JSON.parse(JSON.stringify(this.currentTarget.style.global));
    },
    emitSetCss (attr, css) {
      this.setTargetCss({ attr, css, projectId: this.projectId });
    },
  }
};
</script>
<style lang="scss" scoped>
.flex {
  display: flex;
  align-items: center;
}
.filter-style-wrap {
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
