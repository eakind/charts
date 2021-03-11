<template>
  <div class="template-list">
    <div class="template-header">
      <span class="title">选择色板</span>
      <div class="select-panel">
        <template-select class="select-list" :list="colorList" :select="select"></template-select>
      </div>
    </div>
    <div class="list-body">
      <div class="list-item" v-for="(item, index) in tplList" :key="index">
        <div class="item-header">
          <span>{{item.title}}</span>
          <span class="use-btn">套用</span>
        </div>
        <div class="item-body">
          <span class="item" v-for="(childItem, childIndex) in item.color" :key="childIndex"
                :style="{background: childItem}"></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TemplateSelect from './templateSelect.vue';
import { mapState } from 'vuex';
export default {
  data () {
    return {
      selected: '#4284f5',
      select: '全部',
      colors: ['全部', '标准', '商务', '活力']
    };
  },
  computed: {
    ...mapState('colors', ['tplList']),
    colorList () {
      let values = this.colors;
      return values.map(item => ({ id: item, name: item }));
    }
  },
  components: {
    TemplateSelect
  },
  mounted () {
  },
  methods: {
  }
};
</script>
<style lang='scss' scoped>
.template-list{
  text-align: left;
  .template-header{
    height: 40px;
    display: flex;
    align-items: center;
  }
  .select-panel {
    flex: 1;
    height: 40px;
    position: relative;
  }
  .title{
    color: #424242;
  }
  .select-list{
    top: 2px;
    left: 10px;
    position: absolute;
  }
  .list-body {
    padding: 5px 0px;
    box-sizing: border-box;
    height: calc(100% - 40px);
    background-color: #f2f2f2;
    border-radius: 4px;
    overflow-x: hidden;
    overflow-y: auto;
    line-height: 15px;
  }
  .list-item {
    margin-top: 5px;
    padding: 0px 10px;
  }
  .item-header{
    height: 30px;
    line-height: 30px;
    border-radius: 4px;
    font-size: 14px;
    padding: 0px 5px;
    box-sizing: border-box;
    background-color: white;
    position: relative;
  }
  .use-btn{
    color: white;
    width: 60px;
    height: 20px;
    line-height: 20px;
    right: 10px;
    top: 5px;
    font-size: 12px;
    text-align: center;
    border-radius: 3px;
    display: inline-block;
    background-color: #4284f5;
    position: absolute;
    cursor: pointer;
  }
  .item{
    height: 20px;
    width: 20px;
    border: 2px solid #dedede;
    display: inline-block;
    margin: 3px;
  }
}
</style>
