<template>
  <div class="fixed-width" :class="isFullActive">
    <layout-item
      v-for="(item, index) in list"
      :key="index"
      :style="setStyle(item)"
      :client-x="clientX"
      :client-y="clientY"
      :layout-idx="layoutIdx"
      :list="list"
      :is-dragging="isDragging"
      :item-data="item"
      :selected-target="selectedTarget"
      @dblclick.native.stop="showEditor(item)"
      @select="selectedTargetHandler"
      @cancel-select="cancelSelectedHandler"
      @set-layout-item="setCurrentLayoutItem"
      @change="changeHandler"
      @del="delHandler"
      @swap-comp="swapCompHandler"
    >
      <mc-chart
        :work-sheet-id="item.worksheetId"
        :needRequest="item.needRequest"
         @no-chart="delHandler(item)"
        v-if="!item.isEmpty && item.type === 'canvas'"
        :style-obj="item.style"
      ></mc-chart>
      <text-chart
        :showFlag.sync="showTextEditFlag"
        :selected-target="selectedTarget"
        :item-data="item"
        :id="item.idx"
        v-if="!item.isEmpty && item.type === 'text'"
        :style-obj="item.style"
        :show-edit="isEditText"
        @close="closeEdit"
      ></text-chart>
      <filter-chart
        :filterId="item.filterId"
        :filterType="item.filterType"
        :style-obj="item.style"
        v-if="!item.isEmpty && item.type === 'filter'"
      ></filter-chart>
      <dashboard-title
        :showFlag.sync="showTextEditFlag"
        :selected-target="selectedTarget"
        :item-data="item"
        v-if="!item.isEmpty && item.type === 'title'"
      ></dashboard-title>
      <resize-line
        :layout-idx="layoutIdx"
        v-if="isResizeLine(item, index, list)"
        :item-data="item"
        :is-dragging="isDragging"
        :client-x="clientX"
        :client-y="clientY"
        @set-layout-item="setCurrentLayoutItem"
        @mouseup.native="mouseUp"
        @mousedown.native.stop="mouseDown($event, item)"
      ></resize-line>
      <menu-btn
        v-if="isMenuList(item)"
        :item-data="item"
        :style="isMenuPosition(item)"
        @del="delHandler(item)"
        @set-text="showEditor(item)"
        @cancel-select="cancelSelectedHandler"
      ></menu-btn>
      <drag-icon
        v-if="isDrag(item)"
        :item-data="item"
        @swap-comp="swapCompHandler"
      ></drag-icon>
    </layout-item>
    <div
      class="add-layout-active"
      ref="addActive"
      :style="setActivePosition"
    ></div>
  </div>
