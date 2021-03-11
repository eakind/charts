<template>
  <div class="add-filter-list">
    <div class="half-panel">
      <filter-feature-list :list="tempCatList" :cat="true" @change="createFilter"></filter-feature-list>
    </div>
    <div class="half-panel">
      <filter-feature-list :list="tempAggrList" @change="createFilter"></filter-feature-list>
    </div>
  </div>
</template>
<script>
import FilterFeatureList from './addFilter/filterFeatureList';
import { setCatUniqueArr } from '@/utils/utils.js';
import { mapState } from 'vuex';
import { post } from '@/api/server';
export default {
  name: 'AddFilterList',
  components: {
    FilterFeatureList
  },
  data () {
    return {
    };
  },
  computed: {
    ...mapState('drawingboard', ['catList', 'aggrList', 'currentCanvas']),
    ...mapState('project', ['projectId']),
    tempAggrList () {
      return this.aggrList.filter(i => i.formula_type !== 'AGGR' && i.formula_type !== 'GROUPBY');
    },
    tempCatList () {
      return setCatUniqueArr(this.catList).filter(i => i.formula_type !== 'AGGR' && i.formula_type !== 'GROUPBY');
    }
  },
  mounted () {},
  methods: {
    async createFilter (item, type) {
      let param = {
        project_id: this.projectId,
        worksheet_id: this.currentCanvas.worksheet_id,
        filter_name: item.feature_name,
        filter_type: type ? '01' : '03'
      };
      if (item.data_type === 'DATETIME') param.datetime_type = 'YEAR';
      let res = await post('filterCreate', param);
      if (res.code === 0) {
        this.$emit('addFilter');
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.add-filter-list {
  width: 100%;
  height:calc(100% - 50px);// 100%;
  .half-panel {
    height: 50%;
  }
}
</style>
