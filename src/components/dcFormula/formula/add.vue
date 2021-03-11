<template>
  <div class="add-formula-box">
    <div class="add-formula-content">
      <div class="edit-content-box">
        <div class="formula-name-box">
          <span>{{ $t('message.formulaName') }}</span>
          <input
            ref="inputRefs"
            type="text"
            v-model="formulaName"
            placeholder="将以此名称生成新特征"
            :readonly="formulaId ? 'readonly' : false"
            @input="
              formulaName = $event.target.value.replace(
                /\{|\}|\[|\]|\(|\)/g,
                ''
              )
            "
            @blur="blurProcess"
          />
          <span v-if="errorObj.show" class="error-tips">{{
            errorObj.text
          }}</span>
        </div>
        <div class="edit-formula-box">
          <div class="formula-tips" v-if="!formulaId">
            保存后将自动识别运算类型并新增特征
          </div>
          <div class="formula-tips" v-else>
            <span class="formula-type">{{ title.formulaType }}</span
            ><span class="str-type">{{ title.dataType }}</span>
          </div>
          <div
            class="formula-edit-box"
            :class="showPlaceHolder ? 'show-placeholder' : ''"
            placeholder="在此编辑表达式"
          >
            <div
              ref="editor"
              class="formula-edit"
              @paste="pasteProcess"
              contenteditable="true"
            ></div>
            <div
              class="search-list-box"
              v-show="showSearchList && searchList.length > 0"
              ref="searchListRef"
            >
              <div class="fun-list" v-if="tempFunList.length > 0">
                <div class="type-title">函数</div>
                <div
                  class="item"
                  @click="addFunFeature(i)"
                  v-for="(i, index) in tempFunList"
                  :key="index"
                  :title="i.value.substring(0, i.value.length - 2)"
                >
                  <span class="color">{{
                    i.value.substring(0, i.value.length - 2)
                  }}</span
                  >()
                </div>
              </div>
              <div class="feature-list" v-if="tempCatList.length > 0">
                <div class="type-title">特征</div>
                <div
                  class="item"
                  :class="i.type"
                  @click="addFunFeature(i)"
                  v-for="(i, index) in tempCatList"
                  :key="index"
                  :title="i.value"
                >
                  {{ i.value }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="tips-content-box">
        <div class="tips-title">
          <div class="tips-icon-box">
            <icon-svg
              class="icon"
              className="icon-tips"
              icon="#icon-db_alert"
            ></icon-svg>
          </div>
          <div class="tips-name">{{ $t('message.db_action_info') }}</div>
        </div>
        <div class="tips-content">
          <div class="tips-item">
            算式成功创建后，不能改变其运算类型和数据类型。
          </div>
          <div class="error-box">
            <p class="error-tips" v-for="(i, index) in errorList" :key="index">
              {{ i.msg }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="add-btn-group">
      <div class="btn-sure" @click="saveFormula">{{ $t('message.save') }}</div>
      <div class="btn-cancel" @click="cancel">{{ $t('message.cancel') }}</div>
    </div>
  </div>
</template>
<script>
import { delayFunc } from '@/utils/utils';
import { mapState, mapMutations } from 'vuex';
import mix from './mixins/index';
import { getRangeContent } from './utils/index';
import { get, post } from '@/api/server';
export default {
  props: {
    featureListFlag: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [mix],
  data() {
    return {
      formulaName: '',
      formulaCurContent: '',
      formulaText: '',
      showSearchList: false,
      keys: '',
      doing: false,
      errorObj: {
        show: false,
        text: '名称不能为空',
      },
      errorList: [],
      enterFlag: false,
    };
  },
  computed: {
    ...mapState('project', ['locale']),
    ...mapState('formula', ['formulaObj', 'formulaContent', 'formulaId']),
    showPlaceHolder() {
      return this.formulaCurContent.length === 0;
    },
    tempFunList() {
      return this.searchList.filter((i) => i.type === 'fun') || [];
    },
    tempCatList() {
      return this.searchList.filter((i) => i.type !== 'fun') || [];
    },
    title() {
      let item = this.formulaObj;
      return {
        formulaType: this.formulaType[item.formula_type],
        dataType: this.dataType[item.data_type],
      };
    },
  },
  beforeDestroy() {
    this.removeEvent();
  },
  async mounted() {
    this.$nextTick(() => {
      !this.formulaId && this.$refs.inputRefs.focus();
    });
    this.formulaFunList.length === 0 && (await this.fetchFunList());
    this.initEvent();
    this.setString(/\"[^"]*\"/gi);
    this.setOperator(
      /[\S\s]*(\+|-|\*|\/|\|\||\b(AND)\b|\b(OR)\b|\b(NOT)\b|\b(ISNULL)\b|=|==|!=|^(?!span)>|>=|<(?<!span)$|<=|\(\))/gi
    );
    this.setCondition(/IF|CASE|WHEN|ELSE|END|THEN|GROUPBY/gi);
    this.dataObj.string = this.string;
    this.dataObj.condition = this.condition;
    this.initData('fun', this.formulaFunList, 'name');
    this.initData('cat', this.catObjList);
    this.initData('agg', this.numObjList);
    if (this.formulaId) {
      this.enterFlag = true;
      this.detailInitProcess();
    }
  },
  methods: {
    ...mapMutations('formula', [
      'setFormulaId',
      'setFormulaFunList',
      'setEnabled',
      'setString',
      'setOperator',
      'setCondition',
    ]),
    detailInitProcess() {
      this.formulaName = this.formulaObj.formula_name;
      if (!this.formulaContent) {
        this.fetchFormulaDetail(this.formulaId, true);
        return;
      }
      this.formulaText = this.formulaContent;
      this.formulaCurContent = this.retRegStr(this.formulaContent);
      this.$nextTick(() => {
        this.$refs.editor.focus();
        this.insertHtmlAtCaret(this.formulaCurContent, true, true);
      });
    },
    initEvent() {
      this.$refs.editor.addEventListener('input', this.inputProcess, false);
      this.$refs.editor.addEventListener('focus', this.inputProcess, false);
      this.$refs.editor.addEventListener(
        'compositionstart',
        this.compositionstart,
        false
      );
      this.$refs.editor.addEventListener(
        'compositionend',
        this.compositionend,
        false
      );
    },
    removeEvent() {
      this.$refs.editor.removeEventListener('input', this.inputProcess, false);
      this.$refs.editor.removeEventListener('focus', this.inputProcess, false);
      this.$refs.editor.removeEventListener(
        'compositionstart',
        this.compositionstart,
        false
      );
      this.$refs.editor.removeEventListener(
        'compositionend',
        this.compositionend,
        false
      );
    },
    compositionstart() {
      this.doing = true;
    },
    compositionend() {
      this.doing = false;
    },
    inputProcess: delayFunc(function(e) {
      if (this.enterFlag) {
        this.enterFlag = false;
        return;
      }
      if (this.doing) {
        return;
      }
      let { getContent, getCaretPos } = getRangeContent(this.$refs.editor);
      let content = getContent('setEnd', 'endContainer', 'endOffset');
      let contentRest = getContent('setStart', 'startContainer', 'startOffset');
      let { res, textStr } = this.getDomStyleValue(content);
      let { res: resRest, textStr: textStrRest } = this.getDomStyleValue(
        contentRest
      );
      if (!res) {
        this.showSearchList = false;
      } else {
        let idx = res.lastIndexOf('</a>');
        let keys = res.substring(idx + 4, res.length + 1);
        if (idx === -1 || keys) {
          // 搜索查询
          if (idx === -1) {
            keys = res;
          }
          this.fetchSearchList(keys);
          if (this.searchList.length > 0 && keys.trim()) {
            let { x: left, y: top } = getCaretPos();
            let editor = this.$refs.editor.getBoundingClientRect();
            top = top - editor.top + 30;
            left = left - editor.left + 10;

            this.$refs.searchListRef.style.top = top + 'px';
            this.$refs.searchListRef.style.left = left + 'px';
            this.showSearchList = true;
          } else {
            this.showSearchList = false;
          }
        } else if (!keys) {
          this.showSearchList = false;
        }
        this.insertHtmlAtCaret(res, true, true);
        if (resRest && resRest !== undefined) {
          this.insertHtmlAtCaret(resRest);
        }
        this.formulaCurContent = res + resRest;
        this.formulaText = textStr + textStrRest;
      }
    }, 50),
    fetchSearchList(keys) {
      // 针对函数里面做过滤
      keys = this.funRegProcess(keys);
      let operator =
        this.operator ||
        /[\S\s]*(\+|-|\*|\/|\|\||\b(AND)\b|\b(OR)\b|\b(NOT)\b|\b(ISNULL)\b|=|==|!=|^(?!span)>|>=|<(?<!span)$|<=|\(\))/gi;

      this.keys = keys
        .trim()
        .replace(/<br>/g, '')
        .replace(this.operator, '')
        .replace(/\"/g, '')
        .replace(/\s+/g, '')
        .replace(/:/g, '');
      if (!this.keys) {
        this.searchList = [];
        return;
      }
      this.searchList = this.allSearchList.length
        ? this.allSearchList.filter((i) => {
            return i.value.toUpperCase().indexOf(this.keys.toUpperCase()) > -1;
          })
        : [];
    },
    funRegProcess(keys) {
      let funReg = this.funList
        .join('|')
        .replace(/\(/gi, '\\(.*')
        .replace(/\)/gi, '');
      funReg = new RegExp(funReg, 'gi');
      return keys.replace(funReg, function($0) {
        let index = keys.lastIndexOf('(');
        return keys.substring(index + 1);
      });
    },
    addFunFeature(item) {
      let { getContent } = getRangeContent(this.$refs.editor);
      let len = this.keys.length;
      let { res, textStr } = this.getDomStyleValue(
        getContent('setEnd', 'endContainer', 'endOffset')
      );
      let index = res.lastIndexOf('<br>');
      if (res.slice(-4) !== '</a>') {
        if (!(index > -1 && index === res.length - 1)) {
          res = res.substring(0, res.length - len);
          textStr = textStr.substring(0, textStr.length - len);
        }
      }

      res = this.funFeatureRegProcess(res, item.type, item.value);
      // eslint-disable-next-line no-unused-vars
      let { res: resRest, textStr: textStrRest } = this.getDomStyleValue(
        getContent('setStart', 'startContainer', 'startOffset')
      );
      this.insertHtmlAtCaret(res, true, true);
      this.insertHtmlAtCaret(resRest);
      this.showSearchList = false;
      this.formulaCurContent = res + resRest;
      this.formulaText = textStr + item.value; // textStrRest;
    },
    pasteProcess(e) {
      e.preventDefault();
      let text = '';
      if (window.clipboardData && window.clipboardData.setData) {
        text = window.clipboardData.getData('text');
      } else {
        text = (e.originalEvent || e).clipboardData.getData('text/plain') || '';
      }
      document.execCommand('insertHTML', false, text);
      this.inputProcess();
    },
    blurProcess() {
      this.judgeForm();
    },
    judgeForm(contentNeed) {
      if (!this.formulaName || this.formulaName.trim().length === 0) {
        this.errorObj.show = true;
        this.errorObj.text = '*名字不能为空';
        return false;
      }
      let reg = /\.|\:|\*|\-|\[|\]|\(|\)/g;
      if (reg.test(this.formulaName)) {
        this.errorObj.show = true;
        this.errorObj.text = '*名字不能包含.:*-[]()';
        return false;
      }
      if (this.formulaName.length > 64) {
        this.errorObj.show = true;
        this.errorObj.text = '*formula名字不能超过64字符';
        return false;
      }
      this.errorObj.show = false;
      if (contentNeed && !this.formulaText) {
        return false;
      }
      return true;
    },
    async saveFormula() {
      let param = {
        project_id: this.projectId,
        formula: this.formulaText,
      };
      let url = 'createFormula';
      if (this.formulaId) {
        param.formula_id = this.formulaId;
        url = 'editFormula';
      } else {
        param.formula_name = this.formulaName;
      }
      if (this.judgeForm()) {
        let res = await post(url, param);
        if (res && res.code === 0 && !res.error_list) {
          // this.resetFormula();
          this.errorList = [];
          let dataType = this.formulaId
            ? this.dataType[this.formulaObj.data_type]
            : this.dataType[res.data_type];
          this.msgBoxAfterSave(dataType, res.reference_count);
        } else if (res.error_list) {
          let list = res.error_list;
          this.errorList = [];
          list.map((i) => {
            i.msg = this.getPosition(i.pos) + ':' + i.error_msg;
            this.errorList.push(i);
          });
        } else {
          this.errorObj.show = true;
          this.errorObj.text =
            '*' + (this.locale === 'zh' ? res.cnMsg : res.enMsg);
          return false;
          // this.$alert({ type: 'error', title: this.$t('message.edit'), content: res.msg });
        }
      }
    },
    getPosition(pos) {
      return this.formulaText.slice(0, pos);
    },
    msgBoxAfterSave(dataType, referenceCount) {
      let type = this.formulaId ? '更新' : '新增';
      let content =
        '保存成功。算式结果为' + dataType + '。已' + type + '至特征列表。';
      if (referenceCount > 0) {
        content +=
          '检测到该字段被其它计算字段引用，请对引用字段进行重新保存，确保数据引用正确';
      }
      this.setEnabled(true);
      this.showMessageBox({
        title: this.formulaId
          ? this.$t('message.formulaEditText')
          : this.$t('message.formulaAddText'),
        content: content, // '保存成功。算式结果为' + dataType + '。已' + type + '至特征列表。', // this.$t('message.formulaAddSuccessText'),
        sureText: this.$t('message.formulaToDashboard'),
        cancelText: this.$t('message.formulaToList'),
        sureCb: () => {
          this.resetFormula();
          this.$emit('on-formula-change', false);
          // 只有新增才重新刷新特征
          this.$emit('on-fetch-feature');
          this.hideMessageBox();
          this.setEnabled(false);
        },
        cancelCb: () => {
          this.resetFormula();
          this.$emit('update:comName', 'initCom');
          this.$emit('on-fetch-formula');
          this.$emit('on-fetch-feature');
          this.hideMessageBox();
          this.setEnabled(false);
        },
      });
    },
    msgBoxAfterCancel() {
      this.setEnabled(true);
      this.showMessageBox({
        title: this.$t('message.cancelEdit'),
        content: this.$t('message.formulaConfirmBoxText'),
        sureText: this.$t('message.confirm'),
        cancelText: this.$t('message.cancel'),
        sureCb: () => {
          this.resetFormula();
          if (this.featureListFlag) {
            this.$emit('on-formula-change', false);
          } else {
            this.sure();
          }
          this.hideMessageBox();
          this.setEnabled(false);
        },
        cancelCb: () => {
          // this.resetFormula();
          this.hideMessageBox();
          this.setEnabled(false);
        },
      });
    },
    cancel() {
      this.errorObj.show = false;
      if (this.formulaId) {
        this.msgBoxAfterCancel();
        return;
      }
      this.resetFormula();
      // this.$emit('on-formula-change', false);
      this.$emit('update:comName', 'initCom');
    },
    // 取消编辑二次确认确定
    sure() {
      this.resetFormula();
      this.$emit('update:comName', 'initCom');
      // this.$emit('on-formula-change', true);
    },
    async fetchFunList() {
      let res = await get('fetchFunList', {});
      if (res && res.code === 0) {
        let list = res.func_list || [];
        this.setFormulaFunList(list);
      }
    },
  },
};
</script>
<style lang="scss">
@import './style/index';
</style>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.add-formula-box {
  width: 100%;
  height: 100%;
  .add-formula-content {
    display: flex;
    background: #e7ebf2;
    border-radius: 4px;
    height: 480px;
    margin: 20px auto;
    padding: 8px;
    justify-content: space-between;
    .edit-content-box {
      flex: 1;
      margin-right: 8px;
      .formula-name-box {
        input {
          width: 320px;
          height: 40px;
          padding: 9px;
          background: #ffffff;
          border: 1px solid #dedede;
          border-radius: 4px;
          outline: none;
          margin-left: 40px;
        }
      }
      .edit-formula-box {
        height: 418px;
        margin-top: 8px;
        background: #ffffff;
        border-radius: 4px;
        padding: 10px 8px;
        .formula-tips {
          padding-bottom: 8px;
          color: #666666;
          border-bottom: 1px solid #e7ebf2;
          .formula-type {
            font-size: 16px;
            color: #052b71;
            font-weight: bold;
          }
          .str-type {
            font-size: 14px;
            color: #666666;
            font-weight: bold;
            margin-left: 16px;
          }
        }
        .formula-edit-box {
          position: relative;
          width: 740px;
          height: 376px;
          padding: 8px;

          .search-list-box {
            position: absolute;
            width: 240px;
            height: 270px;
            background: #ffffff;
            border-radius: 4px;
            box-shadow: 0 6px 14px 0 rgba(0, 0, 0, 0.1);
            z-index: 3;
            top: 30px;
            overflow-y: auto;
            @include scroll;
            padding: 8px;
            .type-title {
              color: #a4a4a4;
            }
            .item {
              height: 36px;
              line-height: 36px;
              cursor: pointer;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              max-width: 210px;
            }
            .fun-list {
              .color {
                color: #052b71;
              }
            }
            .feature-list {
              .item.cat {
                font-weight: bold;
                color: #03b98c;
              }
              .item.agg {
                font-weight: bold;
                color: #4284f5;
              }
            }
          }
          .formula-edit {
            width: 100%;
            height: 100%;
            overflow-y: auto;
            @include scroll;
            outline: none;
          }
        }
        .formula-edit-box.show-placeholder::before {
          content: attr(placeholder);
          position: absolute;
          top: 4px;
          left: 8px;
          color: #cccccc;
          pointer-events: none;
        }
      }
    }
    .tips-content-box {
      width: 264px;
      .tips-title {
        display: flex;
        align-items: center;
        padding: 9px 0;
        .tips-icon-box {
          width: 30px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          .icon-tips {
            color: #4284f5;
          }
        }
        .tips-name {
          font-size: 16px;
          color: #424242;
          font-weight: bold;
        }
      }
      .tips-content {
        font-size: 16px;
        color: #424242;
        height: 420px;
        .error-box {
          height: calc(100% - 45px);
          overflow-y: auto;
          @include scroll;
        }
      }
    }
  }
  .add-btn-group {
    display: flex;
    justify-content: center;
    & > div {
      padding: 8px;
      margin: 0 20px;
      font-size: 16px;
      cursor: pointer;
    }
    .btn-sure {
      color: #4284f5;
    }
    .btn-cancel {
      color: #a4a4a4;
    }
  }
  .error-tips {
    color: #f5282d;
    margin-left: 8px;
  }
}
</style>
