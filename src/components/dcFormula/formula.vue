<template>
<div class="formula-box">
  <dc-alert class="dc-formula" :zIndex="99" :enabled="enabled">
    <div class="formula-head">
      <div class="text">{{$t('message.formulaText')}}</div>
      <div class="close-icon-box"
           @mousedown="closeProcess">
        <icon-svg class="icon"
                  className='icon-close'
                  icon="#icon-db_plus"></icon-svg>
      </div>
    </div>
    <component :is="comName"
    :featureListFlag="featureListFlag"
               v-on="$listeners"
               :comName.sync="comName"
               :formulaList="formulaList"
               @on-fetch-formula="fetchFormulaList"></component>
  </dc-alert>
</div>
</template>
<script>
import dcAlert from '../dcalert/dcAlert';
import initCom from './formula/init';
import addCom from './formula/add';
import { mapState, mapMutations } from 'vuex';
import { get } from '@/api/server';
export default {
  name: 'dcFormula',
  components: { dcAlert, initCom, addCom },
  data () {
    return {
      comName: 'initCom',
      formulaList: [],
      featureListFlag: false
    };
  },
  computed: { ...mapState('formula', ['formulaId', 'formulaContent','enabled']), ...mapState('project', ['projectId']) },
  mounted () {
    this.setEnabled(false)
    this.fetchFunList();
    this.fetchFormulaList();
  },
  methods: {
    ...mapMutations('formula', ['setFormulaId', 'setFormulaContent', 'setFormulaFunList', 'setFormulaObj','setEnabled']),
    closeProcess () {
      if (this.formulaId) {
        this.resetFormula();
        this.msgBoxAfterCancel();
        return;
      }
      this.$emit('on-formula-change', false);
    },
    sure () {
      this.$emit('on-formula-change', false);
    },
    msgBoxAfterCancel () {
      this.setEnabled(true)
      this.showMessageBox({
        title: this.$t('message.cancelEdit'),
        content: this.$t('message.formulaConfirmBoxText'),
        sureText: this.$t('message.confirm'),
        cancelText: this.$t('message.cancel'),
        sureCb: () => {
          this.sure();
          this.hideMessageBox();
          this.setEnabled(false)
        },
        cancelCb: () => {
          this.hideMessageBox();
          this.setEnabled(false)
        }
      });
    },
    // 是否是画布点进去的
    async fetchFunList (flag) {
      this.featureListFlag = flag || false;
      let res = await get('fetchFunList', {});
      if (res && res.code === 0) {
        let list = res.func_list || [];
        this.setFormulaFunList(list);
      }
    },
    // 获取列表
    async fetchFormulaList () {
      //
      let param = { project_id: this.projectId };
      let res = await get('fetchFormulaList', param);
      if (res && res.code === 0) {
        // formulaList 赋值
        this.formulaList = res.formula_list;
      }
    },
    // 重置
    resetFormula () {
      this.setFormulaId('');
      this.setFormulaContent('');
      this.setFormulaObj({});
    },

  },

};
</script>
<style lang="scss" scoped>
.formula-box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .6);
  z-index: 5;
}
.dc-formula  {
  width: 1030px;
  height: 610px;
  background-color: #fff;
  position: fixed;
  border-radius: 4px;
  padding: 16px;
  // z-index: 1003;
  .formula-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .text {
      color: #424242;
      font-size: 14px;
      font-weight: bold;
    }
    .close-icon-box {
      width: 30px;
      height: 30px;
      line-height: 30px;
      cursor: pointer;
      .icon-close {
        transform: rotate(45deg);
      }
    }
  }
}
// .dc-formula /deep/ .dialog_mark {
//   z-index: 1002;
// }
</style>
