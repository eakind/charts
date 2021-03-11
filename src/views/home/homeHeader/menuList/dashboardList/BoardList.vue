<template>
  <div class="chart-list">
    <div class="list">
      <list-item v-for="(item, index) in pageList"
                 :key="index"
                 :item="item"
                 @click.native="changeItem(item)"></list-item>
    </div>
    <template v-if="isPreActive||isNextActive">
      <span class="iconfont icon-db_arrow current-btn left"
            :class="isPreActive"
            @click="preHandler"></span>
      <span class="iconfont icon-db_arrow current-btn right"
            :class="isNextActive"
            @click="nextHandler"></span>
    </template>
  </div>
</template>
<script>
import ListItem from './ListItem.vue';
import { mapMutations, mapState } from 'vuex';
import { get } from '@/api/server';
export default {
  data () {
    return {
      isDrop: false,
      btnName: '展板列表',
      itemId: '',
      listOffset: 0,
      listLimit: 100,
      list: []
    };
  },
  props: {
    pageList: {
      type: Array
    },
    offset: {
      type: Number
    },
    limit: {
      type: Number
    },
    totalList: {
      type: Array
    }
  },
  computed: {
    ...mapState('project', ['projectId']),
    ...mapState('dashboard', ['currentDashboard', 'dashboardNum', 'listType']),
    isOpen () {
      return this.isDrop ? 'open-active' : '';
    },
    isPreActive () {
      if (this.offset > 0) {
        return 'icon-active';
      }
      return '';
    },
    isNextActive () {
      if ((this.offset + this.limit) < this.dashboardNum) {
        return 'icon-active';
      }
      return '';
    }
  },
  components: {
    ListItem
  },
  mounted () {
  },
  methods: {
    ...mapMutations('dashboard', ['setCurrentDashboard', 'setDashboardList', 'setListType', 'setCurrentDashboardDetail', 'setLegendList', 'setLayoutList']),
    preHandler () {
      this.$emit('pre');
    },
    nextHandler () {
      this.$emit('next');
    },
    hideList (e) {
      if (!e) {
        this.isDrop = false;
        return;
      }
      let curDom = document.querySelector('.menu-list .icon-db_arrow.drop-btn');
      if (curDom && curDom.contains(e.target)) {
        return;
      }
      this.isDrop = false;
    },
    dropList () {
      this.itemId = this.currentDashboard.dashboard_id;
      this.isDrop = !this.isDrop;
      if (this.totalList.length < this.dashboardNum) {
        this.getDashboardList();
      }
    },
    changeItem (item, index) {
      if (item.dashboard_id !== this.currentDashboard.dashboard_id) {
        this.itemId = item.dashboard_id;
        this.setCurrentDashboardDetail({});
        this.setLayoutList([]);
        this.setLegendList([]);
        this.setCurrentDashboard(item);
        this.hideList();
        if (index || index === 0) {
          this.$emit('setPage', index);
        }
      }
    },
    loadMore () {
      if (this.listOffset > this.dashboardNum) return;
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
@import "../scss/chartList.scss";
</style>
