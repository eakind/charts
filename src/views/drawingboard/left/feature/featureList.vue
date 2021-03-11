<template>
  <div class="feature-list">
    <div class="formula-bg">
      <div class="formula-btn"
          @click="formulaCreate">
        <span class="icon-box iconfont icon-db10_calculate">
        </span>
        <span class="icon-text"> {{$t('message.formulaText')}}</span>
      </div>
    </div>
    <div class="list-header">
      <div class="header-title">
        列表
      </div>
      <div class="header-select">
        <dc-select @change="changeSort"></dc-select>
      </div>
    </div>
    <feature-group title="分类"
                   @change="searchCat"
                   ref="catFeature"
                   :class="showFilterList ? 'show-filter-group' : 'hide-filter-group'">
      <classify-feature v-for="(item, index) in tempCatList"
                        :key="item.feature_name"
                        :index="index"
                        property="cat"
                        data-property="CAT"
                        :name="item.feature_name"
                        :type="item.data_type.toLocaleLowerCase()"
                        @changeGroup="getFeatureList"
                        @dismissGroup="dismissGroup"
                        @show="showOperate"
                        :item="item"
                        :hide="selectOperate"
                        :selectIndex="selectIndex"
                        :selectChildIndex="selectChildIndex"></classify-feature>
    </feature-group>
    <feature-group title="数值"
                   :class="showFilterList ? 'show-filter-group' : ''"
                   ref="numFeature"
                   @change="searchNum">
      <num-feature v-for="(item, index) in tempAggrList"
                   :key="item.feature_name"
                   :index="index"
                   :item="item"
                   property="int"
                   data-property="AGGR"
                   :type="item.data_type.toLocaleLowerCase()"
                   :value="item.feature_name"
                   :hide="selectOperate"
                   :selectIndex="selectIndex"
                   @show="showOperate"></num-feature>
    </feature-group>
    <operate-list v-if="selectOperate"
                  @hide="hideOperate"
                  @changeFeature="changeFeature"
                  @on-formula-edit="formulaEditShow"
                  @on-del-formula-callback="formulaDelCallback"
                  :item="selectOperate"
                  :style="operateStyle"></operate-list>
    <create-group v-if="showGroup"
                  @cancel="cancelGroup"
                  @confirm="confirmGroup"></create-group>
    <dc-formula v-if="showFormula"
                @hide="hideOperate"
                @on-formula-change="showFormula=$event"
                @on-fetch-feature="refreshFeature"
                ref="formulaRefs"></dc-formula>
  </div>
