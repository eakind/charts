<template>
  <input
    class="chart-title"
    type="text"
    v-model="chartName"
    @blur="blurHandler"
  />
</template>

<script>
import { post } from '@/api/server';
import { mapState } from 'vuex';
export default {
  props: {
    chartTitle: String
  },
  computed: {
    ...mapState('project', ['projectId']),
    ...mapState('drawingboard', ['currentCanvas', 'canvasList'])
  },
  watch: {
    chartTitle: {
      handler (val) {
        this.chartName = val;
      },
      immediate: true
    }
  },
  methods: {
    blurHandler () {
      if (this.chartName === this.chartTitle) return;
      let len = this.getByteLen(this.chartName);
      if (this.chartName && len > 64) {
        this.$message({
          message: this.$t('dashboard.canvas_title_tip'),
          type: 'warning'
        });
        return;
      }
      this.reviseTitle();
    },
    async reviseTitle () {
      let param = {
        project_id: this.projectId,
        worksheet_id: this.currentCanvas.worksheet_id,
        worksheet_title: this.chartName,
        worksheet_title_css: {}
      };
      let res = await post('reviseTitle', param);
      if (!res) return;
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
.chart-title {
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
