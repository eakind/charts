<template>
  <div class="tooltip-data">
    <div class="header">
      <span>数据</span>
      <span class="same-style" @click="uniformFlag = !uniformFlag">
        <dc-checked class="checked" :active="uniformFlag"></dc-checked>
        <span class="same-txt">统一格式</span>
      </span>
    </div>
    <div class="body">
      <span class="title" v-if="!item.isPercent">显示格式</span>
      <tooltip-select
        class="tooltip-select"
        :list="formatList"
        :select="formatObj.selectFormat"
        v-if="!item.isPercent"
        @change="changeFormat"
      ></tooltip-select>
      <span class="title" v-if="!item.isPercent">千分符</span>
      <tooltip-select
        class="tooltip-select"
        :list="markList"
        v-if="!item.isPercent"
        :select="formatObj.useThousandMark"
        @change="changeMark"
      ></tooltip-select>
      <span class="title">小数位数</span>
      <tooltip-select
        class="tooltip-select"
        :list="aggrList"
        :select="formatObj.decimal"
        @change="changeDecimal"
      ></tooltip-select>
      <span class="title" v-if="!item.isPercent">负值显示</span>
      <tooltip-select
        v-if="!item.isPercent"
        class="tooltip-select"
        :list="negativeList"
        :select="formatObj.negative"
        @change="changeNegative"
        type="negative"
      ></tooltip-select>
      <div
        v-show="
          formatObj.selectFormat === 'currency' || formatObj.selectFormat === -1
        "
      >
        <div v-show="formatObj.selectFormat === 'currency'">
          <span class="title">区域设置</span>
          <tooltip-select
            class="tooltip-select"
            :list="areaList"
            :select="formatObj.zone"
            @change="changeZone"
            type="zone"
          ></tooltip-select>
        </div>
        <span class="title" v-if="!item.isPercent">单位</span>
        <tooltip-select
          v-if="!item.isPercent"
          class="tooltip-select"
          :list="unitList"
          :select="formatObj.unit"
          @change="changeUnit"
          type="unit"
        ></tooltip-select>
      </div>
      <span class="title">前缀 / 后缀</span>
      <!-- v-model="formatObj.prefix" -->
      <input
        class="input"
        :value="formatObj.prefix"
        @input="inputProcess($event.target.value, 'prefix')"
      />
      <span class="split">/.../</span>
      <input
        class="input"
        :value="formatObj.suffix"
        @input="inputProcess($event.target.value, 'suffix')"
      />
      <!-- <template v-if="keyName.indexOf('percent')===-1">
        <span class="title">后缀</span>
        <input class="input"
               :value="formatObj.suffix"
               @input="inputProcess($event.target.value,'suffix')" />
      </template> -->
      <div
        class="apply-tooltip"
        v-if="showApplyTooltip"
        @click.stop="checkProcess"
      >
        <dc-check :active="formatObj.check"></dc-check>
        <span>同步应用于tooltip</span>
      </div>
    </div>
  </div>
