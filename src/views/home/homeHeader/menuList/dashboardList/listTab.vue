<template>
  <div class="list-tab">
    <div class="tab-box">
      <div class="tab-left" @click="dropList">
        <span class="iconfont icon-db_arrow drop-btn" :class="isOpen"></span>
        <span class="btn-name">{{ btnName === 'dashboard' ? '展板' : '画布' }}列表</span>
      </div>
      <div class="tab-right">
        <span class="iconfont icon-db10_singleList tab-icon" :class="isActive('page')" @click="changeListType('page')"></span>
        <span class="iconfont icon-db10_multipleList tab-icon" :class="isActive('current')" @click="changeListType('current')"></span>
      </div>
    </div>
    <div class="add-btn" @click="addHandler">
      <span class="iconfont icon-db_plus"></span>
      添加{{ btnName === 'dashboard' ? '展板' : '画布' }}
    </div>
    <scroll-list class="scroll-list"
                 v-click-out="hideList"
                 v-if="isDrop"
                 @loadMore="loadMore">
                 <template v-if="btnName === 'dashboard'">
                   <dashboard-item v-for="(item, index) in totalList"
                   :key="index"
                   :item="item"
                   :item-id="itemId"
                   :index="index"
                   @click.native="changeItem(item, index)"></dashboard-item>
                 </template>
                 <template v-if="btnName === 'canvas'">
                   <canvas-item v-for="(item, index) in totalList"
                   :key="index"
                   :item="item"
                   :item-id="itemId"
                   :index="index"
                   @click.native="changeItem(item, index)"></canvas-item>
                 </template>
    </scroll-list>
  </div>
