<template>
  <div class="select-filter">
    <div class="content" @click.stop="isList=!isList">
      <span class="iconfont icon-dbc_filterbl" :class="setCatorNum(item)" :title="selectName"> {{selectName}}</span>
      <span class="iconfont icon-db_arrow"></span>
    </div>
    <div class="list" v-if="isList" v-click-out="hideHandler">
      <div class="list-item" v-for="(item, index) in canvasFilter" :key="index" @click="selectFilter(item)">
        <span class="iconfont icon-dbc_filterbl" :class="setCatorNum(item)">{{item.filter_name}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  data () {
    return {
      selectName: '',
      isList: false
    };
  },
  props: {
    item: {
      type: [String, Object]
    }
  },
  computed: {
    ...mapState('drawingboard', ['filterAllList']),
    canvasFilter () {
      let list = this.filterAllList;
      let arr = [];
      for (let i = 0; i < list.length; i++) {
        if (list[i].relate === 1) {
          arr.push(list[i]);
        }
      }
      return arr;
    }
  },
  watch: {
    item: {
      handler (obj) {
        if (!obj) return;
        this.selectName = obj.filter_name;
      },
      deep: true
    }
  },
  components: {
  },
  mounted () {
    this.selectName = this.item.filter_name;
  },
  methods: {
    hideHandler () {
      this.isList = false;
    },
    selectFilter (item) {
      this.isList = false;
      this.$emit('change', item);
    },
    setCatorNum (item) {
      return item.filter_type !== '03' ? 'cat-active' : 'num-active';
    }
  }
};
</script>
<style lang='scss' scoped>
.select-filter{
  width: 100%;
  position: relative;
  height: 30px;
  padding: 3px;
  box-sizing: border-box;
  .content{
    display: flex;
    cursor: pointer;

    .cat-active{
  max-width: 200px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    }
  }
  .icon-dbc_filterbl{
    flex: 1;
  }
  .icon-db_arrow{
    display: inline-block;
    transform: rotate(90deg);
    position: absolute;
    right: 10px;
    top: 0px;
    font-size: 18px;
    color: #A4A4A4;
  }
  .list{
    width: 100%;
    max-height: 300px;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: white;
    position: absolute;
    box-shadow: 0 6px 14px 0 rgba(0,0,0,0.10);
    border-radius: 0 0 4px 4px;
    z-index: 10000;
  }
  .list-item{
    height: 40px;
    line-height: 40px;
    padding: 0px 5px;
    cursor: pointer;
    box-sizing: border-box;
  }
  .cat-active{
    &::before {
      color: #03B98C;
    }
  }
  .num-active{
    &::before {
      color:#4284F5;
    }
  }
}
</style>
