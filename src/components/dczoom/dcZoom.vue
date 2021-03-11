<template>
  <div class="dc-zoom">
    <dc-slider class="dc-slider" :value="size" :max="300" :min="1"  @change="changeSlider"></dc-slider>
  </div>
</template>

<script>
import DcSlider from '../dcslider/dcSlider';
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'DcZoom',
  components: { DcSlider },
  data () {
    return {
      size: 100,
      setSize: null
    };
  },
  props: {
    percentSize: {
      type: [String, Number]
    }
  },
  watch: {
    percentSize: {
      handler (val) {
        if (this.size !== val) {
          this.size = val;
        }
      },
      immediate: true
    },
    size (val) {
      this.$emit('change', val);
      this.bus.$emit('changeZoom', this.size / 100);
      this.bus.$emit('changeTooltipScale', this.size / 100);
      this.changeZoomSize(this.size / 100);
    },
    fullScreen (val) {
      if (!val) {
        this.$emit('change', this.size);
        this.bus.$emit('changeZoom', this.size / 100);
        this.bus.$emit('setrule', this.size / 100);
        this.changeZoomSize(this.size / 100);
        this.bus.$emit('changeTooltipScale', this.size / 100);
      } else {
        this.$emit('change', 100);
        this.changeZoomSize(1);
        this.bus.$emit('setrule', 1);
        this.bus.$emit('changeZoom', 1);
        this.bus.$emit('changeTooltipScale', 1);
      }
    }
  },
  computed: {
    ...mapState('dashboard', ['fullScreen']),
  },
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
  },
  beforeDestroy () {
    this.bus.$off('setZoom');
  },
  mounted () {
    this.bus.$on('setZoom', (size) => {
      if (size) {
        setTimeout(() => {
          this.size = this.setSize = size * 100;
        }, 3);
      } else {
        this.initSetZoom();
      }
    });
  },
  destroyed () {
  },
  methods: {
    ...mapMutations('dashboard', ['changeZoomSize']),
    initSetZoom () {
      this.$nextTick(() => {
        setTimeout(() => {
          let rightW = document.querySelector('.dashboard-right').clientWidth - 20;
          let rightH = document.querySelector('.dashboard-right').clientHeight - 20;
          let printW = document.querySelector('.container').clientWidth;
          let printH = document.querySelector('.container').clientHeight;
          let ratioW = rightW / printW;
          let ratioH = rightH / printH;
          if (ratioW > ratioH) {
            this.size = Math.floor((rightH / printH) * 100);
          } else {
            this.size = Math.floor((rightW / printW) * 100);
          }
          if (this.size > 300) {
            this.size = 300;
          }
        }, 0);
      });
    },
    changeSlider (item) {
      if (this.size !== item) {
        this.size = item;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.dc-zoom{
  font-size: 14px;
  outline: none;
  position: relative;
  display: inline-block;
  margin-left: 20px;
  .dc-slider{
    width: 172px!important;
    display: inline-block;
  }
}
</style>
