<template>
  <div class="preview-data">
    <div class="preview-header">数据表预览导出
      <div class="back-btn" @click="closeHandler" v-if="routeName === 'dashboard'">返回展板</div>
      <div class="back-btn" @click="closeHandler" v-else>返回画布</div>
    </div>
    <div class="mg-bg"></div>
    <div class="preview-content">
      <div class="content-header flex">
        <div class="content-title" v-if="routeName === 'dashboard'">
          <span class="title">选择画布</span>
          <dc-el-select :list="canvasList" v-model="selectCanvas" @on-change="changeWorksheet"></dc-el-select>
        </div>
        <div class="content-title-box"></div>
        <button class="export-btn"
                @click.stop="exportHandler">下载</button>
      </div>
      <div class="content-body">
        <div class="content-operate ">
          <div class="data-limit">
            {{$t('message.show_pre')}}
            <input v-model="limit" />
            {{$t('message.line_data')}}
          </div>
          <div class="data-btn bottom-line">
            <button class="origin-btn" @click="isAgg=0" :class="isAgg===0 ? 'btn-active' : ''">{{$t('message.origin_data')}}</button>
            <button class="canvas-btn" @click="isAgg=1" :class="isAgg===1 ? 'btn-active':''">{{$t('message.canvas_data')}}</button>
          </div>
        </div>
        <div class="data-previe-con">
          <div class="tab-bg" v-if="dataList.length  > 1">
            <div class="tab-item"
                :class="selectTab===index?'tab-active':''"
                v-for="(item, index) in dataList"
                :key="index"
                @click="selectTabHandler(item, index)">data_{{index+1}}</div>
          </div>
          <pre-table class="pre-table"
            :style="tableHeight"
            :wFlag="true"
            :headList="preData.columns"
            :checkFlag="false"
            :noModify="true"
            :previewList="preData.data"></pre-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DcElSelect from '@/components/dcelselect/dcelselect.vue';
