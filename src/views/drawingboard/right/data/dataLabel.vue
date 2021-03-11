<template>
  <dc-collapse-item :title="$t('dashboard.data_label')" :hasChecked="true" :checked="checked" :has-open="false"
                    @checked-change="toggleLabel">
  </dc-collapse-item>
</template>
<script>
export default {
  data () {
    return {
      checked: true
    };
  },
  props: {
    isLabel: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    isLabel: {
      handler (boolean) {
        this.checked = boolean;
      },
      immediate: true
    }
  },
  components: {
  },
  mounted () {
  },
  methods: {
    toggleLabel () {
      this.checked = !this.checked;
      this.$emit('change', this.checked);
    }
  }
};
</script>
<style lang='scss' scoped>
.data-label {
  display: inline-block;
}
</style>
