<template>
  <div
    :data-symbol="isCombinedClass ? dataSymbol : type + 'Capsule'"
    class="capsule-combined capsule-box"
    :class="isCombinedClass"
    :type="type"
    :name="item.feature_name"
  >
    <span
      class="capsule-insert insert-left"
      :index="index"
      :type="type"
      :data-symbol="`${type}CapsuleCombinedLeft`"
      v-if="isInsert"
    >
      置左
    </span>
    <capsule-item
      :data-symbol="dataSymbol"
      class="capsule-item"
      :class="isCat"
      :item="item"
      :index="index"
      :type="type"
      :noDrag="noDrag"
      v-if="isNoGroup&&!isTimeGroup"
      @drill-up="drillUp"
      @drill-down="drillDown"
      @change-percent="changePercent"
      @change-aggr="changeAggr"
      @change-split="changeSplit"
      @creat-grouping="creatGrouping"
      @remove="removeHandler"
      @show-count-box="showCountBoxProcess"
      @remove-count="removeCount"
      @time-combined="timeCombinedHandler"
      @sort="sortHandler"
      @label-style-show="labelStyleShow"
      @select-type="selectType"
    ></capsule-item>
    <capsule-group
      v-if="!isNoGroup&&!isTimeGroup"
      :left-list="leftList"
      :right-list="rightList"
      :type="type"
      :index="index"
      @change-aggr="changeAggr"
      @remove="removeHandler"
      @show-count-box="showCountBoxProcess"
      @remove-count="removeCount"
      @label-style-show="labelStyleShow"
      @select-type="selectType"
    ></capsule-group>
    <time-capsule-group
      v-if="isTimeGroup"
      :item="item"
      :index="index"
      :type="type"
      @change="changeGroupSplit"
    ></time-capsule-group>
    <span
      class="capsule-insert insert-right"
      :index="index"
      :type="type"
      :data-symbol="`${type}CapsuleCombinedRight`"
      v-if="isInsert"
    >
      置右
    </span>
    <span
      class="capsule-insert right"
      :index="index"
      :type="type"
      :data-symbol="`${type}CapsuleCombinedRight`"
      v-if="isInsertOne"
    >
      请放入数值特征
    </span>
    <span
      class="iconfont icon-db_triangle"
      :class="isGroupMenu ? 'open-active' : ''"
      v-if="!isNoGroup  && !isTimeGroup"
      @click.stop="isGroupMenu = !isGroupMenu"
    ></span>
    <span
      class="iconfont icon-db_triangle"
      :class="isTimeGroupMenu ? 'open-active' : ''"
      v-if="isTimeGroup"
      @click.stop="isTimeGroupMenu=!isTimeGroupMenu"
    ></span>
    <el-collapse-transition>
      <group-menu
        v-if="isGroupMenu"
        :isInsert="isInsert"
        :isCombined="isCombined"
        @creat-grouping="creatGrouping"
        @cancel-group="cancelGroup"
        @hide="hideHandler"
        @remove="removeHandler"
      ></group-menu>
    </el-collapse-transition>
    <el-collapse-transition>
      <time-group-menu
        v-if="isTimeGroupMenu"
        @cancel-time-group="cancelTimeGroup"
        @remove="removeHandler"
        @hide="hideHandler"
      ></time-group-menu>
    </el-collapse-transition>
    <template v-if="showCountBox">
      <component
        :is="countDialogPare[curCountType]"
        :item="item"
        :capsuleType="curCapsuleType"
        @close="showCountBox = false"
        @sure="countSureHandler"
      ></component>
    </template>
    <template v-if="showSort">
      <capsule-sort @close="showSort=false" v-on="$listeners" :item="item"></capsule-sort>
    </template>
  </div>
