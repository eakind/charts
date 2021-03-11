<template>
  <div class="model-panel">
    <div class="filter">
      <span class="title">{{$t('dashboard.model_config')}}</span>
      <div class="button" @click="openFilter">
        <div class="ico">
          <icon-svg :styleObj="styleObj" :icon="'#icon-dbc_filter'"></icon-svg>
        </div>
        <div class="text">{{$t('dashboard.feature_filter')}}</div>
      </div>
    </div>
    <div class="divide"></div>
    <div class="feature">
      <span class="title">{{$t('dashboard.feature')}}</span>
      <feature-select :featureObj="featureObj" :targetName="targetObj ? targetObj.targetFeatureName : ''" @showList="showFeatureList" @change="getModelDetail"></feature-select>
    </div>
    <div class="target" v-show="!showFeature">
      <span class="title">Target</span>
      <target-panel :targetObj="targetObj" @change="getModelDetail"></target-panel>
    </div>
    <div class="divide" v-show="!showFeature"></div>
    <div class="building">
      <div
        class="button"
        :class="[modelStatus==='MODELED' || modelStatus==='MODELING' ? 'button-disabled' : '', !targetObj ? 'button-disabled':'']"
        @click="modelBuild"
      >{{isModelBtn}}</div>
    </div>
    <div class="divide" v-show="!showFeature"></div>
    <div
      class="result"
      v-show="modelStatus==='MODELED' || modelStatus==='EXPIRED' || modelStatus==='FAILED'"
    >
      <span class="bold">{{$t('dashboard.model_time')}}</span>
      <span>{{modelTime}}</span>
      <div class="button" @click="viewResult">{{$t('dashboard.model_result')}}</div>
      <span class="timeout-tip" v-if="modelStatus==='EXPIRED'">
        <span class="iconfont icon-db_alert"></span>{{$t('dashboard.model_timeout')}}
      </span>
    </div>
  </div>
</template>

<script>
import IconSvg from '@/components/iconsvg/iconSvg';
import FeatureSelect from './featureSelect';
import TargetPanel from './targetPanel';
import { post, get } from '@/api/server';
import { mapState, mapMutations } from 'vuex';
export default {
  components: {
    IconSvg,
    FeatureSelect,
    TargetPanel
  },
  data () {
    return {
      styleObj: {
        height: '0.9em',
        width: '0.9em'
      },
      showFeature: false,
      featureObj: null,
      targetObj: null,
      // modelTime: '',
      repeatTime: null
    };
  },
  computed: {
    ...mapState('project', ['projectId']),
    ...mapState('drawingboard', ['modelStatus', 'modelTime']),
    isModelBtn () {
      let btn = this.$t('dashboard.model_start');
      if (this.modelStatus === 'MODELING') {
        btn = this.$t('dashboard.modeling');
      }
      return btn;
    }
  },
  mounted () {
    this.getModelDetail(true);
    this.bus.$on('changeModel', () => {
      this.getModelStatus();
    });
  },
  destroyed () {
    clearInterval(this.repeatTime);
    this.repeatTime = null;
  },
  methods: {
    ...mapMutations('drawingboard', [
      'setModelFilterShow',
      'setModelResultShow',
      'setModelStatus',
      'setModelTime'
    ]),
    showFeatureList (boolean) {
      this.showFeature = boolean;
    },
    openFilter () {
      this.setModelFilterShow(true);
    },
    viewResult () {
      this.setModelResultShow(true);
    },
    async getModelStatus () {
      let param = {
        project_id: this.projectId
      };
      let res = await get('modelStatus', param);
      if (res.code === 0) {
        this.setModelStatus(res.status);
        if (this.modelStatus !== 'MODELING') {
          clearInterval(this.repeatTime);
          this.repeatTime = null;
        }
      } else {
        this.setModelStatus('');
      }
    },
    async modelBuild () {
      let param = {
        project_id: this.projectId
      };

      let res = await post('modelBuild', param);
      if (res.code === 0) {
        this.setModelResultShow(true);
        this.setModelStatus('MODELING');
        this.repeatTime = setInterval(() => {
          this.getModelStatus();
        }, 1000);
      }
    },
    async getModelDetail (flag) {
      let param = {
        project_id: this.projectId
      };
      let res = await get('modelDetail', param);
      if (res.code === 0) {
        this.targetObj = {
          targetDataType: res.target_data_type,
          targetFeatureIdx: res.target_feature_idx,
          targetFeatureName: res.target_feature_name,
          targetMapping: res.target_mapping,
          targetValueCounts: res.target_value_counts
        };
        if (flag) {
          this.featureObj = {
            aggrSelected: res.aggr_selected,
            catSelected: res.cat_selected
          };
        }
        if (res.modeling_time) {
          // let time = new Date(res.modeling_time);
          // this.modelTime = this.setFormat(
          //   time.getUTCFullYear(),
          //   time.getMonth(),
          //   time.getDate(),
          //   time.getUTCHours(),
          //   time.getUTCMinutes()
          // );
          // this.modelTime = res.modeling_time;
          this.setModelTime(res.modeling_time);
        }

        this.setModelStatus(res.status);
      } else {
        this.setModelStatus('');
      }
    },
    setFormat (year, month, date, hour, minutes) {
      let _month = month < 9 ? '0' + (month + 1) : month + 1;
      let _date = date < 10 ? '0' + date : date;
      let _hour = hour < 10 ? '0' + hour : hour;
      let _minutes = minutes < 10 ? '0' + minutes : minutes;
      return `${year}-${_month}-${_date} ${_hour}:${_minutes}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.model-panel {
  padding: 10px 10px 0px 12px;
  .title {
    font-size: 16px;
    color: #424242;
    font-weight: 500;
    display: block;
    height: 40px;
    line-height: 40px;
  }
  .divide {
    height: 1px;
    background: #e1e1e1;
    margin-top: 14px;
  }
  .filter {
    height: 40px;
    margin-top: 10px;
    display: flex;
    position: relative;
    .button {
      display: flex;
      height: 30px;
      width: 110px;
      border-radius: 4px;
      font-size: 14px;
      line-height: 30px;
      cursor: pointer;
      position: absolute;
      right: 0;
      top: 5px;
      .ico {
        background: #fff;
        width: 30px;
        border-radius: 4px 0px 0px 4px;
        text-align: center;
      }
      .text {
        background: #4284f5;
        color: #fff;
        border-radius: inherit;
        width: 70px;
        text-align: center;
      }
    }
  }
  .feature {
  }
  .target {
  }
  .building {
    margin-top: 19px;
    .button {
      border-radius: 4px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 16px;
      color: #fff;
      background: #4284f5;
      cursor: pointer;
    }
    .button-disabled {
      background: #a4a4a4;
      pointer-events: none;
    }
  }
  .result {
    font-size: 14px;
    margin-top: 20px;
    .bold {
      font-weight: 400;
    }
    .button {
      margin-top: 10px;
      border-radius: 4px;
      border: 1px solid #4284f5;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 16px;
      color: #4284f5;
      background: #fff;
      cursor: pointer;
    }
    .timeout-tip {
      display: block;
      color: #424242;
      padding: 8px 15px;
      > .iconfont {
        font-size: 18px;
        display: inline-block;
        color: #f5282d;
        margin-right: 5px;
      }
    }
  }
}

.button {
  width: calc(100% - 40px);
  margin: 0 20px;
  border-radius: 4px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 16px;
  color: #fff;
  background: #4284f5;
  cursor: pointer;
}
</style>
