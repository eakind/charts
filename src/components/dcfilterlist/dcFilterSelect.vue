<template>
  <div class="dc-filter-select" v-click-out="hide">
    <div class="select" @click="showListHandler">
      <span class="select-font">{{selectName}}</span>
      <span class="triangle" :class="showList ? 'triangle-hide' : 'triangle-show'" ref="triangle"></span>
    </div>
    <div class="select_panel"  v-if="showList"  >
      <ul class="select_list" >
        <li v-for="(item, index) in list" :key="index" :class="selected === item.code ? 'active' : ''" @click="selectItem(item)">{{item.name}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DcFilterSelect',
  data () {
    return {
      showList: false,
      selected: this.select,
      selectName: this.timeCode[this.select]
    };
  },
  props: {
    list: {
      type: [Array]
    },
    select: {
      type: String,
      default: 'YEAR'
    },
    timeCode: {
      type: Object
    }
  },
  watch: {
    select (val) {
      this.selected = this.select;
      this.selectName = this.timeCode[this.select];
    }
  },
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
  },
  mounted () {
    this.selected = this.select;
    this.selectName = this.timeCode[this.select];
  },
  destroyed () {
  },
  methods: {
    selectItem (item) {
      if (this.selected === item.code) return;
      this.selected = item.code;
      this.selectName = item.name;
      this.showList = false;
      this.$emit('selectItem', item);
    },
    showListHandler () {
      this.showList = !this.showList;
    },
    hide () {
      this.showList = false;
    }
  }
};
</script>

<style scoped lang="scss">
.dc-filter-select{
  display: inline-block;
  font-size: 14px;
  color: #424242;
  position: relative;
  .select{
    width: 95px;
    height: 22px;
    line-height: 22px;
    text-align: left;
    padding-left: 10px;
    box-sizing: border-box;
    display: inline-block;
    color: black;
    background-color: white;
    border-radius: 4px;
    border: 1px solid #a4a4a4;
    position: relative;
    .select-font{
      font-size: 14px;
    }
    .triangle{
      // @include triangle_bottom(black);
      border-bottom-width: 7px;
      border-left-width: 5px;
      border-right-width: 5px;
      position: absolute;
      top: 8px;
      right: 8px;
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
    top: 25px;
    position: absolute;
    z-index: 999;
    width: 100px;
    max-height: 150px;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: white;
    border: 1px solid #a4a4a4;
    border-radius: 4px;
    transform-origin: 50% 0;
    text-align: center;
    .select_list {
      padding: 0px;
      margin: 0px;
      overflow-y: auto;
      overflow-x: hidden;
      list-style-type: none;
      li {
        color: black;
        font-size: 14px;
        padding: 5px;
        width: 62px;
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
  }
}
</style>
