<!--  -->
<template>
  <div class="classify-chart" :style="globalStyle">
    <div class="filter-name" :style="titleStyle">{{currentFilter.filter_name}}</div>
    <div class="filter-type">
      <div class="type-box" :class="[selectType]">
        <div class="btn-select" @click="selectHandle">选择</div>
        <div class="btn-exclude" @click="excludeHandle">排除</div>
      </div>
    </div>
    <div class="filter-select" v-click-out="hideList" :class="{'noSelect': id !== this.selectedTarget.filterId && !fullScreen}">
      <div class="select-input">
        <span class="input-text" @click="showListHandle">{{filterSelectVal || checkedFilterStr}}</span>
        <span class="iconfont icon-db_triangle" :class="{'iconfont-active': showList}" @click="showListHandle"></span>
      </div>
      <div class="filter-list" v-if="showList" @scroll.stop="filterLoading">
        <!-- <div class="filter-item" v-for="(item, index) in fitlerList" :key="index"></div> -->
        <div class="date-format" v-if="currentFilter && currentFilter.datetime_type">
          <span class="date-title">{{$t('dashboard.select_format')}}</span>
          <dc-select-view :list="timeList" :select="currentFilter.datetime_type" @change="changeTime"></dc-select-view>
        </div>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="checkedFilter" @change="handleCheckedFilterChange">
          <div class="filter-item" v-for="filter in filterList"  :key="filter">
            <el-checkbox :label="filter">{{filter}}</el-checkbox>
          </div>
        </el-checkbox-group>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { get, post } from '@/api/server';
