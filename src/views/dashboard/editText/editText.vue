<template>
  <div class="edit-text">
    <el-dialog title="编辑文本" width="768px" :visible='editFlag'
        :close-on-click-modal="false" :show-close="false" @close="editFlag=false;">
        <div class="header">
          <color-set
            title="大小"
            :hasBorder="true"
            :list="fontSizeList"
            :bgSelected="title.fontSize"
            :showColor="false"
            @changeColor="changeFontSize"
          ></color-set>
          <text-set type="font" title="字形" :val.sync="title.fontStyle"></text-set>
          <text-set type="align" title="对齐" :val.sync="title.textAlign"></text-set>
          <color-set
            title="颜色"
            :showSelectBox="false"
            :styleObj="title.colorStyle"
            :bgSelected="title.colorStyle.bgSelected"
            @changeColor="changeFontColor('title', $event)"
          ></color-set>
        </div>
        <div class="content">
          <textarea v-model="textContent" placeholder="点此输入文字"></textarea>
        </div>
        <div class="bottom">
          <div class="sure-btn btn" @click="sureHandler">确定</div>
          <div class="btn" @click="cancelHandler">取消</div>
        </div>
      </el-dialog>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import colorSet from '../left/styleSetting/moduleSets/color.vue';
import textSet from '../left/styleSetting/moduleSets/text.vue';
import textMixins from '../left/styleSetting/mixins/text.js';
import indexMixins from '../left/styleSetting/mixins/index.js';
export default {
  data () {
    return {
      textContent: '',
      oldVlaue: ''
    };
  },
  components: {
    colorSet,
    textSet
  },
  props: {
    editFlag: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    textEditObj: {
      handler (list) {
        this.init();
        if (list) {
          this.textContent = list.editContent;
        };
      },
      deep: true,
      immediate: true
    },
    'title.textAlign' (val) {
      this.title.textAlign = val;
    },
    'title.fontStyle' (val) {
      this.title.fontStyle = val;
    }
  },
  computed: {
    ...mapState('dashboard', ['textEditObj']),
  },
  mixins: [textMixins, indexMixins],
  methods: {
    ...mapMutations('dashboard', ['setTextEditObj']),
    init () {
      if (!this.textEditObj.styleObj) {
        this.emitSetCss('title', this.title);
        return;
      }
      if (!this.textEditObj.styleObj.title) {
        this.emitSetCss('title', this.title);
      }
      this.title = JSON.parse(JSON.stringify(this.textEditObj.styleObj.title));
    },
    sureHandler () {
      this.emitSetCss('value', this.textContent);
      this.emitSetCss('title', this.title);
      this.setTextEditObj({
        isTextEdit: false,
        editContent: this.textContent
      });
    },
    cancelHandler () {
      this.setTextEditObj({
        isTextEdit: false,
        editContent: this.textContent
      });
    },
    changeFontSize (item) {
      this.$set(this.title, 'fontSize', item.bgSelected);
    },
    changeFontColor (type, item) {
      this.$set(this[type], 'colorStyle', item);
    }
  }
};
</script>
<style lang="scss" scoped>
.edit-text {
  color: #666666;
  .header {
    width: 100%;
    height: 36px;
    background: #F9F9F9;
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
    height: 240px;
    width: 100%;
    border: 1px solid #DEDEDE;
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
        color: #CCCCCC;
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
      background: #A4A4A4;
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
    }
    .sure-btn {
      margin-right: 80px;
      background: #4284F5;
    }
  }
}
</style>
<style lang="scss">
.edit-text {
  .el-dialog {
    height: 392px;
    padding: 8px 16px 0px 16px;
    padding-bottom: 0;
  }
  .el-dialog__header {
    padding: 0;
    margin-bottom: 4px;
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
