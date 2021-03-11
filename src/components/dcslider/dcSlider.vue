<template>
  <div class="dc-slider flex" :aria-valuemin="min" :aria-valuemax="max">
    <div class="tip" v-if="textObj.left">{{ textObj.left }}</div>
    <div class="dc-slider-bg" @click.stop="onSliderClick" ref="slider">
      <div class="dc-slider__bar" :style="barStyle"></div>
      <slider-button v-model="firstValue" ref="button"></slider-button>
    </div>
    <div class="tip" v-if="textObj.right">{{ textObj.right }}</div>
    <!-- <div class="tip" v-if="textObj.left !== '' && textObj.right !== ''">
      <span>
        {{ textObj.left }}
      </span>
      <span>
        {{ textObj.right }}
      </span>
    </div> -->
  </div>
</template>
<script>
import SliderButton from './button.vue';
export default {
  name: 'DcSlider',
  props: {
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    step: {
      type: Number,
      default: 2,
    },
    value: {
      type: [Number, String],
    },
    textObj: {
      type: Object,
      default: () => {
        return {
          left: '',
          right: '',
        };
      },
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    SliderButton,
  },
  data () {
    return {
      firstValue: this.value,
      sliderSize: 1,
    };
  },
  computed: {
    barSize () {
      return `${(100 * (this.firstValue - this.min)) / (this.max - this.min)}%`;
    },
    precision () {
      let precisions = [this.min, this.max].map((item) => {
        let decimal = ('' + item).split('.')[1];
        return decimal ? decimal.length : 0;
      });
      return Math.max.apply(null, precisions);
    },
    barStyle () {
      return {
        width: this.barSize,
        left: '0%',
      };
    },
  },
  watch: {
    show (val) {},
    value (val) {
      this.firstValue = Number(val);
    },
  },
  methods: {
    setPosition (percent) {
      // const targetValue = this.min + percent * (this.max - this.min) / 100;
      this.$refs.button.setPosition(percent);
    },
    onSliderClick (event) {
      this.resetSize();
      const sliderOffsetLeft = this.$refs.slider.getBoundingClientRect().left;
      // this.sliderSize
      this.setPosition(
        ((event.clientX - sliderOffsetLeft) / this.$refs.slider.clientWidth) *
          100
      );
      this.emitChange();
    },
    resetSize () {
      if (this.$refs.slider) {
        this.sliderSize =
          this.$refs.slider.clientWidth < 100
            ? 180
            : this.$refs.slider.clientWidth;
      }
    },
    emitChange () {
      this.$nextTick(() => {
        this.$emit('change', this.firstValue);
      });
    },
  },
  mounted () {
    this.resetSize();
  },
  beforeDestroy () {},
};
</script>
<style scoped lang="scss">
* {
  box-sizing: border-box;
}
.flex {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.tips {
  padding-right: 8px;
}
.dc-slider {
  width: 100%;
  .dc-slider-bg {
    // flex: 1;
    width: 80%;
    height: 10px;
    background-color: #d6d6d6;
    position: relative;
    cursor: pointer;
    vertical-align: middle;
    border-radius: 4px;
  }
  .dc-slider__bar {
    height: 10px;
    background-color: #d6d6d6;
    position: absolute;
    border-radius: 4px;
  }
  // .tip{
  //   span{
  //     width: 50%;
  //     font-size: 12px;
  //     display: inline-block;
  //     &:last-child{
  //       text-align: right;
  //     }
  //   }
  // }
}
</style>
