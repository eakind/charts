<template>
  <!-- <div class="" > -->
  <el-dialog
    title="编辑文本"
    width="768px"
    class="edit-text dashaboard-edit-text"
    :close-on-click-modal="false"
    :show-close="false"
    :visible="true"
    @close="$emit(close)"
  >
    <div class="header">
      <color-set
        :appendToBody="false"
        title="大小"
        :hasBorder="true"
        :list="fontSizeList"
        :bgSelected="curStyle.fontSize"
        :showColor="false"
        @changeColor="changeFontSize($event)"
      ></color-set>
      <text-set
        type="font"
        title="字形"
        @update:val="fontStyleProcess"
        :val="curStyle.fontStyle"
      ></text-set>
      <text-set
        type="align"
        title="对齐"
        :val.sync="curStyle.textAlign"
      ></text-set>
      <color-set
        title="颜色"
        className="dashaboard-edit-text"
        :showSelectBox="false"
        :styleObj="curStyle.colorStyle"
        :bgSelected="curStyle.colorStyle.bgSelected"
        @changeColor="changeAttr('colorStyle', $event)"
      ></color-set>
    </div>
    <div class="content">
      <textarea
        v-model="curVal"
        placeholder="点此输入文字"
        :style="setStyleObj"
      ></textarea>
    </div>
    <div class="bottom">
      <div class="sure-btn btn" @click="sureHandler">确定</div>
      <div class="btn" @click="cancelHandler">取消</div>
    </div>
  </el-dialog>
  <!-- </div> -->
</template>
<script>
import colorSet from './left/styleSetting/moduleSets/color.vue';
import textSet from './left/styleSetting/moduleSets/text.vue';
import { setLineHeight, hexToRgba } from '@/utils/utils.js';
export default {
  props: ['styleObj'],
  components: {
    colorSet,
    textSet,
  },
  data () {
    return {
      curVal: '',
      curStyle: {},
      fontSizeList: [
        8,
        9,
        10,
        12,
        14,
        16,
        20,
        24,
        28,
        32,
        36,
        40,
        48,
        56,
        64,
        72,
      ],
    };
  },
  computed: {
    setBgObj () {
      let obj = {};
      return obj;
    },
    setStyleObj () {
      let obj = {};
      obj.display = this.curStyle.showFlag ? 'block' : 'none';
      let { background, opacity } = this.curStyle.colorStyle;
      obj.color = hexToRgba(background, opacity); // this.curStyle.colorStyle.background;
      obj.fontSize = this.curStyle.fontSize + 'px';
      obj.textAlign = this.curStyle.textAlign;
      let { top, left, right, bottom } = this.curStyle.padding || {};
      obj.padding = `${top}px ${right}px ${bottom}px ${left}px`;
      let { fontStyle } = this.curStyle;
      if (fontStyle) {
        let pare = {
          bold: 'fontWeight',
          underline: 'textDecoration',
          italic: 'fontStyle',
        };
        for (const i of fontStyle) {
          obj[pare[i]] = i;
        }
      }
      obj.lineHeight = setLineHeight(this.curStyle.fontSize);
      return obj;
    },
  },
  watch: {
    styleObj: {
      handler (val) {
        if (val) {
          this.curVal = val.value;
          this.curStyle = JSON.parse(JSON.stringify(val.title));
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    sureHandler () {
      let obj = {
        title: this.curStyle,
        value: this.curVal,
      };
      this.$emit('sure', obj);
    },
    cancelHandler () {
      this.$emit('close');
    },
    changeFontSize (item) {
      this.$set(this.curStyle, 'fontSize', item.bgSelected);
    },
    changeAttr (attr, item) {
      this.$set(this.curStyle, attr, item);
    },
    fontStyleProcess (val) {
      this.curStyle.fontStyle = this.curStyle.fontStyle || [];
      let idx = this.curStyle.fontStyle.indexOf(val);
      if (idx > -1) {
        this.curStyle.fontStyle.splice(idx, 1);
      } else {
        this.curStyle.fontStyle.push(val);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.edit-text {
  line-height: 0;
  font-style: normal;
  font-weight: normal;
  text-decoration: none;
  .header {
    width: 100%;
    height: 36px;
    background: #f9f9f9;
    border-radius: 4px;
    display: flex;
    align-items: center;
    /deep/ .color-module {
      margin-bottom: 0;
    }
    /deep/ .color-module .title {
      min-width: 0;
      margin-left: 8px;
    }
    /deep/ .text-module {
      margin-bottom: 0;
      margin-right: 16px;
    }
  }
  .content {
    margin-top: 10px;
    padding: 8px;
    height: 240px;
    width: 100%;
    border: 1px solid #dedede;
    box-sizing: border-box;
    border-radius: 4px;
    textarea {
      padding: 8px;
      height: 100%;
      width: 100%;
      border-radius: 4px;
      border: none;
      resize: none;
      outline: none;
      &::-webkit-input-placeholder {
        color: #cccccc;
      }
    }
  }
  .bottom {
    margin-top: 16px;
    display: flex;
    justify-content: center;
    .btn {
      height: 32px;
      line-height: 32px;
      width: 80px;
      text-align: center;
      background: #a4a4a4;
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
    }
    .sure-btn {
      margin-right: 80px;
      background: #4284f5;
    }
  }
}
/deep/ .el-select.bg-select{
  .el-select-dropdown{
    position: absolute !important;
    left: 0 !important;
    top: 32px !important;
  }
}
</style>
<style lang="scss">
.text-edit {
  .el-dialog {
    height: 392px;
    padding: 8px 16px 0px 16px;
    padding-bottom: 0;
  }
  .el-dialog__header {
    padding: 0;
    margin-bottom: 4px;
    text-align: left;
    .el-dialog__headerbtn {
      top: 10px;
    }
    .el-dialog__close {
      font-weight: bold;
    }
  }
  .el-dialog__title {
    font-size: 14px;
    font-weight: bold;
  }
  .el-dialog__body {
    padding: 0px;
  }
}
</style>
