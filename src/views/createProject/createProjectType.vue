<template>
  <div class="dc-create-project-type">
    <div class="content-section">
      <div class = "back-box">
        <span class="back-btn" @click="backHandler">{{$t('message.return_back')}}</span>
      </div>
      <div class="upload-content-header project-content">
        <span class="header-title">{{$t('message.project_name')}}</span>
        <span class="body-title-name">{{projectName}}</span>
      </div>
      <div class="section-header-body" v-if="selectUpload !== 2">
        <span class="body-has-file">{{$t('message.added_file')}}</span>
        <div class="file-list">
          <div class="list-item" :title="item.fileName" v-for="(item, index) in successFileList" :key="index">{{item.fileName}}</div>
        </div>
      </div>
      <div class="section-header-body" v-else>
        <span class="header-body-txt">{{$t('message.db_type')}}</span>
        <span class="body-data">{{dbObj.dialect}}</span>
        <span class="header-body-txt">{{$t('message.db_name')}}</span>
        <span class="body-data">{{dbObj.database}}</span>
        <span class="header-body-txt">{{$t('message.db_server')}}</span>
        <span  class="body-data">{{dbObj.host}}</span>
        <span class="header-body-txt">{{$t('message.db_port')}}</span>
        <span  class="body-data">{{dbObj.port}}</span>
        <span class="header-body-txt">{{$t('message.db_username')}}</span>
        <span  class="body-data">{{dbObj.user}}</span>
      </div>
    </div>
    <div class="dc-create">
      <div class="dc-create-header">
        <div class="project-create-name">
            <span class="body-create-title">{{modeType ? $t('message.into_canvas') : $t('message.add_canvas')}}</span>
            <div class="body-create-next" @click="createChartHandler">{{$t('message.start_edit')}}</div>
        </div>
        <div class="project-create-message">
            <p class="body-create-message">{{$t('message.select_chart_type')}}</p>
        </div>
      </div>
      <div class="create-body">
        <div class="chart-list-bg">
          <span class="chart-title">{{$t('message.canvas_type')}}</span>
          <div class="chart-body-list">
            <div
              class="body-list-item"
              :class="selectChartId === id ? 'canvasSelected' : ''"
              @click="selectChart(id)"
              v-for="id in worksheetTypesList"
              :key="id"
            >
              <span
                class="iconfont"
                :class="newWorksheetTypesIconMap[id]"
              ></span>
              <span
                class="item-name"
                :class="selectChartId === id ? 'item-name-active' : ''"
              >{{worksheetTypesNameMap(id)}}</span>
            </div>
          </div>
        </div>
        <div class="create-message">
            <p class="body-create-message">{{$t('message.canvas_background')}}</p>
        </div>
        <div class="chart-body-bg">
          <span class="chart-title">{{$t('message.background')}}</span>
          <dc-color-list @change="changeBgHandler" :start="0" :index="0"></dc-color-list>
        </div>
      </div>
    </div>
    <dc-alert class="save_project" v-if="showReturnAlert">
        <div class="dc-alert-header">
            <span>{{$t('message.back_list')}}</span>
            <span class="iconfont icon-db_plus" @click="closeAlert"></span>
        </div>
        <div class="dc-alert-message">
            <p>{{backListTip.keep_content}}</p>
        </div>
        <div class="dc-alert-footer">
            <div class="dc-save-confirm" @click="saveProject">{{backListTip.save_and_return}}</div>
            <div class="dc-save-cancel" @click="returnProject">{{$t('message.only_return')}}</div>
        </div>
    </dc-alert>

    <loading v-if="showLoading"></loading>
  </div>
</template>

