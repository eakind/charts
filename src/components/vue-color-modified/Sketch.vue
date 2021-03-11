<template>
  <div role="application" aria-label="Sketch color picker" :class="['dc-sketch', disableAlpha ? 'dc-sketch__disable-alpha' : '']">
    <div class="dc-sketch-saturation-wrap">
      <saturation v-model="colors" @change="childChange"></saturation>
    </div>
    <div class="dc-sketch-controls">
      <div class="dc-sketch-sliders">
        <div class="dc-sketch-hue-wrap">
          <hue v-model="colors" @change="childChange"></hue>
        </div>
      </div>
    </div>
    <div class="dc-sketch-field" v-if="!disableFields">
      <div class="dc-sketch-field--single">
        <ed-in class="dc-hex" label="HEX #" :value="hex" @change="inputChange"></ed-in>
        <button class="copy-btn" @click="onHexCopy">{{$t('message.copy')}}</button>
      </div>
      <div class="dc-sketch-field--single" v-if="!disableAlpha">
        <ed-in :label="$t('message.opacity')" :value="colors.a" :arrow-offset="0.01" :max="1" @change="changeAlpha"></ed-in>
        <div class="dc-sketch-sliders">
          <div class="dc-sketch-alpha-wrap" v-if="!disableAlpha">
            <alpha v-model="colors" @change="childChange"></alpha>
          </div>
        </div>
      </div>
    </div>
    <div class="dc-sketch-presets" role="group" aria-label="A color preset, pick one to set as current color" v-if="presetColors.length">
      <template v-for="c in presetColors">
        <div
          v-if="!isTransparent(c)"
          class="dc-sketch-presets-color"
          :aria-label="'Color:' + c"
          :key="c"
          :style="{background: c}"
          @click="handlePreset(c)">
        </div>
        <div
          v-else
          :key="c"
          :aria-label="'Color:' + c"
          class="dc-sketch-presets-color"
          @click="handlePreset(c)">
          <checkboard />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
// Custom vue-color from github, to support ui.
// All css class vc is replaced to dc, to ignore unexpected global styles from other components.
import colorMixin from 'vue-color/src/mixin/color';
import editableInput from './common/EditableInput.vue';
import saturation from 'vue-color/src/components/common/Saturation.vue';
import hue from 'vue-color/src/components/common/Hue.vue';
import alpha from 'vue-color/src/components/common/Alpha.vue';
import checkboard from 'vue-color/src/components/common/Checkboard.vue';

const presetColors = [
  '#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321',
  '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2',
  '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF',
  'rgba(0,0,0,0)'
];

export default {
  name: 'Sketch',
  mixins: [colorMixin],
  components: {
    saturation,
    hue,
    alpha,
    'ed-in': editableInput,
    checkboard
  },
  props: {
    presetColors: {
      type: Array,
      default () {
        return presetColors;
      }
    },
    disableAlpha: {
      type: Boolean,
      default: false
    },
    disableFields: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    hex () {
      let hex;
      if (this.colors.a < 1) {
        hex = this.colors.hex;
      } else {
        hex = this.colors.hex;
      }
      return hex.replace('#', '');
    },
    activeColor () {
      var rgba = this.colors.rgba;
      return 'rgba(' + [rgba.r, rgba.g, rgba.b, rgba.a].join(',') + ')';
    }
  },
  methods: {
    onHexCopy () {
      let dom = this.$el.querySelector('.dc-hex .dc-input__input');
      dom.select();
      document.execCommand('Copy');
    },
    handlePreset (c) {
      this.colorChange({
        hex: c,
        source: 'hex'
      });
    },
    childChange (data) {
      this.colorChange(data);
    },
    changeAlpha (data) {
      this.colorChange({
        r: this.colors.rgba.r,
        g: this.colors.rgba.g,
        b: this.colors.rgba.b,
        a: Number(data['透明度']),
        source: 'rgba'
      });
    },
    inputChange (data) {
      if (!data) {
        return;
      }
      if (data['HEX #']) {
        if (data['HEX #'].length === 6) {
          this.isValidHex(`#${data['HEX #']}`) && this.colorChange({
            hex: `#${data['HEX #']}`,
            source: 'hex'
          });
        }
      } else if (data.r || data.g || data.b || data.a) {
        this.colorChange({
          r: data.r || this.colors.rgba.r,
          g: data.g || this.colors.rgba.g,
          b: data.b || this.colors.rgba.b,
          a: data.a || this.colors.rgba.a,
          source: 'rgba'
        });
      }
    }
  }
};
</script>

<style scoped>
.dc-sketch {
  position: relative;
  width: 200px;
}

.dc-sketch-saturation-wrap {
  width: 100%;
  padding-bottom: 75%;
  position: relative;
  overflow: hidden;
}

.dc-sketch-controls {
  display: flex;
}

.dc-sketch-sliders {
  padding: 4px 0;
  flex: 1;
}

.dc-sketch-sliders >>> .dc-hue,
.dc-sketch-sliders >>> .dc-alpha-gradient {
  border-radius: 2px;
}

.dc-sketch-hue-wrap {
  position: relative;
  height: 10px;
}

.dc-sketch-alpha-wrap {
  position: relative;
  height: 10px;
  margin-top: 4px;
  overflow: hidden;
}

.dc-sketch-color-wrap {
  width: 24px;
  height: 24px;
  position: relative;
  margin-top: 4px;
  margin-left: 4px;
  border-radius: 3px;
}

.dc-sketch-active-color {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 2px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .15), inset 0 0 4px rgba(0, 0, 0, .25);
  z-index: 2;
}

.dc-sketch-color-wrap >>> .dc-checkerboard {
  background-size: auto;
}

.dc-sketch-field {
  padding-top: 4px;
}

.dc-sketch-field >>> .dc-input__label {
  display: block;
  flex-shrink: 0;
  width: 56px;
  text-align: left;
  font-size: 14px;
  color: #666;
  text-transform: capitalize;
}

.dc-sketch-field >>> .dc-input__wrapper {
  margin-left: 8px;
  margin-right: 16px;
  flex-grow: 0;
  width: 90px;
}

.dc-sketch-field >>> .dc-input__input {
  padding: 5px 8px;
  box-sizing: border-box;
  width: 100%;
  border: none;
  line-height: 22px;
  font-size: 16px;
  box-shadow: inset 0 0 0 1px #DEDEDE;
}

.dc-sketch-field--single {
  padding-top: 4px;
  display: flex;
  justify-content: space-between;
  flex: 1;
  align-items: center;
}

.copy-btn {
  border: none;
  color: white;
  width: 80px;
  height: 24px;
  font-size: 12px;
  line-height: 24px;
  border-radius: 4px;
  cursor: pointer;
  outline: none;
  background: #4284f5;
}

.dc-sketch-presets {
  margin-right: -10px;
  margin-left: -10px;
  padding-left: 10px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.dc-sketch-presets-color {
  border-radius: 3px;
  overflow: hidden;
  position: relative;
  display: inline-block;
  margin: 0 10px 10px 0;
  vertical-align: top;
  cursor: pointer;
  width: 16px;
  height: 16px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .15);
}

.dc-sketch-presets-color >>> .dc-checkerboard {
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .15);
  border-radius: 3px;
}

.dc-sketch__disable-alpha >>> .dc-sketch-color-wrap {
  height: 10px;
}
</style>