</template>
<script>
import FeatureGroup from './featureGroup';
import ClassifyFeature from './classifyFeature';
import OperateList from './operateList';
import CreateGroup from './createGroup';
import NumFeature from './aggrFeature';
import DcSelect from './dcSelect';
import dcFormula from '@/components/dcFormula/formula'; // formula
import { mapState, mapMutations } from 'vuex';
import { get, post } from '@/api/server';
export default {
  components: {
    FeatureGroup,
    ClassifyFeature,
    NumFeature,
    OperateList,
    CreateGroup,
    DcSelect,
    dcFormula
  },
  data () {
    return {
      selectOperate: null,
      selectIndex: null,
      selectChildIndex: null,
      operateStyle: {},
      showGroup: false,
      featureIdx: null,
      subFeatureIdx: null,
      showFormula: false,
      tempAggrList: [],
      tempCatList: []
    };
  },
  computed: {
    ...mapState('project', ['projectId']),
    ...mapState('drawingboard', ['catList', 'aggrList'])
  },
  watch: {
    aggrList: {
      handler (val) {
        this.tempAggrList = val;
      },
      immediate: true
    },
    catList: {
      handler (val) {
        this.tempCatList = val;
      },
      immediate: true
    },
    selectOperate: {
      handler (val) {
        if (val === null) {
          Array.from(document.querySelectorAll('.feature-scroll')).forEach(n => {
            n.style.overflow = 'auto';
          });
        } else {
          Array.from(document.querySelectorAll('.feature-scroll')).forEach(n => {
            n.style.overflow = 'hidden';
          });
        }
      }
    }
  },
  destroyed () {
    this.bus.$off('createGroup');
    this.bus.$off('move-feature');
  },
  mounted () {
    // 创建特征分组，在dragFeature.js中发送
    this.bus.$on('createGroup', (targetName, name, index, groupName) => {
      if (targetName && name) {
        this.showGroup = true;
        this.subFeatureIdx = this.getFeatureIdx(name);
        this.featureIdx = this.getFeatureIdx(targetName);
      }
      if (!targetName) {
        if (groupName) {
          this.subFeatureIdx = this.getFeatureIdx(name);
          this.featureIdx = this.getFeatureIdx(null, index);
        } else {
          this.subFeatureIdx = this.getFeatureIdx(null, index);
          this.featureIdx = this.getFeatureIdx(name);
        }
        this.createGroup();
      }
    });
    this.bus.$on('move-feature', (clienX, clientY) => {
      let bottom = this.$refs.catFeature.$el.getBoundingClientRect().bottom;
      let right = this.$refs.catFeature.$el.getBoundingClientRect().right;
      let top = this.$refs.catFeature.$el.getBoundingClientRect().top;
      if (clienX < right) {
        if (clientY > (bottom - 100)) {
          this.$refs.catFeature.$refs.feaScroll.scrollTop += 3;
        }
        if (clientY < (top + 100)) {
          this.$refs.catFeature.$refs.feaScroll.scrollTop -= 3;
        }
      }
    });
  },
  methods: {
    ...mapMutations('drawingboard', ['setCatList', 'setAggrList']),
    ...mapMutations('formula', ['setFormulaId', 'setFormulaContent', 'setFormulaObj']),
    formulaEditShow (item) {
      this.showFormula = true;
      let formula = {
        formula_id: item.feature_idx,
        formula_name: item.feature_name,
        formula_type: item.formula_type,
        data_type: item.data_type
      };
      this.setFormulaId(formula.formula_id);
      this.setFormulaContent('');
      this.setFormulaObj(formula);
      this.$nextTick(() => {
        this.$refs.formulaRefs.comName = 'addCom';
        this.$refs.formulaRefs.fetchFunList(true);
      });
    },
    formulaDelCallback (item) {
      this.Delete(item);
    },
    async Delete (item) {
      let param = {
        project_id: this.projectId,
        formula_id: item.feature_idx
      };
      await post('deleteFormula', param);
      this.hideOperate();
      let catList = this.catList.filter(i => i.feature_idx !== item.feature_idx);
      let aggrList = this.aggrList.filter(i => i.feature_idx !== item.feature_idx);
      this.setCatList(catList);
      this.setAggrList(aggrList);
      this.bus.$emit('delete-formula-refresh', item.feature_name);
    },
    // 新增formula 后刷新
    refreshFeature () {
      this.getFeatureList('CAT');
      this.getFeatureList('NUM');
      // 发送事件刷新页面重新画图
      this.bus.$emit('formula-refresh-data');
    },
    formulaCreate () {
      this.showFormula = true;
    },
    changeSort (item) {
      this.getFeatureList('CAT', item.code, item.dir);
      this.getFeatureList('NUM', item.code, item.dir);
    },
    confirmGroup (groupName) {
      this.createGroup(groupName);
    },
    dismissGroup (featureIdx) {
      this.subFeatureIdx = featureIdx;
      this.createGroup();
    },
    cancelGroup () {
      this.showGroup = false;
      this.featureIdx = null;
      this.subFeatureIdx = null;
    },
    hideOperate () {
      this.selectOperate = null;
      this.selectChildIndex = null;
      this.operateStyle = {};
    },
    changeFeature () {
      this.getFeatureList('CAT');
      this.getFeatureList('NUM');
      this.hideOperate();
      this.$emit('changeFeature');
    },
    showOperate (showList, type, index, target, childIndex, name) {
      if (type === 'group') {
        this.selectOperate = null;
        return;
      } else if (type === 'num') {
        this.selectOperate = JSON.parse(JSON.stringify(this.aggrList[index]));
        this.selectOperate.type = 'num';
      } else {
        if (childIndex === null) {
          this.selectOperate = JSON.parse(JSON.stringify(this.catList[index]));
        } else {
          this.selectOperate = JSON.parse(
            JSON.stringify(this.catList[index].groups[childIndex])
          );
        }
        this.selectOperate.type = 'cat';
      }
      if (!showList) {
        this.selectOperate = null;
        this.operateStyle = {};
        this.selectIndex = null;
        this.selectChildIndex = null;
      }
      this.selectIndex = index;
      this.selectChildIndex = childIndex;
      this.$nextTick(() => {
        let cLeft = target.getBoundingClientRect().left + 32;
        let cTop = target.getBoundingClientRect().top + 32;
        var { top, height } = target.parentElement.parentElement.getBoundingClientRect();
        if (name && name === 'classify') {
          top = target.parentElement.parentElement.parentElement.getBoundingClientRect().top;
          height = target.parentElement.parentElement.parentElement.getBoundingClientRect().height;
        } else if (name && name === 'group') {
          top = target.parentElement.parentElement.parentElement.parentElement.parentElement.getBoundingClientRect().top;
          height = target.parentElement.parentElement.parentElement.parentElement.parentElement.getBoundingClientRect().height;
        }
        let diff = 32;
        let dom = document.querySelectorAll('.operate-list .list-item');

        if (dom && dom.length > 1) {
          diff = diff * 2;
          cTop += 32;
        }
        if (cTop + diff > top + height) {
          cTop = target.getBoundingClientRect().top - diff;
        }
        this.operateStyle = {
          left: cLeft + 'px',
          top: cTop + 'px',
          width: target.clientWidth - 35 + 'px'
        };
      });
    },
    getFeatureIdx (name, index) {
      let featureIdx = '';
      let list = JSON.parse(JSON.stringify(this.catList));
      if (!name) {
        return list[index].groups[list[index].groups.length - 1].feature_idx;
      }
      for (let i = 0; i < list.length; i++) {
        if (list[i].data_type === 'GROUP') {
          let groupList = list[i].groups;
          for (let j = 0; j < groupList.length; j++) {
            if (name === groupList[j].feature_name) {
              featureIdx = list.groups[j].feature_idx;
            }
          }
        } else {
          if (name === list[i].feature_name) {
            featureIdx = list[i].feature_idx;
          }
        }
      }
      return featureIdx;
    },
    searchCat (value) {
      if (value.length === 0) {
        this.getFeatureList('CAT');
      } else {
        this.searchFeature('CAT', value);
      }
    },
    searchNum (value) {
      if (value.length === 0) {
        this.getFeatureList('NUM');
      } else {
        this.searchFeature('NUM', value);
      }
    },
    async searchFeature (type, name) {
      let param = {
        project_id: this.projectId,
        feature_type: type,
        feature_name: name
      };
      let res = await get('searchFeature', param);
      if (!res) return;
      if (type === 'NUM') {
        this.tempAggrList = res.feature_list;
        // this.setAggrList(res.feature_list);
      } else {
        this.tempCatList = res.feature_list;
        // this.setCatList(res.feature_list);
      }
    },
    async getFeatureList (type, orderBy, dir) {
      let param = {
        project_id: this.projectId,
        feature_type: type,
        offset: 0,
        limit: 1000
      };
      if (orderBy) {
        param.order_by = orderBy;
      }
      if (dir) {
        param.direction = dir;
      }
      let res = await get('featureList', param);
      if (!res) return;
      if (type === 'NUM') {
        this.setAggrList(res.feature_list);
      } else {
        this.setCatList(res.feature_list);
      }
    },
    async createGroup (groupName) {
      let param = {
        project_id: this.projectId,
        sub_feature_idx: this.subFeatureIdx
      };
      if (this.featureIdx) {
        param.feature_idx = this.featureIdx;
      }
      if (groupName) {
        param.group_name = groupName;
      }
      let res = await post('featureGroup', param);
      if (!res) return;
      this.showGroup = false;
      this.getFeatureList('CAT');
    }
  }
};
</script>
<style lang='scss' scoped>
.feature-list {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .list-header {
    display: flex;
    height: 24px;
    line-height: 24px;
    padding: 3px 16px;
    align-items: center;
    box-sizing: border-box;
    .header-title {
      color: #A4A4A4;
      font-size: 12px;
      flex: 1;
    }
    .header-select {
      width: 80px;
      padding: 10px 0px;
    }
  }
}
.formula-bg{
  height: 48px;
  box-sizing: border-box;
  padding: 8px;
  position: relative;
  text-align: right;
  border-bottom: 1px solid #e1e1e1;
  .formula-btn {
    height: 32px;
    line-height: 32px;
    width: 104px;
    text-align: center;
    background:rgba($color: #F59E28, $alpha: .1);
    cursor: pointer;
    border-radius: 4px;
    display: inline-block;
    .icon-box {
      color: #f59e28;
      font-size: 16px;
    }
    .icon-text {
      font-size: 14px;
      color: #424242;
    }
  }
}
</style>
