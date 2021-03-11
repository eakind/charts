<template>
  <dc-alert class="colors-custom" append-to-body>
    <div class="dc-alert-header">{{$t('message.self_color')}}</div>
    <div class="dc-alert-body">
      <div class="recently">
        <div class="custom-tip">{{$t('message.color_custom_tip')}}</div>
        <div class="custom-colors">
          <color-item :color="item || '#fff'"
                      :active="!!item && item === color"
                      v-for="(item, idx) in recentList"
                      :key="item || idx"
                      :update-recent="false"
                      :disabled="!item"
                      @click="onRecentPick(item)"
          />
        </div>
      </div>
      <!-- Set empty array to hide presetColors -->
      <sketch :value="color" @input="onSketchPick" :preset-colors="[]" />
    </div>
    <div class="dc-alert-footer">
      <button class="dc-alert-confirm" @click="confirm">{{$t('message.confirmed')}}</button>
      <button class="dc-alert-cancel" @click="$emit('cancel')">{{$t('message.cancel')}}</button>
    </div>
  </dc-alert>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import DcAlert from '@/components/dcalert/dcAlert';
import Sketch from '@/components/vue-color-modified/Sketch';
import colorItem from './colorItem';
import { delayFunc } from '../../utils/utils';

export default {
  components: { DcAlert, Sketch, colorItem },
  props: {
    value: { // color
      type: String,
      default: '#424242',
    },
  },
  data () {
    return {
      color: this.value,
    };
  },
  computed: {
    ...mapState('colors', ['colorsCustomRecent']),
    recentList () {
      let arr = [...Array(14)];
      const existsValues = this.colorsCustomRecent;
      arr = arr.map((el, idx) => existsValues[idx] || '');
      return arr;
    },
  },
  watch: {
    value: {
      handler (val) {
        this.color = val;
      },
      immediate: true,
    },
  },
  methods: {
    ...mapMutations('colors', [
      'setColorsCustomRecent',
      'setColorsRecentlyUsed'
    ]),
    onRecentPick (color) {
      this.changeColor(color);
    },
    onSketchPick: delayFunc(function ({ rgba, hex } = {}) {
      const { r, g, b, a } = rgba;
      let color = '';
      if (+a === 1) {
        color = hex;
      } else {
        color = `rgba(${r},${g},${b},${a})`;
      }
      if (!color || color === this.color) { return; }
      this.setColorsCustomRecent({ color });
      this.changeColor(color);
    }),
    changeColor (color) {
      if (!color || color === this.color) { return; }
      this.color = color;
    },
    confirm () {
      this.$emit('confirm', this.color);
      this.setColorsRecentlyUsed({ color: this.color });
    },
  },
};
</script>

<style lang="scss" scoped>
.colors-custom {
  padding: 15px;
  box-shadow: 0 24px 56px 0 rgba(0,0,0,0.10),
              0 4px 14px 0 rgba(0,0,0,0.10);
  text-align: left;
  .dc-alert-header {
    padding: 0 0 15px;
    font-size: 16px;
    font-weight: 600;
    text-align: left;
  }
  .dc-alert-body {
    display: flex;
    box-sizing: border-box;
    padding: 8px 24px 8px 16px;
    width: 528px;
    border-radius: 4px;
    background-color: #E7EBF2;
  }
  .dc-alert-footer {
    padding: 20px 0 8px;
    .dc-alert-confirm,
    .dc-alert-cancel {
      border: none;
      background: unset;
      font-size: 16px;
      font-weight: 600;
    }
    .dc-alert-confirm {
      color: #4284F5;
    }
    .dc-alert-cancel{
      color: #a4a4a4;
    }
  }
}
.recently {
  padding-top: 6px;
}
.custom-tip {
  margin-bottom: 12px;
  font-size: 14px;
  color: #666666;
}
.custom-colors {
  display: flex;
  flex-wrap: wrap;
  width: 224px;
  .color-item {
    flex-shrink: 0;
    margin-right: 8px;
    margin-bottom: 8px;
    width: 24px;
    height: 24px;
  }
}

.dc-sketch {
  margin-left: 24px;
  flex-grow: 1;
}
</style>
