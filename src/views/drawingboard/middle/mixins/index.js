import { modifyCss, formatOneNumber } from '../../utils/canvasStyle';
import { notEmpty } from '@/utils/check.js';
import { mapMutations } from 'vuex';
export default {
  data () {
    return {
      // 默认背景色
      defaultBgCss: {
        color: this.fontColor,
        background: '#ffffff',
        opacity: 100,
        index: 0,
      },
    };
  },
  methods: {
    ...mapMutations('drawingboard', ['setCurrentCanvasDetail']),
    /**
     * 保存css
     * @param {*} key
     * @param {*} value
     */
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
    retInitTooltipList (tooltipList) {
      let retList = [];
      tooltipList.forEach((list) => {
        let exit =
          this.canvasCss.tooltipFormat &&
          this.canvasCss.tooltipFormat.filter((t) => t.key === list.feature);
        let format = {};
        if (list.type === 'linear') {
          if (list.isPercent) {
            format = {
              selectFormat: 'percent',
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
          retList.push(exit[0]);
        } else {
          retList.push({
            ...temp,
            format,
          });
        }
      });
      return retList;
    },
    formatOneNumber (format, type) {
      return formatOneNumber(format, type, this.$i18n);
    },
    changeLabelFormat ({
      labelList,
      labelText,
      list,
      tooltipFormat,
      tooltipText,
      noDrawFlag,
    }) {
      this.$set(this.canvasCss, 'labelList', labelList);
      this.$set(this.canvasCss, 'textSettings', labelText);
      this.$set(this.canvasCss, 'labelStyle', list);
      this.resetTooltipSetting(tooltipFormat, tooltipText);
      if (!noDrawFlag) {
        this.drawCanvas({});
      }
    },
    resetTooltipSetting (tooltipFormat, tooltipText) {
      this.tooltipList.forEach((i) => {
        let textMatch = tooltipText.find((item) => item.key === i.key);
        let formatMatch = tooltipFormat.find((item) => item.key === i.key);
        if (textMatch) {
          i.text = textMatch.obj;
        }
        if (formatMatch) {
          i.format = formatMatch.obj;
        }
      });

      this.$set(this.canvasCss, 'tooltipFormat', this.tooltipList);
      this.tooltipFormatProcess();
      // this.canvasCss.tooltipFormat = this.tooltipList;
    },
  },
};
