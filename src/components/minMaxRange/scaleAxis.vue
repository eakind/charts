<template>
  <div class="scale-axis">
    <div class="zoom-in">
      <span class="iconfont icon-db_plus" @click="zoomIn"></span>
    </div>
    <div class="zoom-out">
      <span class="iconfont icon-db_minus" @click="zoomOut"></span>
    </div>
    <div class="reset">
      <span class="iconfont icon-db_refresh" @click="reset"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'scale-axis',
  methods: {
    zoomIn () {
      this.$emit('zoom', 1);
    },
    zoomOut () {
      this.$emit('zoom', -1);
    },
    reset () {
      this.$emit('zoom', 0);
    },
  },
};
</script>

<style lang="scss" scoped>
.scale-axis {
  width: 28px;
  // height: 63px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 4px;
  text-align: center;
  z-index: 999;
  position: absolute;
  > div {
    width: 100%;
    height: 28px;
    box-sizing: border-box;
    cursor: pointer;
    span {
      line-height: 28px;
      color: #fff;
      font-size: 14px;
      &:hover {
        color: #fff * 0.7;
      }
    }
  }
  .zoom-in {
    border-bottom: 1px solid #a4a4a4;
  }
  .zoom-out {
    border-bottom: 1px solid #a4a4a4;
  }
}
</style>
