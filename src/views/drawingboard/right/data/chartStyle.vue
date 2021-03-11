<template>
 <dc-collapse-item :title="$t('dashboard.chart_style')">
   <!-- 图表样式 -->
  <div class="chart-style-wrap">
    <!-- 外形 -->
    <dc-shape  v-on="$listeners" v-bind="$attrs"></dc-shape>
    <!-- 半径 -->
    <dc-radius v-on="$listeners" v-bind="$attrs"></dc-radius>

  </div>
 </dc-collapse-item>

</template>
<script>
import dcRadius from './chartStyle/radius';
import dcShape from './chartStyle/shape';
export default {
  name: 'chartStyle',
  components: { dcRadius, dcShape },
};
</script>
