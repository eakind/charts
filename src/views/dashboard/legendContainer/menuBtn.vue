<template>
  <div class="menu-btn" @click.stop="" v-click-out="hide">
    <div class="iconfont icon-db_plus"  @click="delHandler"></div>
    <div class="iconfont icon-db_triangle" @click="isShow=!isShow"></div>
    <menu-list class="menu-list"  v-if="isShow"
                :style="listPosition"
                :menu-list="list"
                @cancel-select="cancelSelected"
                @del="delHandler"></menu-list>
  </div>
</template>
<script>
import MenuList from '../boardLayout/components/menuList.vue';
export default {
  data () {
    return {
      isShow: false,
    };
  },
  components: {
    MenuList
  },
  computed: {
    listPosition () {
      let value = -104;
      return {
        right: `${value}px`
      };
    },
    list () {
      let list = [];
      let other = {
        title: '其他',
        children: [{
          title: '取消选择',
          emit: 'cancel-select',
          active: true
        }, {
          title: '移除',
          emit: 'del',
          active: true
        }]
      };
      list.push(other);
      return list;
    }
  },
  mounted () {
  },
  methods: {
    delHandler () {
      this.$showMessageBox({
        title: '移除',
        confirmText: this.$t('home.confirm'),
        cancelText: this.$t('home.cancel'),
        contentHtml: '确定移除吗？',
        cb: () => {
          this.delDashboard();
          this.$closeMessageBox();
        }
      });
    },
    delDashboard () {
      this.$emit('del');
    },
    cancelSelected () {
      this.$emit('cancel-select');
    },
    hide () {
      this.isShow = false;
    }
  }
};
</script>
<style lang='scss' scoped>
.menu-btn{
  background-color: #666666;
  height: 32px;
  width: 16px;
  z-index: 10;
  top: -2px;
  left: -16px;
  position: absolute;
  .iconfont {
    color: white;
    font-size: 14px;
    display: block;
    width: 16px;
    height: 16px;
    text-align: center;
    line-height: 16px;
    cursor: pointer;
  }
  .icon-db_plus{
    transform: rotate(45deg);
  }
  .menu-list {
    top: 32px;
    position: absolute;
  }
}
</style>