import PreTable from '@/components/preTable/preTable';
import { get, downloadData } from '@/api/server';
import { mapState } from 'vuex';
export default {
  name: 'PreviewData',
  data () {
    return {
      offset: 0,
      limit: 100,
      isAgg: 0,
      showTabFlag: true,
      selectTab: 0,
      dataList: [],
      preData: [],
      timer: null,
      selectCanvas: null,
      routeName: this.$route.name,
      tip: {},
      canvasList: []
    };
  },
  components: {
    PreTable,
    DcElSelect
  },
  computed: {
    ...mapState('project', ['projectId']),
    ...mapState('drawingboard', ['worksheetId', 'currentCanvas']),
    ...mapState('dashboard', ['hasCanvasList', 'workSheetList']),
    tableHeight () {
      return this.dataList.length > 1
        ? { height: 'calc(100% - 70px)' }
        : { height: 'calc(100% - 40px)' };
    }
  },
  watch: {
    limit () {
      this.getData();
    },
    isAgg () {
      this.getData();
    },
  },
  mounted () {
    this.canvasList = [];
    for (let i in this.workSheetList) {
      if (this.workSheetList[i].active) {
        this.canvasList.push(this.workSheetList[i]);
      }
    }
    for (let j in this.canvasList) {
      this.canvasList[j].value = this.canvasList[j].worksheet_id;
      this.canvasList[j].label = this.canvasList[j].worksheet_title;
    }
    if (this.routeName === 'dashboard') {
      for (let i = 0; i < this.canvasList.length; i++) {
        if (this.canvasList[i]) {
          this.tip = this.canvasList[i];
          break;
        }
      }
      if (this.canvasList.length > 0) {
        this.selectCanvas = this.tip.worksheet_id;
      }
    } else {
      this.selectCanvas = this.currentCanvas.worksheet_id;
    }
    this.worksheetView();
  },
  methods: {
    changeWorksheet (val) {
      this.selectCanvas = val;
      this.getData();
    },
    exportHandler () {
      let worksheetId = this.currentCanvas.worksheet_id;
      if (this.routeName === 'dashboard') {
        worksheetId = this.selectCanvas;
      }
      let param = {
        project_id: this.projectId,
        worksheet_id: worksheetId,
        is_agg: this.selectOrigin ? 1 : this.isAgg,
        offset: 0,
        limit: 9999999999
      };
      downloadData('canvasData', param);
    },
    closeHandler () {
      this.$emit('closePreview');
    },
    selectTabHandler (item, index) {
      this.selectTab = index;
      this.preData = this.dataList[index];
    },
    getData () {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.worksheetView();
      }, 500);
    },
    async worksheetView () {
      let param = {
        project_id: this.projectId,
        worksheet_id: this.selectCanvas,
        is_agg: this.isAgg, // 0查看应用过滤器后的原始数据， 1查看画布聚合后的数据
        offset: this.offset,
        limit: this.limit
      };
      let res = await get('worksheetView', param);
      if (!res) return;
      this.dataList = res.data_list;
      if (this.dataList.length > 0) {
        this.preData = this.dataList[0];
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.flex {
  display: flex;
  justify-content: space-between;
}
.preview-data {
  position: fixed;
  z-index: 1000;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  background: #424242;
  .preview-header {
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: #fff;
    color: #424242;
    font-size: 16px;
    text-align: center;
    position: relative;
    font-weight: bold;
    .back-btn {
      position: absolute;
      top: 8px;
      right: 64px;
      width: 80px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      background: #666666;
      border-radius: 4px;
      cursor: pointer;
    }
  }
  .mg-bg {
    height: 8px;
    width: 100%;
    background: #FBFCFF;
  }
  .preview-content {
    padding: 0px 64px;
    height: 100%;
    background: #555555;
    .content-header {
      text-align: center;
      padding: 10px 0;
      position: relative;
      .content-title {
        font-size: 16px;
        color: #fff;
        display: flex;
        align-items: center;
        width: 50%;
        .title {
          margin-right: 16px;
        }
      }
      .content-title-box {
        width: 50%;
      }
      .content-closebtn {
        color: #ffffff;
        right: 10px;
        cursor: pointer;
        .iconfont {
          transform: rotate(45deg);
          display: inline-block;
          color: #ffffff;
        }
      }
    }
    .content-operate {
      position: relative;
      .bottom-line {
        border-bottom: 1px solid #424242;
      }
      .data-btn {
        color: #a4a4a4;
        > button {
          width: 160px;
          height: 40px;
          font-size: 14px;
          line-height: 36px;
          outline: none;
          cursor: pointer;
          border: none;
          background: #f2f2f2;
          color: #a4a4a4;
          position: relative;
        }
        .origin-btn {
          border-top-left-radius: 4px;
        }
        .canvas-btn {
          border-top-right-radius: 4px;
        }
        .btn-active {
          background-color: #fff;
          color: #424242;
          &::after {
            content: "";
            display: inline-block;
            width: 40px;
            height: 5px;
            background: #4284F5;
            border-radius: 5px;
            position: absolute;
            top: 35px;
            left: 60px;
          }
        }
      }
    }
    .data-limit {
      color: #424242;
      font-size: 14px;
      float: right;
      padding: 4px 24px;
      input {
        background: #ffffff;
        border: 1px solid #dedede;
        text-align: center;
        border-radius: 4px;
        width: 64px;
        height: 28px;
        line-height: 28px;
        margin: 0 8px;
      }
    }
    .export-btn {
      width: 80px;
      height: 24px;
      line-height: 24px;
      background: #4284f5;
      border: none;
      border-radius: 4px;
      color: white;
      cursor: pointer;
      outline: none;
      background-color: #4285f4;
      font-size: 14px;
    }
    .content-body {
      background-color: white;
      width: 100%;
      height: calc(100% - 52px);
      border-radius: 4px;
      .export-bg {
        height: 50px;
        width: 100%;
        border-bottom: 1px solid #a4a4a4;
        position: relative;

        .data-limit {
          right: 10px;
          top: 50%;
          font-size: 14px;
          transform: translateY(-50%);
          position: absolute;
          > input {
            width: 50px;
            height: 20px;
            text-align: center;
            outline: none;
            border-radius: 4px;
          }
        }
      }
      .select-canvas-bg {
        height: 50px;
        width: 200px;
        line-height: 50px;
        padding: 0px 20px;
        position: relative;
        display: inline-block;
        .select-canvas {
          left: 90px;
          top: 10px;
          position: absolute;
        }
      }
      .tab-bg {
        height: 40px;
        display: flex;
        line-height: 28px;
        border-bottom: 1px solid #E1E1E1;
        .tab-item {
          width: 150px;
          box-sizing: border-box;
          text-align: center;
          position: relative;
          margin: 6px 0;
          font-size: 16px;
          color: #A4A4A4;
          border-right: 1px solid #E1E1E1;
          cursor: pointer;
          &:hover {
            color: #4284F5;
          }
          &:nth-child(1) {
            width: 80px;
          }
        }
        .tab-active {
          color: #4284F5;
        }
      }
      .pre-table {
        height: calc(100% - 70px);
        background-color: #fff;
        border: none;
      }
      .data-previe-con {
        background-color: #ffffff;
        height: calc(100% - 40px);
      }
    }
  }
}
</style>
<style lang="scss">
.content-title {
  .el-select {
    height: 32px;
    line-height: 32px;
    width: 240px;
    .el-input__inner {
      height: 32px;
      line-height: 32px;
    }
  }
}
</style>
