<template>
  <div class="dc-select">
    <div class="select" @click.stop="showListHandler">
      <span class="select-font">{{selected}}</span>
      <span class="triangle" :class="showList ? 'triangle-hide' : 'triangle-show'" ref="triangle"></span>
    </div>
    <div class="select_panel"  v-if="showList"  v-click-out="hide">
      <ul class="select_list" >
        <li v-for="(item, index) in list" :key="index" :class="selected === item ? 'active' : ''" @click="selectItem(item)">{{item}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showList: false,
      selected: 'RGBA'
    };
  },
  props: {
    list: {
      type: [Array, Object],
      default: () => {
        return ['RGBA'];
      }
    }
  },
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
  },
  mounted () {
  },
  destroyed () {
  },
  methods: {
    showListHandler () {
      this.showList = !this.showList;
    },
    hide () {
      this.showList = false;
    },
    selectItem (item) {
      this.showList = false;
      if (this.selected !== item) {
        this.selected = item;
        this.$emit('selectItem', item);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.dc-select{
  color: #a4a4a4;
  position: relative;
  .select{
    width: 65px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    padding-right: 10px;
    display: inline-block;
    color: black;
    padding: 0px 5px;
    background-color: white;
    border: 1px solid #a4a4a4;
    position: relative;
    .select-font{
      font-size: 14px;
    }
    .triangle{
      @include triangle_bottom(black);
      border-bottom-width: 7px;
      border-left-width: 5px;
      border-right-width: 5px;
      position: relative;
      top: -1px;
      left: 8px;
    }
    .triangle-show{
      transform: rotate(-180deg);
      transition: all .3s ease-in-out;
    }
    .triangle-hide{
      transform: rotate(0deg);
      transition: all .3s ease-in-out;
    }
  }
  .select_panel{
    position: absolute;
    z-index: 999;
    min-width: 62px;
    max-width: 200px;
    max-height: 200px;
    background-color: white;
    -webkit-animation: slide-down 0.3s ease-in-out;
    transform-origin: 50% 0;
    text-align: center;
    .select_list {
      padding: 0px;
      margin: 0px;
      overflow-y: auto;
      overflow-x: hidden;
      list-style-type: none;
      border: 1px solid #979797;
      border-top: none;
      li {
        color: black;
        font-size: 14px;
        padding: 5px;
        width: 75px;
        box-sizing: border-box;
        text-align: left;
        cursor: pointer;
        &:hover{
          color: #4284f5;
        }
      }
      .active{
        color: #4284f5;
      }
    }
    @-webkit-keyframes slide-down{
      0%{transform: scale(1,0);}
      50%{transform: scale(1,1.05);}
      100%{transform: scale(1,1);}
    }
  }
}
</style>
