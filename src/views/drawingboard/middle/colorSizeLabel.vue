<template>
  <!-- 此胶囊为颜色 大小 标签 可适用于 饼图 气泡 地图 表格等图表 -->
  <!--  :data-symbol="capsuleType+'Capsule'"
       :data-dragging="capsuleType+'Dragging'" -->
  <div class="dc-color-size-label flex">
    <div :class="[capsuleType + '-left', 'left-wrap', 'flex']">
      <span>
        {{ leftText }}
      </span>
      <span
        v-if="totalList.length > 2"
        class="iconfont icon-db_arrow"
        :class="arrowDirec"
        @click="clkProcess"
      ></span>
    </div>
    <div :class="[capsuleType + '-right', 'right-wrap', 'flex']">
      <div
        class="capsule-wrap"
        :data-symbol="capsuleType + 'Capsule'"
        :data-dragging="capsuleType + 'Dragging'"
      >
        <span
          :class="[capsuleType + '-tip', 'tips']"
          :data-symbol="capsuleType + 'Capsule'"
          :data-dragging="capsuleType + 'Dragging'"
          v-if="isNoFeature"
        >
          {{ $t('dashboard.drop_features') }}
        </span>
        <dc-capsule
          :class="isCollapse ? 'collpase' : 'not-collapse'"
          v-for="(item, index) in list"
          :key="index"
          :item="item"
          :index="index"
          :data-symbol="capsuleType + 'CapsuleReplace'"
          :noDrag="noDrag(item)"
          @remove-count="removeCount"
          @remove="removeCapsule"
          @change-aggr="changeAggr"
          @label-style-show="showLabelStyleBox"
          @change-split="changeSplit"
          @change-percent="changePercent($event, item)"
          @modify-count-rate="changeCapsuleVal(index, $event, 'rate')"
          @sortChange="changeCapsuleVal(index, $event, 'order')"
          @clear-sort="clearSort(index)"
          :type="capsuleType"
        ></dc-capsule>
      </div>
      <div
        class="right icon-box"
        :data-symbol="capsuleType + 'Capsule'"
        :data-dragging="capsuleType + 'Dragging'"
      >
        <icon-svg class="icon-svg" :icon="attrObj[capsuleType].icon"></icon-svg>
      </div>
    </div>
    <label-style
      v-if="labelStyle.show"
      :tooltipData="labelStyle.list"
      :is-label="true"
      @close="closeLabelStyleBox"
      @change-label-style="changeLabelStyle"
    ></label-style>
  </div>
