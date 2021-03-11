<template>
  <div class="base-button" :style="buttonStyle" :class="{'disabled': disabled}" @click="click">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'base-button',
  props: {
    background: {
      type: String,
      default: '#fff'
    },
    color: {
      type: String,
      default: '#000'
    },
    borderRadius: {
      type: [String, Number],
      default: 4
    },
    borderColor: {
      type: String,
      default: 'gray'
    },
    borderWidth: {
      type: [String, Number],
      default: 1
    },
    width: {
      type: [String, Number],
      default: 120
    },
    height: {
      type: [String, Number],
      default: 30
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    buttonStyle () {
      return `
        color: ${this.color};
        background: ${this.background}; 
        border-radius: ${this.borderRadius}px; 
        border-color: ${this.borderColor}; 
        border-width: ${this.borderWidth}px;
        width: ${this.width}px;
        height: ${this.height}px;
        line-height: ${this.height}px;
      `;
    }
  },
  methods: {
    click () {
      this.$emit('click');
    }
  }
};
</script>

<style lang="scss" scoped>
  .base-button {
    box-sizing: border-box;
    cursor: pointer;
    display: inline-block;
    font-size: inherit;
    font-weight: inherit;
    text-align: center;
    border-style: solid;
    .disabled {
      background: #D8D8D8;
      color: #fff;
    }
    &:hover {
      opacity: 0.7;
    }
  }
</style>
