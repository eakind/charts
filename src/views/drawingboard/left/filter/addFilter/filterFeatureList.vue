<template>
  <div class="filter-feature-list">
    <div class="search">
      <span @click="searchFlag=true" v-if="!searchFlag">
        <span>{{tipTxt}}</span>
        <span class="iconfont icon-db_magify"></span>
      </span>
      <span class="search-input" v-if="searchFlag">
        <input v-model="searchTxt" :placeholder="tipTxt" />
        <span class="iconfont icon-db_magify" @click="searchFlag=false"></span>
      </span>
    </div>
    <div class="feature-list">
      <div
        class="list-item"
        v-for="(item, index) in list"
        :key="index"
        v-show="item.feature_name.includes(searchTxt)"
        @click="selectHandler(item)"
      >
        <span class="iconfont icon-db_plus"></span>
        <span class="icon iconfont icon-db_world" v-if="map(item)"></span>
        <icon-svg
          class="icon classify-icon"
          icon="#icon-dbc_string"
          v-if="item.data_type === 'STRING'"
        ></icon-svg>
        <icon-svg
          class="icon classify-icon"
          icon="#icon-dbc_clock"
          v-if="item.data_type === 'DATETIME'"
        ></icon-svg>
        <icon-svg
          class="icon classify-icon"
          icon="#icon-dbc_section"
          v-if="item.data_type === 'BIN'"
        ></icon-svg>
        <span class="feature-txt" :class="item.formula_type?'formula-text':''">{{item.feature_name}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import IconSvg from '@/components/iconsvg/iconSvg';
import { mapState } from 'vuex';
export default {
  components: {
    IconSvg
  },
  data () {
    return {
      searchFlag: false,
      searchTxt: '',
      tipTxt: ''
    };
  },
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      }
    },
    cat: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('drawingboard', ['filterList'])
  },
  mounted () {
    if (this.cat) {
      this.tipTxt = '分类特征';
    } else {
      this.tipTxt = '数值特征';
    }
  },
  methods: {
    map (item) {
      let obj = {
        ZIPCODE: true,
        DISTRICT: true,
        PROVINCE: true,
        CITY: true,
        AREACODE: true,
        CITYCODE: true,
        MAP: true
      };
      return obj[item.data_type];
    },
    selectHandler (item) {
      this.$emit('change', item, this.cat);
    }
  }
};
</script>
<style lang='scss' scoped>
.filter-feature-list {
  height: 100%;
  .search {
    height: 50px;
    line-height: 50px;
    font-weight: 300;
    color: #a4a4a4;
    padding: 0px 10px;
    position: relative;
    .icon-db_magify {
      right: 5px;
      cursor: pointer;
      position: absolute;
      display: inline-block;
    }
    .search-input {
      height: 30px;
      line-height: 30px;
      width: 100%;
      border-radius: 4px;
      margin-top: 10px;
      display: inline-block;
      border: 1px solid #e1e1e1;
      background-color: white;
      position: relative;
      > input {
        height: 30px;
        border: none;
        border-radius: 4px;
        padding: 0px 3px;
        margin: 0px;
        width: calc(100% - 30px);
        position: absolute;
        top: 0px;
        outline: none;
      }
      .icon-db_magify {
        right: 5px;
        cursor: pointer;
        position: absolute;
      }
    }
  }
  .feature-list {
    overflow-x: hidden;
    overflow-y: auto;
    width: 100%;
    height: calc(100% - 50px);
    .list-item {
      color: #424242;
      padding: 3px 10px;
      cursor: pointer;
      width: 100%;
      .icon-db_plus {
        margin-right: 5px;
        display: inline-block;
        color: white;
        border-radius: 3px;
        background-color: #4284f5;
        width: 16px;
        height: 16px;
        font-size: 12px;
        text-align: center;
        line-height: 16px;
      }
      .feature-txt {
        margin: 0px 0px;
        width: 70%;
        top: 5px;
        position: relative;
        @include ellipsis;
        display: inline-block;
      }
    }
  }
   .formula-text{
    color:  #F59E28;;
  }
}
</style>
