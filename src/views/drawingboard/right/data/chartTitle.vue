<template>
  <dc-collapse-item :title="$t('dashboard.chart_title')" :hasChecked="true" :checked-label="txt" :checked="isShow"
                    @checked-change="showTitle">
    <div class="chart-title">
      <font-style @change="changeFont" :titleCss="titleCss"></font-style>
    </div>
  </dc-collapse-item>
</template>
<script>
import FontStyle from '../canvas/components/fontStyle.vue';
export default {
  data () {
    return {
      isShow: true
    };
  },
  props: {
    value: {
      type: Boolean
    },
    titleCss: {
      type: Object,
      default: () => {
        return {
          fontSize: 16,
          color: '#4284f5'
        };
      }
    }
  },
  computed: {
    txt () {
      return '显示';
    }
  },
  components: {
    FontStyle
  },
  mounted () {
  },
  methods: {
    showTitle () {
      this.isShow = !this.isShow;
      this.$emit('input', this.isShow);
      this.$emit('change', this.isShow);
    },
    changeFont (fontSize, fontColor, fontAlign) {
      this.$emit('changeFont', fontSize, fontColor, fontAlign);
    }
  }
};
</script>
<style lang='scss' scoped>
.chart-title {
  padding-bottom: 15px;
  border-bottom: 1px solid #e1e1e1;
}
</style>
