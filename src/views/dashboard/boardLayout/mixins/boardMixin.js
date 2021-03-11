import { isEmpty } from 'lodash';
import { mapState } from 'vuex';
import { refreshCanvasMixin } from './refreshCanvas.js';
const WH = {
  top: 'height',
  bottom: 'height',
  left: 'width',
  right: 'width',
};
export const boardMixin = {
  mixins: [refreshCanvasMixin],
  data () {
    return {
      activeItem: null,
      minWidth: 1,
      startX: 0,
      startY: 0,
      startW: 0,
      isMove: false
    };
  },
  mounted () {
    document.addEventListener('mouseup', () => {
      if (this.isMove) {
        if (this.currentDashboardDetail.css.device === 'mobile') {
          this.$emit('change', this.layoutList);
        } else {
          this.$emit('change', this.list);
        }
        this.refreshLayout();
        this.isMove = false;
        this.activeItem = null;
        this.$el.removeEventListener('mousemove', this.mouseMove, false);
      }
    });
  },
  computed: {
    ...mapState('dashboard', ['currentDashboardDetail', 'fullScreen', 'layoutList']),
  },
  methods: {
    showEditor (item) {
      if (this.fullScreen) return;
      if (item.type !== 'text' && item.type !== 'title') return;
      if (item.idx === this.selectedTarget.idx) {
        this.showTextEditFlag = true;
      }
    },
    setTextHandler () {
      this.showTextEditFlag = true;
    },
    closeEdit () {
      this.showTextEditFlag = false;
    },
    isDrag (item) {
      return item.idx === this.selectedTarget.idx;
    },
    isMenuPosition (item) {
      let styleObj = {
        left: 'right',
        right: 'left',
        bottom: 'left',
        top: 'left',
      };
      let obj = {
        top: '-2px',
      };
      let value = 0;
      if (item.isDir === 'left' || item.isDir === 'right') value = -18;
      obj[styleObj[item.isDir]] = `${value}px`;
      return obj;
    },
    isMenuList (item) {
      return item.idx === this.selectedTarget.idx && item.type !== 'title';
    },
    setStyle (item) {
      if (isEmpty(this.currentDashboardDetail)) return;
      let isLegend = this.currentDashboardDetail.css.isShowLegend;
      if (this.currentDashboardDetail.css.device === 'mobile') {
        let height = item.mobileHeight || 360;
        if (item.type === 'title') {
          height = 30;
        } else if (item.type === 'filter') {
          height = 120;
        }
        return {
          height: `${height}px`
        };
      } else {
        let width = item.width;
        if (item.type === 'title' && isLegend) {
          let dom = document.querySelector('.container');
          if (dom) {
            width = dom.clientWidth;
          }
        }
        return {
          width: width > 100 ? `${width}px` : `${width}%`,
          height: `${item.height}%`,
          'flex-direction': item.dir
        };
      }
    },
    isResizeLine (item, index, list) {
      if (item.isDir === 'right' || item.isDir === 'bottom') {
        return false;
      }
      return true;
    },
    mouseDown (event, itemData) {
      if (this.fullScreen) return;
      this.activeItem = itemData;
      this.startX = event.pageX;
      this.startY = event.pageY;
      if (this.currentDashboardDetail.css.device === 'mobile') {
        this.startW = itemData.mobileHeight || 360;
      } else {
        this.startW = itemData[WH[itemData.isDir]];
      }
      this.$el.addEventListener('mousemove', this.mouseMove, false);
    },
    isOut (clientX, clientY) {
      let layoutDom = document.querySelector('.board-layout');
      let layoutLeft = layoutDom.getBoundingClientRect().left;
      let layoutRight = layoutDom.getBoundingClientRect().right;
      let layoutTop = layoutDom.getBoundingClientRect().top;
      if (clientX < layoutLeft + 10 || clientX > layoutRight - 10) return true;
      if (clientY < layoutTop + 10) return true;
    },
    mouseMove (event) {
      let top = event.currentTarget.getBoundingClientRect().top;
      if (event.clientY < top + 10) {
        this.$el.removeEventListener('mousemove', this.mouseMove, false);
      }
      if (this.isOut(event.clientX, event.clientY)) {
        this.$el.removeEventListener('mousemove', this.mouseMove, false);
      }
      if (this.activeItem) {
        let startOffset = 0;
        const dirObj = {
          left: true,
          right: true,
        };
        const isRow = dirObj[this.activeItem.isDir];
        if (isRow) {
          startOffset = this.startX;
        } else {
          startOffset = this.startY;
        }
        const currentPage = isRow ? event.pageX : event.pageY;
        const currentOffset = isRow
          ? event.currentTarget.offsetWidth
          : event.currentTarget.offsetHeight;
        if (this.currentDashboardDetail.css.device === 'mobile') {
          let getMHeight = this.startW + currentPage - startOffset;
          this.$set(this.activeItem, 'mobileHeight', Number(getMHeight));
          // this.resizeList(this.list, this.activeItem);
          this.isMove = true;
        } else {
          let currentPercent = +Math.floor(
            (((currentPage - startOffset) / currentOffset) * 10000) / 100
          ).toFixed(2);
          currentPercent = this.startW + currentPercent;
          if (
            currentPercent > this.minWidth &&
            currentPercent < 100 - this.minWidth
          ) {
            this.isMove = true;
            this.resizeLayout(currentPercent, this.activeItem);
          }
        }
        // let currentPercent = +Math.floor(
        //   (((currentPage - startOffset) / currentOffset) * 10000) / 100
        // ).toFixed(2);
        // currentPercent = this.startW + currentPercent;
        // if (
        //   currentPercent > this.minWidth &&
        //   currentPercent < 100 - this.minWidth
        // ) {
        //   this.isMove = true;
        //   this.resizeLayout(currentPercent, this.activeItem);
        // }
      }
    },
    resizeLayout (percent, item) {
      this.$set(item, WH[item.isDir], Number(percent));
      if (item.isDir === 'left' || item.isDir === 'right') {
        this.resizeList(this.list, item);
      }
      if (item.level !== 0) {
        this.resizeList(this.list, item);
      }
    },
    resizeList (list, item) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].idx === item.parentIdx) {
          let property = WH[item.isDir];
          let children = list[i].children;
          let len = children.length;
          let nextIndex = 0;
          for (let j = 0; j < len; j++) {
            if (item.idx === children[j].idx) nextIndex = j;
          }
          let remainTotal = this.getRemainTotal(children, nextIndex, property);
          let remainLen = len - nextIndex - 1;
          for (let j = 0; j < len; j++) {
            if (children[j].type === 'canvas') {
              this.$set(children[j], 'needRequest', true);
              setTimeout(() => {
                this.$set(children[j], 'needRequest', false);
              });
            }
            if (j > nextIndex) {
              let propertyValue = Number((remainTotal / remainLen).toFixed(2));
              this.$set(children[j], property, propertyValue);
            }
          }
        } else {
          this.resizeList(list[i].children, item);
        }
      }
    },
    getRemainTotal (list, index, property) {
      let total = 0;
      for (let i = 0; i < list.length; i++) {
        if (i <= index) {
          total = total + list[i][property];
        }
      }
      return 100 - total;
    },
    mouseUp () {
    },
    refreshLayout () {
      if (!this.activeItem) return;
      if (!this.isMove) return;
      let list = this.getRefreshLayoutList(JSON.parse(JSON.stringify(this.list)), JSON.parse(JSON.stringify(this.activeItem)));
      this.refreshLayoutList(list);
    },
    refreshLayoutList (list) {
      if (!list) return;
      for (let i = 0; i < list.length; i++) {
        if (list[i].worksheetId) {
          this.refreshCanvas(this.list, list[i].worksheetId);
        }
        this.refreshLayoutList(list[i].children);
      }
    },
    getRefreshLayoutList (list, item) {
      if (item.level === 0) return [item];
      for (let i = 0; i < list.length; i++) {
        if (list[i].idx === item.parentIdx) {
          return [list[i]];
        }
      }
    }
  },
};
