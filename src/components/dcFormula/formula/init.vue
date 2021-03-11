<template>
  <div class="formula-body">
    <div class="formula-type">
      <div class="select-box">
        <dc-select :list="formulaObj.list"
                   :select="formulaObj.select"
                   width="136px"
                   @change="change"></dc-select>
        <span class="tips">{{$t('message.formulaTips')}}</span>
      </div>
      <div class="btn-add"
           v-if="!isEmpty" @click="$emit('update:comName','addCom')">
        <div class="add-icon-box">
          <icon-svg class="icon"
                    className='icon-add'
                    icon="#icon-db_plus"></icon-svg>
        </div>
        <div class="add-text">
             {{$t('message.formulaAddText')}}</div>
      </div>

    </div>
    <div class="formula-content">
      <component :is="comChildName"
                 @on-formula-add="addProcess"
                 :formulaList="searchFormulaList"></component>
    </div>
  </div>
</template>
<script>
import dcSelect from '../../dcselectview/dcSelectView';
import emptyCom from './init/empty';
import listCom from './init/list';
// import { mapMutations } from 'vuex';

export default {
  components: { dcSelect, emptyCom, listCom },
  props: {
    comName: {
      type: String
    },
    formulaList: {
      type: Array,
      default: _ => []
    }
  },
  data () {
    return {
      formulaObj: {
        list: [{ name: '全部运算', id: '' }, { name: '行级运算', id: 'ROW' }, { name: '聚合运算', id: 'AGGR' }, { name: '固定聚合运算', id: 'GROUPBY' }],
        select: '',
      },
    };
  },
  computed: {
    comChildName () {
      return this.isEmpty ? 'emptyCom' : 'listCom';
    },
    isEmpty () {
      return this.formulaList.length === 0;
    },
    searchFormulaList () {
      if (this.formulaObj.select) {
        console.log(this.formulaList.filter(i => i.formula_type === this.formulaObj.select));
        return this.formulaList.filter(i => i.formula_type === this.formulaObj.select);
      }
      return this.formulaList;
    }
  },
  methods: {
    change (item) {
      this.formulaObj.select = item.id;
    },
    addProcess () {
      this.$emit('update:comName', 'addCom');
    },
  }
};
</script>
<style lang="scss" scoped>
.formula-body {
  margin: 10px auto;
  .formula-type {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .select-box {
      display: flex;
      align-items: center;
      .tips {
        display: block;
        margin-left: 5px;
        color: #a4a4a4;
      }
    }
  }
  .btn-add {
    display: flex;
    width: 132px;
    height: 36px;
    line-height: 36px;
    background: #4284f5;
    border-radius: 4px;
    color: #fff;
    text-align: center;
    justify-content: space-around;
    cursor: pointer;
  }
  .formula-content {
    position: relative;
    background: #e7ebf2;
    border-radius: 4px;
    height: 488px;
    margin: 20px auto;
  }
}
.dc-select-view /deep/ .dc-select-view-list{
  position: absolute;
  top: 30px !important;
  left: 0 !important;;
}
</style>
