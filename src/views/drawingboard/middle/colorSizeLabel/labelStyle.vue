<template>
  <edit-tooltip
    titleText="标签格式"
    :is-label="isLabel"
    :showApplyTooltip="true"
    :tooltip-data="tooltipData"
    @close="closeHandler"
    @change="changeTooltip"
  ></edit-tooltip>
</template>
<script>
import EditTooltip from '../../right/canvas/tooltipSetting/editTooltip.vue';
export default {
  components: { EditTooltip },
  props: {
    tooltipData: {
      type: Array,
      default: () => {},
    },
    isLabel: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    console.log(this.isLabel);
  },
  methods: {
    changeTooltip (list) {
      this.$emit('change-label-style', list);
      this.$emit('close');
    },
    closeHandler () {
      this.$emit('close');
    },
  },
};
</script>
<style lang="scss" scoped></style>
