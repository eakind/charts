<template>
  <div class="opetate-item-box">
    <dc-alert class="operate-item">
      <span class="iconfont icon-db_plus" @click="cancelHandler"></span>
      <div class="dc-alert-header">{{ $t('dashboard.feature_engineering') }}</div>
      <div class="dc-alert-body">
        <operate-float
          :item="item"
          :dataType="transformType(item.data_type)"
          v-if="floatFlag"
          @modify="preHandler"
        ></operate-float>
        <operate-geo
          :item="item"
          :dataType="transformType(item.data_type)"
          v-if="geoFlag"
          @modify="preHandler"
          @change="changeGeo"
        ></operate-geo>
        <operate-int
          :item="item"
          :dataType="transformType(item.data_type)"
          v-if="intFlag"
          @modify="preHandler"
        ></operate-int>
        <operate-lack
          :item="item"
          :dataType="transformType(item.data_type)"
          v-if="lackFlag"
          @modify="preHandler"
          @change="changeLackHandler"
        ></operate-lack>
        <operate-str
          :item="item"
          :dataType="transformType(item.data_type)"
          v-if="strFlag"
          @modify="preHandler"
        ></operate-str>
        <operate-time
          :item="item"
          :dataType="transformType(item.data_type)"
          v-if="timeFlag"
          @change="changeTimeFormat"
          @modify="preHandler"
        ></operate-time>
        <operate-interval
          :item="item"
          :dataType="transformType(item.data_type)"
          v-if="intervalFlag"
          @modify="preHandler"
          @change="changeInterval"
        ></operate-interval>
        <operate-copy
          :item="item"
          :dataType="transformType(item.data_type)"
          v-if="copyFlag"
          @modify="preHandler"
        ></operate-copy>
        <operate-mapping
          :item="item"
          :dataType="transformType(item.data_type)"
          v-if="mappingFlag"
          @modify="preHandler"
        ></operate-mapping>
        <div class="operate-select" v-show="noneFlag && step === 0">
          <div class="select-title">
            {{ item.feature_name }}
            <span>({{ transformType(item.data_type) }})</span>
          </div>
          <div class="select-method">
            <div>{{ $t('dashboard.select_type') }}</div>
            <div>
              <button class="next-btn" v-if="step === 0" @click="nextHandler">
                {{ $t('dashboard.next') }}
              </button>
            </div>
          </div>
          <select-item
            v-for="(item, index) in list"
            :key="index"
            :index="index"
            :dataType="dataType"
            :selectType="transformType(selectType)"
            :selectIndex="selectIndex"
            @click.native="selectIndexHandler(index)"
            @changeOperate="changeOperate"
            :item="item"
          ></select-item>
        </div>
      </div>
      <div class="dc-alert-footer" v-if="step !== 0">
        <div>
          <button class="confirm-btn" @click="confirmHandler">
            {{ $t('dashboard.confirm') }}
          </button>
        </div>
        <div>
          <button class="cancel-btn" @click="cancelHandler">
            {{ $t('dashboard.cancel') }}
          </button>
        </div>
      </div>
      <div class="dc-alert-loading" v-if="showLoading">
        <span class="loading-logo">
          <div class="img-div">
            <img src="@/assets/cutbi/transform.gif" />
          </div>
          <div>{{ $t('dashboard.wait_while_operating') }}</div>
        </span>
      </div>
      <div class="dc-alert-tip" v-if="failTip">
        {{ $t('dashboard.fail_and_the_reason_is') }} {{ failTxt }}
        <span class="close-btn" @click="failTip = false">{{
          $t('dashboard.know_it')
        }}</span>
      </div>
    </dc-alert>
  </div>
