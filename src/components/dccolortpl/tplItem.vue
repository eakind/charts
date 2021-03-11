<template>
  <div class="tpl-item">
    <div class="item-header" @click="showList = !showList">
      {{item.title}}
      <span class="all-select" @click.stop="selectAll">{{$t('message.used')}}</span>
      <span class="arrow" :class="showList ? '' : 'close'"></span>
    </div>
    <div class="item-body">
      <div v-show="showList" v-for="(child, index) in item.color" :key="index" :style="{backgroundColor: child}" @click="selectColor(child)"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TplItem',
  data () {
    return {
      showList: true
    };
  },
  props: {
    item: {
      type: Object
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
    selectColor (item) {
      this.$emit('select', item, this.item.color);
    },
    selectAll () {
      this.$emit('selectAll', this.item.color);
    }
  }
};
</script>

<style scoped lang="scss">
.tpl-item{
  background-color: white;
  .item-header{
    padding: 5px;
    font-size: 14px;
    background-color: #f2f2f2;
    position: relative;
    .all-select{
      margin-left: 10px;
      padding: 1px 10px;
      border-radius: 4px;
      color: #4284f5;
      font-size: 12px;
      cursor: pointer;
      background-color: white;
      border: 1px solid #4284f5;
      display: inline-block;
    }
    .arrow{
      width: 8px;
      height: 8px;
      border-top: 2px solid #a4a4a4;
      border-right: 2px solid #a4a4a4;
      display: inline-block;
      transform: rotate(135deg);
      right: 10px;
      top: 7px;
      position: absolute;
    }
    .close{
      top: 12px;
      transform: rotate(-45deg);
    }
  }
  .item-body{
    div{
      margin: 5px;
      width: 20px;
      height: 20px;
      display: inline-block;
      border-radius: 4px;
      cursor: pointer;
      border: 2px solid #dedede;
    }
  }
}
</style>