import filterMixins from './mixins/index';
import { refreshCanvasMixin } from '../../boardLayout/mixins/refreshCanvas';
import DcSelectView from '@/components/dcselectview/dcSelectView.vue';
export default {
  data () {
    return {
      selectValue: '',
      filterList: [],
      checkedFilter: [],
      oldCheckedFilter: [],
      checkAll: false,
      allFilter: [],
      showList: false,
      checkedList: [],
      isIndeterminate: true,
      offset: 0,
      limit: 100,
      timer: null,
      resCheckedFilter: [],
      selectType: 'select',
      select_all: false,
      filterSelectVal: null,
      containerStyle: '',
    };
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    styleObj: {
      type: [Object, String]
    }
  },
  components: {
    DcSelectView
  },
  computed: {
    ...mapState('project', ['projectId', 'timeMap']),
    ...mapState('dashboard', ['currentTarget', 'filterUniqueList', 'layoutList', 'selectedTarget', 'fullScreen', 'currentDashboard']),
    currentFilter () {
      let filterObj = this.filterUniqueList.filter((item, index) => {
        return item.filter_id === this.id;
      });
      return filterObj[0] || {};
    },
    checkedFilterStr () {
      if (this.checkedFilter.length === 0) {
        return '暂无选择';
      } else if (this.checkedFilter.length === this.allFilter.length) {
        return '全部';
      } else {
        return this.checkedFilter.join(',');
      }
    },
    timeList () {
      let arr = [];
      for (let key in this.timeMap) {
        arr.push({
          name: this.timeMap[key],
          id: key
        });
      }
      return arr;
    }
  },
  watch: {
    showList (val) {
      this.filterSelectVal = null;
      if (val) {
        this.offset = 0;
        this.limit = 100;
        this.filterList = [];
        this.checkedList = [];
        this.checkedFilter = [];
        this.getNumFilterValue();
        this.$root.$el.querySelector('.container').style.overflow = 'hidden';
        // this.$root.$el.getElementsByClassName('container')[0].style.cssText = `${this.containerStyle}; overflow: hidden;`;
      } else {
        this.$root.$el.querySelector('.container').style.overflow = 'auto';
        // this.$root.$el.getElementsByClassName('container')[0].style.cssText = this.containerStyle;
      }
    },
    currentFilter: {
      handler (val) {
        this.selectType = (val && val.filter_type === '01') ? 'select' : 'exclude';
      },
      deep: true
    }
  },
  mixins: [filterMixins, refreshCanvasMixin],
  mounted () {
    // this.id = '0db0a1f2347811ebbcd4fa163e6b7e99';
    // this.containerStyle = this.$root.$el.getElementsByClassName('container')[0].style.cssText;
    this.selectType = (this.currentFilter && this.currentFilter.filter_type === '01') ? 'select' : 'exclude';
    this.getAllFilterVal();
  },
  methods: {
    ...mapMutations('dashboard', ['setFilterUniqueList']),
    handleCheckedFilterChange (value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.filterList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.filterList.length;
      this.paramsHandle();
    },
    handleCheckAllChange (val) {
      this.checkedFilter = val ? this.filterList : [];
      this.select_all = val;
      this.isIndeterminate = false;
      this.resCheckedFilter = [];
      let currentFilter = this.filterUniqueList.filter((item, index) => {
        return item.filter_id === this.id;
      });
      let param = {
        project_id: this.projectId,
        filter_id: this.id,
        filter_name: currentFilter[0].filter_name,
        select_all: val,
        worksheet_list: currentFilter[0].worksheet_list,
      };
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.modifyFilter(param);
        }, 1000);
      } else {
        this.timer = setTimeout(() => {
          this.modifyFilter(param);
        }, 1000);
      }
    },
    changeTime (item) {
      let filterTypeObj = {
        select: '01',
        exclude: '02'
      };
      let currentFilter = this.filterUniqueList.filter((item, index) => {
        return item.filter_id === this.id;
      });
      this.currentFilter.datetime_type = item.id;
      this.filterUniqueList.map(item => {
        if (item.filter_id === this.currentFilter.filter_id) {
          return this.currentFilter;
        } else {
          return item;
        }
      });
      this.setFilterUniqueList(this.filterUniqueList);
      let obj = {
        project_id: this.projectId,
        worksheet_list: currentFilter[0].worksheet_list,
        filter_id: this.id,
        filter_name: currentFilter[0].filter_name,
        datetime_type: item.id,
        filter_type: filterTypeObj[this.selectType]
      };
      this.filterList = [];
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.modifyFilter(obj);
        }, 1000);
      } else {
        this.timer = setTimeout(() => {
          this.modifyFilter(obj);
        }, 1000);
      }
    },
    hideList () {
      this.showList = false;
    },
    filterLoading (e) {
      let targetDom = e.target;
      if (targetDom.scrollTop + targetDom.clientHeight === targetDom.scrollHeight) {
        this.offset = this.offset + this.limit;
        this.getNumFilterValue();
      }
    },
    showListHandle () {
      this.showList = !this.showList;
    },
    selectHandle () {
      this.selectType = 'select';
      this.paramsHandle();
      this.currentFilter.filter_type = '01';
      this.filterUniqueList.map(item => {
        if (item.filter_id === this.currentFilter.filter_id) {
          return this.currentFilter;
        } else {
          return item;
        }
      });
      this.setFilterUniqueList(this.filterUniqueList);
    },
    excludeHandle () {
      this.selectType = 'exclude';
      this.paramsHandle();
      this.currentFilter.filter_type = '02';
      this.filterUniqueList.map(item => {
        if (item.filter_id === this.currentFilter.filter_id) {
          return this.currentFilter;
        } else {
          return item;
        }
      });
      this.setFilterUniqueList(this.filterUniqueList);
    },
    paramsHandle () {
      let currentFilter = this.filterUniqueList.filter((item, index) => {
        return item.filter_id === this.id;
      });
      let filterType = '01';
      if (this.selectType === 'select') {
        filterType = '01';
      } else {
        filterType = '02';
      }
      let filterValue = [];
      this.checkedFilter.forEach((item, index) => {
        let obj = {};
        if (this.oldCheckedFilter.indexOf(item) < 0) {
          obj = {
            flag: 1,
            name: item,
          };
          filterValue.push(obj);
        }
      });
      this.oldCheckedFilter.forEach((item, index) => {
        let obj = {};
        if (this.checkedFilter.indexOf(item) < 0) {
          obj = {
            flag: 0,
            name: item,
          };
          filterValue.push(obj);
        }
      });
      let param = {
        project_id: this.projectId,
        filter_id: this.id,
        filter_name: currentFilter[0].filter_name,
        filter_type: filterType,
        worksheet_list: currentFilter[0].worksheet_list,
      };
      if (filterValue.length > 0) {
        param.filter_values = filterValue;
      }
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.modifyFilter(param);
        }, 1000);
      } else {
        this.timer = setTimeout(() => {
          this.modifyFilter(param);
        }, 1000);
      }
    },
    async getNumFilterValue () {
      let param = {
        project_id: this.projectId,
        filter_id: this.id,
        offset: this.offset,
        limit: this.limit
      };
      this.resCheckedFilter = [];
      this.filterList = [];
      this.checkedList = [];
      this.checkedFilter = [];
      this.oldCheckedFilter = [];
      let res = await get('filterUnique', param);
      if (res.code === 0) {
        let resFilterList = res.feature_list.map((item, index) => {
          return item.name;
        });
        let resCheckedList = res.feature_list.filter((item, index) => {
          return item.flag === 1;
        });
        this.resCheckedFilter = resCheckedList.map((item, index) => {
          return item.name;
        });

        this.filterList = this.filterList.concat(resFilterList);
        this.checkedList = this.checkedList.concat(resCheckedList);
        this.checkedFilter = this.checkedFilter.concat(this.resCheckedFilter);
        this.oldCheckedFilter = this.checkedFilter;
      }
    },
    async modifyFilter (param) {
      let res = await post('filterModify', param);
      if (res.code === 0) {
        if (param.datetime_type) {
          this.getNumFilterValue();
          this.getAllFilterVal();
        }
        this.oldCheckedFilter = this.checkedFilter;
        const list = param.worksheet_list;
        for (let i = 0; i < list.length; i++) {
          this.refreshCanvas(this.layoutList, list[i].worksheet_id);
        }
      }
    },
    async getAllFilterVal () {
      let param = {
        project_id: this.projectId,
        filter_id: this.id,
        offset: 0,
        limit: 100000000
      };
      let res = await get('filterUnique', param);
      if (res.code === 0) {
        this.allFilter = res.feature_list;
        let allSelectFilter = res.feature_list.filter((item, index) => {
          return item.flag === 1;
        }).map((mapItem, mapIndex) => {
          return mapItem.name;
        });
        if (allSelectFilter.length === 0) {
          this.filterSelectVal = '暂无选择';
        } else if (allSelectFilter.length === res.feature_list.length) {
          this.filterSelectVal = '全部';
        } else {
          this.filterSelectVal = allSelectFilter.join(',');
        }
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.classify-chart {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  padding: 8px;
  .filter-name {
    width: 100%;
    height: 25%;
    max-height: 32px;
    line-height: 32px;
    font-size: 14px;
    color: #424242;
  }
  .filter-type {
    height: 32px;
    .type-box {
      width: 96px;
      height: 24px;
      background-color: #A4A4A4;
      border-radius: 4px;
      display: flex;
      color: #fff;
      font-size: 12px;
      cursor: pointer;
      > div {
        width: 48px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        border-radius: 4px;
      }
      &.select {
        .btn-select {
          background-color: #4284F5;
        }
      }
      &.exclude {
        .btn-exclude {
          background-color: #4284F5;
        }
      }
    }
  }
  .filter-select {
    width: 100%;
    height: 32px;
    &.noSelect {
      pointer-events: none;
    }
    .select-input {
      width: 100%;
      height: 32px;
      border: 1px solid #DEDEDE;
      border-radius: 4px;
      padding: 4px 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #424242;
      .iconfont {
        color: #A4A4A4;
        cursor: pointer;
        transition: .3s;
        &.iconfont-active {
          transform: rotate(-180deg);
        }
      }
      .input-text {
        display: inline-block;
        width: 100%;
        overflow: hidden;
        height: 100%;
      }
    }
    .filter-list {
      width: calc(100% - 16px);
      max-height: 230px;
      overflow: auto;
      padding: 8px;
      box-shadow: 0px 2px 4px rgba(66, 66, 66, 0.2);
      border-radius: 4px;
      background: #fff;
      z-index: 999;
      position: absolute;
      .filter-item {
        width: 100%;
        height: 32px;
        line-height: 32px;
      }
      .date-format {
        height: 36px;
        display: flex;
      }
    }
  }
}
</style>
<style lang="scss">
.classify-chart {
  .el-select {
    width: 100%;
  }
}
</style>
