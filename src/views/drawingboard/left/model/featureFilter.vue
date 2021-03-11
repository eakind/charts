<template>
  <div class="feature-filter">
    <div class="head">
      <div class="title">{{ $t('dashboard.feature_filter') }}</div>
      <span class="iconfont icon-db_plus" @click="close"></span>
    </div>
    <div class="body" v-show="!addFlag">
      <div class="add-panel">
        <span class="iconfont icon-db_plus" @click="addFlag = true">
          <span>{{ $t('dashboard.add') }}</span>
        </span>
      </div>
      <div class="panel-tip" v-if="!addFlag && filterList.length === 0">
        {{ $t('dashboard.no_content') }}
      </div>
      <div class="filter-list-bg">
        <model-filter-item
          v-for="(item, index) in filterList"
          :key="index"
          :item="item"
          :index="index"
          @delFilter="delFilterProcess"
          @changeCat="changeCatFilter"
          @changeCatTime="changeCatTime"
          @changeInt="changeIntFilter"
          @selectAll="selectAllHandler"
        ></model-filter-item>
      </div>
    </div>
    <div class="body" v-show="addFlag">
      <model-filter-list
        type="CAT"
        :list="modelCatList"
        @addModelFitler="addModelFitler"
      ></model-filter-list>
      <model-filter-list
        type="NUM"
        :list="modelAggrList"
        @addModelFitler="addModelFitler"
      ></model-filter-list>
    </div>
  </div>
</template>

