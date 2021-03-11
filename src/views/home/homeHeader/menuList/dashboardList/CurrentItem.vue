<template>
  <div class="current-item">
    <div class="item-top">{{ num }}</div>
    <div class="item-bottom">
      <span class="canvas-name">{{item.dashboard_title}}</span>
      <span class="iconfont icon-db_menuDot" @click.stop="showHandler"></span>
    </div>
    <scroll-list class="scroll-list" v-click-out="hideList" v-if="isDrop" @loadMore="loadMore">
      <scroll-item v-for="(item, index) in dashboardList" :key="index" :item="item" :index="index"
                   @click.native="changeItem(item, index)"></scroll-item>
    </scroll-list>
    <item-handle class="item-handle" :style="setPos" v-if="isHandle"
                :item-id="item.dashboard_id" :item-index="num-1"
                v-click-out="hideHandler" @close="hideHandler"></item-handle>
  </div>
</template>
<script>
import ScrollList from '../canvasList/ScrollList.vue';
import ScrollItem from './ScrollItem.vue';
import ItemHandle from './ItemHandle.vue';
import { mapState, mapMutations } from 'vuex';
import { get } from '@/api/server';
export default {
  data () {
    return {
      isDrop: false,
      isHandle: false,
      listOffset: 0,
      listLimit: 100,
      list: []
    };
  },
  props: {
    item: {
      type: Object
    },
  },
  computed: {
    ...mapState('project', ['worksheetTypes', 'projectId']),
    ...mapState('dashboard', ['dashboardList', 'dashboardNum']),
    setPos () {
      if (this.isHandle) {
        let curDom = document.querySelector('.menu-list .item-bottom');
        let left = curDom.getBoundingClientRect().left + curDom.getBoundingClientRect().width - 70;
        let top = curDom.getBoundingClientRect().top + 30;
        return {
          left: left + 'px',
          top: top + 'px'
        };
      }
      return {};
    },
    num () {
      let list = this.dashboardList;
      let len = this.dashboardList.length;
      for (let i = 0; i < len; i++) {
        if (list[i].dashboard_id === this.item.dashboard_id) {
          return i + 1;
        }
      }
      return '';
    }
  },
  components: {
    ScrollList,
    ScrollItem,
    ItemHandle
  },
  mounted () {
  },
  methods: {
    ...mapMutations('dashboard', ['setCurrentDashboard', 'setDashboardList']),
    isDropHandler () {
      this.isDrop = !this.isDrop;
      this.isHandle = false;
      if (this.dashboardList.length < this.dashboardNum) {
        this.setDashboardList([]);
        this.getDashboardList();
      }
    },
    hideList () {
      this.isDrop = false;
    },
    hideHandler () {
      this.isHandle = false;
    },
    showHandler () {
      this.isHandle = true;
      this.isDrop = false;
    },
    changeItem (item) {
      if (item.dashboard_id) {
        this.setCurrentDashboard(item);
        this.hideList();
      }
    },
    loadMore () {
      if (this.listOffset > this.canvasNum) return;
      this.getDashboardList();
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
    }
  }
};
</script>
<style lang='scss' scoped>
@import '../scss/currentItem.scss';
</style>
