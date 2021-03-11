<template>
  <div class="print-view">
    <print-checkbox class="print-check"
                    :disboardList="disboardList"
                    :disboardMap="disboardMap"
                    :activeDashboardIds.sync="activeDashboardIds"/>
    <print-paper-picker class="print-papers" :paperSize.sync="paperSize" :paperName.sync="paperName" />
    <div class="print-main" :style="`width: ${paperSize.w}px`">
      <button @click="printPdf" :loading="isPrinting">下载pdf</button>
      <print-panel
        class="print-panel"
        :style="`height: ${paperSize.h}px`"
        :ref="`panel${index}`"
        v-for="(dashId, index) in activeDashboardIds"
        :key="dashId"
        :isPrinting="isPrinting"
        :dashboardId="dashId"
        :paper-width="paperSize.w"
        :paper-height="paperSize.h"
        :img-info="imgHub[dashId]"
        :dashboard-styles="panelStyles[dashId]"
        @styled="onPanelStyleChange" />
      <!-- 渲染图片的组件 -->
      <print-painter
        v-for="(dashId, index) in renderingDashboardIds"
        :key="dashId"
        :dashboardId="dashId"
        :paper-width="paperSize.w"
        :paper-height="paperSize.h"
        :status="statusMap[dashId]"
        @finish="(id) => onDashboardFinish(id, index)"
        @rendered="onImgGenerated"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { dom2imageUrl } from '@/utils/domSaver';
import * as JsPdf from 'jspdf';
import { throttle } from 'lodash';

import PrintCheckbox from '@/components/dcviewboardprint/PrintCheckbox';
import PrintPaperPicker from '@/components/dcviewboardprint/PrintPaperPicker';
import PrintPanel from '@/components/dcviewboardprint/PrintPanel';
import PrintPainter from '@/components/dcviewboardprint/PrintPainter';

export default {
  name: 'PrintView',
  components: { PrintCheckbox, PrintPaperPicker, PrintPanel, PrintPainter },
  data () {
    return {
      isPrinting: false, // 生成 pdf 中
      parallelCount: 4, // 同时并发数量
      paperName: 'A4',
      paperSize: {
        w: 992, // px
        h: 1403,
        width: 210, // mm
        height: 297,
      },
      panelStyles: {}, // 各个展板的自定义位置大小旋转等信息, { [dashboardId]: Styles{} }
      statusMap: {}, // 并发控制的状态, { [dashboardId]: [wait | loading | done] }
      // 分离预览和生成图片的组件
      activeDashboardIds: [], // 同步渲染, 多选器及预览页
      renderDashboardIds: [], // 异步渲染, 需要加载的所有 dashboard
      imgHub: {}, // 生成完毕的图片, key: dashboardId, value: { url, width, height }
    };
  },
  computed: {
    ...mapState('project', [
      'projectId',
      'projectName',
    ]),
    ...mapState('displayboard', [
      'disboardList',
    ]),
    disboardMap () {
      let map = {};
      if (!this.disboardList) return map;
      this.disboardList.forEach(el => {
        map[el.dashboard_id] = el;
      });
      return map;
    },
    renderingDashboardIds () {
      return this.renderDashboardIds.filter(id => !this.imgHub[id]);
    },
  },
  watch: {
    activeDashboardIds (val, oldVal) {
      setTimeout(() => { // 分离预览和生成图片的组件
        this.renderDashboardIds = val;
        let loadingNum = Object.values(this.statusMap).filter(el => el === 'loading').length;
        val.forEach(id => {
          let status = loadingNum < this.parallelCount ? 'loading' : 'wait';
          if (!this.statusMap[id]) {
            this.$set(this.statusMap, id, status);
            loadingNum++;
          }
        });
      }, 0);
    },
  },
  created () {
    this.initCacheInfos();
    window.addEventListener('beforeunload', this.cacheInfos);
  },
  destroyed () {
    window.removeEventListener('beforeunload', this.cacheInfos);
  },
  methods: {
    initCacheInfos () {
      let dashboardIdsStr = sessionStorage.getItem('printDashboards' + this.projectId);
      if (dashboardIdsStr) {
        this.activeDashboardIds = JSON.parse(dashboardIdsStr);
      }
      let imgHubStr = sessionStorage.getItem('printDashboardImgs' + this.projectId);
      if (imgHubStr) {
        this.imgHub = JSON.parse(imgHubStr);
      }
      let styles = sessionStorage.getItem('printDashboardStyles' + this.projectId);
      if (styles) {
        this.panelStyles = JSON.parse(styles);
      }
    },
    cacheInfos () {
      sessionStorage.setItem('printDashboardImgs' + this.projectId, JSON.stringify(this.imgHub));
      sessionStorage.setItem('printDashboards' + this.projectId, JSON.stringify(this.activeDashboardIds));
      sessionStorage.setItem('printDashboardStyles' + this.projectId, JSON.stringify(this.panelStyles));
    },
    onPanelStyleChange (id, styles) {
      this.panelStyles[id] = styles;
    },
    onDashboardFinish (id, index) {
      this.statusMap[id] = 'done';
      let loadingNum = Object.values(this.statusMap).filter(el => el === 'loading').length;
      let idleCount = this.parallelCount - loadingNum;
      for (let i in this.statusMap) {
        if (this.statusMap[i] === 'wait' && idleCount > 0) {
          this.$set(this.statusMap, i, 'loading');
          idleCount--;
        }
        if (idleCount === 0) {
          break;
        }
      }
    },
    onImgGenerated (id, obj) {
      this.$set(this.imgHub, id, obj);
    },
    printPdf: throttle(async function () {
      this.isPrinting = true;
      await this.$nextTick();
      const { w, h, width, height } = this.paperSize;
      const doc = new JsPdf(
        'p', // orientation, p 竖，l 横
        'px', // unit
        [width, height] // format [width, height]
      );
      let queue = [];
      for (let i = 0, len = this.activeDashboardIds.length; i < len; i++) {
        const node = this.$refs[`panel${i}`][0].$el;
        queue.push(
          dom2imageUrl({
            node: node,
            size: { width: w, height: h },
            scale: 1.2,
            backgroundColor: 'transparent'
          })
        );
      }
      const urls = await Promise.all(queue);
      const imgZoom = 0.75; // TODO 待确认，未知问题，图片 * .75 后和页面大小对应
      urls.forEach((url, i) => {
        doc.addImage(url, 'JPEG', 0, 0, width * imgZoom, height * imgZoom, `panel${i}.jpg`, 'FAST');
        if (i === urls.length - 1) return;
        doc.addPage();
      });
      doc.save(`${this.projectName}.pdf`);
      this.isPrinting = false;
    }, 2000),
  }
};
</script>

<style lang="scss" scoped>
.print-view {
  display: flex;
  height: 100%;
}
.print-check,
.print-papers {
  flex-shrink: 0;
}
.print-main {
  margin: 0 auto;
  padding-top: 30px;
  padding-bottom: 20px;
  flex-grow: 1;
  overflow-y: auto;
}
.print-panel {
  margin: 0 auto 15px;
}
</style>
