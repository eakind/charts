import { isTarget, getFeatureObj, setList, setColorListKey } from '@/utils/utils';
import { mapState, mapMutations } from 'vuex';
import rules from '@/utils/rules.js';
import { isEmpty } from 'lodash';
export const dragFeature = {
  data () {
    return {
      funEventPareDefine: {
        columnCapsuleCombinedRight: {
          fun: this.columnCapsuleCombinedRightProcess,
          eventName: '',
          type: 'column',
          listName: 'columnList',
        },
        columnCapsuleCombinedLeft: {
          fun: this.columnCapsuleCombinedLeftProcess,
          type: 'column',
          listName: 'columnList',
        },
        rowCapsuleCombinedRight: {
          fun: this.rowCapsuleCombinedRightProcess,
          eventName: '',
          type: 'row',
          listName: 'rowList',
        },
        rowCapsuleCombinedLeft: {
          fun: this.rowCapsuleCombinedLeftProcess,
          type: 'row',
          listName: 'rowList',
        },
        rowLeftCapsuleReplace: {
          fun: this.rowLeftCapsuleReplaceProcess,
          type: 'row',
          listName: 'rowList',
        },
        rowRightCapsuleReplace: {
          fun: this.rowRightCapsuleReplaceProcess,
          type: 'row',
          listName: 'rowList',
        },
        rowCapsuleReplace: {
          fun: this.rowColumnReplaceProcess,
          eventName: 'swapRowFeature',
          type: 'row',
          listName: 'rowList',
        },
        rowGroupCapsule: {
          fun: this.rowGroupCapsule,
          eventName: '',
          type: 'row',
          listName: 'rowList',
        },
        columnGroupCapsule: {
          fun: this.columnGroupCapsule,
          eventName: '',
          type: 'column',
          listName: 'columnList',
        },
        columnCapsuleReplace: {
          fun: this.rowColumnReplaceProcess,
          eventName: 'swapColFeature',
          type: 'column',
          listName: 'columnList',
        },
        columnLeftCapsuleReplace: {
          fun: this.columnLeftCapsuleReplaceProcess,
          type: 'row',
          listName: 'rowList',
        },
        columnRightCapsuleReplace: {
          fun: this.columnRightCapsuleReplaceProcess,
          type: 'row',
          listName: 'rowList',
        },
        compareCapsuleReplace: {
          fun: this.rowColumnReplaceProcess,
          eventName: 'swapCompareFeature',
        },
        colorCapsuleReplace: {
          fun: this.colorSizeLabelReplaceProcess,
          eventName: 'swapColorFeature',
          listName: 'colorCapsuleList',
          type: 'color',
        },
        sizeCapsuleReplace: {
          fun: this.colorSizeLabelReplaceProcess,
          eventName: 'swapSizeFeature',
          listName: 'sizeCapsuleList',
          type: 'size',
        },
        labelsCapsuleReplace: {
          fun: this.colorSizeLabelReplaceProcess,
          eventName: 'swapLabelFeature',
          listName: 'labelsCapsuleList',
          type: 'labels',
        },
        colorGroupCapsuleReplace: {
          fun: this.colorLabelGroupReplaceProcess,
          eventName: 'swapGroupColorFeature',
        },
        labelsGroupCapsuleReplace: {
          fun: this.colorLabelGroupReplaceProcess,
          eventName: 'swapGroupLabelFeature',
        },
        axisColorCapsule: {
          fun: this.axisColorCapsuleProcess,
          eventName: 'axisColorFeature',
        },
        axisLabelCapsule: {
          fun: this.axisLabelCapsuleProcess,
          eventName: 'axisLabelFeature',
        },
        groupCapsuleProcess: {
          fun: this.groupCapsuleProcess,
          eventName: 'groupCapsule',
        },
      },
      draggingPareDefine: {
        labelsGroupDragging: {
          type: 'labels',
          className: 'labels-group',
        },
        colorGroupDragging: {
          type: 'color',
          className: 'color-group',
        },
        columnDragging: {
          type: 'column',
        },
        rowDragging: {
          type: 'row',
        },
        sizeDragging: {
          type: 'size',
          className: 'icon-size-panel',
        },
        colorDragging: {
          type: 'color',
          className: 'icon-color-panel',
        },
        labelsDragging: {
          type: 'labels',
          className: 'icon-label-panel',
        },
        axisColorDragging: {
          type: 'axisColor',
          className: 'icon-color-panel',
        },
        axisLabelsDragging: {
          type: 'axisLabel',
          className: 'icon-label-panel',
        },
      },
      posObj: {
        left: '500px',
        top: '200px',
      },
      showTip: false,
      txt: '',
    };
  },
  watch: {
    showTip: {
      handler (val) {
        if (val) {
          this.showDraggingTips({ txt: this.txt, pos: this.posObj });
        } else {
          this.hideDraggingTips();
        }
      },
      immediate: true,
    },
    posObj: {
      handler (val) {
        if (this.showTip) {
          this.modifyPosition({ pos: val });
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapState('project', ['legendMap']),
    ...mapState('drawingboard', [
      'loAndLatFlag',
      'columnList',
      'rowList',
      'catList',
      'aggrList',
      'canvasType',
      'barLineList',
      'colorCapsuleList',
      'labelsCapsuleList',
      'sizeCapsuleList',
      'currentCanvasDetail'
    ]),
  },
  methods: {
    ...mapMutations('drawingboard', [
      'setColumnList',
      'setRowList',
      'setBarLineList',
      'setColorCapsuleList',
      'setLabelsCapsuleList',
      'setSizeCapsuleList',
    ]),
    isGroup (target) {
      if (target.nodeType !== 1) return null;
      if (target.className === 'classify-group') {
        return target;
      }
      return this.isGroup(target.parentNode);
    },
    dragging (el, target, clientX, clientY) {
      if (!target) return;
      if (!target.className) return;
      let type = el.getAttribute('property');
      if (type !== 'int') {
        this.bus.$emit('move-feature', clientX, clientY);
      }
      this.posObj.left = Number(clientX) + 25 + 'px';
      this.posObj.top = Number(clientY) + 25 + 'px';

      let draggingName = target.dataset.dragging;
      let draggingObj = this.draggingPareDefine[draggingName];
      if (draggingName && draggingObj) {
        let symbol = target.dataset.symbol;
        if (!symbol) {
          return;
        }
        let name = el.dataset.name;
        let legend = el.dataset.legend;
        let dataType = el.getAttribute('type');
        let ruleCommand = rules({
          target: el,
          capsuleType: type,
          chartType: this.canvasType,
          context: this,
          legend,
        });
        let flagObj = ruleCommand.command(
          draggingObj.type,
          symbol.indexOf('Replace') > -1,
          name,
          dataType
        );
        if (flagObj.showTip) {
          this.showTip = true;
          this.txt = flagObj.txt;
        } else {
          this.showTip = false;
        }
      } else {
        this.showTip = false;
      }
    },
    draggingProcess (el, clientX, clientY) {
      let that = this;
      return function (type, dom) {
        if (!dom) {
          that.bus.$emit('dragMove', el, clientX, clientY, type);
        }
        that.bus.$emit('dragMove', el, clientX, clientY, type, dom);
      };
    },
    stopDrag (el, target) {
      let symbol = target.dataset.symbol;
      if (symbol && symbol.indexOf('Replace') > -1) {
        this.replaceCapsuleProcess(symbol, el, target);
        return;
      }
      typeof this[symbol + 'Process'] === 'function' &&
        this[symbol + 'Process'](el, target);
    },
    // 组合特征
    rowLeftCapsuleReplaceProcess ({ el, target }) {
      this.replaceGroupCapsule(el, target, 'left', this.rowList);
    },
    rowRightCapsuleReplaceProcess ({ el, target }) {
      this.replaceGroupCapsule(el, target, 'right', this.rowList);
    },
    columnLeftCapsuleReplaceProcess ({ el, target }) {
      this.replaceGroupCapsule(el, target, 'left', this.columnList);
    },
    columnRightCapsuleReplaceProcess ({ el, target }) {
      this.replaceGroupCapsule(el, target, 'right', this.columnList);
    },
    replaceGroupCapsule (el, target, type, list) {
      let featureObj = getFeatureObj(el, this.catList, this.aggrList);
      let index = target.getAttribute('index');
      let parentIndex = target.getAttribute('parentIndex');
      let canvasType = list[parentIndex][type][index].canvasType;
      if (canvasType) {
        featureObj.canvasType = canvasType;
      }
      list[parentIndex][type].splice(index, 1, featureObj);
    },
    rowCapsuleCombinedRightProcess (el, target) {
      let featureObj = getFeatureObj(el, this.catList, this.aggrList);
      let index = target.getAttribute('index');
      let rightList = this.rowList[index].right || [];
      if (featureObj.type === 'CAT') return;
      if (this.canvasType === 'bar-line') {
        featureObj.canvasType = 'line';
      }
      rightList.push(featureObj);
      this.$set(this.rowList[index], 'right', rightList);
      this.setRowList(this.rowList);
    },
    rowCapsuleCombinedLeftProcess (el, target) {
      let featureObj = getFeatureObj(el, this.catList, this.aggrList);
      let index = Number(target.getAttribute('index'));
      setColorListKey(this.currentCanvasDetail.css.colors, index);
      setColorListKey(this.currentCanvasDetail.css.patterns, index);
      setColorListKey(this.currentCanvasDetail.css.colors_and_opacities_list, index);
      let leftList = this.rowList[index].left || [];
      if (featureObj.type === 'CAT') return;
      if (this.canvasType === 'bar-line') {
        featureObj.canvasType = 'bar';
      }
      leftList.unshift(featureObj);
      this.$set(this.rowList[index], 'left', leftList);
      this.setRowList(this.rowList);
    },
    columnCapsuleCombinedRightProcess (el, target) {
      let featureObj = getFeatureObj(el, this.catList, this.aggrList);
      let index = target.getAttribute('index');
      let rightList = this.columnList[index].right || [];
      if (featureObj.type === 'CAT') return;
      if (this.canvasType === 'bar-line') {
        featureObj.canvasType = 'line';
      }
      rightList.push(featureObj);
      this.$set(this.columnList[index], 'right', rightList);
      this.setColumnList(this.columnList);
    },
    columnCapsuleCombinedLeftProcess (el, target) {
      let featureObj = getFeatureObj(el, this.catList, this.aggrList);
      let index = Number(target.getAttribute('index'));
      setColorListKey(this.currentCanvasDetail.css.colors, index);
      setColorListKey(this.currentCanvasDetail.css.patterns, index);
      setColorListKey(this.currentCanvasDetail.css.colors_and_opacities_list, index);
      let leftList = this.columnList[index].left || [];
      if (featureObj.type === 'CAT') return;
      if (this.canvasType === 'bar-line') {
        featureObj.canvasType = 'bar';
      }
      leftList.unshift(featureObj);
      this.$set(this.columnList[index], 'left', leftList);
      this.setColumnList(this.columnList);
    },
    /** ************组合图开始*********** */
    numInsertCapsuleProcess (el, target) {
      if (el.getAttribute('property') === 'cat') return;
      this.bus.$emit('mergeFeature', el, target);
    },
    groupCapsuleProcess (el, target) {
      let dir = target.dataset.dir;
      let chartObj = {
        left: 'bar',
        right: 'line',
      };
      let featureObj = getFeatureObj(el, this.catList, this.aggrList);
      featureObj.canvasType = chartObj[dir];
      if (featureObj.type === 'CAT') return;
      if (isEmpty(this.barLineList)) {
        let obj = {};
        obj[dir] = [featureObj];
        this.barLineList.push(obj);
      } else {
        this.$set(this.barLineList[0], dir, [featureObj]);
      }
      this.setBarLineList(this.barLineList);
    },
    /** **************组合图结束************************** */
    colorCapsuleProcess (el, target) {
      this.showTip = false;
      let sourceType = el.getAttribute('property');
      let symbol = target.dataset.symbol;
      let name = el.dataset.name;
      let type = el.getAttribute('type');
      let ruleCommand = rules({
        target: el,
        capsuleType: sourceType,
        chartType: this.canvasType,
        context: this,
      });
      let flagObj = ruleCommand.command(
        'color',
        symbol.indexOf('Replace') > -1,
        name,
        type
      );
      if (!flagObj.showTip) {
        let featureObj = getFeatureObj(el, this.catList, this.aggrList);
        this.colorCapsuleList.push(featureObj);
        this.bus.$emit('capsuleChange', 'color', this.colorCapsuleList);
      }
    },
    labelsCapsuleProcess (el, target) {
      this.showTip = false;
      let sourceType = el.getAttribute('property');
      let symbol = target.dataset.symbol;
      let name = el.dataset.name;
      let type = el.getAttribute('type');
      let ruleCommand = rules({
        target: el,
        capsuleType: sourceType,
        chartType: this.canvasType,
        context: this,
      });
      let flagObj = ruleCommand.command(
        'labels',
        symbol.indexOf('Replace') > -1,
        name,
        type
      );
      // legendMap
      if (!flagObj.showTip) {
        let featureObj = getFeatureObj(el, this.catList, this.aggrList);
        if (this.canvasType !== 'table') {
          featureObj = this.labelsLegendProcess(featureObj);
        }
        if (featureObj) {
          this.labelsCapsuleList.push(featureObj);
          this.bus.$emit('capsuleChange', 'labels', this.labelsCapsuleList);
        }
      }
    },
    sizeCapsuleProcess (el, target) {
      this.showTip = false;
      let sourceType = el.getAttribute('property');
      let symbol = target.dataset.symbol;
      let name = el.dataset.name;
      let type = el.getAttribute('type');
      let ruleCommand = rules({
        target: el,
        capsuleType: sourceType,
        chartType: this.canvasType,
        context: this,
      });
      let flagObj = ruleCommand.command(
        'size',
        symbol.indexOf('Replace') > -1,
        name,
        type
      );
      if (!flagObj.showTip) {
        let featureObj = getFeatureObj(el, this.catList, this.aggrList);
        featureObj = this.labelsLegendProcess(featureObj);
        if (featureObj) {
          this.sizeCapsuleList.push(featureObj);
          this.bus.$emit('capsuleChange', 'size', this.sizeCapsuleList);
        }
      }
    },
    // 行胶囊
    rowCapsuleProcess (el, target) {
      this.showTip = false;
      let sourceType = el.getAttribute('property');
      let symbol = target.dataset.symbol;
      let name = el.dataset.name;
      let type = el.getAttribute('type');
      let ruleCommand = rules({
        target: el,
        capsuleType: sourceType,
        chartType: this.canvasType,
        context: this,
      });
      let flagObj = ruleCommand.command(
        'row',
        symbol.indexOf('Replace') > -1,
        name,
        type
      );
      if (!flagObj.showTip) {
        let featureObj = getFeatureObj(el, this.catList, this.aggrList);
        if (this.canvasType === 'bar-line') featureObj.canvasType = 'bar';
        this.rowList.push(featureObj);
      }
    },
    // 列
    columnCapsuleProcess (el, target) {
      this.showTip = false;
      let sourceType = el.getAttribute('property');
      let symbol = target.dataset.symbol;
      let name = el.dataset.name;
      let type = el.getAttribute('type');
      let ruleCommand = rules({
        target: el,
        capsuleType: sourceType,
        chartType: this.canvasType,
        context: this,
      });
      let flagObj = ruleCommand.command(
        'column',
        symbol.indexOf('Replace') > -1,
        name,
        type
      );
      if (!flagObj.showTip) {
        let featureObj = getFeatureObj(el, this.catList, this.aggrList);
        this.columnList.push(featureObj);
      }
    },
    labelsLegendProcess (featureObj) {
      let keys = Object.keys(this.legendMap);
      if (this.labelsCapsuleList.length > 0) {
        let list = this.labelsCapsuleList.filter(
          (i) => i.name === featureObj.name
        );
        if (list.length > 0) {
          keys = keys.filter((i) => !list.find((m) => m.legend === i));
        }
      }
      if (keys.length > 0) {
        if (featureObj.dtype === 'AGGR') {
          featureObj.legend = keys[0];
          if (featureObj.legend === 'PERCENTILE') {
            featureObj.probability = 0.5;
          }
        }

        return featureObj;
      }
      return null;
    },
    /** ************替换开始********************** */
    replaceCapsuleProcess (symbol, el, target) {
      typeof this.funEventPareDefine[symbol].fun === 'function' &&
        this.funEventPareDefine[symbol].fun({ symbol, el, target });
    },
    /**
     * 行列compare 替换
     * @param {*} param0
     */
    rowColumnReplaceProcess ({ symbol, el, target }) {
      this.showTip = false;
      let type = this.funEventPareDefine[symbol].type;
      let name = el.dataset.name;
      let dataType = el.getAttribute('type');
      let sourceType = el.getAttribute('property');
      let ruleCommand = rules({
        target: el,
        capsuleType: sourceType,
        chartType: this.canvasType,
        context: this,
      });
      let flagObj = ruleCommand.command(type, true, name, dataType);
      if (!flagObj.showTip) {
        let attrName = this.funEventPareDefine[symbol].listName; // colorList sizeList labelList
        let curList = ruleCommand.swapFeature(
          this[attrName],
          target.getAttribute('name'),
          target,
          name,
          dataType
        );
        this[
          'set' + attrName.substring(0, 1).toUpperCase() + attrName.substr(1)
        ](curList);
        type = type === 'column' ? 'col' : type;
        this.bus.$emit('capsuleChange', type, curList);
      }
    },
    /**
     * 颜色大小label替换
     * @param {} param0
     */
    colorSizeLabelReplaceProcess ({ target, symbol, el }) {
      this.showTip = false;
      let panel = isTarget(target, 'capsule-box');
      let name = el.dataset.name;
      let dataType = el.getAttribute('type');
      if (!panel) return;
      let sourceType = el.getAttribute('property');
      let ruleCommand = rules({
        target: el,
        capsuleType: sourceType,
        chartType: this.canvasType,
        context: this,
      });
      let flagObj = ruleCommand.command();
      if (!flagObj.showTip) {
        let attrName = this.funEventPareDefine[symbol].listName; // colorList sizeList labelList
        let curList = ruleCommand.swapFeature(
          this[attrName],
          target.getAttribute('name'),
          panel,
          name,
          dataType
        );
        this[
          'set' + attrName.substring(0, 1).toUpperCase() + attrName.substr(1)
        ](curList);
        this.bus.$emit(
          'capsuleChange',
          this.funEventPareDefine[symbol].type,
          curList
        );
      }
    },
    colorLabelGroupReplaceProcess ({ target, symbol, el }) {
      let className =
        symbol === 'colorGroupCapsuleReplace'
          ? 'color-capsule'
          : 'label-capsule';
      let panel = isTarget(target, className);
      if (!panel) return;
      this.bus.$emit(this.funEventPareDefine[symbol].eventName, el, panel);
    },
    /** **********替换结束********************* */
    /**
     * 分组特征
     */
    combineFeatureProcess (el, target) {
      let groupName = target.getAttribute('group-name');
      let name = el.getAttribute('name');
      let index = target.getAttribute('index');
      let sourceName = target.getAttribute('name');
      if (sourceName === name) return;
      let group = this.isGroup(target);
      if (group) {
        index = group.getAttribute('index');
        sourceName = null;
      }
      // 创建特征分组，在DashboardLeft.vue中接收
      this.bus.$emit('createGroup', sourceName, name, index, groupName);
    },
    /*
     * 柱状图，条形图，线形图的颜色胶囊
     */
    axisColorCapsuleProcess (el, target) {
      if (this.showTip) {
        this.showTip = false;
        return;
      }
      let isRotated = this.canvasType === 'bar-rotated';
      let tempList = isRotated ? this.columnList : this.rowList;
      let selectList = setList(tempList);
      selectList = this.setListValue(selectList);
      let type = el.dataset.property;
      if (this.canvasType === 'bar-line') {
        if (type === 'AGGR') {
          selectList = selectList.filter((item) => item.canvasType === 'bar');
        } else {
          let name = el.dataset.name;
          let inColumn = !!this.columnList.filter(
            (item) => item.feature_name === name
          ).length;
          if (inColumn) {
            selectList = selectList.filter((item) => item.canvasType === 'bar');
          }
        }
      }
      if (!selectList.length) return;
      if (selectList.length === 1) {
        let list = this.setColorList(tempList, el, selectList[0].value);
        if (!list.length) return;
        if (isRotated) {
          this.setColumnList(list);
        } else {
          this.setRowList(list);
        }
        return;
      }
      this.$showConfirmBox({
        title: '指定特征',
        message: '当前行有多个特征，请指定赋予颜色的特征。',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        hasSelect: true,
        selectList: selectList,
        confirm: (select) => {
          if (el) {
            let list = this.setColorList(tempList, el, select);
            if (!list.length) return;
            if (isRotated) {
              this.setColumnList(list);
            } else {
              this.setRowList(list);
            }
          }
          this.$closeConfirmBox();
        },
      });
    },
    /*
     * 柱状图，条形图，线形图的标签胶囊
     */
    axisLabelCapsuleProcess (el) {
      if (this.showTip) {
        this.showTip = false;
        return;
      }
      let isRotated = this.canvasType === 'bar-rotated';
      let tempList = isRotated ? this.columnList : this.rowList;
      let selectList = setList(tempList);
      selectList = this.setListValue(selectList);
      let type = el.dataset.property;
      if (type === 'CAT') {
        let elName = el.dataset.name;
        selectList = selectList.filter(
          (item) => item.color && item.color.feature_name === elName
        );
      }
      if (!selectList.length) return;
      if (selectList.length === 1) {
        let list = this.setLabelList(tempList, el, selectList[0].value);
        if (!list.length) return;
        if (isRotated) {
          this.setColumnList(list);
        } else {
          this.setRowList(list);
        }
        return;
      }
      this.$showConfirmBox({
        title: '指定特征',
        message: '当前行有多个特征，请指定赋予标签的特征。',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        hasSelect: true,
        selectList: selectList,
        confirm: (select) => {
          if (el) {
            let list = this.setLabelList(tempList, el, select);
            if (!list.length) return;
            if (isRotated) {
              this.setColumnList(list);
            } else {
              this.setRowList(list);
            }
          }
          this.$closeConfirmBox();
        },
      });
      // }
    },
    setColorList (list, el, select) {
      let selectArr = select.split(',');
      let index = selectArr[0];
      let children = selectArr[1];
      let dir = selectArr[2];
      let featureObj = getFeatureObj(el, this.catList, this.aggrList);
      if (!list.length) return [];
      if (index === '') return [];
      if (dir !== 'undefined' && dir) {
        let obj = JSON.parse(JSON.stringify(list[index][dir][children]));
        obj.color = featureObj;
        this.setObjLabel(obj.labels || [], featureObj.feature_name);
        list[index][dir].splice(children, 1, obj);
      } else {
        let obj = JSON.parse(JSON.stringify(list[index]));
        obj.color = featureObj;
        this.setObjLabel(obj.labels || [], featureObj.feature_name);
        list.splice(index, 1, obj);
      }
      return list;
    },
    setObjLabel (labelList, name) {
      for (let i = 0; i < labelList.length; i++) {
        if (
          labelList[i].dtype === 'CAT' &&
          labelList[i].feature_name !== name
        ) {
          labelList.splice(i, 1);
          return;
        }
      }
    },
    setListValue (list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].legend) {
          if (list[i].formula_type !== 'AGGR') {
            list[i].label = `${this.legendMap[list[i].legend]}(${
              list[i].feature_name
            })`;
          } else {
            list[i].label = list[i].feature_name;
          }
        } else {
          list[i].label = list[i].feature_name;
        }
      }
      return list;
    },
    setLabelList (list, el, select) {
      let selectArr = select.split(',');
      let index = selectArr[0];
      let children = selectArr[1];
      let dir = selectArr[2];
      let featureObj = getFeatureObj(el, this.catList, this.aggrList);
      if (!list.length) return [];
      if (index === '') return [];
      if (dir) {
        let obj = JSON.parse(JSON.stringify(list[index][dir][children]));
        if (isEmpty(obj.labels)) obj.labels = [];
        obj.labels.push(featureObj);
        list[index][dir].splice(children, 1, obj);
      } else {
        let obj = JSON.parse(JSON.stringify(list[index]));
        if (isEmpty(obj.labels)) obj.labels = [];
        obj.labels.push(featureObj);
        list.splice(index, 1, obj);
      }
      return list;
    },
  },
};
