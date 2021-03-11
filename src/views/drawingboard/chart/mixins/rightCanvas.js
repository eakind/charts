
import { formatOneNumber, setCanvasColor } from '../../utils/canvasStyle';
export const rightCanvasMix = {
  data () {
    return {
      lineRadiusObj: {
        text: '线粗细',
        size: 0,
        textObj: {
          left: '小', // this.$i18n.t('message.small'),
          right: '大', // this.$i18n.t('message.big')
        }
      },
      lineShapeObj: {
        text: '线点形状',
        list: [
          { id: 'circle', name: this.$i18n.t('message.default'), checked: true },
          { id: 'cross', name: this.$i18n.t('message.cross'), checked: false },
          { id: 'cross45', name: this.$i18n.t('message.cross45'), checked: false },
          { id: 'triangle', name: this.$i18n.t('message.triangle'), checked: false },
          { id: 'triangle180', name: this.$i18n.t('message.triangle180'), checked: false },
          { id: 'square', name: this.$i18n.t('message.square'), checked: false },
          { id: 'diamond', name: this.$i18n.t('message.diamond'), checked: false },
          { id: 'star', name: this.$i18n.t('message.star'), checked: false }
        ],
      }
    };
  },
  mounted () {

  },
  methods: {
    initPointStyle () {
      this.lineRadiusObj.size = this.canvasCss.size_line || 50;
      this.canvasCss.point_style = this.canvasCss.point_style || 'circle';
      this.lineShapeObj.list.map(i => {
        if (i.id === this.canvasCss.point_style) {
          i.checked = true;
        } else {
          i.checked = false;
        }
      });
      // console.log(this.canvasCss);
    },
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
      let format = {}; let text = {}; // let show = false;
      JSON.parse(JSON.stringify(data)).forEach(d => {
        let format_d3 = formatOneNumber(d.format, 0, this.$i18n);
        format[d.key] = format_d3;
        let new_d = JSON.parse(JSON.stringify(d));
        let text_modified = new_d.text;
        text_modified.title = new_d.title;
        text_modified.display = new_d.display;
        text[d.key] = text_modified;
        // if (text_modified.display === 'auto') // show = true;
      });
      // this.configs.forEach(c => {
      //   c.config.tooltip.format = format;
      //   c.config.tooltip.text = text;
      //   c.config.tooltip.show = show;
      // });
      this.canvasCss.tooltipNumberFormat = format;
      this.canvasCss.tooltipTextFormat = text;
      this.drawChart();
    },
    changeBg (bgCss) {
      this.$set(this.canvasCss, 'bgCss', bgCss);
      if (bgCss.color) {
        setCanvasColor(this.canvasCss.axis_style, this.canvasCss.textSettings, bgCss.color);
        this.changeTitleFont(bgCss.color);
      }
      this.saveCss();
      this.drawChart();
    },
    // 修改画布标题样式
    changeTitleFont (fontColor) {
      let titleCss = {
        color: fontColor
      };
      this.$set(this.canvasCss, 'titleCss', titleCss);
      this.saveCss();
    },
    changeUnit (unit) {
      this.$set(this.canvasCss, 'hasUnit', unit);
      this.saveCss();
      this.drawChart();
    },
    radiusProcess (type, val, item) {
      if (type === 'radius') {
        this.$set(this.canvasCss, 'size_line', val);
      } else {
        this.$set(this.canvasCss, 'point_style', item.id);
        this.lineShapeObj.list = val;
      }
      this.drawChart();
    }
  }
};
