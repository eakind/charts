<template>
  <div
    class="dc-container"
    data-symbol="columnCapsule"
    data-dragging="columnDragging"
  >
    <template v-if="canvasType === 'map'">
      <map-column-left
        class="container-left"
        @on-map-type-change="mapTypeChange"
      ></map-column-left>
    </template>
    <div
      v-else
      class="container-left"
      data-symbol="columnCapsule"
      data-dragging="columnDragging"
    >
      {{ title }}
    </div>

    <div
      class="container-right"
      data-symbol="columnCapsule"
      data-dragging="columnDragging"
    >
      <span
        class="container-tip"
        data-symbol="columnCapsule"
        data-dragging="columnDragging"
        v-if="isNoFeature"
      >
        {{ text }}
      </span>
      <map-lo-lat v-if="mapIsLoAndLat"></map-lo-lat>
      <template v-else>
        <dc-capsule
          v-for="(item, index) in columnList"
          :key="index"
          :item="item"
          :index="index"
          data-symbol="columnCapsuleReplace"
          @drill-up="drillUp"
          @drill-down="drillDown"
          @remove="removeCapsule"
          @change-aggr="changeAggr"
          @creat-grouping="creatGrouping"
          @change-split="changeSplit"
          @cancel-group="cancelGroup"
          @time-combined="timeCombined"
          @change-grou-split="changeSplit"
          @cancel-time-group="cancelTimeGroup"
          @label-style-show="showLabelStyleBox"
          @modify-count-rate="changeCapsuleVal(index, $event, 'rate')"
          @remove-count="removeCount"
          @sortChange="changeCapsuleVal(index, $event, 'order')"
          @clearSort="clearSort(index)"
          type="column"
        ></dc-capsule>
      </template>
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
import { mapState, mapMutations } from 'vuex';
import {
  removeFeature,
  changeLegend,
  createGroup,
  cancelGroup,
  changeProp,
  changeSplit,
  combinedSplit,
  cancelTimeGroup,
  changeCapsuleRate,
  removeCapsuleCount,
  clearCapsuleSort,
  changeDrillUp,
  changeDrillDown,
} from './utils/capsuleUtils';
import mapColumnLeft from './mapColumnLeft';
import mapLoLat from './mapLoLat';
import labelStyle from './colorSizeLabel/labelStyle.vue';
import labelStyleMixins from './mixins/labelStyle.js';
import { removeStyle, removeCombinedStyle } from '@/utils/utils.js';
export default {
  data () {
    return {
      isCreateGroup: false,
      mapIsLoAndLat: false,
      labelsCapsuleList: [],
    };
  },
  mixins: [labelStyleMixins],
  computed: {
    ...mapState('drawingboard', ['columnList', 'canvasType', 'catList']),
    ...mapState('project', ['legendMap']),
    isNoFeature () {
      return !this.columnList.length;
    },
    text () {
      if (this.canvasType !== 'map') {
        return this.$t('dashboard.drop_features');
      }
      return this.mapIsLoAndLat ? '' : this.$t('dashboard.mapTips');
    },
    title () {
      return this.$t('dashboard.columns');
      // return this.canvasType === 'bar-rotated' ? this.$t('message.rows') : this.$t('dashboard.columns');
    },
  },
  watch: {
    columnList: {
      handler (list) {
        // 创建状态不需要发送change事件
        if (this.isCreateGroup) {
          this.isCreateGroup = false;
          return;
        }
        if (this.canvasType === 'table') {
          this.labelsCapsuleList =
            list && list.length > 0
              ? JSON.parse(
                JSON.stringify(list.filter((i) => i.dtype === 'AGGR'))
              )
              : [];
        }
        this.$emit('change', list);
      },
      deep: true,
    },
  },
  components: {
    DcCapsule,
    mapColumnLeft,
    mapLoLat,
    labelStyle,
  },
  mounted () {},
  methods: {
    ...mapMutations('drawingboard', ['setColumnList']),
    drillUp (item, index) {
      let list = changeDrillUp(index, this.columnList, this.catList);
      this.$emit('on-remove-map-label', item);
      if (this.canvasType === 'map') {
        this.bus.$emit('capsuleChange', 'col', list);
      }
      this.setColumnList(list);
    },
    drillDown (item, index) {
      let list = changeDrillDown(item, index, this.columnList, this.catList);
      this.setColumnList(list);
    },
    timeCombined (split, index) {
      let list = combinedSplit(split, index, this.columnList);
      this.setColumnList(list);
    },
    changeSplit (split, index) {
      let list = changeSplit(split, index, this.columnList);
      this.setColumnList(list);
    },
    removeCapsule (index, childIndex, dir) {
      if (this.canvasType === 'bar-rotated') {
        let css = this.currentCanvasDetail.css;
        if (dir) {
          let key = childIndex;
          if (dir === 'right') {
            key = this.columnList[index].left.length + key;
          }
          removeCombinedStyle(index, key, css.colors);
          removeCombinedStyle(index, key, css.patterns);
        } else {
          removeStyle(index, css.colors);
          removeStyle(index, css.patterns);
        }
      }
      let item = JSON.parse(JSON.stringify(this.columnList))[index];
      let list = removeFeature(index, childIndex, dir, this.columnList);
      this.$emit('on-remove-map-label', item);
      this.setColumnList(list);
    },
    changeAggr (legend, probability, index, childIndex, dir) {
      let list = changeLegend(
        legend,
        index,
        childIndex,
        dir,
        probability,
        this.columnList
      );
      this.setColumnList(list);
    },
    creatGrouping (item, index) {
      let list = createGroup(item, index, this.columnList);
      this.isCreateGroup = true;
      this.setColumnList(list);
    },
    cancelGroup (item, index) {
      let list = cancelGroup(item, index, this.columnList);
      this.setColumnList(list);
    },
    cancelTimeGroup (item, index) {
      let list = cancelTimeGroup(item, index, this.columnList);
      this.setColumnList(list);
    },
    mapTypeChange (flag) {
      this.mapIsLoAndLat = flag;
      this.$emit('change-map-type', flag);
    },
    changeCapsuleVal (index, val, attr) {
      let list = changeProp({
        index,
        val,
        list: this.columnList,
        attr,
      });
      // 如果是表格，则判断重复 attr rate
      if (this.canvasType === 'table' && attr === 'rate') {
        list = this.repeatProcess(list);
      }
      this.setColumnList(list);
    },
    changeRate (rate, index, children, dir) {
      let list = changeCapsuleRate(rate, index, children, dir, this.columnList);
      this.setColumnList(list);
    },
    removeCount (index, children, dir) {
      let list = removeCapsuleCount(index, children, dir, this.columnList);
      // 如果是表格，则判断重复
      if (this.canvasType === 'table') {
        list = this.repeatProcess(list);
      }
      this.setColumnList(list);
    },
    clearSort (index) {
      let list = clearCapsuleSort(index, this.columnList);
      this.setColumnList(list);
    },
  },
};
</script>
<style lang="scss" scoped>
@import './style/rowAndCol.scss';
</style>
