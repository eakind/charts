import {
  ChainItem
} from '../utils/ChainFactory';
import {
  get
} from '@/api/server';
import {
  mapState,
  mapMutations
} from 'vuex';
export default {
  data () {
    return {
      dataObj: {
        string: [],
        condition: '',
        fun: [],
        others: []
      },
      funList: [],
      catList: [],
      aggList: [],
      allSearchList: [],
      searchList: [],
    };
  },
  computed: {
    ...mapState({
      catObjList: state => state.drawingboard.catList,
      numObjList: state => state.drawingboard.aggrList,
    }),
    ...mapState('project', ['projectId']),
    ...mapState('formula', ['formulaType', 'dataType']),
    ...mapState('formula', ['operator', 'condition', 'string', 'formulaFunList']),
  },
  methods: {
    ...mapMutations('formula', ['setFormulaContent', 'setFormulaId', 'setFormulaObj']),
    // 重置
    resetFormula () {
      this.setFormulaId('');
      this.setFormulaContent('');
      this.setFormulaObj({});
    },
    async fetchFormulaDetail (formulaId, renderFlag) {
      let param = {
        project_id: this.projectId,
        formula_id: formulaId
      };
      let res = await get('formulaDetail', param);
      if (res && res.code === 0) {
        let {
          formula
        } = res;
        this.formulaText = formula;
        this.formulaCurContent = this.retRegStr(formula);
        if (renderFlag) {
          this.$refs.editor.focus();
          this.insertHtmlAtCaret(this.formulaCurContent, true, true);
        }
      }
    },
    initData (type, val, prop) {
      let list = [];
      let searchList = [];
      if (!prop) {
        prop = 'feature_name';
      }
      val=val||[]
      val.map(i => {
        let value = type === 'fun' ? i[prop] + '()' : '[' + i[prop] + ']';
        list.push(value);
        searchList.push({
          type: type,
          value: value
        });
      });
      this[type + 'List'] = list;
      this.allSearchList.push(...searchList);
      this.searchList.push(...searchList);
      if (type === 'fun') {
        this.dataObj.fun.push(...list);
      } else {
        this.dataObj.others.push(...list);
      }
    },
    getDomStyleValue (ele) {
      let res = '';
      let textStr = '';

      function styleValueProcess (ele) {
        Array.from(ele.childNodes).forEach(item => {
          if (item.nodeName === '#text') {
            textStr += item.nodeValue; // 纯文本
          } else if (item.nodeName === 'SPAN') {
            // 递归
            styleValueProcess(item);
          } else if (item.nodeName === 'DIV') {
            textStr += '<br>';
            styleValueProcess(item);
          } else if (item.nodeName === 'BR') {
            textStr += '<br>';
          } else if (item.nodeName === 'A') {
            styleValueProcess(item);
          } else if (item.nodeName === 'FONT') {
            styleValueProcess(item);
          } else if (item.nodeName === 'B') {
            styleValueProcess(item);
          }
        });
      }
      styleValueProcess(ele);
      res = this.retRegStr(textStr);
      return {
        res,
        textStr
      };
    },
    // 根据数组生成正则
    geneRegByArray (list, key) {
      let str = list.join('|').replace(/\+/g, '\\+').replace(/\*/g, '\\*').replace(/\[/g, '\\[').replace(/\]/g, '\\]').replace(/\)/g, '\\)+').replace(/\(/g, '\\([^\)]*');
      if (key === 'others') {
        return new RegExp(str, 'g');
      } else {
        return new RegExp(str, 'gi');
      }
    },
    //  获取添加样式的字符串
    retRegStr (str) {
      let that = this;
      let regObj = this.dataObj;
      for (const key in regObj) {
        if (regObj.hasOwnProperty(key)) {
          let reg = regObj[key];
          if (Object.prototype.toString.call(reg) === '[object Array]') {
            reg = this.geneRegByArray(reg, key);
          }
          str = retRegStrProcess(str, reg, key);
        }
      }

      function retRegStrProcess (str, reg, key) {
        return str.replace(reg, function ($0) {
          if (key === 'others' || key === 'fun') {
            let val = $0;
            var chainCat = new ChainItem(getCatKey);
            var chainAgg = new ChainItem(getAggKey);
            var chainFun = new ChainItem(getFunKey);
            chainFun.setNext(chainCat).setNext(chainAgg);
            let tempKey = chainFun.start($0);
            if (!tempKey) {
              return $0;
            }
            // 获取key
            if (tempKey === 'fun') {
              let start = val.indexOf('(');
              let end = val.lastIndexOf(')');
              let name = val.slice(start + 1, end);
              let curStr = '';
              if (name) {
                curStr += retRegStrProcess(name, reg, key);
              }
              val = val.substring(0, start);
              return `<a class="regular-color"><span class="${tempKey}-color">${val}</span><span>(${curStr})</span></a>`;
            }
            return `<a class="regular-color"><span class="${tempKey}-color">${val}</span></a>`;
          } else if (key === 'string') {
            let val = $0;
            val = val.substring(1, val.length - 1);
            return `<a class="regular-color"><span class="${key}-color">"</span><span class="${key}-color">${val}</span><span class="${key}-color">"</span></a>`;
          }
          return `<a class="regular-color"><span class="${key}-color">${$0}</span></a>`;
        });
      }

      function getCatKey (item) {
        if (that.catList.filter(i => i.toUpperCase() === item.toUpperCase()).length > 0) {
          return 'cat';
        } else {
          return this.toNext(item);
        }
      }

      function getAggKey (item) {
        if (that.aggList.filter(i => i.toUpperCase() === item.toUpperCase()).length > 0) {
          return 'agg';
        }
      }

      function getFunKey (item) {
        let start = item.indexOf('(');
        if (start > -1) {
          item = item.substring(0, start) + '()';
        }
        if (that.funList.filter(i => i.toUpperCase() === item.toUpperCase()).length > 0) {
          return 'fun';
        } else {
          return this.toNext(item);
        }
      }
      return str;
    },
    funFeatureRegProcess (curStr, type, inputStr) {
      if (type === 'fun') {
        inputStr = inputStr.substring(0, inputStr.length - 2);
        return `<a class="regular-color">${curStr}<span class="${type}-color">${inputStr}</span><span>()</span></a>`;
      }
      return `<a class="regular-color">${curStr}<span class="${type}-color">${inputStr}</span></a>`;
    },
    // 往光标位置插入HTML片段
    insertHtmlAtCaret (html, clearHtml, resetCursorAt) {
      var sel, range, frag;
      if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
          range = sel.getRangeAt(0);
          range.extractContents();
          if (clearHtml) {
            this.$refs.editor.innerHTML = '';
          }

          var el = document.createElement('span');
          let curHtml = html;
          el.innerHTML = curHtml;
          frag = document.createDocumentFragment();
          var node;
          var lastNode;
          while ((node = el.firstChild)) {
            lastNode = frag.appendChild(node);
          }
          range.insertNode(frag);
          if (lastNode) {
            range = range.cloneRange();
            if (resetCursorAt) {
              range.setStartAfter(lastNode);
            }
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }
      }
    },

  }
};
