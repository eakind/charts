import dataSetting from '../../right/data/dataSetting.vue';
import dataColor from '../../right/data/dataColor.vue';
import chartStyle from '../../right/data/chartStyle';
import viewSetting from '../../right/canvas/viewSetting.vue';
import tooltipSetting from '../../right/canvas/tooltipSetting.vue';
import canvasColor from '../../right/canvas/canvasColor.vue';

export const bubbleRight = {
  components: {
    viewSetting,
    dataColor,
    tooltipSetting,
    canvasColor,
    chartStyle,
    dataSetting
  },
  data () {
    return {
      colorList: [],
      sizeList: [],
      tooltipList: [],
      dataSetting: [],
      curStyle: {},
      shapeObj: {
        text: '外形',
        list: [{
          checked: true,
          name: this.$i18n.t('message.default'),
          id: -1,
        },
        {
          checked: false,
          name: this.$i18n.t('message.layout1'),
          id: 0,
        }, {
          checked: false,
          name: this.$i18n.t('message.layout2'),
          id: 1,
        }
        ],
      },
      radiusObj: {
        text: '半径',
        size: 60,
        textObj: {
          left: '小', // this.$i18n.t('message.small'),
          right: '大', // this.$i18n.t('message.big')
        },
        min: 20,
        max: 100
      }
    };
  },
  methods: {

    initShape () {
      let id = typeof this.canvasCss.orderStyle === 'undefined' ? -1 : this.canvasCss.orderStyle;
      this.shapeObj.list.map(i => {
        if (i.id === id) {
          i.checked = true;
        } else {
          i.checked = false;
        }
      });
      this.radiusObj.size = this.canvasCss.size || 60;
      this.$set(this.canvasCss, 'size', this.radiusObj.size);
    },

    // 图表样式
    chartStyleProcess (type, list, item) {
      typeof this[type + 'Process'] === 'function' && this[type + 'Process'](list, item);
    },
    shapeProcess (list, item) {
      this.shapeObj.list = list;
      this.$set(this.canvasCss, 'orderStyle', item.id);
      this.drawCanvas();
    },
    radiusProcess (val) {
      this.canvasCss.size = val;
      this.drawCanvas();
    },
  }
};
