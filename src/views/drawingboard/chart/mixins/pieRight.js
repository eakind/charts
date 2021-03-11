import dataSetting from '../../right/data/dataSetting.vue';
import viewSetting from '../../right/canvas/viewSetting.vue';
import dataColor from '../../right/data/dataColor.vue';
import chartStyle from '../../right/data/chartStyle';
import tooltipSetting from '../../right/canvas/tooltipSetting.vue';
import canvasColor from '../../right/canvas/canvasColor.vue';
// import { drawPie } from '@/utils/draw/drawPie';
// import { isArray } from '@/utils/check.js'; // notEmpty, isDefined, isEmpty,
// import { getSize } from '../../utils/canvasStyle';

export const pieRight = {
  components: {
    viewSetting,
    dataColor,
    tooltipSetting,
    canvasColor,
    chartStyle,
    dataSetting,
  },
  data () {
    return {
      shapeObj: {
        text: '外形',
        list: [
          {
            checked: true,
            name: this.$i18n.t('message.pie_circle'),
            id: 1,
            radius: 0,
          },
          {
            checked: false,
            name: this.$i18n.t('message.pie_donut'),
            id: 2,
            radius: 1,
          },
        ],
      },
      radiusObj: {
        text: '半径',
        size: 70,
        textObj: {
          left: '小', // this.$i18n.t('message.small'),
          right: '大', // this.$i18n.t('message.big')
        },
        max: 120,
        min: 20,
      },
    };
  },
  methods: {

    initShape () {
      let flag = !this.canvasCss.innerRadius;
      this.shapeObj.list[0].checked = flag;
      this.shapeObj.list[1].checked = !flag;
      if (flag) {
        this.radiusObj.size = this.canvasCss.size || 70;
        this.$set(this.radiusObj, 'max', 120);
      } else {
        this.$set(this.radiusObj, 'max', 100);
        this.radiusObj.size = this.canvasCss.size || 60;
        if (this.canvasCss.size > 100) {
          this.radiusObj.size = 60;
        }
      }
    },

    // dataTempChangeProcess (list) {
    //   this.colorList[0].list = list;
    //   if (this.colorList[0].colored_type === 'ordinal') {
    //     list.forEach((i) => {
    //       this.colorList[0].colors[i.val] = i.color;
    //     });
    //   } else {
    //     list.forEach((i) => {
    //       this.colorList[0].colors[i.index] = i.color;
    //     });
    //   }
    //   let arr = JSON.parse(JSON.stringify(this.colorList[0].colors));
    //   if (this.colorList[0].colored_type === 'linear') {
    //     this.colorList[0].colors.length = list.length;
    //     arr = Array.from(this.colorList[0].colors);
    //   }
    //   this.canvasCss.colors[0].colorList = arr;
    //   this.drawCanvas();
    // },

    // 图表样式
    chartStyleProcess (type, list, item) {
      typeof this[type + 'Process'] === 'function' &&
        this[type + 'Process'](list, item);
    },

    shapeProcess (list, item) {
      if (item.radius === 0) {
        this.radiusObj.size = 70;
        this.canvasCss.size = 70;
        this.$set(this.radiusObj, 'max', 120);
      } else {
        this.radiusObj.size = 60;
        this.canvasCss.size = 60;
        this.$set(this.radiusObj, 'max', 100);
      }
      this.shapeObj.list = list;
      this.canvasCss.innerRadius = item.radius;
      this.drawCanvas({ update: false });
    },
    radiusProcess (val) {
      this.canvasCss.size = val;
      this.drawCanvas({});
    },

    changePercent ({ checked, type }) {
      this.$set(this.canvasCss, type, checked);
      this.bgCssProcess();
      this.drawCanvas();
    },
  },
};
