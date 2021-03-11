<template>
  <div class="item-panel label-item label-panel" :class="isOpenRight">
    <div class="item-left">标签</div>
    <span
      class="iconfont icon-db_arrow"
      :class="isOpenActive"
      v-if="moreLabelList.length"
      @click.stop="isOpen = !isOpen"
    ></span>
    <label-item-right
      :page-len="pageLen"
      :list="labelList"
      :data-symbol="symbol"
      :data-dragging="dragging"
      @remove="removeCapsule"
      @change-aggr="changeAggr"
      @modify-count-rate="changeRate"
      @label-style-show="labelStyleShow"
      @remove-count="removeCount"
      >>
    </label-item-right>
    <el-collapse-transition>
      <label-item-open-right
        :page-len="pageLen"
        :style="isStyle"
        :len="labelList.length"
        v-if="isOpen"
        :data-symbol="symbol"
        :data-dragging="dragging"
        :list="moreLabelList"
        @hide="hideHandler"
        @remove="removeCapsule"
        @change-aggr="changeAggr"
        @modify-count-rate="changeRate"
        @label-style-show="labelStyleShow"
        @remove-count="removeCount"
        >>
      </label-item-open-right>
    </el-collapse-transition>
    <div class="item-logo" :data-symbol="symbol">
      <icon-svg
        icon="#icon-dbc_textcolor"
        class="logo"
        :data-symbol="symbol"
      ></icon-svg>
    </div>
    <label-style
      v-if="isShowLabelStyle"
      :tooltipData="labelStyleList"
      :is-label="true"
      @close="LabelStyleHide"
      @change-label-style="changeLabelStyle"
    ></label-style>
  </div>
</template>
<script>
import LabelItemRight from './item/labelItemRight.vue';
import LabelItemOpenRight from './item/labelItemOpenRight.vue';
import LabelStyle from '../colorSizeLabel/labelStyle.vue';
import { openMixin } from './mixins/openMixin.js';
import { labelCapsuleMixin } from './mixins/labelCapsuleMixin.js';
import { mapState } from 'vuex';
export default {
  data () {
    return {
      symbol: 'axisLabelCapsule',
      dragging: 'axisLabelsDragging',
      pageLen: 2
    };
  },
  mixins: [openMixin, labelCapsuleMixin],
  components: {
    LabelItemRight,
    LabelItemOpenRight,
    LabelStyle,
  },
  computed: {
    ...mapState('drawingboard', ['rowList', 'columnList', 'canvasType']),
    ...mapState('project', ['legendMap']),
    list () {
      let arr = [];
      let tempList =
        this.canvasType === 'bar-rotated' ? this.columnList : this.rowList;
      for (let i = 0; i < tempList.length; i++) {
        if (tempList[i].left || tempList[i].right) {
          let left = tempList[i].left || [];
          let right = tempList[i].right || [];
          for (let j = 0; j < left.length; j++) {
            if (left[j].labels) {
              let labelList = this.setLabelObj(
                left[j].feature_name,
                left[j].labels,
                i,
                j,
                'left'
              );
              arr = arr.concat(labelList);
            }
          }
          for (let j = 0; j < right.length; j++) {
            if (right[j].labels) {
              let labelList = this.setLabelObj(
                right[j].feature_name,
                right[j].labels,
                i,
                j,
                'right'
              );
              arr = arr.concat(labelList);
            }
          }
        } else {
          if (tempList[i].labels) {
            let labelList = this.setLabelObj(
              tempList[i].feature_name,
              tempList[i].labels,
              i
            );
            arr = arr.concat(labelList);
          }
        }
      }
      return arr;
    },
    labelList () {
      let dom = document.querySelector('.label-panel');
      if (dom) {
        let width = dom.clientWidth - 180;
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        if (width < 480) this.pageLen = 1;
      }
      return JSON.parse(JSON.stringify(this.list)).splice(0, this.pageLen);
    },
    moreLabelList () {
      return JSON.parse(JSON.stringify(this.list)).splice(this.pageLen, this.list.length);
    },
  },
  methods: {
    setLabelObj (name, list, index, children, dir) {
      let arr = [];
      for (let i = 0; i < list.length; i++) {
        if (!list[i]) {
          continue;
        }
        let obj = JSON.parse(JSON.stringify(list[i]));
        obj.index = index;
        obj.children = children;
        obj.dir = dir;
        obj.labelIndex = i;
        obj.parentName = name;
        arr.push(obj);
      }
      return arr;
    },
  },
};
</script>
<style lang='scss' scoped>
@import "./scss/item.scss";
.label-item {
  margin-left: 16px;
}
</style>
