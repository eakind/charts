<template>
  <div class="resize-line resize-vertical" ref="resizeLine"
       @mouseup="mouseUp"
       @mousedown.stop="mouseDown($event, item)"></div>
</template>
<script>
export default {
  data () {
    return {
      startX: 0,
      startY: 0,
      minWidth: 5
    };
  },
  props: {
    fullScreen: {
      type: Boolean
    },
    startW: {
      type: Number
    }
  },
  beforeDestroy () {
    document.removeEventListener('mouseup', this.mouseUpAll);
  },
  mounted () {
    document.addEventListener('mouseup', this.mouseUpAll);
  },
  methods: {
    mouseUpAll () {
      this.$el.parentElement.parentElement.removeEventListener('mousemove', this.mouseMove, false);
    },
    mouseMove (event) {
      let startOffset = this.startX;
      const currentPage = event.pageX;
      const currentOffset = event.currentTarget.offsetWidth;
      let currentPercent = +Math.floor((((currentPage - startOffset) / currentOffset) * 10000) / 100).toFixed(2);
      currentPercent = this.startW - currentPercent;
      if (currentPercent > this.minWidth && currentPercent < 100 - this.minWidth) {
        this.$emit('resize', currentPercent);
      }
    },
    mouseUp () {
      this.$emit('stop-drag');
      this.$el.parentElement.parentElement.removeEventListener('mousemove', this.mouseMove, false);
    },
    mouseDown () {
      if (this.fullScreen) return;
      this.startX = event.pageX;
      this.startY = event.pageY;
      this.$emit('update-start-w');
      this.$el.parentElement.parentElement.addEventListener('mousemove', this.mouseMove, false);
    }
  }
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
  // &:hover{
  //   background-color: rgba($color: #000000, $alpha: .2);
  // }
}

.resize-vertical{
  width: 1px;
  height: 96%;
  cursor: col-resize;
  &::before{
    content: '';
    left: -2px;
    width: 4px;
    height: 100%;
    position: absolute;
  }
  &:hover{
    &::before {
      left: -25px;
      width: 50px;
    }
  }
}
</style>
