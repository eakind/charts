<template>
  <div class="dc-checked" :class="isActive">
    <span class="iconfont icon-db_check"></span>
  </div>
</template>
<script>
export default {
  data () {
    return {
    };
  },
  props: {
    active: {
      type: Boolean
    }
  },
  computed: {
    isActive () {
      return this.active ? 'is-active' : '';
    }
  },
  components: {
  },
  mounted () {
  },
  methods: {
  }
};
</script>
<style lang='scss' scoped>
.dc-checked{
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid #dedede;
  background-color: white;
  display: inline-block;
  margin: 3px;
  .iconfont{
    visibility: hidden;
  }
}
.is-active{
  border: 1px solid #4284f5;
  background-color: #4284f5;
  position: relative;
  .iconfont {
    color: white;
    visibility: visible;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
  }
}
</style>
