<template>
  <div class="dc-checked" :class="active ? 'active' : ''">
    <span class="iconfont icon-db_check" v-show="active"></span>
  </div>
</template>

<script>
export default {
  name: 'DcChecked',
  data () {
    return {
    };
  },
  props: {
    active: {
      type: Boolean
    }
  },
  watch: {
    active (val) {
      return val;
    }
  },
  methods: {
  }
};
</script>

<style scoped lang="scss">
.dc-checked{
  width: 18px;
  height: 18px;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 12px;
  color: #4284f5;
  display: inline-block;
  border: 1px solid #e1e1e1;
  position: relative;
  background-color: white;
  .iconfont{
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
  }
}
.active{
  color: white;
  background-color: #4284f5;
}
</style>
