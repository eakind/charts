<template>
  <div class="user-operate" >
    <div class="operate-item" @click="backProductList" v-if="isList">
      <span class="iconfont icon-db_projectBlock">返回产品列表</span>
    </div>
    <div class="operate-item" @click="backProjectList" v-if="!isList">
      <span class="iconfont icon-db_projectBlock">返回项目列表</span>
    </div>
    <div class="operate-item set" @mouseenter="mouseEnter">
      <span class="iconfont icon-db10_useropen userspan">
        <dc-tooltip :content="`${userInfo.user_name}(设置)`" class="tipwidth" refName="tooltipOver"></dc-tooltip>
      </span>
      <span class="iconfont icon-db_triangle"></span>
    </div>
    <div class="operate-item none" @click="exitHandler">
      <span class="iconfont icon-db_exit">退出登录</span>
    </div>
    <operate-set v-if="isSet" @hide="hide"></operate-set>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { post } from '@/api/server';
import OperateSet from './operateSet.vue';
import DcTooltip from '@/components/dcTooltip/dcTooltip.vue';
export default {
  data () {
    return {
      isSet: false
    };
  },
  computed: {
    ...mapState(['userInfo']),
    isList () {
      return this.$route.name === 'projectlist';
    }
  },
  components: {
    OperateSet,
    DcTooltip
  },
  beforeDestroy () {
    document.removeEventListener('click', this.clickProcess, false);
  },
  created () {
    document.removeEventListener('mousemove', this.moveProcess, false);
    document.addEventListener('mousemove', this.moveProcess, false);

    document.addEventListener('click', this.clickProcess, false);
  },
  methods: {
    clickProcess (e) {
      let dom = document.querySelector('.user-operate');
      let curDom = document.querySelector('.user-info .user-info-btn');
      if (curDom && curDom.contains(e.target)) {
        return;
      }
      if (dom && !dom.contains(e.target)) {
        this.hide();
      }
    },
    moveProcess (e) {
      let dom = document.querySelector('.user-operate .operate-item.set');
      let cDom = document.querySelector('.operate-set');
      if (dom && !dom.contains(e.target) && cDom && !cDom.contains(e.target)) {
        this.isSet = false;
      }
    },
    hide () {
      this.isSet = false;
      this.$emit('hide');
    },
    mouseEnter (event) {
      this.isSet = true;
    },
    backProjectList () {
      this.$emit('hide');
      this.$router.push({ path: 'list' });
    },
    async exitHandler () {
      let res = await post('logout');
      if (res.code === 302 || res.code === 0) {
        localStorage.removeItem('dcUserToken');
        sessionStorage.clear();
        window.location.href = '/dist-dcee/#/';
      }
    },
    backProductList () {
      // 返回产品列表
      window.location.href = '/dist-dcee/#/platform';
    }
  }
};
</script>
<style lang='scss' scoped>
.user-operate {
  width: 260px;
  z-index: 2;
  padding-bottom: 5px;
  border-radius: 0 0 4px 4px;
  background-color: #666666;
  box-shadow: 0 24px 56px 0 rgba(0,0,0,0.10), 0 4px 14px 0 rgba(0,0,0,0.10);
  position: absolute;
  .operate-item {
    height: 40px;
    line-height: 40px;
    padding: 0px 10px;
    position: relative;
    cursor: pointer;
    border-bottom: 1px solid #424242;
    .userspan {
      width: calc(100% - 40px);
      display: flex;
      justify-content: center;
    }
  }
  .none{
    border-bottom: none;
  }
  .iconfont {
    font-size: 14px;
    color: white;
    &::before{
      font-size: 16px;
      margin-right: 5px;
    }
  }
  .icon-db_projectBlock{
    &::before{
      color: #FACC14;
    }
  }
  .icon-db10_useropen{
    &::before {
      color:#4284F5;
    }
  }
  .icon-db_exit{
    &::before{
      color: white;
    }
  }
  .icon-db_triangle{
    top: 0;
    right: 10px;
    color: white;
    transform: rotate(-90deg);
    position: absolute;
    display: inline-block;
  }
}
</style>
