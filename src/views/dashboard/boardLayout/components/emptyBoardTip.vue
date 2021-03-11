<template>
  <div class="empty-board-tip">
    <div class="icon-list">
      <span class="iconfont icon-db_canvas"></span>
      <span class="iconfont icon-db_text"></span>
      <span class="iconfont icon-db_picbase"></span>
    </div>
    <div class="tip">请拖入画布或其他组件</div>
  </div>
</template>
<script>
export default {
  data () {
    return {};
  },
  components: {},
  mounted () {},
  methods: {},
};
</script>
<style lang='scss' scoped>
.empty-board-tip {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  .icon-list {
    display: flex;
    text-align: center;
    height: 32px;
    align-items: center;
    .iconfont {
      flex: 1;
      color: #a4a4a4;
      font-size: 20px;
    }
  }
  .tip{
    font-size: 14px;
    color: #cccccc;
  }
}
</style>
