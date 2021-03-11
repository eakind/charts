<template>
  <div class="filter-header">
    <div class="search-input" v-if="isSearch">
      <span class="iconfont icon-db_arrowTo" @click="backHandler"></span>
      <input class="input-content" v-model="searchVal" :placeholder="$t('dashboard.filter_input_tip')" />
    </div>
    <div class="filter-select" v-else>
      <div class="select-btn" :class="isSelect" @click="changeHandler('01')">{{$t('dashboard.select')}}</div>
      <div class="exclude-btn" :class="isExclude" @click="changeHandler('02')">{{$t('dashboard.exclude')}}</div>
      <div class="search-btn">
        <span class="iconfont icon-db_magify" @click="isSearch=true">{{$t('dashboard.search')}}</span>
      </div>
    </div>
    <div class="check-all" @click="selectAllHandler">
      <dc-checked :active="selectAll"></dc-checked>
      <span class="all">{{$t('dashboard.all_select')}}</span>
    </div>
  </div>
</template>
<script>
import DcChecked from './dcChecked';
export default {
  data () {
    return {
      isSearch: false,
      searchVal: '',
      timer: null,
      selectAll: true
    };
  },
  props: {
    item: {
      type: Object
    }
  },
  computed: {
    isSelect () {
      return this.item && this.item.filter_type === '01' ? 'active-btn' : '';
    },
    isExclude () {
      return this.item && this.item.filter_type === '02' ? 'active-btn' : '';
    }
  },
  watch: {
    searchVal (val) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.$emit('search', val);
      }, 500);
    },
    item: {
      handler (itemObj) {
        let obj = {
          1: true,
          0: false
        };
        this.selectAll = obj[itemObj.select_all];
      },
      deep: true,
      immediate: true
    }
  },
  components: {
    DcChecked
  },
  mounted () {
  },
  methods: {
    backHandler () {
      this.isSearch = false;
      this.searchVal = '';
    },
    changeHandler (filterType) {
      this.$emit('change', filterType);
    },
    selectAllHandler () {
      this.selectAll = !this.selectAll;
      this.$emit('selectAll', this.selectAll);
    }
  }
};
</script>
<style lang='scss' scoped>
@mixin btn {
  height: 30px;
  width: 60px;
  text-align: center;
  line-height: 30px;
  cursor: pointer;
  background-color: #E1E1E1;
}
.filter-header{
  max-height: 80px;
  .search-input{
    height: 32px;
    background-color: white;
    display: flex;
    border-radius: 4px;
    border: 1px solid #4284f5;
  }
  .icon-db_arrowTo{
    width: 32px;
    line-height: 32px;
    text-align: center;
    color: white;
    cursor: pointer;
    background-color: #4284f5;
    &::before {
      display: inline-block;
      transform: rotate(180deg);
    }
  }
  .input-content{
    outline: none;
    border: none;
    height: 32px;
    width: 100%;
    background-color: transparent;
    padding: 0px 3px;
  }
  .filter-select{
    max-height: 50px;
    display: flex;
    align-items: center;
  }
  .select-btn {
    @include btn;
    border-radius: 4px 0px 0px 4px;
  }
  .exclude-btn {
    @include btn;
    border-radius: 0px 4px 4px 0px;
  }
  .search-btn {
    flex: 1;
    height: 30px;
    line-height: 30px;
    text-align: right;
    color: #4284f5;
  }
  .active-btn{
    background-color: #4284f5;
    color: white;
  }
  .icon-db_magify{
    cursor: pointer;
    font-size: 14px;
    &::before{
      margin-right: 10px;
    }
  }
  .check-all{
    cursor: pointer;
  }
}
</style>
