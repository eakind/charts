<template>
  <div class="filter-cat-item">
    <div class="cat-item-header">
      <div class="dc-filter-canvas" v-if="!hideCanvas">
        {{$t('message.link_canvas')}}
        <span class="dc-filter-canvaslsit">
          <span
            v-for="(canvasItem, canvasKey) in getCanvasIndex(item.worksheet_list)"
            :key="canvasKey"
          >{{canvasItem}}</span>
        </span>
      </div>
      <div class="dc-time-format" v-if="item.datetime_type">
        {{$t('message.select_format')}}
        <dc-filter-select
          :list="timeCodeList"
          :time-code="timeCode"
          :select="item.datetime_type.toLocaleUpperCase()"
          @selectItem="selectItem"
        ></dc-filter-select>
      </div>
      <div class="dc-filter-btn" v-if="!searchMode">
        <button
          class="select-btn"
          :class="selectBtn === 'select' ? 'filter-active' : ''"
          @click="selectHandler"
        >{{$t('message.select')}}</button>
        <button
          class="negation-btn"
          :class="selectBtn === 'negation' ? 'filter-active' : ''"
          @click="negationHandler"
        >{{$t('message.exclude')}}</button>
        <!-- <button
          class="all-btn"
          :class="selectBtn === 'all' ? 'filter-active' : ''"
          @click="allHandler"
        >{{$t('message.select_all')}}</button>-->
        <span class="filter-search" @click="searchMode =true">
          <span class="iconfont icon-db_magify"></span>
          <span class="search-txt">搜索</span>
        </span>
      </div>
      <div class="dc-filter-search" v-if="searchMode">
        <span class="iconfont icon-db_arrowTo" @click="searchMode=false;filterValue=''"></span>
        <input type="text" :placeholder="$t('message.search')" v-model="filterValue" />
      </div>
      <div class="select-all" @click="selectAllHandler">
        <dc-checked :active="selectAll"></dc-checked>
        <span class="all-label">全选</span>
      </div>
    </div>
    <scroll-view :height="height" @loadMore="loadMore">
      <div
        class="list-item"
        v-for="(valueItem, valueIndex) in featureList"
        :key="valueIndex"
        :class="valueItem.flag === 1 ? 'select' : ''"
        @click.stop="selectFilter(valueItem, valueIndex)"
      >
        <span class="title" :title="valueItem.name">{{valueItem.name}}</span>
        <span class="iconfont icon-db_check" v-show="valueItem.flag===1"></span>
      </div>
    </scroll-view>
  </div>
