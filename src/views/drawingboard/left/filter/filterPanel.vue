<template>
  <div class="filter-panel">
    <div class="filter-panel-header" v-if="isAdd">
      <span >{{$t('dashboard.add_filter')}}</span>
      <div>
        <span @click="isAdd=false">
          <span class="iconfont icon-db_plus cancel-btn">{{$t('dashboard.cancel')}}</span>
        </span>
      </div>
    </div>
    <span class="add-filter-tip" v-if="isAdd">
      {{$t('dashboard.add_tip')}}
    </span>
    <div class="filter-panel-body" :class="isAddClass">
      <add-filter-list v-show="isAdd" @addFilter="changeProcess"></add-filter-list>
      <filter-list ref="filterListRefs" @on-add-show="isAdd=$event" v-show="!isAdd " @change="getFilterList"></filter-list>
    </div>
  </div>
</template>
<script>
import AddFilterList from './addFilterList';
import FilterList from './filterList';
import { get } from '@/api/server';
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'FilterPanel',
  components: {
    AddFilterList,
    FilterList
  },
  data () {
    return {
      isAdd: false
    };
  },
  computed: {
    ...mapState('drawingboard', ['currentCanvas', 'filterList', 'filterAllList']),
    ...mapState('project', ['projectId']),
    isAddClass () {
      return this.isAdd ? 'filter-add' : '';
    }
  },
  watch: {
    currentCanvas: {
      handler () {
        this.getFilterList();
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
  },
  methods: {
    ...mapMutations('drawingboard', ['setFilterList', 'setFilterAllList']),
    async getFilterList () {
      let param = {
        project_id: this.projectId,
        worksheet_id: this.currentCanvas.worksheet_id,
        offset: 0,
        limit: 100
      };
      let res = await get('filterList', param);
      this.isAdd = false;
      this.setFilterAllList([]);
      this.setFilterList([]);
      if (!res) return;
      if (!res.filter_list) return;
      this.setFilterAllList(res.filter_list);
      let len = this.filterAllList.length;
      for (let i = 0; i < len; i++) {
        if (this.filterAllList[i].relate === 1) {
          this.filterList.push(this.filterAllList[i]);
        }
      }
      this.setFilterList(this.filterList);
    },
    changeProcess () {
      this.isAdd = false;
      this.$refs.filterListRefs.backHandler();
      this.getFilterList();
    }
  }
};
</script>
<style lang='scss' scoped>
.filter-panel {
  padding: 0px 10px;
  height: calc(100% - 100px);
  font-size: 14px;
  .filter-panel-header {
    display: flex;
    height: 45px;
    line-height: 45px;
    color: #666666;
    > div {
      flex: 1;
      padding: 0px 0px;
      cursor: pointer;
      color: #424242;
      text-align: right;
    }
  }
  .iconfont {
    color: #424242;
    &::before{
      color: #4284f5;
    }
  }
  .cancel-btn{
    &::before{
      display: inline-block;
      transform: rotate(45deg);
    }
  }
  .add-filter-tip{
    font-weight: 300;
    color: #A4A4A4;
    height: 25px;
    font-size: 14px;
    line-height: 25px;
    display: block;
  }
  .filter-panel-body{
    height: calc(100% - 25px);
  }
  .filter-add{
    border-top: 1px solid #e1e1e1;
  }
}
</style>