</template>
<script>
import ScrollList from '../canvasList/ScrollList.vue';
import DashboardItem from './ScrollItem.vue';
import CanvasItem from '../canvasList/canvasScrollItem.vue';
import { mapState, mapMutations } from 'vuex';
import { get, post } from '@/api/server';
export default {
  data () {
    return {
      isDrop: false,
      currrentListType: 'page',
      listOffset: 0,
      listLimit: 100,
      list: [],
      itemId: ''
    };
  },
  props: {
    boardData: {
      type: Object
    },
    btnName: {
      type: String
    },
    totalList: {
      type: Array
    }
  },
  computed: {
    ...mapState('dashboard', ['dashboardNum', 'dashboardList', 'currentDashboard']),
    ...mapState('project', ['projectId']),
    ...mapState('drawingboard', ['currentCanvas', 'canvasNum']),
    isOpen () {
      return this.isDrop ? 'open-active' : '';
    }
  },
  components: {
    ScrollList,
    DashboardItem,
    CanvasItem
  },
  mounted () {
  },
  methods: {
    ...mapMutations(['setIsCreateDashboard', 'setIsCreateCanvas']),
    ...mapMutations('dashboard', ['setDashboardList', 'setCurrentDashboard', 'setDashboardNum', 'setDashboardDetail', 'setCurrentDashboardDetail', 'setLayoutList', 'setLegendList']),
    ...mapMutations('drawingboard', ['setCurrentCanvas', 'setCanvasList', 'setCurrentCanvasDetail', 'setColumnList', 'setRowList']),
    ...mapMutations('drawingboard', ['setLabelsCapsuleList', 'setColorCapsuleList', 'setSizeCapsuleList', 'setCanvasType']),
    hideList (e) {
      if (!e) {
        this.isDrop = false;
        return;
      }
      let curDom = document.querySelector('.menu-list .tab-left');
      if (curDom && curDom.contains(e.target)) {
        return;
      }
      this.isDrop = false;
    },
    dropList () {
      this.isDrop = !this.isDrop;
      if (this.btnName === 'dashboard') {
        this.itemId = this.dashboardId;
        if (this.totalList.length < this.dashboardNum) {
          this.getDashboardList();
        }
      } else if (this.btnName === 'canvas') {
        this.itemId = this.currentCanvas.worksheet_id;
        if (this.totalList.length < this.canvasNum) {
          this.getCanvasList();
        }
      }
    },
    changeListType (val) {
      if (val === this.currrentListType) return;
      this.currrentListType = val;
      this.$emit('onChangeListType', val);
    },
    async addHandler () {
      if (this.btnName === 'dashboard') {
        let param = {
          project_id: this.projectId,
          css: this.boardData
        };
        let res = await post('createDashboard', param);
        if (!res) return;
        let obj = {
          dashboard_id: res.dashboard_id,
          dashboard_idx: res.dashboard_idx,
          dashboard_name: res.dashboard_name,
          dashboard_title: res.dashboard_title
        };
        this.$emit('setPage', this.dashboardNum);
        this.setDashboardNum(++this.dashboardNum);
        this.setCurrentDashboardDetail({});
        this.setLayoutList([]);
        this.setLegendList([]);
        this.setCurrentDashboard(obj);
        this.dashboardList.push(obj);
        this.setDashboardList(this.dashboardList);
      } else if (this.btnName === 'canvas') {
        this.setIsCreateCanvas(true);
      }
    },
    isActive (val) {
      return val === this.currrentListType ? 'active-icon' : '';
    },
    loadMore () {
      if (this.btnName === 'dashboard') {
        if (this.listOffset > this.dashboardNum) return;
        this.getDashboardList();
      } else if (this.btnName === 'canvas') {
        if (this.listOffset > this.canvasNum) return;
        this.getCanvasList();
      }
    },
    async getDashboardList () {
      let param = {
        project_id: this.projectId,
        offset: this.listOffset,
        limit: this.listLimit
      };
      let res = await get('dashboardList', param);
      if (res.code === 0) {
        this.list = this.list.concat(res.dashboard_list);
        this.setDashboardList(this.list);
        this.listOffset = this.listOffset + this.listLimit;
      }
    },
    async getCanvasList () {
      let param = {
        project_id: this.projectId,
        offset: this.listOffset,
        limit: this.listLimit
      };
      let res = await get('canvasList', param);
      if (res.code === 0) {
        this.list = this.list.concat(res.worksheet_list);
        this.setCanvasList(this.list);
        this.listOffset = this.listOffset + this.listLimit;
      }
    },
    changeItem (item, index) {
      if (this.btnName === 'dashboard') {
        if (item.dashboard_id !== this.currentDashboard.dashboard_id) {
          this.itemId = item.dashboard_id;
          this.setDashboardDetail({});
          this.setCurrentDashboard(item);
        }
      } else if (this.btnName === 'canvas') {
        if (item.worksheet_id !== this.currentCanvas.worksheet_id) {
          this.itemId = item.worksheet_id;
          this.setCurrentCanvasDetail({});
          this.setColumnList([]);
          this.setRowList([]);
          this.setLabelsCapsuleList([]);
          this.setColorCapsuleList([]);
          this.setSizeCapsuleList([]);
          this.setCurrentCanvas(item);
        }
      };
      this.hideList();
      if (index || index === 0) {
        this.$emit('setPage', index);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.list-tab {
  position: relative;
  display: flex;
  align-items: center;
  .tab-box {
    width: 150px;
    padding: 0 5px;
    height: 30px;
    line-height: 30px;
    border: 1px solid #DEDEDE;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 12px;
    box-sizing: border-box;
    cursor: pointer;
    .tab-left {
      .drop-btn {
        display: inline-block;
        transform: rotate(90deg);
        color: #c4c4c4;
      }
      .open-active{
        transform: rotate(-90deg);
      }
      .btn-name {
        display: inline-block;
        height: 20px;
        line-height: 20px;
        padding: 0px 15px 0px 10px;
        border-right: 1px solid #DEDEDE;
        color: #424242;
      }
    }
    .tab-right {
      height: 20px;
      width: 40px;
      background: #DEDEDE;
      border-radius: 2px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      .tab-icon {
        display: inline-block;
        height: 16px;
        line-height: 16px;
        color: #fff;
        border-radius: 2px;
      }
      .active-icon {
        background: #666666;
      }
    }
  }
  .add-btn {
    height: 24px;
    line-height: 24px;
    width: 80px;
    color: #fff;
    font-size: 12px;
    background: #666666;
    border-radius: 4px;
    margin: 0px 20px 0px 8px;
    cursor: pointer;
    text-align: center;
    span {
      font-size: 12px;
      background: linear-gradient(to right, #89F7FE, #66A6FF);
      background-clip: text;
      color: transparent;
    }
  }
  .scroll-list{
    top: 34px;
    left: 0px;
    z-index: 9999;
    max-height: 240px;
    width: 400px;
    position: absolute;
    background: #fff;
    box-shadow: 0 3px 7px 0 rgba(0,0,0,0.10);
    border-radius: 4px;
  }
}
</style>
