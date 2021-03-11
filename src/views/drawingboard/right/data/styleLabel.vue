<template>
  <div :title="$t('dashboard.data_label')">
    <div class="style-item">
      <div class="style-title">{{$t('dashboard.txt_color')}}</div>
      <!-- Emit up pick-color show-popper hide-popper -->
      <color-picker :value="color"
                    v-on="$listeners"
      />
    </div>
    <div class="style-item">
      <div class="style-title">{{$t('dashboard.txt_size')}}</div>
      <dc-select-view :list="fontSizeOptions" :select="size" @change="handleSizeChange" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import colorPicker from '@/components/colorPicker/colorPicker';
import DcSelectView from '@/components/dcselectview/dcSelectView';

export default {
  components: { colorPicker, DcSelectView },
  props: {
    fontStyles: {
      type: [Array, Object],
      default () {
        return [];
      },
    },
  },
  data () {
    return {
      color: '#424242',
      size: 12,
    };
  },
  computed: {
    ...mapState('drawingboard', ['fontSizeOptions']),
    fontSizeList () {
      const values = this.fontSizes;
      return values.map(value => ({ name: value, id: value }));
    },
  },
  watch: {
    fontStyles: {
      handler (styles) {
        const format = styles?.[0]?.list?.[0]?.format;
        if (!format) { return; }
        const { fontColor, fontSize } = format;
        this.color = fontColor;
        this.size = fontSize;
      },
      immediate: true,
    },
  },
  methods: {
    handleSizeChange ({ id: val }) {
      this.size = val;
      this.$emit('change-size', val);
    }
  }
};
</script>

<style lang="scss" scoped>
.dc-color-picker {
  margin-left: 8px;
}
.dc-select-view {
  top: 0;
}
</style>
