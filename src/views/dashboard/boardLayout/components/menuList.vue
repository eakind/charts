<template>
  <div class="menu-list">
     <div class="menu-item" v-for="(item, index) in menuList" :key="index">
        <span class="item-title">{{item.title}}</span>
        <div class="children-item" v-for="(childItem, childIndex) in item.children" :key="childIndex" @click.stop="selectMenu(childItem)">
            {{childItem.title}}
        </div>
     </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
    };
  },
  props: {
    menuList: {
      type: Array
    }
  },
  components: {
  },
  mounted () {
  },
  methods: {
    selectMenu (item) {
      this.$emit(item.emit, item);
    }
  }
};
</script>
<style lang='scss' scoped>
.menu-list {
  width: 120px;
  background-color: white;
  border-radius: 4px;
  padding: 0px 8px 2px;
  box-sizing: border-box;
  box-shadow: 0px 2px 4px rgba(66, 66, 66, 0.2);
  .item-title{
    font-size: 12px;
    color: #A4A4A4;
  }
  .children-item{
    height: 32px;
    font-size: 14px;
    line-height: 32px;
    color: #424242;
    cursor: pointer;
    border-bottom: 1px solid #e1e1e1;
  }
}
</style>
