import { modifyCss } from '../../utils/canvasStyle';
import { post } from '@/api/server.js';
import { isEmpty, notEmpty, isDefined } from '@/utils/check.js';
export const middleMix = {
  data () {
    return {
    };
  },
  methods: {
    // 获取绘图数据
    async getFeaturesData () {
      let param = {
        project_id: this.projectId,
        worksheet_id: this.worksheetId,
        dashboard_id: this.dashboardId,
        features: this.canvasFeatures,
        offset: 0,
        limit: 9999
      };
      switch (this.chartType) {
        case 'bar-rotated':
          param.nrows = this.defaultSetting;
          break;
        case 'scatter':
          param.n = this.defaultSetting;
          break;
        default:
          param.ncols = this.defaultSetting;
          break;
      };
      if (this.worksheetId === this.canvasCss.worksheetId) {
        this.saveFeature(this.canvasFeatures);
      }
      let dataRes = await post('reviseCanvasFeature', param);
      if (dataRes.code === 0) {
        return dataRes && dataRes.features_data;
      }
      return [];
    },
    saveFeature (value) {
      let detail = this.currentCanvasDetail;// JSON.parse(sessionStorage.getItem(this.worksheetId));
      detail.features = value;
      sessionStorage.setItem(this.worksheetId, JSON.stringify(detail));
    },
    saveCss () {
      let detail = this.currentCanvasDetail;//  JSON.parse(sessionStorage.getItem(this.worksheetId));
      if (detail) {
        detail.css = JSON.parse(JSON.stringify(this.canvasCss));
        sessionStorage.setItem(this.worksheetId, JSON.stringify(detail));
        modifyCss({
          canvasCss: JSON.parse(JSON.stringify(this.canvasCss)),
          projectId: this.projectId
        });
      }
    },
    initColorList (ins, chartIndex) {
      let colorList = [];
      // let size = [];
      colorList = colorList.concat(ins.getColorList());
      // size = size.concat(ins.getSizeList());
      colorList.forEach(c => {
        c.list.forEach(l => {
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
          if (notEmpty(this.canvasCss.colorRanges) && this.canvasCss.colorRanges.length > chartIndex) {
            // obj.list[j].originalVal = this.canvasCss.colorRanges[i].range[j];
            if ((notEmpty(this.canvasCss.colorRanges[chartIndex])) && notEmpty(this.canvasCss.colorRanges[chartIndex].check)) {
              obj.list[j].check = this.canvasCss.colorRanges[chartIndex].check[j];
            }
            // 如果没有check，就随着变化
            if (!(obj.list[j].check)) {
              // arr[j].val = arr[j].originalVal;
              // arr[j].unique = arr[j].val;
            } else {
              obj.list[j].originalVal = this.canvasCss.colorRanges[chartIndex].range[j];
            }
          }
          if (obj.colored_type === 'ordinal') {
            flag = true;
            colors[arr[j].val] = arr[j].color;
          } else if (obj.colored_type === 'linear') {
            flag = true;
            colors[arr[j].index] = arr[j].color;
          } else {
            flag = true;
            colors[arr[j].val] = arr[j].color;
          }
          // if (obj.colors.length > obj.list.length) {
          //   flag = true;
          //   colors[arr[j].index] = arr[j].color;
          // } else if (!obj.colors[arr[j].aggr]) {
          //   flag = true;
          //   colors[arr[j].index] = arr[j].color;
          // } else {
          //   colors[arr[j].index] = arr[j].color
          // }
          // }
        }
        if (flag) {
          // obj.colors = colors;
          this.$set(obj, 'colors', colors);
        }
        this.colorList.push(obj);
        this.shapeList.push(this.shapeObj(obj));
        let temp_color = this.canvasCss.colors.filter(
          co => co.key_id === obj.key_id
        );
        if (notEmpty(temp_color)) {} else {
          this.canvasCss.colors.push({
            key_id: obj.key_id,
            aggr: obj.aggr,
            name: obj.name
          });
        }
        // this.colors_and_opacities_list
      }
    },
    getChartStyle (chartIns, idx) {
      if (chartIns) {
        this.initColorList(chartIns, idx);
        this.$set(this.canvasCss, 'colors', this.colorList);
        this.$set(this.canvasCss, 'patterns', this.shapeList);
        this.setScaleScope(chartIns.domains);
      }
    },
    setScaleScope (domains) {
      let list = this.canvasCss.axis_style.scopeList;
      for (let i = 0; i < list.length; i++) {
        let obj = JSON.parse(JSON.stringify(list[i]));
        if (domains[list[i].feature]) {
          let domain = domains[list[i].feature];
          if (obj.select !== 3) {
            obj.tick_range = [];
            obj.tick_counts = '';
            obj.min = domain.domain[0];
            obj.max = domain.domain[1];
            obj.num = domain.ticks_length;
          } else {
            obj.tick_range = domain.domain;
            // obj.tick_counts = domain.ticks_length;
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
        patternList: patterns
      };
      return shapeObj;
    },
    zoomAxis (scaleIndicator, id) {
      let scale = scaleIndicator === 1 ? 2 : scaleIndicator === -1 ? 0.5 : 1;
      let actualScale = 1;
      // let scale_before_reset = 1;
      let target_index = 0;
      for (let i = 0; i < this.chartArrs.length; i++) {
        if (this.chartArrs[i].id === id) {
          target_index = i;
        }
      }
      let axisScale = this.canvasCss.axis_scale || [];
      let exit = axisScale ? axisScale.filter(a => a.target_index === target_index) : [];
      if (isEmpty(exit)) {
        actualScale = scale;
        axisScale.push({
          target_index: target_index,
          scale: scale
        });
      } else {
        if (scaleIndicator === 0) {
          // 点击了复位，需要知道点击之前放大或缩小的倍数
          // scale_before_reset = Number('' + exit[0].scale);
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
        // let target = that.configs[target_index];

        let exit = that.axis_scale.filter(a => a.target_index === target_index);
        if (isEmpty(exit)) {
          if (value.k === 1 && value.x === 0 && value.y === 0) {
            return;
          }
          that.axis_scale.push({
            target_index: target_index,
            translate: value
          });
        } else {
          if (exit[0].translate) {
            if (value.k === exit[0].translate.k && value.x === exit[0].translate.x && value.y === exit[0].translate.y) {
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
  }
};
