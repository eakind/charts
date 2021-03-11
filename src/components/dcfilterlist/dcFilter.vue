<template>
  <div class="dc-filter">
    <div v-for="(item, index) in filterList" :key="index">
      <div class="filter-item-name" :titlle="item.filter_name">
        <icon-svg icon="#icon-dbc_filter"></icon-svg>
        {{item.filter_name}}
      </div>
      <filter-cat-item v-if="item.filter_type!=='03'" :item="item" :index="index" @change="changeCatFilter" @changeTime="changeTimeFormat"></filter-cat-item>
      <filter-int-item v-if="item.filter_type==='03'" :item="item" :index="index" @change="changeIntFilter"></filter-int-item>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import FilterCatItem from '../dcfilterlist/filterCatItem';
import FilterIntItem from '../dcfilterlist/filterIntItem';
import IconSvg from '../iconsvg/iconSvg';
export default {
  name: 'DcFilter',
  components: {
    FilterCatItem,
    FilterIntItem,
    IconSvg
  },
  data () {
    return {
    };
  },
  computed: {
    ...mapState('drawingboard', ['filterList'])
  },
  mounted () {
  },
  methods: {
    changeCatFilter (index, item, selectBtn, featureList, allType) {
      let obj = {
        select: '01',
        negation: '02'
      };
      if (obj[selectBtn]) {
        item.filter_type = obj[selectBtn];
        item.select_all = allType ? 1 : 0;
        this.filterList.splice(index, 1, item);
        this.$emit('changeCat', item, featureList, index, allType);
      } else {
        this.$emit('changeCat', item, featureList, index, allType);
      }
    },
    changeTimeFormat (index, item, code) {
      let obj = JSON.parse(JSON.stringify(item));
      obj.datetime_type = code;
      this.$emit('changeCatTime', obj, index);
    },
    changeIntFilter (item, sliderVal, index) {
      this.$emit('changeInt', item, sliderVal, index);
    }
  }
};
</script>
<style lang='scss' scoped>
.dc-filter {
  max-height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  text-align: left;
  .filter-item-name{
    margin-top: 10px;
    padding: 5px 0px;
    @include ellipsis;
  }
}
</style>
