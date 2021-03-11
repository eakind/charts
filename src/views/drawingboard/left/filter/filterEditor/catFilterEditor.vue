<template>
  <div class="cat-filter-editor">
    <filter-header :item="currentItem"
                   @search="searchHandler"
                   @change="changeTypeHandler"
                   @selectAll="selectAll"></filter-header>
    <scroll-list class="filter-body"
                 @loadMore="loadMore">
      <filter-value v-for="(item, index) in filterValueList"
                    :key="index"
                    :item="item"
                    @click.native="changeFlagHandler(item, index)"></filter-value>
    </scroll-list>
  </div>
</template>
<script>
import FilterHeader from './filterHeader';
import FilterValue from './filterValue';
import ScrollList from './scrollList';
import { mapState } from 'vuex';
import { get } from '@/api/server';
export default {
  data () {
    return {
      currentItem: null,
      offset: 0,
      limit: 100,
      filterValueList: [],
      operateList: [],
      timer: null
    };
  },
  props: {
    item: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  computed: {
    ...mapState('project', ['projectId'])
  },
  watch: {
    item: {
      handler () {
        this.offset = 0;
        this.filterValueList = [];
        this.operateList = [];
        this.currentItem = this.item;
        this.getFilterValue();
      },
      deep: true,
      immediate: true
    }
  },
  components: {
    FilterHeader,
    FilterValue,
    ScrollList
  },
  mounted () {
  },
  methods: {
    searchHandler (val) {
      if (val) {
        this.searchFilterValue(val);
      } else {
        this.offset = 0;
        this.filterValueList = [];
        this.getFilterValue();
      }
    },
    selectAll (boolean) {
      this.$emit('selectAll', boolean, this.item, this.index);
    },
    changeTypeHandler (filterType) {
      this.$emit('changeType', filterType, this.item, this.index);
    },
    changeFlagHandler (item, index) {
      let flag = item.flag === 1 ? 0 : 1;
      this.$set(this.filterValueList[index], 'flag', flag);
      this.operateList.push(item);
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.$emit('changeValue', this.operateList, this.item, this.index);
      }, 500);
    },
    loadMore () {
      if (this.offset - this.limit > this.filterValueList.length) return;
      this.getFilterValue();
    },
    async searchFilterValue (val) {
      let param = {
        project_id: this.projectId,
        filter_id: this.currentItem.filter_id,
        key: val
      };
      let res = await get('filterSearch', param);
      if (res.code === 0) {
        this.filterValueList = res.feature_list;
      }
    },
    async getFilterValue () {
      let param = {
        project_id: this.projectId,
        filter_id: this.currentItem.filter_id,
        offset: this.offset,
        limit: this.limit
      };
      let res = await get('filterUnique', param);
      if (res.code === 0) {
        this.filterValueList = this.filterValueList.concat(res.feature_list);
        this.offset = this.offset + this.limit;
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.cat-filter-editor {
  height: calc(100% - 55px);
  .filter-body {
    max-height: calc(100% - 55px);
    padding-right: 8px;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
