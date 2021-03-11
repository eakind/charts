<template>
  <div class="list-item"  @mouseenter="mouseEnter" @click="isDot=true"
       @mouseleave="isDot=false;isHandle=false">
    <div class="item-up">
      <span class="item-num">{{num}}.</span>
    </div>
    <div class="item-down" :class="isActive" :title="item.dashboard_title">
      {{item.dashboard_title}}
    </div>
    <span class="iconfont icon-db_menuDot" v-if="isDot" @click.stop="showHandler"></span>
    <item-handle class="item-handle" :style="setPos" v-if="isHandle"
                :item-id="item.dashboard_id" :item-index="num-1"
                v-click-out="hideHandler" @close="hideHandler"></item-handle>
  </div>
</template>
<script>
import ItemHandle from './ItemHandle.vue';
import { mapState } from 'vuex';
export default {
  data () {
    return {
      isHandle: false,
      isDot: false
    };
  },
  props: {
    item: {
      type: Object
    }
  },
  computed: {
    ...mapState('dashboard', ['currentDashboard', 'dashboardList']),
    isActive () {
      if (this.item.dashboard_id === this.currentDashboard.dashboard_id) {
        return 'item-active';
      }
      return '';
    },
    setPos () {
      if (this.isHandle) {
        let left = this.$el.getBoundingClientRect().left + 80;
        let top = this.$el.getBoundingClientRect().bottom;
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
        if (this.item.dashboard_id === list[i].dashboard_id) {
          return i + 1;
        }
      }
      return '';
    }
  },
  components: {
    ItemHandle
  },
  mounted () {
  },
  methods: {
    mouseEnter () {
      this.isDot = true;
    },
    hideHandler () {
      this.isHandle = false;
    },
    showHandler () {
      this.isHandle = !this.isHandle;
    }
  }
};
</script>
<style lang='scss' scoped>
@import '../scss/listItem.scss';
</style>