<script>
import ModelFilterList from './modelFilterList';
import ModelFilterItem from './modelFilterItem';
import { mapState, mapMutations } from 'vuex';
import { get, post } from '@/api/server';
export default {
  components: {
    ModelFilterList,
    ModelFilterItem,
  },
  data () {
    return {
      filterList: [],
      modelCatList: [],
      modelAggrList: [],
      addFlag: false,
      modifyTimer: null,
    };
  },
  computed: {
    ...mapState('drawingboard', ['catList', 'aggrList']),
    ...mapState('project', ['projectId']),
  },
  watch: {
    catList: {
      handler (list) {
        if (list.length === 0) return;
        this.setCatList();
      },
      deep: true,
    },
    aggrList: {
      handler (list) {
        if (list.length === 0) return;
        this.modelAggrList = JSON.parse(JSON.stringify(this.aggrList));
      },
      deep: true,
    },
  },
  mounted () {
    this.getModelfilterList();
    if (this.catList.length > 0) this.setCatList();
    if (this.aggrList.length > 0) {
      this.modelAggrList = JSON.parse(JSON.stringify(this.aggrList));
    }
  },
  methods: {
    ...mapMutations('drawingboard', ['setModelFilterShow']),
    addModelFitler (item, type) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.createFilter(item, type);
      }, 500);
    },
    close () {
      this.setModelFilterShow(false);
    },
    setCatList () {
      this.modelCatList = [];
      for (let i = 0; i < this.catList.length; i++) {
        if (this.catList[i].data_type === 'GROUP') {
          let list = JSON.parse(JSON.stringify(this.catList[i].groups));
          for (let j = 0; j < list.length; j++) {
            let obj = JSON.parse(JSON.stringify(list[j]));
            this.modelCatList.push(obj);
          }
        } else {
          let obj = JSON.parse(JSON.stringify(this.catList[i]));
          this.modelCatList.push(obj);
        }
      }
    },
    changeIntFilter (item, sliderVal, index) {
      if (this.modifyTimer) {
        clearTimeout(this.modifyTimer);
        this.modifyTimer = null;
      }
      this.modifyTimer = setTimeout(() => {
        let list = {
          start: Number(sliderVal[0]),
          end: Number(sliderVal[1]),
          min: Number(sliderVal[2]),
          max: Number(sliderVal[3]),
        };
        this.filterModify('int', item, list, index);
      }, 500);
    },
    changeCatTime (item, index) {
      if (this.modifyTimer) {
        clearTimeout(this.modifyTimer);
        this.modifyTimer = null;
      }
      this.modifyTimer = setTimeout(() => {
        this.filterModify('cat', item, null, index, true);
      }, 500);
    },
    changeCatFilter (item, valueList, index, selectAll) {
      if (this.modifyTimer) {
        clearTimeout(this.modifyTimer);
        this.modifyTimer = null;
      }
      this.modifyTimer = setTimeout(() => {
        let list = null;
        if (valueList.length) {
          list = valueList;
        }
        this.filterList.splice(index, 1, item);
        this.filterModify('cat', item, list, index, selectAll);
      }, 500);
    },
    async selectAllHandler (boolean, item, index) {
      let param = {
        project_id: this.projectId,
        worksheet_id: this.worksheetId,
        filter_id: item.filter_id,
        filter_name: item.filter_name,
        select_all: boolean,
      };
      this.showLoading = true;
      let res = await post('filterModify', param);
      if (res.code === 0) {
        let obj = JSON.parse(JSON.stringify(this.filterList[index]));
        obj.select_all = res.select_all;
        this.filterList.splice(index, 1, obj);
        this.bus.$emit('changeModel');
      }
    },
    async filterModify (flag, item, valueList, index, selectAll, timeFlag) {
      let param = {
        project_id: this.projectId,
        worksheet_id: this.worksheetId,
        filter_id: item.filter_id,
        filter_name: item.filter_name,
      };
      if (flag === 'cat') {
        param.filter_type = item.filter_type;
        if (!selectAll) {
          param.filter_values = valueList;
        } else {
          param.select_all = selectAll;
        }
        if (item.datetime_type) {
          param.datetime_type = item.datetime_type;
        }
      } else {
        param.filter_type = item.filter_type;
        param.filter_values = valueList;
      }
      this.showLoading = true;
      let res = await post('filterModify', param);
      if (res.code === 0) {
        let obj = JSON.parse(JSON.stringify(this.filterList[index]));
        if (timeFlag) {
          obj.datetime_type = item.datetime_type;
          this.filterList.splice(index, 1, obj);
        }
        if (obj.select_all !== res.select_all) {
          obj.select_all = res.select_all;
          this.filterList.splice(index, 1, obj);
        }
        this.bus.$emit('changeModel');
      }
    },
    delFilterProcess (item) {
      this.$showMessageBox({
        title: '删除',
        confirmText: '确定',
        cancelText: '取消',
        contentHtml: '确定删除吗?',
        cb: () => {
          this.delFilter(item);
          this.$closeMessageBox();
        },
      });
    },
    async delFilter (item) {
      let param = {
        project_id: this.projectId,
        filter_id: item.filter_id,
      };
      let res = await post('modelFilterDelete', param);
      if (res.code === 0) {
        this.getModelfilterList();
      }
    },
    async createFilter (item, type) {
      let param = {
        project_id: this.projectId,
        filter_name: item.feature_name,
        filter_type: type === 'CAT' ? '01' : '03',
      };
      if (item.data_type === 'datetime') param.datetime_type = 'YEAR';
      let res = await post('filterCreate', param);
      if (res.code === 0) {
        this.addFlag = false;
        this.getModelfilterList();
      }
    },
    async getModelList (type) {
      let param = {
        projectId: this.projectId,
        feature_type: type,
        offset: 0,
        limit: 1000,
      };
      await get('modelList', param);
    },
    async getModelfilterList () {
      let param = {
        project_id: this.projectId,
        offset: 0,
        limit: 9999,
      };
      let res = await get('modelFilterList', param);
      this.filterList = res.filter_list;
    },
  },
};
</script>

<style lang="scss" scoped>
.feature-filter {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding-left: 7px;
  padding-right: 7px;
  background: #f6f6f6;
  color: #424242;
  border-radius: inherit;
  .head {
    position: relative;
    height: 58px;
    line-height: 58px;
    border-bottom: 2px solid #e1e1e1;
    .title {
      font-size: 16px;
      font-weight: 500;
      margin-left: 20px;
      display: inline-block;
    }
    .icon-db_plus {
      transform: rotate(135deg);
      display: inline-block;
      cursor: pointer;
      position: absolute;
      right: 20px;
      font-size: 20px;
      color: #a4a4a4;
    }
  }
  .body {
    width: 100%;
    height: calc(100% - 60px);
    .add-panel {
      height: 35px;
      padding: 0px 10px;
      line-height: 35px;
      .icon-db_plus {
        cursor: pointer;
        margin: 0px 5px;
        color: #4284f5;
        > span {
          color: #424242;
        }
      }
    }
    .panel-tip {
      font-size: 14px;
      color: #a4a4a4;
      text-align: center;
    }
    .model-filter-list {
      height: 50%;
      width: 100%;
    }
    .filter-list-bg {
      height: calc(100% - 30px);
      width: 100%;
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
}
</style>
