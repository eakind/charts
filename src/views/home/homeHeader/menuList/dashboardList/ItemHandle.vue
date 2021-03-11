<template>
  <div class="item-handle">
    <div class="triangle-box">
      <div class="item-triangle"></div>
    </div>
    <div class="iconfont icon-db_trash" @click.stop="delDashboardProcess">
      {{$t('home.del_board')}}
    </div>
  </div>
</template>
<script>
import { post } from '@/api/server';
import { mapState, mapMutations } from 'vuex';
export default {
  data () {
    return {
    };
  },
  props: {
    itemId: {
      type: String
    },
    itemIndex: {
      type: Number
    }
  },
  computed: {
    ...mapState('project', ['projectId']),
    ...mapState('dashboard', ['dashboardList', 'dashboardNum', 'currentDashboard'])
  },
  components: {
  },
  mounted () {
  },
  methods: {
    ...mapMutations('dashboard', ['setDashboardList', 'setCurrentDashboard', 'setDashboardNum', 'setCurrentDashboardDetail', 'setLayoutList', 'setLegendList']),
    delDashboardProcess () {
      this.$showMessageBox({
        title: this.$t('home.del_board'),
        confirmText: this.$t('home.confirm'),
        cancelText: this.$t('home.cancel'),
        contentHtml: this.$t('home.del_board_tip'),
        cb: () => {
          this.delDashboard();
          this.$closeMessageBox();
        }
      });
    },
    async delDashboard () {
      let param = {
        project_id: this.projectId,
        dashboard_id: this.itemId
      };
      this.$emit('close');
      let res = await post('deleteDashboard', param);
      if (res.code !== 0) return;
      for (let i = 0; i < this.dashboardList.length; i++) {
        if (this.itemId === this.dashboardList[i].dashboard_id) {
          this.dashboardList.splice(i, 1);
          break;
        }
      }
      this.setDashboardNum(--this.dashboardNum);
      this.setDashboardList(this.dashboardList);
      if (this.dashboardNum === 0) {
        this.setCurrentDashboard({});
        return;
      };
      if (this.currentDashboard.dashboard_id === this.itemId) {
        this.setCurrentDashboardDetail({});
        this.setLayoutList([]);
        this.setLegendList([]);
        this.setCurrentDashboard(this.dashboardList[0]);
        this.bus.$emit('del-dashboard');
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.item-handle {
  height: auto;
  color: #fff;
  position: fixed;
  z-index: 999;
  .triangle-box {
    height: 10px;
    width: 120px;
  }
  .item-triangle {
    display: inline-block;
    border-bottom: 12px solid #666666;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    position: absolute;
    left: calc(50% - 3px);
    top: 0px;
  }
  .iconfont{
    height: 35px;
    width: 120px;
    cursor: pointer;
    padding: 8px 15px;
    font-size: 14px;
    background: #666666;
    border-radius: 0px 0px 4px 4px;
  }
}
</style>
