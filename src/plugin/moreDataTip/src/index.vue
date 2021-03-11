<template>
  <dc-alert class="more-data-tip" v-if="show">
    <div class="more-tip-header">
      <span>数据过多</span>
      <span class="iconfont icon-db_plus" @click="confirmHandler"></span>
    </div>
    <div class="more-tip-body">
      当前选择的特征数据较多，将自动显示最大的{{num}}个数据。剩余数据归为“其他”
      <div>（右侧“数据设置”可手动修改）</div>
    </div>
    <div class="more-tip-footer">
      <span @click="confirmHandler">知道了</span>
    </div>
  </dc-alert>
</template>
<script>
import dcAlert from '@/components/dcalert/dcAlert.vue';
export default {
  data () {
    return {
      show: false,
      num: 1000,
      cb: null,
      rowList: [],
      columnList: [],
      colorList: [],
      labels: []
    };
  },
  components: {
    dcAlert
  },
  mounted () {
  },
  methods: {
    isMore () {
      this.show = true;
    },
    confirmHandler () {
      this.show = false;
      typeof this.cb === 'function' && this.cb();
    }
  }
};
</script>
<style lang='scss' scoped>
.more-data-tip {
  background-color: white;
  width: 400px;
  box-sizing: border-box;
  padding: 8px 16px;
  .more-tip-header{
    padding: 8px 0px;
    position: relative;
    .icon-db_plus{
      right: 0px;
      top: 10px;
      color: #a4a4a4;
      transform: rotate(45deg);
      position: absolute;
      cursor: pointer;
    }
  }
  .more-tip-body{
    margin: 8px 0px;
    text-align: center;
    color: #666666;
    background-color: #F5F9FE;
    padding: 16px 8px;
    font-size: 14px;
  }
  .more-tip-footer{
    color: #4284f5;
    font-size: 14px;
    padding: 16px 0px;
    text-align: center;
    > span {
      cursor: pointer;
    }
  }
}
</style>
