/**
 * table right 栏
 */
import { drawTable } from '@/utils/draw/drawTable';
import { notEmpty, isDefined, isEmpty, isArray } from '@/utils/check.js';
import { modifyCss, formatOneNumber, getSize } from '../../utils/canvasStyle';

import dataSetting from '../../right/data/dataSetting.vue';
import dataColor from '../../right/data/dataColor.vue';

import viewSetting from '../../right/canvas/viewSetting.vue';
import tooltipSetting from '../../right/canvas/tooltipSetting.vue';
import canvasColor from '../../right/canvas/canvasColor.vue';
import tableHeadSetting from '../../right/canvas/tableHeadSetting.vue';
import tableCellSetting from '../../right/canvas/tableCellSetting.vue';

import { mapMutations } from 'vuex';
export const tableRight = {
  components: {
    viewSetting,
    dataColor,
    tooltipSetting,
    canvasColor,
    dataSetting,
    tableHeadSetting,
    tableCellSetting,
  },
  data () {
    return {
      defaultBgCss: {
        color: this.fontColor,
        background: '#ffffff',
        opacity: 100,
        index: 0,
      },
      color_list: [], //
      size_list: [],
      tooltip_list: [],
      table_title_list: [],
      configs: [],
      tableCellSetting: {},
      defaultTableCellSetting: {
        outter: {
          color: '#C2C9D1',
          width: 2,
        },
        inner: {
          color: '#C2C9D1',
          width: 1,
        },
        padding: {
          top: 0,
          left: 4,
          bottom: 0,
          right: 4,
          disabled_top_bottom: false,
          disabled_left_right: false,
        },
        cell: {
          width: 100,
          disabled: false,
        },
      },
      defaultDataSetting: [
        {
          title: this.$t('dashboard.default_data'),
          content: this.$t('dashboard.table_data_tip'),
          selected: true,
          values: [
            {
              val: 100,
            },
            {
              val: 1000,
            },
          ],
        },
        {
          title: this.$t('dashboard.all_data'),
          content: this.$t('dashboard.table_all_data_tip'),
          selected: false,
          values: [
            {
              val: null,
            },
            {
              val: null,
            },
          ],
        },
        {
          title: this.$t('dashboard.custom_data'),
          selected: false,
          content: [
            {
              val: 100,
              unit: this.$t('dashboard.columns'),
              disabled: true,
            },
            {
              val: 1000,
              unit: this.$t('dashboard.rows'),
              disabled: true,
            },
          ],
        },
      ],
      dataSetting: [],
      curStyle: {},
    };
  },
  methods: {
    ...mapMutations('drawingboard', ['setCurrentCanvasDetail']),
    initTableConfig () {
      this.dataColorInit();
      this.tableCellInit();
      this.tableDataInit();
      this.dataSettingInit();
      this.tooltipListInit();
      this.bgCssInit();
    },
    dataColorInit () {
      this.updateColorAndSize(this.curStyle); // this.chartConfig.styles
    },
    bgCssInit () {
      if (this.canvasCss.bgCss) {
        this.setFontColor(this.canvasCss.bgCss.color);
      } else {
        this.canvasCss.bgCss = JSON.parse(JSON.stringify(this.defaultBgCss));
        this.setFontColor(this.canvasCss.bgCss.color);
      }
    },
    titleCssInit () {
      if (!this.canvasCss.titleCss) {
        this.canvasCss.titleCss = {
          color: this.fontColor,
          opacity: 1,
        };
      }
    },
    dataSettingInit () {
      let defaultDataSetting = JSON.parse(
        JSON.stringify(this.defaultDataSetting)
      );
      this.dataSetting = this.canvasCss.data_setting
        ? this.canvasCss.data_setting
        : defaultDataSetting;
    },
    tableDataInit () {
      let tableTitleList = JSON.parse(JSON.stringify(this.table_title_list));
      this.table_title_list = [];
      tableTitleList.length > 0 &&
        tableTitleList.forEach((list) => {
          let curKey = typeof list === 'object' ? list.feature : list;
          let exit_table =
            this.canvasCss.tableTitleData &&
            this.canvasCss.tableTitleData.filter((t) => t.key === curKey);
          let temp = {
            key: curKey,
            display: 'auto',
            title: curKey,
            text: {
              align: 'left',
              fontSize: 12,
              fontColor: '#6B6B6B',
              fontStyle: 'normal',
              decoration: '',
              letterSpacing: '0',
              lineHeight: '24',
              sketchStyle: {},
            },
          };
          if (notEmpty(exit_table)) {
            this.table_title_list.push(exit_table[0]);
          } else {
            this.table_title_list.push(temp);
          }
        });
    },
    tableCellInit () {
      let css = this.canvasCss;
      let defaultTableSetting = JSON.parse(
        JSON.stringify(this.defaultTableCellSetting)
      );
      // 表格设置
      if (isDefined(css.tableSetting)) {
        this.tableCellSetting = css.tableSetting;
      } else {
        this.tableCellSetting = defaultTableSetting;
      }
      this.toggleTableInput(css.dashboard_viewMode);
    },
    toggleTableInput (val) {
      let setting = this.tableCellSetting;
      setting.padding.disabled_left_right = false;
      setting.padding.disabled_top_bottom = false;
      setting.cell.disabled = false;
      switch (val) {
        case 'full':
          setting.padding.disabled_left_right = true;
          setting.padding.disabled_top_bottom = true;
          setting.cell.disabled = true;
          break;
        case 'fitWidth':
          setting.padding.disabled_left_right = true;
          setting.cell.disabled = true;
          break;
        case 'fitHeight':
          setting.padding.disabled_top_bottom = true;
          break;
        default:
          break;
      }
    },
    tooltipListInit () {
      let tooltipList = JSON.parse(JSON.stringify(this.tooltip_list));
      this.tooltip_list = [];
      tooltipList.forEach((list) => {
        let exit =
          this.canvasCss.tooltipFormat &&
          this.canvasCss.tooltipFormat.filter((t) => t.key === list.feature);
        let format = {};
        if (list.type === 'linear') {
          if (list.isPercent) {
            format = {
              selectFormat: -1,
              decimal: '',
              prefix: '',
              suffix: '%',
              isPercent: true,
            };
          } else {
            format = {
              useThousandMark: true,
              selectFormat: -1,
              decimal: '',
              negative: '-1234',
              unit: '',
              prefix: '',
              suffix: '',
              zone: `¥ ${this.$i18n.t('message.rmb')}`,
            };
          }
        }
        let temp = {
          key: list.feature,
          display: 'auto',
          title: list.feature,
          text: {
            align: 'left',
            fontSize: 12,
            fontColor: '#6B6B6B',
            fontStyle: 'normal',
            decoration: '',
            letterSpacing: '0',
            lineHeight: '24',
            sketchStyle: {},
          },
          type: list.type,
        };
        if (notEmpty(exit)) {
          exit[0].type = list.type;
          this.tooltip_list.push(exit[0]);
        } else {
          this.tooltip_list.push({
            ...temp,
            format,
          });
        }
      });
    },
    // tableTitle
    tableTitleProcess (tableTitleList) {
      this.tableTitleData = [];
      tableTitleList.length > 0 &&
        tableTitleList.forEach((list) => {
          let exit_table =
            this.canvasCss.tableTitleData &&
            this.canvasCss.tableTitleData.filter((t) => t.key === list);
          let temp = {
            key: list,
            display: 'auto',
            title: list,
            text: {
              align: 'left',
              fontSize: 12,
              fontColor: '#6B6B6B',
              fontStyle: 'normal',
              decoration: '',
              letterSpacing: '0',
              lineHeight: '24',
              sketchStyle: {},
            },
          };
          if (notEmpty(exit_table)) {
            this.tableTitleData.push(exit_table[0]);
          } else {
            this.tableTitleData.push(temp);
          }
        });
    },
    formatOneNumber (format, type) {
      return formatOneNumber(format, type, this.$i18n);
    },
    drawCanvas ({ type = true, update = true }) {
      if (!this.jsonData || this.jsonData.length === 0) {
        return;
      }
      this.showLoading = true;

      // if (type) {
      // true 决定返回的数据格式
      let { chartSize: chart_size, containerSize: container_size } = getSize(
        this.$refs.chartMain,
        this.view_mode,
        this.chartArrs,
        false
      );
      console.log(chart_size);
      let { styles } = drawTable({
        data: this.jsonData,
        featureList: this.canvasFeatures,
        canvasCss: this.canvasCss, // 画布CSS
        ids: this.chartArrs.map((d) => d.id), // 根据ID找到图表的DOM载体
        chartSize: chart_size, // 图表的大小，格式为{width: 1080, height: 480}，可不提供
        containerSize: container_size, // 可滚动时候提供外div的宽高
      });
      // }

      this.showLoading = false;

      if (update) {
        // this.configs = ins.configs;
        this.updateColorAndSize(styles);
      }
      this.saveData('css', JSON.parse(JSON.stringify(this.canvasCss)));
    },
    updateColorAndSize (obj) {
      this.color_list = isArray(obj.colors) ? obj.colors : [];
      this.size_list = isArray(obj.sizes) ? obj.sizes : [];
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
      this.color_list.forEach((c, cIdx) => {
        c.list.forEach((m, idx) => {
          m.color = c.colors[idx];
          if (notEmpty(this.canvasCss.colorRanges)) {
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
        });
        let temp_color = this.canvasCss.colors.filter(
          (co) => co.key_id === c.key_id
        );
        if (notEmpty(temp_color)) {
        } else {
          this.canvasCss.colors.push({
            key_id: c.key_id,
            aggr: c.aggr,
            name: c.name,
          });
        }

        let temp_pattern = this.canvasCss.patterns.filter(
          (co) => co.key_id === c.key_id
        );

        if (notEmpty(temp_pattern)) {
        } else {
          this.canvasCss.patterns.push({
            key_id: c.key_id,
            aggr: c.aggr,
            name: c.name,
            patternList: {}, // patternList
          });
        }

        let temp_schemes = this.canvasCss.colors_and_opacities_list.filter(
          (co) => co.key_id === c.key_id
        );
        if (isEmpty(temp_schemes)) {
          this.canvasCss.colors_and_opacities_list.push({
            key_id: c.key_id,
            aggr: c.aggr,
            name: c.name,
            opacity: 100,
            schemes: [],
          });
        }
      });
    },
    saveData (key, value) {
      let worksheet = this.currentCanvasDetail;
      if (worksheet) {
        worksheet[key] = value;
        this.setCurrentCanvasDetail(worksheet);
        if (key === 'css') {
          modifyCss({
            canvasCss: this.canvasCss,
            projectId: this.projectId,
          });
          this.canvasCss.worksheetId = this.currentCanvasDetail.worksheet_id;
        }
      }
    },
    ///  以下是表格右边栏操作处理
    tableSettingProcess () {
      this.tableCellSetting = this.canvasCss.tableSetting;
    },
    tableTitleDataProcess () {
      this.table_title_list = this.canvasCss.tableTitleData;
      let data = this.canvasCss.tableTitleData;
      let new_data = [];
      data.forEach((d) => {
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
            'text-align': d.text.align,
          },
        });
      });
      this.canvasCss.tableTitleDataFormat = new_data;
    },
    titleStyleProcess (val) {
      let titleCss = {
        color: val,
        opacity: 100,
      };
      this.updateCanvasCss('titleCss', titleCss);
    },
    tooltipFormatProcess () {
      let toolTipData = this.canvasCss.tooltipFormat;

      let format = {};
      let text = {};
      let show = false;
      JSON.parse(JSON.stringify(toolTipData)).forEach((d) => {
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
    dataColorProcess ({ colors, colors_and_opacities_list }) {
      let colorList = this.color_list;
      if (colors) {
        let targetIndex = -1;
        let val = '';
        colorList[0].list.map((m, idx) => {
          if (colors[0].colorList[m.val]) {
            m.color = colors[0].colorList[m.val];
            targetIndex = idx;
            val = m.color;
          }
          if (targetIndex > -1) {
            this.color_list[0].colors[targetIndex] = val;
          }
        });

        this.color_list[0].colors.length = colorList[0].list.length;
        let arr = Array.from(this.color_list[0].colors);

        this.canvasCss.colors[0].colorList = arr;
        console.log(this.canvasCss.colors);
      }
      if (colors && colors_and_opacities_list) {
        let curColors = colors_and_opacities_list[0].schemes.slice(0, 2);
        this.color_list.filter(
          (i) => i.key_id === colors_and_opacities_list[0].key_id
        ).colors = curColors;

        this.color_list[0].list.map((m, idx) => {
          m.color = curColors[idx];
        });
        this.canvasCss.colors_and_opacities_list = colors_and_opacities_list;
      }
      if (colors_and_opacities_list) {
        this.canvasCss.colors_and_opacities_list = colors_and_opacities_list;
      }

      this.drawCanvas({
        update: true,
      });
    },
    dataTempChangeProcess (list) {
      this.color_list[0].list = list;
      list.forEach((i) => {
        this.color_list[0].colors[i.index] = i.color;
      });
      this.color_list[0].colors.length = list.length;
      let arr = Array.from(this.color_list[0].colors);
      this.canvasCss.colors[0].colorList = arr; // this.color_list[0].colors;
      this.drawCanvas({
        update: false,
      });
    },
    rangeProcess (list) {
      this.color_list[0].list = list;
      let range = [];
      let check = [];
      let val = [];
      list.forEach((i, idx) => {
        this.color_list[0].colors[i.index] = i.color;
        if (i.check) {
          range[idx] = i.originalVal;
        }
        // range.push(i.originalVal);
        check.push(i.check);
        val.push(i.val);
      });
      this.canvasCss.colorRanges = [
        {
          aggr: this.color_list[0].aggr,
          key_id: '0-0',
          range: range,
          check,
          val,
        },
      ];
      this.color_list[0].colors.length = list.length;
      let arr = Array.from(this.color_list[0].colors);

      this.canvasCss.colors[0].colorList = arr; // this.color_list[0].colors;
      this.drawCanvas({
        // update: false
      });
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
      this.drawCanvas({});
    },
    resetTooltipSetting (tooltipFormat, tooltipText) {
      this.tooltip_list.forEach((i) => {
        let textMatch = tooltipText.find((item) => item.key === i.key);
        let formatMatch = tooltipFormat.find((item) => item.key === i.key);
        if (textMatch) {
          i.text = textMatch.obj;
        }
        if (formatMatch) {
          i.format = formatMatch.obj;
        }
      });
      this.$set(this.canvasCss, 'tooltipFormat', this.tooltip_list);
      this.tooltipFormatProcess();
      // this.canvasCss.tooltipFormat = this.tooltipList;
    },
  },
};
