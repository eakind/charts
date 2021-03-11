<template>
  <div
    class="layout-item"
    :id="itemData.idx"
    :data-idx="itemData.idx"
    :class="[isDraggingClass, isActiveClass]"
    @click.stop="selectedTargetHandler(itemData)"
    @mouseover.stop="mouseHover"
    @mouseout.stop="mouseOut"
  >
    <slot></slot>
    <layout-item
      v-for="(item, index) in itemData.children"
      :key="index"
      :style="setStyle(item)"
      :list="list"
      :item-data="item"
      :client-x="clientX"
      :client-y="clientY"
      :layout-idx="layoutIdx"
      :is-dragging="isDragging"
      :is-in-layout="isInLayout"
      :selected-target="selectedTarget"
      @change="changeHandler"
      @dblclick.native.stop="showEditor(item)"
      @select="selectedTargetHandler"
      @cancel-select="cancelSelectedHandler"
      @del="delHandler"
      @swap-comp="swapCompHandler"
      @set-layout-item="setCurrentLayoutItem"
    >
      <mc-chart
        :work-sheet-id="item.worksheetId"
        :style-obj="item.style"
        @no-chart="noChart(item)"
        v-if="!item.isEmpty && item.type === 'canvas'"
        :need-request="item.needRequest"
      ></mc-chart>
      <text-chart
        :showFlag.sync="showTextEditFlag"
        :selected-target="selectedTarget"
        :item-data="item"
        :id="item.idx"
        :style-obj="item.style"
        :show-edit="isEditText"
        @close="closeEdit"
        v-if="!item.isEmpty && item.type === 'text'"
      ></text-chart>
      <filter-chart
        :filterId="item.filterId"
        :filterType="item.filterType"
        :style-obj="item.style"
        v-if="!item.isEmpty && item.type === 'filter'"
      ></filter-chart>
      <dashboard-title
        :showFlag.sync="showTextEditFlag"
        :selected-target="selectedTarget"
        :item-data="item"
        v-if="!item.isEmpty && item.type === 'title'"
      ></dashboard-title>
      <resize-line
        :layout-idx="layoutIdx"
        v-if="isResizeLine(item, index, list)"
        :item-data="item"
        :is-dragging="isDragging"
        :client-x="clientX"
        :client-y="clientY"
        :is-in-layout="isInLayout"
        @set-layout-item="setCurrentLayoutItem"
        @mouseup.native="mouseUp"
        @mousedown.native.stop="mouseDown($event, item)"
      ></resize-line>
      <menu-btn
        v-if="isMenuList(item)"
        :item-data="item"
        :style="isMenuPosition(item)"
        @set-text="setTextHandler"
        @cancel-select="cancelSelectedHandler"
        @del="delHandler(item)"
      ></menu-btn>
      <drag-icon
        v-if="isDrag(item)"
        :item-data="item"
        @swap-comp="swapCompHandler"
      ></drag-icon>
    </layout-item>
  </div>
