<!--  -->
<template>
  <div class="legend-area">
    <div class="area-title">图例区域</div>
    <div class="area-container">
      <legend-container v-if="isShowLegend"></legend-container>
    </div>
  </div>
</template>

<script>
import LegendContainer from '../legendContainer.vue';
import { mapState } from 'vuex';
export default {
  data () {
    return {
    };
  },
  components: {
    LegendContainer
  },
  computed: {
    ...mapState('dashboard', ['currentDashboardDetail']),
    isShowLegend () {
      return this.currentDashboardDetail.css && this.currentDashboardDetail.css.isShowLegend;
    },
  },
  watch: {},
  mounted () {},
  methods: {}
};

</script>
<style lang='scss' scoped>
.legend-area {
  width: 50%;
  .area-title {
    color: #adadae
  }
  .area-container {
    width: 100%;
    background-color: #fff;
    border-radius: 4px;
    height: 800px;
  }
}
</style>
