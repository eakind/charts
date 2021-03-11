<template>
  <div class="edit-setting">
    <div class="hearder-title">请分别选择源和目标，以创建展板内画布的联动。</div>
    <div class="row-style row-border">
      <div class="left">类型</div>
      <div class="right">画布联动</div>
    </div>
    <div class="row-style row-border">
      <div class="left">源</div>
      <div class="right select-box">
        <div class="origin">
          <dc-el-select :list="originList" v-model="origin" @on-change="selectChange"></dc-el-select>
        </div>
        <div class="target">
          <span>目标</span>
          <dc-el-select :list="targetList" v-model="target" @on-change="selectChange"></dc-el-select>
        </div>
      </div>
    </div>
    <div class="row-style">
      <div class="left">使用特征</div>
      <div class="right">
        <div class="feature">
          <div class="feature-select" @click="selectClick">
            <div class="feature-value">{{featureValue}}</div>
            <div class="select-icon" :class="featureFlag ? 'transform-icon delay' : 'delay'"></div>
          </div>
          <div class="select-box" v-if="featureFlag">
            <div class="select-list" :style="`height: ${selectStyle.height};width: ${selectStyle.width}`">
              <el-checkbox :indeterminate="isIndeterminate" v-model="editSelect.checkAll" @change="handleCheckAllChange">全部</el-checkbox>
              <el-checkbox-group v-model="editSelect.checkedList" @change="handleCheckedItemChange">
                <el-checkbox v-for="item in originCatList" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row-style start-align">
      <div class="left">编辑字段</div>
      <div class="right table">
        <div class="table-header">
          <div class="origin-feature">源特征</div>
          <div class="target-feature">目标特征</div>
        </div>
        <div class="table-row" v-for="(list, idx) in relateList" :key="idx">
          <div class="origin-feature row-select">
            <dc-el-select :list="list.originList" v-model="list.originListVal" @on-change="selectChange2"></dc-el-select>
          </div>
          <div class="target-feature row-select">
            <dc-el-select :list="list.targetList" v-model="list.targetListVal" @on-change="selectChange2"></dc-el-select>
          </div>
        </div>
        <div class="center-line"></div>
      </div>
    </div>
    <div class="btns">
      <span @click="sureHandler">确定</span>
      <span class="cancel-btn" @click="cancel">取消</span>
    </div>
  </div>
