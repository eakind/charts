<template>
  <div class="range-item">
    <div class="item-title">
      <span class="axis">Y</span>
      <span class="name">{{item.name}}</span>
    </div>
    <span class="range">数值范围</span>
    <div class="range-input">
      <input class="input" v-model="rangeObj.min" />
      <span class="space">-</span>
      <input class="input" v-model="rangeObj.max" />
    </div>
    <div class="amount-input">
      <span class="amount-txt">数量</span>
      <input class="input-txt" v-model="rangeObj.num" />
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      rangeObj: {
        num: 0,
        max: 0,
        min: 0
      },
      setTimer: null
    };
  },
  props: {
    item: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  watch: {
    item: {
      handler (obj) {
        this.$set(this.rangeObj, 'max', Number(obj.max));
        this.$set(this.rangeObj, 'min', Number(obj.min));
        this.$set(this.rangeObj, 'num', Number(obj.num));
      },
      immediate: true,
      deep: false
    },
    rangeObj: {
      handler (obj) {
        if (this.setTimer) {
          clearTimeout(this.setTimer);
          this.setTimer = null;
        }
        this.setTimer = setTimeout(() => {
          this.$emit('change', obj, this.index);
        }, 300);
      },
      deep: true,
    }
  },
  components: {
  },
  mounted () {
  },
  methods: {
  }
};
</script>
<style lang='scss' scoped>
@mixin input ($width) {
  width: $width;
  height: 30px;
  line-height: 30px;
  border-radius: 3px;
  outline: none;
  padding: 0px 5px;
  box-sizing: border-box;
  border: 1px solid #dedede;
  background-color: white;
}
.range-item {
  padding: 5px 5px 5px 10px;
  box-sizing: border-box;
  border-radius: 4px;
  background-color: rgba(160,193,250, 0.2);
  .item-title{
    color: #4284f5;
    font-size: 14px;
    padding: 0px 5px 5px 5px;
    display: flex;
    align-items: center;
  }
  .axis{
    width: 20px;
  }
  .name{
     flex: 1;
  }
  .range{
    color: #666666;
    font-size: 12px;
  }
  .range-input{
    padding: 5px 0px;
    display: flex;
    align-items: center;
  }
  .input {
    @include input(75px);
  }
  .space{
    margin: 0px 5px;
  }
  .amount-input{
    display: flex;
    align-items: center;
    padding: 3px 0px;
  }
  .amount-txt{
    width: 60px;
  }
  .input-txt {
    @include input(105px)
  }

}
</style>
