<template>
  <div class="project-name">
    <div class="name">
     {{projectName}}
    </div>
    <div class="info">
      <span>画布{{canvasNum}}个</span>
      <span>展板{{dashboardNum}}个</span>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  data () {
    return {
    };
  },
  computed: {
    ...mapState('project', ['projectName']),
    ...mapState('drawingboard', ['canvasNum']),
    ...mapState('dashboard', ['dashboardNum'])
  }
};
</script>
<style lang='scss' scoped>
.project-name {
  width: 200px;
  height: 60px;
  padding: 0px 10px;
  box-sizing: border-box;
  .name {
    height: 35px;
    line-height: 35px;
    width: 100%;
    font-size: 14px;
    font-weight: bold;
    @include ellipsis;
  }
  .info {
    font-size: 12px;
    font-weight: 300;
    color: #A4A4A4;
    > span {
      margin-right: 10px;
    }
  }
}
</style>
