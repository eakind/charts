<template>
  <div class="base-slider">
    <el-slider v-model="value" v-bind="$attrs" v-on="$listeners"></el-slider>
  </div>
</template>

<script>
export default {
  name: 'base-slider',
  props: {
    value: {
      type: [String, Number, Array],
      required: true
    }
  }
};
</script>

<style>
.el-slider__runway {
  background-color: #DEDEDE;
  height: 12px;
}
.el-slider__bar {
  height: 12px;
  background-color: #9BBCF5;
}
.el-slider__button-wrapper {
  height: 36px;
  width: 36px;
  top: -12px;
}
.el-slider__button {
  width: 10px;
  height: 16px;
  border-radius: 0;
  border: 2px solid #4284F5;
  background-color: #4284F5;
}
</style>
<style lang="scss" scoped>
  .base-slider {
    display: inline-block;
    width: 100%;
    .el-slider {
      font-weight: inherit;
      color: inherit;
    }
  }
</style>
