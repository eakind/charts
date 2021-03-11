<template>
  <ul class="aggr-list">
    <li
      v-for="(item, key) in legendList"
      :key="key"
      @click="selectAggr(item, key)"
    >
      <span>{{ item }}</span>
      <span class="probability" v-if="key === 'PERCENTILE'">
        <span class="text">{{ probability }}</span>
        <span
          class="iconfont icon-db_edit"
          @click.stop="editProbability(item, key)"
        ></span>
      </span>
    </li>
  </ul>
</template>
<script>
import { mapState } from 'vuex';
export default {
  data () {
    return {};
  },
  props: {
    item: {
      type: Object,
    },
    capsuleType: {
      type: String,
    },
  },
  computed: {
    ...mapState('project', ['legendMap']),
    ...mapState('drawingboard', [
      'canvasType',
      'sizeCapsuleList',
      'labelsCapsuleList',
    ]),
    probability () {
      return this.item.legend === 'PERCENTILE' ? this.item.probability : 0.5;
    },
    legendList () {
      //    this.canvasType === 'pie' &&
      if (
        this.capsuleType === 'labels' &&
        this.sizeCapsuleList.length > 0
      ) {
        let pareMap = JSON.parse(JSON.stringify(this.legendMap));
        for (let index = 0; index < this.labelsCapsuleList.length; index++) {
          const element = this.labelsCapsuleList[index];
          if (this.item.legend !== element.legend) {
            delete pareMap[element.legend];
          }
        }
        return pareMap;
      }
      return this.legendMap;
    },
  },
  components: {},
  mounted () {},
  methods: {
    selectAggr (item, key) {
      this.$emit(
        'change-aggr',
        key,
        key === 'PERCENTILE' ? this.probability : null
      );
    },
    editProbability (item, key) {
      this.$emit(
        'edit-probability',
        item,
        key,
        key === 'PERCENTILE' ? this.probability : null
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.aggr-list {
  list-style-type: none;
  max-height: 300px;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0px;
  margin: 0px;
  width: 180px;
  background-color: white;
  right: -181px;
  top: 0px;
  position: absolute;
  box-shadow: 0 6px 14px 0 rgba(0, 0, 0, 0.1);
  > li {
    height: 30px;
    line-height: 30px;
    padding: 0px 10px;
    cursor: pointer;
    display: flex;
    &:hover {
      color: #4284f5;
    }
  }
  .probability {
    margin-left: 8px;
    flex: 1;
    font-size: 16px;
    color: #a4a4a4;
    display: flex;
    .text {
      flex: 1;
      text-align: center;
      text-indent: -16px;
    }
  }
  .iconfont {
    color: #4284f5;
  }
}
</style>
