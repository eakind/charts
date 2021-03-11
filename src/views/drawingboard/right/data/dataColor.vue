<template>
  <dc-collapse-item :title="$t('dashboard.data_color')">
    <div class="data-color">
      <div
        class="color-section"
        v-for="(optionItem, optionIndex) in optionsList"
        :key="optionItem.name"
      >
        <div class="color-list">
          <color-item
            @on-tpl-confirm="onTplConfirm($event, optionIndex)"
            :colorList="colorList"
            @on-cat-color-change="catColorChange(optionIndex, $event)"
            :list="optionItem.list"
            :colors="optionItem.colors"
            :colorType="optionItem.colored_type"
            :index="optionIndex"
            v-bind="$attrs"
            :name="optionItem.name"
            :opacity="optionItem.opacity"
            :colorOptions="optionItem.list"
            @change-item-color="
              (id, val, idx) => onItemColorChange(id, val, optionIndex, idx)
            "
            @change-opacity="(val) => onOpacityChange(val, optionIndex)"
            @on-range-set="
              showRangeSet = true;
              curIndex = $event;
            "
          >
          </color-item>
        </div>
        <div class="area-fill" @click="fillHandler" v-if="showFillFlag">
          <dc-checked class="checked" :active="isFill"></dc-checked>
          <span>{{ $t('dashboard.fill_area') }}</span>
        </div>
      </div>
    </div>
    <div class="range-set-box" v-if="showRangeSet">
      <dc-alert append-to-body>
        <range-set
          v-on="$listeners"
          :index="curIndex"
          :list="colorList"
          @close="showRangeSet = false"
        ></range-set>
      </dc-alert>
    </div>
  </dc-collapse-item>
</template>
<script>
import DcChecked from '@/components/dcchecked/dcChecked.vue';
import DcAlert from '@/components/dcalert/dcAlert';
import ColorItem from './datacolor/colorItem.vue';
// import { dcDeepClone } from '@/utils/check';
import rangeSet from './datacolor/rangeSet';
export default {
  components: {
    DcChecked,
    DcAlert,
    ColorItem,
    rangeSet,
    // colorSizeRange
  },
  props: {
    colorList: [Object, Array],
    value: {
      type: Boolean,
    },
    showFillFlag: {
      type: Boolean,
      default: true,
    },
    showColorRangeFlag: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      isFill: false,
      isColorTplVisible: false,
      schemesIndex: 0,
      showRangeSet: false,
      curIndex: 0,
      timer: null,
      curColorList: [],
    };
  },
  watch: {
    value: {
      handler (val) {
        this.isFill = val;
      },
      immediate: true,
    },
    colorList: {
      handler (val) {
        this.curColorList = JSON.parse(JSON.stringify(val));
      },
      immediate: true,
      deeep: true,
    },
  },
  computed: {
    // 用于在视图上选择
    optionsList () {
      const colorList = JSON.parse(JSON.stringify(this.colorList)) || [];
      const optionsList = [];
      for (let i = 0; i < colorList.length; i++) {
        const {
          name = '',
          opacity = 100,
          list = [],
          colors = [],
          colored_type = 'ordinal',
          aggr,
        } = colorList[i];
        optionsList.push({
          colors,
          list: list.map(({ val, color, originalVal }) => ({
            id: val,
            color,
            val,
            originalVal,
          })),
          colored_type: colored_type || 'ordinal',
          name: name || aggr,
          opacity,
          // options: list.map(({ val, color }) => ({ id: val, color }))
        });
      }
      return optionsList;
    },
    canvasCssColors () {
      const colorList = JSON.parse(JSON.stringify(this.colorList));
      const colors = [];
      for (let i = 0; i < colorList.length; i++) {
        const { aggr = '', key_id = '', name = '', colors: _colors = {} } =
          colorList[i] || {};
        colors.push({
          aggr,
          name,
          key_id,
          colorList: Object.assign({}, _colors), // Object { feature_1: '#f00', feature_2: '#00f' }
        });
      }
      return colors;
    },
    canvasCssColorsAndOpacitiesList () {
      const colorList = JSON.parse(JSON.stringify(this.colorList));
      const colors_and_opacities_list = [];
      for (let i = 0; i < colorList.length; i++) {
        const {
          aggr = '',
          key_id = '',
          name = '',
          opacity = '',
          schemes = [],
          id = '',
        } = colorList[i] || {};
        colors_and_opacities_list.push({
          aggr,
          name,
          key_id,
          opacity,
          schemes,
          id,
        });
      }
      return colors_and_opacities_list;
    },
  },
  mounted () {},
  methods: {
    fillHandler () {
      this.isFill = !this.isFill;
      this.$emit('input', this.isFill);
      this.$emit('change', this.isFill);
    },
    closeTemplate () {
      this.isColorsTemplate = false;
    },
    showColorTpl (idx) {
      this.schemesIndex = idx;
      this.isColorTplVisible = true;
    },
    // 数值特征颜色
    onItemColorChange (id, value, idx, itemIdx) {
      //
      let curItem = this.curColorList[idx].list[itemIdx];

      this.curColorList[idx].list.map((i, mIdx) => {
        if (i.val === curItem.val) {
          this.$set(this.curColorList[idx].list[mIdx], 'color', value);
        }
      });
      this.$emit('change', this.curColorList);
    },
    onOpacityChange (value, idx) {
      if (this.curColorList[idx].opacity === value) {
        return;
      } // 透明度未变化
      this.$set(this.curColorList[idx], 'opacity', value);
      this.$emit('change', this.curColorList);
    },
    onTplConfirm (array, idx, templateList, optionIndex) {
      this.$emit('on-template-change', array, idx);
    },
    catColorChange (index, { list }) {
      this.$set(this.curColorList[index], 'list', list);
      this.$emit('change', this.curColorList);
    },
  },
};
</script>
<style lang="scss" scoped>
.data-color {
  // max-height: 400px;
  // max-height: 50vh;
  // overflow-y: auto;
  .color-panel {
    text-align: center;
    > button {
      background-color: #4284f5;
      color: white;
      border: none;
      font-size: 14px;
      border-radius: 4px;
      padding: 2px 15px;
      outline: none;
      text-align: center;
    }
  }
  .area-fill {
    padding: 5px 0px;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    .checked {
      top: 3px;
      margin: 0px 0px 0px 10px;
      position: relative;
    }
  }
}
.range-set-box {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 5;
}
</style>
