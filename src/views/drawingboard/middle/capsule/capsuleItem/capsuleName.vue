<template>
  <div
    class="capsule-name"
    :index="index"
    :data-dragging="type + 'Dragging'"
    :data-symbol="dataSymbol"
    :type="type"
    :name="item.feature_name"
  >
    <div
      class="content"
      :parentIndex="parentIndex"
      :index="index"
      :data-dragging="type + 'Dragging'"
      :data-symbol="dataSymbol"
      :type="type"
      :name="item.feature_name"
    >
      <div
        class="iconfont icon-db_sort"
        :parentIndex="parentIndex"
        :index="index"
        :data-draggin="type + 'Dragging'"
        :data-symbol="dataSymbol"
        v-if="isOrder"
        :type="type"
      ></div>
      <div
        class="iconfont icon-db_YOYChain"
        :parentIndex="parentIndex"
        :index="index"
        :data-draggin="type + 'Dragging'"
        :data-symbol="dataSymbol"
        v-if="isRate"
        :type="type"
        :name="item.feature_name"
      >
        {{ rateTxt }}
      </div>
      <div
        class="content-legend"
        :parentIndex="parentIndex"
        :index="index"
        :data-dragging="type + 'Dragging'"
        :data-symbol="dataSymbol"
        v-if="legendMap && isHasFunc"
        :type="type"
        :name="item.feature_name"
      >
        {{ isLegend }}
      </div>
      <div
        class="content-legend"
        :parentIndex="parentIndex"
        :index="index"
        :data-dragging="type + 'Dragging'"
        :data-symbol="dataSymbol"
        v-if="isHasSplit"
        :type="type"
        :name="item.feature_name"
      >
        {{ isSplit }}
      </div>
      <div
        class="content-name"
        :parentIndex="parentIndex"
        :index="index"
        :data-dragging="type + 'Dragging'"
        :data-symbol="dataSymbol"
        v-if="isHasFunc"
        :type="type"
        :name="item.feature_name"
      >
        ({{ item.feature_name }})
      </div>
      <div
        class="content-name"
        :parentIndex="parentIndex"
        :index="index"
        :data-dragging="type + 'Dragging'"
        :data-symbol="dataSymbol"
        v-if="isNoFunc"
        :type="type"
        :name="item.feature_name"
      >
        {{ item.feature_name }}
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  data () {
    return {};
  },
  props: {
    index: {
      type: Number,
    },
    dataSymbol: {
      type: String,
    },
    item: {
      type: Object,
    },
    itemType: {
      type: Boolean,
    },
    type: {
      type: String,
    },
    parentIndex: {
      type: Number,
    },
  },
  computed: {
    ...mapState('project', ['legendMap', 'timeMap']),
    ...mapState('drawingboard', ['canvasType']),
    rateTxt () {
      let obj = {
        RING: '环比',
        ON: '同比',
      };
      let rate = this.item.rate;
      if (!rate) return '';
      return `${obj[rate.type]}${rate.growth ? '增长' : ''}`;
    },
    isLegend () {
      return this.legendMap[this.item.legend];
    },
    isHasSplit () {
      const obj = {
        bar: true,
        'bar-line': true,
        line: true,
        'bar-rotated': true,
      };
      if (obj[this.canvasType] && (this.dataSymbol && (this.dataSymbol.includes('Label') || this.dataSymbol.includes('Color')))) {
        return false;
      }
      return !!this.timeMap[this.item.split];
    },
    isSplit () {
      return this.timeMap[this.item.split];
    },
    isHasFunc () {
      if (this.item.data_type === 'DATETIME' && !this.isHasSplit) {
        return false;
      };
      if (this.canvasType === 'map' && this.item.type === 'NUM' && this.type === 'column') return false;
      if ((this.item.split || this.item.legend) && this.item.formula_type !== 'AGGR') return true;
      return false;
    },
    isNoFunc () {
      if (this.item.data_type === 'DATETIME' && !this.isHasSplit) {
        return true;
      };
      if (this.canvasType === 'map' && this.item.type === 'NUM' && this.type === 'column') return true;
      if (this.item.formula_type === 'AGGR') return true;
      if (!this.item.split && !this.item.legend) return true;
      return false;
    },
    isRate () {
      if (this.item.type === 'NUM' && this.item.rate) return true;
      return false;
    },
    isOrder () {
      return !!this.item.order;
    },
  },
  components: {},
  mounted () {},
  methods: {},
};
</script>
<style lang='scss' scoped>
.capsule-name {
  height: 100%;
  max-width: 180px;
  color: white;
  padding: 0px 25px 0px 5px;
  box-sizing: border-box;
  display: inline-block;
  .content {
    display: flex;
  }
  .icon-db_YOYChain {
    color: #facc14;
  }
  .content-name {
    flex: 1;
    @include ellipsis;
  }
  .content-legend {
    max-width: 80px;
    margin-right: 5px;
    text-align: center;
    @include ellipsis;
  }
  .icon-db_sort{
    margin-right: .4em;
  }
}
</style>
