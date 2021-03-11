<template>
  <div class="capsule-group" :class="setMinClass">
    <capsule-item
      :class="isLastLeft(leftIndex)"
      :style="setLeftWidth"
      dir="left"
      :item="leftItem"
      :index="leftIndex"
      :type="type"
      :parent-index="index"
      :isGroup="true"
      :data-symbol="leftDataSymbol"
      v-for="(leftItem, leftIndex) in leftList"
      :key="leftIndex"
      @show-count-box="showCountBoxProcess"
      @remove-count="removeCount"
      @change-aggr="changeAggr"
      @label-style-show="labelStyleShow"
      @select-type="selectType"
      @remove="removeHandler"
    ></capsule-item>
    <capsule-item
      :class="isLastRight(rightIndex)"
      :style="setRightWidth"
      dir="right"
      :item="rightItem"
      :index="rightIndex"
      :type="type"
      :isGroup="true"
      :data-symbol="rightDataSymbol"
      :parent-index="index"
      v-for="(rightItem, rightIndex) in rightList"
      :key="rightIndex"
      @show-count-box="showCountBoxProcess"
      @remove-count="removeCount"
      @change-aggr="changeAggr"
      @label-style-show="labelStyleShow"
      @select-type="selectType"
      @remove="removeHandler"
    ></capsule-item>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import CapsuleItem from './capsuleItem.vue';
export default {
  data () {
    return {};
  },
  props: {
    leftList: {
      type: Array,
    },
    rightList: {
      type: Array,
    },
    type: {
      type: String,
    },
    index: {
      type: Number,
    },
  },
  components: {
    CapsuleItem,
  },
  computed: {
    ...mapState('drawingboard', ['canvasType']),
    leftDataSymbol () {
      return `${this.type}LeftCapsuleReplace`;
    },
    rightDataSymbol () {
      return `${this.type}RightCapsuleReplace`;
    },
    setRightWidth () {
      let rightLen = this.rightList.length;
      let totalLen = this.leftList.length + rightLen;
      let rightWidth = (this.groupMaxWidth * rightLen / totalLen) / rightLen;
      return {
        width: `${rightWidth}px`
      };
    },
    setLeftWidth () {
      let leftLen = this.leftList.length;
      let totalLen = this.rightList.length + leftLen;
      let leftWidth = (this.groupMaxWidth * leftLen / totalLen) / leftLen;
      return {
        width: `${leftWidth}px`
      };
    },
    groupMaxWidth () {
      let dom = document.querySelector('.container-right');
      let width = dom.clientWidth - 300;
      return width;
    },
    setMinClass () {
      return 'group-min-class';
    }
  },
  mounted () {
  },
  methods: {
    isLastLeft (index) {
      if (index === this.leftList.length - 1) {
        return 'left-capsule';
      }
      return '';
    },
    isLastRight (index) {
      if (index === this.rightList.length - 1) {
        return 'right-capsule';
      }
      return '';
    },
    changeAggr (legend, probability, index, dir) {
      this.$emit('change-aggr', legend, probability, this.index, index, dir);
    },
    removeHandler (index, dir) {
      this.$emit('remove', index, dir);
    },
    showCountBoxProcess (countType, capsuleType, index, dir) {
      this.$emit(
        'show-count-box',
        countType,
        capsuleType,
        this.index,
        index,
        dir
      );
    },
    removeCount (index, dir) {
      this.$emit('remove-count', this.index, index, dir);
    },
    selectType (val, index, dir) {
      this.$emit('select-type', val, this.index, index, dir);
    },
  },
};
</script>
<style lang='scss' scoped>
.capsule-group {
  display: inline-block;
  position: relative;
  max-height: 100%;
  .left-capsule {
    margin-right: 16px;
    &::after {
      width: 1px;
      height: 35px;
      right: -10px;
      top: -2px;
      content: "";
      border-left: 2px solid #4284f5;
      display: inline-block;
      position: absolute;
    }
  }
  .right-capsule {
    margin-right: 0px;
  }
}
.group-min-class{
  /deep/ .capsule {
    min-width: 0px;
  }
  /deep/ .capsule-name {
    padding: 0px;
    max-width: 20px;
    min-width: calc(100% - 20px);
  }
}
</style>
