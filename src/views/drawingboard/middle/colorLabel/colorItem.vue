<template>
  <div class="item-panel color-panel" :class="isOpenRight">
    <div class="item-left">颜色</div>
    <span
      class="iconfont icon-db_arrow"
      :class="isOpenActive"
      v-if="moreColorList.length"
      @click.stop="isOpen = !isOpen"
    ></span>
    <color-item-right
      :page-len="pageLen"
      :list="colorList"
      :data-symbol="symbol"
      :data-dragging="dragging"
      @remove="removeCapsule"
      @change-aggr="changeAggr"
      @modify-count-rate="changeRate"
      @remove-count="removeCount"
    ></color-item-right>
    <el-collapse-transition>
      <color-item-open-right
        :page-len="pageLen"
        :style="isStyle"
        :data-symbol="symbol"
        :data-dragging="dragging"
        v-if="isOpen"
        :list="moreColorList"
        :len="colorList.length"
        @hide="hideHandler"
        @remove="removeCapsule"
        @change-aggr="change - aggr"
        @modify-count-rate="changeRate"
        @remove-count="removeCount"
      ></color-item-open-right>
    </el-collapse-transition>
    <div class="item-logo">
      <icon-svg icon="#icon-dbc_color" class="logo"></icon-svg>
    </div>
  </div>
</template>
<script>
import ColorItemRight from './item/colorItemRight.vue';
import ColorItemOpenRight from './item/colorItemOpenRight.vue';
import { openMixin } from './mixins/openMixin.js';
import { colorCapsuleMixin } from './mixins/colorCapsuleMixin.js';
import { mapState } from 'vuex';
export default {
  mixins: [openMixin, colorCapsuleMixin],
  data () {
    return {
      symbol: 'axisColorCapsule',
      dragging: 'axisColorDragging',
      pageLen: 2
    };
  },
  components: {
    ColorItemRight,
    ColorItemOpenRight,
  },
  computed: {
    ...mapState('drawingboard', ['rowList', 'columnList', 'canvasType']),
    list () {
      let list = [];
      let tempList =
        this.canvasType === 'bar-rotated' ? this.columnList : this.rowList;
      for (let i = 0; i < tempList.length; i++) {
        if (tempList[i].left || tempList[i].right) {
          let left = tempList[i].left || [];
          let right = tempList[i].right || [];
          for (let j = 0; j < left.length; j++) {
            let obj = JSON.parse(JSON.stringify(left[j]));
            obj.index = i;
            obj.children = j;
            obj.dir = 'left';
            if (obj.color) {
              list.push(obj);
            }
          }
          for (let j = 0; j < right.length; j++) {
            let obj = JSON.parse(JSON.stringify(right[j]));
            obj.index = i;
            obj.children = j;
            obj.dir = 'right';
            if (obj.color) {
              list.push(obj);
            }
          }
        } else {
          let obj = JSON.parse(JSON.stringify(tempList[i]));
          obj.index = i;
          if (obj.color) {
            list.push(obj);
          }
        }
      }
      return list;
    },
    colorList () {
      let dom = document.querySelector('.color-panel');
      if (dom) {
        let width = dom.clientWidth - 180;
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        if (width < 480) this.pageLen = 1;
      }
      return JSON.parse(JSON.stringify(this.list)).splice(0, this.pageLen);
    },
    moreColorList () {
      return JSON.parse(JSON.stringify(this.list)).splice(this.pageLen, this.list.length);
    },
  },
};
</script>
<style lang='scss' scoped>
@import "./scss/item.scss";
</style>
