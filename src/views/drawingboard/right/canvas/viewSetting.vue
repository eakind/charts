<template>
  <dc-collapse-item title="画布视图">
    <div class="view-setting">
      <icon-svg class="icon-svg" icon="#icon-dbc_view"></icon-svg>
      <dc-select-view class="select-view" :select="value" :list="modeOptions" @change="handleViewModeChange"></dc-select-view>
    </div>
  </dc-collapse-item>
</template>
<script>
import { mapMutations } from 'vuex';
import DcSelectView from '@/components/dcselectview/dcSelectView.vue';
export default {
  props: {
    value: String, // v-model
  },
  data () {
    return {
      modeOptions: [
        { name: this.$t('dashboard.standard_view'), id: 'standard' },
        { name: this.$t('dashboard.fit_width'), id: 'fitWidth' },
        { name: this.$t('dashboard.fit_height'), id: 'fitHeight' },
        { name: this.$t('dashboard.full_view'), id: 'full' },
      ]
    };
  },
  components: {
    DcSelectView
  },
  mounted () {
  },
  methods: {
    ...mapMutations('drawingboard', ['setViewMode']),
    handleViewModeChange ({ id: val }) {
      this.setViewMode(val);
      this.$emit('input', val);
      this.$emit('change', val);
    }
  }
};
</script>
<style lang='scss' scoped>
.view-setting {
  display: flex;
  padding: 0px 0px 10px 5px;
  align-items: center;
  .icon-svg{
    font-size: 16px;
  }
  .select-view {
    top: 0px;
    margin-left: 10px;
    position: relative;
  }
}
</style>
