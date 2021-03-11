<template>
  <div class="print-body">
    <canvas-item
      v-for="(item, index) in layoutList"
      :key="index"
      :index="index"
      :item="item"
      :layoutFlag="layoutFlag"
      :detail="canvasList[index]"
      :data="dataList[index]"
      :width="boardW"
      :height="boardH"
      :worksheetTypes="worksheetTypes"
      :legends="legends"
      :id-suffix="randomId"
    />
  </div>
</template>

<script>
import CanvasItem from '@/components/dcviewboard/CanvasItem';
import { get, post } from '@/api/server';
import { mapState } from 'vuex';
import { uuid } from '@/utils/utils';

export default {
  components: { CanvasItem },
  props: {
    projectId: String,
    dashboardId: String,
    boardCss: { // 展板样式
      type: Object
    },
    titleH: Number,
    worksheetList: { // 画布基本信息列表
      type: Array,
      default () {
        return [];
      }
    },
    legends: {
      type: Array,
      default () {
        return [];
      }
    },
    layoutFlag: Boolean, // true, 固定布局; false, 浮动布局
    layoutList: { // 展板grid排列
      type: Array,
      default () {
        return [];
      }
    },
  },
  data () {
    return {
      randomId: uuid(),
      canvasList: [],
      dataList: [],
      legendW: 140,
    };
  },
  computed: {
    ...mapState('project', ['worksheetTypes']),
    boardW () {
      return this.boardCss.width -
              this.legendW -
              2 * this.boardCss.padding -
              2 * this.boardCss.border;
    },
    boardH () {
      return this.boardCss.height -
              this.titleH -
              2 * this.boardCss.padding -
              2 * this.boardCss.border;
    },
  },
  watch: {
    worksheetList: {
      handler (list) {
        let flag = true;
        if (!list || list.length === 0) {
          this.canvasList = [];
          this.dataList = [];
          this.flagObj = {};
          return;
        }
        if (list.length === this.canvasList.length) {
          for (let i = 0; i < this.canvasList.length; i++) {
            if (!this.canvasList[i] || !list[i]) continue;
            if (this.canvasList[i].worksheet_id === list[i].worksheetId) {
              flag = false;
            }
          }
        }
        if (flag) {
          this.initCanvas();
        }
      },
      deep: true,
      immediate: true
    },
  },
  methods: {
    async initCanvas () {
      const list = this.worksheetList;
      for (let i = 0; i < list.length; i++) {
        if (list[i]) {
          let detail = sessionStorage.getItem(list[i].worksheetId);
          detail = detail
            ? JSON.parse(detail)
            : await this.worksheetDetail(list[i].worksheetId);
          if (detail.code !== 0) continue;
          detail.titleCss = list[i].css;
          if (!detail.titleCss) {
            detail.titleCss = {
              display: ''
            };
          }
          let fontColor = this.fontColor;
          if (detail.css.titleCss) {
            fontColor = detail.css.titleCss.color;
          }
          detail.titleCss.color = fontColor;
          let fontOpacity = 1;
          if (detail.css.titleCss) {
            fontOpacity = detail.css.titleCss.opacity / 100;
          }
          detail.titleCss.opacity = fontOpacity;
          this.canvasList.push(detail);
        } else {
          this.canvasList.push('');
        }
      }
      if (!this.canvasList.length === 0) return;
      await this.reviseCanvasFeature(this.canvasList[0], 0, true);
      await this.$nextTick();
      this.$emit('finish');
    },
    async worksheetDetail (worksheetId) {
      let param = {
        project_id: this.projectId,
        worksheet_id: worksheetId
      };
      let res = await get('canvasDetail', param);
      sessionStorage.setItem(worksheetId, JSON.stringify(res));
      return res;
    },
    async reviseCanvasFeature (detail, index, flag) {
      if (!detail.worksheet_id) {
        if (index + 1 < this.canvasList.length) {
          return this.reviseCanvasFeature(
            this.canvasList[index + 1],
            index + 1,
            true
          );
        }
        return;
      }
      let param = {
        project_id: this.projectId,
        worksheet_id: detail.worksheet_id,
        dashboard_id: this.dashboardId,
        features: detail.features,
        offset: 0,
        limit: 9999
      };
      if (
        this.storyObj &&
        this.storyObj.story_id &&
        this.storyObj.story_value &&
        this.story
      ) {
        param.story_id = this.storyObj.story_id;
        param.story_value = this.storyObj.story_value;
      }
      if (this.storyObj) {
        if (this.storyObj.story_id === '' && this.storyObj.story_value === '') {
          delete param.dashboard_id;
        }
      }
      let chartType = this.worksheetTypes[detail.worksheet_type];
      if (detail.css.data_setting) {
        let dataSetting = JSON.parse(JSON.stringify(detail.css.data_setting));
        let selected = dataSetting.filter(d => d.selected)[0];
        if (selected) {
          let content = selected.values ? selected.values : selected.content;
          if (chartType === 'table') {
            param.nrows = content[1].val;
            param.ncols = content[0].val;
          } else if (chartType === 'pie') {
            param.n = content[0].val;
          }
        }
      }
      const cacheKey = JSON.stringify(param);
      let res = sessionStorage.getItem(cacheKey);
      if (res) {
        res = JSON.parse(res);
      } else {
        res = await post('reviseCanvasFeature', param);
        sessionStorage.setItem(cacheKey, JSON.stringify(res));
      }
      this.$set(this.dataList, index, res);
      if (flag) {
        if (index + 1 < this.canvasList.length) {
          return this.reviseCanvasFeature(
            this.canvasList[index + 1],
            index + 1,
            true
          );
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.print-body {
  position: relative;
  z-index: 1;
}
</style>