<script>
import { post } from '@/api/server';
import { mapState, mapGetters, mapMutations } from 'vuex';
import DcColorList from '@/components/dccolorlist/dcColorList.vue';
import DcAlert from '@/components/dcalert/dcAlert';
import Loading from '@/components/loading/loading';
export default {
  components: { DcColorList, DcAlert, Loading },
  data () {
    return {
      showChart: false,
      clickFlag: false,
      selectColorIndex: 0,
      selectChartId: '02',
      showReturnAlert: false,
      showLoading: false
    };
  },
  computed: {
    ...mapState('project', [
      'isPreview',
      'createChart',
      'projectId',
      'createType',
      'projectStatus',
      'worksheetTypesList',
      'worksheetTypes',
      'worksheetTypesIconMap',
      'newWorksheetTypesIconMap',
      'worksheetTypesIconActiveMap',
      'successFileList',
      'projectName'
    ]),
    ...mapState('colors', ['colorTemp']),
    ...mapGetters('project', ['worksheetTypesNameMap']),
    ...mapState('drawingboard', ['canvasList', 'canvasNum']),
    modeType () {
      if (this.createType === 'template') {
        return true;
      }
      return false;
    },
    backListTip () {
      if (this.projectStatus === 'REPLACE' || this.projectStatus === 'APPEND') {
        return {
          keep_content: this.$t('message.keep_modify'),
          save_and_return: this.$t('message.save_data_return')
        };
      } else {
        return {
          keep_content: this.$t('message.keep_content'),
          save_and_return: this.$t('message.save_and_return')
        };
      }
    }
  },
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
  },
  mounted () {
    this.setIsPreview(false);
  },
  destroyed () {
  },
  methods: {
    ...mapMutations('project', ['setCreateChart', 'setIsPreview']),
    ...mapMutations('drawingboard', ['setCanvasType', 'setCanvasNum', 'setCurrentCanvas', 'setCanvasList', 'setColorCapsuleList']),
    ...mapMutations('drawingboard', ['setCurrentCanvasDetail', 'setColumnList', 'setRowList', 'setLabelsCapsuleList', 'setSizeCapsuleList']),
    changeBgHandler (index) {
      this.selectColorIndex = index;
    },
    createHandler () {
      if (!this.isPreview) return;
      this.setCreateChart(!this.createChart);
    },
    selectChart (id) {
      this.selectChartId = id;
    },
    createChartHandler () {
      this.showLoading = true;
      this.completeModify();
    },
    async completeModify () {
      let param = {
        project_id: this.projectId
      };
      let res = await post('completeModify', param);
      if (res.code === 0) {
        this.createCanvas();
      }
    },
    setTitleCss () {
      return {
        color: this.colorTemp[this.selectColorIndex].color
      };
    },
    setCss () {
      return {
        color: this.colorTemp[this.selectColorIndex].color,
        opacity: 100,
        background: this.colorTemp[this.selectColorIndex].background,
        index: this.selectColorIndex
      };
    },
    async createCanvas () {
      let param = {
        project_id: this.projectId,
        worksheet_type: this.selectChartId,
        css: {
          bgCss: this.setCss(),
          titleCss: this.setTitleCss()
        }
      };
      if (this.clickFlag) return;
      this.clickFlag = true;
      let res = await post('createCanvas', param);
      this.clickFlag = false;
      if (!res) return;
      this.setCanvasType(this.worksheetTypes[param.worksheet_type]);
      localStorage.chartType = this.selectChartId;
      setTimeout(() => {
        this.showLoading = false;
      }, 30);
      this.setCanvasNum(++this.canvasNum);
      let obj = {
        worksheet_id: res.worksheet_id,
        worksheet_idx: res.worksheet_idx,
        worksheet_name: res.worksheet_name,
        worksheet_title: res.worksheet_title,
        worksheet_type: param.worksheet_type
      };
      this.canvasList.push(obj);
      this.setCanvasList(this.canvasList);
      this.setCurrentCanvasDetail({});
      this.setColumnList([]);
      this.setRowList([]);
      this.setLabelsCapsuleList([]);
      this.setColorCapsuleList([]);
      this.setSizeCapsuleList([]);
      this.setCurrentCanvas(obj);
      this.$router.push({ path: '/drawingboard' });
    },
    backHandler () {
      this.$router.push({ path: '/' });
      // this.showReturnAlert = true;
    },
    saveProject () {
      this.$router.push({ path: '/' });
    },
    async returnProject () {
      if (this.projectStatus === 'REPLACE' || this.projectStatus === 'APPEND') {
        let param = {
          project_id: this.projectId
        };
        if (!this.projectId) return;
        let res = await post('exitProject', param);
        if (res.code === 0) {
          this.$router.push({ path: '/' });
        }
      } else {
        let param = {
          project_id: this.projectId
        };
        let res = await post('delProject', param);
        if (res.code === 0) {
          this.$router.push({ path: '/' });
        }
      }
    },
    closeAlert () {
      this.showReturnAlert = false;
    }
  }
};
</script>

<style scoped lang="scss">

