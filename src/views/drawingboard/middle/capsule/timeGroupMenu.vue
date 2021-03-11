<template>
  <div class="time-group-menu" v-click-out="hideList">
    <menu-item txt="取消分级" icon="icon-db_minus" @click.native="cancelHandler"></menu-item>
    <menu-item txt="移除" icon="icon-db_trash" icon-type="warn" @click.native="removeHandler"></menu-item>
  </div>
</template>
<script>
import MenuItem from '../capsule/capsuleItem/menuItem.vue';
export default {
  data () {
    return {
    };
  },
  components: {
    MenuItem
  },
  mounted () {
  },
  methods: {
    cancelHandler () {
      this.$emit('cancel-time-group');
    },
    removeHandler () {
      this.$emit('remove');
    },
    hideList () {
      this.$emit('hide');
    }
  }
};
</script>
<style lang='scss' scoped>
.time-group-menu {
  width: 100%;
  z-index: 99999;
  left: 0px;
  top: 37px;
  box-shadow: 0 6px 14px 0 rgba(0,0,0,0.10);
  border-radius: 0 0 4px 4px;
  background-color: #fff;
  position: absolute;
  > div {
    padding: 0px 10px;
    &:first-child {
      border-top: none;
    }
  }
}
</style>
