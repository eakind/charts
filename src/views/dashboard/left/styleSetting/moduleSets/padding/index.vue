<template>
  <div>
    <span>{{ position }}</span>
    <el-input-number
      v-model="curVal"
      controls-position="right"
      size="small"
      :min="0"
      @change="change"
    ></el-input-number>
    <span>px</span>
  </div>
</template>
<script>
export default {
  name: '',
  props: {
    position: { type: String },
    valObj: {
      type: Object,
      default: (_) => {
        return {
          val: 0,
          topVal: 0,
          isLock: true,
        };
      },
    },
  },
  watch: {
    valObj: {
      handler (val) {
        this.curValObj = JSON.parse(JSON.stringify(val));
        this.curVal = val.isLock ? val.topVal : val.val;
      },
      immediate: true,
      depp: true,
    },
  },
  data () {
    return {
      curValObj: {},
      curVal: '',
    };
  },
  methods: {
    change (val) {
      this.$emit('change', val);
    },
  },
};
</script>
<style lang="scss">
.el-input-number {
  width: 64px;
  border: 1px solid hsl(0, 0%, 87.1%);
  border-radius: 4px;
  .el-input {
    width: 32px;
  }
  .el-input-number__decrease,
  .el-input-number__increase {
    right: 0;
    border-right: 0;
    border-left: 0;
    border-bottom: 0;
    background-color: inherit;
  }
  .el-input__inner {
    padding-left: 0;
    padding-right: 0;
  }
}
.el-input-number.is-controls-right {
  .el-input__inner {
    padding-left: 0;
    padding-right: 0;
    border: none;
  }
  .el-input-number__decrease,
  .el-input-number__increase {
    border-bottom: 0;
    border-left: 0;
  }
}
</style>
