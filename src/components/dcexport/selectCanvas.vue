<template>
  <div class="dc-drop" @click="showList=!showList" v-click-out="hide">
   <span class="drop-title">{{select}}</span>
    <span class="triangle" :class="showList ? 'triangle-hide' : 'triangle-show'"></span>
    <div class="dc-drop-list" v-if="showList">
      <div v-for="(item, index) in list" :key="index" v-show="item" @click="selectHandler(item, index)">
        {{item ? item.worksheetTitle : ''}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectCanvas',
  data () {
    return {
      select: this.tip,
      showList: false
    };
  },
  props: {
    list: {
      type: Array
    },
    tip: {
      type: String
    }
  },
  watch: {
    tip (val) {
      this.select = val;
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
    hide () {
      this.showList = false;
    },
    selectHandler (item, index) {
      this.select = item.worksheetTitle;
      this.$emit('change', item);
    }
  }
};
</script>

<style scoped lang="scss">
.dc-drop{
  width: 230px;
  height: 28px;
  line-height: 28px;
  border-radius: 4px;
  font-size: 14px;
  padding: 0px 10px;
  color: #424242;
  border: 1px solid #979797;
  background-color: white;
  display: inline-block;
  position: relative;
  .drop-title{
    height: 38px;
    min-width: 50px;
    max-width: 200px;
    color: #424242;
    display: inline-block;
    @include ellipsis;
  }
  .triangle{
    // @include triangle_bottom(#d8d8d8);
    border-bottom-width: 7px;
    border-left-width: 5px;
    border-right-width: 5px;
    position: absolute;
    top: 40%;
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
  .dc-drop-list{
    width: 100%;
    top: 30px;
    left: 0px;
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 250px;
    color: #424242;
    z-index: 999;
    border: 1px solid #979797;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    background-color: white;
    position: absolute;
    div{
      font-size: 12px;
      padding: 0px 10px;
    }
  }
}
</style>
