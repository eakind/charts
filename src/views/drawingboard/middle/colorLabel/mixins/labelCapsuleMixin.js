import { isEmpty } from 'lodash';
import { mapMutations, mapState } from 'vuex';
import { setAggrName } from '@/utils/draw/draw.js';
export const labelCapsuleMixin = {
  data () {
    return {
      isShowLabelStyle: false,
      labelStyleList: [],
      styleList: [],
      timer: null
    };
  },
  computed: {
    ...mapState('drawingboard', ['currentCanvasDetail', 'rowList', 'columnList', 'canvasType']),
    tempList () {
      if (this.canvasType === 'bar-rotated') {
        return JSON.parse(JSON.stringify(this.columnList));
      }
      return JSON.parse(JSON.stringify(this.rowList));
    }
  },
  watch: {
    tempList: {
      handler (list) {
        if (!list.length) return;
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        this.timer = setTimeout(() => {
          clearTimeout(this.timer);
          this.timer = null;
          this.initLabelStyle(list);
          this.changeLabelStyle(this.labelStyleList, true);
        }, 30);
      },
      deep: true
    }
  },
  beforeDestroy () {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  },
  methods: {
    ...mapMutations('drawingboard', ['setRowList', 'setColumnList']),
    getObj (obj) {
      return {
        index: obj.index,
        children: obj.children,
        dir: obj.dir,
        labelIndex: obj.labelIndex
      };
    },
    setTempList (list) {
      if (this.canvasType === 'bar-rotated') {
        this.setColumnList(list);
      } else {
        this.setRowList(list);
      }
    },
    removeCapsule (num) {
      let { index, children, dir, labelIndex } = this.getObj(this.list[num]);
      if (dir) {
        let labels = this.tempList[index][dir][children].labels;
        labels.splice(labelIndex, 1);
        if (isEmpty(labels)) {
          delete this.tempList[index][dir][children].labels;
        }
      } else {
        let labels = this.tempList[index].labels;
        labels.splice(labelIndex, 1);
        if (isEmpty(labels)) {
          delete this.tempList[index].labels;
        }
      }
      this.removeLabelFormat(num);
      this.setTempList(this.tempList);
    },
    removeLabelFormat (index) {
      this.styleList.splice(index, 1);
      this.labelStyleList.splice(index, 1);
      this.changeLabelStyle(this.labelStyleList);
    },
    changeAggr (legend, probability, num) {
      let { index, children, dir, labelIndex } = this.getObj(this.list[num]);
      if (dir) {
        this.tempList[index][dir][children].labels[labelIndex].legend = legend;
        this.tempList[index][dir][children].labels[labelIndex].probability = probability;
      } else {
        this.tempList[index].labels[labelIndex].legend = legend;
        this.tempList[index].labels[labelIndex].probability = probability;
      }
      this.setTempList(this.tempList);
    },
    changeRate (rate, num) {
      let { index, children, dir, labelIndex } = this.getObj(this.list[num]);
      if (dir) {
        this.tempList[index][dir][children].labels[labelIndex].rate = rate;
      } else {
        this.tempList[index].labels[labelIndex].rate = rate;
      }
      this.setTempList(this.tempList);
    },
    removeCount (num) {
      let { index, children, dir, labelIndex } = this.getObj(this.list[num]);
      if (dir) {
        delete this.tempList[index][dir][children].labels[labelIndex].rate;
      } else {
        delete this.tempList[index].labels[labelIndex].rate;
      }
      this.setTempList(this.tempList);
    },
    LabelStyleHide () {
      this.isShowLabelStyle = false;
    },
    labelStyleShow () {
      console.log('2222222');
      this.isShowLabelStyle = true;
      this.initLabelStyle(this.tempList);
    },
    getFormatAndText (name, index, type) {
      let list = this.currentCanvasDetail.css[type] || [];
      for (let i = 0; i < list.length; i++) {
        if (name === list[i].name) {
          let obj = list[i].list[index];
          return obj ? obj.format : null;
        }
      }
      return null;
    },
    setFormat (name, index) {
      let formatObj = this.getFormatAndText(name, index, 'labelList');
      return formatObj || {
        check: false,
        decimal: '',
        isPercent: false,
        negative: -1,
        prefix: '',
        selectFormat: -1,
        setFlag: true,
        suffix: '',
        unit: '',
        useThousandMark: true,
        zone: '¥ 人民币'
      };
    },
    setText (name, index) {
      let textObj = this.getFormatAndText(name, index, 'textSettings');
      let titleCss = this.currentCanvasDetail.css.titleCss;
      return textObj || {
        align: 'left',
        check: false,
        decoration: '',
        fontColor: titleCss ? titleCss.color : '#6B6B6B',
        fontSize: 12,
        fontStyle: 'normal',
        letterSpacing: '0',
        lineHeight: '24',
        setFlag: true
      };
    },
    setObj (parentName, listObj, index, childIndex, listIndex) {
      const name = `${index}-${childIndex}`;
      return {
        display: 'auto',
        name: name,
        format: this.setFormat(name, listIndex),
        key: `${setAggrName(listObj)}`,
        text: this.setText(name, listIndex),
        title: `${listObj.feature_name}`,
        type: listObj.type === 'NUM' ? 'linear' : ''
      };
    },
    setLabelList (list, name, index, childIndex) {
      for (let i = 0; i < list.length; i++) {
        if (!list[i]) {
          continue;
        }
        this.styleList.push(this.setObj(name, list[i], index, childIndex, i));
      }
    },
    initLabelStyle (list) {
      this.styleList = [];
      this.labelStyleList = [];
      for (let i = 0; i < list.length; i++) {
        if (list[i].left || list[i].right) {
          let left = list[i].left || [];
          let right = list[i].right || [];
          let childIndex = 0;
          for (let j = 0; j < left.length; j++) {
            this.setLabelList(left[j].labels || [], left[j].feature_name, i, childIndex);
            childIndex++;
          }
          for (let j = 0; j < right.length; j++) {
            this.setLabelList(right[j].labels || [], right[j].feature_name, i, childIndex);
            childIndex++;
          }
        } else {
          this.setLabelList(list[i].labels || [], list[i].feature_name, i, 0);
        }
      }
      let arr = [];
      for (let i = 0; i < this.styleList.length; i++) {
        if (this.uniqueLabelStyle(this.styleList[i], arr)) {
          arr.push(this.styleList[i]);
        }
      }
      this.labelStyleList = arr;
    },
    uniqueLabelStyle (obj, list) {
      for (let i = 0; i < list.length; i++) {
        if (obj.key === list[i].key) {
          return false;
        }
      }
      return true;
    },
    hasLabel (list, name) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].name === name) {
          return i;
        }
      }
      return -1;
    },
    setStyleList (list) {
      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < this.styleList.length; j++) {
          if (list[i].key === this.styleList[j].key) {
            this.$set(this.styleList[j], 'format', list[i].format);
            this.$set(this.styleList[j], 'text', list[i].text);
          }
        }
      }
      return this.styleList;
    },
    changeLabelStyle (list, flag) {
      let labelList = [];
      let textSettings = [];
      list = this.setStyleList(list);
      for (let i = 0; i < list.length; i++) {
        let index = this.hasLabel(labelList, list[i].name);
        if (index > -1) {
          labelList[index].list.push({
            format: list[i].format,
            key: list[i].key
          });
        } else {
          labelList.push({
            list: [{
              format: list[i].format,
              key: list[i].key
            }],
            name: list[i].name,
            key: list[i].key
          });
        }
        let textIndex = this.hasLabel(textSettings, list[i].name);
        if (textIndex > -1) {
          textSettings[textIndex].list.push({
            format: list[i].text,
            key: list[i].key
          });
        } else {
          textSettings.push({
            list: [{
              format: list[i].text,
              key: list[i].key
            }],
            name: list[i].name,
            key: list[i].key
          });
        }
      }
      this.$emit('change-style', labelList, textSettings, flag);
    }
  }
};
