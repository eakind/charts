<template>
  <div class="scroll-list"  @scroll="scrollHandler">
    <slot></slot>
  </div>
</template>
<script>
export default {
  data () {
    return {
      bTop: 0,
      timer: null
    };
  },
  components: {},
  mounted () {
  },
  methods: {
    scrollHandler (event) {
      this.$nextTick(() => {
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        this.timer = setTimeout(() => {
          let top = event.target.scrollTop;
          let bTop = this.$el.firstChild.clientHeight;
          let height = this.$el.clientHeight;
          if (bTop - top < height) {
            this.$emit('loadMore');
            clearTimeout(this.timer);
            this.timer = null;
          }
        }, 100);
      });
    }
  }
};
</script>
<style lang='scss' scoped>
.scroll-list {
  overflow: hidden;
  overflow-y: auto;
  position: relative;
  .bottom{
    bottom: 0px;
    position: absolute;
  }
}
</style>
