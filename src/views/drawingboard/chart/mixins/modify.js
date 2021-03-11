/**
 * 修改颜色 提示框 标签
 */
import { hexToRgba } from '@/utils/utils.js';
export const modifyMixin = {
  methods: {
    colorListProcess (list) {
      // 修改modifyCss
      this.colorList = list;
      this.$set(this.canvasCss, 'colorList', list);

      let color = list[0].list.map((i) => {
        let opacity = i.opacity || list[0].opacity || 100;
        if (i.color.indexOf('#') > -1) {
          return hexToRgba(i.color, opacity);
        }
        return i.color;
      });
      // 更新图表
      this.chartStyle.colorList = color;
      // 重新绘制
      this.draw();
      // 保存
      this.saveData('css', this.canvasCss);
    },
    colorRangeProcess (list, index) {
      this.$set(this.colorList[index], 'list', list);
      this.colorListProcess(this.colorList);
    },

    dataTempChangeProcess (list) {
      this.colorListProcess(list);
    },

    tooltipChange (list) {
      this.$set(this.canvasCss, 'tooltipList', list);
      this.$set(this.chartStyle, 'tooltipList', list);
      // 更新图表
      this.$refs[`${this.canvasType}Chart`].update('tooltip', list);

      this.saveData('css', this.canvasCss);
    },

    labelChange ({ list, noDrawFlag }) {
      this.$set(this.canvasCss, 'labelsList', list);
      this.$set(this.chartStyle, 'labelsList', list);

      !noDrawFlag && this.$refs[`${this.canvasType}Chart`].update('labels', list);
      let flag = false;
      let curTooltipList = this.tooltipList;
      list.forEach((i) => {
        curTooltipList = this.tooltipList.map((t) => {
          if (t.key === i.key) {
            flag = true;
            i.text.check && (t.text = i.text);
            i.format.check && (t.format = i.format);
          }
          return t;
        });
      });

      this.$set(this.canvasCss, 'tooltipList', curTooltipList);
      this.$set(this.chartStyle, 'tooltipList', curTooltipList);

      !noDrawFlag &&
        flag &&
        this.$refs[`${this.canvasType}Chart`].update('tooltip', curTooltipList);

      this.saveData('css', this.canvasCss);
    },

    changeTitleStyle (val) {
      let titleCss = {
        color: val,
        opacity: 100,
      };
      this.updateCanvasCss('titleCss', titleCss);
    },

    draw () {
      let dom = document.getElementById(
        `mc_${this.canvasType}_${this.currentCanvasDetail.worksheet_id}`
      );
      if (dom) {
        dom.innerHTML = '';
      }
      this.$refs[`${this.canvasType}Chart`].draw();
    },

    updateCanvasCss (type, value, drawFlag) {
      this.$set(this.canvasCss, type, value);
      typeof this[type + 'Process'] === 'function' && this[type + 'Process']();
      // 是否需要请求
      drawFlag ? this.drawChart() : this.draw();
    },

  },
};
