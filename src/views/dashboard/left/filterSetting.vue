<!--  -->
<template>
  <div class="filter-wrap">
    <div class="filter-tip">
      <span v-if="currentFilterList.length > 0">选择过滤器，拖放至展板展示。</span>
      <span v-else>放入画布后，将显示画布已有过滤器。</span>
    </div>
    <div class="filter-box">
      <filter-list></filter-list>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import FilterList from './filterSetting/filterList.vue';
export default {
  data () {
    return {
    };
  },
  components: {
    FilterList
  },
  computed: {
    ...mapState('dashboard', ['currentFilterList'])
  },
  watch: {
  },
  mounted () {
  },
  methods: {}
};
</script>
<style lang='scss' scoped>
.filter-wrap {
  width: 100%;
  height: calc(100% - 30px);
  .filter-tip {
    height: 32px;
    line-height: 32px;
    color: #A4A4A4;
    font-size: 12px;
    >span {
      padding-left: 8px;
    }
  }
  .filter-box {
    height: calc(100% - 32px);
    overflow: auto;
  }
}
</style>
