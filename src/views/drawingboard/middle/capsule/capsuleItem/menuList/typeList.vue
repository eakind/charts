<template>
  <div class="type-list">
    <div :class="isBar" @click="selectType('bar')">柱子</div>
    <div :class="isLine" @click="selectType('line')">折线</div>
  </div>
</template>
<script>
export default {
  data () {
    return {
    };
  },
  props: {
    item: {
      type: Object
    }
  },
  computed: {
    isBar () {
      return this.item.canvasType === 'bar' ? 'is-active' : '';
    },
    isLine () {
      return this.item.canvasType === 'line' ? 'is-active' : '';
    }
  },
  components: {
  },
  mounted () {
  },
  methods: {
    selectType (val) {
      this.$emit('select-type', val);
    }
  }
};
</script>
<style lang='scss' scoped>
.type-list{
  right: -121px;
  top: 0px;
  width: 120px;
  box-shadow: 0 6px 14px 0 rgba(0,0,0,0.10);
  border-radius: 0 0 4px 4px;
  background-color: white;
  position: absolute;
  > div {
    height: 36px;
    line-height: 36px;
    padding: 0px 10px;
    &:hover{
       color: #4284f5;
    }
  }
  .is-active{
    color: #4284f5;
  }
}
</style>
