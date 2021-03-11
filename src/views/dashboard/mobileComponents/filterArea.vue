<!--  -->
<template>
  <div class="filter-area">
    <div class="area-title">过滤器区域</div>
    <div class="area-container">
      <!-- <div class="area-item"
        v-for="(item, index) in filterList"
        :key="index">
        <filter-chart
          :filterId="item.filterId"
          :filterType="item.filterType"
          :style-obj="item.style"
        ></filter-chart>
      </div> -->
      <!-- <fixed-width
        v-if="reloadLayout"
        :layout-idx="layoutIdx"
        :list="filterList"
        :is-dragging="isDragging"
        :selected-target="selectedTarget"
        @select="selectedTargetHandler"
        @change="changeHandler"
      ></fixed-width> -->
      <board-layout mode-type="fixedWidth" layout-type="mobileFilter" :device="device" ref="layout"></board-layout>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
// import FilterChart from '../filterChart.vue';
// import FixedWidth from '../boardLayout/fixedWidth/index.vue';
import BoardLayout from '../boardLayout/index.vue';
import { refreshCanvasMixin } from '../boardLayout/mixins/refreshCanvas.js';
export default {
  mixins: [refreshCanvasMixin],
  data () {
    return {
      filterList: [],
      reloadLayout: true
    };
  },
  components: {
    // FilterChart,
    // FixedWidth,
    BoardLayout
  },
  computed: {
    ...mapState('project', ['projectId']),
    ...mapState('dashboard', ['layoutList', 'selectedTarget', 'currentTarget', 'currentDashboardDetail']),
    device () {
      return this.currentDashboardDetail.css.device || 'pc';
    }
  },
  watch: {
    layoutList: {
      handler (val) {
        this.filterList = [];
        this.setFilterList(val);
        console.log(this.filterList);
      },
      deep: true
    }
  },
  mounted () {
    this.filterList = [];
    this.setFilterList(this.layoutList);
  },
  methods: {
    ...mapMutations('dashboard', ['setSelectedTarget', 'setCurrentTarget', 'setLayoutList']),
    ...mapActions('dashboard', ['setCss']),
    setFilterList (list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].type === 'filter') {
          let obj = JSON.parse(JSON.stringify(list[i]));
          obj.level = 0;
          obj.isDir = 'top';
          obj.dir = 'row';
          obj.children = [];
          this.filterList.push(obj);
        }
        this.setFilterList(list[i].children);
      }
    },
    // 选中展板中的画布
    selectedTargetHandler (item) {
      if (this.fullScreen) return;
      this.setSelectedTarget(item);
      if (item.styleId && item.styleId === this.currentTarget.id) {
        return;
      }
      this.setCurrentTarget(JSON.parse(JSON.stringify({})));
      if (item.type === 'title') return;
      setTimeout(() => {
        let obj = {
          type: item.type,
          id: item.styleId,
          worksheetId: item.worksheetId,
          style: item.style,
        };
        this.setCurrentTarget(obj);
      }, 0);
    },
    changeHandler (list, item) {
      this.setLayoutList(list);
      this.setSelectedTarget({});
      this.reload();
      this.setCss({ attr: 'layoutList', css: list, projectId: this.projectId });
    },
    reload () {
      this.reloadLayout = false;
      setTimeout(() => {
        this.reloadLayout = true;
        setTimeout(() => {
          this.refreshAllCanvas(this.layoutList);
        });
      });
    }
  }
};

</script>
<style lang='scss' scoped>
.filter-area {
  width: 50%;
  margin-right: 10px;
  .area-title {
    color: #adadae
  }
  .area-container {
    width: 100%;
    background-color: #fff;
    border-radius: 4px;
    height: 800px;
    position: relative;
  }
}
</style>
