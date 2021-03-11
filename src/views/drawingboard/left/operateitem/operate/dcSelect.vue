<template>
  <div class="dc-select" v-click-out="hide">
    <div class="select-title" @click="showList=!showList">
      {{selectTitle}}
      <span class="title-tip" v-if="!selectTitle">{{tip}}</span>
      <span class="iconfont icon-db_triangle" :class="showList?'icon-rotated':''"></span>
    </div>
    <div class="select-list" v-if="showList">
      <div v-for="(item, index) in list" :key="index" @click="selectHandler(item)">{{item.name}}</div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      showList: false,
      selectTitle: ''
    };
  },
  props: {
    list: {
      type: Array
    },
    select: {
      type: String
    },
    tip: {
      type: String
    }
  },
  components: {},
  mounted () {
    this.selectTitle = this.select;
  },
  methods: {
    selectHandler (item) {
      this.selectTitle = item.name;
      this.$emit('change', item);
      this.showList = false;
    },
    hide () {
      this.showList = false;
    }
  }
};
</script>
<style lang='scss' scoped>
.dc-select {
  min-width: 220px;
  height: 30px;
  line-height: 30px;
  background-color: white;
  border: 1px solid #979797;
  border-radius: 4px;
  display: inline-block;
  color: #424242;
  cursor: pointer;
  position: relative;
  .select-title {
    height: 100%;
    width: 100%;
    color: #424242;
    padding: 0px 5px;
    .title-tip {
      font-size: 14px;
      color: #a4a4a4;
    }
  }
  .icon-db_triangle {
    position: absolute;
    right: 10px;
    font-size: 18px;
    display: inline-block;
    color: #a4a4a4;
  }
  .icon-rotated {
    transform: rotate(180deg);
  }
  .select-list {
    border: 1px solid #979797;
    border-radius: 0px 0px 4px 4px;
    position: absolute;
    width: 100%;
    top: 32px;
    max-height: 200px;
    background-color: white;
    > div {
      cursor: pointer;
      padding: 0px 10px;
      color: #424242;
    }
  }
}
</style>
