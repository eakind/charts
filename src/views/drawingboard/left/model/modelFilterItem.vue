<template>
  <div class="model-filter-item">
    <div class="filter-item-header">
      <span class="iconfont icon-db_arrow" :class="showDetail ? '' : 'rotated'" @click="openDetail"></span>
      {{item.filter_name}}
      <span class="iconfont icon-db_trash" @click="delFilter"></span>
    </div>
    <div class="filter-item-body" v-if="showDetail">
      <filter-cat-item
        v-if="item.filter_type !== '03'"
        :hideCanvas="true"
        :item="item"
        :index="index"
        @change="changeCatFilter"
        @selectAll="selectAllHandler"
        @changeTime="changeTimeFormat"
      ></filter-cat-item>
      <filter-int-item
        v-if="item.filter_type === '03'"
        :item="item"
        :index="index"
        @change="changeIntFilter"
      ></filter-int-item>
    </div>
  </div>
</template>
<script>
import FilterCatItem from '@/components/dcfilterlist/filterCatItem';
import FilterIntItem from '@/components/dcfilterlist/filterIntItem';
export default {
  name: 'ModelFilterItem',
  data () {
    return {
      showDetail: false
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
  components: {
    FilterCatItem,
    FilterIntItem
  },
  mounted () {},
  methods: {
    changeCatFilter (index, item, selectBtn, featureList, allType) {
      let obj = {
        select: '01',
        negation: '02'
      };
      if (obj[selectBtn]) {
        item.filter_type = obj[selectBtn];
        item.select_all = allType ? 1 : 0;
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
    changeIntFilter (item, sliderVal) {
      this.$emit('changeInt', item, sliderVal, this.index);
    },
    openDetail () {
      this.showDetail = !this.showDetail;
    },
    delFilter () {
      this.$emit('delFilter', this.item);
    },
    changeHandler (item) {
      this.$emit('change', item);
    },
    selectAllHandler (boolean) {
      this.$emit('selectAll', boolean, this.item, this.index);
    }
  }
};
</script>
<style lang='scss' scoped>
.model-filter-item {
  margin-top: 10px;
  background-color: white;
  .filter-item-header {
    padding: 5px 10px;
    font-size: 14px;
    border-bottom: 1px solid #e1e1e1;
    position: relative;
    .icon-db_arrow {
      cursor: pointer;
      margin-right: 5px;
      display: inline-block;
      transform: rotate(-90deg);
      color: #4284f5;
    }
    .icon-db_trash {
      color: #a4a4a4;
      right: 10px;
      cursor: pointer;
      position: absolute;
    }
    .rotated {
      transform: rotate(90deg);
    }
  }
  .filter-item-body {
    box-sizing: border-box;
    padding: 10px 25px;
  }
}
</style>
