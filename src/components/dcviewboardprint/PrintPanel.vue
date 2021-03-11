<template>
  <div class="board-print" :class="isPrinting || !imgInfo.url ? 'hide-controller' : ''" :style="bgStyle" ref="paper">
    <button @click="onRotateClick" v-show="!isPrinting">旋转</button>
    <button @click="setDefaultStyles">使用默认布局</button>
    <div ref="moveable" class="moveable">
      <img class="drag-img" :src="imgInfo.url" v-if="imgInfo.url" />
    </div>
  </div>
</template>

<script>
import { Frame } from 'scenejs';
import Moveable from 'moveable';

export default {
  props: {
    isPrinting: Boolean,
    dashboardId: String,
    paperWidth: Number, // 纸张宽度，px
    paperHeight: Number,
    dashboardStyles: Object, // 内容布局信息
    imgInfo: {
      type: Object,
      default () {
        return { url: '', width: 0, height: 0 };
      }
    },
  },
  data () {
    return {
      frame: {},
      dashboardDetail: {},
      legends: [],
      moveable: {},
      defaultRatio: 0.85, // 默认缩放大小
    };
  },
  computed: {
    bgStyle () { // 纸张样式
      return {
        background: '#fff',
        width: this.paperWidth + 'px',
        height: this.paperHeight + 'px',
      };
    },
  },
  watch: {
    imgInfo: {
      handler () {
        this.initStyles();
      },
      deep: true,
      immediate: true
    },
    paperHeight (val) {
      this.moveable.horizontalGuidelines = [Math.round(val / 2)];
    },
    paperWidth (val) {
      this.moveable.verticalGuidelines = [Math.round(val / 2)];
    }
  },
  mounted () {
    this.initMoveable();
    this.addKeyEvents(); // 按下 ctrl 或 cmd/alt 时固定比例缩放
  },
  destroyed () {
    this.moveable.destroy();
    this.removeKeyEvents();
  },
  methods: {
    async onRotateClick () {
      const bounds = Object.assign({}, this.moveable.bounds);
      const moveable = this.moveable;
      this.moveable.bounds = {}; // hack, 旋转后超出边界, 无法旋转, 所以去掉边界
      await this.$nextTick();
      moveable.request('rotatable', { deltaRotate: 90, isInstant: true });
      await this.$nextTick();
      this.moveable.bounds = bounds; // 恢复边界
      moveable.updateTarget();
      moveable.updateRect();
    },
    onDragStart ({ set }) {
      const x = parseFloat(this.frame.get('transform', 'translateX'));
      const y = parseFloat(this.frame.get('transform', 'translateY'));
      set([x, y]);
    },
    onDrag ({ target, beforeTranslate }) {
      this.frame.set('transform', 'translateX', `${beforeTranslate[0]}px`);
      this.frame.set('transform', 'translateY', `${beforeTranslate[1]}px`);
      target.style.cssText += this.frame.toCSS();
      this.emitStyles();
    },
    onResizeStart ({ setOrigin, dragStart }) {
      setOrigin(['%', '%']);
      if (dragStart) {
        const x = parseFloat(this.frame.get('transform', 'translateX'));
        const y = parseFloat(this.frame.get('transform', 'translateY'));
        dragStart.set([x, y]);
      }
    },
    onResize ({ target, width, height, drag }) {
      this.frame.set('width', `${width}px`);
      this.frame.set('height', `${height}px`);

      this.frame.set('transform', 'translateX', `${drag.beforeTranslate[0]}px`);
      this.frame.set('transform', 'translateY', `${drag.beforeTranslate[1]}px`);

      target.style.cssText += this.frame.toCSS();
      this.emitStyles();
    },
    onRotateStart ({ set }) {
      const deg = parseFloat(this.frame.get('transform', 'rotate'));
      set(deg);
    },
    onRotate ({ target, beforeRotate }) {
      this.frame.set('transform', 'rotate', `${beforeRotate}deg`);
      target.style.cssText += this.frame.toCSS();
      this.emitStyles();
    },
    emitStyles () {
      const styles = this.frame.properties;
      const { translateX, translateY, rotate } = styles.transform || {};
      const dashboardStyles = {
        width: parseInt(styles.width),
        height: parseInt(styles.height),
        left: parseInt(translateX),
        top: parseInt(translateY),
        rotate: parseInt(rotate),
      };
      this.$emit('styled', this.dashboardId, dashboardStyles);
    },
    async initStyles () {
      await this.$nextTick();
      if (this.dashboardStyles) {
        this.setStyles(this.dashboardStyles);
      } else {
        this.setDefaultStyles();
      }
    },
    setDefaultStyles () {
      if (!this.imgInfo.width) return;
      const parentWidth = parseInt(this.paperWidth);
      const width = parseInt(parentWidth * this.defaultRatio);
      const height = parseInt(this.imgInfo.height / this.imgInfo.width * parentWidth * this.defaultRatio);
      const left = parseInt(parentWidth * (1 - this.defaultRatio) / 2) + 1;
      const verticalPadding = (parseInt(this.paperHeight) - this.h) / 2;
      const top = verticalPadding < 100 ? parseInt(verticalPadding) : 100;
      this.setStyles({ width, height, left, top });
    },
    async setStyles ({ width, height, left, top, rotate = 0 }) {
      const moveable = this.$refs.moveable;
      if (!moveable) { return; }
      this.frame = new Frame({
        width: width + 'px',
        height: height + 'px',
        transform: {
          translateX: left + 'px',
          translateY: top + 'px',
          rotate: rotate + 'deg',
        },
      });
      this.moveable.target.style.cssText += this.frame.toCSS();
      await this.$nextTick();
      this.moveable.updateRect();
    },
    initMoveable () {
      const moveableOptions = {
        target: this.$refs.moveable,
        snappable: true, // 开启边界, 对齐线
        draggable: true,
        resizable: true,
        rotatable: true,
        wrappable: false,
        snapThreshold: 15,
        snapCenter: true,
        throttleDrag: 1,
        keepRatio: false,
        throttleResize: 1,
        origin: false,
        horizontalGuidelines: [Math.round(this.paperHeight / 2)], // 对齐线设置
        verticalGuidelines: [Math.round(this.paperWidth / 2)], // 对齐线设置
        bounds: { // 边界设置
          left: 0,
          top: 0,
          right: this.paperWidth,
          bottom: this.paperHeight,
        },
      };
      this.moveable = new Moveable(this.$refs.paper, moveableOptions);
      this.moveable
        .on('dragStart', this.onDragStart)
        .on('drag', this.onDrag)
        .on('resizeStart', this.onResizeStart)
        .on('resize', this.onResize)
        .on('rotateStart', this.onRotateStart)
        .on('rotate', this.onRotate);
    },
    onLockKeydown (e) {
      if (e.ctrlKey || e.altKey || e.metaKey) {
        this.moveable.keepRatio = true;
      }
    },
    onLockKeyup (e) {
      if (e.ctrlKey || e.altKey || e.metaKey) {
        this.moveable.keepRatio = false;
      }
    },
    addKeyEvents () {
      // 按下 ctrl 或 cmd/alt 时固定比例缩放
      document.body.addEventListener('keydown', this.onLockKeydown);
      document.body.addEventListener('keyup', this.onLockKeyup);
    },
    removeKeyEvents () {
      document.body.removeEventListener('keydown', this.onLockKeydown);
      document.body.removeEventListener('keyup', this.onLockKeyup);
    },
  }
};
</script>

<style lang='scss' scoped>
.board-print {
  position: relative;
  width: 100%;
  height: 100%;
  white-space: nowrap;
  box-sizing: border-box;
  overflow: hidden;
}
.drag-img {
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.moveable {
  position: absolute;
}
.board-print /deep/ {
  .moveable-rotation-line { // 隐藏旋转 rotate 控制器
    display: none;
  }
}
.hide-controller /deep/ {
  .moveable-control-box {
    display: none!important;
  }
}
</style>
