<template>
  <div class="blank-box">
    <span class="iconfont" :class="blankIcon"></span>
    <div class="content">{{ content }}</div>
    <div class="btn" @click="$emit('on-clear')">
      返回全部项目
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {};
  },
  props: {
    content: {
      type: String,
      default: '没有相关结果'
    },
    blankIcon: {
      type: String,
      default: 'icon-db10_box'
    }
  },
  components: {},
  mounted () {},
  methods: {}
};
</script>
<style lang='scss' scoped>
.blank-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  .iconfont {
    font-size: 80px;
    color: #fff;
    opacity: 0.5;
  }
  .content {
    color: #a4a4a4;
    font-size: 14px;
    margin-top: 20px;
  }
  .icon-db_magify{
    opacity: 0.5;
  }
  .btn {
    width: 120px;
    height: 32px;
    line-height: 32px;
    padding: 0px;
    border: 1px solid #4284F5;
    color: #4284F5;
    cursor: pointer;
    border-radius: 4px;
    margin: 0 auto;
    font-size: 14px;
    margin-top: 18px;
  }
}
</style>
