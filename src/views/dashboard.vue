<template>
  <div class="dashboard" v-if="isChangeDashboard">
    <left v-show="!fullScreen"></left>
    <div class="dashboard-right" ref="boardRight" :style="dashboardRightStyle">
      <fullscreen-header></fullscreen-header>
      <div class="out-container" ref="outContainer" :style="outContainerStyle">
        <div class="container" ref="container" :style="containerStyle">
          <bg-color :bg-color="bgColor" :style="bgStyle"></bg-color>
          <div class="layout-container" :style="containerHeight">
            <board-layout :mode-type="modeType" :device="currentDashboardDetail.css.device" ref="layout"></board-layout>
          </div>
          <legend-container class="legend-container" v-if="isShowLegend"></legend-container>
          <empty-board-tip v-if="isEmptyBoard"></empty-board-tip>
        </div>
        <mobile-container class="container-right" v-if="isModileDevice"></mobile-container>
      </div>
    </div>
    <board-interaction v-if="actionFlag" :interactionFlag="actionFlag"></board-interaction>
    <!-- <edit-text v-if="textEditObj.isTextEdit" :editFlag="textEditObj.isTextEdit"></edit-text> -->
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex';
import left from './dashboard/left.vue';
import BoardLayout from './dashboard/boardLayout/index.vue';
import LegendContainer from './dashboard/legendContainer.vue';
import BgColor from '@/views/drawingboard/middle/bgColor.vue';
import { hexToRgba, getLayoutCompStyle } from '@/utils/utils.js';
import FullscreenHeader from './dashboard/fullsreenHeader/fullscreenHeader.vue';
import BoardInteraction from './dashboard/interaction/boardInteraction.vue';
// import EditText from './dashboard/editText/editText.vue';
import { downloadImage } from '@/utils/domSaver';
import actionMixin from './dashboard/mixins/actionMixin.js';
import { refreshCanvasMixin } from './dashboard/boardLayout/mixins/refreshCanvas.js';
import EmptyBoardTip from './dashboard/boardLayout/components/emptyBoardTip.vue';
import { post } from '@/api/server';
import { isEmpty } from '../utils/check';
import MobileContainer from './dashboard/mobileComponents/mobileContainer.vue';
export default {
  mixins: [actionMixin, refreshCanvasMixin],
  data () {
    return {
      height: null,
      scrollHeight: null,
      zoomList: [],
      currentZoomSize: null,
      outHeight: null,
      refreshTime: null,
      isEmptyBoard: true
    };
  },
  computed: {
    ...mapState('dashboard', ['currentDashboardDetail', 'layoutList', 'fullScreen', 'actionFlag', 'textEditObj', 'zoomSize', 'currentDashboard', 'workSheetList', 'floatComponents']),
    ...mapState('project', ['projectId']),
    outContainerStyle () {
      return {
        width: '100%',
        height: '100%',
        display: 'flex',
        background: '#e8eaf0'
      };
    },
    isChangeDashboard () {
      return !isEmpty(this.currentDashboardDetail);
    },
    containerStyle () {
      if (!this.currentDashboardDetail.css || !this.currentDashboardDetail.css.dashboard) return {};
      let dashboardStyle = this.currentDashboardDetail.css.dashboard;
      let borderColor = dashboardStyle.border.background;
      let opacity = dashboardStyle.border.opacity;
      let border = hexToRgba(borderColor, opacity);
      let device = this.currentDashboardDetail.css.device;
      const borderStyle = {
        none: 'none',
        bold: `2px solid ${border}`,
        solid: `1px solid ${border}`,
        dotted: `1px dotted ${border}`
      };
      let styleObj = {
        paddingTop: `${dashboardStyle.padding.top}px`,
        paddingLeft: `${dashboardStyle.padding.left}px`,
        paddingRight: `${dashboardStyle.padding.right}px`,
        paddingBottom: `${dashboardStyle.padding.bottom}px`,
        border: borderStyle[dashboardStyle.border.bgSelected]
      };
      if (device === 'mobile') {
        return {
          width: `${dashboardStyle.mobileSize.width}px`,
          height: `${dashboardStyle.mobileSize.height}px`,
          ...styleObj
        };
      }
      if (this.fullScreen) {
        return styleObj;
      }
      if (dashboardStyle.modeType === 'fixedWidth') {
        return {
          width: this.fullScreen ? '100%' : `${dashboardStyle.size.width}px`,
          ...styleObj,
        };
      } else {
        return {
          width: this.fullScreen ? '100%' : `${dashboardStyle.size.width}px`,
          height: `${dashboardStyle.size.height}`,
          ...styleObj
        };
      }
    },
    bgStyle () {
      return {
        height: `${this.height}px`,
      };
    },
    bgColor () {
      if (!this.currentDashboardDetail.css || !this.currentDashboardDetail.css.dashboard) return {};
      let bgStyle = this.currentDashboardDetail.css.dashboard.bgColor;
      let index = -2;
      if (!bgStyle.bgSelected) {
        return {
          opacity: 100,
          background: '#fff'
        };
      }
      if (bgStyle.background.index) {
        index = bgStyle.background.index;
      }
      return index === -2 ? {
        opacity: bgStyle.opacity,
        index: index,
        background: bgStyle.background
      } : {
        ...bgStyle.background,
        opacity: bgStyle.opacity
      };
    },
    dashboardRightStyle () {
      return {
        margin: this.fullScreen ? '0px' : ''
      };
    },
    isShowLegend () {
      if (this.currentDashboardDetail.css && this.currentDashboardDetail.css.device === 'mobile') {
        return false;
      }
      return this.currentDashboardDetail.css && this.currentDashboardDetail.css.isShowLegend;
    },
    modeType () {
      return this.currentDashboardDetail.css.dashboard.modeType;
    },
    device () {
      if (this.currentDashboardDetail.css) {
        return this.currentDashboardDetail.css.device || 'pc';
      } else {
        return 'pc';
      }
      // return this.currentDashboardDetail.css.device || 'pc';
    },
    isModileDevice () {
      let device = this.currentDashboardDetail.css.device;
      if (device === 'mobile') {
        return true;
      } else {
        return false;
      }
    }
  },
  watch: {
    fullScreen: {
      handler (val) {
        if (!val) {
          this.height = this.height - 70;
        } else {
          this.height = this.height + 70;
        }
      },
      immediate: true
    },
    isShowLegend: {
      handler () {
        this.delayRefresh();
      },
      deep: true
    },
    'currentDashboardDetail.css.title.showFlag': {
      handler (boolean) {
        if (!this.layoutList.length) return;
        if (boolean) {
          if (this.layoutList[0].type === 'title') return;
          let parentHeight = this.$el.clientHeight;
          let titlePercent = Number(((50 / parentHeight) * 100).toFixed(2)); // 计算50px在的百分比
          this.layoutList.unshift({
            width: 100,
            height: titlePercent,
            idx: 0,
            level: 0,
            type: 'title',
            isEmpty: false,
            isDir: 'top',
            dir: 'row',
            children: [],
            styleId: 0,
            style: {},
          });
        } else {
          if (this.layoutList[0].type !== 'title') return;
          this.layoutList.splice(0, 1);
        }
      },
      deep: true
    },
    'currentDashboardDetail.dashboard_id': {
      handler (val) {
        if (!val) return;
        this.getChartList();
        this.getActionList();
      },
      deep: true
    },
    layoutList: {
      handler (list) {
        this.isEmptyBoard = false;
        if (!list[1]) this.isEmptyBoard = true;
        if (list[1] && list[1].isEmpty && !list[1].children.length) {
          this.isEmptyBoard = true;
        }
        setTimeout(() => {
          this.setBgHeight();
        }, 0);
      },
      deep: true
    }
  },
  components: {
    left,
    BoardLayout,
    LegendContainer,
    BgColor,
    FullscreenHeader,
    BoardInteraction,
    EmptyBoardTip,
    MobileContainer
    // EditText
  },
  mounted () {
    let curDom = document.querySelector('.dashboard .dashboard-right .container');
    if (curDom) {
      curDom.style.zoom = this.currentZoomSize;
    }
    this.$on('initData', this.initData);
    // 监听图片下载
    this.bus.$on('saveChart', obj => {
      this.downloadPNG({
        type: obj.format,
        backgroundColor: obj.format === 'jpg' ? '#ffffff' : 'transparent'
      });
    });
    this.bus.$on('changeZoom', size => {
      let curDom = document.querySelector('.dashboard .dashboard-right .container');
      curDom.style.zoom = `${size}`;
      this.changeCss(this.currentDashboardDetail.css, size);
    });
  },
  destroyed () {
    this.bus.$off('saveChart');
    this.bus.$off('changeZoom');
  },
  methods: {
    ...mapMutations('dashboard', ['setLayoutList', 'setFullScreen', 'setLegendList', 'setCurrentTarget', 'changeZoomSize']),
    delayRefresh () {
      if (this.refreshTime) {
        clearTimeout(this.refreshTime);
        this.refreshTime = null;
      }
      this.refreshTime = setTimeout(() => {
        this.refreshAllCanvas(this.layoutList);
        if (this.floatComponents) this.refreshAllCanvas(this.floatComponents);
      }, 100);
    },
    initData () {
      if (isEmpty(this.currentDashboardDetail)) return;
      if (this.currentDashboardDetail.dashboard_id !== this.currentDashboard.dashboard_id) return;
      this.height = null;
      this.setCurrentTarget({});
      this.setLegendList([]);
      this.setLayoutList([]);
      setTimeout(() => {
        if (isEmpty(this.currentDashboardDetail)) return;
        if (this.currentDashboardDetail.dashboard_id !== this.currentDashboard.dashboard_id) return;
        const dashboardObj = this.currentDashboardDetail.css.dashboard;
        let list = this.currentDashboardDetail.css.layoutList || [];
        this.isShowLegend = this.currentDashboardDetail.css.isShowLegend;
        if (list.length) {
          this.setLayoutList(list);
        } else {
          let parentHeight = this.$el.clientHeight;
          let titlePercent = Number(((50 / parentHeight) * 100).toFixed(2)); // 计算50px在的百分比
          if (dashboardObj.modeType === 'fixedWidth') {
            list.push({
              width: 100,
              height: titlePercent,
              idx: 0,
              level: 0,
              type: 'title',
              isEmpty: false,
              isDir: 'top',
              dir: 'row',
              children: [],
              styleId: 0,
              style: getLayoutCompStyle('title'),
            }, {
              width: 100,
              height: 34,
              idx: 1,
              level: 0,
              type: '',
              isEmpty: true,
              children: [],
              styleId: 1,
              style: getLayoutCompStyle('empty'),
            });
            this.setLayoutList(list);
          }
        }
        this.setBgHeight();
        this.changeZoomSize(dashboardObj.scale);
        this.bus.$emit('setZoom', dashboardObj.scale);
        this.bus.$emit('changeZoom', dashboardObj.scale);
      }, 0);
    },
    setBgHeight () {
      let dom = this.$refs.container;
      if (!dom) return;
      let scrollH = dom.scrollHeight;
      if (this.layoutList[1] && this.layoutList[1].isEmpty && !this.layoutList[1].children.length) {
        scrollH = dom.clientHeight;
      };
      this.height = scrollH;
      let outDom = this.$refs.outContainer;
      this.outHeight = outDom.offsetHeight;
      this.scrollHeight = dom.scrollHeight;
    },
    async changeCss (obj, size) {
      if (obj) {
        obj.dashboard.scale = size;
        let param = {
          dashboard_id: this.currentDashboard.dashboard_id,
          project_id: this.projectId,
          css: obj
        };
        await post('dashboardCss', param);
        this.delayRefresh();
      }
    },
    async downloadPNG ({ backgroundColor = 'transparent', type = 'png' }) {
      document.querySelector('.out-container').style.height = `${this.scrollHeight}px`;
      document.querySelector('.layout-container').style.height = `${this.outHeight}px`;
      document.querySelector('.container').style.overflow = 'visible';
      // 背景颜色
      let background = this.currentDashboardDetail.css.dashboard.bgColor.background;
      let titlebg = document.querySelector('.dashboard-title').style.backgroundColor;
      var chartBg = Array.from(document.querySelectorAll('.mc-chart-bg')).map(
        n => n.style.background
      );
      var chartTitleBg = Array.from(document.querySelectorAll('.mc-chart-bg .title')).map(
        n => n.style.background
      );
      var classifyBg = Array.from(document.querySelectorAll('.classify-chart')).map(
        n => n.style.background
      );
      var textBg = Array.from(document.querySelectorAll('.text-chart-wrap')).map(
        n => n.style.background
      );
      var numChartBg = Array.from(document.querySelectorAll('.number-chart')).map(
        n => n.style.background
      );
      var tableNomalBg = Array.from(document.querySelectorAll('.ag-layout-normal')).map(
        n => n.style.background
      );
      var tableBalhamBg = Array.from(document.querySelectorAll('.ag-theme-balham')).map(
        n => n.style.background
      );
      var tableCellBg = Array.from(document.querySelectorAll('.ag-cell')).map(
        n => n.style.background
      );
      if (type === 'png') {
        // 展板区域颜色透明
        document.querySelector('.container').style.background = 'none';
        document.querySelector('.bg-color').style.visibility = 'hidden';
        document.querySelector('.dashboard-title').style.background = 'none';
        Array.from(document.querySelectorAll('.mc-chart-bg')).forEach(
          n => (n.style.background = 'none')
        );
        Array.from(document.querySelectorAll('.mc-chart-bg .title')).forEach(
          n => (n.style.background = 'none')
        );
        Array.from(document.querySelectorAll('.classify-chart')).forEach(
          n => (n.style.background = 'none')
        );
        Array.from(document.querySelectorAll('.text-chart-wrap')).forEach(
          n => (n.style.background = 'none')
        );
        Array.from(document.querySelectorAll('.number-chart')).forEach(
          n => (n.style.background = 'none')
        );
        Array.from(document.querySelectorAll('.ag-layout-normal')).forEach(
          n => (n.style.background = 'none')
        );
        Array.from(document.querySelectorAll('.ag-theme-balham')).forEach(
          n => (n.style.background = 'none')
        );
        Array.from(document.querySelectorAll('.ag-cell')).forEach(
          n => (n.style.background = 'none')
        );
      }
      let res = await downloadImage({
        node: '.out-container',
        name: `dashboard-${new Date().getTime()}.${type}`,
        size: {
          width:
            +document
              .querySelector('.container')
              .style.width.split('px')[0] + 0,
          height: this.scrollHeight
        }, // optional
        backgroundColor: backgroundColor, // optional
        errorMsg: this.$i18n.t('message.save_image_error')
      });
      // 展板区域恢复原来的颜色
      if (type === 'png') {
        document.querySelector('.container').style.background = background;
        document.querySelector('.dashboard-title').style.backgroundColor = titlebg;
        document.querySelector('.bg-color').style.visibility = 'visible';
        Array.from(document.querySelectorAll('.mc-chart-bg')).forEach(
          (n, i) => (n.style.background = chartBg[i])
        );
        Array.from(document.querySelectorAll('.mc-chart-bg .title')).forEach(
          (n, i) => (n.style.background = chartTitleBg[i])
        );
        Array.from(document.querySelectorAll('.classify-chart')).forEach(
          (n, i) => (n.style.background = classifyBg[i])
        );
        Array.from(document.querySelectorAll('.text-chart-wrap')).forEach(
          (n, i) => (n.style.background = textBg[i])
        );
        Array.from(document.querySelectorAll('.number-chart')).forEach(
          (n, i) => (n.style.background = numChartBg[i])
        );
        Array.from(document.querySelectorAll('.ag-layout-normal')).forEach(
          (n, i) => (n.style.background = tableNomalBg[i])
        );
        Array.from(document.querySelectorAll('.ag-theme-balham')).forEach(
          (n, i) => (n.style.background = tableBalhamBg[i])
        );
        Array.from(document.querySelectorAll('.ag-cell')).forEach(
          (n, i) => (n.style.background = tableCellBg[i])
        );
      }
      document.querySelector('.out-container').style.height = '100%';
      document.querySelector('.layout-container').style.height = '100%';
      document.querySelector('.container').style.overflow = 'auto';
      // 下载完成
      this.bus.$emit('downloadPNG', res);
    }
  }
};
</script>
<style lang='scss' scoped>
.dashboard {
  display: flex;
  width: 100%;
  height: 100%;
  .dashboard-left{
    background: #FBFCFF;
  }
  .dashboard-right {
    flex: 1;
    width: 0;
    height: 100%;
    box-sizing: border-box;
    background-color: white;
    overflow-x: auto;
    overflow-y: hidden;
    margin: 0px 0px 0px 8px;
    position: relative;
  }
  .container{
    width: 100%;
    height: 100%;
    display: flex;
    overflow: auto;
    overflow-x: hidden;
    position: relative;
    border-right: 1px solid rgba(0, 0, 0, 0.2);
  }
  .layout-container{
    flex: 1;
    width: 0;
    height: 100%;
  }
  .legend-container{
    width: 15%;
    height: 100%;
  }
}
</style>
