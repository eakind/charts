<template>
  <div class="loading">
    <div class="loadingContent">
      <img :src="path + '?' + Math.random()" />
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  data () {
    return {
      path: require('@/assets/cutbi/square.gif')
    };
  },
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
  },
  mounted () {
  },
  destroyed () {
  },
  methods: {
  }
};
</script>

<style scoped lang="scss">
.loading{
  z-index: 999999;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  text-align: center;
  background-color: rgba(255,255,255, 0.8);
  position: fixed;
  .loadingContent {
    width: 100%;
    height: 250px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    position: fixed;
  }
  img{
    width: 80px;
    // left: 50%;
    // top: 50%;
    // transform: translate(-50%, -50%);
    // position: fixed;
  }
}
</style>
