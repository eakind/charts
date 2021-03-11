<template>
  <div class="icon-wrap">
    <div class="icon-box">
      <icon-svg
        :icon="iconName || comIconName"
        className="icon-empty"
        :styleObj="{ width: '100%', height: '100%', color: '#b6b6b6' }"
      ></icon-svg>
    </div>
    <div class="tips">{{ $t('dashboard.no_charts') }}</div>
  </div>
</template>
<script>
export default {
  props: {
    iconName: {
      type: String,
    },
    chartType: {
      type: String,
    },
  },
  computed: {
    comIconName () {
      let iconList = {
        table: '#icon-db_chartTable',
        bar: '#icon-db_chartColumn',
        'bar-line': '#icon-db_chartCombine',
        'bar-rotated': '#icon-db_chartBar',
        bubble: '#icon-db_chartBubble',
        line: '#icon-db_chartLine',
        map: '#icon-db_chartMap',
        pie: '#icon-db_chartPie',
        scatter: '#icon-db_chartScatter',
      };
      return iconList[this.chartType];
    },
  },
};
</script>
<style lang="scss" scoped>
.chart_bg_tip {
  left: 0px;
  top: 0px;
  z-index: 1001;
  position: absolute;
  width: 400px;
  display: inline-block;
  .title_tip {
    font-size: 16px;
    color: #424242;
    left: 35px;
    top: 35px;
    font-weight: bold;
    position: absolute;
  }
  .txt_tip {
    top: 80px;
    left: 35px;
    width: 177px;
    font-size: 14px;
    color: #424242;
    font-weight: 300;
    display: inline-block;
    position: absolute;
  }
}
.icon-wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  // z-index: 1;
  transform: translate(-50%, -50%);
  .icon-box {
    width: 120px;
    height: 98px;
    .icon-empty {
      width: 100%;
      height: 100%;
    }
  }
  .tips {
    color: #b6b6b6;
    text-align: center;
  }
}
</style>
