<template>
  <div class="dc-rangeslider">
    <div class="dc-slider-bg" @click="onSliderClick" ref="slider">
      <div class="dc-slider-bar" :style="barStyle"></div>
      <slider-button v-model="firstValue" ref="button1"></slider-button>
      <slider-button  v-model="secondValue"  ref="button2" ></slider-button>
    </div>
  </div>
</template>

<script>
import SliderButton from './button.vue';
import Emitter from './emitter';
export default {
  name: 'RangeSlider',
  mixins: [Emitter],
  props: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    value: {
      type: [Number, Array],
      default: 0
    }
  },
  components: {
    SliderButton
  },
  data () {
    return {
      firstValue: null,
      secondValue: null,
      oldValue: null,
      sliderSize: 1
    };
  },
  watch: {
    firstValue (val) {
      this.$emit('input', [this.minValue, this.maxValue]);
    },
    secondValue () {
      this.$emit('input', [this.minValue, this.maxValue]);
    },
    min () {
      this.setValues();
    },
    max () {
      this.setValues();
    },
    value: {
      handler (val) {
        if (Array.isArray(val)) {
          this.firstValue = Math.max(this.min, val[0]);
          this.secondValue = Math.min(this.max, val[1]);
        } else {
          this.firstValue = this.min;
          this.secondValue = this.max;
        }
        this.oldValue = [this.firstValue, this.secondValue];
      },
      deep: true
    }
  },
  methods: {
    setValues () {
      const val = this.value;
      if (Array.isArray(val)) {
        if (val[1] < this.min) {
          this.$emit('input', [this.min, this.min]);
        } else if (val[0] > this.max) {
          this.$emit('input', [this.max, this.max]);
        } else if (val[0] < this.min) {
          this.$emit('input', [this.min, val[1]]);
        } else if (val[1] > this.max) {
          this.$emit('input', [val[0], this.max]);
        } else {
          this.firstValue = val[0];
          this.secondValue = val[1];
        }
      }
    },
    setPosition (percent) {
      const targetValue = this.min + percent * (this.max - this.min) / 100;
      let button;
      if (Math.abs(this.minValue - targetValue) < Math.abs(this.maxValue - targetValue)) {
        button = this.firstValue < this.secondValue ? 'button1' : 'button2';
      } else {
        button = this.firstValue > this.secondValue ? 'button1' : 'button2';
      }
      this.$refs[button].setPosition(percent);
    },
    onSliderClick (event) {
      this.resetSize();
      const sliderOffsetLeft = this.$refs.slider.getBoundingClientRect().left;
      this.setPosition((event.clientX - sliderOffsetLeft) / this.sliderSize * 100);
      this.emitChange();
    },
    resetSize () {
      if (this.$refs.slider) {
        this.sliderSize = this.$refs.slider.clientWidth;
      }
    },
    emitChange () {
      this.$nextTick(() => {
        this.$emit('change', this.minValue, this.maxValue);
      });
    }
  },
  computed: {
    minValue () {
      return Math.min(this.firstValue, this.secondValue);
    },
    maxValue () {
      return Math.max(this.firstValue, this.secondValue);
    },
    barSize () {
      return `${100 * (this.maxValue - this.minValue) / (this.max - this.min)}%`;
    },
    barStart () {
      return `${100 * (this.minValue - this.min) / (this.max - this.min)}%`;
    },
    precision () {
      let precisions = [this.min, this.max].map(item => {
        let decimal = ('' + item).split('.')[1];
        return decimal ? decimal.length : 0;
      });
      return Math.max.apply(null, precisions);
    },
    barStyle () {
      return {
        width: this.barSize,
        left: this.barStart
      };
    }
  },
  mounted () {
    if (Array.isArray(this.value)) {
      this.firstValue = Math.max(this.min, this.value[0]);
      this.secondValue = Math.min(this.max, this.value[1]);
    } else {
      this.firstValue = this.min;
      this.secondValue = this.max;
    }
    this.oldValue = [this.firstValue, this.secondValue];
    this.resetSize();
    window.addEventListener('resize', this.resetSize);
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resetSize);
  }
};
</script>
<style scoped lang="scss">
.dc-rangeslider{
  width: 100%;
  max-height: 100px;
  /*overflow: hidden;*/
  .dc-slider-bg{
    width:100%;
    height:9px;
    background-color: #dedede; ///rgb(228, 231, 237);
    position:relative;
    cursor:pointer;
    vertical-align:middle
  }
  .dc-slider-bar{
    height:9px;
    background-color:#9BBCF5;
    position:absolute
  }
  .tip{
    span{
      width: 50%;
      font-size: 12px;
      display: inline-block;
      &:last-child{
        text-align: right;
      }
    }
  }
}
</style>
