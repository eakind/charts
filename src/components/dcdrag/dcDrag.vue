<template>
  <div
    class="dc-drag"
    @mousedown.stop.prevent="mousedownHandler($event)"
    @touchmove.stop.prevent="moveHandler($event)"
    @click.stop="clickHandler"
    @touchend.stop.prevent="touchendHandler($event)"
    @touchstart.stop.prevent="mousedownHandler($event)"
  >
    <slot></slot>
  </div>
</template>

<script>
/*
 * startDrag 开始拖动
 * dragging  拖动中
 * stopDrag  拖动结束 (拖动的元素， 结束下面的元素)
 * */
import { mapState } from 'vuex';
export default {
  name: 'DcDrag',
  data () {
    return {
      element: null,
      moveFlag: false,
      timerFlag: null,
      disX: 0,
      disY: 0,
    };
  },
  computed: {
    ...mapState('dashboard', ['zoomSize']),
  },
  props: {
    // parent: {
    //   type: Boolean,
    //   default: false
    // },
    property: {
      type: String,
    },
    className: {
      type: String,
      default: 'gu-mirror',
    },
    clone: {
      type: Boolean,
      default: true,
    },
    hide: {
      type: Boolean,
      default: false,
    },
    zoomFlag: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    mousedownHandler (event) {
      this.element = this.clone
        ? event.currentTarget.cloneNode(true)
        : event.currentTarget;
      // if (this.parent) {
      //   this.element = event.currentTarget.parentNode.cloneNode(true);
      //   this.element.style.zoom = '0.1!important';
      // }
      this.element.className = this.element.className + ' ' + this.className;
      if (this.property === 'cat') {
        this.element.className = this.element.className + ' cat-active';
      } else if (this.property === 'int') {
        this.element.className = this.element.className + ' num-active';
      }
      this.element.style.visibility = this.hide ? 'hidden' : '';
      this.element.style.zoom = this.zoomSize;
      let touch = event.touches ? event.touches[0] : event;
      if (this.zoomFlag) {
        this.disX =
          touch.clientX / this.zoomSize - this.getOffset(touch.target).left;
        this.disY =
          touch.clientY / this.zoomSize - this.getOffset(touch.target).top;
      } else {
        this.disX = touch.clientX - this.getOffset(touch.target).left;
        this.disY = touch.clientY - this.getOffset(touch.target).top;
      }
      document.onmousemove = document.onmouseup = null;
      this.$emit('startDrag', this.disX, this.disY);
      let _this = this;
      if (this.timerFlag) {
        document.onmousemove = document.onmouseup = null;
        clearTimeout(this.timerFlag);
        this.timerFlag = null;
      }
      this.timerFlag = setTimeout(() => {
        document.onmousemove = function (event) {
          _this.moveHandler(event, _this);
        };
        document.onmouseup = function (event) {
          document.onmousemove = document.onmouseup = null;
          _this.touchendHandler(event);
        };
      }, 110);
    },
    moveHandler (event, _this) {
      _this = _this || this;
      if (!_this.moveFlag) {
        _this.moveFlag = true;
        document.body.appendChild(_this.element);
      }
      let touchmove = event.touches ? event.touches[0] : event;
      _this.element.style.left =
        touchmove.clientX / _this.zoomSize - _this.disX + 'px';
      _this.element.style.top =
        touchmove.clientY / _this.zoomSize - _this.disY + 'px';
      _this.element.style.display = 'none';
      let target = document.elementFromPoint(
        touchmove.clientX,
        touchmove.clientY
      );
      _this.element.style.display = '';
      _this.$emit(
        'dragging',
        _this.element,
        target,
        touchmove.clientX / _this.zoomSize,
        touchmove.clientY / _this.zoomSize
      );
    },
    touchendHandler (e) {
      let clientX = this.getCoord('clientX', e);
      let clientY = this.getCoord('clientY', e);
      if (!this.moveFlag) {
        return;
      }
      if (this.moveFlag) {
        this.moveFlag = false;
        document.body.removeChild(this.element);
      }
      let target = document.elementFromPoint(clientX, clientY);
      this.bus.$emit('hideTip');
      this.$emit('stopDrag', this.element, target, clientX, clientY);
      document.onmousemove = null;
      document.onmouseup = null;
    },
    clickHandler () {
      if (this.timerFlag) {
        clearTimeout(this.timerFlag);
        this.timerFlag = null;
        document.onmousemove = document.onmouseup = null;
      }
    },
    getOffset (el) {
      var rect = el.getBoundingClientRect();
      return {
        left: rect.left + this.getScroll('scrollLeft', 'pageXOffset'),
        top: rect.top + this.getScroll('scrollTop', 'pageYOffset'),
      };
    },
    getScroll (scrollProp, offsetProp) {
      if (typeof global[offsetProp] !== 'undefined') {
        return global[offsetProp];
      }
      // eslint-disable-next-line no-undef
      if (documentElement.clientHeight) {
        // eslint-disable-next-line no-undef
        return documentElement[scrollProp];
      }
      // eslint-disable-next-line no-undef
      return doc.body[scrollProp];
    },
    getEventHost (e) {
      if (e.targetTouches && e.targetTouches.length) {
        return e.targetTouches[0];
      }
      if (e.changedTouches && e.changedTouches.length) {
        return e.changedTouches[0];
      }
      return e;
    },
    getCoord (coord, e) {
      var host = this.getEventHost(e);
      var missMap = {
        pageX: 'clientX',
        pageY: 'clientY',
      };
      if (coord in missMap && !(coord in host) && missMap[coord] in host) {
        coord = missMap[coord];
      }
      return host[coord];
    },
  },
};
</script>

<style scoped lang="scss">
.dc-drag {
  margin: 0;
  min-width: 120px;
  padding-left: 3px;
}
</style>
