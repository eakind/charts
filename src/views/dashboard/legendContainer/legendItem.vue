<template>
  <div class="legend-item">
    <template v-if="isArray">
     <div v-for="(item, index) in aggrList" :key="index">
      <div class="title" :style="setColor" :title="item">
        {{item}}
      </div>
      <div class="val-item" v-for="(valItem, valIndex) in itemData.list[index]" :key="valIndex">
        <div class="square" :style="setBg(valItem)"></div>
        <div class="text" :style="setColor" :title="valItem.val">{{valItem.val}}</div>
      </div>
    </div>
    </template>
    <template v-else>
      <div>
        <div class="title" :style="setColor" :title="item">
          {{title}}
        </div>
        <div class="val-item" v-for="(valItem, valIndex) in itemData.list" :key="valIndex">
          <div class="square" :style="setBg(valItem)"></div>
          <div class="text" :style="setColor" :title="valItem.val">{{valItem.val}}</div>
        </div>
      </div>
    </template>

  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  data () {
    return {
    };
  },
  props: {
    itemData: {
      type: Object
    }
  },
  computed: {
    ...mapState('dashboard', ['currentDashboardDetail']),
    aggrList () {
      return this.itemData.aggr;
    },
    isArray () {
      return Array.isArray(this.itemData.aggr);
    },
    title () {
      return this.itemData.aggr;
    },
    setColor () {
      let css = this.currentDashboardDetail.css.dashboard.bgColor;
      if (css.background.color) {
        return {
          color: css.bgSelected ? css.background.color : '#6b6b6b'
        };
      }
      return {};
    }
  },
  mounted () {
  },
  methods: {
    setBg (item) {
      return {
        backgroundColor: item.color
      };
    }
  }
};
</script>
<style lang='scss' scoped>
.legend-item {
  width: 100%;
  padding: 0px 8px;
  box-sizing: border-box;
  .title{
    font-size: 14px;
    margin-top: 12px;
    @include ellipsis;
  }
  .val-item {
    display: flex;
    height: 24px;
    align-items: center;
  }
  .square {
    width: 12px;
    height: 12px;
    margin: 10px;
  }
  .text{
    flex: 1;
    width: 0;
    font-size: 12px;
    @include ellipsis;
  }
}
</style>
