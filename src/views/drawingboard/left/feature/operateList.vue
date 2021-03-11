<template>
  <!-- v-click-out="hide" -->
  <div class="operate-list" v-click-out="hide">
    <template v-if="!item.formula_type">
      <div
        class="list-item"
        v-if="item.data_type !== 'DATETIME'"
        @click="operateHandler"
      >
        {{ $t('dashboard.feature_engineering') }}
      </div>
    </template>
    <template v-else>
      <div class="list-item" @click="formulaEditCjk(item)">
        {{ $t('dashboard.editFormulaText') }}
      </div>
      <div
        class="list-item"
        v-if="item.reference_count === 0"
        @click="DeleteProcess(item)"
      >
        {{ $t('dashboard.deleteFormulaText') }}
      </div>
    </template>
    <operate-item
      v-if="showOperate"
      :failTip="failTip"
      :failTxt="failTxt"
      :item="item"
      :load="loading"
      @cancel="cancelHandler"
      @confirm="confirmHandler"
    ></operate-item>
  </div>
</template>
<script>
import { post } from '@/api/server';
import OperateItem from '../operateitem/operateItem';
import { mapState } from 'vuex';
export default {
  components: {
    OperateItem,
  },
  data () {
    return {
      showOperate: false,
      failTip: false,
      failTxt: '',
      loading: false,
      sureClickFlag: false,
    };
  },
  props: {
    item: {
      type: Object,
    },
  },
  computed: {
    ...mapState('project', ['projectId']),
  },
  methods: {
    hide () {
      if (this.showOperate) return;
      if (this.sureClickFlag) return;
      this.$emit('hide');
    },
    confirmHandler (
      type,
      timeFormat,
      section,
      mapType,
      missing,
      fillMethod,
      fillValue
    ) {
      let convertedType = this.changeType(type);
      this.failTip = false;
      this.failTxt = '';
      setTimeout(() => {
        this.featureModify(
          convertedType,
          timeFormat,
          section,
          mapType,
          missing,
          fillMethod,
          fillValue
        );
      }, 0);
    },
    cancelHandler () {
      this.showOperate = false;
    },
    operateHandler () {
      this.showOperate = true;
    },
    selectOperate (item, index) {
      let obj = {
        FLOAT: (_) => (this.floatFlag = true),
        MISSING: (_) => (this.lackFlag = true),
        TIME: (_) => (this.timeFlag = true),
        STRING: (_) => (this.strFlag = true),
        INT: (_) => (this.intFlag = true),
        GEO: (_) => (this.geoFlag = true),
        SECTION: (_) => (this.sectionFlag = true),
      };
      obj[item.code]();
      // switch (item.code) {
      //   case 'FLOAT':
      //     this.floatFlag = true;
      //     break;
      //   case 'MISSING':
      //     this.lackFlag = true;
      //     break;
      //   case 'TIME':
      //     this.timeFlag = true;
      //     break;
      //   case 'STRING':
      //     this.strFlag = true;
      //     break;
      //   case 'INT':
      //     this.intFlag = true;
      //     break;
      //   case 'GEO':
      //     this.geoFlag = true;
      //     break;
      //   case 'SECTION':
      //     this.sectionFlag = true;
      //     break;
      // }
    },
    changeType (type) {
      // switch (type) {
      //   case 'FLOAT':
      //     return 'NUMERIC';
      //   case 'GEO':
      //     return 'MAP';
      //   case 'SECTION':
      //     return 'DUMMY';
      // }
      let obj = {
        FLOAT: 'NUMERIC',
        GEO: 'MAP',
        SECTION: 'DUMMY',
      };
      if (obj[type]) {
        return obj[type];
      }
      return type;
    },
    async featureModify (
      convertedType,
      timeFormat,
      section,
      mapType,
      missing,
      fillMethod,
      fillValue
    ) {
      let param = {
        project_id: this.projectId,
        feature_idx: this.item.feature_idx,
        feature_name: this.item.feature_name,
        converted_type: convertedType,
      };
      switch (convertedType) {
        case 'TIME':
          param.time_format = timeFormat;
          break;
        case 'DUMMY':
          param.binning = Number(section);
          break;
        case 'MAP':
          param.map_type = mapType;
          break;
        case 'LACK':
          if (missing.length > 0) {
            param.missing = missing;
          }
          param.fill_method = fillMethod;
          if (fillMethod === 'CUSTOM') {
            param.fill_value = fillValue;
          }
          delete param.converted_type;
      }
      if (param.binning === '' || param.binning === 0) {
        this.failTip = true;
        this.failTxt = '请输入正确区间';
        return;
      }
      let res = await post('featureModify', param);
      if (res.code !== 0) {
        this.failTip = true;
        this.failTxt = this.$i18n.t(`backend[${res.code}]`);
      } else {
        this.$tip(
          this.$t('dashboard.operate_success'),
          this.$t('dashboard.know_it'),
          '50px'
        );
        this.$emit('changeFeature');
      }
    },
    formulaEditCjk (item) {
      this.$emit('hide');
      this.$emit('on-formula-edit', item);
    },
    DeleteProcess (item) {
      this.sureClickFlag = true;
      this.showMessageBox({
        title: '删除formula',
        content: '确定删除吗?',
        sureText: '确定',
        cancelText: '取消',
        sureCb: () => {
          this.$emit('on-del-formula-callback', item);
          this.hideMessageBox();
        },
        cancelCb: () => {
          this.hideMessageBox();
          this.hide();
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.operate-list {
  background: white;
  border: 1px solid #e1e1e1;
  z-index: 5;
  border-radius: 4px;
  position: fixed;
  .list-item {
    cursor: pointer;
    font-size: 14px;
    padding: 5px 10px;
    &:hover {
      background: rgba(66, 132, 245, 0.2);
    }
  }
  .operate-panel {
    border: 1px solid #e1e1e1;
    background: white;
    width: 170px;
    border-radius: 4px;
    position: fixed;
    > div {
      padding: 5px 12px;
      position: relative;
      font-size: 14px;
      color: #4284f5;
      cursor: pointer;
      .iconfont {
        right: 10px;
        font-size: 14px;
        color: #424242;
        position: absolute;
      }
      &:last-child {
        color: black;
      }
    }
  }
}
</style>
