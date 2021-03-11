<template>
  <div class="color-module flex">
    <div class="title">
      {{ title }}
    </div>
    <dc-select
      v-if="showSelectBox"
      class="bg-select"
      :class="hasBorder ? '' : 'no-border'"
      :list="list"
      :value="curStyleObj.bgSelected"
      v-bind="$attrs"
      @change="changeProcess"
    >
      <template v-slot:default="{ item }">
        <template v-if="isBorder">
          <div v-if="item.value === 'none'">
            {{ typeof item.label === 'undefined' ? item : item.label }}
          </div>
          <div v-else :class="item.value"></div>
        </template>
        <template v-else>{{
          typeof item.label === 'undefined' ? item : item.label
        }}</template>
      </template>
    </dc-select>
    <div
      class="flex"
      v-if="
        curStyleObj.bgSelected && curStyleObj.bgSelected !== 'none' && showColor
      "
    >
      <color-picker
        :append-to-body="appendBody"
        :colorList="[
          {
            list: [{ color: curStyleObj.background, val: '颜色' }],
            name: '颜色',
          },
        ]"
        :value="curStyleObj.background"
        v-bind="$attrs"
        v-on="$listeners"
        @pick-color="(color) => onColorPick(i, color, index)"
        @on-tpl-confirm="titleChange"
      >
        <template #default>
          <div class="opacity-wrap">
            <div class="opacity-box">
              <span>不透明度</span>
              <input
                type="text"
                :value="curStyleObj.opacity"
                @input="inputProcess($event)"
              />
              %
            </div>
          </div>
        </template>
      </color-picker>
      <span class="opacity">{{ curStyleObj.opacity }} %</span>
    </div>
  </div>
</template>
<script>
import colorPicker from '@/components/colorPicker/colorPicker.vue';
import dcSelect from '@/components/newSelect/index.vue';
import { rgbToHex } from '@/utils/utils.js';
export default {
  name: 'colorModule',
  components: {
    colorPicker,
    dcSelect,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    showSelectBox: {
      type: Boolean,
      default: true,
    },
    bgSelected: {
      type: [Number, String, Boolean],
      default: false,
    },
    /**
     * bgSelected  background opacity
     */
    styleObj: {
      type: Object,
      default: (_) => {
        return {
          // bgSelected: false,
          background: '#fff',
          opacity: 100,
        };
      },
    },
    hasBorder: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array,
      default: (_) => {
        return [
          {
            label: '无',
            value: false,
          },
          {
            label: '使用',
            value: true,
          },
        ];
      },
    },
    showColor: {
      type: Boolean,
      default: true,
    },
    isBorder: {
      type: Boolean,
      default: false,
    },
    appendBody: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      curStyleObj: {},
    };
  },
  watch: {
    styleObj: {
      handler (val) {
        // this.$set(this.curStyleObj, 'bgSelected', val.bgSelected);
        let opacity = val.opacity === 0 ? val.opacity : val.opacity || 100;
        this.$set(this.curStyleObj, 'opacity', opacity);
        this.$set(this.curStyleObj, 'background', val.background || '#fff');
      },
      immediate: true,
      deep: true,
    },
    bgSelected: {
      handler (val, oldVal) {
        if (!val) {
          this.$set(this.curStyleObj, 'opacity', 0);
          this.$set(
            this.curStyleObj,
            'background',
            this.styleObj ? this.styleObj.background || '#fff' : '#fff'
          );
        } else {
          this.$set(
            this.curStyleObj,
            'opacity',
            typeof this.styleObj.opacity === 'undefined'
              ? 100
              : this.styleObj.opacity || 100
          );
        }
        this.$set(this.curStyleObj, 'bgSelected', val);
      },
      immediate: true,
      // deep: true
    },
  },
  methods: {
    titleChange (list) {
      this.curStyleObj.background = list[0].color;
      this.$emit('changeColor', this.curStyleObj);
    },
    onColorPick (item, color) {
      let hex = color;
      let opacity;
      if (color.indexOf('#') === -1) {
        let obj = rgbToHex(color);
        hex = obj.hex;
        opacity = obj.opacity;
      }
      this.curStyleObj.background = hex;
      opacity && (this.curStyleObj.opacity = opacity * 100);
      this.$emit('changeColor', this.curStyleObj);
    },
    inputProcess (e) {
      let oldVal = this.opacity;
      let val = Number(e.target.value.replace(/[^0-9]/g, ''));
      if (val > 100 || val < 0) {
        val = oldVal;
      }
      this.curStyleObj.opacity = Number(val);
      e.target.value = val;
      this.$emit('changeColor', this.curStyleObj);
    },
    changeProcess (val) {
      this.curStyleObj.bgSelected = val;
      if (this.isBorder) {
        this.$emit('changeColor', this.curStyleObj);
        return;
      }
      if (!val) {
        this.curStyleObj.opacity = 0;
      } else {
        this.curStyleObj.opacity = 100;
      }
      this.$emit('changeColor', this.curStyleObj);
    },
  },
};
</script>
<style lang="scss" scoped>
@import './style/index.scss';
.flex {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.color-module {
  margin-bottom: 0.8em;
  .title {
    color: hsl(0, 0%, 40%);
    font-size: 12px;
    font-weight: bold;
    margin-right: 0.8em;
    min-width: 4em;
  }
  .opacity {
    margin-left: 5px;
  }
}
.bg-select {
  margin-right: 0.5em;
}
.opacity-wrap {
  padding: 5px 8px;
  background: hsl(0, 0%, 100%);
  .opacity-box {
    // margin: 0 5px;
    padding: 8px 0;
    text-align: left;
    border-top: 1px solid hsl(0, 0%, 88.2%);
    font-size: 12px;
    input {
      border-radius: 4px;
      background: hsl(0, 0%, 100%);
      border: 1px solid hsl(0, 0%, 87.1%);
      width: 48px;
      appearance: none;
      margin-left: 2px;
      outline: none;
      text-align: center;
    }
  }
}

/deep/ .dc-color-picker {
  border: 1px solid hsl(0, 0%, 87.1%);
}
/deep/ .dc-color-picker {
  margin-left: 0;
}

/deep/ .el-select.no-border {
  .el-input__inner {
    border-radius: 0;
  }
}
</style>
<style lang="scss">
.el-select-dropdown {
  width: 120px;
  .el-select-dropdown__wrap.el-scrollbar__wrap {
    // overflow: hidden;
    margin-bottom: -15px !important;
  }
}
.el-popper[x-placement^='bottom'] {
  margin-top: 10px;
}

.dotted,
.solid,
.bold {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: auto;
  width: 70%;
}
.dotted {
  border-bottom: 1px dotted hsl(0, 0%, 25.9%);
}
.solid {
  border-bottom: 1px solid hsl(0, 0%, 25.9%);
}
.bold {
  border-bottom: 2px solid hsl(0, 0%, 25.9%);
}
</style>
