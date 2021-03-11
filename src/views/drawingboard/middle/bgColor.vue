<template>
  <div
    class="bg-color"
    :class="this.bgColor.index === 15 ? 'bg-image' : ''"
    :style="[{opacity: setBgOpacity}, setWH]"
  >
    <div class="set-bg" :style="[{background: setBgColor}]"></div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  name: 'BgColor',
  data () {
    return {};
  },
  props: {
    bgColor: {
      type: [Object],
      default: () => {
        return {
          index: 0,
          opacity: 100,
          background: '#ffffff'
        };
      }
    },
    wh: {
      type: [Number, String],
      default: ''
    },
    border: {
      type: [Number, String]
    }
  },
  computed: {
    ...mapState('colors', ['colorTemp']),
    setBgColor () {
      let index = this.bgColor.index;
      if (!this.bgColor.hasOwnProperty('index')) {
        index = 0;
      }
      if (index === -2) {
        return this.bgColor.background.background || this.bgColor.background;
      }
      if (this.colorTemp[index].backgroundIcon) {
        let setParam = 'repeat right bottom';
        if (index === 15) setParam = 'no-repeat right top 100%';
        if (index === 16) setParam = 'repeat left bottom';
        return 'url(' + this.colorTemp[index].background + ')' + setParam;
      } else if (this.colorTemp[index].background === this.bgColor.background) {
        return this.colorTemp[index].background;
      } else {
        return this.bgColor.background;
      }
    },
    setBgOpacity () {
      if (!this.bgColor.hasOwnProperty('opacity')) {
        return 100;
      }
      return this.bgColor.opacity / 100;
    },
    setWH () {
      let dist = 0;
      if (this.wh) {
        dist = 2 * Number(this.wh);
      }
      return {
        width: `calc(100% - ${dist}px)`,
        height: `calc(100% - ${dist}px)`
      };
    }
  },
  components: {},
  mounted () {},
  methods: {}
};
</script>
<style lang='scss' scoped>
.bg-color {
  width: 100%;
  height: 100%;
  left: 0px;
  top: 0px;
  z-index: 0;
  position: absolute;
  .set-bg {
    width: 100%;
    height: 100%;
  }
}
.bg-image {
  background-image: linear-gradient(
    -180deg,
    #201e1e 0%,
    #2b0b0b 30%,
    #000000 100%
  );
}
</style>
