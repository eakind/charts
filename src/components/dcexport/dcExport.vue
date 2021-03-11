<template>
  <div class="dc-export" ref="exportRef">
    <div @click="saveChart">
      {{$t('message.save_chart')}}
    </div>
    <div @click="exportData">
      {{$t('message.view_data')}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'DcExport',
  data () {
    return {
    };
  },
  methods: {
    saveChart () {
      this.bus.$emit('selectExport', true);
    },
    exportData () {
      this.bus.$emit('selectExport', false);
    }
  }
};
</script>

<style scoped lang="scss">
.dc-export {
  z-index: 999999999;
  width: 120px;
  height: 80px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 10px 25px 0 rgba(0,0,0,0.40);
  text-align: center;
  div{
    height: 40px;
    line-height: 40px;
    padding: 0px 10px;
    cursor: pointer;
    box-sizing: border-box;
    &:first-child{
      border-bottom: 1px solid #e1e1e1;
    }
  }
  .iconfont{
    color: white;
    z-index: 99;
  }
  &:before{
    box-sizing: content-box;
    width: 0px;
    height: 0px;
    position: absolute;
    top: -16px;;
    right:46px;
    padding:0;
    border-bottom:8px solid white;
    border-top:8px solid transparent;
    border-left:8px solid transparent;
    border-right:8px solid transparent;
    display: block;
    content:'';
    z-index: 12;
  }
  &:after{
    box-sizing: content-box;
    width: 0px;
    height: 0px;
    position: absolute;
    top: -18px;;
    right:45px;
    padding:0;
    border-bottom:9px solid #e1e1e1;
    border-top:9px solid transparent;
    border-left:9px solid transparent;
    border-right:9px solid transparent;
    display: block;
    content:'';
    z-index:10
  }

}
</style>
