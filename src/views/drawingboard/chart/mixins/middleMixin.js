import { getChartKey } from '../../middle/utils/index.js';
import { post } from '@/api/server.js';
import { modifyCss } from '../../utils/canvasStyle.js';
import { isEmpty, notEmpty, isDefined } from '@/utils/check.js';
import { mapState } from 'vuex';
export const middleMix = {
  data () {
    return {
    };
  },
  computed: {
    ...mapState('drawingboard', ['currentCanvas'])
  },
  methods: {
    delayFunc (isRefresh) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        clearTimeout(this.timer);
        this.timer = null;
        // 如果样式为空，返回
        if (isEmpty(this.currentCanvasDetail)) return;
        if (this.currentCanvasDetail.worksheet_id !== this.currentCanvas.worksheet_id) return;
        // 初始化样式
        const resCss = JSON.parse(JSON.stringify(this.currentCanvasDetail.css)) || {};
        this.canvasCss = {
          selectFromChart: false,
          ...resCss,
          worksheetId: this.currentCanvasDetail.worksheet_id
        };
        // 初始化数据设置
        if (this.canvasCss.data_setting) {
          this.defaultSetting = this.getDefaulstSetting(this.canvasCss.data_setting);
        }
        this.dataKey = getChartKey(
          { rowList: this.rowList || [], columnList: this.columnList || [] },
          this.currentCanvasDetail.worksheet_id,
          null,
          JSON.stringify(this.canvasFeatures)
        );

        let routeParam = this.$route.params.from && this.$route.params.from === 'dashboard';
        if (this.chartDataMap[this.dataKey] && !isRefresh && !routeParam) {
          // this.setChartStyle();
          return;
        }

        // 获取存储画布数据的key
        this.getChartData();
      }, 0);
    },
    async getChartData () {
      this.isLoading = true;
      let featureData = await this.getFeaturesData();
      if (featureData) {
        // 将画布数据存储在本地
        this.chartDataMap[this.dataKey] = featureData;
        this.setChartDataMap(this.chartDataMap);
      }
      for (let key in this.chartDataMap) {
        // 清除画布多余的数据
        if (key.includes(this.currentCanvasDetail.worksheet_id) && key !== this.dataKey) {
          delete this.chartDataMap[key];
        }
      }
      this.canvasData = featureData;
      this.setChartStyle();
    },
    async getFeaturesData () {
      console.log('getdata');
      let param = {
        project_id: this.projectId,
        worksheet_id: this.currentCanvasDetail.worksheet_id,
        dashboard_id: this.dashboardId,
        features: this.canvasFeatures,
        offset: 0,
        limit: 9999,
      };
      switch (this.canvasType) {
        case 'bar-rotated':
          param.nrows = this.defaultSetting;
          break;
        case 'scatter':
          param.n = this.defaultSetting;
          break;
        default:
          param.ncols = this.defaultSetting;
          break;
      }
      if (this.currentCanvas.worksheet_id !== this.currentCanvasDetail.worksheet_id) return;
      this.$set(this.currentCanvasDetail, 'features', this.canvasFeatures);
      let dataRes = await post('reviseCanvasFeature', param);
      console.log(dataRes);
      if (dataRes.code === 0) {
        return dataRes && dataRes.features_data;
      }
      return [];
    },
    getChartStyle (chartIns, idx) {
      if (chartIns) {
        this.initColorList(chartIns, idx);
        // this.$set(this.canvasCss, 'colors', this.colorList);
        // this.$set(this.canvasCss, 'patterns', this.shapeList);
        this.setScaleScope(chartIns.domains);
        this.initPointStyle();
      }
    },
    // saveFeature (value) {
    //   let detail = this.currentCanvasDetail;
    //   detail.features = value;
    //   sessionStorage.setItem(this.worksheetId, JSON.stringify(detail));
    // },
    saveCss () {
      let detail = this.currentCanvasDetail;
      if (detail) {
        detail.css = JSON.parse(JSON.stringify(this.canvasCss));
        modifyCss({
          canvasCss: JSON.parse(JSON.stringify(this.canvasCss)),
          projectId: this.projectId,
        });
      }
    },
    initColorList (ins, chartIndex) {
      let colorList = [];
      // let size = [];
      colorList = colorList.concat(ins.getColorList());
      // size = size.concat(ins.getSizeList());
      colorList.forEach((c) => {
        c.list.forEach((l) => {
          l.id = c.id;
          l.aggr = c.aggr;
          l.type = c.type;
          l.key_id = c.key_id;
        });
      });
      if (!isDefined(this.canvasCss.patterns)) {
        this.canvasCss.patterns = [];
      }
      if (!isDefined(this.canvasCss.colors)) {
        this.canvasCss.colors = [];
      }
      if (!isDefined(this.canvasCss.colors_and_opacities_list)) {
        this.canvasCss.colors_and_opacities_list = [];
      }
      for (let i = 0; i < colorList.length; i++) {
        let obj = JSON.parse(JSON.stringify(colorList[i]));
        let arr = JSON.parse(JSON.stringify(obj.list));
        let colors = {};
        let flag = false;
        for (let j = 0; j < arr.length; j++) {
          //  colors[arr[j].val] = arr[j].color;
          if (
            notEmpty(this.canvasCss.colorRanges) &&
            this.canvasCss.colorRanges.length > chartIndex
          ) {
            // obj.list[j].originalVal = this.canvasCss.colorRanges[i].range[j];
            if (
              notEmpty(this.canvasCss.colorRanges[chartIndex]) &&
              notEmpty(this.canvasCss.colorRanges[chartIndex].check)
            ) {
              obj.list[j].check = this.canvasCss.colorRanges[chartIndex].check[
                j
              ];
            }
            // 如果没有check，就随着变化
            if (!obj.list[j].check) {
              // arr[j].val = arr[j].originalVal;
              // arr[j].unique = arr[j].val;
            } else {
              obj.list[j].originalVal = this.canvasCss.colorRanges[
                chartIndex
              ].range[j];
            }
          }
          // obj.list[j].color = obj.colors[j];
          if (obj.colored_type === 'ordinal') {
            flag = true;
            colors[arr[j].val] = arr[j].color;
          } else if (obj.colored_type === 'linear') {
            flag = true;
            colors[arr[j].index] = obj.colors[arr[j].index] || arr[j].color;
            obj.list[j].color = obj.colors[arr[j].index] || arr[j].color;
          } else {
            flag = true;
            colors[arr[j].val] = arr[j].color;
          }
        }
        if (flag) {
          this.$set(obj, 'colors', colors);
        }
        this.colorList.push(obj);
        this.shapeList.push(this.shapeObj(obj));
        let temp_color = this.canvasCss.colors.filter(
          (co) => co.key_id === obj.key_id
        );
        if (notEmpty(temp_color)) {
        } else {
          this.canvasCss.colors.push({
            key_id: obj.key_id,
            aggr: obj.aggr,
            name: obj.name,
          });
        }
      }
    },
    setScaleScope (domains) {
      let list = this.canvasCss.axis_style.scopeList;
      for (let i = 0; i < list.length; i++) {
        let obj = JSON.parse(JSON.stringify(list[i]));
        if (domains[list[i].name]) {
          let domain = domains[list[i].name];
          if (obj.select !== 3) {
            obj.tick_range = [];
            obj.tick_counts = '';
            obj.min = domain.domain[0];
            obj.max = domain.domain[1];
            obj.num = domain.ticks_length;
          } else {
            obj.tick_range = domain.domain;
            if (!obj.max && !obj.min) {
              obj.min = domain.domain[0];
              obj.max = domain.domain[1];
              obj.num = domain.ticks_length;
            }
          }
        }
        list.splice(i, 1, obj);
      }
      this.$set(this.canvasCss.axis_style, 'scopeList', list);
    },
    shapeObj (obj) {
      let patterns = {};
      for (let i = 0; i < obj.list.length; i++) {
        patterns[obj.list[i].val] = obj.list[i].fill;
      }
      let shapeObj = {
        key_id: obj.key_id,
        aggr: obj.aggr,
        name: obj.name,
        id: obj.id,
        patternList: patterns,
      };
      return shapeObj;
    },
    zoomAxis (scaleIndicator, id) {
      let scale = scaleIndicator === 1 ? 2 : scaleIndicator === -1 ? 0.5 : 1;
      let actualScale = 1;
      let target_index = 0;
      for (let i = 0; i < this.chartArrs.length; i++) {
        if (this.chartArrs[i].id === id) {
          target_index = i;
        }
      }
      let axisScale = this.canvasCss.axis_scale || [];
      let exit = axisScale
        ? axisScale.filter((a) => a.target_index === target_index)
        : [];
      if (isEmpty(exit)) {
        actualScale = scale;
        axisScale.push({
          target_index: target_index,
          scale: scale,
        });
      } else {
        if (scaleIndicator === 0) {
          exit[0].scale = 1;
        } else {
          exit[0].scale *= scale;
          if (exit[0].scale > 64) exit[0].scale = 64;
          if (exit[0].scale < 1 / 64) exit[0].scale = 1 / 64;
        }
        actualScale = exit[0].scale;

        if (actualScale === 1) {
          exit[0].translate = { k: 1, x: 0, y: 0 };
        }
      }
      this.$set(this.canvasCss, 'axis_scale', axisScale);
      this.saveCss();
      this.drawChart();
    },
    zoomPanning () {
      let that = this;
      return (id, value) => {
        let target_index = that.configs.findIndex((c) => c.id === id);
        let exit = that.axis_scale.filter(
          (a) => a.target_index === target_index
        );
        if (isEmpty(exit)) {
          if (value.k === 1 && value.x === 0 && value.y === 0) {
            return;
          }
          that.axis_scale.push({
            target_index: target_index,
            translate: value,
          });
        } else {
          if (exit[0].translate) {
            if (
              value.k === exit[0].translate.k &&
              value.x === exit[0].translate.x &&
              value.y === exit[0].translate.y
            ) {
              return;
            }
            exit[0].translate = value;
          } else {
            if (value.k === 1 && value.x === 0 && value.y === 0) {
              return;
            }
            exit[0].translate = value;
          }
        }
        that.canvasCss.axis_scale = that.axis_scale;
        that.saveCss();
      };
    },
    changeLabelFormat ({
      labelList,
      labelText,
      list,
      tooltipFormat,
      tooltipText,
    }) {
      this.$set(this.canvasCss, 'labelList', labelList);
      this.$set(this.canvasCss, 'textSettings', labelText);
      this.$set(this.canvasCss, 'labelStyle', list);
      this.resetTooltipSetting(tooltipFormat, tooltipText);
      // this.drawCanvas({});
    },
    resetTooltipSetting (tooltipFormat, tooltipText) {
      this.tooltipData.forEach((i) => {
        let textMatch = tooltipText.find((item) => item.key === i.key);
        let formatMatch = tooltipFormat.find((item) => item.key === i.key);
        if (textMatch) {
          i.text = textMatch.obj;
        }
        if (formatMatch) {
          i.format = formatMatch.obj;
        }
      });

      this.$set(this.canvasCss, 'tooltipFormat', this.tooltipData);
      this.changeTooltip(this.tooltipData);
      // this.canvasCss.tooltipFormat = this.tooltipList;
    },
    setTooltipForStyle (labelList, textSettings) {
      for (let i = 0; i < labelList.length; i++) {
        if (labelList[i].list) {
          this.setToolTipForLabel(labelList[i].list, 'format');
          this.setToolTipForLabel(textSettings[i].list, 'text');
        }
      }
    },
    setToolTipForLabel (array, key) {
      let list = this.tooltipData;
      for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < list.length; j++) {
          if (array[i].key === list[j].key) {
            if (array[i].format.check) {
              this.$set(list[j], key, array[i].format);
            }
          }
        }
      }
      this.tooltipData = list;
    },
    filterList (list, name) {
      if (!name || !list) {
        return list;
      }
      let arr = [];
      for (let i = 0; i < list.length; i++) {
        if (!list[i]) {
          continue;
        }
        if (list[i].left || list[i].right) {
          let left = list[i].left;
          let right = list[i].right;
          let obj = {
            left: [],
            right: []
          };
          for (let j = 0; j < left.length; j++) {
            if (left[j] && left[j].name !== name) {
              obj.left.push(left[j]);
            }
          }
          for (let j = 0; j < right.length; j++) {
            if (right[j] && right[j].name !== name) {
              obj.right.push(right[j]);
            }
          }
          if (!obj.left.length || !obj.right.length) {
            arr.push(...obj.left, ...obj.right);
          } else {
            arr.push(obj);
          }
        } else {
          if (list[i].name !== name) {
            arr.push(list[i]);
          }
        }
      }
      return arr;
    }
  },
};
