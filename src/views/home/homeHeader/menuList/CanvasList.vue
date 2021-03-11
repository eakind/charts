<template>
  <div class="list">
    <list-tab :btnName='btnName' :total-list="canvasList" @on-dropList="dropList" @onChangeListType='changeListType' @setPage="setPage"></list-tab>
    <chart-list class="current-item" ref="list" v-show="listType==='page'"
                :offset="offset" :limit="limit"
                :page-list="pageList" :total-list="canvasList"
                @pre="preHandler" @next="nextHandler" @setPage="setPage"></chart-list>
    <current-item class="current-item" :item="current" v-show="listType==='current'"></current-item>
    <canvas-handle class="handle"></canvas-handle>
    <goto-board></goto-board>
  </div>
</template>
<script>
import ListTab from './dashboardList/listTab.vue';
import ChartList from './canvasList/ChartList.vue';
import CurrentItem from './canvasList/CurrentItem.vue';
import CanvasHandle from './canvasList/CanvasHandle.vue';
import GotoBoard from './canvasList/gotoBoard.vue';
import { mapState, mapMutations } from 'vuex';
import { get } from '@/api/server';
export default {
  data () {
    return {
      btnName: 'canvas',
      limit: 0,
      offset: 0,
      pageList: [], // 当前页画布
      timer: null,
      isDel: false
    };
  },
  computed: {
    ...mapState('project', ['projectId', 'listType']),
    ...mapState('drawingboard', ['canvasList', 'currentCanvas', 'canvasNum']),
    typeTxt () {
      return this.listType === 'page' ? '多列表' : '单列表';
    },
    current () {
      let obj = JSON.parse(JSON.stringify(this.currentCanvas));
      for (let i = 0; i < this.canvasList.length; i++) {
        if (obj.worksheet_id === this.canvasList[i].worksheet_id) {
          obj.worksheet_title = this.canvasList[i].worksheet_title;
        }
      }
      return obj;
    }
  },
  watch: {
    canvasList: {
      handler (list) {
        this.setPageList();
      },
      deep: true
    },
    canvasNum (val) {
      if (!val) {
        this.noneCanvas();
      } else {
        this.setIsCreateCanvas(false);
      }
    }
  },
  components: {
    ListTab,
    ChartList,
    CurrentItem,
    CanvasHandle,
    GotoBoard
  },
  beforeDestroy () {
    this.bus.$off('del-canvas');
  },
  mounted () {
    this.getCanvasList(100);
    this.bus.$on('del-canvas', () => {
      this.setPage(0);
    });
  },
  methods: {
    ...mapMutations(['setIsCreateCanvas']),
    ...mapMutations('drawingboard', ['setCurrentCanvas', 'setCanvasList', 'setCanvasNum', 'setCurrentCanvasDetail']),
    ...mapMutations('drawingboard', ['setColumnList', 'setRowList', 'setLabelsCapsuleList', 'setColorCapsuleList', 'setSizeCapsuleList']),
    ...mapMutations('project', ['setListType']),
    changeListType () {
      if (this.listType === 'page') this.setListType('current');
      else this.setListType('page');
      if (this.listType === 'page') {
        this.setPageList();
      }
    },
    // 设置页面画布列表
    setPageList () {
      this.$nextTick(() => {
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        this.pageList = [];
        this.timer = setTimeout(() => {
          if (!this.limit || this.limit === 100) {
            this.limit = this.getLimit();
          }
          this.offset = this.getOffset();
          if (this.offset === this.canvasNum) {
            this.offset = 0;
          }
          this.getCanvasList();
        }, 150);
      });
    },
    getLimit () {
      if (this.listType === 'current') return 100;
      if (!this.$refs.list && !this.$refs.list.$el) return 100;
      let width = this.$refs.list.$el.querySelector('.list').clientWidth;
      let limit = Math.floor(width / 158);
      return limit > 7 ? 7 : limit;
    },
    getOffset () {
      let index = 0;
      for (let i = 0; i < this.canvasList.length; i++) {
        if (this.currentCanvas.worksheet_id === this.canvasList[i].worksheet_id) {
          index = i;
        }
      }
      if (index === 0) {
        if (this.offset + this.limit >= this.canvasList.length) {
          return this.offset;
        }
      }
      let page = Math.floor(index / this.limit);
      return page * this.limit;
    },
    preHandler () {
      if (this.offset <= 0) return;
      this.offset = this.offset - this.limit;
      this.getCanvasList();
    },
    nextHandler () {
      if (this.offset >= this.canvasNum) return;
      this.offset = this.offset + this.limit;
      this.getCanvasList();
    },
    // 设置画布页面
    setPage (index) {
      let page = Math.floor(index / this.limit);
      this.offset = page * this.limit;
      let list = this.canvasList.slice(this.offset, this.offset + this.limit);
      this.pageList = [];
      this.pageList.splice(0, this.limit, ...list);
    },
    noneCanvas () {
      this.setIsCreateCanvas(true);
      this.pageList = [];
      this.setCurrentCanvasDetail({});
      this.setColumnList([]);
      this.setRowList([]);
      this.setLabelsCapsuleList([]);
      this.setColorCapsuleList([]);
      this.setSizeCapsuleList([]);
      this.setCurrentCanvas({});
    },
    async getCanvasList (num) {
      let limitNum = num || this.limit;
      let param = {
        project_id: this.projectId,
        offset: this.offset,
        limit: limitNum
      };
      let list = this.canvasList.slice(this.offset, this.offset + this.limit);
      // 画布列表中是否有当前页所需要的画布
      if (list.length) {
        this.pageList = [];
        this.pageList.splice(0, this.limit, ...list);
        return;
      }
      let res = await get('canvasList', param);
      if (res.code === 0) {
        this.setCanvasNum(res.total_num);
        if (!res.total_num) {
          // 如果没有画布，清除画布，并弹出创建画布
          this.noneCanvas();
          return;
        }
        if (!res.worksheet_list.length) {
          this.pageList = [];
          return;
        }
        if (limitNum === 100) {
          this.setCanvasList(res.worksheet_list);
        } else {
          this.setCanvasList(this.canvasList.concat(res.worksheet_list));
        }
        let list = this.canvasList.slice(this.offset, this.offset + this.limit);
        this.pageList = [];
        this.pageList.splice(0, this.limit, ...list);
        // 如果没有选中画布，默认选中第一个画布
        if (JSON.stringify(this.currentCanvas) === '{}' && this.canvasList.length) {
          this.setCurrentCanvasDetail({});
          this.setColumnList([]);
          this.setRowList([]);
          this.setLabelsCapsuleList([]);
          this.setColorCapsuleList([]);
          this.setSizeCapsuleList([]);
          this.setCurrentCanvas(this.canvasList[0]);
        }
      }
    }
  }
};
</script>
<style lang='scss' scoped>
@import './scss/list.scss';
</style>
