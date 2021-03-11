<template>
  <div class="dc-select" @click.stop="showList=!showList" v-click-out="hide">
    <span class="select-txt">{{select}}</span>
    <span class="iconfont icon-db_arrow"></span>
    <div class="select-panel-list" v-if="showList">
      <div v-for="(item, index) in list" :key="index" @click.stop="selectSort(item)" class="select-panel" :class="item.name === select ? 'select-style' : ''">{{item.name}}</div>
      <div @click.stop="selectSort({name:lastName, code: 'IMPORTANCE'})" :class="setStatus()" >{{lastName}}</div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  data () {
    return {
      showList: false,
      select: '默认顺序',
      lastName: '',
      list: [
        {
          name: '默认顺序',
          code: ''
        },
        {
          name: '首字母顺序',
          code: 'LETTER',
          dir: 'desc'
        },
        {
          name: '首字母逆序',
          code: 'LETTER',
          dir: 'asc'
        }
      ]
    };
  },
  props: {
    selectName: {
      type: String
    }
  },
  computed: {
    ...mapState('drawingboard', ['modelStatus'])
  },
  watch: {
    modelStatus (val) {
      let str = '重要性排序';
      let modelStr = '未建模';
      switch (val) {
        case 'CREATED':
        case 'FAILED':
          modelStr = '未建模';
          break;
        case 'MODELING':
        case 'MODELED':
        case 'EXPIRED':
          modelStr = '已建模';
          break;
      }
      this.lastName = `${str}(${modelStr})`;
    }
  },
  methods: {
    hide () {
      this.showList = false;
    },
    selectSort (item) {
      this.showList = false;
      this.select = item.name;
      this.$emit('change', item);
    },
    setStatus () {
      switch (this.modelStatus) {
        case 'CREATED':
        case 'FAILED':
          return 'none-pointer';
        case 'MODELING':
        case 'MODELED':
        case 'EXPIRED':
          return '';
        default:
          return 'none-pointer';
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.dc-select {
  position: relative;
  font-size: 12px;
  box-sizing: border-box;
  text-align: right;
  background-color: transparent;
  .select-txt{
    min-width: 60px;
    height: 100%;
    cursor: pointer;
    display: inline-block;
    margin-right: 20px;
  }
  .iconfont {
    color: #a4a4a4;
    right: 0px;
    cursor: pointer;
    transform: rotate(90deg);
    position: absolute;
  }
  .select-panel-list {
    background-color: white;
    z-index: 9999999;
    border: 1px solid #dedede;
    position: absolute;
    width: 100%;
    left: 0px;
    padding: 0px 5px;
    border-radius: 4px;
    text-align: left;
    box-sizing: border-box;
    >div{
      cursor: pointer;
    }
    .none-pointer{
      pointer-events: none;
      color: #A4A4A4;
    }
    .select-panel {
      &:hover {
        color: #F59E28;
      }
    }
    .select-style {
      color: #F59E28;
    }
  }
}
</style>
