<template>
  <div class="dc-elselect">
    <el-select v-model="curVal" :placeholder="placeHolder" v-on="$listeners" @change="selectChange">
      <el-option
        v-for="item in list"
        :key="item.value"
        :label="item.label === '' ? ' ' : item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  name: 'dcSelect',
  props: {
    list: {
      type: Array,
      default: (_) => []
    },
    value: {
      type: [String, Number, Boolean],
      default: ''
    },
    placeHolder: {
      type: String,
      default: '请选择'
    }
  },
  data () {
    return {
      curVal: ''
    };
  },
  watch: {
    value: {
      handler (val) {
        this.curVal = val;
      },
      immediate: true
    }
  },
  methods: {
    selectChange (val) {
      this.$emit('on-change', val);
    }
  }
};
</script>
<style lang="scss">
.dc-elselect {
  .el-icon-arrow-up:before {
    content: "\e78f";
  }
  .el-select .el-input .el-select__caret {
    color: #A4A4A4;
    font-size: 20px;
  }
  .el-input__icon {
    line-height: 36px;
  }
  .el-select {
    width: 150px;
  }
  .el-select-dropdown__item.selected {
    font-weight: normal !important;
  }
}
</style>