</template>
<script>
import McChart from '../../mcChart.vue';
import TextChart from '../../textChart.vue';
import FilterChart from '../../filterChart';
import DashboardTitle from '../../dashboardTitle.vue';
import MenuBtn from './menuBtn.vue';
import ResizeLine from './resizeLine.vue';
import { boardMixin } from '../mixins/boardMixin.js';
import DragIcon from './dragIcon.vue';
import { mapState } from 'vuex';
export default {
  name: 'LayoutItem',
  mixins: [boardMixin],
  components: {
    McChart,
    MenuBtn,
    ResizeLine,
    TextChart,
    DashboardTitle,
    DragIcon,
    FilterChart,
  },
  data () {
    return {
      showTextEditFlag: false
    };
  },
  props: {
    itemData: {
      type: Object,
    },
    list: {
      type: Array,
    },
    clientX: {
      type: Number,
    },
    clientY: {
      type: Number,
    },
    isDragging: {
      type: Boolean,
    },
    selectedTarget: {
      type: Object,
    },
    isInLayout: {
      type: Boolean,
    },
    layoutIdx: {
      type: [Object, Number, String]
    }
  },
  computed: {
    ...mapState('dashboard', ['currentDashboardDetail']),
    idx () {
      return this.itemData.idx;
    },
    isActiveClass () {
      if (!this.itemData || !this.selectedTarget) return '';
      return this.itemData.idx === this.selectedTarget.idx
        ? 'is-layout-active'
        : '';
    },
    isDraggingClass () {
      if (!this.isDragging) {
        return '';
      }
      if (this.layoutIdx === this.itemData.idx) return '';
      if (this.itemData && this.itemData.type === 'title') {
        this.$emit('set-layout-item', this.itemData, 'title');
        return '';
      }
      if (this.itemData.isEmpty) {
        this.$emit('set-layout-item', this.itemData);
        return '';
      }
      const dom = this.$el;
      const left = dom.getBoundingClientRect().left;
      const right = dom.getBoundingClientRect().right;
      const top = dom.getBoundingClientRect().top;
      const bottom = dom.getBoundingClientRect().bottom;
      // 最小边距
      const most = 20;
      // 相对于元素X轴位置,相对于元素Y轴位置
      const pageX = this.clientX - left;
      const pageY = this.clientY - top;
      // 鼠标是否在元素里面
      const isInner =
        this.clientX > left + most &&
        this.clientX < right - most &&
        this.clientY > top + most &&
        this.clientY < bottom - most;
      // 元素宽度 元素高度
      const width = dom.clientWidth;
      const height = dom.clientHeight;
      let isDir = '';
      if (this.currentDashboardDetail.css.device === 'mobile') {
        if (pageY < height / 2 && isInner) {
          isDir = 'top';
        } else if (pageY > height / 2 && isInner) {
          isDir = 'bottom';
        } else {
          isDir = '';
        }
      } else {
        // 最上边
        const isTopMost = pageY < most && isInner;
        // 最下边
        const isBottomMost = pageY > height - most && isInner;
        // 最左边
        const isLeftMost = pageX < most && isInner;
        // 最右边
        const isRightMost = pageX > width - most && isInner;
        // 左边
        const isLeft =
          pageX < width / 2 &&
          pageX > most &&
          isInner &&
          !isTopMost &&
          !isBottomMost;
        // 右边
        const isRight =
          pageX > width / 2 &&
          pageX < width - most &&
          isInner &&
          !isTopMost &&
          !isBottomMost;
        // 上边
        const isTop =
          pageY < height / 3 &&
          pageY > most &&
          isInner &&
          !isLeftMost &&
          !isRightMost;
        // 下边
        const isBottom =
          pageY > (height * 2) / 3 &&
          pageY < height - most &&
          isInner &&
          !isLeftMost &&
          !isRightMost;
        if (isLeft) isDir = 'left';
        if (isRight) isDir = 'right';
        if (isTop) isDir = 'top';
        if (isBottom) isDir = 'bottom';
      }
      const dirObj = {
        top: 'up-active',
        bottom: 'down-active',
        left: 'left-active',
        right: 'right-active',
      };
      if (isInner) {
        // eslint-disable-next-line vue/no-async-in-computed-properties
        setTimeout(() => {
          this.$emit('set-layout-item', this.itemData, isDir);
        }, 0);
      }
      return dirObj[isDir];
    },
  },
  mounted () {},
  methods: {
    swapCompHandler (originIdx, targetIdx) {
      this.$emit('swap-comp', originIdx, targetIdx);
    },
    changeHandler (list) {
      this.$emit('change', list);
    },
    setCurrentLayoutItem (item, isDir) {
      this.$emit('set-layout-item', item, isDir);
    },
    selectedTargetHandler (item) {
      if (item.isEmpty) return;
      this.$emit('select', item);
    },
    cancelSelectedHandler () {
      this.$emit('cancel-select');
    },
    delHandler (item) {
      this.$emit('del', item);
    },
    noChart (item) {
      this.$emit('del', item);
    },
    mouseHover () {
      if (this.itemData.isEmpty) return;
      this.$el.style.border = '2px solid rgba(0,0,0, 0.1)';
    },
    mouseOut () {
      this.$el.style.border = 'none';
      this.$el.parentNode.style.border = 'none';
    },
  },
};
</script>
<style lang="scss" scoped>
@mixin mask {
  content: '';
  background-color: rgba($color: #f5f9fe, $alpha: 0.8);
  outline: 1px solid #4284f5;
  position: absolute;
  z-index: 99;
}
.layout-item {
  height: 34%;
  display: flex;
  user-select: none;
  position: relative;
  &:hover{
    &::after {
      content: '';
      width: 100%;
      height: 50%;
      display: inline-block;
      position: absolute;
      bottom: -50%;
      max-height: 100px;
    }
  }
}
.up-active {
  &::before {
    width: 100%;
    height: 50%;
    top: 0px;
    @include mask;
  }
}
.down-active {
  &::before {
    width: 100%;
    height: 50%;
    bottom: 0px;
    @include mask;
  }
}
.left-active {
  &::before {
    width: 50%;
    height: 100%;
    left: 0px;
    @include mask;
  }
}
.right-active {
  &::before {
    width: 50%;
    height: 100%;
    right: 0px;
    @include mask;
  }
}
.is-layout-active {
  border: 2px solid #666666 !important;
}
</style>
