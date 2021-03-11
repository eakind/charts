<template>
  <div class="board-layout" :ref="layoutType || 'boardLayout'">
    <component
      v-if="reloadLayout"
      :ref="isLayoutType"
      :is="isLayoutType"
      :list="layoutList"
      :is-dragging="isDragging"
      :current-item="currentItem"
      :client-x="clientX"
      :client-y="clientY"
      :layout-idx="currentIdx"
      :selected-target="selectedTarget"
      @change="changeHandler"
      @select="selectedTargetHandler"
      @cancel-select="cancelSelectedHandler"
      @set-layout-item="setCurrentLayoutItem"
    ></component>
    <float-item
      v-if="floatComponents.length>0"
      :list="floatComponents"
      @set-layout-item="setCurrentLayoutItem">
    </float-item>
  </div>
</template>
<script>
import FixedWidth from './fixedWidth/index.vue';
import FillLayout from './fillLayout/index.vue';
import FloatItem from './floatItem/index.vue';
import MobileLayout from './mobileLayout/index.vue';
import FilterLayout from './filterLayout/index.vue';
import { flatten } from '@/utils/utils.js';
import { mapMutations, mapState, mapActions } from 'vuex';
import { refreshCanvasMixin } from './mixins/refreshCanvas.js';
export default {
  mixins: [refreshCanvasMixin],
  data () {
    return {
      currentItem: null,
      isDragging: false,
      currentIdx: null,
      clientX: 0, // 拖动时的clientX
      clientY: 0, // 拖动时的clientY
      timer: null,
      reloadLayout: true
    };
  },
  props: {
    modeType: {
      type: String,
      defalut: 'fixedWidth',
    },
    device: {
      type: String,
      default: 'pc'
    },
    layoutType: {
      type: String,
    }
  },
  watch: {
    'currentDashboardDetail.dashboard_id': {
      handler () {
        this.setSelectedTarget({});
      },
      deep: true,
      immediate: true
    },
    fullScreen: {
      handler (val) {
        if (val) {
          this.setSelectedTarget({});
          this.refreshAllCanvas(this.layoutList);
        }
      },
      immediate: true,
    },
    device: {
      handler (val) {
        this.reload();
      },
      deep: true
    }
  },
  computed: {
    ...mapState('project', ['projectId']),
    ...mapState('dashboard', [
      'layoutList',
      'currentDashboardDetail',
      'currentTarget',
      'fullScreen',
      'selectedTarget',
      'workSheetList',
      'floatComponents'
    ]),
    isLayoutType () {
      if (this.device === 'mobile') {
        if (this.layoutType === 'mobileFilter') {
          return 'filterLayout';
        } else {
          return 'mobileLayout';
        }
      } else {
        return this.modeType;
      }
    }
  },
  components: {
    FixedWidth,
    FillLayout,
    FloatItem,
    MobileLayout,
    FilterLayout
  },
  beforeDestroy () {
    this.bus.$off('dragging-module');
    this.bus.$off('stop-drag-canvas');
  },
  mounted () {
    this.bus.$on('dragging-module', this.draggingHandler);
    this.bus.$on('stop-drag-module', this.stopDragHandler);
  },
  methods: {
    ...mapMutations('dashboard', [
      'setLayoutList',
      'setCurrentDashboardDetail',
      'setCurrentTarget',
      'setSelectedTarget',
      'setWorkSheetList',
    ]),
    ...mapActions('dashboard', ['setCss']),
    // 当前布局元素
    setCurrentLayoutItem (itemData, isDir) {
      if (!itemData) {
        this.currentItem = null;
      } else {
        this.currentItem = {
          ...itemData,
          isDir,
        };
      }
    },
    // 拖动中
    draggingHandler (
      clientX,
      clientY,
      type,
      worksheetId,
      filterId,
      filterType,
      canvasType,
      layoutIdx
    ) {
      if (!layoutIdx) {
        if (!this.uniqueWorksheetId(worksheetId)) return;
        if (!this.uniqueFilterId(filterId)) return;
      }
      if (this.isInnerLayout(clientX, clientY, type)) {
        this.currentIdx = layoutIdx;
        this.isDragging = true;
        this.clientX = clientX;
        this.clientY = clientY;
      } else {
        this.isDragging = false;
        this.currentItem = null;
        this.currentIdx = null;
      }
    },
    // 停止拖动
    stopDragHandler (
      clientX,
      clientY,
      type,
      worksheetId,
      filterId,
      filterType,
      canvasType,
      inLayout
    ) {
      this.isDragging = false;
      if (!inLayout) {
        if (!this.uniqueWorksheetId(worksheetId)) return;
        if (!this.uniqueFilterId(filterId)) return;
      }
      if (!this.isInnerLayout(clientX, clientY, type)) return;
      if (this.currentItem && this.currentItem.type === 'title') return;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        //
        let list = this.workSheetList.map((i) => {
          if (worksheetId === i.worksheet_id) {
            i.active = true;
          }
          return i;
        });
        this.setWorkSheetList(list);
        this.$refs[this.isLayoutType].addLayoutItem(
          worksheetId,
          JSON.parse(JSON.stringify(this.currentItem)),
          type,
          filterId,
          filterType,
          canvasType,
          inLayout
        );
      }, 30);
    },
    // 修改展板布局
    changeHandler (list, item) {
      this.setLayoutList(list);
      this.setSelectedTarget({});
      this.reload();
      this.setCss({ attr: 'layoutList', css: list, projectId: this.projectId });
    },
    // 选中展板中的画布
    selectedTargetHandler (item) {
      if (this.fullScreen) return;
      this.setSelectedTarget(item);
      if (item.styleId && item.styleId === this.currentTarget.id) {
        return;
      }
      this.setCurrentTarget(JSON.parse(JSON.stringify({})));
      if (item.type === 'title') return;
      setTimeout(() => {
        let obj = {
          type: item.type,
          id: item.styleId,
          worksheetId: item.worksheetId,
          style: item.style,
        };
        this.setCurrentTarget(obj);
      }, 0);
    },
    cancelSelectedHandler () {
      this.setSelectedTarget({});
      this.setCurrentTarget({});
    },
    isInnerLayout (clientX, clientY, type) {
      if (type === 'filter' && this.device === 'mobile') {
        if (this.layoutType === 'mobileFilter') {
          let layoutDom = this.$refs[this.layoutType];
          if (!layoutDom) return false;
          let left = layoutDom.getBoundingClientRect().left;
          let top = layoutDom.getBoundingClientRect().top;
          let right = layoutDom.getBoundingClientRect().right;
          if (clientX > left && clientY > top && clientX < right) {
            return true;
          }
          return false;
        }
        return false;
      }
      let dom = this.$refs.boardLayout;
      if (!dom) return false;
      let left = dom.getBoundingClientRect().left;
      let top = dom.getBoundingClientRect().top;
      let right = dom.getBoundingClientRect().right;
      if (clientX > left && clientY > top && clientX < right) {
        return true;
      }
      return false;
    },
    uniqueFilterId (filterId) {
      if (!filterId) return true;
      let list = flatten(this.layoutList);
      for (let i = 0; i < list.length; i++) {
        if (filterId === list[i].filterId) {
          return false;
        }
      }
      return true;
    },
    uniqueWorksheetId (worksheetId) {
      if (!worksheetId) return true;
      let list = flatten(this.layoutList);
      for (let i = 0; i < list.length; i++) {
        if (worksheetId === list[i].worksheetId) {
          return false;
        }
      }
      return true;
    },
    reload () {
      this.reloadLayout = false;
      setTimeout(() => {
        this.reloadLayout = true;
        setTimeout(() => {
          this.refreshAllCanvas(this.layoutList);
        });
      });
    }
  },
};
</script>
<style lang="scss" scoped>
.board-layout {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  // padding: 8px;
}
</style>
