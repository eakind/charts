<template>
  <div class="one-user" :style="wrapperStyle" @click="toggleSelect">
    <span class="circle" :style="{ background: list.color }"></span>
    <span class="text" :style="textStyle">{{ list.userName }}</span>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: [Number, String],
      default: 232,
    },
    height: {
      type: [Number, String],
      default: 32,
    },
    list: {
      type: Object,
      default: function () {
        return {
          color: '#ffffff',
          userName: '',
          selected: false,
          disabled: false,
        };
      },
    },
    clickEnable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    wrapperStyle () {
      return {
        width: this.width + 'px',
        height: this.height + 'px',
        borderColor:
          this.clickEnable && !this.list.disabled && this.list.selected
            ? this.list.color
            : '#fff',
        background: this.clickEnable && this.list.disabled ? '#ccc' : '#fff',
        cursor: this.clickEnable && !this.list.disabled ? 'pointer' : 'auto',
        pointerEvent: this.clickEnable && !this.list.disabled ? 'auto' : 'none',
      };
    },
    textStyle () {
      return {
        lineHeight: this.height + 'px',
      };
    },
  },
  methods: {
    toggleSelect () {
      if (this.clickEnable && !this.list.disabled) {
        this.$emit('selected', this.list, !this.list.selected);
      }
    },
  },
};
</script>

<style scoped lang='scss'>
.one-user {
  border-radius: 4px;
  border: 1px solid #fff;
  .circle {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display: inline-block;
    margin: 9px 20px 9px 9px;
  }

  .text {
    font-size: 14px;
    color: #424242;
    vertical-align: top;
  }
}
</style>
