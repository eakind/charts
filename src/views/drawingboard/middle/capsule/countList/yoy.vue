<template>
  <!-- 同比 -->
  <chain-ratio
    countType="ON"
    v-bind="$attrs"
    :item="item"
    @close="$emit('close')"
    @sure="sureHandler"
  >
    <template #default>
      <template v-if="splitKeys.indexOf(splitType) > -1">
        <!-- 年月日 年月 年季 -->
        <div class="peried-box">
          <div class="title">选择计算的周期</div>
          <div class="flex padding">
            <div
              class="s-icon"
              :class="isDefault ? 'active' : ''"
              @click="isDefault = true"
            ></div>
            <div class="s-label">
              默认（按{{ periodObj.title }}同比，{{ periodObj.period }}个周期）
            </div>
          </div>
          <div class="flex padding">
            <div
              class="s-icon"
              :class="!isDefault ? 'active' : ''"
              @click="isDefault = false"
            ></div>
            <div class="s-label">
              自定义
              <input
                :readonly="isDefault"
                :class="isDefault ? 'disabled' : ''"
                type="number"
                v-model="period"
                min="1"
                placeholder="请输入正整数"
              />个周期
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <!-- 其他 -->
        <div class="peried-box">
          <div class="title">计算的周期-按{{ text }}特征</div>
          <div class="s-label padding">自定义周期（请输入正整数）</div>
          <div class="s-value padding">
            <input
              type="number"
              v-model="period"
              placeholder="请输入正整数"
              min="1"
            />个周期
          </div>
        </div>
      </template>
    </template>
  </chain-ratio>
</template>
<script>
import chainRatio from './chainRatio.vue';
import { mapState } from 'vuex';
export default {
  components: { chainRatio },
  props: {
    item: {
      type: Object,
      defualt: (_) => {},
    },
    capsuleType: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      splitKeys: ['YEAR,MONTH', 'YEAR,SEASON', 'YEAR,MONTH,DAY'],
      isDefault: true,
      period: 1,
    };
  },
  computed: {
    ...mapState('drawingboard', ['rowList', 'columnList', 'canvasType']),
    splitType () {
      let list =
        this.capsuleType === 'row'
          ? this.columnList
          : this.capsuleType === 'column'
            ? this.rowList
            : [...this.columnList, ...this.rowList];
      let match = list.filter((i) => this.splitKeys.indexOf(i.split) > -1);
      if (match.length > 0) {
        return match[match.length - 1].split;
      }
      return '';
    },
    periodObj () {
      let obj = {
        title: '',
        peried: 0,
      };
      let index = this.splitKeys.indexOf(this.splitType);
      if (index === -1) {
        return {};
      }
      if (index === 0 || index === 1) {
        obj.title = '年';
        obj.period = index === 1 ? 4 : 12;
      } else {
        obj.title = '周';
        obj.period = 7;
      }
      return obj;
    },
    text () {
      if (this.canvasType === 'bar-rotated') {
        return '行';
      } else if (this.canvasType !== 'table') {
        return '列';
      }
      let hasRowCat = this.rowList.find((i) => i.dtype === 'CAT');
      let hasColCat = this.columnList.find((i) => i.dtype === 'CAT');
      let hasRowAggr = this.rowList.find((i) => i.dtype === 'AGGR');
      let hasColAggr = this.columnList.find((i) => i.dtype === 'AGGR');
      if (hasRowCat && hasColCat && (!hasRowAggr && !hasColAggr)) {
        return '列';
      }
      if ((hasRowCat && !hasRowAggr) || hasColAggr || (!hasRowAggr && hasColAggr)) {
        return '行';
      }
      return '列';
    },
  },
  watch: {
    item: {
      handler (val) {
        this.period = val.rate ? val.rate.period : 1;
      },
      immediate: true,
      deep: true
    },
  },
  methods: {
    sureHandler (rate) {
      if (this.splitKeys.indexOf(this.splitType) > -1 && this.isDefault) {
        rate.period = this.periodObj.period;
      } else {
        rate.period = this.period;
      }
      if (rate.period <= 0) {
        this.$showMessage({
          content: '请设置周期为不小于0的整数。',
        });
        setTimeout(() => {
          this.$closeMessage();
        }, 1000);
        return false;
      }
      this.$emit('sure', rate);
    },
  },
};
</script>
<style scoped lang="scss">
@import './style/index.scss';
.flex {
  display: flex;
  align-items: center;
}
.padding {
  padding: 6px 0 6px 8px;
}
.peried-box {
  border-top: 1px solid #e1e1ee;
  .title {
    color: #666666;
  }
  input {
    width: 128px;
    background: #ffffff;
    border: 1px solid #dedede;
    border-radius: 4px;
    padding: 5px;
    outline: none;
    appearance: none;
    border: none;
  }
  input.disabled {
    background: #dedede;
    color: #a4a4a4;
  }
}
</style>
