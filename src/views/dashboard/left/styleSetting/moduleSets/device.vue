<template>
  <div class="device">
    <span>设备</span>
    <div class="select">
      <span :class="isPC" @click="selectHandler('pc')">电脑</span>
      <span :class="isMobile" @click="selectHandler('mobile')">移动</span>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
    };
  },
  props: {
    value: {
      type: String
    }
  },
  computed: {
    isPC () {
      return this.value === 'pc' ? 'active' : '';
    },
    isMobile () {
      return this.value === 'mobile' ? 'active' : '';
    }
  },
  components: {
  },
  mounted () {
  },
  methods: {
    selectHandler (type) {
      this.$emit('input', type);
    }
  }
};
</script>
<style lang='scss' scoped>
.device {
  font-size: 14px;
  display: flex;
  align-items: center;
  color: #424242;
  margin-bottom: 8px;
  .select {
    display: flex;
    margin-left: 8px;
    min-width: 160px;
    max-width: 280px;
    height: 28px;
    line-height: 28px;
    background-color: #e1e1e1;
    text-align: center;
    border-radius: 4px;
    flex: 1;
    > span {
      flex: 1;
      height: 28px;
      cursor: pointer;
    }
  }
  .active {
    color: white;
    border-radius: 4px;
    background-color: #4284f5;
  }
}
</style>
