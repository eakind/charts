import dataSetting from '../../right/data/dataSetting.vue';
// import viewSetting from '../../right/canvas/viewSetting.vue';
import dataColor from '../../right/data/dataColor.vue';
import chartStyle from '../../right/data/chartStyle';
import tooltipSetting from '../../right/canvas/tooltipSetting.vue';
import canvasColor from '../../right/canvas/canvasColor.vue';

import {
  notEmpty,
  isDefined,
  isEmpty,
  isArray
} from '@/utils/check.js';

import { drawMap } from '@/utils/draw/drawMap';

export const mapRight = {
  components: {
    dataSetting,
    dataColor,
    chartStyle,
    tooltipSetting,
    canvasColor,
  },
  data () {
    return {
      colorList: [],
      sizeList: [],
      tooltipList: [],
      dataSetting: [],
      curStyle: {},
      defaultDataSetting: [
        {
          title: this.$t('dashboard.default_data'),
          content: '显示前1000', // this.$t('dashboard.table_data_tip'),
          selected: true,
          values: [{
            val: 1000
          }]
        },
        {
          title: this.$t('dashboard.all_data'),
          content: '数据量较大时，不建议选择所有数据', // this.$t('dashboard.table_all_data_tip'),
          selected: false,
          values: [{
            val: null
          }]
        },
        {
          title: this.$t('dashboard.custom_data'),
          selected: false,
          content: [{
            val: 1000,
            unit: '', // this.$t('dashboard.rows'),
            disabled: true
          }]
        }
      ],
      radiusObj: {
        text: '数据点大小',
        size: 50,
        textObj: {
          left: '小', // this.$i18n.t('message.small'),
          right: '大', // this.$i18n.t('message.big')
        }
      }
    };
  },
  methods: {
    initMapConfig () {
      // 初始化背景色
      this.initBgCss();
      // 初始化style
      this.initStyle();
      // 数据化提示框
      this.initTooltipList();
      // 初始化数据设置
      this.initDataSetting();
      // 初始化数据点大小
      this.initRadius();
    },
    initStyle () {
      this.updateColorAndSize(this.curStyle);// this.chartConfig.styles
    },
    initTooltipList () {
      this.tooltipList = this.retInitTooltipList(this.tooltipList);
    },
    initDataSetting () {
      let defaultDataSetting = JSON.parse(JSON.stringify(this.defaultDataSetting));
      this.dataSetting = this.canvasCss.data_setting ? this.canvasCss.data_setting : defaultDataSetting;
    },
    initBgCss () {
      if (this.canvasCss.bgCss) {
        this.setFontColor(this.canvasCss.bgCss.color);
      } else {
        this.canvasCss.bgCss = JSON.parse(JSON.stringify(this.defaultBgCss));
        this.setFontColor(this.canvasCss.bgCss.color);
      }
    },
    initRadius () {
      this.radiusObj.size = this.canvasCss.size || 50;
    },
    updateColorAndSize (obj) {
      this.colorList = isArray(obj.colors) ? obj.colors : [];
      this.sizeList = isArray(obj.sizes) ? obj.sizes : [];
      this.updateColorMapRelation();
    },
    updateColorMapRelation () {
      if (!isDefined(this.canvasCss.patterns)) {
        this.canvasCss.patterns = [];
      }
      if (!isDefined(this.canvasCss.colors)) {
        this.canvasCss.colors = [];
      }
      if (!isDefined(this.canvasCss.colors_and_opacities_list)) {
        this.canvasCss.colors_and_opacities_list = [];
      }
      this.colorList.forEach((c, cIdx) => {
        let color = {};
        c.list.forEach((m, idx) => {
          if (c.colored_type === 'linear') {
            !m.color && (m.color = c.colors[idx]);
          }

          if (notEmpty(this.canvasCss.colorRanges)) {
            m.originalVal = this.canvasCss.colorRanges[cIdx].range[idx];
            if (notEmpty(this.canvasCss.colorRanges[cIdx].check)) {
              m.check = this.canvasCss.colorRanges[cIdx].check[idx];
            }
            // 如果没有check，就随着变化
            if (!m.check) {
              // m.val = m.originalVal;
              // m.unique = m.val;
            } else {
              m.originalVal = this.canvasCss.colorRanges[cIdx].range[idx];
            }
          }
          if (c.colored_type === 'ordinal') {
            color[m.val] = m.color;
          }
        });
        c.colors = color;
        let temp_color = this.canvasCss.colors.filter(
          co => co.key_id === c.key_id
        );
        if (notEmpty(temp_color)) {} else {
          this.canvasCss.colors.push({
            key_id: c.key_id,
            aggr: c.aggr,
            name: c.name
          });
        }

        let temp_pattern = this.canvasCss.patterns.filter(
          co => co.key_id === c.key_id
        );

        if (notEmpty(temp_pattern)) {} else {
          this.canvasCss.patterns.push({
            key_id: c.key_id,
            aggr: c.aggr,
            name: c.name,
            patternList: {} // patternList
          });
        }

        let temp_schemes = this.canvasCss.colors_and_opacities_list.filter(
          co => co.key_id === c.key_id
        );
        if (isEmpty(temp_schemes)) {
          this.canvasCss.colors_and_opacities_list.push({
            key_id: c.key_id,
            aggr: c.aggr,
            name: c.name,
            opacity: 100,
            schemes: []
          });
        }
      });
    },
    /**
     * 画图
     */
    drawCanvas ({
      type = true,
      update = true
    }) {
      if (!this.jsonData || this.jsonData.length === 0) {
        return;
      }
      this.showLoading = true;
      // true 决定返回的数据格式
      let { chartSize: chart_size, containerSize: container_size } = this.getSize();
      let {
        styles
      } = drawMap({
        data: this.jsonData,
        featureList: this.canvasFeatures,
        canvasCss: this.canvasCss, // 画布CSS
        ids: this.chartArrs.map(d => d.id), // 根据ID找到图表的DOM载体
        chartSize: chart_size, // 图表的大小，格式为{width: 1080, height: 480}，可不提供
        containerSize: container_size, // 可滚动时候提供外div的宽高
      });

      this.showLoading = false;
      if (update) {
        this.updateColorAndSize(styles);
      }
      this.saveData('css', JSON.parse(JSON.stringify(this.canvasCss)));
    },
    /**
       * 图表样式处理
       */
    chartStyleProcess (item, val) {
      this.canvasCss.size = val;
      this.drawCanvas({ });
    },
    rangeProcess (list) {
      this.colorList[0].list = list;
      let range = [];
      let check = [];
      let val = [];

      list.forEach((i, idx) => {
        this.colorList[0].colors[i.index] = i.color;
        // range.push(i.originalVal);
        if (i.check) {
          range[idx] = i.originalVal;
        }
        check.push(i.check);
        val.push(i.val);
      });
      this.canvasCss.colorRanges = [{
        aggr: this.colorList[0].aggr,
        key_id: '0-0',
        range: range,
        check,
        val
      }];
      this.colorList[0].colors.length = list.length;
      let arr = Array.from(this.colorList[0].colors);

      this.canvasCss.colors[0].colorList = arr;
      this.drawCanvas({
        update: false
      });
    },
    dataColorProcess ({
      colors,
      colors_and_opacities_list,
    }) {
      let colorList = this.colorList;

      if (colors) {
        colorList[0].list.map((m, idx) => {
          if (colors[0].colorList[m.val]) {
            m.color = colors[0].colorList[m.val];
          }
          this.colorList[0].colors[idx] = m.color;
        });

        this.colorList[0].colors.length = colorList[0].list.length;
        let arr = Array.from(this.colorList[0].colors);

        this.canvasCss.colors[0].colorList = arr;
        console.log(this.canvasCss.colors);
      }
      if (colors && colors_and_opacities_list) {
        let curColors = colors_and_opacities_list[0].schemes.slice(0, 2);
        this.colorList.filter(i => i.key_id === colors_and_opacities_list[0].key_id).colors = curColors;

        this.colorList[0].list.map((m, idx) => {
          m.color = curColors[idx];
        });
        this.canvasCss.colors_and_opacities_list = colors_and_opacities_list;
      }
      if (colors_and_opacities_list) {
        this.canvasCss.colors_and_opacities_list = colors_and_opacities_list;
      }

      this.drawCanvas({
      });
    },

    dataTempChangeProcess (list) {
      this.colorList[0].list = list;
      if (this.colorList[0].colored_type === 'ordinal') {
        list.forEach(i => {
          this.colorList[0].colors[i.val] = i.color;
        });
      } else {
        list.forEach(i => {
          this.colorList[0].colors[i.index] = i.color;
        });
      }
      let arr = JSON.parse(JSON.stringify(this.colorList[0].colors));
      if (this.colorList[0].colored_type === 'linear') {
        this.colorList[0].colors.length = list.length;
        arr = Array.from(this.colorList[0].colors);
      }
      this.canvasCss.colors[0].colorList = arr;
      this.drawCanvas({
      });
    },
    catColorProcess (index, colors, list, colorList) {
      this.canvasCss.colors[index].colorList = colors;
      this.canvasCss.colors[index].colors = colors;
      this.canvasCss.colors[index].list = list;
      this.colorList = colorList;

      this.drawCanvas({
      });
    },
    titleStyleProcess (val) {
      let titleCss = {
        color: val,
        opacity: 100
      };
      this.updateCanvasCss('titleCss', titleCss);
    },
    tooltipFormatProcess () {
      let toolTipData = this.canvasCss.tooltipFormat;

      let format = {};
      let text = {};
      let show = false;
      JSON.parse(JSON.stringify(toolTipData)).forEach(d => {
        let format_d3 = this.formatOneNumber(d.format, 1);
        format[d.key] = format_d3;

        let new_d = JSON.parse(JSON.stringify(d));
        let text_modified = new_d.text;
        text_modified.title = new_d.title;
        text_modified.display = new_d.display;
        text[d.key] = text_modified;
        if (text_modified.display === 'auto') show = true;
      });
      this.canvasCss.tooltipNumberFormat = format;
      this.canvasCss.tooltipTextFormat = text;
      this.canvasCss.tooltipShow = show;
    },
  }
};
