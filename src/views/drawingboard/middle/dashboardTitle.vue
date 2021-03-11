<template>
  <input
    class="dashboard_title"
    type="text"
    :style="titleCss"
    v-model="chartName"
    @keyup="changeTitle = true"
    @blur="reviseTitle"
  />
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { post } from '@/api/server';
export default {
  props: {
    title: String,
    canvasCss: Object,
  },
  data () {
    return {
      chartName: this.title || '',
      changeTitle: false
    };
  },
  computed: {
    ...mapState('project', ['projectId']),
    ...mapState('drawingboard', ['currentCanvas', 'canvasList', 'fontColor']),
    titleCss () {
      if (this.canvasCss.titleCss) {
        return {
          color: this.canvasCss.titleCss.color,
          opacity: this.canvasCss.titleCss.opacity / 100,
          fontSize: '20px' // this.canvasCss.titleCss.fontSize
        };
      } else {
        return {
          color: this.fontColor,
          opacity: 1,
          fontSize: '20px'
        };
      }
    },
  },
  watch: {
    title (val) {
      this.chartName = val || '';
    },
  },
  methods: {
    ...mapMutations('drawingboard', [
      'setCanvasList',
      'setCurrentCanvas'
    ]),
    async reviseTitle () {
      let param = {
        project_id: this.projectId,
        worksheet_id: this.currentCanvas.worksheet_id,
        worksheet_title: this.chartName,
        worksheet_title_css: {}
      };
      let titleLength = this.getByteLen(this.chartName);
      if (this.chartName && titleLength > 64) {
        this.$message({
          message: this.$t('dashboard.canvas_title_tip'),
          type: 'warning'
        });
        return;
      }
      if (!this.changeTitle) return;
      let res = await post('reviseTitle', param);
      if (!res) return;
      this.changeTitle = false;
      let list = this.canvasList;
      for (let i = 0; i < list.length; i++) {
        if (list[i].worksheet_id === this.currentCanvas.worksheet_id) {
          this.$set(list[i], 'worksheet_title', this.chartName);
        }
      }
    },
    getByteLen (val) {
      if (val) {
        var len = 0;
        for (var i = 0; i < val.length; i++) {
          var a = val.charAt(i);
          // eslint-disable-next-line no-control-regex
          if (a.match(/[^\x00-\xff]/gi) != null) {
            len += 2;
          } else {
            len += 1;
          }
        }
        return len;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard_title {
  position: relative;
  padding: 0px 10px;
  width: 100%;
  border: none;
  height: 50px;
  color: #424242;
  font-size: 20px;
  outline: none;
  background: transparent;
}
</style>
