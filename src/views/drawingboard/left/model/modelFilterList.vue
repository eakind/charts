<template>
  <div class="model-filter-list">
    <div class="filter-search" :class="searchFlag?'search-active':''">
      <span v-if="!searchFlag">{{tip}}</span>
      <input ref="inputRef" v-model="searchTxt" :placeholder="tip" v-if="searchFlag" />
      <span class="iconfont icon-db_magify" @click="searchHandler"></span>
    </div>
    <div class="filter-list">
      <div v-for="(item, index) in list" v-show="item.feature_name.includes(searchTxt)" :key="index"
            @click="addHandler(item)" >
        <span class="span-add" ><span class="iconfont icon-db_plus"></span></span>
        <span class="icon iconfont icon-db_world" v-if="map(item.data_type)"></span>
        <icon-svg class="icon" icon="#icon-dbc_string" v-if="item.data_type === 'STRING'"></icon-svg>
        <icon-svg class="icon" icon="#icon-dbc_clock" v-if="item.data_type === 'DATETIME'"></icon-svg>
        <icon-svg class="icon" icon="#icon-dbc_section" v-if="item.data_type === 'BIN'"></icon-svg>
        <span class="feature-txt">{{item.feature_name}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import IconSvg from '@/components/iconsvg/iconSvg';
export default {
  name: 'ModelFilterList',
  data () {
    return {
      tip: '',
      searchTxt: '',
      searchFlag: false
    };
  },
  props: {
    type: {
      type: String
    },
    list: {
      type: Array
    }
  },
  components: {
    IconSvg
  },
  mounted () {
    if (this.type === 'CAT') {
      this.tip = this.$t('dashboard.classification_features');
    } else {
      this.tip = this.$t('dashboard.numerical_features');
    }
  },
  methods: {
    addHandler (item) {
      this.$emit('addModelFitler', item, this.type);
    },
    searchHandler () {
      this.searchFlag = !this.searchFlag;
      if (!this.searchFlag) return;
      this.$nextTick(() => {
        this.$refs.inputRef.focus();
      });
    },
    map (type) {
      switch (type) {
        case 'ZIPCODE':
        case 'DISTRICT':
        case 'PROVINCE':
        case 'CITY':
        case 'AREACODE':
        case 'CITYCODE':
        case 'MAP':
          return true;
      }
      return false;
    }
  }
};
</script>
<style lang='scss' scoped>
.model-filter-list {
  padding: 10px;
  box-sizing: border-box;
  .filter-search {
    height: 30px;
    width: 100%;
    color: #a4a4a4;
    border-radius: 4px;
    position: relative;
    > input {
      height: 100%;
      width: 90%;
      border: none;
      outline: none;
      padding: 0px 3px;
      margin: 0px;
      font-size: 16px;
      background: transparent;
    }
    .iconfont {
      right: 5px;
      top: 6px;
      cursor: pointer;
      font-size: 18px;
      position: absolute;
    }
  }
  .search-active {
    background-color: white;
  }
  .filter-list {
    height: calc(100% - 30px);
    overflow-x: hidden;
    overflow-y: auto;
    > div {
       height: 29px;
       line-height: 29px;
       cursor: pointer;
       position: relative;
       .span-add{
         display: inline-block;
         width: 16px;
         height: 16px;
         line-height: 13px;
         text-align: center;
         background-color: #4284f5;
         color: white;
         border-radius: 4px;
         margin: 0px 5px;
         top: -2px;
         position: relative;
         .iconfont{
             font-size: 12px;
         }
       }
      .feature-txt {
        width: 200px;
        display: inline-block;
        @include ellipsis;
        position: absolute;
      }
    }
  }
}
</style>
