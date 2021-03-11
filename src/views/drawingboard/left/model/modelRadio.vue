<template>
  <div class="model-radio">
    <span :class="selected===0 ? 'model-radio-active':''" @click="selectHandler(0)">0</span>
    <span :class="selected===1 ? 'model-radio-active':''" @click="selectHandler(1)">1</span>
  </div>
</template>
<script>
export default {
  name: 'ModelRadio',
  data () {
    return {
      selected: this.select
    };
  },
  props: {
    select: {
      type: [Boolean, Number]
    },
    keyName: {
      type: [String, Number]
    }
  },
  watch: {
    select () {
      this.selected = this.select;
    }
  },
  components: {},
  mounted () {
    this.selected = this.select;
  },
  methods: {
    selectHandler (val) {
      this.$emit('change', val, this.keyName);
    }
  }
};
</script>
<style lang='scss' scoped>
.model-radio {
  display: inline-block;
  width: 80px;
  height: 25px;
  line-height: 25px;
  color: #a4a4a4;
  padding: 1px;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  > span {
    width: 50%;
    text-align: center;
    cursor: pointer;
    display: inline-block;
  }
  .model-radio-active{
    color: white;
    border-radius: 4px;
    background-color: #4284f5;
  }
}
</style>