</template>
<script>
import McChart from '../../mcChart.vue';
import TextChart from '../../textChart.vue';
import FilterChart from '../../filterChart';
import DashboardTitle from '../../dashboardTitle.vue';
import LayoutItem from '../components/layoutItem.vue';
import ResizeLine from '../components/resizeLine.vue';
import MenuBtn from '../components/menuBtn.vue';
import DragIcon from '../components/dragIcon.vue';
import { boardMixin } from '../mixins/boardMixin.js';
import { operateLayout } from '../mixins/operateLayout.js';
import { mapState, mapMutations } from 'vuex';
import { getLayoutCompStyle } from '@/utils/utils.js';
export default {
  mixins: [boardMixin, operateLayout],
  data () {
    return {
      showTextEditFlag: false,
    };
  },
  props: {
    list: {
      type: Array,
      default: (_) => []
    },
    clientX: {
      type: Number,
    },
    clientY: {
      type: Number,
    },
    isDragging: {
      type: Boolean,
    },
    selectedTarget: {
      type: Object,
    },
    layoutIdx: {
      type: [Object, Number, String]
    }
  },
  components: {
    LayoutItem,
    ResizeLine,
    MenuBtn,
    McChart,
    TextChart,
    DashboardTitle,
    DragIcon,
    FilterChart,
  },
  computed: {
    ...mapState('dashboard', ['workSheetList', 'legendList', 'fullScreen', 'currentDashboardDetail', 'layoutList']),
    isFullActive () {
      return this.fullScreen ? 'full-layout' : '';
    },
    isAddBottom () {
      let dom = this.$refs.addActive;
      let clientTop = 0;
      if (dom) {
        clientTop = this.$refs.addActive.getBoundingClientRect().top;
      }
      if (clientTop < this.clientY && this.isDragging) {
        return true;
      }
      return false;
    },
    setActivePosition () {
      let heightType = this.currentDashboardDetail.css.device === 'mobile' ? 'mobileHeight' : 'height';
      let len = this.list.length;
      let top = 0;
      if (len === 1) {
        if (this.list[0].isEmpty && !this.list[0].children.length) {
          top = 0;
        } else {
          top = this.list[0][heightType];
        }
      } else if (len === 2) {
        if (
          this.list[0].type === 'title' &&
          this.list[1].isEmpty &&
          !this.list[1].children.length
        ) {
          top = this.list[0][heightType];
        } else {
          top = Number(this.list[0][heightType]) + Number(this.list[1][heightType]);
        }
      } else {
        for (let i = 0; i < len; i++) {
          top = Number(top) + Number(this.list[i][heightType]);
        }
      }
      let isVisible = 'hidden';
      if (this.isAddBottom) {
        if (this.layoutIdx) {
          return {
            visibility: isVisible,
          };
        };
        // eslint-disable-next-line vue/no-async-in-computed-properties
        this.$emit('set-layout-item', null);
        isVisible = 'visible';
      }
      if (this.currentDashboardDetail.css.device === 'mobile') {
        return {
          top: `${top}px`,
          visibility: isVisible,
        };
      } else {
        return {
          top: `${top}%`,
          visibility: isVisible,
        };
      }
    },
  },
  mounted () {},
  methods: {
    ...mapMutations('dashboard', ['setWorkSheetList', 'setLegendList']),
    // 交换组件
    swapCompHandler (originIdx, targetIdx) {
      let list = JSON.parse(JSON.stringify(this.list));
      this.swapCompList(list, originIdx, targetIdx);
      this.$emit('change', list);
    },
    changeHandler (list) {
      this.$emit('change', list);
    },
    // 删除布局
    delHandler (item) {
      let sheetList = this.workSheetList.map((i) => {
        if (i.worksheet_id === item.worksheetId) {
          i.active = false;
        }
        return i;
      });
      this.setWorkSheetList(sheetList);
      let legendArr = JSON.parse(JSON.stringify(this.legendList));
      for (let i = 0; i < legendArr.length; i++) {
        if (legendArr[i].id === item.worksheetId) {
          legendArr.splice(i, 1);
          break;
        }
      }
      this.setLegendList(legendArr);
      let list = JSON.parse(JSON.stringify(this.list));
      if (item.worksheetId) {
        this.setWorksheetForBackend(item.worksheetId, false);
      }
      if (this.currentDashboardDetail.css.device === 'mobile') {
        list = JSON.parse(JSON.stringify(this.layoutList));
      } else {
        list = JSON.parse(JSON.stringify(this.list));
      }
      this.setWorksheet(item.worksheetId, false);
      this.delTargetList(list, item);
      this.$emit('change', list);
    },
    cancelSelectedHandler () {
      this.$emit('cancel-select');
    },
    // 选中布局
    selectedTargetHandler (item) {
      this.$emit('select', item);
    },
    // 设置布局元素
    setCurrentLayoutItem (item, isDir) {
      this.$emit('set-layout-item', item, isDir);
    },
    addTopLevelItem (worksheetId, list, type, filterId, filterType, canvasType) {
      if (!list.length) {
        list.push({
          width: 100,
          height: 34,
          idx: 0,
          level: 0,
          worksheetId: worksheetId,
          needRequest: false,
          filterId: filterId,
          filterType: filterType,
          isDir: 'top',
          dir: 'column',
          isEmpty: false,
          type: type,
          children: [],
          styleId: 0,
          style: getLayoutCompStyle(type, canvasType),
        });
        return;
      }
      let obj = null;
      let idx = this.getIdx(list);
      let len = list.length - 1;
      let last = list[len];
      if (last.isEmpty && !last.children.length) {
        obj = JSON.parse(JSON.stringify(last));
        this.$set(obj, 'filterId', filterId);
        this.$set(obj, 'filterType', filterType);
        this.$set(obj, 'worksheetId', worksheetId);
        this.$set(obj, 'needRequest', false);
        this.$set(obj, 'isEmpty', false);
        this.$set(obj, 'isDir', 'top');
        this.$set(obj, 'type', type);
        this.$set(obj, 'style', getLayoutCompStyle(type, canvasType));
        list.splice(len, 1, obj);
      } else {
        obj = {
          width: 100,
          height: 34,
          idx: idx,
          level: 0,
          isEmpty: false,
          worksheetId: worksheetId,
          needRequest: false,
          filterId: filterId,
          filterType: filterType,
          isDir: 'top',
          type: type,
          children: [],
          styleId: idx,
          style: getLayoutCompStyle(type, canvasType),
        };
        list.push(obj);
      }
    },
    addLayoutItem (
      worksheetId,
      currentItem,
      type,
      filterId,
      filterType,
      canvasType,
      layoutIdx
    ) {
      let list = JSON.parse(JSON.stringify(this.list));
      if (worksheetId) {
        this.setWorksheetForBackend(worksheetId, true);
      }
      if (!currentItem) {
        this.addTopLevelItem(
          worksheetId,
          list,
          type,
          filterId,
          filterType,
          canvasType
        );
      } else {
        let isTop = {
          top: true,
          bottom: true
        };
        if (currentItem.isDir === 'insert' || (currentItem.level === 0 && isTop[currentItem.isDir])) {
          this.addInsertLevelItem(
            worksheetId,
            currentItem,
            list,
            type,
            filterId,
            filterType,
            canvasType,
            layoutIdx
          );
        } else {
          if (!currentItem.style) return;
          this.addDownLevelItem(
            worksheetId,
            currentItem,
            list,
            type,
            filterId,
            filterType,
            canvasType,
            layoutIdx
          );
        }
      }
      if (layoutIdx) {
        let item = this.getLayoutCompInfo(list, layoutIdx);
        this.delTargetList(list, item, true);
      }
      this.$emit('change', list);
    },
  },
};
</script>
<style lang="scss" scoped>
.fixed-width {
  width: 100%;
  height: 100%;
  &::after {
    content: '';
    height: 200px;
    display: block;
  }
}
.add-layout-active {
  width: 100%;
  height: 200px;
  top: 0%;
  background-color: rgba($color: #4284f5, $alpha: 0.1);
  outline: 1px solid #4284f5;
  position: absolute;
}
.full-layout{
  &::after{
    height: 0px;
  }
}
</style>
