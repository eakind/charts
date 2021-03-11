<template>
  <vue-popper
    trigger="clickToToggle"
    ref="colorPopper"
    :append-to-body="appendToBody"
    :options="{
      placement: placement,
      modifiers: {
        offset: { offset: '0,10px' },
        computeStyle: { gpuAcceleration: false },
        positionArrow: {
          //自定义popper定位
          order: 860,
          enabled: true,
          fn: (data) => {
            let ele = data.instance.reference;
            // ele.parentElement.parentElement;//
            // 针对滚动
            let parent = (parent = ele.parentElement.parentElement); // ele.offsetParent.querySelector('.color-list')
            let className = this.className;
            if (className) {
              parent = ele.offsetParent.querySelector('.' + className);
            }
            if (!parent) {
              return data;
            }
            let parentObj = parent.getBoundingClientRect();
            let minTop = parentObj.y;
            let maxTop = parentObj.y + parentObj.height;
            let obj = ele.getBoundingClientRect();
            let top = obj.height + obj.y;
            data.styles = Object.assign(data.styles, {
              top: top + 8,
              // display:top>=minTop&&top<=maxTop?'block':'none' // fixed数据颜色列表中有多个特征时不显示的问题
            });
            return data;
          },
        },
      },
    }"
    @show="popperShow"
    @hide="$emit('hide-popper')"
    @document-click="$emit('hide-popper')"
  >
    <!-- value from parent -->
    <div slot="reference" class="dc-color-picker" :style="setStyle()"></div>
    <div class="dc-color-panel popper" :style="{ top: '20px' }">
      <!-- <div class="icon-arrow"></div> -->
      <dc-tabs>
        <dc-tab-item title="预设" v-if="showPresetColor">
          <preset-list v-bind="$attrs" @change="changeProcess"></preset-list>
        </dc-tab-item>
        <dc-tab-item :title="$t('message.color_pure')">
          <!-- extends v-model="color" -->
          <colors-pure :value="color" v-on="$listeners">
            <div
              v-if="useCustomColor"
              slot="bottom"
              class="btn-custom"
              @click="showCustomDialog"
            >
              {{ $t('message.self_color') }}
            </div>
          </colors-pure>
          <colors-custom-dialog
            v-if="isCustomVisible"
            :value="color"
            @confirm="onDialogConfirm"
            @cancel="isCustomVisible = false"
          />
        </dc-tab-item>
        <dc-tab-item title="渐变色" v-if="!isFont">
          <colors-gradient
            :start-color="startColor"
            :end-color="endColor"
            v-on="$listeners"
          ></colors-gradient>
        </dc-tab-item>
        <dc-tab-item :title="$t('message.color_palette')">
          <!-- extends v-model="color" -->
          <colors-palette
            :value="color"
            :index="index"
            v-on="$listeners"
            v-bind="$attrs"
          />
        </dc-tab-item>
      </dc-tabs>
      <slot></slot>
    </div>
  </vue-popper>
</template>

<script>
import VuePopper from 'vue-popperjs';
import 'vue-popperjs/dist/vue-popper.css';

import colorsPure from './colorsPure';
import colorsPalette from './colorsPalette.vue';
import colorsCustomDialog from './colorsCustomDialog';

import colorsGradient from './colorsGradient.vue';
import { colorModel } from './colorMixin';

import presetList from './presetList.vue';

/** Usage example
 * <color-picker v-model="color" />
 * data () { return { color: '#FF0000' } }
 */
export default {
  components: {
    VuePopper,
    colorsPure,
    colorsPalette,
    colorsCustomDialog,
    colorsGradient,
    presetList,
  },
  mixins: [colorModel],
  props: {
    useCustomColor: {
      type: Boolean,
      default: true,
    },
    isFont: {
      type: Boolean,
      default: true,
    },
    className: {
      type: String,
      default: '',
    },
    index: {
      type: Number,
    },
    showPresetColor: {
      type: Boolean,
      default: false,
    },
    appendToBody: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      isCustomVisible: false,
      placement: 'bottom-start',
    };
  },
  methods: {
    popperShow () {
      this.$emit('show-popper');
      this.placement = 'top-start';
    },
    showCustomDialog () {
      this.isCustomVisible = true;
      this.$refs.colorPopper.doClose();
    },
    onDialogConfirm (color) {
      this.isCustomVisible = false;
      this.onColorPick(color);
    },
    changeProcess (item) {
      this.color = item;
      this.$emit('change', item);
    },
    setStyle () {
      if (this.color.backgroundIcon) {
        return {
          background: `url(${this.color.backgroundIcon})`,
          color: this.color.color,
        };
      } else {
        return {
          background: this.color.background || this.color,
        };
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dc-color-picker {
  margin-left: 16px;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #dedede;
}

.dc-color-panel {
  position: relative;
  padding: 0;
  border-radius: 4px;
  background-color: #f2f2f2; // #4284f5;
  z-index: 3000; // 12200697;
  box-shadow: 0 6px 14px 0 rgba(0, 0, 0, 0.5);
  border: none;
  pointer-events: auto !important;

  /deep/ {
    .dc-tab-nav {
      > .nav-item {
        color: #a4a4a4;
        background-color: #f2f2f2;
        &.active {
          color: #424242;
          background-color: #fff;
          &::after {
            background-color: #fff// #424242;
          }
        }
      }
    }
    .popper__arrow {
      top: -8px;
      border-width: 0 5px 8px 5px;
      border-color: transparent transparent #fff transparent;
    }
  }
}
.dc-tab-item {
  width: 200px;
  border-radius: 0 0 4px 4px;
  overflow: hidden;
}
.colors-pure,
.colors-gradient,
.colors-palette {
  padding: 7px 6px;
  background-color: #fff;
}
.btn-custom {
  margin-top: 7px;
  width: 136px;
  height: 32px;
  text-align: center;
  cursor: pointer;
  border-radius: 4px;
  line-height: 32px;
  color: #777;
  outline: none;
  background-color: #fff;
  border: 1px solid #dedede;
}
</style>
