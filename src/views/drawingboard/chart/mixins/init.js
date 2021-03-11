/**
 * tooltipList(提示框),labelsList(标签),colorList(颜色)dataSetting(数据设置)  defaultBgCss(背景颜色)
 * 初始化
 */
export const initMixin = {
  data () {
    return {
      tooltipList: [],
      labelsList: [],
      colorList: [],
      dataSetting: [],
      // 默认数据设置
      defaultDataSetting: [
        {
          title: this.$t('dashboard.default_data'),
          content: '显示前1000',
          selected: true,
          values: [
            {
              val: 1000,
            },
          ],
        },
        {
          title: this.$t('dashboard.all_data'),
          content: '数据量较大时，不建议选择所有数据',
          selected: false,
          values: [
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
              val: 1000,
              unit: '',
              disabled: true,
            },
          ],
        },
      ],
      defaultBgCss: {
        color: this.fontColor,
        background: '#ffffff',
        opacity: 100,
        index: 0,
      },
      // 数据
      chartData: [],
      // 样式
      chartStyle: {},
    };
  },
  methods: {
    initTooltipList () {
      this.tooltipList = this.chartStyle.tooltipList || [];
      this.$set(this.canvasCss, 'tooltipList', this.tooltipList);
    },
    initLabelsList () {
      this.labelsList = this.chartStyle.labelsList || [];
      this.$set(this.canvasCss, 'labelsList', this.labelsList);
    },

    initDataSetting () {
      let defaultDataSetting = JSON.parse(
        JSON.stringify(this.defaultDataSetting)
      );
      this.dataSetting = this.canvasCss.data_setting
        ? this.canvasCss.data_setting
        : defaultDataSetting;
    },

    initBgCss () {
      if (this.canvasCss.bgCss) {
        this.setFontColor(this.canvasCss.bgCss.color);
      } else {
        this.canvasCss.bgCss = JSON.parse(JSON.stringify(this.defaultBgCss));
        this.setFontColor(this.canvasCss.bgCss.color);
      }
    },
  },
};
