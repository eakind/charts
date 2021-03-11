<template>
  <div class="model-view">
    <div class="head">
      <div
        class="tab"
        :class="{'tab-selected': current === tab.name}"
        v-for="(tab, index) in tabs"
        :key="index"
        @click="current = tab.name"
      >
        {{tab.name}}
        <span class="divide" v-if="index < tabs.length-1"></span>
      </div>
      <span class="iconfont icon-db_plus" @click="close"></span>
    </div>
    <div class="main" ref="chartBg">
      <div v-if="status === 'success'" class="success">
        <div class="operate">
          <div class="name">
            {{$t('dashboard.model_config')}}
            <span class="feature-logo" @click="showFeature=!showFeature">
              {{$t('dashboard.feature')}}:
              <span class="iconfont icon-db_log"></span>
            </span>
            <span class="target-name">
              Target:
              <span>{{targetFeatureName}}</span>
            </span>
          </div>
          <div class="save">
            <div class="export-data" @click="exportData">
              <span class="iconfont icon-db_export"></span>
              <span>{{$t('dashboard.export')}}</span>
            </div>
            <div class="save-chart" @click="saveChart">
              <span class="iconfont icon-db_picbase"></span>
              <span>{{$t('dashboard.save')}}</span>
              <div class="popup" v-show="show_popup">
                <base-popup v-bind="popup" @select="popupSelect"></base-popup>
              </div>
            </div>
          </div>
        </div>
        <div class="chart">
          <div class="chart-statistics" v-if="showStat">{{rocObj.name}} = {{rocObj.value}}</div>
          <div class="chart-legends" v-if="showLegends">
            <!-- <div class="select">
              <model-select @change="changeGroup" :list="groupList"></model-select>
            </div> -->
            <div class="legend-1">
              <div class="actual">
                <div class="inner"></div>
              </div>
              <span>{{$t('dashboard.actual')}}</span>
            </div>
            <div class="legend-2">
              <div class="predict">
                <div class="inner"></div>
              </div>
              <span>{{$t('dashboard.predict')}}</span>
            </div>
          </div>
          <div class="model-chart" ref="model-chart"></div>
          <div class="model-feature-panel" v-show="showFeature">
            <span class="iconfont icon-db_plus" @click="showFeature=!showFeature"></span>
            <div class="panel-item">
              <div class="header-cat">{{$t('dashboard.cat_var')}}</div>
              <div class="body">
                <div v-for="(item, index) in targetCatFeature" :key="index">{{item.feature_name}}</div>
              </div>
            </div>
            <div class="panel-item">
              <div class="header-num">{{$t('dashboard.num_var')}}</div>
              <div class="body">
                <div v-for="(item, index) in targetNumFeature" :key="index">{{item.feature_name}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="not-success">
        <component :is="currentStatus"></component>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import ModelSelect from './modelSelect';
import ViewLoading from './viewLoading';
import ViewError from './viewError';
import { get } from '@/api/server';
// import { apiAddr2 } from '@/config';
// import { url } from '@/api/url';
export default {
  components: {
    ModelSelect,
    ViewLoading,
    ViewError
  },
  props: {
    modelName: {
      type: String,
      default: '' // 模型名称
    },
    config_roc: {
      type: Object,
      default: function () {
        return {};
      }
    },
    config_accuracy: {
      type: Object,
      default: function () {
        return {};
      }
    },
    config_importance: {
      type: Object,
      default: function () {
        return {};
      }
    },
    rocStat: {
      type: Object,
      default: function () {
        return {
          name: 'AUC',
          value: 0
        };
      }
    }
  },
  data () {
    return {
      tabs: [
        {
          name: '影响重要性'
        },
        {
          name: '准确度'
        },
        {
          name: 'ROC'
        }
      ],
      current: '',
      show_popup: false,
      popup: {
        list: [
          { name: 'PNG', id: 0 },
          { name: 'JPEG', id: 1 }
        ],
        borderColor: '#e1e1e1',
        height: 45
      },
      status: '',
      currentData: null,
      currentList: [],
      rocObj: {
        name: '',
        value: ''
      },
      giniObj: {
        name: '',
        value: ''
      },
      groupNum: 6,
      showFeature: false,
      targetFeatureName: '',
      targetCatFeature: [],
      targetNumFeature: [],
      groupList: []
    };
  },
  methods: {
    ...mapMutations('drawingboard', ['setModelResultShow', 'setModelStatus', 'setModelTime']),
    close () {
      this.setModelResultShow(false);
    },
    exportData () {
      // this.$emit("exportData");
      // let downloadUrl = apiAddr2;
      // switch (this.current) {
      //   case '影响重要性':
      //     downloadUrl +=
      //       url.importanceDownload + '?project_id=' + this.projectId;
      //     break;
      //   case '准确度':
      //     downloadUrl +=
      //       url.liftChartDownload + '?project_id=' + this.projectId;
      //     break;
      //   case 'ROC':
      //     downloadUrl += url.rocDownload + '?project_id=' + this.projectId;
      //     break;
      //   case 'GINI':
      //     downloadUrl += url.giniDownload + '?project_id=' + this.projectId;
      //     break;
      // }
      // let dcUserToken = localStorage.getItem('dcUserToken');
      // downloadUrl += '&token=' + dcUserToken;
      // window.open(downloadUrl);
    },
    saveChart () {
      this.show_popup = !this.show_popup;
    },
    popupSelect (id) {
      this.$emit(
        'saveChart',
        this.currentData.bindto,
        this.currentData.size,
        this.current,
        id === 0 ? 'transparent' : '#fff'
      );
    },
    changeGroup (item) {
      this.groupNum = item;
      let data = JSON.parse(JSON.stringify(this.currentList));
      let list = data.splice(1, data.length);
      let len = Math.floor(list.length / this.groupNum);
      let arr = [];
      for (let i = 0; i < this.groupNum; i++) {
        let obj = {};
        let value0 = 0;
        let value1 = 0;
        let value2 = 0;
        let zoom = 10000000000000000;
        for (let j = 0; j < len; j++) {
          value0 = i;
          value1 += list[i * len + j][1] * zoom;
          value2 += list[i * len + j][2] * zoom;
        }
        obj[this.currentList[0][0]] = value0;
        obj[this.currentList[0][1]] = (value1 / zoom / len).toFixed(2);
        obj[this.currentList[0][2]] = (value2 / zoom / len).toFixed(2);
        arr.push(obj);
      }
      this.$set(this.currentData, 'data', arr);
    },
    async getModelImportance () {
      let param = {
        project_id: this.projectId
      };
      let res = await get('modelImportance', param);
      if (res.code === 0) {
        if (res.data && res.data.length > 0) {
          let list = res.data;
          this.currentList = JSON.parse(JSON.stringify(res.data));
          let len = list.length;
          let arr = [];
          for (let i = 1; i < len; i++) {
            let obj = {};
            obj[list[0][0]] = list[i][0];
            obj[list[0][1]] = list[i][1];
            arr.push(obj);
          }
          this.$set(this.currentData, 'data', arr);
          this.$set(this.currentData.x, 'name', list[0][0]);
          this.$set(this.currentData.combined[0], 'name', list[0][1]);
          let dom = this.$refs.chartBg;
          this.$set(this.currentData.size, 'width', dom.clientWidth - 100);
          this.$set(this.currentData.size, 'height', dom.clientHeight - 140);
          let height = dom.clientHeight / list.length - 25;
          if (height > 50) height = 50;
          if (height < 20) height = 20;
          this.$set(this.currentData.combined[0].style, 'band', height);
        }
      } else {
        this.status = 'failed';
      }
    },
    async getModelLiftChart () {
      let param = {
        project_id: this.projectId
      };
      let res = await get('modelLiftChart', param);
      if (res.code === 0) {
        if (res.data && res.data.length > 0) {
          this.currentList = JSON.parse(JSON.stringify(res.data));
          this.groupList = [];
          if ((this.currentList.length - 1) < 15) {
            this.groupList = [this.currentList.length - 1];
          } else {
            for (let i of [15, 6, 4, 3]) {
              this.groupList.push(Math.floor((this.currentList.length - 1) / i));
            }
          }
          let list = res.data.splice(1, res.data.length);
          let len = Math.floor(list.length / this.groupNum);
          let arr = [];
          for (let i = 0; i < this.groupNum; i++) {
            let obj = {};
            let value0 = 0;
            let value1 = 0;
            let value2 = 0;
            let zoom = 10000000000000000;
            for (let j = 0; j < len; j++) {
              value0 = i;
              value1 += list[i * len + j][1] * zoom;
              value2 += list[i * len + j][2] * zoom;
            }
            obj[res.data[0][0]] = value0;
            obj[res.data[0][1]] = (value1 / zoom / len).toFixed(2);
            obj[res.data[0][2]] = (value2 / zoom / len).toFixed(2);
            arr.push(obj);
          }
          this.$set(this.currentData, 'data', arr);
          this.$set(this.currentData.x, 'name', res.data[0][0]);
          this.$set(this.currentData.combined[0], 'name', res.data[0][1]);
          this.$set(this.currentData.combined[1], 'name', res.data[0][2]);
          let dom = this.$refs.chartBg;
          this.$set(this.currentData.size, 'width', dom.clientWidth - 100);
          this.$set(this.currentData.size, 'height', dom.clientHeight - 160);
        }
      } else {
        this.status = 'failed';
      }
    },
    async getModelRoc () {
      let param = {
        project_id: this.projectId
      };
      let res = await get('modelRoc', param);
      if (res.code === 0) {
        if (res.data && res.data.length > 0) {
          let list = res.data;
          this.currentList = JSON.parse(JSON.stringify(res.data));
          let len = list.length;
          let arr = [];
          for (let i = 1; i < len; i++) {
            let obj = {};
            obj[list[0][1]] = list[i][1];
            obj[list[0][2]] = list[i][2];
            arr.push(obj);
          }
          this.$set(this.currentData, 'data', arr);
          this.$set(this.currentData.x, 'name', list[0][1]);
          this.$set(this.currentData.combined[0], 'name', list[0][2]);
          let dom = this.$refs.chartBg;
          this.$set(this.currentData.size, 'width', dom.clientWidth - 100);
          this.$set(this.currentData.size, 'height', dom.clientHeight - 150);
          this.$set(this.rocObj, 'name', 'AUC');
          this.$set(this.rocObj, 'value', res.auc);
        }
      } else {
        this.status = 'failed';
      }
    },
    async getModelGini () {
      let param = {
        project_id: this.projectId
      };
      let res = await get('modelGini', param);
      if (res.code === 0) {
        if (res.data && res.data.length > 0) {
          let list = res.data;
          this.currentList = JSON.parse(JSON.stringify(res.data));
          let len = list.length;
          let arr = [];
          for (let i = 1; i < len; i++) {
            let obj = {};
            obj[list[0][1]] = list[i][1];
            obj[list[0][2]] = list[i][2];
            arr.push(obj);
          }
          this.$set(this.currentData, 'data', arr);
          this.$set(this.currentData.x, 'name', list[0][1]);
          this.$set(this.currentData.combined[0], 'name', list[0][2]);
          let dom = this.$refs.chartBg;
          this.$set(this.currentData.size, 'width', dom.clientWidth - 100);
          this.$set(this.currentData.size, 'height', dom.clientHeight - 150);
          this.$set(this.rocObj, 'name', 'GINI');
          this.$set(this.rocObj, 'value', res.giniscore);
        }
      } else {
        this.status = 'failed';
      }
    },
    async getModelDetail () {
      let param = {
        project_id: this.projectId
      };
      let res = await get('modelDetail', param);
      if (res.code === 0) {
        this.setModelStatus(res.status);
        switch (res.status) {
          case 'MODELING':
            this.status = 'loading';
            break;
          case 'MODELED':
          case 'EXPIRED':
            this.status = 'success';
            break;
          case 'FAILED':
            this.status = 'failed';
            break;
        }
        if (res.target_data_type !== 'STRING') {
          let obj = {
            name: 'GINI'
          };
          this.tabs.splice(this.tabs.length - 1, 1, obj);
        } else {
          let obj = {
            name: 'ROC'
          };
          this.tabs.splice(this.tabs.length - 1, 1, obj);
        }
        this.targetDataType = res.target_data_type;
        this.current = '影响重要性';
        this.setModelTime(res.modeling_time);
      }
    },
    async getModelParameters () {
      let param = {
        project_id: this.projectId
      };
      let res = await get('modelParameters', param);
      if (res.code === 0) {
        this.targetFeatureName = res.target_feature_name;
        this.targetNumFeature = res.selected_aggr_feature_list;
        this.targetCatFeature = res.selected_cat_feature_list;
      }
    },
    setModelData () {
      switch (this.current) {
        case '影响重要性':
          this.currentData = JSON.parse(JSON.stringify(this.config_importance));
          this.getModelImportance();
          break;
        case '准确度':
          this.currentData = JSON.parse(JSON.stringify(this.config_accuracy));
          this.getModelLiftChart();
          break;
        case 'ROC':
          this.currentData = JSON.parse(JSON.stringify(this.config_roc));
          this.getModelRoc();
          break;
        case 'GINI':
          this.currentData = JSON.parse(JSON.stringify(this.config_roc));
          this.getModelGini();
          break;
      }
    }
  },
  computed: {
    ...mapState('project', ['projectId']),
    ...mapState('drawingboard', ['modelStatus']),
    currentStatus () {
      return this.status === 'loading' ? ViewLoading : ViewError;
    },
    showLegends () {
      return this.current === '准确度';
    },
    showStat () {
      return this.current === 'ROC' || this.current === 'GINI';
    }
  },
  watch: {
    currentData: {
      handler () {
        this.$nextTick(() => {
          let chart = this.$refs['model-chart'];
          if (!chart) return;
          chart.innerHTML = '';
          let div = document.createElement('div');
          div.id = this.currentData.bindto.slice(1);
          chart.appendChild(div);
          if (ai) {
            ai.generate(this.currentData);
          }
        });
      },
      deep: true
    },
    modelStatus (value) {
      switch (value) {
        case 'MODELING':
          this.status = 'loading';
          break;
        case 'MODELED':
        case 'EXPIRED':
          this.setModelData();
          this.status = 'success';
          break;
        case 'FAILED':
          this.status = 'failed';
          break;
      }
      if (value === 'MODELED') {
        this.getModelDetail();
        this.getModelParameters();
      }
    },
    current (val) {
      if (this.modelStatus === 'MODELED' || this.modelStatus === 'EXPIRED') {
        this.setModelData();
      }
    }
  },
  destroyed () {
    this.close();
  },
  mounted () {
    this.status = 'loading';
    this.getModelDetail();
    this.getModelParameters();
  }
};
</script>

<style lang="scss" scoped>
.model-view {
  width: 100%;
  height: 100%;
  background: #fff;
  color: #424242;
  font-size: 16px;
  border-radius: inherit;
  position: relative;
  .head {
    width: 100%;
    height: 58px;
    background: #f6f6f6;
    line-height: 58px;
    border-radius: inherit;
    display: flex;
    position: relative;
    .tab {
      width: 138px;
      text-align: center;
      color: #a4a4a4;
      font-weight: 500;
      cursor: pointer;
      position: relative;
      .divide {
        display: inline-block;
        width: 1px;
        height: 38px;
        background: #a4a4a4;
        position: absolute;
        right: 0;
        top: 10px;
      }
    }
    .tab-selected {
      color: #424242;
    }
    .icon-db_plus {
      transform: rotate(135deg);
      display: inline-block;
      cursor: pointer;
      position: absolute;
      right: 40px;
      font-size: 20px;
      color: #a4a4a4;
    }
  }
  .main {
    box-sizing: border-box;
    padding: 20px;
    width: 100%;
    height: calc(100% - 78px);
    > div {
      height: 100%;
    }
    .success {
      .operate {
        height: 40px;
        display: flex;
        position: relative;
        .name {
          width: 50%;
          .feature-logo {
            cursor: pointer;
            margin-left: 20px;
            .iconfont {
              color: #4284f5;
              font-size: 18px;
            }
          }
          .target-name {
            margin-left: 20px;
          }
        }
        .save {
          display: flex;
          position: absolute;
          right: 10px;
          > div {
            cursor: pointer;
          }
          .save-chart {
            margin-left: 50px;
          }
          .popup {
            margin-left: -20px;
          }
        }
      }
      .chart {
        border: 1px solid #dedede;
        width: 100%;
        height: calc(100% - 20px);
        box-sizing: border-box;
        padding: 20px;
        overflow: auto;
        position: relative;
        .chart-legends {
          display: flex;
          width: 100%;
          .select {
            flex: 1;
          }
          .legend-1 {
            color: #666666;
            margin-right: 20px;
            .actual {
              width: 80px;
              height: 4px;
              background: #666666;
              border-radius: 1.5px;
              top: -3px;
              position: relative;
              display: inline-block;
              .inner {
                background: inherit;
                border-radius: 50%;
                height: 10px;
                width: 10px;
                position: absolute;
                left: 25px;
                top: -3px;
              }
            }
          }
          .legend-2 {
            color: #f6b421;
            .predict {
              width: 60px;
              height: 4px;
              background: #f6b421;
              border-radius: 1.5px;
              position: relative;
              top: -3px;
              display: inline-block;
              .inner {
                background: inherit;
                height: 10px;
                width: 5px;
                position: absolute;
                left: 27.5px;
                top: -3px;
              }
            }
          }
        }
        .chart-statistics {
        }
        .model-chart {
          margin-top: 20px;
        }
        .model-feature-panel {
          height: 100%;
          width: 460px;
          border-radius: 4px;
          border: 1px solid #dedede;
          background-color: white;
          z-index: 999;
          position: absolute;
          left: 0px;
          top: 0px;
          display: flex;
          .icon-db_plus {
            position: absolute;
            right: 10px;
            top: 10px;
            display: inline-block;
            transform: rotate(135deg);
            color: #a4a4a4;
            font-size: 18px;
            cursor: pointer;
          }
          .panel-item {
            height: 100%;
            flex: 1;
            padding-left: 15px;
            font-size: 14px;
            .header-cat {
              height: 40px;
              line-height: 40px;
              display: block;
              color: #03b98c;
            }
            .header-num {
              height: 40px;
              line-height: 40px;
              display: block;
              color: #4284f5;
            }
            .body {
              height: calc(100% - 40px);
              overflow-x: hidden;
              overflow-y: auto;
              &:nth-child(2) {
                border-right: 1px solid #dedede;
              }
              > div {
                padding: 3px 0px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
