<template>
  <div class="board-layout" @mouseleave="mouseleave">
    <span class="layout-title">{{$t('home.layout_tip')}}</span>
    <div class="layout-row">
      <div class="layout-btn" :class="isFixed" @click="layoutHandler(true)">{{$t('home.set_layout')}}</div>
      <div class="layout-tip">{{$t('home.set_layout_tip')}}</div>
    </div>
    <div class="layout-row">
      <div class="layout-btn" :class="isFloat" @click="layoutHandler(false)">{{$t('home.float_layout')}}</div>
      <div class="layout-tip">{{$t('home.float_layout_tip')}}</div>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex';
export default {
  data () {
    return {
    };
  },
  computed: {
    ...mapState('displayboard', ['layoutFlag']),
    isFixed () {
      if (this.layoutFlag) {
        return 'layout-active';
      }
      return '';
    },
    isFloat () {
      if (!this.layoutFlag) {
        return 'layout-active';
      }
      return '';
    }
  },
  components: {
  },
  mounted () {
  },
  methods: {
    ...mapMutations('displayboard', ['setLayoutFlag']),
    layoutHandler (boolean) {
      this.setLayoutFlag(boolean);
      this.bus.$emit('changeLayoutFlag', boolean);
      this.$emit('hide');
    },
    mouseleave () {
      this.$emit('hide');
    }
  }
};
</script>
<style lang='scss' scoped>
.board-layout{
  box-sizing: border-box;
  padding: 10px 20px;
  .layout-title{
    font-size: 12px;
    display: block;
    margin: 5px 0px;
  }
  .layout-row{
    display: flex;
    font-size: 14px;
    margin-bottom: 10px;
  }
  .layout-btn{
    width: 100px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
    border-radius: 4px;
    border: 1px solid white;
    background-color: white;
  }
  .layout-tip {
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    margin: 0px 10px;
    color: #666666;
  }
  .layout-active{
    border: 1px solid #4284f5;
  }
}
</style>
