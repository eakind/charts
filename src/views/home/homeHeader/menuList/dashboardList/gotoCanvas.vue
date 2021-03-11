<template>
  <div class="goto-canvas" @click="gotoCanvas">
    <span class="iconfont icon-db_canvas"></span>
    <span>进入画布</span>
  </div>
</template>
<script>
export default {
  data () {
    return {
    };
  },
  components: {
  },
  mounted () {
  },
  methods: {
    gotoCanvas () {
      // this.$router.push({ path: 'drawingboard', query: { userId: 123 } });
      this.$router.push({ name: 'drawingboard', params: { from: 'dashboard' } });
    }
  }
};
</script>
<style lang='scss' scoped>
.goto-canvas{
  width: 120px;
  height: 40px;
  line-height: 40px;
  padding: 0px 0px 0px 20px;
  font-size: 14px;
  font-weight: 300;
  box-sizing: border-box;
  color: white;
  cursor: pointer;
  background-color: #666666;
  border-radius: 4px 0px 0px 4px;
  > span {
    margin: 0px 2px;
  }
  .icon-db_canvas {
    background: linear-gradient(to right, #89F7FE, #66A6FF);
    background-clip: text;
    color: transparent;
  }
}
</style>
