<template>
  <div class="menu-list">
    <canvas-list class="canvas-list" v-if="isCanvas"></canvas-list>
    <dashboard-list class="dashboard-list" v-if="isDashboard"></dashboard-list>
  </div>
</template>
<script>
import CanvasList from './menuList/CanvasList.vue';
import DashboardList from './menuList/DashboardList.vue';
import { mapMutations } from 'vuex';
export default {
  data () {
    return {
    };
  },
  components: {
    CanvasList,
    DashboardList
  },
  computed: {
    isCanvas () {
      return this.$route.name === 'drawingboard';
    },
    isDashboard () {
      return this.$route.name === 'dashboard';
    }
  },
  created () {
    this.setCanvasList([]);
    this.setDashboardList([]);
  },
  mounted () {
  },
  methods: {
    ...mapMutations('drawingboard', ['setCanvasList']),
    ...mapMutations('dashboard', ['setDashboardList'])
  }
};
</script>
<style lang='scss' scoped>
.menu-list{
  padding-left: 0px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  .canvas-list{
    flex:1;
    width: 0;
  }
  .dashboard-list{
    flex: 1;
    width: 0;
    height: 60px;
  }
}
</style>
