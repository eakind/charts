<template>
  <div class="edit-setting">
    <template></template>
    <div class="hearder-title">请分别选择源和目标，以创建展板内画布的联动。</div>
    <div class="row-style row-border">
      <div class="left">类型</div>
      <div class="right">画布联动（批量）</div>
    </div>
    <div class="row-style start-align">
      <div class="left">源画布</div>
      <div class="right">
        <select-list :selectStyle='selectStyle' :canvasList='canvasList' selectType='batch' @on-selectCanvas='originSelect'></select-list>
        <span class="span-style">目标画布</span>
        <select-list :selectStyle='selectStyle' :canvasList='canvasList' selectType='batch' @on-selectCanvas='targetSelect'></select-list>
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
import SelectList from './selectList';
export default {
  data () {
    return {
      selectStyle: {
        height: '316px',
        width: '266px',
        boderColor: '#E1E1E1'
      },
      canvasList: [],
      originList: [],
      targetList: []
    };
  },
  components: {
    SelectList
  },
  computed: {
    ...mapState('dashboard', ['workSheetList', 'currentDashboardDetail']),
    ...mapState('project', ['projectId'])
  },
  mounted () {
    this.getCanvasList();
  },
  methods: {
    async getCanvasList () {
      this.canvasList = [];
      if (this.workSheetList.length === 0) return;
      for (let i in this.workSheetList) {
        if (this.workSheetList[i].active) {
          this.canvasList.push(this.workSheetList[i]);
        }
      }
      for (let j in this.canvasList) {
        this.canvasList[j].label = this.canvasList[j].worksheet_title;
        this.canvasList[j].value = this.canvasList[j].worksheet_id;
      };
    },
    cancel () {
      this.$emit('on-cancel');
    },
    originSelect (list) {
      this.originList = [];
      if (list.length === 0) return;
      for (let i in list) {
        this.originList.push({
          worksheet_id: list[i].worksheet_id
        });
      }
    },
    targetSelect (list) {
      this.targetList = [];
      if (list.length === 0) return;
      for (let i in list) {
        this.targetList.push({
          worksheet_id: list[i].worksheet_id
        });
      }
    },
    async sureHandler () {
      if (!this.originList) {
        this.$message({
          message: '请选择源画布。',
          type: 'warning'
        });
        return;
      }
      if (!this.targetList) {
        this.$message({
          message: '请选择目标画布。',
          type: 'warning'
        });
        return;
      }
      let param = {
        project_id: this.projectId,
        dashboard_id: this.currentDashboardDetail.dashboard_id
      };
      let res = await post('delAction', param);
      if (!res || res.code !== 0) {
        return;
      }
      this.actionBatches();
    },
    async actionBatches () {
      let param = {
        project_id: this.projectId,
        dashboard_id: this.currentDashboardDetail.dashboard_id,
        origin_list: this.originList,
        target_list: this.targetList
      };
      let res = await post('actionBatches', param);
      if (!res || res.code !== 0) {
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
    }
  }
};
</script>
<style lang="scss" scoped>
.edit-setting {
  .hearder-title {
    color: #A4A4A4;
    font-size: 12px;
  }
  .row-style {
    color: #424242;
    font-size: 12px;
    font-weight: bold;
    padding: 6px 0px;
    display: flex;
    align-items: center;
    .left {
      width: 80px;
    }
    .right {
      flex: 1;
      display: flex;
      .span-style {
        padding: 0 23px;
      }
    }
  }
  .start-align {
    align-items: flex-start;
  }
  .row-border {
    border-bottom: 1px solid #E1E1E1;
  }
  .btns {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    > span {
      display: inline-block;
      height: 32px;
      line-height: 32px;
      width: 82px;
      color: #fff;
      background: #4284F5;
      text-align: center;
      border-radius: 4px;
      cursor: pointer;
    }
    .cancel-btn {
      background: #A4A4A4;
      margin-left: 80px;
    }
  }
}
</style>
