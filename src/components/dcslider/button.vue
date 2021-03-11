<template>
  <div class="dc-slider-button" @mousedown="onButtonDown"
       @touchstart="onButtonDown" :style="wrapperStyle" ref="button"  >
  </div>
</template>

<script>
export default {
  name: 'DcSliderButton',
  props: {
    value: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      isClick: false,
      startX: 0,
      currentX: 0,
      startY: 0,
      currentY: 0,
      startPosition: 0,
      newPosition: null,
      oldValue: this.value
    };
  },
  computed: {
    max () {
      return this.$parent.max;
    },
    min () {
      return this.$parent.min;
    },
    precision () {
      return this.$parent.precision;
    },
    currentPosition () {
      return `${(this.value - this.min) / (this.max - this.min) * 100}%`;
    },
    wrapperStyle () {
      return { left: this.currentPosition };
    }
  },
  methods: {
    onButtonDown (event) {
      event.preventDefault();
      this.onDragStart(event);
      window.addEventListener('mousemove', this.onDragging);
      window.addEventListener('touchmove', this.onDragging);
      window.addEventListener('mouseup', this.onDragEnd);
      window.addEventListener('touchend', this.onDragEnd);
      window.addEventListener('contextmenu', this.onDragEnd);
    },

    onDragStart (event) {
      this.isClick = true;
      if (event.type === 'touchstart') {
        event.clientX = event.touches[0].clientX;
      }
      this.startX = event.clientX;
      this.startPosition = parseFloat(this.currentPosition);
      this.newPosition = this.startPosition;
      this.setPosition(this.newPosition);
    },
    onDragging (event) {
      this.isClick = false;
      let diff = 0;
      if (event.type === 'touchmove') {
        event.clientX = event.touches[0].clientX;
      }
      this.currentX = event.clientX;
      diff = (this.currentX - this.startX) / this.$parent.sliderSize * 100;
      this.newPosition = this.startPosition + diff;
      this.setPosition(this.newPosition);
      this.$parent.emitChange();
    },
    onDragEnd () {
      setTimeout(() => {
        if (!this.isClick) {
          this.setPosition(this.newPosition);
          this.$parent.emitChange();
        }
      }, 0);
      window.removeEventListener('mousemove', this.onDragging);
      window.removeEventListener('touchmove', this.onDragging);
      window.removeEventListener('mouseup', this.onDragEnd);
      window.removeEventListener('touchend', this.onDragEnd);
      window.removeEventListener('contextmenu', this.onDragEnd);
    },
    setPosition (newPosition) {
      if (newPosition === null || isNaN(newPosition)) return;
      if (newPosition < 0) {
        newPosition = 0;
      } else if (newPosition > 100) {
        newPosition = 100;
      }
      const lengthPerStep = 100 / ((this.max - this.min));
      const steps = Math.round(newPosition / lengthPerStep);
      let value = steps * lengthPerStep * (this.max - this.min) * 0.01 + this.min;
      value = parseFloat(value.toFixed(this.precision));
      this.$emit('input', value);
      if (this.value !== this.oldValue) {
        this.oldValue = this.value;
      }
    }
  }
};
</script>

<style scoped lang="scss">
  .dc-slider-button{
    height:24px;
    width:10px;
    position:absolute;
    z-index:1001;
    top:-7px;
    -webkit-transform:translateX(-50%);
    transform:translateX(-50%);
    background-color:#4284f5;
    border-radius: 4px;
    text-align:center;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
    line-height:normal
  }
</style>
