<template>
  <div
    class="legend-container"
    :class="isActiveClass"
    :style="setWidth"
    @mouseover.stop="mouseHover"
    @mouseout.stop="mouseOut"
  >
    <resize-line
      class="resize-line"
      :fullScreen="fullScreen"
      @resize="resizeHandler"
      @update-start-w="updateStartW"
      @stop-drag="stopHandler"
      :start-w="startW"
    ></resize-line>
    <div class="legend-content" @click.stop="selectLegend">
      <legend-item
        v-for="(item, index) in legendList"
        :key="index"
        :item-data="item"
      ></legend-item>
    </div>
    <menu-btn
      v-if="selectedTarget.type === 'legend'"
      @cancel-select="cancelSelect"
      @del="removeHandler"
    ></menu-btn>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import ResizeLine from './legendContainer/resizeLine.vue';
import LegendItem from './legendContainer/legendItem.vue';
import MenuBtn from './legendContainer/menuBtn.vue';
import { refreshCanvasMixin } from './boardLayout/mixins/refreshCanvas.js';
export default {
  mixins: [refreshCanvasMixin],
  data () {
    return {
      setStartW: 15,
      startW: 15,
      height: 0,
    };
  },
  components: {
    ResizeLine,
    LegendItem,
    MenuBtn,
  },
  computed: {
    ...mapState('project', ['projectId']),
    ...mapState('dashboard', [
      'legendList',
      'currentDashboardDetail',
      'layoutList',
      'selectedTarget',
      'fullScreen',
    ]),
    setWidth () {
      if (this.currentDashboardDetail.css.device === 'mobile') {
        return {
          width: '100%',
        };
      } else {
        return {
          width: `${this.setStartW}%`,
          height: `${this.height}px`,
          top: `${this.top}px`,
        };
      }
    },
    isActiveClass () {
      return this.selectedTarget.type === 'legend' ? 'is-layout-active' : '';
    },
  },
  watch: {
    'currentDashboardDetail.css.legendWidth': {
      handler (val) {
        this.startW = val;
        this.setStartW = val;
      },
      immediate: true,
    },
    layoutList: {
      handler () {
        let dom = document.querySelector('.add-layout-active');
        let titleDom = document.querySelector('.dashboard-title');
        if (!dom) return;
        this.height = Math.floor(dom.offsetTop);
        if (!titleDom) return;
        let height = titleDom.clientHeight;
        this.height = this.height - height;
        this.top = height;
      },
      deep: true,
    },
  },
  mounted () {},
  methods: {
    ...mapActions('dashboard', ['setCss']),
    ...mapMutations('dashboard', ['setSelectedTarget', 'setCurrentTarget']),
    selectLegend () {
      if (this.fullScreen) return;
      if (!this.legendList.length) return;
      this.setSelectedTarget({
        type: 'legend',
      });
      this.setCurrentTarget({});
    },
    cancelSelect () {
      this.setSelectedTarget({});
    },
    removeHandler () {
      this.setCss({
        attr: 'isShowLegend',
        css: false,
        projectId: this.projectId,
      });
    },
    resizeHandler (percent) {
      this.setStartW = percent;
    },
    updateStartW () {
      this.startW = this.setStartW;
    },
    stopHandler () {
      this.setCss({
        attr: 'legendWidth',
        css: this.setStartW,
        projectId: this.projectId,
      });
      this.refreshAllCanvas(this.layoutList);
    },
    mouseHover () {
      if (!this.legendList.length) return;
      this.$el.style.border = '2px solid rgba(0,0,0, 0.1)';
    },
    mouseOut () {
      this.$el.style.border = 'none';
    }
  },
};
</script>
<style lang='scss' scoped>
.legend-container {
  width: 15%;
  height: 100%;
  min-height: 34%;
  box-sizing: border-box;
  position: relative;
  // padding: 0px 8px 8px 8px;
  user-select: none;
  &:hover {
    border: 2px solid rgba($color: #000000, $alpha: 0.1);
  }
  .resize-line {
    left: 0px;
    position: absolute;
  }
  .legend-content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    &:hover {
      overflow-y: auto;
    }
  }
}
.is-layout-active {
  border: 2px solid #666666!important;
}
</style>
