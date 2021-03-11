<template>
    <div class = "dc-gradient">
        <div class = "dc-gradient-box" :style="getGradient"></div>
    </div>
</template>

<script>
export default {
  name: 'DcGradient',
  data () {
    return {

    };
  },
  props: ['gradientColor'],
  computed: {
    getGradient: function () {
      return 'background-image: linear-gradient(' + this.gradientColor + ')';
    }
  }
};
</script>

<style lang='scss' scoped>
    .dc-gradient {
        width: 100%;
        height: 8px;
        .dc-gradient-box {
            width: 100%;
            height: 8px;
            opacity: 50%;
        }
    }
</style>