</template>
<script>
import dcCheck from '../../../left/model/dcCheck.vue';
import DcChecked from '@/components/dcchecked/dcChecked.vue';
import TooltipSelect from './tooltipSelect.vue';
import { mapState } from 'vuex';
export default {
  data () {
    return {
      formats: ['原始数据', '百分比', '货币格式'],
      marks: ['不使用', '使用'],
      nums: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      negatives: ['-1234', '(1234)', '1234-'],
      units: [
        '',
        `K ${this.$i18n.t('message.thousand')}`,
        `M ${this.$i18n.t('message.million')}`,
        `G ${this.$i18n.t('message.billion')}`,
        `T ${this.$i18n.t('message.myriads')}`,
      ],
      areas: [],
      formatObj: {
        useThousandMark: false, // 是否使用千分符
        decimal: 2, // 小数位数有多少位
        negative: '-1234', // 负数显示
        prefix: '', // 前缀
        suffix: '', // 后缀
        unit: ' ', // 单位
        selectFormat: 'percent', // 显示格式
        zone: '', // 区域设置
      },
      uniformFlag: false,
      areaCode: ['', 'CN', 'JP', 'HK', 'US', 'EUR', 'GBP']
    };
  },
  props: {
    item: {
      type: Object,
    },
    keyName: {
      type: String,
    },
    showApplyTooltip: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    item: {
      handler (obj) {
        this.setArea();
        if (obj) {
          this.formatObj = JSON.parse(JSON.stringify(obj));
          this.formatObj.decimal = obj.decimal === '' ? 2 : obj.decimal;
        }
      },
      immediate: true,
      deep: true,
    },
    uniformFlag: {
      handler (val) {
        if (val) {
          this.$emit('on-uniform', this.formatObj);
        }
      },
    },
  },
  computed: {
    ...mapState('project', ['locale']),
    areaList () {
      let list = this.areas;
      return list.map((item) => ({ id: item, name: item }));
    },
    formatList () {
      let list = this.formats;
      let obj = {
        原始数据: -1,
        百分比: 'percent',
        货币格式: 'currency',
      };
      return list.map((item) => ({ id: obj[item], name: item }));
    },
    markList () {
      let list = this.marks;
      let obj = {
        使用: true,
        不使用: false,
      };
      return list.map((item) => ({ id: obj[item], name: item }));
    },
    aggrList () {
      let list = this.nums;
      return list.map((item) => ({ id: item, name: item }));
    },
    negativeList () {
      let list = this.negatives;
      return list.map((item) => ({ id: item, name: item }));
    },
    unitList () {
      let list = this.units;
      return list.map((item) => ({ id: item, name: item || '无' }));
    },
  },
  components: {
    DcChecked,
    TooltipSelect,
    dcCheck,
  },
  mounted () {},
  methods: {
    emitUniform () {
      if (this.uniformFlag) {
        this.$emit('on-uniform', this.formatObj);
      }
    },
    // 更改显示格式
    changeFormat (item) {
      this.$set(this.formatObj, 'selectFormat', item.id);
      if (item.id === 'percent') {
        this.$set(this.formatObj, 'suffix', '%');
      } else {
        this.$set(this.formatObj, 'suffix', '');
      }
      if (item.selectFormat === 'currency') {
        // let zoneName = this.areaCode[this.areas.indexOf(item.id)];
        // this.$set(this.formatObj, 'zone', zoneName);
      }
      this.$emit('change', this.formatObj);
      this.emitUniform();
    },
    // 修改小数位数
    changeDecimal (item) {
      this.$set(this.formatObj, 'decimal', item.id);
      this.$emit('change', this.formatObj);
      this.emitUniform();
    },
    // 修改负值显示
    changeNegative (item) {
      this.$set(this.formatObj, 'negative', item.id);
      this.$emit('change', this.formatObj);
      this.emitUniform();
    },
    // 修改是否显示千分符
    changeMark (item) {
      this.$set(this.formatObj, 'useThousandMark', item.id);
      this.$emit('change', this.formatObj);
      this.emitUniform();
    },
    // 修改区域设置
    changeZone (item) {
      // let areaCode = ['', 'CN', 'JP', 'HK', 'US', 'EUR', 'GBP'];
      let zoneName = this.areaCode[this.areas.indexOf(item.id)];
      this.$set(this.formatObj, 'zone', zoneName);
      this.$emit('change', this.formatObj);
      this.emitUniform();
    },
    // 修改单位
    changeUnit (item) {
      this.$set(this.formatObj, 'unit', item.id);
      this.$emit('change', this.formatObj);
      this.emitUniform();
    },
    setArea () {
      if (this.locale === 'zh') {
        this.areas = [
          '无',
          `¥ ${this.$i18n.t('message.rmb')}`,
          `￥ ${this.$i18n.t('message.jpy')}`,
          `HK$ ${this.$i18n.t('message.hkd')}`,
          `＄ ${this.$i18n.t('message.usd')}`,
          `€ ${this.$i18n.t('message.euro')}`,
          `£ ${this.$i18n.t('message.gbp')}`,
        ];
      } else {
        this.areas = [
          '无',
          `＄ ${this.$i18n.t('message.usd')}`,
          `HK$ ${this.$i18n.t('message.hkd')}`,
          `¥ ${this.$i18n.t('message.rmb')}`,
          `￥ ${this.$i18n.t('message.jpy')}`,
          `€ ${this.$i18n.t('message.euro')}`,
          `£ ${this.$i18n.t('message.gbp')}`,
        ];
      }
    },
    checkProcess () {
      this.$set(this.formatObj, 'check', !this.formatObj.check);
      this.$emit('change', this.formatObj);
    },
    inputProcess (val, type) {
      this.$set(this.formatObj, type, val);
      this.$emit('change', this.formatObj);
    },
  },
};
</script>
<style lang="scss" scoped>
.tooltip-data {
  box-sizing: border-box;
  .header {
    position: relative;
  }
  .same-style {
    right: 0px;
    cursor: pointer;
    position: absolute;
  }
  .checked {
    top: 3px;
    margin-right: 5px;
    position: relative;
  }
  .body {
    position: relative;
    margin: 5px 0px;
    padding: 5px 20px;
    box-sizing: border-box;
    height: calc(100% - 20px);
    border-radius: 4px;
    background-color: #f2f2f2;
    & > div {
      margin-bottom: 0.8em;
    }
  }
  .tooltip-select {
    width: 160px;
  }
  .title {
    padding: 0px 0px 0px;
    display: block;
  }
  .input {
    display: inline-block;
    border: 1px solid #dedede;
    border-radius: 4px;
    padding: 0px 5px;
    width: 60px;
    height: 30px;
    line-height: 30px;
    outline: none;
  }
  span.split {
    margin: 0 0.4em;
  }
}
.dc-check {
  background-color: #fff;
}
.apply-tooltip {
  position: absolute;
  bottom: 10px;
  height: 36px;
  line-height: 36px;
  margin-bottom: 0px!important;
  & > span {
    margin-left: 8px;
    vertical-align: 4px;
  }
}
</style>
