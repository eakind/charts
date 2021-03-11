
import { formatOneNumber } from '../../utils/canvasStyle';
export const rightCanvasMix = {
  data () {
    return {
    };
  },
  methods: {
    combinedHandler (boolean) {
      this.$set(this.canvasCss.axis_style, 'combined', boolean);
      this.drawChart();
    },
    // 修改坐标轴
    changeAxis (fontList, axisList) {
      this.$set(this.canvasCss.axis_style, 'fontList', fontList);
      this.$set(this.canvasCss.axis_style, 'axisList', axisList);
      this.drawChart();
    },
    // 修改网格线
    changeGrid (gridStyle, gridShow) {
      this.$set(this.canvasCss.axis_style, 'grid_style', gridStyle);
      this.$set(this.canvasCss.axis_style, 'grid_show', gridShow);
      this.drawChart();
    },
    // 修改刻度值
    changeScale (scaleList) {
      this.$set(this.canvasCss.axis_style, 'scaleList', scaleList);
      this.drawChart();
    },
    // 修改刻度范围
    changeScope (scopeList) {
      this.$set(this.canvasCss.axis_style, 'scopeList', scopeList);
      this.$set(this.canvasCss, 'selectFromChart', false);
      for (let i = 0; i < scopeList.length; i++) {
        if (scopeList[i].select === 1) {
          this.$set(this.canvasCss, 'selectFromChart', true);
        }
      }
      this.drawChart();
    },
    // 修改tooltip
    changeTooltip (data) {
      this.toolTipData = data;
      this.canvasCss.tooltipFormat = data;
      let format = {}; let text = {}; let show = false;
      JSON.parse(JSON.stringify(data)).forEach(d => {
        let format_d3 = formatOneNumber(d.format, 0, this.$i18n);
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
      this.drawChart();
    },
    // 修改画布标题样式
    changeTitleFont (fontColor) {
      let titleCss = {
        color: fontColor
      };
      this.$set(this.canvasCss, 'titleCss', titleCss);
    },
    changeUnit (unit) {
      this.$set(this.canvasCss, 'hasUnit', unit);
      this.saveCss();
      this.drawChart();
    }
  }
};
