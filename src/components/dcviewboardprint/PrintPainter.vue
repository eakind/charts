<template>
  <div>
    <div ref="ct" class="ct" :style="ctStyle" v-if="status !== 'wait'">
      <bg-color :bgColor="colorTemp" />
      <display-title
        :title="dashboardDetail.dashboard_title"
        :titleCss="titleCss"
        :border="styles?styles.border:0"
        :padding="styles?styles.padding:0"
      />
      <print-body
        :worksheetList="dashboardDetail.worksheets"
        :layoutFlag="layoutFlag"
        :layoutList="styles ? styles.layout : []"
        :boardCss="styles"
        :titleH="titleCss ? parseInt(titleCss.height) : 50"
        :projectId="projectId"
        :dashboardId="dashboardId"
        :legends="legends"
        @finish="onDataInited"
      />
      <div
        class="legend-bg"
        :style="[{top: layoutFlag ? titleCss.height : ''}, {overflowY: layoutFlag ? 'auto' : 'initial'}, {color: titleCss.color + '!important'}]"
      >
        <board-legend
          v-show="item && (item.sizes.length > 0 ||item.colors.length > 0)"
          v-for="(item, index) in legends"
          :key="index"
          :index="index"
          :item="item"
          :layoutFlag="layoutFlag"
        ></board-legend>
      </div>
    </div>
  </div>
</template>

<script>
import { get } from '@/api/server';
import { getStorage } from '@/utils/utils';
import { mapState } from 'vuex';
import { dom2imageUrl } from '@/utils/domSaver';

import DisplayTitle from './DisTitle';
import PrintBody from './PrintBody';
import BoardLegend from '../dcviewboard/BoardLegend';

export default {
  components: { DisplayTitle, PrintBody, BoardLegend },
  props: {
    dashboardId: String,
    paperWidth: Number, // 纸张宽度，px
    paperHeight: Number,
    status: { // 并发控制的状态，wait, loading, done
      default: 'wait',
    },
  },
  data () {
    return {
      dashboardDetail: {},
      legends: [],
    };
  },
  computed: {
    ...mapState('project', [
      'projectId',
    ]),
    styles () { // detail中的css样式
      const detail = this.dashboardDetail;
      return detail && detail.css;
    },
    titleCss () {
      return this.dashboardDetail.dashboard_title_css || {};
    },
    layoutFlag () {
      return this.styles && this.styles.layoutFlag;
    },
    ctStyle () { // 画布渲染样式
      const styles = this.styles;
      if (!styles) return {};
      return {
        // top: parseInt(top) + 'px',
        // left: parseInt(left) + 'px',
        top: '-99999px',
        left: '-99999px',
        padding: styles.padding + 'px',
        width: parseInt(styles.width) + 'px',
        height: parseInt(styles.height) + 'px',
        // transform: `scale(${zoom})`,
        border: styles.border + 'px solid black',
      };
    },
    colorTemp () {
      const detail = this.dashboardDetail || {};
      return (detail.css && detail.css.colorTemp) || {};
    },
  },
  created () {
    this.initData();
  },
  methods: {
    async initData () {
      const storedDashboard = getStorage(this.dashboardId) || null;
      if (storedDashboard) {
        this.dashboardDetail = JSON.parse(storedDashboard);
      } else {
        await this.getDashboardDetail(this.dashboardId);
      }
      this.legends = this.dashboardDetail.legends || [];
      const { worksheets } = this.dashboardDetail;
      if (!worksheets || !worksheets.length) {
        this.$emit('finish', this.dashboardId);
      }
    },

    async getDashboardDetail () {
      let param = {
        project_id: this.projectId,
        dashboard_id: this.dashboardId
      };
      let res = await get('dashboardDetail', param);
      if (!res) return;
      this.dashboardDetail = res;
      sessionStorage.setItem(this.dashboardId, JSON.stringify(res));
      return res;
    },

    async onDataInited () {
      await this.$nextTick();
      this.$emit('finish', this.dashboardId);
      await this.$nextTick();
      this.exportCt();
    },

    async exportCt () {
      const node = this.$refs.ct;
      const { width, height } = this.styles;
      const url = await dom2imageUrl({
        node: node,
        size: { width, height },
        scale: 1.2,
        backgroundColor: 'transparent'
      });
      this.$emit(
        'rendered',
        this.dashboardId,
        {
          url, width, height
        }
      );
    },
  }
};
</script>

<style lang='scss' scoped>
.legend-bg {
  position: absolute;
  right: 2px;
  top: 48px;
  width: 135px;
  display: inline-block;
  overflow-y: auto;
  overflow-x: hidden!important;
  height: calc(100% - 48px);
}
.ct {
  > div {
    white-space: normal;
  }
  position: absolute;
  box-sizing: border-box;
  // pointer-events: none;
}
</style>
