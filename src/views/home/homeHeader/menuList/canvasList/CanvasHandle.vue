<template>
  <div class="canvas-handle" >
    <span class="export-icon" :class="btnDisabled?'disabled':''" @click="exportHandler" @mouseover="mouseProcess">
      <span class="iconfont icon-db_export" :class="btnDisabled?'disabled':''"></span>
      <div class="export-txt" :class="btnDisabled?'disabled':''">预览导出</div>
    </span>
    <export-file v-if="isExport" @hide="hideHandler" v-click-out="hideHandler" ></export-file>
  </div>
</template>
<script>
import ExportFile from '../handle/ExportFile.vue';
import { mapMutations, mapState } from 'vuex';
export default {
  data () {
    return {
      isExport: false,
      btnDisabled: false
    };
  },
  components: {
    ExportFile
  },
  computed: {
    ...mapState('project', ['exportPare']),
    ...mapState('drawingboard', ['canvasType']),
  },
  watch: {
    canvasType (val) {
      let key = this.exportPare[this.canvasType];
      if (!sessionStorage.getItem(key)) {
        this.btnDisabled = true;
      } else {
        this.btnDisabled = false;
      }
    }
  },
  mounted () {
  },
  methods: {
    ...mapMutations('project', ['setIsExport']),
    ...mapMutations(['setIsCreateCanvas']),
    addHandler () {
      this.setIsCreateCanvas(true);
    },
    exportHandler () {
      if (this.btnDisabled) {
        return;
      }
      this.isExport = !this.isExport;
    },
    hideHandler () {
      this.isExport = false;
    },
    mouseProcess () {
      let key = this.exportPare[this.canvasType];
      if (!sessionStorage.getItem(key)) {
        this.btnDisabled = true;
      } else {
        this.btnDisabled = false;
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.canvas-handle{
  text-align: center;
  color: #666666;
  cursor: pointer;
  width: 80px !important;
  display: flex;
  position: relative;
  .add-icon {
    width: 80px;
    text-align: center;
    cursor: pointer;
    .icon-db_plus{
      font-size: 14px;
      width: 16px;
      height: 16px;
      line-height: 16px;
      border-radius: 2px;
      color:#424242;
      display: inline-block;
      text-align: center;
    }
    .add-txt{
      color: #666666;
      font-size: 14px;
      display: block;
      font-weight: 300;
      font-family: "siyuanheiti",
    }
  }
  .export-icon{
    width: 80px;
    display: inline-block;
    .iconfont{
      color: #424242;
      font-size: 12px;
      font-weight: bold;
      display: inline-block;
      margin-bottom: 5px;
    }
    .export-txt{
      color: #A4A4A4;
      font-size: 12px;
      font-weight: 300;
    }
    .disabled{
      cursor: default;
      color: #ccc !important;
    }
  }
}
</style>
