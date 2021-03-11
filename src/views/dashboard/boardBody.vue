<template>
  <div class="board-body">
    <board-layout></board-layout>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  data () {
    return {
      currentIndex: 0,
      isShow: false,
      dashnameList: [{
        name: 'dashname'
      }, {
        name: 'min-width64'
      }, {
        name: 'max-width120'
      }]
    };
  },
  computed: {
    ...mapState('dashboard', ['workSheetList', 'currentDashboardDetail']),
  },
  mounted () {
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.board-body {
  height: 100%;
  background: white;
}
</style>
