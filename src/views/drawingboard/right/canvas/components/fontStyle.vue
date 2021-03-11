<template>
  <div class="font-style">
    <div class="font-block flex">
      <span>文字颜色</span>
      <color-picker v-model="fontColor"
                      @pick-color="triggerChange"
                      @on-tpl-confirm="textChange"
                      :colorList="[{list:[{color:fontColor,val:'文字颜色'}],name:'文字颜色'}]"
        >
      </color-picker>
    </div>
    <div class="font-block">
      <span class="txt">文字大小</span>
      <dc-select-view :list="fontList"
                      :select="fontSize"
                      @change="changeSize"></dc-select-view>
    </div>
    <div class="font-block"
         v-if="hasDir">
      <span class="txt">文字方向</span>
      <dc-select-view :list="dirList"
                      :select="direct"
                      @change="changeDir"></dc-select-view>
    </div>
    <div class="font-block"
         v-if="hasAlign">
      <div class="txt">对齐方式</div>
      <dc-font-alignment v-on="$listeners" v-bind="$attrs"></dc-font-alignment>
    </div>
  </div>
</template>
<script>
import DcSelectView from '@/components/dcselectview/dcSelectView.vue';
import ColorPicker from '@/components/colorPicker/colorPicker';
import dcFontAlignment from './fontAlignment';
export default {
  data () {
    return {
      fontSize: 12, // 字体大小
      fontSizes: [12, 14, 16, 18, 20],
      direct: 'rotate',
      directions: ['横向', '竖向', '斜上', '斜下'],
      fontColor: '#4284f5'
    };
  },
  props: {
    hasDir: {
      type: Boolean,
      default () {
        return false;
      }
    },
    hasAlign: {
      type: Boolean,
      default: false
    },
    titleCss: {
      type: Object
    }
  },
  computed: {
    fontList () {
      const values = this.fontSizes;
      return values.map(value => ({ name: value, id: value }));
    },
    dirList () {
      const values = this.directions;
      const obj = {
        横向: '0',
        斜上: '-45',
        竖向: '90',
        斜下: '45'
      };
      return values.map(item => ({ name: item, id: obj[item] }));
    }
  },
  watch: {
    titleCss: {
      handler (obj) {
        if (!obj) return;
        this.fontSize = obj.fontSize;
        this.fontColor = obj.fontColor;
        if (obj.rotate) {
          this.direct = obj.rotate;
        }
      },
      immediate: true,
      deep: true
    }
  },
  components: {
    DcSelectView,
    ColorPicker,
    dcFontAlignment
  },
  mounted () {
  },
  methods: {
    textChange (list) {
      this.emitChange(list[0].color, this.fontSize, this.direct);
      // this.$emit('change', list[0].color, this.fontSize, this.direct);
    },
    triggerChange () {
      this.emitChange(this.fontColor, this.fontSize, this.direct);
      // this.$emit('change', this.fontColor, this.fontSize, this.direct);
    },
    changeSize (item) {
      this.fontSize = item.id;
      this.emitChange(this.fontColor, this.fontSize, this.direct);
      // this.$emit('change', this.fontColor, this.fontSize, this.direct);
    },
    changeDir (item) {
      this.direct = item.id;
      this.emitChange(this.fontColor, this.fontSize, this.direct);
      // this.$emit('change', this.fontColor, this.fontSize, this.direct);
    },
    emitChange (fontColor, fontSize, rotate) {
      let style = {
        fontColor, fontSize, rotate
      };
      this.$emit('change', style);
    }
  }
};
</script>
<style lang='scss' scoped>
.font-style {
  .font-block {
    padding: 3px 0px;
    display: flex;
    align-items: center;
    margin-top: 8px;
  }
  .color-block {
    width: 16px;
    height: 16px;
    display: block;
    border-radius: 3px;
    margin-left: 15px;
    background-color: #4284f5;
  }
  .txt {
    margin-right: 5px;
  }
}
</style>