.dc-create-project-type {
  width: 100%;
  margin: 8px;
  display: flex;
  flex: 1;
  background: #FFFFFF;
  .content-section{
    width: 260px;
    height: 100%;
    background: #FBFCFF;
    padding: 9px 19px;
    box-sizing: border-box;
    .back-btn{
      font-size: 16px;
      color: #424242;
      display: block;
      width: 280px;
      cursor: pointer;
      box-sizing: border-box;
      &::before{
        content: '';
        height: 10px;
        width: 10px;
        border-top: 2px solid #4284F5;
        border-left: 2px solid #4284F5;
        transform: rotate(-45deg);
        display: inline-block;
      }
    }
    .section-header-body{
      .header-body-title{
        font-size: 12px;
        color: #424242;
        display: block;
      }
      .header-body-txt{
        font-size: 12px;
        color: #a4a4a4;
        font-weight: 100;
        display: block;
      }
      .body-data{
        color: #424242;
        font-size: 16px;
        padding: 5px 0px;
        min-height: 10px;
        display: block;
      }
      .body-has-file{
        font-size: 12px;
        color: #424242;
        display: block;
        padding: 0px 0px 6px;
      }
      .file-list{
        .list-item{
          color: #424242;
          font-size: 16px;
          padding: 2px 0px;
          @include ellipsis;
        }
      }
    }
  }
  .upload-content-header{
    font-size: 12px;
    color: #424242;
    margin-top: 25px;
    margin-bottom: 30px;
    .body-title-name{
      padding: 5px 0px;
      font-size: 20px;
      display: block;
      color: #424242;
    }
  }
  .dc-create {
    width: 100%;
    .dc-create-header{
      padding: 20px 15px 0px;
      font-size: 16px;
      position: relative;
      cursor: pointer;
      .project-create-name {
        width: calc(100% - 40px);
        height: 40px;
        position: relative;
        box-sizing: content-box;
        background: #E7EBF2;
        border-radius: 4px;
        font-size: 16px;
        color: #424242;
        line-height: 40px;
        padding-left: 8px;
        .body-create-next {
          position: absolute;
          top: 0;
          right: 0;
          width: 120px;
          height: 40px;
          background: #4284F5;
          border-radius: 4px;
          font-size: 16px;
          color: #FFFFFF;
          text-align: center;
          cursor: pointer;
        }
      }
      .project-create-message {
        .body-create-message {
          font-size: 12px;
          color: #A4A4A4;
          line-height: 24px;
          margin: 8px 0;
        }
      }
    }
    .create-body {
      width: 100%;
      padding: 0px 0px 0px 15px;
      box-sizing: border-box;
      height: calc(100% - 50px);
      overflow: hidden;
      .chart-list-bg {
        width: 930px;
        border: 1px solid #DEDEDE;
        padding: 10px;
        border-radius: 4px;
        box-sizing: border-box;
        .chart-title {
          font-size: 14px;
          color: #424242;
        }
        .chart-body-list {
          display: flex;
          flex-wrap: wrap;
          margin: 16px 0 0px;
          .body-list-item {
            width: 144px;
            height: 40px;
            line-height: 40px;
            margin: 6px 20px;
            position: relative;
            font-size: 16px;
            color: #424242;
            border-radius: 4px;
            padding-left: 10px;
            box-sizing: border-box;
            .item-name {
              font-size: 14px;
              color: #424242;
              text-align: center;
            }
            .iconfont {
              margin-right: 8px;
              font-size: 16px;
              color: #A4A4A4;
            }
            .item-icon {
              width: 100px;
              height: 100px;
              margin: 5px;
              background-size: 100%;
              display: inline-block;
            }
            &:hover {
              .item-name {
                color: #4284f5;
              }
            }
            &:nth-child(5n+1) {
              margin-left: 0px;
            }
          }
          .canvasSelected {
            border: 1px solid #4284F5;
            .item-name {
              color: #4284F5;
              font-size: 16px;
            }
            .iconfont {
              color: #FACC14;;
            }
          }
        }
      }
      .create-message {
        .body-create-message {
          font-size: 12px;
          color: #A4A4A4;
          line-height: 24px;
          margin: 8px 0;
        }
      }
      .chart-body-bg {
        width: 930px;
        // height: 224px;
        border: 1px solid #DEDEDE;
        padding: 10px;
        padding-bottom: 11px;
        border-radius: 4px;
        box-sizing: border-box;
        .chart-title {
          color: #424242;
          font-size: 14px;
          display: block;
        }
      }
        @media screen and (min-width:1360px) {
           .chart-body-bg {
         .dc-color-list {
          margin-top:22px;
        }}
      }
      @media screen and (max-width:1360px) {
         .chart-body-bg {
         .dc-color-list {
          margin-top:12px;
        }}
        .chart-list-bg{
          height:160px;
        }
      }

    }
  }
  .save_project {
    padding: 20px;
    .dc-alert-header {
      text-align: left;
      padding: 0;
      opacity: 0.7;
      .icon-db_plus {
        color: #A4A4A4;
        cursor: pointer;
        position: absolute;
        right: 18px;
        transform: rotate(45deg);
        display: inline-block;
      }
    }
    .dc-alert-message {
      width: 360px;
      height: 86px;
      margin: 10px 0;
      background: #e2e2e2;
      border-radius: 4px;
      padding: 16px 19px;
      box-sizing: border-box;
      word-break: break-all;
      color: #68686e;
      p {
        margin: 0;
      }
    }
    .dc-alert-footer {
      display: flex;
      justify-content: space-around;
      div {
        font-size: 16px;
        cursor: pointer;
      }
      .dc-save-confirm {
        color: #4284F5;
      }
      .dc-save-cancel{
        color: #A4A4A4;
      }
    }
  }
}

</style>
