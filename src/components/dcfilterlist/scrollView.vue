<template>
  <div class="scroll-view" :style="{height:height}" @scroll="scrollHandler">
    <slot></slot>
    <span class="bottom" ref="bottom"></span>
  </div>
</template>
<script>
export default {
  name: 'ScrollView',
  data () {
    return {
      loadFlag: false,
      bTop: 0
    };
  },
  props: {
    height: {
      type: String,
      default: '200px'
    }
  },
  components: {},
  mounted () {},
  methods: {
    scrollHandler (event) {
      this.$nextTick(() => {
        setTimeout(() => {
          let top = event.target.scrollTop;
          let bTop = this.$refs.bottom.previousElementSibling.offsetTop;
          if (bTop - top < Number(this.height.split('px')[0]) * 2) {
            if (!this.loadFlag) {
              this.loadFlag = true;
              this.$emit('loadMore');
            }
          } else {
            this.loadFlag = false;
          }
        }, 100);
      });
    }
  }
};
</script>
<style lang='scss' scoped>
.scroll-view {
  overflow: hidden;
  overflow-y: auto;
  position: relative;
  .bottom{
    bottom: 0px;
    position: absolute;
  }
}
</style>
