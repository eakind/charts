<template>
  <div class="edit-tooltip-box">
    <dc-alert class="edit-tooltip" :class="hasFormat">
      <div class="dc-alert-header">
        <span class="title">{{ titleText }}</span>
        <span class="iconfont icon-db_plus" @click="closeHandler"></span>
      </div>
      <div class="dc-alert-body">
        <tooltip-name
          :list="tooltipList"
          :is-label="isLabel"
          @change="selectTooltip"
          @on-reset="tooltipList = $event"
        ></tooltip-name>
        <tooltip-font
          v-bind="$attrs"
          :item="selectItem.text"
          :is-label="isLabel"
          @change="changeFont"
          @on-uniform="uniform('text', $event)"
        ></tooltip-font>
        <tooltip-data
          v-bind="$attrs"
          :keyName="selectItem.key"
          :item="selectItem.format"
          @change="changeData"
          @on-uniform="uniform('format', $event)"
          v-if="isHasFormat"
        ></tooltip-data>
      </div>
      <div class="dc-alert-footer">
        <span class="confirm-btn" @click="comfirmHandler">确定</span>
        <span class="cancel-btn" @click="closeHandler">取消</span>
      </div>
    </dc-alert>
  </div>
</template>
<script>
import DcAlert from '@/components/dcalert/dcAlert.vue';
import TooltipName from './tooltipName.vue';
import TooltipFont from './tooltipFont.vue';
import TooltipData from './tooltipData.vue';
import { notEmpty } from '@/utils/check';
export default {
  data () {
    return {
      tooltipList: [],
      selectItem: {}, // 当前选中的字段
      selectIndex: 0, // 当前选中字段的下标
      isHasFormat: false, // 是否有数据格式
    };
  },
  props: {
    isLabel: {
      type: Boolean,
      default: false
    },
    tooltipData: {
      type: Object,
    },
    titleText: {
      type: String,
      default: 'Tooltips',
    },
  },
  watch: {
    tooltipData: {
      handler (list) {
        this.tooltipList = JSON.parse(JSON.stringify(list));
        this.selectItem = this.tooltipList[0];
        // console.log(list);
        // this.tooltipList = JSON.parse(JSON.stringify(list));
        // this.selectItem = this.tooltipList[0];
        // this.isHasFormat = false;
        // if (notEmpty(this.selectItem.format)) {
        //   this.isHasFormat = true;
        // }
      },
      immediate: true,
    },
    selectIndex: {
      handler (val) {
        this.isHasFormat = this.tooltipList[val].type === 'linear';
      },
      immediate: true,
    },
  },
  computed: {
    hasFormat () {
      return !this.isHasFormat ? 'has-format' : '';
    },
  },
  components: {
    DcAlert,
    TooltipName,
    TooltipFont,
    TooltipData,
  },
  mounted () {},
  methods: {
    comfirmHandler () {
      this.$emit('change', this.tooltipList);
    },
    closeHandler () {
      this.$emit('close');
    },
    selectTooltip (index) {
      this.selectItem = this.tooltipList[index];
      this.selectIndex = index;
      this.isHasFormat = false;
      if (notEmpty(this.selectItem.format)) {
        this.isHasFormat = true;
      }
    },
    changeTitle (value, index) {
      this.$set(this.tooltipList[index], 'title', value);
    },
    changeFont (obj, index) {
      this.$set(this.tooltipList[this.selectIndex], 'text', obj);
    },
    changeData (obj, index) {
      this.$set(this.tooltipList[this.selectIndex], 'format', obj);
    },
    uniform (type, obj) {
      this.tooltipList.map((i) => {
        i[type] = obj;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.edit-tooltip-box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .6);
  z-index: 5;
}
.edit-tooltip {
  width: 720px;
  // height: 628px;
  min-width: 560px;
  max-width: 768px;
  max-height: 702px;
  // min-height: 608px;
  background-color: white;
  padding: 0 1.14em 1.14em 1.14em;
  .dc-alert-header {
    text-align: left;
    font-size: 16px;
    padding: 8px;
    position: relative;
    .title {
      color: #424242;
      font-size: 14px;
      font-weight: bold;
    }
  }
  .icon-db_plus {
    color: #a4a4a4;
    transform: rotate(-45deg);
    display: inline-block;
    right: 15px;
    cursor: pointer;
    position: absolute;
  }
  .dc-alert-body {
    display: flex;
    font-size: 14px;
    color: #424242;
    height: 540px;
    box-sizing: border-box;
    > div {
      flex: 1;
      margin: 0px 8px;
      box-sizing: border-box;
    }
  }
  .confirm-btn {
    color: #4294f5;
    font-size: 16px;
    margin: 0px 30px;
    cursor: pointer;
    display: inline-block;
  }
  .cancel-btn {
    color: #666666;
    font-size: 16px;
    margin: 0px 30px;
    cursor: pointer;
    display: inline-block;
  }
}
// .has-format{
//   width: 600px;
// }
</style>
