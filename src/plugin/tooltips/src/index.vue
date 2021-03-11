<template>
  <div class="tooltip-wrap" :style="setPos" v-if="show" v-click-out="hide">
    <span class="iconfont icon-db_triangle"></span>
    <div class="button" v-if="firstText" @click.stop="firstHandler">{{firstText}}</div>
    <div class="button" v-if="secondText" @click.stop="secondHandler">{{secondText}}</div>
    <div class="button" v-if="thirdText" @click.stop="thirdHandler">{{thirdText}}</div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      show: false,
      firstText: '',
      secondText: '',
      thirdText: '',
      firstCallBack: null,
      secondCallBack: null,
      thirdCallBack: null,
      setPos: {
        left: '',
        top: ''
      }
    };
  },
  mounted () {
  },
  methods: {
    hide () {
      this.show = false;
    },
    firstHandler () {
      this.show = false;
      this.firstCallBack();
    },
    secondHandler () {
      this.show = false;
      this.secondCallBack();
    },
    thirdHandler () {
      this.show = false;
      this.thirdCallBack();
    }
  }
};
</script>
<style scoped lang='scss'>
.tooltip-wrap {
  position: fixed;
  width: 120px;
  background-color: #4284f5;
  z-index: 10000;
  color: white;
  border-radius: 4px;
  .icon-db_triangle{
    position: absolute;
    left: 50%;
    top: -10px;
    transform: rotate(-180deg);
    color: #4284f5;
  }
  .button {
    height: 35px;
    line-height: 35px;
    padding: 0px 10px;
    cursor: pointer;
    font-size: 14px;
    text-align: center;
    box-sizing: border-box;
  }
}
</style>
