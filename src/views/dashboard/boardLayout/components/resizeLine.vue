<template>
  <div
    class="resize-line"
    ref="resizeLine"
    @click.stop=""
    :class="[isPositionClass, isInsertClass, isFull]"
    :style="setPosition"
  ></div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  data () {
    return {
      width: 15,
    };
  },
  props: {
    layoutIdx: {
      type: [Object, Number, String]
    },
    itemData: {
      type: Object,
    },
    isDragging: {
      type: Boolean,
    },
    clientX: {
      type: Number,
    },
    clientY: {
      type: Number,
    },
  },
  computed: {
    ...mapState('dashboard', ['layoutList', 'currentDashboardDetail', 'fullScreen']),
    isInsertClass () {
      if (!this.isDragging) {
        return '';
      }
      let dom = this.$refs.resizeLine;
      let most = 20;
      let left = dom.getBoundingClientRect().left;
      let right = dom.getBoundingClientRect().right;
      let top = dom.getBoundingClientRect().top;
      let bottom = dom.getBoundingClientRect().bottom;
      if (this.layoutIdx) return '';
      if (this.itemData.isDir === 'left' || this.itemData.isDir === 'right') {
        if (
          this.clientX > left - most &&
          this.clientX < right + most &&
          this.clientY > top + most &&
          this.clientY < bottom - most
        ) {
          this.$emit('set-layout-item', this.itemData, 'insert');
          return 'vertical-line';
        }
      } else {
        if (
          this.clientY > top - most &&
          this.clientY < bottom + most &&
          this.clientX > left + most &&
          this.clientX < right - most
        ) {
          this.$emit('set-layout-item', this.itemData, 'insert');
          return 'horizontal-line';
        }
      }
      return '';
    },
    isPositionClass () {
      const obj = {
        left: 'resize-vertical',
        right: 'resize-vertical',
        top: 'resize-horizontal',
        bottom: 'resize-horizontal',
      };
      return obj[this.itemData.isDir];
    },
    isFull () {
      return this.fullScreen ? 'full-resize' : '';
    },
    setPosition () {
      const obj = {
        left: 'left',
        right: 'left',
        top: 'top',
        bottom: 'top',
      };
      const key = obj[this.itemData.isDir];
      let percent = 100;
      let pos = {};
      pos[key] = `${percent}%`;
      let styleObj = {
        ...pos,
      };
      return styleObj;
    },
  },
};
</script>
<style lang='scss' scoped>
.resize-line {
  box-sizing: border-box;
  position: absolute;
  z-index: 1;
  -moz-background-clip: padding;
  -webkit-background-clip: padding;
  background-clip: padding-box;
  &:hover{
    background-color: rgba($color: #000000, $alpha: .2);
  }
}
.full-resize {
  cursor: auto!important;
  &:hover{
    background-color: rgba($color: #000000, $alpha: 0)!important;
  }
}
.resize-horizontal {
  height: 2px;
  top: 50%;
  cursor: row-resize;
  width: 100%;
  &::before {
    content: "";
    top: -1px;
    width: 100%;
    height: 4px;
    position: absolute;
  }
  &:hover{
    &::before{
      top: -10px;
      height: 40px;
    }
  }
}

.resize-vertical {
  width: 2px;
  height: 100%;
  left: 50%;
  cursor: col-resize;
  &::before {
    content: "";
    left: -1px;
    width: 4px;
    height: 100%;
    position: absolute;
  }
  &:hover{
    &::before{
      left: -10px;
      width: 40px;
    }
  }
}
.vertical-line {
  &::after {
    content: "";
    height: 100%;
    left: -2px;
    width: 4px;
    display: inline-block;
    background-color: rgba($color: #4284f5, $alpha: 0.1);
    border: 1px solid #4284f5;
    position: absolute;
  }
  &:hover{
    &::after{
      width: 100px;
      left: -50px;
    }
  }
}
.horizontal-line {
  &::after {
    content: "";
    height: 4px;
    top: -2px;
    width: 100%;
    display: inline-block;
    background-color: rgba($color: #4284f5, $alpha: 0.1);
    border: 1px solid #4284f5;
    position: absolute;
  }
  &:hover {
    &::after {
      height: 100px;
      top: -50px;
    }
  }
}
</style>