</template>
<script>
import { post } from '@/api/server';
import { mapState } from 'vuex';
import DcElSelect from '@/components/dcelselect/dcelselect.vue';
import actionMixin from '../mixins/actionMixin.js';
export default {
  data () {
    return {
      chartList: [],
      featureValue: '',
      featureFlag: false,
      selectStyle: {
        height: '240px',
        width: '656px',
        boderColor: '#E1E1E1'
      },
      originCatList: [],
      originList: [],
      targetList: [],
      originFeatureList: [],
      targetFeatureList: [],
      origin: '',
      target: '',
      editlist: {
        origin: '',
        target: ''
      },
      actions: [],
      relateList: [],
      isIndeterminate: true,
      editSelect: {
        checkAll: false,
        checkedList: []
      },
      selectList: []
    };
  },
  components: {
    DcElSelect
  },
  mixins: [actionMixin],
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    editDetail: {
      type: Object
    }
  },
  watch: {
    actionList: {
      handler (list) {
        this.getChartList();
        if (this.isEdit) {
          this.initEditData();
          this.initList();
        }
      },
      deep: true,
      immediate: true
    },
    origin: {
      handler (val) {
        this.getTargetList(val);
        this.getFeatrue(val);
      },
      deep: true,
    },
    originCatList: {
      handler (val) {
        this.featureValue = '全部';
        this.actions = [];
        for (let i in val) {
          this.actions.push({
            origin_feature_idx: val[i].idx,
            target_feature_idx: val[i].idx,
            value: ''
          });
        }
        this.setOriginFeatureList();
        this.settargetFeatureList();
        this.setRelateList(this.actions, this.isEdit);
        this.setSelecData(val);
      },
      deep: true
    },
    selectList: {
      handler (val) {
        this.selectFeatureHandler(val, this.editSelect.checkAll);
      },
      deep: true
    },
    featureValue (val) {
      // this.setRelateList();
    }
  },
  computed: {
    ...mapState('dashboard', ['currentDashboard']),
  },
  mounted () {
  },
  methods: {
    setSelecData (val) {
      this.selectList = val;
      this.editSelect.checkedList = [];
      if (this.isEdit) {
        let checklist = [];
        for (let i in this.editDetail.actions) {
          checklist.push(this.editDetail.actions[i].origin_feature_idx);
        }
        if (checklist.length === this.originCatList.length) {
          this.editSelect.checkAll = true;
        } else {
          this.editSelect.checkAll = false;
        }
        this.editSelect.checkedList = checklist;
        this.selectList = [];
        for (let i in this.originCatList) {
          for (let j in checklist) {
            if (checklist[j] === this.originCatList[i].idx) {
              this.selectList.push(this.originCatList[i]);
            }
          }
        }
        this.selectFeatureHandler(this.selectList, this.editSelect.checkAll);
      } else {
        for (let i in val) {
          this.editSelect.checkedList.push(val[i].value);
          this.editSelect.checkAll = true;
          this.selectFeatureHandler(val, this.editSelect.checkAll);
        }
      }
    },
    handleCheckAllChange (val) {
      if (this.editSelect.checkAll) {
        this.editSelect.checkedList = [];
        this.selectList = [];
        this.originCatList.forEach(item => {
          this.editSelect.checkedList.push(item.value);
          this.selectList.push(item);
        });
        this.isIndeterminate = false;
      } else {
        this.editSelect.checkedList = [];
        this.selectList = [];
      }
    },
    handleCheckedItemChange (val) {
      if (this.editSelect.checkedList.length === this.originCatList.length) {
        this.editSelect.checkAll = true;
      } else {
        this.editSelect.checkAll = false;
      }
      this.selectList = [];
      for (let i in val) {
        for (let j in this.originCatList) {
          if (val[i] === this.originCatList[j].value) {
            this.selectList.push(this.originCatList[j]);
          }
        }
      }
    },
    initEditData () {
      this.origin = this.editDetail.origin_worksheet_id;
      this.getTargetList(this.origin);
      this.getFeatrue(this.origin);
      this.target = this.editDetail.target_worksheet_id;
    },
    initList () {
      this.actions = [];
      for (let i in this.editDetail.actions) {
        this.actions.push({
          origin_feature_idx: this.editDetail.actions[i].origin_feature_idx,
          target_feature_idx: this.editDetail.actions[i].target_feature_idx,
          value: ''
        });
      }
      this.setOriginFeatureList();
      this.settargetFeatureList();
      this.setRelateList(this.actions, this.isEdit);
    },
    getChartList () {
      this.originList = [];
      if (this.workSheetList.length === 0) return;
      for (let i in this.workSheetList) {
        if (this.workSheetList[i].active) {
          this.originList.push(this.workSheetList[i]);
        }
      }
      for (let j in this.originList) {
        this.originList[j].label = this.originList[j].worksheet_title;
        this.originList[j].value = this.originList[j].worksheet_id;
      };
    },
    selectFeatureHandler (list, flag) {
      this.featureValue = '';
      if (flag) {
        this.featureValue = '全部';
      } else {
        for (let i in list) {
          this.featureValue = (this.featureValue + list[i].name + ',');
        };
        this.featureValue = this.featureValue.replace(/,$/gi, '');
      }
      this.actions = [];
      for (let i in list) {
        this.actions.push({
          origin_feature_idx: list[i].idx,
          target_feature_idx: list[i].idx,
          value: ''
        });
      }
      this.setOriginFeatureList();
      this.settargetFeatureList();
      this.setRelateList(this.actions, this.isEdit);
    },
    selectClick () {
      if (!this.origin || !this.target) {
        this.$message({
          message: '请选择画布。',
          type: 'warning'
        });
        return;
      }
      this.featureFlag = !this.featureFlag;
    },
    async sureHandler () {
      if (!this.origin) {
        this.$message({
          message: '请选择源画布。',
          type: 'warning'
        });
        return;
      }
      if (!this.target) {
        this.$message({
          message: '请选择目标画布。',
          type: 'warning'
        });
        return;
      }
      if (!this.featureValue) {
        this.$message({
          message: '请选择使用特征。',
          type: 'warning'
        });
        return;
      }
      if (!this.isEdit) {
        let arr = this.getActions();
        let param = {
          project_id: this.projectId,
          dashboard_id: this.currentDashboard.dashboard_id,
          origin_worksheet_id: this.origin,
          target_worksheet_id: this.target,
          actions: arr
        };
        let res = await post('createAction', param);
        if (!res || res.code !== 0) {
          this.$message({
            message: '操作失败。',
            type: 'warning'
          });
          this.cancel();
          return;
        }
        this.modifyAction(res);
      } else {
        this.modifyAction(this.editDetail);
      }
    },
    async modifyAction (list) {
      let param = {
        project_id: this.projectId,
        dashboard_id: this.currentDashboard.dashboard_id,
        action_id: list.action_id,
        target_worksheet_id: this.target,
        actions: this.getActions(),
        cats: this.getCats(list)
      };
      var response = await post('modifyAction', param);
      if (!response || response.code !== 0) {
        this.$message({
          message: '操作失败。',
          type: 'warning'
        });
        this.cancel();
        return;
      }
      this.$emit('on-success');
      this.$message({
        message: this.isEdit ? '操作成功。' : '成功添加交互。',
        type: 'success'
      });
    },
    cancel () {
      this.$emit('on-cancel');
    },
    hideHandler () {
      this.featureFlag = false;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./scss/separateEdit.scss";
</style>
<style lang="scss">
.select-box {
  .el-select {
    width: 240px;
    .el-input__inner {
      height: 32px;
      line-height: 32px;
    }
  }
}
.row-select {
  .el-select {
    width: 240px;
    .el-input__inner {
      height: 28px;
      line-height: 28px;
    }
  }
}
.select-list {
  .el-checkbox-group{
    display: flex;
    flex-direction: column;
  }
  .el-checkbox{
    line-height: 32px;
    width: 100%;
    border-bottom: 1px solid #E1E1E1;
    &:last-child {
      border: none;
    }
  }
  .el-checkbox__input {
    margin-left: 10px;
  }
  .is-checked {
    .el-checkbox__label {
      color: #424242;
    }
  }
}
</style>
