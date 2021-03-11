<template>
  <div class="board-zoom" @mouseleave="mouseleave">
    <span class="zoom-title">{{$t('home.zoom_tip')}}</span>
    <div class="zoom-row">
      <input class="zoom-input" @input="inputProcess" v-model="zoomPercent" />
      <span class="zoom-unit">%</span>
      <dc-zoom @change="changeHandler" :percent-size="Math.floor(zoomSize * 100)"></dc-zoom>
    </div>
  </div>
</template>
<script>
import DcZoom from '@/components/dczoom/dcZoom.vue';
import { mapState, mapMutations } from 'vuex';
export default {
  data () {
    return {
      zoomPercent: 100,
      flag: false
    };
  },
  computed: {
    ...mapState('dashboard', ['zoomSize'])
  },
  watch: {
    zoomSize: {
      handler (val) {
        if (this.flag) {
          this.zoomPercent = '';
          this.flag = false;
        } else {
          this.zoomPercent = Math.floor(val * 100);
        }
      },
      immediate: true
    },
  },
  components: {
    DcZoom
  },
  mounted () {
    this.zoomPercent = Math.floor(this.zoomSize * 100);
  },
  methods: {
    ...mapMutations('dashboard', ['changeZoomSize']),
    inputProcess (e) {
      let val = e.target.value;
      let reg = /^(0|\+?[1-9][0-9]*)$/;
      if (!reg.test(val)) {
        this.zoomPercent = val.slice(0, val.length - 1);
      }
      if (val > 300) {
        this.zoomPercent = 300;
      }
      if (val === '0') {
        this.zoomPercent = 1;
      }
      if (val === '') {
        this.zoomPercent = '';
        this.flag = true;
      } else {
        this.changeZoomSize(this.zoomPercent / 100);
      }
    },
    changeHandler (val) {
      if (val === 0) {
        this.zoomPercent = '';
      } else {
        this.zoomPercent = Math.floor(val);
      }
    },
    mouseleave () {
      this.$emit('hide');
    }
  }
};
</script>
<style lang='scss' scoped>
.board-zoom{
  box-sizing: border-box;
  height: 80px;
  width: 334px;
  padding-left: 24px;
  background: #FBFCFF;
  position: absolute;
  left: 0;
  top: 50px;
  z-index: 100;
  box-shadow: 0px 2px 4px rgba(66, 66, 66, 0.2);
  .zoom-title{
    color: #A4A4A4;
    display: block;
    margin: 5px 0px;
    font-size: 12px;
  }
  .zoom-row {
    display: flex;
    align-items: center;
  }
  .zoom-input {
    height: 36px;
    margin: 0px;
    width: 60px;
    line-height: 36px;
    box-sizing: border-box;
    border: 1px solid #DEDEDE;
    border-radius: 4px;
    text-align: center;
    outline: none;
  }
  .zoom-unit {
    color: #666666;
    margin-left: 8px;
    font-size: 14px;
  }
}
</style>
