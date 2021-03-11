<template>
  <div class="tooltip-font">
    <div class="header">
      <span>文字</span>
      <span class="same-style"
            @click="uniformFlag=!uniformFlag">
        <dc-checked class="checked"
                    :active="uniformFlag"></dc-checked>
        <span>统一格式</span>
      </span>
    </div>
    <div class="body">
      <span>颜色</span>
      <colors-pure :value="fontObj.fontColor" :index="-2"
                   @pick-color="pickColor">
        <div slot="bottom"
                class="btn-custom"
                @click="showCustomDialog">{{$t('dashboard.self_color')}}</div>
      </colors-pure>
      <colors-custom-dialog v-if="isCustomVisible"
                            :value="color"
                            @confirm="onDialogConfirm"
                            @cancel="isCustomVisible = false" />
      <div class="font-size">
        <span class="title">文字大小</span>
        <tooltip-select :select="fontObj.fontSize"
                        :list="fontSizeList"
                        @change="changeSize"></tooltip-select>
      </div>
      <div class="font-size" v-if="!isLabel">
        <span class="title">对齐</span>
        <tooltip-align @change="changeAlign"
                       :active="fontObj.align"></tooltip-align>
      </div>
      <div class="apply-tooltip"
           v-if="showApplyTooltip"  @click.stop="checkProcess">
        <dc-check :active="fontObj.check"></dc-check>
        <span>同步应用于tooltip</span>
      </div>
    </div>
  </div>
</template>
<script>
import DcChecked from '@/components/dcchecked/dcChecked.vue';
import ColorsPure from '@/components/colorPicker/colorsPure.vue';
import ColorsCustomDialog from '@/components/colorPicker/colorsCustomDialog.vue';
import TooltipSelect from './tooltipSelect.vue';
import TooltipAlign from './tooltipAlign.vue';
import dcCheck from '../../../left/model/dcCheck.vue';
export default {
  data () {
    return {
      fontSizes: [12, 14, 16, 18, 20], // 字体大小列表
      isCustomVisible: false, // 是否显示自定义颜色
      fontObj: {
        fontSize: 14, // 字体大小
        align: 'center', // 字体对齐方式
        fontColor: '#424242' // 字体颜色
      },
      uniformFlag: false
    };
  },
  props: {
    isLabel: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object
    },
    showApplyTooltip: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    item: {
      handler (obj) {
        if (!obj) return;
        this.fontObj = JSON.parse(JSON.stringify(obj));
        this.$set(this.fontObj, 'fontColor', obj.fontColor);
        console.log(this.fontObj);
      },
      immediate: true,
      deep: true
    },
    uniformFlag: {
      handler (val) {
        if (val) {
          this.$emit('on-uniform', this.fontObj);
        }
      },
    }
  },
  computed: {
    fontSizeList () {
      let values = this.fontSizes;
      return values.map(item => ({ id: item, name: item }));
    }
  },
  components: {
    DcChecked,
    TooltipSelect,
    TooltipAlign,
    ColorsPure,
    ColorsCustomDialog,
    dcCheck
  },
  mounted () {
  },
  methods: {
    pickColor (value) {
      this.$set(this.fontObj, 'fontColor', value);
      this.sendEmit();
    },
    changeAlign (align) {
      this.$set(this.fontObj, 'align', align);
      this.sendEmit();
    },
    changeSize (sizeObj) {
      this.$set(this.fontObj, 'fontSize', sizeObj.id);
      this.sendEmit();
    },
    showCustomDialog () {
      this.isCustomVisible = true;
    },
    onDialogConfirm (value) {
      this.isCustomVisible = false;
      this.$set(this.fontObj, 'fontColor', value);
      this.sendEmit();
    },
    checkProcess () {
      this.$set(this.fontObj, 'check', !this.fontObj.check);
      this.sendEmit();
    },
    sendEmit () {
      this.$emit('change', this.fontObj);
      if (this.uniformFlag) {
        this.$emit('on-uniform', this.fontObj);
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.tooltip-font {
  .header {
    position: relative;
  }
  .same-style {
    right: 0px;
    cursor: pointer;
    position: absolute;
  }
  .checked {
    top: 3px;
    margin-right: 5px;
    position: relative;
  }
  .body {
    position: relative;
    padding: 5px 10px;
    margin: 5px 0px;
    border-radius: 4px;
    box-sizing: border-box;
    height: calc(100% - 20px);
    background-color: #f2f2f2;
  }
  .font-size {
    .title {
      padding: 5px 0px;
      font-size: 14px;
      display: block;
      color: #424242;
    }
  }
  .btn-custom {
    margin-top: 7px;
    width: 136px;
    height: 32px;
    border-radius: 4px;
    line-height: 32px;
    color: #777;
    text-align: center;
    cursor: pointer;
    background-color: #fff;
    border: 1px solid #dedede;
  }
}
.dc-check{
  background-color: #fff;
}
.apply-tooltip{
  position: absolute;
  bottom: 10px;
  height: 36px;
  line-height: 36px;;
  &>span{
    margin-left: 8px;
    vertical-align: 4px;
  }
}
</style>
