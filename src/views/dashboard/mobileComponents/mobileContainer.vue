<!--  -->
<template>
  <div class="mobile-container">
    <div class="right-tip">
      <div>1. 切换电脑/移动设备，仅影响视图布局。两种模式下，展板组件和数据联动交互始终保持同步。</div>
      <div>2. 电脑设备打开项目链接时，将自动以电脑模式查看。移动设备则自动调整为移动模式（移动模式不显示图例和过滤器，但仍可在此编辑）。</div>
    </div>
    <div class="right-edit" >
      <filter-area></filter-area>
      <legend-area></legend-area>
    </div>
  </div>
</template>

<script>
import LegendArea from './legendArea.vue';
import FilterArea from './filterArea.vue';
export default {
  data () {
    return {
    };
  },
  components: {
    LegendArea,
    FilterArea
  },
  computed: {
  },
  watch: {},
  mounted () {},
  methods: {}
};
</script>
<style lang='scss' scoped>
.mobile-container {
  width: 500px;
  background: #e1e1e1;
  margin-left: 10px;
  border-radius: 4px;
  padding: 10px;
  .right-tip {
    font-size: 12px;
    margin-bottom: 20px;
  }
  .right-edit {
    display: flex;
    font-size: 14px;
  }
}
</style>
