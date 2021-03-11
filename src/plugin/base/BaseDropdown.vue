<template>
  <div class="base-dropdown">
    <div class="selected" :style="contentStyle">
      <span class="text">{{selected}}</span>
      <span class="triangle" :style="show_list ? triangleDefaultStyle : triangleDownStyle" @click="show_list = !show_list"></span>
    </div>
    <transition name="fade" mode="out-in" appear>
      <div class="list" v-show="show_list" :style="listStyle">
        <div class="item" :style="itemStyle(item.name)" v-for="item in list" :key="item.id" @click="select(item)">{{item.name}}</div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'base-dropdown',
  data () {
    return {
      show_list: false,
      selected: this.current
    };
  },
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
    current: {
      type: String,
      required: true
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
    },
    maxHeight: {
      type: [String, Number],
      default: 200
    },
    triangleColor: {
      type: String,
      default: 'gray'
    },
    selectedColor: {
      type: String,
      default: '#4284F5'
    }
  },
  methods: {
    select (item) {
      this.selected = item.name;
      this.show_list = false;
      this.$emit('select', item.id);
    }
  },
  computed: {
    triangleDownStyle () {
      return this.triangleDefaultStyle + `
        transform: rotate(180deg);
      `;
    },
    triangleDefaultStyle () {
      return `
        border-bottom: ${this.triangleWidth}px solid ${this.triangleColor};
        border-left: ${this.triangleWidth}px solid transparent;
        border-right: ${this.triangleWidth}px solid transparent;
        top: ${(this.height - this.triangleWidth) / 2}px;
        transition: all .3s ease-in-out;
      `;
    },
    contentStyle () {
      return `
        width: ${this.width}px;
        height: ${this.height}px;
        line-height: ${this.height}px;
        color: ${this.color};
        background: ${this.background}; 
        border-radius: ${this.borderRadius}px; 
        border-color: ${this.borderColor}; 
        border-width: ${this.borderWidth}px;
      `;
    },
    listStyle () {
      return `
        width: ${this.width}px;
        max-height: ${this.maxHeight}px;
        color: ${this.color};
        background: ${this.background}; 
        border-radius: ${this.borderRadius}px; 
        border-color: ${this.borderColor}; 
        border-width: ${this.borderWidth}px;
      `;
    },
    itemStyle () {
      return function (name) {
        return `
          height: ${this.height}px;
          line-height: ${this.height}px;
          color: ${name === this.current ? this.selectedColor : ''}
        `;
      };
    }
  },
  mounted () {

  }
};
</script>

<style lang="scss" scoped>
.base-dropdown {
  position: relative;
  .selected {
    border-style: solid;
    padding: 0 10px;
    box-sizing: border-box;
    position: relative;
    .triangle {
      display: inline-block;
      cursor: pointer;
      position: absolute;
      right: 10px;
    }
  }
  .list {
    overflow: auto;
    position: absolute;
    margin-top: 2px;
    border-style: solid;
    .item {
      padding: 0 10px;
      box-sizing: border-box;
      cursor: pointer;
      &:hover {
        opacity: 0.7;
      }
    }
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
}
</style>
