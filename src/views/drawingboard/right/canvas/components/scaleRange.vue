<template>
  <div class="scale-range">
    <span class="range-title">范围与数量</span>
    <div class="scale-header">
      <span class="scale-title">对齐方式</span>
      <dc-select-view :list="alignList" :select="selectAlign" @change="changeAlign"></dc-select-view>
    </div>
    <div class="base-align" v-if="isCombined">
      <dc-checked :active="isBaseAlign"></dc-checked>
      <span class="base-txt">原点对齐</span>
    </div>
    <div class="rang-list" v-show="selectAlign === 1">
      <range-item v-for="(item, index) in rangeList" :key="index" :item="item" :index="index"
                  @change="changeRange"></range-item>
    </div>
  </div>
</template>
<script>
import DcSelectView from '@/components/dcselectview/dcSelectView.vue';
import DcChecked from '@/components/dcchecked/dcChecked.vue';
import RangeItem from './rangeItem.vue';
export default {
  data () {
    return {
      aligns: ['默认', '手工指定', '图表上选择', '完全对齐'],
      selectAlign: 0,
      isBaseAlign: true,
      rangeList: [],
      isCombined: false // 是否有组合胶囊
    };
  },
  props: {
    scopeList: {
      type: Array
    }
  },
  computed: {
    alignList () {
      const values = this.aligns;
      const obj = {
        默认: 0,
        手工指定: 1,
        图表上选择: 2,
        完全对齐: 3
      };
      return values.map(item => ({ name: item, id: obj[item] }));
    }
  },
  watch: {
    scopeList: {
      handler (list) {
        this.rangeList = JSON.parse(JSON.stringify(list));
      },
      immediate: true
    }
  },
  components: {
    DcSelectView,
    DcChecked,
    RangeItem
  },
  mounted () {
  },
  methods: {
    changeAlign (item) {
      this.selectAlign = item.id;
      for (let i = 0; i < this.rangeList.length; i++) {
        this.$set(this.rangeList[i], 'select', this.selectAlign);
      }
      this.$emit('change', this.rangeList);
    },
    changeRange (item, index) {
      let obj = JSON.parse(JSON.stringify(this.rangeList[index]));
      obj.min = item.min;
      obj.max = item.max;
      obj.num = item.num;
      this.$set(this.rangeList, index, obj);
      this.$emit('change', this.rangeList);
    }
  }
};
</script>
<style lang='scss' scoped>
.scale-range {
   border-top: 1px solid #e1e1e1;
   margin-top: 10px;
   padding-top: 10px;
   .range-title {
     color: #666666;
   }
  .scale-header{
    display: flex;
    padding: 5px 0px;
    align-items: center;
  }
  .scale-title {
    margin-right: 5px;
    color: #666666;
  }
  .base-align{
    padding: 10px 0px 0px;
  }
  .base-txt{
    top: -3px;
    margin: 5px;
    font-size: 14px;
    position: relative;
  }
}
</style>
