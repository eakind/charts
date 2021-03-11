<template>
  <div class="filter-list">
    <div class="filter-item" v-for="(item, index) in curFilterList" :key="index">
      <div class="filter-related">
        关联画布 {{getReatedCanvasIndex(item.relatedCanvas)}}
      </div>
      <dc-drag
        class="drag-filter"
        :key="index"
        :id="item.filter_id"
        :data-type="item.filter_type"
        @dragging="draggingHandler(arguments, 'filter')"
        @stopDrag="stopDragHandler(arguments, 'filter')"
        :class="{'drag-active': hasFilterList.indexOf(item.filter_id) >= 0}"
      >
        <div class="filter-info" :class="{'filter-active': hasFilterList.indexOf(item.filter_id) >= 0}">
          <span class="iconfont icon-dbc_filterbl" :class="[filterTypeObj[item.filter_type]]"></span>
          <span class="filter-name">{{item.filter_name}}</span>
        </div>
      </dc-drag>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { get } from '@/api/server';
import DcDrag from '@/components/dcdrag/dcDrag.vue';
import { getAttrDeep } from '@/utils/utils.js';
export default {
  data () {
    return {
      worksheetId: '',
      filterTypeObj: {
        '03': 'num-active',
        '01': 'cat-active',
        '02': 'cat-active'
      },
      hasFilterList: []
    };
  },
  components: {
    DcDrag
  },
  computed: {
    ...mapState('drawingboard', ['currentCanvas', 'filterList']),
    ...mapState('dashboard', ['workSheetList', 'filterUniqueList', 'layoutList']),
    ...mapState('project', ['projectId']),
    activeWorkSheetListId () {
      return this.workSheetList.filter(item => item.active).map(item => item.worksheet_id);
    },
    relateFilter () {
      let list = this.filterUniqueList;
      list.forEach((filterItem, filterIndex) => {
        let relatedCanvas = [];
        filterItem.worksheet_list.forEach((worksheetItem, worksheetIndex) => {
          this.workSheetList.forEach((all, allIndex) => {
            if (all.worksheet_id === worksheetItem.worksheet_id) {
              relatedCanvas.push(allIndex + 1);
            }
          });
        });
        filterItem.relatedCanvas = relatedCanvas;
      });
      return list;
    },
    curFilterList () {
      let activeFilter = [];
      for (let i = 0; i < this.relateFilter.length; i++) {
        for (let j = 0; j < this.relateFilter[i].worksheet_list.length; j++) {
          if (this.activeWorkSheetListId.indexOf(this.relateFilter[i].worksheet_list[j].worksheet_id) >= 0) {
            activeFilter.push(this.relateFilter[i]);
            continue;
          }
        }
      }
      activeFilter = Array.from(new Set(activeFilter));
      this.setCurrentFilterList(activeFilter);
      return activeFilter;
    }
  },
  watch: {
    layoutList () {
      this.hasFilterList = [];
      getAttrDeep(this.layoutList, 'filter', this.hasFilterList);
    }
  },
  mounted () {
    this.worksheetId = this.currentCanvas.worksheet_id;
    if (!this.filterUniqueList.length) {
      this.getFilterList();
    }
    getAttrDeep(this.layoutList, 'filter', this.hasFilterList);
  },
  methods: {
    ...mapMutations('dashboard', ['setFilterUniqueList', 'setCurrentFilterList']),
    draggingHandler (paramList, type) {
      let clientX = paramList[2];
      let clientY = paramList[3];
      let filterId = paramList[0].id;
      let filterType = paramList[0].dataset.type;
      this.bus.$emit('dragging-module', clientX, clientY, type, null, filterId, filterType);
    },
    stopDragHandler (paramList, type) {
      let clientX = paramList[2];
      let clientY = paramList[3];
      let filterId = paramList[0].id;
      let filterType = paramList[0].dataset.type;
      this.bus.$emit('stop-drag-module', clientX, clientY, type, null, filterId, filterType);
    },
    getReatedCanvasIndex (item) {
      if (item && item.length > 0) {
        // let worksheetArr = item.map((item, index) => {
        //   return item.worksheet_idx;
        // });
        // return worksheetArr.join(' ');
        return item.join(' ');
      } else {
        return '没有关联任何画布。';
      }
    },
    getWorksheetId (list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].worksheetId) this.worksheetId = list[i].worksheetId;
        this.getWorksheetId(list[i].children);
      }
    },
    async getFilterList () {
      if (!this.worksheetId) {
        this.getWorksheetId(this.layoutList);
      }
      let param = {
        project_id: this.projectId,
        worksheet_id: this.worksheetId,
        offset: 0,
        limit: 100
      };
      let res = await get('filterList', param);
      if (res.code === 0) {
        this.setFilterUniqueList(res.filter_list);
        this.getReatedCanvas();
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.filter-list {
  .filter-item {
    width: 100%;
    height: 64px;
    .filter-related {
      height: 24px;
      line-height: 24px;
      padding-left: 8px;
      font-size: 12px;
      color: #A4A4A4;
    }
  }
}
</style>
<style lang="scss">
.drag-filter {
  &.drag-active {
    pointer-events: none;
  }
  .filter-info {
    width: 100%;
    height: 32px;
    line-height: 32px;
    border-radius: 4px;
    border: 1px solid #DEDEDE;
    padding-left: 8px;
    font-size: 12px;
    color: #424242;
    cursor: grab;
    background-color: #fff;
    &:hover {
      border: 1px solid #4284F5;
    }
    &.filter-active {
      border: 1px solid #4284F5;
      background-color: #F5F9FE;
    }
    .iconfont {
      font-size: 12px;
      margin-right: 8px;
    }
    .num-active {
      color: #4284f5;
    }
    .cat-active {
      color: #03B98C;
    }
  }
}
</style>
