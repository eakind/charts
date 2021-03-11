<template>
  <div class="tooltip-item" >
    <span class="title">{{item.key}}</span>
    <input placeholder="显示名称" v-model="inputValue" />
  </div>
</template>
<script>
export default {
  data () {
    return {
      inputValue: ''
    };
  },
  props: {
    item: {
      type: Object,
    },
    index: {
      type: Number,
      default () {
        return 0;
      }
    }
  },
  watch: {
    item: {
      handler (obj) {
        if (!obj) return;
        this.inputValue = obj.title;
      },
      immediate: true,
      deep: true
    },
    inputValue: {
      handler (value) {
        this.$emit('change', value);
      },
      deep: true,
      immediate: false
    }
  },
  mounted () {
  },
  methods: {
  }
};
</script>
<style lang='scss' scoped>
.tooltip-item {
  padding: 5px;
  width: 100%;
  margin: 10px 0px;
  cursor: pointer;
  border-radius: 4px;
  background-color: #F2F2F2;
  .title {
    color: #424242;
    padding: 5px 0px;
    display: block;
  }
  > input {
    width: 100%;
    height: 35px;
    line-height: 35px;
    border: 1px solid #e1e1e1;
    border-radius: 3px;
    padding: 0px 5px;
    outline: none;
    box-sizing: border-box;
    color: #666666;
  }
}
</style>
