<template>
  <div
    class="menu-list"
    v-click-out="hideList"
    @mousedown.stop=""
    @touchmove.stop=""
    @touchstart.stop=""
  >
    <menu-item
      v-if="isSort"
      txt="排序"
      icon="icon-db_sort"
      iconType="db_sort"
      @click.native="sortHandler"
    ></menu-item>
    <menu-item txt="上钻" icon="icon-db_up" v-if="hasDrillUp" @click.native="drillUp"></menu-item>
    <menu-item txt="下钻" icon="icon-db_up" v-if="hasDrillDown" @click.native="drillDown"></menu-item>
    <menu-item txt="显示类型" icon="icon-db_triangle" v-if="isType">
      <type-list :item="item" v-on="$listeners"></type-list>
    </menu-item>
    <menu-item txt="显示数据" icon="icon-db_triangle" v-if="isPercentFlag">
      <percent-list v-on="$listeners"></percent-list>
    </menu-item>
    <menu-item
      txt="标签格式"
      v-if="
        capsuleType === 'labels' ||
          (canvasType === 'table' &&
            this.item.type === 'NUM' &&
            (capsuleType === 'row' || capsuleType === 'column'))
      "
      @click.native="labelStyleClkProcess"
    >
    </menu-item>
    <menu-item txt="聚合" icon="icon-db_triangle" v-if="isAggr">
      <aggr-list
        :capsuleType="capsuleType"
        :item="item"
        @change-aggr="changeAggr"
        v-on="$listeners"
      ></aggr-list>
    </menu-item>
    <menu-item txt="同比/环比" icon="icon-db_triangle" v-if="isRate">
      <count-list
        v-on="$listeners"
        :item="item"
        :type="capsuleType"
      ></count-list>
    </menu-item>
    <menu-item txt="时间格式" icon="icon-db_triangle" v-if="isTimeFormat">
      <time-list v-on="$listeners"></time-list>
    </menu-item>
    <menu-item
      txt="使用分级特征"
      icon="icon-db_plus"
      v-if="isTimeGroup"
      @click.native="timeCombinedHandler"
    ></menu-item>
    <menu-item
      txt="创建组合特征"
      icon="icon-db_plus"
      v-if="isCombined"
      @click.native="combinedHandler"
    ></menu-item>
    <menu-item
      v-if="matchSize()"
      txt="移除"
      icon="icon-db_trash"
      @click.native="remove"
    ></menu-item>
  </div>