</template>
<script>
import CapsuleItem from './capsule/capsuleItem.vue';
import CapsuleGroup from './capsule/capsuleGroup.vue';
import GroupMenu from './capsule/groupMenu.vue';
import chainRatio from './capsule/countList/chainRatio.vue';
import yoy from './capsule/countList/yoy.vue';
import TimeCapsuleGroup from './capsule/timeCapsuleGroup.vue';
import TimeGroupMenu from './capsule/timeGroupMenu.vue';
import CapsuleSort from './capsule/capsuleSort.vue';
export default {
  data () {
    return {
      leftList: [], // 左边胶囊列表
      rightList: [], // 右边胶囊列表
      isCombined: false, // 是否是组合特征
      isGroupMenu: false,
      isTimeGroupMenu: false, // 时间分级菜单
      showCountBox: false,
      curCountType: '',
      curCapsuleType: '',
      dir: '',
      children: '',
      countDialogPare: {
        RING: chainRatio,
        ON: yoy,
      },
      showSort: false
    };
  },
  props: {
    noDrag: {
      type: Boolean,
      default: false
    },
    item: {
      type: [Object, Array],
    },
    index: {
      type: Number,
    },
    type: {
      type: String,
    },
    dataSymbol: {
      type: String
    }
  },
  computed: {
    isCat () {
      return this.item.dtype === 'CAT' ? 'cat-item' : '';
    },
    isInsert () {
      if (this.item.left && this.item.right) {
        return this.item.left && this.item.right && this.isCombined;
      }
      return false;
    },
    isInsertOne () {
      if (this.item.left) {
        return this.item.left.length && !this.item.right && this.isCombined;
      }
      return false;
    },
    isCombinedClass () {
      if (this.item.left) {
        return this.item.left.length || this.item.right.length
          ? 'combined-active'
          : '';
      }
      if (this.item.split instanceof Array) {
        return 'time-combime-active';
      }
      return '';
    },
    isNoGroup () {
      return !this.item.left && !this.item.right;
    },
    isTimeGroup () {
      return this.item.split instanceof Array;
    }
  },
  watch: {
    item: {
      handler (obj) {
        this.rightList = [];
        this.leftList = [];
        if (obj.left && obj.right) {
          if (
            this.judeLen(obj.left, this.leftList) &&
            this.judeLen(obj.right, this.rightList)
          ) {
            this.isCombined = false;
          }
        }
        if (obj.left) {
          this.leftList = obj.left;
        }
        if (obj.right) {
          this.rightList = obj.right;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  components: {
    CapsuleItem,
    CapsuleGroup,
    GroupMenu,
    chainRatio,
    TimeCapsuleGroup,
    TimeGroupMenu,
    CapsuleSort
  },
  mounted () {},
  methods: {
    drillUp (obj) {
      this.$emit('drill-up', obj, this.index);
    },
    drillDown (obj) {
      this.$emit('drill-down', obj, this.index);
    },
    cancelGroup () {
      this.isCombined = false;
      this.isGroupMenu = false;
      this.rightList = [];
      this.leftList = [];
      this.$emit('cancel-group', this.item, this.index);
    },
    hideHandler () {
      setTimeout(() => {
        this.isGroupMenu = false;
        this.isTimeGroupMenu = false;
      }, 0);
    },
    changePercent (obj) {
      this.$emit('change-percent', obj);
    },
    judeLen (list1, list2) {
      if (!list2.length) return true;
      return list1.length === list2.length;
    },
    changeAggr (legend, probability, index, childIndex, dir) {
      this.$emit('change-aggr', legend, legend === 'PERCENTILE' ? probability : null, this.index, childIndex, dir);
    },
    timeCombinedHandler (split, index) {
      this.$emit('time-combined', split, index);
    },
    changeSplit (split, index) {
      if (!index && index !== 0) return;
      this.$emit('change-split', split, index);
    },
    creatGrouping () {
      setTimeout(() => {
        this.isCombined = true;
        this.isGroupMenu = false;
      }, 0);
      this.$emit('creat-grouping', this.item, this.index);
    },
    cancelTimeGroup () {
      this.isTimeGroupMenu = false;
      this.$emit('cancel-time-group', this.item, this.index);
    },
    changeGroupSplit (item, index) {
      let splitGroup = JSON.parse(JSON.stringify(this.item.split));
      splitGroup.splice(index, 1, item);
      this.$emit('change-split', splitGroup, this.index);
    },
    removeHandler (index, dir) {
      this.isGroupMenu = false;
      this.$emit('remove', this.index, index, dir);
    },
    /**
     * 修改同比环比
     */
    countSureHandler (rate) {
      this.showCountBox = false;
      this.$emit('modify-count-rate', rate, this.index, this.children, this.dir);
    },
    showCountBoxProcess (countType, capsuleType, index, children, dir) {
      this.showCountBox = true;
      this.curCountType = countType;
      this.curCapsuleType = capsuleType;
      this.dir = dir;
      this.children = children;
    },
    removeCount (index, children, dir) {
      this.$emit('remove-count', index, children, dir);
    },
    sortHandler () {
      this.showSort = true;
    },
    labelStyleShow () {
      this.$emit('label-style-show');
    },
    selectType (val, index, children, dir) {
      this.$emit('select-type', val, index, children, dir);
    }
  },
};
</script>
<style lang='scss' scoped>
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

.capsule-combined {
  display: flex;
  height: 30px;
  line-height: 30px;
  margin: 2px 0px;
  .cat-item {
    background-color: #03b98c;
  }
}
.combined-active {
  height: 36px;
  line-height: 35px;
  padding: 0px 2px;
  border: 1px solid #4284f5;
  border-radius: 4px;
  box-sizing: border-box;
  position: relative;
  padding-right: 32px;
  margin-right: 10px;
  .capsule-item {
    margin-right: 15px;
  }
  .capsule-insert {
    width: 140px;
    border-radius: 4px;
    padding: 0px 3px;
    box-sizing: border-box;
    text-align: center;
    display: inline-block;
    top: -1px;
    position: relative;
    color: #cccccc;
    font-weight: 200;
  }
  .insert-right {
    width: 60px;
    text-align: center;
    margin: 0px 0px 0px 3px;
  }
  .insert-left {
    width: 60px;
    text-align: center;
    margin-right: 3px;
  }
  .icon-db_triangle {
    color: #cccccc;
    right: 6px;
    cursor: pointer;
    position: absolute;
    display: inline-block;
    transition: 0.3s;
  }
}
.time-combime-active{
  height: 36px;
  line-height: 35px;
  padding: 0px 2px;
  border: 1px solid #03B98C;
  border-radius: 4px;
  box-sizing: border-box;
  position: relative;
  padding-right: 32px;
  margin-right: 10px;
  .time-capsule-group {
    margin-right: 4px;;
  }
  .icon-db_triangle{
    color: #cccccc;
    right: 8px;
    cursor: pointer;
    position: absolute;
    display: inline-block;
    transition: 0.3s;
  }
}
.open-active{
  transform: rotate(-180deg);
}
</style>
