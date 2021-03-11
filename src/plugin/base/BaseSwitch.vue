<template>
  <div class="base-switch" :style="switchStyle" :class="{'disabled': disabled}">
    <template v-if="!outside">
      <div class="btn active" :style="isActive ? activeStyle : ''" @click="select">{{active.text}}</div>
      <div class="btn deactive" :style="isActive ? '' : activeStyle" @click="select">{{deactive.text}}</div>
    </template>
    <template v-else>
      <div class="default" :style="defaultStyle" @click="select">
        <div class="circle" :style="circleStyle"></div>
      </div>
      <span class="text">{{outside_text}}</span>
    </template>
  </div>
</template>

<script>
export default {
  name: 'base-switch',
  props: {
    background: {
      type: String,
      default: '#fff'
    },
    color: {
      type: String,
      default: '#A4A4A4'
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
    },
    innerPadding: {
      type: [String, Number],
      default: 0
    },
    value: {
      type: Boolean,
      default: true
    },
    outside: {
      type: Boolean,
      default: false
    },
    outside_text: {
      type: String,
      default: ''
    },
    active: {
      type: Object,
      default: function () {
        return {
          text: '',
          color: '#fff',
          background: '#03B98C'
        };
      }
    },
    deactive: {
      type: Object,
      default: function () {
        return {
          text: ''
        };
      }
    }
  },
  computed: {
    switchStyle () {
      return this.outside ? `
        margin-top: 4px;
      ` : `
        color: ${this.color};
        background: ${this.background}; 
        border-radius: ${this.borderRadius}px; 
        border-color: ${this.borderColor}; 
        border-width: ${this.borderWidth}px;
        width: ${this.width}px;
        height: ${this.height}px;
        line-height: ${this.height}px;
      `;
    },
    activeStyle () {
      return `
        color: ${this.active.color};
        background: ${this.active.background};
        border-radius: ${this.borderRadius - this.innerPadding}px; 
        height: ${this.height - this.innerPadding * 2}px;
        line-height: ${this.height - this.innerPadding * 2}px;
        margin-top: ${this.innerPadding}px;
        margin-left: ${this.innerPadding}px;
        margin-right: ${this.innerPadding}px;
      `;
    },
    defaultStyle () {
      return `
        background: ${this.isActive ? '#03B98C' : '#A4A4A4'};
      `;
    },
    circleStyle () {
      return `
        right: ${this.isActive ? '' : '0px'}
      `;
    }
  },
  data () {
    return {
      isActive: this.value,
      text: this.outside_text
    };
  },
  methods: {
    select () {
      if (this.disabled) return;
      this.isActive = !this.isActive;
      this.outside_text = this.isActive ? '开启' : '隐藏';
      this.$emit('change', this.isActive);
    }
  }
};
</script>

<style lang="scss" scoped>
  .base-switch {
    box-sizing: border-box;
    cursor: pointer;
    display: inline-block;
    font-size: inherit;
    font-weight: inherit;
    text-align: center;
    border-style: solid;
    border-width: 0;
    display: flex;
    .default {
      border-radius: 6px;
      width: 40px;
      height: 12px;
      position: relative;
      .circle {
        width: 20px;
        height: 20px;
        background: #fff;
        border-radius: 50%;
        border: 1px solid #dedede;
        box-shadow: 0 0 2px 0 rgba(0,0,0,0.50);
        top: -4px;
        box-sizing: border-box;
        position: absolute;
      }
    }
    .text {
      margin-left: 5px;
      line-height: 12px;
    }
    .disabled {
      background: #D8D8D8;
      color: #fff;
    }
    &:hover {
      opacity: 0.7;
    }
    .btn {
      width: 50%;
    }
    .active {
      box-sizing: border-box;
    }
    .deactive {

    }
  }
</style>
