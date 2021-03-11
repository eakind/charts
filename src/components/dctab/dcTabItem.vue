<template>
  <div class="dc-tab-item" v-show="isActive">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    name: {
      type: [String, Number],
      default () {
        return this._uid;
      }
    },
  },
  computed: {
    tabParent () {
      let parent = this.$parent;
      while (parent.$options._componentTag !== 'dc-tabs' && parent.$parent) {
        parent = parent.$parent;
      }
      return parent;
    },
    isActive () {
      return this.tabParent.activeName === this.name;
    }
  }
};
</script>
