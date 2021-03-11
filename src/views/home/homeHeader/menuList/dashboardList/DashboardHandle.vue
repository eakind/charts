<template>
  <div class="dashboard-handle">
    <div class="handle-item" @click.stop="isZoom=!isZoom">
      <span class="item-up">
        {{Math.floor(zoomSize * 100)}}%
      </span>
      <div>{{$t('home.zoom')}}</div>
    </div>
    <div class="handle-item" @click="setFull">
      <span class="item-up iconfont icon-db_display"></span>
      <div>演示</div>
    </div>
    <div class="handle-item" :class="isEmptyBoard?'disabled':''" @click="exportProcess" >
      <span class="item-up iconfont icon-db_export" :class="isEmptyBoard?'disabled':''"></span>
      <div :class="isEmptyBoard?'disabled':''">导出</div>
    </div>
    <board-zoom v-if="isZoom" @hide="hideHandler" v-click-out="hideHandler"></board-zoom>
    <board-layout v-if="isLayout" @hide="hideHandler" v-click-out="hideHandler"></board-layout>
    <view-item v-if="isView" @hide="hideHandler" v-click-out="hideHandler"></view-item>
    <export-file v-if="isExport" @hide="hideHandler"  v-click-out="hideHandler"></export-file>
  </div>
</template>
<script>
import ExportFile from '../handle/ExportFile.vue';
import BoardZoom from '../handle/BoardZoom.vue';
import BoardLayout from '../handle/BoardLayout.vue';
import ViewItem from '../handle/ViewItem.vue';
import { mapState, mapMutations } from 'vuex';
export default {
  data () {
    return {
      isExport: false,
      isZoom: false,
      isLayout: false,
      isView: false,
      isEmptyBoard: true
    };
  },
  computed: {
    ...mapState('dashboard', ['viewMode', 'layoutFlag', 'zoomSize', 'fullScreen', 'layoutList']),
    viewType () {
      let obj = {
        standard: this.$t('home.standard_view'),
        full: this.$t('home.full_view'),
        fitHeight: this.$t('home.height_view'),
        fitWidth: this.$t('home.width_view')
      };
      if (obj[this.viewMode]) {
        return obj[this.viewMode];
      }
      return this.$t('home.full_view');
    },
    layoutType () {
      let obj = {
        true: this.$t('home.set_layout'),
        false: this.$t('home.float_layout')
      };
      return obj[this.layoutFlag];
    },
  },
  components: {
    ExportFile,
    BoardZoom,
    BoardLayout,
    ViewItem
  },
  watch: {
    layoutList: {
      handler (list) {
        this.isEmptyBoard = false;
        if (!list[1]) this.isEmptyBoard = true;
        if (list[1] && list[1].isEmpty && !list[1].children.length) {
          this.isEmptyBoard = true;
        }
      },
      deep: true
    }
  },
  mounted () {
  },
  methods: {
    ...mapMutations('dashboard', ['setFullScreen']),
    // addHandler () {
    //   this.setIsCreateDashboard(true);
    // },
    hideHandler () {
      this.isZoom = false;
      this.isExport = false;
      this.isLayout = false;
      this.isView = false;
    },
    exportProcess () {
      if (this.isEmptyBoard) return;
      this.isExport = !this.isExport;
    },
    setFull () {
      if (this.fullScreen) {
        this.setFullScreen(false);
        // document.exitFullscreen();
      } else {
        this.setFullScreen(true);
        // document.body.requestFullscreen();
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.dashboard-handle {
  display: flex;
  align-items: center;
  position: relative;
  margin: 0 4px;
  .handle-item{
    flex: 1;
    cursor: pointer;
    color: #A4A4A4;
    font-weight: 300;
    text-align: center;
    font-size: 12px;
    > div {
      font-family: "siyuanheiti",
    }
  }
  .item-up{
    color: #424242;
    display: inline-block;
    margin-bottom: 5px;
    font-size: 12px;
    font-weight: bold;
  }
  .disabled{
    cursor: default;
    color: #ccc !important;
  }
}
</style>
