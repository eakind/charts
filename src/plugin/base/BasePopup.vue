<template>
  <div class="base-popup">
    <div class="triangle" :style="triangleStyle">
      <span :style="triangleInnerStyle"></span>
    </div>
    <div class="content" :style="contentStyle">
      <div class="choice" :style="choiceStyle(index)" v-for="(item, index) in list" :key="item.id" @click="select(item)">{{item.name}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'base-popup',
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
    position: {
      type: String,
      default: 'bottom'
    },
    list: {
      type: Array,
      required: true
    },
    width: {
      type: [String, Number],
      default: 120
    },
    height: {
      type: [String, Number],
      default: 30
    },
    triangleWidth: {
      type: [String, Number],
      default: 12
    }
  },
  methods: {
    select (item) {
      this.$emit('select', item.id);
    }
  },
  computed: {
    triangleStyle () {
      return `
        border-bottom: ${this.triangleWidth}px solid ${this.borderColor};
        border-left: ${this.triangleWidth}px solid transparent;
        border-right: ${this.triangleWidth}px solid transparent;
      `;
    },
    triangleInnerStyle () {
      return `
        border-left: ${this.triangleWidth}px solid transparent;
        border-right: ${this.triangleWidth}px solid transparent;
        border-bottom: ${this.triangleWidth}px solid ${this.background};
        left: -${this.triangleWidth}px;
        top: ${this.borderWidth}px;
      `;
    },
    contentStyle () {
      return `
        color: ${this.color};
        background: ${this.background}; 
        border-radius: ${this.borderRadius}px; 
        border-color: ${this.borderColor}; 
        border-width: ${this.borderWidth}px;
      `;
    },
    choiceStyle () {
      return function (index) {
        return `
          width: ${this.width}px;
          height: ${this.height}px;
          line-height: ${this.height}px;
          border-bottom: ${index < this.list.length - 1 ? `${this.borderWidth}px solid ${this.borderColor}` : 'none'}
        `;
      };
    }
  },
  mounted () {

  }
};
</script>

<style lang="scss" scoped>
  .base-popup {
    position: absolute;
    z-index: 100;
    font-size: inherit;
    font-weight:inherit;
    //box-shadow: 0 4px 12px 0 rgba(66,66,66,0.30);
    .triangle {
      width: 0px;
      height: 0px;
      position: relative;
      margin: auto;
      >span {
        display: block;
        width: 0;
        height: 0;
        position: absolute;
      }
    }
    .content {
      text-align: center;
      border-style: solid;
      .choice {
        border-radius: inherit;
        border-bottom-left-radius: unset;
        border-bottom-right-radius: unset;
        cursor: pointer;
        &:hover {
          opacity: 0.7;
        }
      }
    }
  }
</style>
