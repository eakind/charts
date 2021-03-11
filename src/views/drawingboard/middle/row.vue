<template>
  <div
    class="dc-container"
    data-symbol="rowCapsule"
    data-dragging="rowDragging"
  >
    <div
      class="container-left"
      data-symbol="rowCapsule"
      data-dragging="rowDragging"
    >
      {{ title }}
    </div>
    <div
      class="container-right"
      data-symbol="rowCapsule"
      data-dragging="rowDragging"
    >
      <span
        class="container-tip"
        v-if="isNoFeature"
        data-symbol="rowCapsule"
        data-dragging="rowDragging"
        >{{ $t("message.drop_features") }}</span
      >
      <group-capsule v-if="isCombined"></group-capsule>
      <dc-capsule
        v-for="(item, index) in rowList"
        :key="index"
        :index="index"
        :item="item"
        type="row"
        data-symbol="rowCapsuleReplace"
        @drill-up="drillUp"
        @drill-down="drillDown"
        @remove="removeCapsule"
        @change-aggr="changeAggr"
        @creat-grouping="creatGrouping"
        @change-split="changeSplit"
        @change-grou-split="changeSplit"
        @cancel-group="cancelGroup"
        @time-combined="timeCombined"
        @cancel-time-group="cancelTimeGroup"
        @modify-count-rate="changeRate"
        @remove-count="removeCount"
        @select-type="selectType"
        @label-style-show="showLabelStyleBox"
        @sortChange="changeCapsuleVal(index, $event, 'order')"
        @clearSort="clearSort(index)"
      ></dc-capsule>
    </div>
    <label-style
      v-if="labelStyle.show"
      :tooltipData="labelStyle.list"
      @close="closeLabelStyleBox"
      @change-label-style="changeLabelStyle"
    ></label-style>
  </div>
</template>
<script>
import DcCapsule from './capsule';
import GroupCapsule from './groupCapsule';
import labelStyle from './colorSizeLabel/labelStyle.vue';
import labelStyleMixins from './mixins/labelStyle.js';
import { mapState, mapMutations } from 'vuex';
import {
  removeFeature,
  changeLegend,
  createGroup,
  cancelGroup,
  changeSplit,
  changeProp,
  changeCapsuleRate,
  removeCapsuleCount,
  clearCapsuleSort,
  changeDrillUp,
  changeDrillDown,
  cancelTimeGroup,
  combinedSplit
} from './utils/capsuleUtils.js';
import { removeStyle, removeCombinedStyle } from '@/utils/utils.js';
export default {
  data () {
    return {
      isCreateGroup: false,
      labelsCapsuleList: [],
    };
  },
  mixins: [labelStyleMixins],
  computed: {
    ...mapState('drawingboard', [
      'rowList',
      'canvasType',
      'catList',
      'currentCanvasDetail',
    ]),
    isNoFeature () {
      return !this.rowList.length && !this.isCombined;
    },
    title () {
      return this.$t('message.rows');
      // return this.canvasType !== 'bar-rotated' ? this.$t('message.rows') : this.$t('dashboard.columns');
    },
    isCombined () {
      return this.canvasType === 'bar-line';
    },
  },
  watch: {
    rowList: {
      handler (list) {
        // 创建状态不需要发送change事件
        if (this.isCreateGroup) {
          this.isCreateGroup = false;
          return;
        }
        if (this.canvasType === 'table') {
          this.labelsCapsuleList = list && list.length > 0 ? JSON.parse(
            JSON.stringify(list.filter((i) => i.dtype === 'AGGR'))
          ) : [];
        }
        this.$emit('change', list);
      },
      deep: true,
    },
  },
  components: {
    DcCapsule,
    GroupCapsule,
    labelStyle,
  },
  mounted () {},
  methods: {
    ...mapMutations('drawingboard', ['setRowList']),
    drillUp (item, index) {
      let list = changeDrillUp(index, this.rowList, this.catList);
      this.setRowList(list);
    },
    drillDown (item, index) {
      let list = changeDrillDown(item, index, this.rowList, this.catList);
      this.setRowList(list);
    },
    changeSplit (split, index) {
      let list = changeSplit(split, index, this.rowList);
      this.setRowList(list);
    },
    cancelGroup (item, index) {
      let list = cancelGroup(item, index, this.rowList);
      this.setRowList(list);
    },
    timeCombined (split, index) {
      let list = combinedSplit(split, index, this.rowList);
      this.setRowList(list);
    },
    cancelTimeGroup (item, index) {
      let list = cancelTimeGroup(item, index, this.rowList);
      this.setRowList(list);
    },
    removeCapsule (index, childIndex, dir) {
      const isRemoveObj = {
        bar: true,
        'bar-line': true,
        line: true
      };
      if (isRemoveObj[this.canvasType]) {
        let css = this.currentCanvasDetail.css;
        if (dir) {
          let key = childIndex;
          if (dir === 'right') {
            key = this.rowList[index].left.length + key;
          }
          removeCombinedStyle(index, key, css.colors);
          removeCombinedStyle(index, key, css.patterns);
        } else {
          removeStyle(index, css.colors);
          removeStyle(index, css.patterns);
        }
      }
      let list = removeFeature(index, childIndex, dir, this.rowList);
      this.setRowList(list);
    },
    changeAggr (legend, probability, index, childIndex, dir) {
      let list = changeLegend(
        legend,
        index,
        childIndex,
        dir,
        probability,
        this.rowList
      );
      this.setRowList(list);
    },
    creatGrouping (item, index) {
      let list = createGroup(item, index, this.rowList);
      this.isCreateGroup = true;
      this.setRowList(list);
    },
    // cancelGroup (item, index) {
    //   let list = cancelGroup(item, index, this.rowList);
    //   this.setRowList(list);
    // },
    changeCapsuleVal (index, val, attr) {
      let list = changeProp({
        index,
        val,
        list: this.rowList,
        attr,
      });
      this.setRowList(list);
    },
    changeRate (rate, index, children, dir) {
      let list = changeCapsuleRate(rate, index, children, dir, this.rowList);
      // 如果是表格，则判断重复
      if (this.canvasType === 'table') {
        list = this.repeatProcess(list);
      }
      this.setRowList(list);
    },
    removeCount (index, children, dir) {
      let list = removeCapsuleCount(index, children, dir, this.rowList);
      // 如果是表格，则判断重复
      // 如果是表格，则判断重复
      if (this.canvasType === 'table') {
        list = this.repeatProcess(list);
      }
      this.setRowList(list);
    },
    clearSort (index) {
      let list = clearCapsuleSort(index, this.rowList);
      this.setRowList(list);
    },
    selectType (type, index, children, dir) {
      let list = JSON.parse(JSON.stringify(this.rowList));
      if (dir) {
        list[index][dir][children].canvasType = type;
        this.setCanvas(list[index][dir][children]);
      } else {
        list[index].canvasType = type;
        this.setCanvas(list[index]);
      }
      this.setRowList(list);
    },
    setCanvas (featureObj) {
      if (!featureObj.color) return;
      if (
        featureObj.color.dtype === 'AGGR' &&
        featureObj.canvasType === 'line'
      ) {
        delete featureObj.color;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./style/rowAndCol.scss";
</style>
