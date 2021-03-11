<template>
  <div class="colors-pure">
    <div class="colors-container">
      <div class="colors-column"
          v-for="(column, n) in pureColors"
          :key="n">
        <color-item :class="isSetMin"
                    :color="item"
                    :active="item === color"
                    v-for="item in column"
                    :key="item"
                    @click="onColorPick(item)"
        />
      </div>
    </div>
    <colors-recent :value="color" :is-min="isMin"
                   @pick-recent="onColorPick"
    />
    <slot name="bottom" />
  </div>
</template>

<script>
import colorItem from './colorItem.vue';
import colorsRecent from './colorsRecent';

import { colorModel } from './colorMixin';

export default {
  components: { colorItem, colorsRecent },
  mixins: [colorModel],
  data () {
    return {
      pureColors: [
        ['#424242', '#5F5F5F', '#7F7F7F', '#F2F2F2', '#FFFFFF'],
        ['#F5282D', '#F75357', '#FA9496', '#FDD4D5', '#FEEAEA'],
        ['#4284F5', '#689DF7', '#A1C2FA', '#DAE7FD', '#ECF3FE'],
        ['#03B98C', '#36C7A3', '#81DCC6', '#CDF1E8', '#E6F8F4'],
        ['#FACC14', '#FBD743', '#FDE68A', '#FEF5D0', '#FFFAE8'],
        ['#8643E0', '#9F6AE7', '#C2A1F0', '#E7DAF9', '#F3EDFC'],
        ['#F59E28', '#F7B253', '#FACF94', '#FEECD4', '#FEF6EA'],
      ],
    };
  },
  props: {
    isMin: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number
    }
  },
  computed: {
    isSetMin () {
      return this.isMin ? 'min-width' : '';
    }
  },
  watch: {
    index: {
      handler (value) {
        // if (value !== -2) {
        //   this.color = '';
        // }
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
.colors-pure {
  padding: 7px 5px;
  text-align: left;
}
.colors-container {
  padding: 0 2px 3px;
  display: flex;
}
.colors-column {
  flex-shrink: 0;
  &:last-child .color-item {
    margin-right: 0;
  }
}
.min-width{
  margin-right: 8px;
}
</style>
