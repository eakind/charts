<template>
  <div class="group-capsule" :data-symbol='dataSymbol'>
    <div class="capsule-panel left" data-dir="left" :data-symbol='dataSymbol'>
      <span class="panel-tip" data-dir="left" v-if="!left.length" :data-symbol='dataSymbol'>请放入特征</span>
      <capsule-item class="capsule-item" v-else
                    :item="left[0]" index="0" type="combined" :is-group="true" dir="left"
                    @change-aggr="changeAggr"
                    @select-type="selectType"
                    @show-count-box="showCountBoxProcess"
                    @remove-count="removeCount"
                    @remove="removeHandler"></capsule-item>
    </div>
    <div class="capsule-panel" data-dir="right" :data-symbol='dataSymbol'>
      <span class="panel-tip" data-dir="right" v-if="!right.length" :data-symbol='dataSymbol'>请放入特征</span>
      <capsule-item class="capsule-item" v-else
                    :item="right[0]" index="0" type="combined" :is-group="true" dir="right"
                    @change-aggr="changeAggr"
                    @select-type="selectType"
                    @show-count-box="showCountBoxProcess"
                    @remove-count="removeCount"
                    @remove="removeHandler"></capsule-item>
    </div>
    <template v-if="showCountBox">
      <component
        :is="countDialogPare[curCountType]"
        :item="currentItem"
        :capsuleType="curCapsuleType"
        @close="showCountBox = false"
        @sure="countSureHandler"
      ></component>
    </template>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { isEmpty } from '@/utils/check';
import CapsuleItem from './capsule/capsuleItem.vue';
import chainRatio from './capsule/countList/chainRatio.vue';
import yoy from './capsule/countList/yoy.vue';
import {
  removeFeature,
  changeLegend,
  changeCapsuleRate,
  removeCapsuleCount
} from './utils/capsuleUtils.js';
export default {
  data () {
    return {
      left: [],
      right: [],
      dataSymbol: 'groupCapsule',
      showCountBox: false,
      curCountType: '',
      curCapsuleType: '',
      dir: '',
      children: 0,
      currentItem: [],
      countDialogPare: {
        RING: chainRatio,
        ON: yoy,
      },
    };
  },
  computed: {
    ...mapState('drawingboard', ['barLineList', 'rowList'])
  },
  watch: {
    barLineList: {
      handler (list) {
        if (isEmpty(list)) {
          this.left = [];
          this.right = [];
          return;
        };
        if (list[0].left) {
          this.left.splice(0, 1, list[0].left[0]);
        }
        if (list[0].right) {
          this.right.splice(0, 1, list[0].right[0]);
        }
        if (list[0].left && list[0].right) {
          this.rowList.push(list[0]);
          this.setRowList(this.rowList);
          this.barLineList = [];
          this.left = [];
          this.right = [];
          this.setBarLineList([]);
        }
      },
      deep: true
    }
  },
  components: {
    CapsuleItem
  },
  mounted () {
  },
  methods: {
    ...mapMutations('drawingboard', ['setRowList', 'setBarLineList']),
    showCountBoxProcess (countType, capsuleType, index, dir) {
      this.showCountBox = true;
      this.curCountType = countType;
      this.curCapsuleType = capsuleType;
      this.currentItem = this.barLineList[index][dir][0];
      this.dir = dir;
      this.children = 0;
    },
    countSureHandler (rate) {
      this.showCountBox = false;
      let list = changeCapsuleRate(rate, 0, 0, this.dir, this.barLineList);
      this.setBarLineList(list);
    },
    removeCount (index, dir) {
      let list = removeCapsuleCount(index, 0, dir, this.barLineList);
      this.setBarLineList(list);
    },
    changeAggr (legend, probability, index, dir) {
      let list = changeLegend(
        legend,
        index,
        0,
        dir,
        probability,
        this.barLineList
      );
      this.setBarLineList(list);
    },
    removeHandler (index, dir) {
      let list = removeFeature(index, 0, dir, this.barLineList);
      this.setBarLineList(list);
    },
    selectType (type, index, dir) {
      let list = JSON.parse(JSON.stringify(this.barLineList));
      let obj = list[0];
      obj[dir][0].chartType = type;
      this.setBarLineList(list);
    }
  }
};
</script>
<style lang='scss' scoped>
.group-capsule {
  display: inline-block;
  border: 1px solid #4284f5;
  border-radius: 4px;
  max-width: 380px;
  min-width: 280px;
  margin-right: 10px;
  height: 37px;
  font-size: 14px;
  padding: 0px;
  position: relative;
  box-sizing: border-box;
  .capsule-panel{
    font-weight: 300;
    display: inline-block;
    min-width: 140px;
    max-width: 190px;
    padding: 0px 4px 0px 3px;
    height: 37px;
    line-height: 37px;
  }
  .panel-tip{
    display: block;
    width: 100%;
    text-align: center;
    color: #cccccc;
  }
  .capsule-item{
    margin: 0px;
  }
  .left {
    position: relative;
    &::after {
      display: inline-block;
      content: '';
      height: 100%;
      width: 1px;
      right: -1px;
      top: -1px;
      border-left: 2px solid #4284f5;
      position: absolute;
    }
  }
}
</style>
