<template>
  <div class="scroll-item" :class="isActive">
    <span class="num">{{index + 1}}.</span>
    <span class="title">{{item.dashboard_title}}</span>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  data () {
    return {
    };
  },
  props: {
    item: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  computed: {
    ...mapState('dashboard', ['currentDashboard']),
    isActive () {
      if (this.item.dashboard_id === this.currentDashboard.dashboard_id) {
        return 'scroll-active';
      }
      return '';
    }
  },
  components: {
  },
  mounted () {
  },
  methods: {
  }
};
</script>
<style lang='scss' scoped>
@import '../scss/scrollItem.scss';
</style>
