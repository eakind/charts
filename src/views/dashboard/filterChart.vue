<!--  -->
<template>
  <div class="filter-chart">
    <filter-chart-num
      :id="filterId"
      v-if="filterType === '03'"
      :styleObj="styleObj">
    </filter-chart-num>
    <filter-chart-cat
      :id="filterId"
      :styleObj="styleObj"
      v-else>
    </filter-chart-cat>
    <!-- <filter-style></filter-style> -->
  </div>
</template>

<script>
import FilterChartCat from './left/filterSetting/filterChartCat.vue';
import FilterChartNum from './left/filterSetting/filterChartNum.vue';
// import FilterStyle from '../styleSetting/filterStyle.vue';
export default {
  data () {
    return {
    };
  },
  props: {
    filterId: {
      type: [String, Number]
    },
    filterType: {
      type: [String, Number]
    },
    styleObj: {
      type: [Object, String]
    }
  },
  components: {
    FilterChartNum,
    FilterChartCat,
    // FilterStyle
  },
  computed: {
  },
  watch: {
    styleObj: {
      handler (obj) {
        console.log(obj);
      },
      deep: true
    }
  },
  mounted () {
  },
  methods: {
  }
};
</script>
<style lang='scss' scoped>
.filter-chart {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
