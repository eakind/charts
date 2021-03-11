<template>
  <div class="title-module flex">
    <div class="title">{{ title }}</div>
    <el-checkbox v-if="showCheckBox" v-model="checked" v-on="$listeners">{{
      label
    }}</el-checkbox>
  </div>
</template>
<script>
export default {
  name: 'titleModule',
  props: {
    title: {
      type: String,
      default: '标题名称',
    },
    showFlag: {
      type: Boolean,
      default: true,
    },
    label: {
      type: String,
      default: '显示',
    },
    showCheckBox: {
      type: Boolean,
      default: true,
    },
    value: {
      type: [Boolean, String],
      default: true
    }
  },
  data () {
    return {
      checked: true,
    };
  },
  watch: {
    value: {
      handler (val) {
        this.checked = val;
      },
      immediate: true,
    },
    checked (value) {
      this.$emit('input', value);
      this.$emit('change', value);
    }
  },
};
</script>
<style lang="scss" scoped>
.flex {
  display: flex;
  justify-content: space-between;
}
.title-module {
  font-size: 12px;
   margin-bottom: .8em;
  .title {
    color: hsl(217.9, 89.9%, 61%);
    font-weight: bold;
  }
}
// .title-module + .title-module {
//   margin-top: .8em;
// }
/deep/ .el-checkbox.is-checked {
  .el-checkbox__label {
    font-size: 14px;
    color: hsl(0, 0%, 25.9%);
  }
}
</style>
