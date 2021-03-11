<template>
  <div class="base-checkbox">
    <el-checkbox-group v-model="value" v-bind="$attrs" v-on="$listeners" v-if="!isButton">
      <el-checkbox v-for="item in list" :label="item.label" :key="item.label" :disabled="item.disabled" :style="styles">{{item.name}}</el-checkbox>
    </el-checkbox-group>
    <el-checkbox-group v-model="value" v-bind="$attrs" v-on="$listeners" v-else>
      <div class="item" v-for="item in list" :key="item.label">
        <el-checkbox-button :label="item.label" :disabled="item.disabled" :style="styles">{{item.name}}</el-checkbox-button>
      </div>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  name: 'base-checkbox',
  props: {
    list: {
      type: Array,
      required: true
    },
    value: {
      type: Array,
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

<style>
.el-checkbox-button:last-child .el-checkbox-button__inner {
  border-radius: 4px;
}
.el-checkbox-button:first-child .el-checkbox-button__inner {
  border: 1px solid #DCDFE6;
}
.el-checkbox-button__inner {
  min-width: 100px;
  text-align:left;
}
</style>
<style lang="scss" scoped>
  .base-checkbox {
    display: inline-block;
  }
</style>
