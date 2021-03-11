<template>
  <el-select
    v-model="curVal"
    :placeholder="placeHolder"
    :disabled="disabled"
    v-on="$listeners"
    :popper-append-to-body="appendToBody"
    @change="selectChange"
    @visible-change="visibleChange"
  >
    <el-option
      v-for="item in list"
      :key="typeof item.value === 'undefined' ? item : item.value"
      :label="typeof item.label === 'undefined' ? item : item.label"
      :value="typeof item.value === 'undefined' ? item : item.value"
    >
      <slot :item="item">{{ typeof item.label === 'undefined' ? item : item.label }}</slot>
    </el-option>
  </el-select>
</template>
<script>
export default {
  name: 'dcSelect',
  props: {
    list: {
      type: Array,
      default: (_) => [],
    },
    value: {
      type: [String, Number, Boolean],
      default: '',
    },
    placeHolder: {
      type: String,
      default: '请选择',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    appendToBody: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      curVal: '',
    };
  },
  watch: {
    value: {
      handler (val) {
        this.curVal = val;
      },
      immediate: true,
    },
  },
  methods: {
    selectChange (val) {
      this.$emit('on-change', val);
    },
    visibleChange (val) {
      if (val) {
        this.$emit('on-visible-change');
      }
    }
  },
};
</script>
<style lang="scss">

</style>
