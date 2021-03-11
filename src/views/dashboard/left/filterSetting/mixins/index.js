import { mapState } from 'vuex';
import { hexToRgba } from '@/utils/utils.js';
export default {
  data () {
    return {
      bcolor: 'background-color: #F5282D; opacity: 1; border-width: 1px; border-color: undefined; border-style: none',
      tempStyle: {
        title: {
          showFlag: true,
          fontSize: 14,
          textAlign: 'left',
          colorStyle: {
            background: '#4284F5',
            bgSelected: true,
            opacity: 100
          }
        },
        global: {
          bgColor: {
            bgSelected: false
          },
          border: {
            bgSelected: 'none'
          }
        }
      }
    };
  },
  mounted () {
  },
  computed: {
    ...mapState('dashboard', ['currentTarget']),
    titleStyle () {
      // if (this.currentTarget && this.currentTarget.style && this.currentTarget.style.title) {
      //   return `color: ${this.currentTarget.style.title.colorStyle.background}; font-size: ${this.currentTarget.style.title.fontSize}px; text-align: ${this.currentTarget.style.title.textAlign}`;
      // }
      let style = this.styleObj ? this.styleObj.title : null;
      if (!style) {
        style = this.tempStyle.title;
      }
      let obj = {};
      obj.display = style.showFlag ? 'block' : 'none';
      obj.color = style.colorStyle.background;
      obj.fontSize = style.fontSize + 'px';
      obj.textAlign = style.textAlign;
      return obj;
    },
    globalStyle () {
      // if (this.currentTarget && this.currentTarget.style && this.currentTarget.style.global) {
      //   return `background-color: ${this.currentTarget.style.global.bgColor.background}; opacity: ${this.currentTarget.style.global.bgColor.opacity / 100}; border-width: 1px, border-color: ${this.currentTarget.style.global.border.background}; border-style: ${this.currentTarget.style.global.border.bgSelected}`;
      // }
      let style = this.styleObj ? this.styleObj.global : null;
      if (!style) {
        style = this.tempStyle.global;
      }
      let obj = {};
      let { background = '#fff', opacity = 100, bgSelected } = style.bgColor;
      if (bgSelected) {
        obj.background = background;
        obj.background = hexToRgba(obj.background, opacity);
      } else {
        obj.background = background;
        obj.background = hexToRgba(obj.background, 0);
      }
      if (style.border.bgSelected !== 'none') {
        obj['border-color'] = hexToRgba(style.border.background, style.border.opacity);
        if (style.border.bgSelected === 'bold') {
          obj['border-width'] = '2px';
          obj['border-style'] = 'solid';
        } else {
          obj['border-width'] = '1px';
          obj['border-style'] = style.border.bgSelected;
        }
      }
      return obj;
    }
  }
};
