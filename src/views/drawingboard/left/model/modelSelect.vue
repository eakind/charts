<template>
  <div class="model-select">
    <span class="select-title">{{$t('dashboard.group_num')}}</span>
    <span class="select-txt">{{select}}</span>
    <span class="iconfont icon-db_triangle" @click="showList=!showList"></span>
    <div class="model-select-list" v-if="showList">
      <div class="list-item" @click="selectHandler(item)" v-for="(item, index) in list" :key="index">{{item}}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ModelSelect',
  data () {
    return {
      select: 3,
      showList: false
    };
  },
  props: {
    list: {
      type: Array
    }
  },
  watch: {
    list: {
      handler (arr) {
        if (arr.length > 0) {
          this.select = arr[0];
        }
      },
      deep: true
    }
  },
  components: {
  },
  mounted () {
  },
  methods: {
    selectHandler (item) {
      this.showList = false;
      if (this.select === item) return;
      this.select = item;
      this.$emit('change', item);
    }
  }
};
</script>
<style lang='scss' scoped>
.model-select{
  display: inline-block;
  min-width: 120px;
  height: 25px;
  border: 1px solid #F6B421;
  border-radius: 25px;
  position: relative;
  .select-title{
    margin-left: 10px;
    font-size: 12px;
  }
  .select-txt{
    top: 2px;
    margin-left: 15px;
    position: relative;
    display: inline-block;
  }
  .icon-db_triangle{
    color: #F6B421;
    right: 10px;
    top: 5px;
    position: absolute;
  }
  .model-select-list{
    background-color: white;
    z-index: 100;
    border: 1px solid #F6B421;
    position: absolute;
    width: 100%;
    top: 27px;
    color: #F6B421;
    text-align: center;
  }
}
</style>
