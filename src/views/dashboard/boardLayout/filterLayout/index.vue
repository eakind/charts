<template>
  <div class="mobile-layout">
    <!-- <layout-item
      v-for="(item, index) in filterList"
      :key="index"
      :item-data="item"
      :client-x="clientX"
      :client-y="clientY"
      :layout-idx="layoutIdx"
      :list="list"
      :is-dragging="isDragging"
      :selected-target="selectedTarget"
    ></layout-item> -->
    <fixed-width
      v-if="reloadLayout"
      :list="filterList"
      :is-dragging="isDragging"
      :client-x="clientX"
      :client-y="clientY"
      :layout-idx="layoutIdx"
      :selected-target="selectedTarget"
      @select="selectedTargetHandler"
      @change="changeListHandle"
      @cancel-select="cancelSelectedHandler"
      @set-layout-item="setMobileCurrentLayoutItem"
    ></fixed-width>
  </div>
</template>
<script>
// import layoutItem from '../components/layoutItem.vue';
import FixedWidth from '../fixedWidth/index.vue';
import { mapState, mapMutations } from 'vuex';
import { refreshCanvasMixin } from '../mixins/refreshCanvas.js';
import { operateLayout } from '../mixins/operateLayout.js';
import { getLayoutCompStyle } from '@/utils/utils.js';
export default {
  mixins: [refreshCanvasMixin, operateLayout],
  components: {
    // layoutItem,
    FixedWidth
  },
  data () {
    return {
      filterList: [],
      reloadLayout: true,
      layoutList: []
    };
  },
  props: {
    list: {
      type: [Array],
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
  mounted () {
    this.layoutList = JSON.parse(JSON.stringify(this.list));
    this.setSelectedTarget({});
    this.filterList = [];
    this.setFilterList(this.list);
    this.reload();
  },
  computed: {
    ...mapState('dashboard', ['selectedTarget', 'currentTarget'])
  },
  methods: {
    ...mapMutations('dashboard', [
      'setLayoutList',
      'setSelectedTarget',
      'setCurrentTarget'
    ]),
    setMobileCurrentLayoutItem (itemData, isDir) {
      this.$emit('set-layout-item', itemData, isDir);
    },
    setFilterList (list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].type && list[i].type === 'filter') {
          let obj = JSON.parse(JSON.stringify(list[i]));
          obj.level = 0;
          obj.isDir = 'top';
          obj.dir = 'row';
          obj.children = [];
          if (!list[i].mobileHeight) {
            list[i].mobileHeight = 120;
          }
          this.filterList.push(obj);
        }
        this.setFilterList(list[i].children);
      }
    },
    reload () {
      this.reloadLayout = false;
      setTimeout(() => {
        this.reloadLayout = true;
        setTimeout(() => {
          this.refreshAllCanvas(this.list);
        });
      });
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
    // 修改展板布局
    changeListHandle (list) {
      this.filterList = [];
      this.setFilterList(list);
      // this.setLayoutList(list);
      // this.setSelectedTarget({});
      // this.reload();
      this.$emit('change', list);
    },
    // 取消选择画布
    cancelSelectedHandler () {
      this.setSelectedTarget({});
      this.setCurrentTarget({});
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
      if (type && type === 'filter') {
        let list = JSON.parse(JSON.stringify(this.layoutList));
        this.setWorksheet(worksheetId, true);
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
        this.changeListHandle(list);
      }
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
    }
  },
};
</script>
<style lang='scss' scoped>
.mobile-layout {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>