</template>
<script>
import DcAlert from '@/components/dcalert/dcAlert';
import OperateFloat from './operateFloat';
import OperateInt from './operateInt';
import OperateGeo from './operateGeo';
import OperateLack from './operateLack';
import OperateStr from './operateStr';
import OperateTime from './operateTime';
import SelectItem from './selectItem';
import OperateCopy from './operateCopy';
import OperateInterval from './operateInterval';
import OperateMapping from './operateMapping';
export default {
  components: {
    DcAlert,
    OperateFloat,
    OperateInt,
    OperateGeo,
    OperateLack,
    OperateStr,
    OperateTime,
    SelectItem,
    OperateCopy,
    OperateInterval,
    OperateMapping,
  },
  data () {
    return {
      floatFlag: false,
      geoFlag: false,
      intFlag: false,
      lackFlag: false,
      strFlag: false,
      timeFlag: false,
      intervalFlag: false,
      copyFlag: false,
      mappingFlag: false,
      section: '',
      mapType: '',
      selectIndex: 0,
      step: 0,
      selectType: '',
      showLoading: false,
      timeFormat: '',
      tempType: '',
      missing: '',
      fillMethod: 'CUSTOM',
      fillValue: '',
    };
  },
  props: {
    item: {
      type: Object,
    },
    failTip: {
      type: Boolean,
    },
    failTxt: {
      type: String,
    },
  },
  watch: {
    failTip (val) {
      if (val) {
        this.showLoading = false;
      }
    },
  },
  computed: {
    noneFlag () {
      if (
        !this.floatFlag &&
        !this.geoFlag &&
        !this.intFlag &&
        !this.lackFlag &&
        !this.strFlag &&
        !this.timeFlag &&
        !this.intervalFlag
      ) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.step = 0;
        return true;
      }
      return false;
    },
    dataType () {
      return this.item.data_type;
    },
    list () {
      if (this.item.data_type === 'BIN') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.selectType = 'LACK';
        return [this.$t('dashboard.lack_fill')];
      }
      return [this.$t('dashboard.transform'), this.$t('dashboard.lack_fill')]; // , '数值映射', '复制特征'
    },
  },
  mounted () {},
  methods: {
    changeTimeFormat (format) {
      this.timeFormat = format;
    },
    preHandler () {
      this.step = 0;
      this.floatFlag = false;
      this.geoFlag = false;
      this.intFlag = false;
      this.lackFlag = false;
      this.strFlag = false;
      this.timeFlag = false;
      this.intervalFlag = false;
      this.copyFlag = false;
      this.mappingFlag = false;
    },
    nextHandler () {
      this.step = 1;
      this.setType();
    },
    confirmHandler () {
      this.showLoading = true;
      this.$emit(
        'confirm',
        this.selectType,
        this.timeFormat,
        this.section,
        this.mapType,
        this.missing,
        this.fillMethod,
        this.fillValue
      );
    },
    cancelHandler () {
      this.$emit('cancel');
    },
    changeLackHandler (missing, fillMethod, fillValue) {
      this.missing = missing;
      this.fillMethod = fillMethod;
      this.fillValue = fillValue;
    },
    changeGeo (str) {
      this.mapType = str;
    },
    changeInterval (num) {
      this.section = num;
    },
    changeOperate (type) {
      this.selectType = type;
      this.tempType = type;
    },
    selectIndexHandler (index) {
      this.selectIndex = index;
      this.lackFlag = false;
      this.copyFlag = false;
      let obj = {
        1: 'LACK',
        2: 'MAPPING',
        3: 'COPY',
      };
      if (this.item.data_type === 'BIN') {
        obj = {
          0: 'LACK',
        };
      }
      if (obj[this.selectIndex]) {
        this.selectType = obj[this.selectIndex];
      } else {
        this.selectType = this.tempType;
      }
    },
    setType () {
      let obj = {
        FLOAT: (_) => (this.floatFlag = true),
        STRING: (_) => (this.strFlag = true),
        DATATIME: (_) => (this.timeFlag = true),
        TIME: (_) => (this.timeFlag = true),
        BIN: (_) => (this.sectionFlag = true),
        INT: (_) => (this.intFlag = true),
        SECTION: (_) => (this.intervalFlag = true),
        LACK: (_) => (this.lackFlag = true),
        COPY: (_) => (this.copyFlag = true),
        MAPPING: (_) => (this.mappingFlag = true),
        PROVINCE: (_) => (this.geoFlag = true),
        CITY: (_) => (this.geoFlag = true),
        DISTRICT: (_) => (this.geoFlag = true),
        ZIPCODE: (_) => (this.geoFlag = true),
        AREACODE: (_) => (this.geoFlag = true),
        MAP: (_) => (this.geoFlag = true),
        GEO: (_) => (this.geoFlag = true),
      };
      obj[this.selectType]();
    },
    transformType (type) {
      // let dataType = '';
      let obj = {
        FLOAT: this.$t('dashboard.float'),
        STRING: this.$t('dashboard.string'),
        DATETIME: this.$t('dashboard.time_type'),
        BIN: 'bin',
        INT: this.$t('dashboard.int'),
        PROVINCE: this.$t('dashboard.geo'),
        CITY: this.$t('dashboard.geo'),
        DISTRICT: this.$t('dashboard.geo'),
        ZIPCODE: this.$t('dashboard.geo'),
        // AREACODE: this.$t('dashboard.geo'),
        MAP: this.$t('dashboard.geo'),
      };
      return obj[type];
    },
  },
};
</script>
<style lang="scss" scoped>
.opetate-item-box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 5;
}
.operate-item {
  width: 550px;
  box-sizing: border-box;
  min-height: 300px;
  .icon-db_plus {
    right: 16px;
    top: 16px;
    color: #a4a4a4;
    cursor: pointer;
    transform: rotate(45deg);
    display: inline-block;
    position: absolute;
  }
  .dc-alert-header {
    padding: 16px;
    text-align: left;
    font-size: 14px;
    font-weight: bold;
  }
  .dc-alert-body {
    padding: 0 16px;
    .operate-select {
      .select-title {
        font-size: 16px;
        color: #424242;
      }
      .select-method {
        display: flex;
        padding: 10px 0px;
        font-size: 14px;
        color: #666666;
        margin-bottom: 10px;
        border-bottom: 1px solid #e1e1e1;
        > div {
          flex: 1;
          &:nth-child(2) {
            text-align: right;
            .next-btn {
              color: white;
              margin: 0px;
              width: 70px;
              height: 26px;
              line-height: 22px;
              font-size: 14px;
              border-radius: 20px;
              cursor: pointer;
              outline: none;
              border: 1px solid #4284f5;
              background-color: #4284f5;
            }
          }
        }
      }
    }
  }
  .dc-alert-footer {
    padding: 20px 10px;
    display: flex;
    > div {
      flex: 1;
      > button {
        margin: 0px;
      }

      .confirm-btn {
        color: white;
        border: 1px solid #4284f5;
        background-color: #4284f5;
      }
    }
  }
  .dc-alert-loading {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    top: 0px;
    left: 0px;
    background: rgba(0, 0, 0, 0.8);
    .loading-logo {
      left: 50%;
      top: 50%;
      width: 150px;
      color: white;
      transform: translate(-50%, -50%);
      position: absolute;
      padding: 20px 0px;
      box-sizing: border-box;
      text-align: center;
      display: inline-block;
      .img-div {
        width: 60px;
        display: inline-block;
        img {
          width: 100%;
        }
      }
    }
  }
  .dc-alert-tip {
    width: 100%;
    padding: 10px 20px;
    color: white;
    font-size: 12px;
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0.8);
    .close-btn {
      margin-left: 20px;
      text-decoration: underline;
    }
  }
}
</style>
