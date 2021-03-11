import { isArray, isObject, hasKey, isDefined, isEmpty, notEmpty, inArray } from '../utils/check.js';

export const userModifyChart = {
  data () {
    return {

    };
  },
  methods: {
    removeMap (b) {

    },
    zoomAxis (scaleIndicator, id) {
      let scale = scaleIndicator === 1 ? 2 : scaleIndicator === -1 ? 0.5 : 1; let actualScale = 1;
      let target_index = this.configs.findIndex((c) => c.id === id);
      let target = this.configs[target_index];

      let exit = this.axis_scale.filter(a => a.target_index === target_index);

      let scale_before_reset = 1;

      if (isEmpty(exit)) {
        if (scale === 1) return;
        actualScale = scale;
        this.axis_scale.push({
          target_index: target_index,
          scale: scale
        });
      } else {
        if (scaleIndicator === 0) {
          // 点击了复位，需要知道点击之前放大或缩小的倍数
          scale_before_reset = Number('' + exit[0].scale);
          exit[0].scale = 1;
        } else {
          exit[0].scale *= scale;
          if (exit[0].scale > 64) exit[0].scale = 64;
          if (exit[0].scale < 1 / 64) exit[0].scale = 1 / 64;
        }
        actualScale = exit[0].scale;

        if (actualScale === 1) {
          exit[0].translate = { k: 1, x: 0, y: 0 };
          this.canvasCss.axis_scale = this.axis_scale;
          this.saveData('css', this.canvasCss, true);
        }
      }

      this.canvasCss.axis_scale = this.axis_scale;

      target.config.axis.scale = actualScale;

      this.mc_insts.filter(m => `${m.config.bindto}` === `#${id}`).forEach(m => m.zoomAxis(scaleIndicator === 0 ? 1 / scale_before_reset : scale));
    },
    zoomPanning () {
      let that = this;

      return function (id, value) {
        let target_index = that.configs.findIndex((c) => c.id === id);
        let target = that.configs[target_index];

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
        that.saveData('css', that.canvasCss, true);
      };
    },
    changeCurrentList (type, list) {
      this.showRange = true;
      this.rangeType = type;

      let colors = list.list.map(l => l.color);
      let originalVals = list.list.map(l => l.originalVal);
      let currentVals = originalVals;
      if (notEmpty(this.canvasCss.colorRanges)) {
        let temp = this.canvasCss.colorRanges.filter(c => c.key_id === list.key_id);
        if (notEmpty(temp)) {
          currentVals = temp[0].range;
        }
      }

      this.currentList.id = list.id;
      this.currentList.aggr = list.aggr;
      if (type === 'color') {
        this.rangeName = this.$i18n.t('message.color_range');
        let colors = list.list.map(l => l.color);
        let originalVals = list.list.map(l => l.originalVal);
        if (notEmpty(this.canvasCss.colorRanges)) {
          let temp = this.canvasCss.colorRanges.filter(c => c.key_id === list.key_id);
          if (notEmpty(temp)) {
            currentVals = temp[0].range;
          }
        }
        this.currentList.key_id = list.key_id;
        this.currentList.colorMin = colors[0];
        this.currentList.colorMax = colors[colors.length - 1];
        this.currentList.actualMin = originalVals[0];
        this.currentList.actualMax = originalVals[originalVals.length - 1];
        this.currentList.currentMin = currentVals[0];
        this.currentList.currentMax = currentVals[currentVals.length - 1];

        this.userDefined = this.canvasCss.userDefinedColorRange;
      } else {
        if (notEmpty(this.canvasCss.sizeRanges)) {
          let temp = this.canvasCss.sizeRanges.filter(c => c.aggr === list.aggr);
          if (notEmpty(temp)) {
            currentVals = temp[0].range;
          }
        }
        this.rangeName = this.$i18n.t('message.size_range');
        this.currentList.colorMin = '';
        this.currentList.colorMax = '';
        this.currentList.actualMin = originalVals[0];
        this.currentList.actualMax = originalVals[originalVals.length - 1];
        this.currentList.currentMin = currentVals[0];
        this.currentList.currentMax = currentVals[currentVals.length - 1];

        this.userDefined = this.canvasCss.userDefinedSizeRange;
      }
    },
    changeRangeVal (list, bool) {
      this.showRange = false;
      this.userDefined = bool;

      let target = this.isBar ? this.configs.filter(c => `#${c.id}` === list.id)[0] : this.configs[0];
      let range = (this.rangeType === 'size' ? this.canvasCss.sizeRanges : this.canvasCss.colorRanges) || [];

      if (list.currentMin > list.currentMax) list.currentMin = list.currentMax;
      let new_range = [list.currentMin, list.currentMax];
      if (this.isBar) {
        let temp = range.filter(r => r.key_id === list.key_id);
        if (isEmpty(temp)) {
          range.push({
            aggr: list.aggr,
            range: new_range,
            key_id: list.key_id
          });
        } else {
          temp[0].range = new_range;
        }
      } else {
        range = [{
          aggr: list.aggr,
          range: new_range,
          key_id: list.key_id
        }];
      }
      if (this.rangeType === 'size') {
        target.config.data.range.size = this.userDefined ? range.map(r => r.range) : [];
        this.canvasCss.sizeRanges = this.userDefined ? range : [];
        this.canvasCss.userDefinedSizeRange = this.userDefined;
      } else {
        let [first, second] = [...list.key_id.split('-')];
        if (this.isBar) {
          let combined = target.config.data.combined[first][second];
          if (combined) {
            let color_style = combined.color_style;
            color_style.range = this.userDefined ? new_range : [];
          }
        } else {
          target.config.data.range.color = this.userDefined ? range.map(r => r.range) : [];
        }
        this.canvasCss.colorRanges = this.userDefined ? range : [];
        this.canvasCss.userDefinedColorRange = this.userDefined;
      }

      this.drawCanvas({});
    },
    updateStatus (val) {
      // if(isDefined(val)) this.changeSchemes = val;
      // else this.changeSchemes = false
    },
    focusOn (className, id, flag) {
      if (!isDefined(className)) {
        return;
      }
      if (flag[0]) {
        if (id === '') {
          this.mc_insts.forEach(m => m.select(className));
        } else {
          this.mc_insts.filter(m => `${m.config.bindto}` === id).forEach(m => m.select(className));
        }
      } else {
        this.mc_insts.forEach(m => m.select());
      }
    },
    changeLayout (list) {
      this.layout_list.forEach(l => {
        if (l.id === list.id) l.checked = true;
        else l.checked = false;
      });
      for (let c of this.configs) {
        c.config.order.style = list.id;
      }
      this.canvasCss.orderStyle = list.id;
      this.drawCanvas({ update: false });
    },
    changeRadius (list) {
      this.radius_list.forEach(l => {
        if (l.id === list.id) l.checked = true;
        else l.checked = false;
      });
      for (let c of this.configs) {
        c.config.arc.innerRadius = list.radius;
      }
      this.canvasCss.innerRadius = list.radius;
      this.drawCanvas({ update: false });
    },
    changeTableSetting ({ padding, inner, outter, cell }) {
      for (let c of this.configs) {
        c.config.table.inner.width = inner.width;
        c.config.table.outter.width = outter.width;
        c.config.table.padding.top = padding.top;
        c.config.table.padding.bottom = padding.bottom;
        c.config.table.padding.left = padding.left;
        c.config.table.padding.right = padding.right;
        c.config.table.body.width = cell.width;
      }
      this.tableSetting = { padding, inner, outter, cell };
      this.canvasCss.tableSetting = this.tableSetting;
      this.drawCanvas({ update: false });
    },
    changeOpacityValue: lodash.debounce(function (e, list) {
      let [first, second] = [...list.key_id.split('-')];
      let target = this.configs.filter(c => `#${c.id}` === list.id)[0];
      let opacity = e.target.value;

      if (this.isBar) {
        // 更改实例
        let combined = target.config.data.combined[first][second];
        if (combined) {
          let color_style = combined.color_style;
          color_style.opacity = opacity / 100;
        }

        this.canvasCss.colors_and_opacities_list.filter(c => c.key_id === list.key_id)[0].opacity = opacity;
      } else {
        target.config.color.opacity = [opacity / 100];
        this.canvasCss.colors_and_opacities_list[0].opacity = opacity;
      }

      this.drawCanvas({ update: false });
    }, 1000),
    async changeColorList (b, a) {
      let [first, second] = [...b.key_id.split('-')];
      let target = this.configs.filter(c => `#${c.id}` === b.id)[0];
      let color = a[0];

      if (b.type === 'linear') {
        this.color_list.filter(c => c.key_id === b.key_id)[0].colors[b.index] = color;
      } else {
        this.color_list.filter(c => c.key_id === b.key_id)[0].colors[b.val] = color;
      }

      let color_array = this.color_list.filter(c => c.key_id === b.key_id)[0].colors;

      if (this.isBar) {
        let combined = target.config.data.combined[first][second];
        if (combined) {
          let color_style = combined.color_style;
          color_style.colors = color_array;
        }

        this.canvasCss.colors.filter(c => c.key_id === b.key_id)[0].colorList = color_array;
      } else {
        target.config.color.colors = [color_array];
        this.canvasCss.colors[0].colorList = color_array;
      }

      this.drawCanvas({});
    },
    async changePatternList (b, a) {
      let [first, second] = [...b.key_id.split('-')];
      let target = this.configs.filter(c => `#${c.id}` === b.id)[0];
      let pattern = a[0];

      this.color_list.filter(c => c.key_id === b.key_id)[0].patterns[b.val] = pattern;

      if (this.isBar) {
        let combined = target.config.data.combined[first][second];
        if (combined) {
          let color_style = combined.color_style;
          color_style.patterns = this.color_list.filter(c => c.key_id === b.key_id)[0].patterns;
        }

        this.canvasCss.patterns.filter(c => c.key_id === b.key_id)[0].patternList[b.val] = pattern;
      } else {
        target.config.color.patterns = this.color_list.map(c => c.patterns);
        this.canvasCss.patterns[0].patternList[b.val] = pattern;
      }

      this.drawCanvas({});
    },
    sureTplHandler (array, index, templateList) {
      // this.changeSchemes = true
      this.showColorTpl = false;
      console.log(templateList);
      console.log(array);
      console.log(index);
      let colors = array.map(a => a.color);
      if (colors.length < templateList.length) {
        colors = templateList;
      }
      let id = isDefined(array[0].id) ? array[0].id : '';
      		// aggr = isDefined(array[0].aggr) ? array[0].aggr : '',
      let key_id = isDefined(array[0].key_id) ? array[0].key_id : '';
      let [first, second] = [...key_id.split('-')];
      		let target = this.configs.filter(c => `#${c.id}` === id)[0];
      		let isLinear = this.color_list[index].colored_type === 'linear';

      this.color_list[index].schemes = colors;
      this.color_list[index].colors = isLinear ? [] : {};
      if (this.isBar) {
        let combined = target.config.data.combined[first][second];
        if (combined) {
          let color_style = combined.color_style;
          color_style.schemes = this.color_list.filter(c => c.key_id === key_id)[0].schemes;
          color_style.colors = this.color_list.filter(c => c.key_id === key_id)[0].colors;
        }

        this.canvasCss.colors.filter(c => c.key_id === key_id)[0].colorList = isLinear ? [] : {};
        this.canvasCss.colors_and_opacities_list.filter(c => c.key_id === key_id)[0].schemes = colors;
      } else {
        target.config.color.schemes = this.color_list.map(c => c.schemes);
        target.config.color.colors = this.color_list.map(c => c.colors);
        this.canvasCss.colors[0].colorList = isLinear ? [] : {};
        this.canvasCss.colors_and_opacities_list[0].schemes = colors;
      }

      this.drawCanvas({});
    },
    changeSlider: lodash.debounce(async function (val) {
      this.size = val;
      this.canvasCss.size = this.size;

      for (let c of this.configs) {
        if (this.chart_type === 'map' || this.chart_type === 'scatter') c.config.point.size = val / 25;
        else if (this.chart_type === 'bubble' || this.chart_type === 'pie') c.config.arc.size = val;
        else c.config.bar.padding.outter = (1 - val / 100) / 2;
      }

      this.drawCanvas({});
    }, 500),
    changeSlider_line: lodash.debounce(async function (val) {
      this.size_line = val;
      this.canvasCss.size_line = this.size_line;

      for (let c of this.configs) {
        c.config.line.size = val / 25;
      }
      this.drawCanvas({ update: false });
    }, 500),
    selectPointStyle (item) {
      let point = item.id;
      this.canvasCss.point_style = point;

      for (let c of this.configs) {
        c.config.line.pattern = point;
      }
      this.drawCanvas({ update: false });
    },
    changeTooltip (data, flag) {
      if (flag) {
        this.tableTitleData = data;
        this.canvasCss.tableTitleData = data;
        let new_data = [];
        data.forEach(d => {
          new_data.push({
            key: d.key,
            title: d.title,
            show: d.display === 'auto',
            style: {
              fill: d.text.fontColor,
              'font-size': d.text.fontSize,
              'text-decoration': d.text.decoration,
              'font-style': d.text.fontStyle,
              'letter-spacing': d.text.letterSpacing,
              'line-height': d.text.lineHeight,
              'text-align': d.text.align
            }
          });
        });
        this.canvasCss.tableTitleDataFormat = new_data;
        this.configs.forEach(c => {
          c.config.table.title = new_data;
        });
        this.drawCanvas({});
        // this.drawWithoutGetData()
        return;
      }
      this.toolTipData = data;
      this.canvasCss.tooltipFormat = data;

      let format = {}; let text = {}; let show = false;
      JSON.parse(JSON.stringify(data)).forEach(d => {
        let format_d3 = this.formatOneNumber(d.format, 0);
        format[d.key] = format_d3;

        let new_d = JSON.parse(JSON.stringify(d));
        let text_modified = new_d.text;
        text_modified.title = new_d.title;
        text_modified.display = new_d.display;
        text[d.key] = text_modified;
        if (text_modified.display === 'auto') show = true;
      });

      this.configs.forEach(c => {
        c.config.tooltip.format = format;
        c.config.tooltip.text = text;
        c.config.tooltip.show = show;
      });

      this.canvasCss.tooltipNumberFormat = format;
      this.canvasCss.tooltipTextFormat = text;
      this.drawCanvas({});
    },
    mapChange () {
      let that = this;
      return function (type, value) {
        if (type === 'zoom') {
          that.canvasCss.mapZoom = value;
        }
        if (type === 'move') {
          that.canvasCss.mapCenter = value;
        }
        that.saveData('css', that.canvasCss, true);
      };
    }
  }
};
