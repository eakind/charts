<template>
  <div class="goto-board" @click="gotoBoard">
    <span class="iconfont icon-db_dashboard"></span>
    <span>进入展板</span>
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
    gotoBoard () {
      this.$router.push({ path: 'dashboard' });
    }
  }
};
</script>
<style lang='scss' scoped>
.goto-board{
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
  .icon-db_dashboard {
    background: linear-gradient(to right, #89F7FE, #66A6FF);
    background-clip: text;
    color: transparent;
  }
}
</style>
