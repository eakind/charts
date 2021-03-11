<!--  -->
<template>
  <div class="drag-float-item">
    <vue-drag-resize
        v-for="(item, index) in list"
        :key="index"
        :isActive="false"
        :w="item.widthPx"
        :h="item.heightPx"
        :z="item.floatZIndex"
        :x="item.floatX"
        :y="item.floatY"
        @resizing="resizeItem"
        @dragging="resizeItem"
        @activated="activateEv(item)"
        :parentW="200"
        contentClass="drag-layout-item">
        <mc-chart
          :work-sheet-id="item.worksheetId"
          :style-obj="item.style"
          @no-chart="noChart(item)"
          v-if="!item.isEmpty && item.type === 'canvas'"
          :need-request="item.needRequest"
        ></mc-chart>
        <text-chart
          :showFlag.sync="showTextEditFlag"
          :selected-target="selectedTarget"
          :item-data="item"
          :id="item.idx"
          :style-obj="item.style"
          :show-edit="isEditText"
          @close="closeEdit"
          v-if="!item.isEmpty && item.type === 'text'"
        ></text-chart>
        <filter-chart
          :filterId="item.filterId"
          :filterType="item.filterType"
          :style-obj="item.style"
          v-if="!item.isEmpty && item.type === 'filter'"
        ></filter-chart>
        <menu-btn
          :item-data="item"
          :style="isMenuPosition(item)"
          @set-layout-item="setCurrentLayoutItem">
        </menu-btn>
      </vue-drag-resize>
  </div>
</template>

<script>
import McChart from '../../mcChart.vue';
import TextChart from '../../textChart.vue';
import FilterChart from '../../filterChart';
import MenuBtn from '../components/menuBtn.vue';
import { boardMixin } from '../mixins/boardMixin.js';
import { mapState, mapMutations } from 'vuex';
import { post } from '@/api/server';
export default {
  mixins: [boardMixin],
  data () {
    return {
      resizeTimer: null
    };
  },
  props: {
    list: {
      type: Array,
    },
  },
  components: {
    McChart,
    TextChart,
    FilterChart,
    MenuBtn
  },
  computed: {
    ...mapState('dashboard', ['currentDashboardDetail', 'floatComponents', 'selectedTarget']),
    ...mapState('project', ['projectId']),
  },
  watch: {},
  mounted () {},
  methods: {
    ...mapMutations('dashboard', ['setSelectedTarget', 'setCurrentTarget']),
    resizeItem (newItem) {
      if (this.resizeTimer) {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
          console.log(newItem);
          let floatX = newItem.left;
          let floatY = newItem.top;
          let widthPx = newItem.width;
          let heightPx = newItem.height;
          // let oldWidthPx = this.selectedTarget.widthPx;
          // // let oldHeightPx = this.selectedTarget.heightPx;
          // let oldWidth = this.selectedTarget.width;
          // // let oldHeight = this.selectedTarget.height;
          // let width = (widthPx * 100) / (oldWidthPx * 100 / oldWidth);
          this.$set(this.selectedTarget, 'widthPx', widthPx);
          this.$set(this.selectedTarget, 'heightPx', heightPx);
          this.$set(this.selectedTarget, 'floatX', floatX);
          this.$set(this.selectedTarget, 'floatY', floatY);
          this.floatComponents.forEach((item, index) => {
            if (item.idx === this.selectedTarget.idx) {
              this.$set(this.floatComponents, index, this.selectedTarget);
            }
          });
          let params = {
            dashboard_id: this.currentDashboardDetail.dashboard_id,
            project_id: this.projectId,
            floats: this.floatComponents
          };
          let res = post('dashboardFloats', params);
          if (res.code === 0) {
          }
          // this.$set(this.selectedTarget, 'width', width);
          // this.setCss({ attr: 'layoutList', css: this.layoutList, projectId: this.projectId });
          clearTimeout(this.resizeTimer);
        }, 1000);
      } else {
        this.resizeTimer = setTimeout(() => {
          console.log(newItem);
          clearTimeout(this.resizeTimer);
        }, 1000);
      }
    },
    activateEv (item) {
      console.log(item);
      this.setSelectedTarget(item);
      this.setCurrentTarget(item);
    },
    setCurrentLayoutItem (item, isDir) {
      this.$emit('set-layout-item', item, isDir);
    },
  }
};
</script>
<style lang='scss' scoped>
</style>