</template>
<script>
import dcCapsule from './capsule';
import {
  changeLegend,
  changeSplit,
  changeProp,
  removeCapsuleCount,
} from './utils/capsuleUtils.js';
import labelStyle from './colorSizeLabel/labelStyle.vue';
import labelStyleMixins from './mixins/labelStyle.js';
import { mapState, mapMutations } from 'vuex';
export default {
  components: { dcCapsule, labelStyle },
  mixins: [labelStyleMixins],
  props: {
    /**
     * color / size / label
     */
    capsuleType: {
      type: String,
      default: 'color',
    },
    isCollapse: {
      type: Boolean,
      default: false,
    },
    totalList: {
      type: Array,
      default: (_) => [],
    },
  },
  data () {
    return {
      arrowDirec: 'bottom',
      attrObj: {
        color: {
          zhText: '颜色',
          enText: 'Color',
          icon: '#icon-dbc_color',
        },
        size: {
          zhText: '大小',
          enText: 'Size',
          icon: '#icon-dbc_size',
        },
        labels: {
          zhText: '标签',
          enText: 'Label',
          icon: '#icon-dbc_textcolor',
        },
      },
    };
  },
  computed: {
    ...mapState('drawingboard', [
      'colorCapsuleList',
      'labelsCapsuleList',
      'sizeCapsuleList',
      'canvasType',
    ]),
    ...mapState({ locale: (state) => state.project.locale }),
    list () {
      if (this.isCollapse) {
        return this.arrowDirec === 'bottom'
          ? this.totalList.slice(0, 2)
          : this.totalList;
      }
      return this[this.capsuleType + 'CapsuleList'] || [];
    },
    leftText () {
      return this.attrObj[this.capsuleType][this.locale + 'Text'];
    },
    isNoFeature () {
      return this.list.length === 0;
    },
  },

  methods: {
    ...mapMutations('drawingboard', [
      'setColorCapsuleList',
      'setLabelsCapsuleList',
      'setSizeCapsuleList',
    ]),
    noDrag (item) {
      if (this.canvasType !== 'pie' || this.capsuleType !== 'labels') {
        return false;
      }
      let match = this.sizeCapsuleList.find(
        (i) => i.name === item.name && i.legend === item.legend
      );
      console.log(!!match);
      return !!match;
    },
    clkProcess () {
      this.arrowDirec = this.arrowDirec === 'bottom' ? 'top' : 'bottom';
    },
    removeCount (index, children, dir) {
      let list = removeCapsuleCount(index, children, dir, this.list);
      let type =
        this.capsuleType.substring(0, 1).toUpperCase() +
        this.capsuleType.substr(1);
      // 如果是表格，则判断重复
      if (this.canvasType === 'table') {
        list = this.repeatProcess(list);
      }
      this['set' + type + 'CapsuleList'](list);
      this.bus.$emit('capsuleChange', this.capsuleType, list);
    },
    removeCapsule (index) {
      let list = JSON.parse(JSON.stringify(this.list));
      let item = list[index];
      list.splice(index, 1);
      let type =
        this.capsuleType.substring(0, 1).toUpperCase() +
        this.capsuleType.substr(1);
      this['set' + type + 'CapsuleList'](list);
      // 更新labelStyle
      this.removeLabelFormat(item);
      this.bus.$emit('capsuleChange', this.capsuleType, list);
    },
    changeAggr (legend, probability, index, childIndex, dir) {
      let list = changeLegend(
        legend,
        index,
        childIndex,
        dir,
        probability,
        this.list
      );
      this.emitCapsuleChange(list, true);
    },
    changePercent (obj, item) {
      this.checkedProcess(obj, item);
      this.$emit('change-percent', obj);
    },
    changeSplit (split, index) {
      let list = [];
      if (this.capsuleType === 'color') {
        list = changeSplit(split, 0, this.list);
      }
      list = changeSplit(split, index, this.list);
      this.emitCapsuleChange(list);
    },

    emitCapsuleChange (list, aggrFlag) {
      let type =
        this.capsuleType.substring(0, 1).toUpperCase() +
        this.capsuleType.substr(1);
      this['set' + type + 'CapsuleList'](list);
      this.bus.$emit('capsuleChange', this.capsuleType, list, aggrFlag);
    },
    changeCapsuleVal (index, val, attr) {
      let list = JSON.parse(JSON.stringify(this.list));
      if (this.capsuleType === 'color') {
        list = changeProp({ index: 0, val, list, attr });
      } else {
        list = changeProp({ index, val, list, attr });
      }
      // 如果是表格，则判断重复 attr rate
      if (this.canvasType === 'table' && attr === 'rate') {
        list = this.repeatProcess(list);
      }
      this.emitCapsuleChange(list);
    },
    clearSort (index) {
      if (this.capsuleType === 'color') {
        index = 0;
      }
      let list = JSON.parse(JSON.stringify(this.list));
      let curItem = this.rowList[index];
      delete curItem.order;
      list[index] = curItem;
      this.emitCapsuleChange(list);
    },
  },
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}
.dc-color-size-label {
  min-height: 40px;
  background: #ffffff;
  border-radius: 4px;
  margin: 0px;
  .icon-db_arrow {
    display: inline-block;
    width: 32px;
    transform: rotate(90deg);
    text-align: center;
    transition: 0.3s;
    cursor: pointer;
  }
  .icon-db_arrow.top {
    transform: rotate(270deg);
  }
  .right-wrap {
    flex: 1;
    margin-left: 8px;
    min-height: 40px;
    line-height: 40px;
    .tips {
      color: #a4a4a4;
      font-weight: 300;
      font-size: 14px;
    }
    .icon-box {
      width: 60px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      opacity: 0.1;
      font-size: 26px;
    }
    .capsule-wrap {
      flex: 1;
      display: flex;
      // align-items: center;
      flex-wrap: wrap;
      min-height: 40px;
      flex-wrap: wrap;
      & > div.collpase {
        width: 50%;
      }
      & > div.not-collpase {
        flex: 1;
      }
    }

    @media screen and(max-width:1440px) {
      .capsule-wrap {
        & > div.collpase {
          width: 80%;
        }
      }
    }
  }
}
.flex {
  display: flex;
  align-items: center;
}
.left-wrap {
  width: 72px;
  box-sizing: border-box;
  padding-left: 8px;
  text-align: left;
}
.capsule-box {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
