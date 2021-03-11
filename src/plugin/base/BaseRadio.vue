<template>
  <div class="base-radio">
    <el-radio-group v-model="value" v-bind="$attrs" v-on="$listeners" v-if="!isButton">
      <el-radio v-for="item in list" :label="item.label" :key="item.label" :disabled="item.disabled" :style="styles">{{item.name}}</el-radio>
    </el-radio-group>
    <el-radio-group v-model="value" v-bind="$attrs" v-on="$listeners" v-else>
      <div class="item" v-for="item in list" :key="item.label">
        <el-radio-button :label="item.label" :disabled="item.disabled" :style="styles">{{item.name}}</el-radio-button>
      </div>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  name: 'base-radio',
  props: {
    list: {
      type: Array,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    styles: {
      type: Object,
      default: function () {
        return {};
      }
    },
    isButton: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
  .base-radio {
    display: inline-block;
  }
</style>
