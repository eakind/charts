<template>
  <div class="loading">
    <img :src="path + '?' + Math.random()" />
    <span>{{$t('message.loading')}}</span>
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
  background-color: rgba(66,66,66, 0.75);
  position: fixed;
  img{
    width: 80px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    position: fixed;
  }
  span{
    left: 50%;
    top: 60%;
    color: white;
    font-size: 18px;
    transform: translate(-50%, -50%);
    position: fixed;
  }
}
</style>
