<template>
  <div class="filter-list">
    <div class="filter-tab">
      <span :class="currentActive"
            @click="changeMenuTab('current')">{{$t('dashboard.current_canvas')}}({{currentNum}})</span>
      <span :class="allActive"
            @click="changeMenuTab('all')">{{$t('dashboard.all_canvas')}}</span>
    </div>
    <!-- <filter-list-header  :is-current="isCurrent" :num="currentNum" :item="currentItem" :all-num="filterAllList.length"
                        @back="backHandler" @openEdit="openEditHandler"></filter-list-header> -->
    <template v-if="noAllFilter">
      <div class="none-filter"
           v-if="!currentNum">
        {{$t('dashboard.none_filter_tip')}}
      </div>
      <div class="add-box"
           @click="$emit('on-add-show',true)">
        <span class="iconfont icon-db_plus add-icon"></span>
        <span>{{$t('dashboard.add')}}</span>
      </div>
    </template>
    <template v-else>
      <div class="add-edit-wrap flex">
        <div class="add-wrap"
             @click="$emit('on-add-show',true)">
          <span class="iconfont icon-db_plus add-icon"></span>
          <span>{{$t('dashboard.add')}}</span>
        </div>
        <div class="line"></div>
        <div class="edit-wrap"
             @click="openEditHandler">
          <span class="iconfont icon-db_edit"></span>
          <span>{{$t('dashboard.filter_edit')}}</span>
        </div>
      </div>
    </template>
    <template v-if="currentItem">
      <div class="return-back" @click="backHandler">
        <span class="iconfont icon-db_arrow"></span>
        <span>{{$t('dashboard.back_list')}}</span>
      </div>
      <div class="return-line"></div>
    </template>
    <!-- 当前画布过滤器 -->
    <div class="list-body"
         v-show="isCurrent"
         v-if="!currentItem">
      <filter-item v-for="(item, index) in filterAllList"
                   :key="index"
                   v-show="item.relate === 1"
                   :item="item"
                   :index="index"
                   @editFilter="editFilterHandler"
                   @change="changeHandler"></filter-item>
    </div>
    <!-- 所有画布过滤器 -->
    <div class="list-body"
         v-show="!isCurrent"
         v-if="!currentItem">
      <filter-item v-for="(item, index) in filterAllList"
                   :key="index"
                   :item="item"
                   :index="index"
                   @editFilter="editFilterHandler"
                   @change="changeHandler"></filter-item>
    </div>
    <!-- 过滤器编辑状态 -->
    <filter-editor v-if="currentItem"
                   :item="currentItem"></filter-editor>
    <multiple-filter v-if="isMultiple"
                     @exit="closeMultiple"></multiple-filter>
  </div>
</template>
<script>
import FilterItem from './filterList/filterItem';
import FilterEditor from './filterEditor';
import MultipleFilter from './filterEditor/multipleFilter';
import { mapState } from 'vuex';
export default {
  name: 'FilterList',
  data () {
    return {
      isCurrent: true,
      currentItem: null,
      isMultiple: false
    };
  },
  computed: {
    ...mapState('drawingboard', ['filterAllList', 'currentCanvas']),
    currentActive () {
      return this.isCurrent ? 'is-active' : '';
    },
    allActive () {
      return !this.isCurrent ? 'is-active' : '';
    },
    currentNum () {
      let len = this.filterAllList.length;
      let num = 0;
      for (let i = 0; i < len; i++) {
        if (this.filterAllList[i].relate === 1) {
          num++;
        }
      }
      return num;
    },
    noAllFilter () {
      if (this.isCurrent) {
        return this.filterAllList.filter(i => i.relate === 1).length === 0;
      }
      return !this.filterAllList.length;
    }
  },
  watch: {
    currentCanvas: {
      handler () {
        this.currentItem = null;
      },
      deep: true
    }
  },
  components: {
    FilterItem,
    FilterEditor,
    MultipleFilter
  },
  mounted () {
  },
  methods: {
    changeMenuTab (type) {
      this.isCurrent = type === 'current';
      this.currentItem = null;
    },
    closeMultiple (boolean) {
      this.isMultiple = false;
      if (boolean) {
        this.bus.$emit('update-chart-for-filter');
      }
    },
    openEditHandler () {
      this.isMultiple = true;
    },
    editFilterHandler (item) {
      this.currentItem = item;
    },
    changeHandler () {
      this.$emit('change');
    },
    backHandler () {
      this.currentItem = null;
    }
  }
};
</script>
<style lang='scss' scoped>
.filter-list {
  width: 100%;
  height: calc(100% - 10px); // 100%;
  padding: 0px;
  box-sizing: border-box;
  .filter-tab {
    height: 40px;
    line-height: 40px;
    display: flex;
    > span {
      flex: 1;
      width: 0;
      cursor: pointer;
      text-align: center;
    }
  }
  .is-active {
    position: relative;
    &::before {
      content: "";
      width: 45px;
      height: 2px;
      border-radius: 40px;
      position: absolute;
      bottom: 4px;
      left: 50%;
      transform: translate(-50%);
      display: inline-block;
      background-color: #4284f5;
    }
  }
  .list-body {
    height: calc(100% - 110px);
    overflow-x: hidden;
    overflow-y: auto;
  }
  .none-filter {
    font-size: 12px;
    color: #a4a4a4;
    text-align: center;
    font-weight: 300;
    margin-top: 15px;
  }
  .add-box {
    width: 80px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    margin: 10px auto;
    cursor: pointer;
  }
  .add-icon {
    color: #facc14;
    // font-size: 20px;
    margin-right: 4px;
  }
  .add-text {
    font-size: 14px;
  }
  .flex {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .add-edit-wrap {
    margin: 8px 0;
    div.line {
      width: 1px;
      height: 30px;
      background-color: #e1e1e1;
    }
    .add-wrap,
    .edit-wrap {
      flex: 1;
      cursor: pointer;
      padding: 8px;
      text-align: center;
    }
    .icon-db_edit {
      color: #facc14;
      margin-right: 8px;
      font-size: 16px;
    }
  }
  .return-back {
    cursor: pointer;
    padding-bottom: 10px;
    .icon-db_arrow {
      display: inline-block;
      transform: rotate(180deg);
      color: #4284f5;
    }
  }
  .return-line {
    width: 100%;
    height: 1px;
    background-color: #e1e1e1;
    margin-bottom: 5px;
  }
}
</style>
