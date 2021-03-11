import { mapMutations, mapState } from 'vuex';
export const colorCapsuleMixin = {
  data () {
    return {
    };
  },
  computed: {
    ...mapState('drawingboard', ['canvasType', 'columnList', 'rowList']),
    tempList () {
      if (this.canvasType === 'bar-rotated') {
        return JSON.parse(JSON.stringify(this.columnList));
      }
      return JSON.parse(JSON.stringify(this.rowList));
    }
  },
  methods: {
    ...mapMutations('drawingboard', ['setRowList', 'setColumnList']),
    getObj (obj) {
      return {
        index: obj.index,
        children: obj.children,
        dir: obj.dir,
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
      if (!this.list[num]) return;
      let { index, children, dir } = this.getObj(this.list[num]);
      const cavnasObj = {
        line: true,
        'bar-rotated': true,
        bar: true,
        'bar-line': true
      };
      if (dir) {
        if (cavnasObj[this.canvasType]) {
          this.setCanvasLabel(this.tempList[index][dir][children]);
        }
        delete this.tempList[index][dir][children].color;
      } else {
        if (cavnasObj[this.canvasType]) {
          this.setCanvasLabel(this.tempList[index]);
        }
        delete this.tempList[index].color;
      }
      this.setTempList(this.tempList);
    },
    setCanvasLabel (featureObj) {
      let colorName = featureObj.color.feature_name;
      let labels = featureObj.labels || [];
      for (let i = 0; i < labels.length; i++) {
        if (labels[i].feature_name === colorName) {
          labels.splice(i, 1);
        }
      }
    },
    changeAggr (legend, probability, num) {
      let { index, children, dir } = this.getObj(this.list[num]);
      if (dir) {
        this.tempList[index][dir][children].color.legend = legend;
        this.tempList[index][dir][children].color.probability = probability;
      } else {
        this.tempList[index].color.legend = legend;
        this.tempList[index].color.probability = probability;
      }
      this.setTempList(this.tempList);
    },
    changeRate (rate, num) {
      let { index, children, dir } = this.getObj(this.list[num]);
      if (dir) {
        this.tempList[index][dir][children].color.rate = rate;
      } else {
        this.tempList[index].color.rate = rate;
      }
      this.setTempList(this.tempList);
    },
    removeCount (num) {
      let { index, children, dir } = this.getObj(this.list[num]);
      if (dir) {
        delete this.tempList[index][dir][children].color.rate;
      } else {
        delete this.tempList[index].color.rate;
      }
      this.setTempList(this.tempList);
    }
  }
};
