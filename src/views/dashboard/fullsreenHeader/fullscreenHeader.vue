<template>
  <div class="fullscreen-header">
      <div class="title-box" v-show="fullScreen" :class="titleBoxClass"
          @mouseenter="isShow= true" @mouseleave="isShow=false">
        <div class="full-title" v-show="isShow">
          <div class="left">
            <span class="name-list" :class="currentDashboard.dashboard_id === item.dashboard_id ? 'activeClass' : ''"
                  v-for="(item, index) in dashboardList" :key="index"
                  @click="changeItem(item)">
                  {{item.dashboard_title}}
            </span>
          </div>
          <div class="right">
            <span class="cancel-btn" @click="cancelAllAction" v-show="actionList.length">取消所有联动选择</span>
            <span class="back-btn" @click="cancelSetFull">退出演示</span>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex';
import { post } from '@/api/server';
import { refreshCanvasMixin } from '../boardLayout/mixins/refreshCanvas.js';
export default {
  mixins: [refreshCanvasMixin],
  data () {
    return {
      currentIndex: 0,
      isShow: false
    };
  },
  computed: {
    ...mapState('project', ['projectId']),
    ...mapState('dashboard', ['fullScreen', 'dashboardList', 'currentDashboard', 'currentDashboardDetail', 'actionList', 'layoutList']),
    titleBoxClass () {
      return this.isShow ? 'shadow-style' : '';
    },
  },
  mounted () {
  },
  beforeDestroy () {
    this.setFullScreen(false);
  },
  methods: {
    ...mapMutations('dashboard', ['setFullScreen', 'setCurrentDashboardDetail', 'setCurrentDashboard']),
    cancelSetFull () {
      if (this.fullScreen) {
        this.setFullScreen(false);
        // document.exitFullscreen();
      } else {
        this.setFullScreen(true);
        // document.body.requestFullscreen();
      }
    },
    changeItem (item) {
      if (this.currentDashboard.dashboard_id === item.dashboard_id) return;
      this.setCurrentDashboard(item);
      // this.getDashboardDetail();
    },
    // async getDashboardDetail () {
    //   let param = {
    //     project_id: this.projectId,
    //     dashboard_id: this.currentDashboard.dashboard_id
    //   };
    //   let res = await get('dashboardDetail', param);
    //   if (res.code === 0) {
    //     this.setCurrentDashboardDetail(res);
    //   }
    // },
    async cancelAllAction () {
      let param = {
        project_id: this.projectId,
        dashboard_id: this.currentDashboard.dashboard_id
      };
      let res = await post('actionClear', param);
      if (res.code === 0) {
        this.$message({
          message: '操作成功。',
          type: 'success'
        });
        this.refreshAllCanvas(this.layoutList);
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.fullscreen-header {
    .title-box {
      height: 32px;
      width: 100%;
      overflow: hidden;
      cursor: pointer;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
    }
    .shadow-style {
      box-shadow: 0px 3px 7px rgba(0, 0, 0, 0.2);
    }
    .full-title {
      height: 32px;
      line-height: 32px;
      width: 100%;
      padding-left: 6px;
      display: flex;
      background: #fff;
      .left {
        flex: 1;
        margin-top: 4px;
        overflow-x: auto;
        overflow-y: hidden;
      }
      .right {
        margin-left: 20px;
        width: 230px;
        float: right;
        text-align: right;
        .cancel-btn {
          width: 128px;
          color: #666666;
          border: 1px solid #666666;
        }
        .back-btn {
          width: 80px;
          margin: 4px 8px;
          background: #666666;
          color: #fff;
        }
        > span {
          display: inline-block;
          height: 24px;
          line-height: 24px;
          text-align: center;
          font-size: 12px;
          border-radius: 4px;
          cursor: pointer;
        }
      }
      .name-list {
        display: inline-block;
        height: 28px;
        line-height: 28px;
        text-align: center;
        color: #A4A4A4;
        font-size: 12px;
        min-width: 64px;
        max-width: 120px;
        padding: 0 4px;
        margin-left: 2px;
        border: 1px solid #DEDEDE;
        border-bottom: none;
        border-radius: 4px 4px 0px 0px;
        cursor: pointer;
        @include ellipsis;
      }
      .activeClass {
        border-color: #4284F5;
        color: #424242;
      }
    }
  }
</style>
