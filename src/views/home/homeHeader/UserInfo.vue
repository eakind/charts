<template>
  <div class="user-info" >
    <div class="user-info-btn" @click="isOperate=!isOperate" >
      <span class="iconfont icon-db_menuBurger"></span>
    </div>
    <user-operate v-if="isOperate" @hide="hideHandler"></user-operate>
  </div>
</template>
<script>
import UserOperate from './userInfo/userOperate.vue';
export default {
  data () {
    return {
      isOperate: false
    };
  },
  components: {
    UserOperate
  },
  mounted () {
  },
  methods: {
    hideHandler () {
      this.isOperate = false;
    },
  }
};
</script>
<style lang='scss' scoped>
.user-info{
  width: 60px;
  height: 60px;
  position: relative;
  .user-info-btn {
    width: 60px;
    height: 40px;
    margin: 10px 0;
    text-align: center;
    line-height: 40px;
    cursor: pointer;
    background: #666666;
    border-radius: 0 4px 4px 0;
  }
  .icon-db_menuBurger{
    font-size: 18px;
    color: white;
    background: linear-gradient(to right, #89F7FE, #66A6FF);
    background-clip: text;
    color: transparent;
  }
  .user-name{
    font-size: 12px;
    color: #666666;
    font-weight: 300;
  }
}
</style>
