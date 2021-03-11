<template>
<div class="dragging-tip" :style="pos" v-if="show">
    <span class="iconfont icon-db_alert" :style="{color: color}"></span>
    <span class="dragging-tip-txt">{{txt}}</span>
  </div>
</template>
<script>
export default {
  name: 'dragTips',
  data () {
    return {
      show: false,
      txt: '',
      pos: {
        left: '100px',
        top: '100px'
      }
    };
  }

};
</script>

<style scoped lang="scss">
.dragging-tip{
  position: fixed;
  color: white;
  font-size: 12px;
  padding: 3px 10px 3px 5px;
  border-radius: 4px;
  background: #424242;
  z-index: 99999999;
  .iconfont{
    color: #F5282D;
    top: 1px;
    margin-right: 5px;
    position: relative;
  }
}
</style>
