<template>
  <div class="group-menu" v-click-out="hideList" @mousedown.stop="" @touchmove.stop="" @touchstart.stop="">
    <menu-item txt="增加特征" icon="icon-db_plus" @click.native="combinedHandler" v-show="!isCombined"></menu-item>
    <menu-item txt="取消组合" icon="icon-db_minus" @click.native="cancelHandler" v-show="isCombined && !isInsert"></menu-item>
    <menu-item txt="取消增加" icon="icon-db_minus" @click.native="cancelHandler" v-show="isInsert"></menu-item>
    <menu-item txt="移除" icon="icon-db_trash" icon-type="warn" @click.native="remove"></menu-item>  </div>
</template>
<script>
import MenuItem from './capsuleItem/menuItem.vue';
export default {
  data () {
    return {
    };
  },
  props: {
    isInsert: {
      type: Boolean
    },
    isCombined: {
      type: Boolean
    }
  },
  components: {
    MenuItem
  },
  mounted () {
  },
  methods: {
    hideList () {
      this.$emit('hide');
    },
    combinedHandler () {
      this.$emit('creat-grouping');
    },
    cancelHandler () {
      this.$emit('cancel-group');
    },
    remove () {
      this.$emit('remove');
    }
  }
};
</script>
<style lang='scss' scoped>
.group-menu {
  width: 100%;
  z-index: 99999;
  left: 0px;
  top: 36px;
  border: 1px solid #dedede;
  background-color: #fff;
  position: absolute;
  > div {
    padding: 0px 10px;
  }
}
</style>
