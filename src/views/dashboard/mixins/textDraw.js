import { hexToRgba, setLineHeight } from '@/utils/utils.js';
import { isEmpty } from 'lodash';
import { mapState } from 'vuex';
export default {
  data () {
    return {
      tempStyle: {
        showFlag: true,
        colorStyle: {
          bgSelected: true,
          background: '#000',
          opacity: 100,
        },
        fontSize: 14,
        textAlign: 'center',
        fontStyle: [],
        bgColor: {
          bgSelected: false,
          opacity: 100
        },
        padding: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
        isLock: true,
        border: {
          bgSelected: 'none',
        },
      },
    };
  },
  computed: {
    ...mapState('dashboard', ['currentDashboardDetail']),
    curStyle () {
      let style = this.styleObj ? this.styleObj.title : null;
      if (!style) {
        style = this.tempStyle;
      }
      let obj = {};
      obj.display = style.showFlag ? 'block' : 'none';
      let { background = '#fff', opacity = 100, bgSelected } = style.bgColor;
      if (bgSelected) {
        obj.background = hexToRgba(background, opacity);
      }
      let fontColor = style.colorStyle.background;
      let fontOpacity = style.colorStyle.opacity;
      if (isEmpty(this.currentDashboardDetail)) return;
      if (fontColor) {
        const dashboardBg = this.currentDashboardDetail.css.dashboard.bgColor;
        if (dashboardBg.bgSelected && (fontColor === '#000' || fontColor.toLocaleLowerCase() === '#ffffff')) {
          fontColor = dashboardBg.background.color;
          fontOpacity = dashboardBg.opacity;
        }
        if (!dashboardBg.bgSelected && fontColor.toLocaleLowerCase() === '#ffffff') {
          fontColor = '#6b6b6b';
        }
      }
      obj.color = hexToRgba(fontColor, fontOpacity);
      obj.fontSize = style.fontSize + 'px';
      obj.textAlign = style.textAlign;
      let { top, left, right, bottom } = style.padding || {};
      obj.padding = `${top}px ${right}px ${bottom}px ${left}px`;
      let { fontStyle } = style;
      // 'bold', 'italic', 'underline'
      if (fontStyle) {
        let pare = {
          bold: 'fontWeight',
          underline: 'textDecoration',
          italic: 'fontStyle',
        };
        // obj[pare[fontStyle]] = fontStyle;
        for (const fs of fontStyle) {
          obj[pare[fs]] = fs;
        }
      }
      Object.assign(obj, this.retBorderStyle(style.border));
      obj.lineHeight = setLineHeight(style.fontSize);
      return obj;
    },
  },
  methods: {
    retBorderStyle (border) {
      let obj = {};
      if (border && border.bgSelected) {
        let {
          background: bBackground,
          opacity: bOpacity,
          bgSelected: bBgSelected,
        } = border;
        obj.borderColor = bBackground
          ? hexToRgba(bBackground, bOpacity)
          : '#DEDEDE';
        obj.borderStyle = bBgSelected === 'bold' ? 'solid' : bBgSelected;
        obj.borderWidth = bBgSelected === 'bold' ? '2px' : '1px';
      }
      return obj;
    }
  }
};
