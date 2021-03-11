<template>
  <div class="feature-list">
    <div class="list-header">
      <span class="title">特征列表</span>
      <span class="reset">恢复默认</span>
    </div>
    <div class="list-body">
      <list-item v-for="(item, index) in 15" :key="index"></list-item>
    </div>
  </div>
</template>
<script>
import ListItem from './listItem.vue';
export default {
  data () {
    return {
    };
  },
  components: {
    ListItem
  },
  mounted () {
  },
  methods: {
  }
};
</script>
<style lang='scss' scoped>
.feature-list{
  height: 100%;
  .list-header {
    height: 40px;
    position: relative;
    font-size: 14px;
    text-align: left;
  }
  .title{
    color: #424242;
  }
  .reset {
    right: 10px;
    color: #A4A4A4;
    cursor: pointer;
    text-decoration: underline;
    position: absolute;
  }
  .list-body {
    background-color: #f2f2f2;
    box-sizing: border-box;
    padding: 5px 10px;
    border-radius: 4px;
    height: calc(100% - 40px);
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
