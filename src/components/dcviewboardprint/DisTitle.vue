<template>
  <div class="display-title"
      :style="[objCss, wStyle, textCss]">{{title}}</div>
</template>

<script>
import { hexToRgba } from '@/utils/utils';

export default {
  props: {
    title: {
      type: String
    },
    titleCss: {
      type: Object
    },
    padding: {
      type: [String, Number]
    },
    border: {
      type: [String, Number]
    }
  },
  computed: {
    objCss () {
      const data = this.titleCss;
      return {
        ...data,
        position: data.left === '0px' && data.top === '0px' ? 'relative' : 'absolute',
        zIndex: data.left === '0px' && data.top === '0px' ? '1' : '999999',
        background: hexToRgba(data.background, data.bgOpacity)
      };
    },
    wStyle () {
      let width =
        Number(String(this.objCss.width).split('px')[0]) -
          this.border * 2 -
          this.padding * 2;
      return {
        width: width + 'px!important'
      };
    },
    textCss () {
      const obj = this.titleCss;
      return {
        color: hexToRgba(obj.color, obj.opacity),
        fontSize: obj.fontSize,
        fontStyle: obj.fontStyle,
        fontWeight: obj.fontWeight,
        lineHeight: obj.lineHeight,
        textAlign: obj.textAlign,
        textDecoration: obj.textDecoration,
        letterSpacing: obj.letterSpacing
      };
    },
  }
};
</script>

<style lang="scss" scoped>
.display-title {
  display: block;
  z-index: 100;
  position: relative;
  width: 100%;
  border: none;
  box-sizing: border-box;
  white-space: pre-wrap;
}
</style>