</template>
<script>
import MenuItem from './menuItem.vue';
import AggrList from './menuList/aggrList.vue';
import CountList from './menuList/countList.vue';
import TypeList from './menuList/typeList.vue';
import TimeList from './menuList/timeList.vue';
import percentList from './menuList/percentList.vue';
import { mapState } from 'vuex';
export default {
  components: {
    MenuItem,
    AggrList,
    CountList,
    TypeList,
    TimeList,
    percentList,
  },
  props: {
    item: {
      type: Object,
    },
    isGroup: {
      type: Boolean,
    },
    capsuleType: {
      type: String,
      default: '',
    },
    dataSymbol: {
      type: String,
    },
  },
  computed: {
    ...mapState('drawingboard', [
      'canvasType',
      'sizeCapsuleList',
      'rowList',
      'columnList',
      'currentCanvasDetail',
    ]),
    hasDrillUp () {
      if (this.capsuleType !== 'row' && this.capsuleType !== 'column') return false;
      if (this.item.groupIndex) {
        return true;
      }
      return false;
    },
    hasDrillDown () {
      if (this.capsuleType !== 'row' && this.capsuleType !== 'column') return false;
      if (this.item.groupIndex < (this.item.groupLen - 1)) {
        let list = this.columnList;
        if (this.capsuleType === 'row') {
          if (this.canvasType !== 'bar-rotated') {
            list = this.rowList;
          }
        }
        let index = this.getItemIndex(list);
        let next = index + 1;
        if (!list[next]) {
          return true;
        } else {
          let nextGroupIndex = list[next].groupIndex;
          let groupIndex = this.item.groupIndex;
          if (nextGroupIndex === (groupIndex + 1)) {
            return false;
          }
          return true;
        }
      }
      return false;
    },
    isType () {
      return (
        this.item.type === 'NUM' &&
        this.canvasType === 'bar-line' &&
        this.capsuleType !== 'labels' &&
        this.capsuleType !== 'color'
      );
    },
    isAggr () {
      if (this.canvasType === 'pie' && this.capsuleType === 'labels' && this.item.dtype === 'AGGR') {
        return this.matchSize();
      }
      if (
        this.canvasType === 'map' &&
        this.capsuleType !== 'labels' &&
        this.capsuleType !== 'color' &&
        this.capsuleType !== 'size' &&
        this.item.type === 'NUM'
      ) {
        return false;
      }
      if (this.item.formula_type === 'AGGR') return false;
      return this.item.type === 'NUM' && this.canvasType !== 'area';
    },
    isRate () {
      if (this.canvasType === 'map') {
        return false;
      }
      if (this.canvasType === 'scatter') {
        return false;
      }
      if (this.canvasType === 'table') {
        if (this.item.type === 'NUM') {
          let list = [];
          if (this.capsuleType === 'row' || this.capsuleType === 'column') {
            list = this.capsuleType === 'row' ? this.columnList : this.rowList;
          } else {
            list = [...this.columnList, ...this.rowList];
          }
          return list.find((i) => i.dtype === 'CAT');
        }
        return false;
      }
      return (
        this.item.type === 'NUM' &&
        this.canvasType !== 'area' &&
        this.canvasType !== 'pie' &&
        this.canvasType !== 'bubble'
      );
    },
    isCombined () {
      if (this.canvasType === 'map') {
        return false;
      }
      if (this.canvasType === 'scatter') {
        return false;
      }
      return (
        this.item.type === 'NUM' &&
        this.canvasType !== 'table' &&
        this.canvasType !== 'area' &&
        !this.isGroup &&
        this.canvasType !== 'pie' &&
        this.canvasType !== 'bubble' &&
        this.dataSymbol !== 'axisColorCapsule' &&
        this.dataSymbol !== 'axisLabelCapsule'
      );
    },
    isTimeFormat () {
      // this.capsuleType !== 'labels' &&
      const obj = {
        bar: true,
        'bar-line': true,
        line: true,
        'bar-rotated': true,
      };
      if (obj[this.canvasType] && this.capsuleType === 'labels') {
        return false;
      }
      const otherObj = {
        pie: true,
        scatter: true,
        bubble: true
      };
      if (otherObj[this.canvasType] && this.capsuleType === 'color' && this.item.data_type === 'DATETIME') {
        return true;
      }
      return (
        this.item.data_type === 'DATETIME' &&
        this.capsuleType !== 'color'
      );
    },
    isTimeGroup () {
      if (this.capsuleType === 'labels' || this.capsuleType === 'color') {
        return false;
      }
      const obj = {
        'YEAR,MONTH': true,
        'YEAR,MONTH,DAY': true,
        'YEAR,SEASON': true,
      };
      if (obj[this.item.split]) {
        return (
          this.item.data_type === 'DATETIME' &&
          !this.isGroup &&
          !(this.canvasType === 'pie' || this.canvasType === 'bubble')
        );
      } else {
        return false;
      }
    },
    isPercentFlag () {
      let match = this.matchSize();
      if (
        this.canvasType === 'pie' &&
        !match &&
        this.capsuleType === 'labels'
      ) {
        return true;
      }
      return false;
    },
    isSort () {
      let types = ['map', 'bubble', 'pie', 'scatter'];
      if (
        types.indexOf(this.canvasType) > -1 &&
        this.capsuleType === 'column'
      ) {
        return false;
      }
      if (
        types.indexOf(this.canvasType) > -1 &&
        this.capsuleType === 'labels' &&
        this.item.type === 'CAT'
      ) {
        return false;
      }
      if (types.indexOf(this.canvasType) > -1 && this.capsuleType === 'color') {
        return false;
      }
      return (
        this.item.type === 'CAT' &&
        this.dataSymbol !== 'axisColorCapsule' &&
        this.dataSymbol !== 'axisLabelCapsule'
      );
    },
  },

  mounted () {},
  methods: {
    getItemIndex (list) {
      let index = -1;
      for (let i = 0; i < list.length; i++) {
        if (list[i].feature_name === this.item.feature_name) {
          index = i;
          return index;
        }
      }
      return index;
    },
    matchSize () {
      if (this.canvasType === 'pie' && this.capsuleType === 'labels') {
        let match = this.sizeCapsuleList.find(
          (i) =>
            i.feature_name === this.item.feature_name &&
            i.legend === this.item.legend
        );
        return !match;
      }
      return true;
    },
    drillUp () {
      this.$emit('drill-up', this.item);
    },
    drillDown () {
      this.$emit('drill-down', this.item);
    },
    remove () {
      if (this.canvasType === 'pie' && this.capsuleType === 'size') {
        this.$set(this.currentCanvasDetail.css, 'checked', false);
        this.$set(this.currentCanvasDetail.css, 'originalChecked', false);
      }
      this.$emit('remove');
    },
    hideList () {
      this.$emit('hide');
    },
    combinedHandler () {
      this.$emit('combined');
    },
    timeCombinedHandler () {
      this.$emit('time-combined');
    },
    labelStyleClkProcess () {
      this.$emit('label-style-show');
    },
    sortHandler () {
      this.$emit('sort');
    },
    changeAggr (key, probability) {
      // let match = this.sizeCapsuleList.find(
      //   (i) => i.feature_name === this.item.feature_name && i.legend === key
      // );
      // if (!match) {
      //   if (this.currentCanvasDetail.css) {
      //     this.$set(this.currentCanvasDetail.css, 'checked', false);
      //     this.$set(this.currentCanvasDetail.css, 'originalChecked', false);
      //   }
      // }
      this.$emit('change-aggr', key, probability);
    },
  },
};
</script>
<style lang="scss" scoped>
.menu-list {
  width: 100%;
  min-width: 100px;
  z-index: 4; // 99999;
  border: 1px solid #dedede;
  background-color: white;
  position: relative;
  > div {
    cursor: pointer;
    line-height: 25px;
    padding: 5px 10px;
    position: relative;
  }
  .count {
    width: 100%;
    box-sizing: border-box;
    background-color: white;
    right: -100%;
    position: absolute;
    > div {
      cursor: pointer;
      padding: 5px 0px;
    }
  }
}
</style>