</template>
<script>
import ScrollView from './scrollView';
import DcFilterSelect from './dcFilterSelect';
import DcChecked from '../dcchecked/dcChecked';
import { get } from '../../api/server';
import { mapState } from 'vuex';
export default {
  name: 'FilterCatItem',
  components: {
    ScrollView,
    DcFilterSelect,
    DcChecked
  },
  data () {
    return {
      offset: 0,
      limit: 100,
      filterValue: '',
      selectBtn: 'select',
      searchMode: false,
      featureList: [],
      loadFlag: false,
      timer: null,
      operateList: [],
      temp: null,
      selectAll: true,
      selectList: []
    };
  },
  props: {
    tempList: {
      type: [Array],
      default: () => {
        return [];
      }
    },
    item: {
      type: Object
    },
    index: {
      type: Number
    },
    height: {
      type: String,
      default: '200px'
    },
    hideCanvas: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('project', ['projectId']),
    ...mapState('drawingboard', ['canvasList', 'timeCodeList', 'timeCode'])
  },
  watch: {
    item: {
      handler (obj) {
        if (this.item.filter_type === '02') {
          this.selectBtn = 'negation';
        } else {
          this.selectBtn = 'select';
        }
        if (this.item.select_all === 0) {
          this.selectAll = false;
        } else {
          this.selectAll = true;
        }
        if (this.temp.datetime_type === obj.datetime_type && this.temp.select_all === obj.select_all) {
          return;
        }
        this.temp = JSON.parse(JSON.stringify(this.item));
        this.offset = 0;
        this.featureList = [];
        this.filterUnique();
      },
      deep: true
    },
    filterValue (val) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        if (val.length === 0) {
          this.offset = 0;
          this.featureList = [];
          this.filterUnique();
        } else {
          this.featureList = [];
          this.searchFilterUnique();
        }
      }, 100);
    },
    tempList: {
      handler () {
        for (let i = 0; i < this.tempList.length; i++) {
          if (this.tempList[i].filter_id === this.temp.filter_id) {
            this.selectList = this.tempList[i].filter_values;
          }
        }
      },
      deep: true
    }
  },
  mounted () {
    if (this.item.filter_type === '02') {
      this.selectBtn = 'negation';
    } else {
      this.selectBtn = 'select';
    }
    if (this.item.select_all === 0) {
      this.selectAll = false;
    }
    this.temp = JSON.parse(JSON.stringify(this.item));
    this.offset = 0;
    this.featureList = [];
    this.filterUnique();
  },
  methods: {
    selectAllHandler () {
      this.selectAll = !this.selectAll;
      if (this.selectAll) {
        let len = this.operateList.length;
        for (let i = 0; i < len; i++) {
          this.operateList[i].flag = 1;
        }
      }
      this.$emit('selectAll', this.selectAll);
      // this.$emit(
      //   'change',
      //   this.index,
      //   this.item,
      //   this.selectBtn,
      //   this.operateList,
      //   this.selectAll
      // );
    },
    selectItem (item) {
      this.$emit('changeTime', this.index, this.item, item.code);
    },
    selectHandler () {
      if (this.selectBtn === 'select') return;
      this.selectBtn = 'select';
      this.$emit(
        'change',
        this.index,
        this.item,
        this.selectBtn,
        this.operateList,
        this.selectAll
      );
    },
    negationHandler () {
      if (this.selectBtn === 'negation') return;
      this.selectBtn = 'negation';
      this.$emit(
        'change',
        this.index,
        this.item,
        this.selectBtn,
        this.operateList,
        this.selectAll
      );
    },
    selectFilter (item, index) {
      if (item.flag === 1) {
        item.flag = 0;
        this.selectAll = false;
      } else {
        item.flag = 1;
      }
      if (this.item.filter_type === '02') {
        this.selectBtn = 'negation';
      } else {
        this.selectBtn = 'select';
      }
      let flag = false;
      let flagIndex = 0;
      for (let i = 0; i < this.operateList.length; i++) {
        if (item.name === this.operateList[i].name) {
          flag = true;
          flagIndex = i;
        }
      }
      if (flag) {
        this.operateList.splice(flagIndex, 1, item);
      } else {
        this.operateList.push(item);
      }
      this.$emit(
        'change',
        this.index,
        this.item,
        this.selectBtn,
        this.operateList,
        this.selectAll
      );
    },
    getCanvasIndex (worksheetList) {
      let arr = [];
      for (let i = 0; i < worksheetList.length; i++) {
        for (let j = 0; j < this.canvasList.length; j++) {
          if (
            this.canvasList[j].worksheet_id === worksheetList[i].worksheet_id
          ) {
            arr.push(j + 1);
          }
        }
      }
      arr.sort((a, b) => {
        return a - b;
      });
      return arr;
    },
    loadMore () {
      if (this.loadFlag) return;
      if (this.filterValue.length > 0) return;
      this.offset = this.offset + this.limit;
      this.filterUnique();
    },
    async searchFilterUnique () {
      let param = {
        project_id: this.projectId,
        filter_id: this.item.filter_id,
        key: this.filterValue
      };
      let res = await get('filterSearch', param);
      if (!res) return;
      if (this.selectList.length > 0) {
        let list1 = this.selectList;
        let len1 = this.selectList.length;
        let list2 = res.feature_list;
        let len2 = res.feature_list.length;
        for (let i = 0; i < len1; i++) {
          for (let j = 0; j < len2; j++) {
            if (list1[i].name === list2[j].name) {
              list2.splice(j, 1, list1[i]);
            }
          }
        }
      }
      this.featureList = res.feature_list;
    },
    async filterUnique () {
      let param = {
        project_id: this.projectId,
        filter_id: this.item.filter_id,
        offset: this.offset,
        limit: this.limit
      };
      let res = await get('filterUnique', param);
      if (!res) return;
      if (res.feature_list.length < this.limit) {
        this.loadFlag = true;
      } else {
        this.loadFlag = false;
      }
      if (this.selectList.length > 0) {
        let list1 = this.selectList;
        let len1 = this.selectList.length;
        let list2 = res.feature_list;
        let len2 = res.feature_list.length;
        for (let i = 0; i < len1; i++) {
          for (let j = 0; j < len2; j++) {
            if (list1[i].name === list2[j].name) {
              list2.splice(j, 1, list1[i]);
            }
          }
        }
      }
      this.featureList = this.featureList.concat(res.feature_list);
    }
  }
};
</script>
<style lang='scss' scoped>
.filter-cat-item {
  background-color: white;
  .cat-item-header {
    text-align: left;
    padding-bottom: 5px;
    .dc-filter-canvas {
      font-size: 12px;
      text-align: left;
      padding: 5px;
      .dc-filter-canvaslsit {
        color: white;
        background-color: #4284f5;
        padding: 0px 8px;
        border-radius: 20px;
        span {
          margin: 0px 1px;
        }
      }
    }
    .dc-time-format {
      font-size: 12px;
      margin: 5px;
    }
    .dc-filter-btn {
      padding: 5px;
      position: relative;
      button {
        padding: 3px 5px;
        border: none;
        color: #666666;
        outline: none;
        cursor: pointer;
        border-right: 1px solid #999999;
        background-color: #e1e1e1;
        &:nth-child(1) {
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
        }
        &:nth-child(2) {
          border-right: none;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }
      }
      .filter-active {
        color: white;
        border-right: 1px solid #4284f5;
        background-color: #4284f5;
      }
      .filter-search {
        width: 50px;
        height: 25px;
        line-height: 20px;
        padding: 5px 3px;
        color: #4284f5;
        box-sizing: border-box;
        border: 1px solid #4284f5;
        border-radius: 4px;
        display: inline-block;
        right: 20px;
        cursor: pointer;
        position: absolute;
        .iconfont {
          font-size: 14px;
          color: #4284f5;
          top: 2px;
          position: absolute;
        }
        .search-txt {
          font-size: 12px;
          position: absolute;
          right: 3px;
          top: 2px;
        }
      }
    }
    .dc-filter-search {
      color: #666666;
      background-color: white;
      border-radius: 4px;
      position: relative;
      height: 25px;
      line-height: 25px;
      margin: 0px 5px;
      box-sizing: border-box;
      border: 1px solid #4284f5;
      input {
        border: none;
        outline: none;
        width: calc(100% - 40px);
        padding: 0px 5px;
        top: -2px;
        height: 25px;
        position: relative;
        background-color: transparent;
      }
      .iconfont {
        font-size: 14px;
        top: -2px;
        border-radius: 0px 4px 4px 0px;
        position: relative;
        display: inline-block;
        width: 30px;
        height: 25px;
        color: white;
        text-align: center;
        transform: rotate(180deg);
        background-color: #4284f5;
        cursor: pointer;
      }
    }
    .select-all {
      font-size: 12px;
      color: #424242;
      padding: 3px 5px;
      cursor: pointer;
      .all-label {
        top: -3.5px;
        left: 5px;
        position: relative;
      }
    }
  }
  .list-item {
    padding: 0px 10px;
    height: 22px;
    line-height: 22px;
    font-size: 12px;
    background: #e1e1e1;
    border-radius: 5px;
    margin: 5px;
    position: relative;
    .title {
      @include ellipsis;
      width: 90%;
      display: inline-block;
    }
    .icon-db_check {
      font-size: 16px;
      right: 10px;
      position: absolute;
    }
  }
  .select {
    color: white;
    background-color: #4284f5;
  }
}
</style>
