<template>
  <div class="color-item"
        :class="active ? 'active' : ''"
        :style="`background-color: ${color};color: ${color};${disabled ? '' : 'cursor: pointer;'}`"
        @click="onColorItemClick">
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  props: {
    active: Boolean,
    color: String,
    disabled: Boolean,
    updateRecent: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    ...mapMutations('colors', ['setColorsRecentlyUsed']),
    onColorItemClick () {
      if (this.disabled) { return; }
      this.$emit('click', this.color);
      if (!this.updateRecent) { return; }
      this.setColorsRecentlyUsed({ color: this.color });
    },
  }
};
</script>

<style lang="scss" scoped>
.color-item {
  margin-right: 12px;
  margin-bottom: 4px;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  border: 1px solid #DEDEDE;
  &.active {
    // // border: none;
    // // currentColor inherit the font color. See template :style.
    // box-shadow: 0 0 20px -5px currentColor;
    // outline: 1px solid #DEDEDE;
    // // outline-offset: -2px;
    border: 2px solid #4284f5;
  }
}
</style>
