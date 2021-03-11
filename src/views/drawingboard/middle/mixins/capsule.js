// import { getChartKey } from '../utils/index.js';
import { initCatObj, initAggrObj } from '@/utils/utils.js';
/**
 * 胶囊一些方法
 */
import { mapMutations } from 'vuex';
export default {
  data () {
    return {
      timer: null,
    };
  },
  beforeDestroy () {
    clearTimeout(this.timer);
    this.timer = null;
  },
  methods: {
    ...mapMutations('drawingboard', {
      setXCapsuleList: 'setColumnList',
      setYCapsuleList: 'setRowList',
    }),
    /**
     * 初始化features
     * @param {features}} features
     * @param { key 需要替换} needReplace
     */
    initCapsuleData (features, name, needReplace) {
      for (const key in features) {
        if (features.hasOwnProperty(key)) {
          const ele = features[key];
          let type = key === 'text' && needReplace ? 'labels' : key;
          if (this.chartType === 'map' && type === 'area') {
            type = 'column';
          }
          let funName =
            type.length > 1
              ? type.substring(0, 1).toUpperCase() + type.substr(1)
              : type.toUpperCase();
          let ret = this.getFeatureObj(ele, name);
          if (Object.prototype.toString.call(ele) === '[object Array]') {
            this['set' + funName + 'CapsuleList'](ret || []);
          } else {
            if (!ret) {
              this['set' + funName + 'CapsuleList']([]);
              ret = null;
            } else {
              this['set' + funName + 'CapsuleList']([ret]);
            }
          }
          if (!ret) {
            delete this.canvasFeatures[key];
          } else {
            let retObj = this.retPostParam(ret);
            this.$set(this.canvasFeatures, key, retObj);
          }
        }
      }
    },
    getFeatureObj (item, name) {
      let ret = Object.create(null);
      if (Object.prototype.toString.call(item) === '[object Array]') {
        ret = [];
        item.forEach((i) => {
          if (i.name !== name) {
            if (i.dtype === 'CAT') {
              i = initCatObj(i.name, this.catList, i.split, i.order);
            } else {
              i = initAggrObj(
                i.name,
                this.aggrList,
                this.canvasType,
                i.legend,
                i.probability,
                i.rate
              );
            }
            i && ret.push(i);
          }
        });
        return ret;
      } else {
        if (item.name === name) {
          return null;
        }
        if (item.dtype === 'CAT') {
          ret = initCatObj(item.name, this.catList, item.split, item.order);
        } else {
          ret = initAggrObj(
            item.name,
            this.aggrList,
            this.canvasType,
            item.legend,
            item.probability,
            item.rate
          );
        }
      }

      return ret;
    },
    retPostParam (features) {
      function retObjProcess (featureObj) {
        let obj = {
          name: featureObj.feature_name || featureObj.name,
          dtype: featureObj.dtype,
          // type: featureObj.dtype,
        };
        // 如果有聚合函数
        if (featureObj.legend) obj.legend = featureObj.legend;
        // 如果聚合函数是分位数
        if (featureObj.legend === 'PERCENTILE') {
          obj.probability = featureObj.probability;
        }

        // 如果是时间特征
        if (featureObj.split) {
          obj.split = featureObj.split;
        }
        // 如果有设置同比/环比
        if (featureObj.rate) {
          obj.rate = featureObj.rate;
        }
        // 如果有排序
        if (featureObj.order) {
          obj.order = featureObj.order;
        }
        if (featureObj.formula_type) {
          obj.formulaType = featureObj.formula_type;
        }
        return obj;
      }
      let ret = Object.create(null);
      if (Object.prototype.toString.call(features) === '[object Array]') {
        ret = features.map((i) => {
          return retObjProcess(i);
        });
      } else {
        ret = retObjProcess(features);
      }
      return ret;
    },
    /**
     * 行列 标签 颜色 大小 改变
     * @param {胶囊类型} type
     * @param {数据} list
     * @param {回调} cb
     * @param { type 需要替换} needReplace
     */
    resetCanvasFeature (type, list, cb, needReplace) {
      type = type === 'labels' && needReplace ? 'text' : type;
      if (this.chartType === 'map' && type === 'col') {
        type = 'area';
      }
      if (this.chartType === 'scatter') {
        type = type === 'col' ? 'x' : type === 'row' ? 'y' : type;
      }
      let resList = typeof cb === 'function' && cb(type, list);
      if (!resList || resList.length === 0) {
        delete this.canvasFeatures[type];
      } else {
        let retObj = this.retPostParam(resList);
        this.$set(this.canvasFeatures, type, retObj);
      }
    },
    /**
     * 防抖调用
     * @param {画图方法 默认drawChart } cb
     */
    shakeDrawChart (cb) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        clearTimeout(this.timer);
        this.timer = null;
        // this.dataKey = getChartKey({ rowList: this.rowList || [], columnList: this.columnList || [] }, this.worksheetId, null, JSON.stringify(this.canvasFeatures));
        // if (this.chartDataMap[this.dataKey]) {
        //   this.setChartStyle();
        //   return;
        // };
        typeof cb === 'function' ? cb() : this.drawChart();
      }, 500);
    },

    bgCssProcess () {
      let bgCssObj = this.canvasCss.bgCss;
      if (bgCssObj.color) {
        let titleCss = {
          color: bgCssObj.color,
        };
        this.$set(this.canvasCss, 'titleCss', titleCss);
      }
      if (this.canvasType === 'map') {
        this.canvasCss.bgCss.color = '#6b6b6b';
      }
      let { textSettings } = this.canvasCss;
      if (textSettings && bgCssObj.color) {
        for (let index = 0; index < textSettings.length; index++) {
          textSettings[index].list.forEach((i) => {
            i.format.fontColor = bgCssObj.color;
          });
        }
        this.$set(this.canvasCss, 'textSettings', textSettings);
      }
    },
  },
};
