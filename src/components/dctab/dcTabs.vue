<template>
  <div class="dc-tab">
    <div class="dc-tab-nav">
      <div v-for="({ title, name }) in tabs" :key="name"
           class="nav-item" :class="activeName === name ? 'active' : ''"
           :style="stretch ? `width: ${100 / tabs.length || 1}%` : ''"
           @click="onTabChange(name)"
      >{{ title }}</div>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    value: String,
    stretch: {
      type: Boolean,
      default: true,
    },
  },
  data () {
    return {
      tabs: [],
      activeName: '',
    };
  },
  mounted () {
    const tabs = this.$children;
    this.tabs = tabs;
    if (tabs.length > 0) {
      this.activeName = this.value || tabs[0].name;
      this.$emit('input', this.activeName);
    }
  },
  watch: {
    value (val) {
      this.activeName = val;
    },
  },
  methods: {
    onTabChange (name) {
      this.activeName = name;
      this.$emit('input', this.activeName);
    },
  }
};
</script>

<style lang="scss" scoped>
.dc-tab-nav {
  &::after {
    @include clear;
  }
}
.nav-item {
  float: left;
  height: 36px;
  line-height: 36px;
  vertical-align: middle;
  text-align: center;
  width: 160px;
  font-size: 14px;
  font-weight: 600;
  color: #a4a4a4;
  background-color: #f2f2f2;
  cursor: pointer;
  &.active {
    position: relative;
    color: inherit;
    background-color: inherit;
    &::after {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      content: '';
      display: block;
      width: 40%;
      height: 4px;
      border-radius: 999px;
      background-color: #4284F5;
    }
  }
}
</style>
