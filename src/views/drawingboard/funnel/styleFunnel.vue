<template>
  <div>
    <!-- 漏斗图形状 -->
    <dc-collapse-item :title="$t('message.funnel_shape')">
      <scale-radio :list="shapeOptions"  :select="activeShape" @change="changeShape"></scale-radio>
    </dc-collapse-item>
    <!-- 转化率样式 -->
    <dc-collapse-item class="conversion" :title="$t('message.funnel_conversion')"
                      :hasChecked="true" :checked-label="$t('message.show')" :checked="conversion"
                      @checked-change="handleConversionVisible">
      <div class="style-item">
        <div class="style-title">{{$t('message.txt_color')}}</div>
        <!-- Emit up pick-color show-popper hide-popper -->
        <color-picker v-model="conversionColor"
                      @pick-color="triggerChange"
        />
      </div>
      <div class="style-item">
        <div class="style-title">{{$t('message.txt_size')}}</div>
        <dc-select-view :list="fontSizeOptions" :select="conversionFontsize" @change="handleSizeChange" />
      </div>
    </dc-collapse-item>
    <!-- 漏斗图对比布局 -->
    <dc-collapse-item :title="$t('message.funnel_compare_layout')">
      <scale-radio :list="layoutOptions" :select="activeLayout" @change="changeLayout"></scale-radio>
    </dc-collapse-item>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import ScaleRadio from '@/components/dcchartformat/ScaleRadio';
import colorPicker from '@/components/colorPicker/colorPicker';
import DcSelectView from '@/components/dcselectview/dcSelectView';

import { isDefined } from '@/utils/check';

export default {
  components: { ScaleRadio, colorPicker, DcSelectView },
  props: {
    value: Object,
  },
  data () {
    return {
      // 漏斗图形状, trapezium 梯形, pyramid 金字塔
      activeShape: 'trapezium',
      shapeOptions: [
        { label: this.$t('message.trapezium'), value: 'trapezium' },
        { label: this.$t('message.pyramid'), value: 'pyramid' },
      ],
      // 漏斗图对比布局
      activeLayout: 'horizontal',
      layoutOptions: [
        { label: this.$t('message.left_right'), value: 'horizontal' },
        { label: this.$t('message.inner_outer'), value: 'inner' },
      ],
      conversion: true, // 是否显示转化率
      conversionColor: '#424242', // 转换率文字颜色
      conversionFontsize: 12, // 文字大小
    };
  },
  computed: {
    ...mapState('drawingboard', ['fontSizeOptions']),
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        let { minwidth_shape, compare_layout, conversion, conversionColor, conversionFontsize, } = val || {};
        if (minwidth_shape) {
          this.activeShape = minwidth_shape;
        }
        if (compare_layout) {
          this.activeLayout = compare_layout;
        }
        if (isDefined(conversion)) {
          this.conversion = conversion;
        }
        if (conversionColor) {
          this.conversionColor = conversionColor;
        }
        if (conversionFontsize) {
          this.conversionFontsize = conversionFontsize;
        }
      },
    },
  },
  methods: {
    changeShape (val) {
      this.activeShape = val;
      this.triggerChange();
    },
    changeLayout (val) {
      this.activeLayout = val;
      this.triggerChange();
    },
    handleSizeChange ({ id: val }) {
      this.conversionFontsize = val;
      this.triggerChange();
    },
    handleConversionVisible (val) {
      this.conversion = val;
      this.triggerChange();
    },
    // 主动触发change，仅通过内部事件触发，以区分父组件传值
    triggerChange () {
      const value = {
        minwidth_shape: this.activeShape,
        compare_layout: this.activeLayout,
        conversion: this.conversion,
        conversionColor: this.conversionColor,
        conversionFontsize: this.conversionFontsize,
      };
      this.$emit('input', value);
      this.$emit('change', value);
    },
  },
};
</script>

<style lang="scss" scoped>
.dc-select-view {
  top: 0;
}
.conversion {
  padding-bottom: 5px;
}
</style>
