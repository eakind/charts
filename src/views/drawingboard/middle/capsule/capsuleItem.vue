<template>
  <dc-drag
    class="capsule"
    :class="isNoDrag"
    :data-symbol="dataSymbol"
    :parentIndex="parentIndex"
    :index="index"
    :type="type"
    :name="item.feature_name"
    @stopDrag="stopDrag"
  >
    <capsule-name
      class="capsule-name"
      :data-symbol="dataSymbol"
      :index="index"
      :parentIndex="parentIndex"
      :item="item"
      :item-type="item.type"
      :type="type"
      :name="item.feature_name"
    >
    </capsule-name>
    <span
      class="iconfont icon-db_triangle capsule-iconfont"
      :data-symbol="dataSymbol"
      :class="openMenu"
      :type="type"
      :name="item.feature_name"
      :index="index"
      :parentIndex="parentIndex"
      @click="isOpenMenu = !isOpenMenu"
    >
    </span>
    <el-collapse-transition>
      <menu-list
        class="menu-list"
        v-if="isOpenMenu"
        :style="listPos"
        :data-symbol="dataSymbol"
        :capsuleType="type"
        :item="item"
        :isGroup="isGroup"
        @drill-up="drillUp"
        @drill-down="drillDown"
        @hide="hideList"
        @change-percent="changePercent"
        @sort="sortHandler"
        @change-aggr="changeAggr"
        @show-calculate="showCalculate"
        @show-count-box="showCountBox"
        @remove="removeHandler"
        @combined="combinedHandler"
        @edit-probability="editProbability"
        @change-split="changeSplit"
        @time-combined="timeCombinedHandler"
        @remove-count="removeCount"
        @label-style-show="labelStyleShow"
        @select-type="selectType"
      >
      </menu-list>
    </el-collapse-transition>
  </dc-drag>
</template>
<script>
import DcDrag from '@/components/dcdrag/dcDrag.vue';
import CapsuleName from './capsuleItem/capsuleName.vue';
import MenuList from './capsuleItem/menuList.vue';
export default {
  data () {
    return {
      isOpenMenu: false,
    };
  },
  computed: {
    openMenu () {
      return this.isOpenMenu ? 'open-active' : '';
    },
    listPos () {
      let top = this.$el.clientHeight + 1;
      return {
        top: top + 'px',
      };
    },
    isNoDrag () {
      return this.noDrag ? 'none-pointer' : '';
    }
  },
  props: {
    noDrag: {
      type: Boolean,
      default: false
    },
    dataSymbol: {
      type: String,
    },
    // 胶囊的数据信息
    item: {
      type: Object,
    },
    // 胶囊下标
    index: {
      type: Number,
    },
    // 属于行还是列
    type: {
      type: String,
    },
    // 是否是组合胶囊
    isGroup: {
      type: Boolean,
      default: false,
    },
    // 组合胶囊左右方向
    dir: {
      type: String,
    },
    parentIndex: {
      type: Number,
    },
  },
  components: {
    DcDrag,
    CapsuleName,
    MenuList,
  },
  mounted () {},
  methods: {
    hideList () {
      setTimeout(() => {
        this.isOpenMenu = false;
      }, 0);
    },
    removeCount () {
      this.isOpenMenu = false;
      this.$emit('remove-count', this.index, this.dir);
    },
    showCountBox (countType, capsuleType) {
      this.$emit(
        'show-count-box',
        countType,
        capsuleType,
        this.index,
        this.dir
      );
    },
    drillUp (obj) {
      this.isOpenMenu = false;
      this.$emit('drill-up', obj);
    },
    drillDown (obj) {
      this.isOpenMenu = false;
      this.$emit('drill-down', obj);
    },
    changeAggr (legend, probability) {
      this.$emit('change-aggr', legend, legend === 'PERCENTILE' ? probability : null, this.index, this.dir);
      this.isOpenMenu = false;
    },
    changeSplit (split) {
      this.$emit('change-split', split, this.index);
      this.isOpenMenu = false;
    },
    timeCombinedHandler () {
      this.$emit('time-combined', this.item.split, this.index);
    },
    stopDrag (el, target) {
      this.removeHandler();
    },
    removeHandler () {
      this.isOpenMenu = false;
      this.$emit('remove', this.index, this.dir);
    },
    combinedHandler () {
      this.isOpenMenu = false;
      this.isCombined = true;
      this.$emit('creat-grouping', this.item, this.index);
    },
    selectType (val) {
      this.isOpenMenu = false;
      this.$emit('select-type', val, this.index, this.dir);
    },
    changePercent (obj) {
      this.$emit('change-percent', obj);
    },
    editProbability (item, key, probability) {
      this.$showConfirmBox({
        title: '分位数设置',
        message: '可设置范围为0~1（不包含1）',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        hasInput: true,
        inputValue: probability,
        confirm: (value) => {
          var reg = /0\.[0-9]+/;
          if (Number(value) !== 0) {
            if (!reg.test(Number(value))) {
              this.$message({
                message: '请输入0-1(不包含1)的数',
                type: 'error'
              });
              return;
            }
          }
          this.changeAggr(key, Number(value));
          this.$closeConfirmBox();
        }
      });
    },
    sortHandler () {
      this.$emit('sort');
    },
    labelStyleShow () {
      this.$emit('label-style-show');
    },
  },
};
</script>
<style lang='scss' scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.capsule {
  height: 30px;
  line-height: 30px;
  // width: 7.8vw;
  min-width: 140px;
  max-width: 192px;
  display: inline-block;
  box-sizing: border-box;
  border-radius: 4px;
  position: relative;
  margin-right: 10px;
  background-color: #4284f5;
  position: relative;
  // margin: auto;
  .iconfont {
    width: 20px;
    color: white;
    display: inline-block;
    position: absolute;
    right: 3px;
    cursor: pointer;
    pointer-events: auto;
    transition: 0.3s;
  }
  .open-active {
    right: 3px;
    transform: rotate(-180deg);
  }
  .menu-list {
    top: 30px;
    left: 0px;
    pointer-events: auto;
    position: absolute;
  }
}
.none-pointer{
  pointer-events: none;
}
</style>
