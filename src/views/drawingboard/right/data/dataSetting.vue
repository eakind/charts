<template>
  <dc-collapse-item :title="$t('dashboard.setting_data')">
    <data-setting :list="curDataSetting"
                  @select="selectDataSetting"
                  @change="changeDataSetting"></data-setting>
  </dc-collapse-item>
</template>
<script>
import dataSetting from '@/components/datasetting/dataSetting.vue';
export default {
  name: 'tableSetting',
  components: { dataSetting },
  props: {
    dataSetting: {
      type: Array,
      default: _ => []
    }
  },
  watch: {
    dataSetting: {
      handler (val) {
        this.curDataSetting = val;
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    return {
      curDataSetting: []
    };
  },
  mounted () {
  },
  methods: {
    selectDataSetting (val) {
      this.curDataSetting.forEach(d => (d.selected = false));
      this.curDataSetting[val].selected = true;
      let content = this.curDataSetting[2].content;
      if (val !== 2) {
        content.forEach(c => (c.disabled = true));
      } else {
        content.forEach(c => (c.disabled = false));
      }
      this.$emit('on-canvasCss-change', 'data_setting', this.curDataSetting, true);
    },
    changeDataSetting (val, idx) {
      let content = this.curDataSetting[2].content;
      content[idx].val = val;
      this.$emit('on-canvasCss-change', 'data_setting', this.curDataSetting, true);
    },
  }
};
</script>
<style lang="scss" scoped>
.data-setting-wrap {
}
</style>
