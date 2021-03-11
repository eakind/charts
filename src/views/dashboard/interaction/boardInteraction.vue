<template>
  <div>
    <div class="interaction-box">
      <el-dialog :title="dialogTitle" width="768px" :visible='interactionFlag'
        :close-on-click-modal="false" :show-close="closeFlag" @close="setActionFlag(false);">
        <template v-if="tableFlag">
          <interaction-table :tableList="actionCardList" @deleteClick="deleteHandler" @on-select="selectHandler" @on-remove="removeHandler" @on-edit="editHandler"></interaction-table>
        </template>
        <template v-if="separateEditFlag">
          <separate-edit :isEdit="isEdit" :editDetail="editDetail" @on-cancel="cancelHandler" @on-success="successHandler"></separate-edit>
        </template>
        <template v-if="batchEditFlag">
          <batch-edit @on-cancel="cancelHandler" @on-success="successHandler"></batch-edit>
        </template>
      </el-dialog>
    </div>
    <div class="delete-box">
      <dc-dialog
      dislogTitle="清除联动"
      :modal="false"
      contentAlign="left"
      v-if="deleteFlag"
      :dialogVisible="deleteFlag"
      @dialogCancel="delCancel"
      @dialogSure="delConfirm">
      确定清除展板内的所有联动
      </dc-dialog>
    </div>
  </div>
</template>
<script>
import { post } from '@/api/server';
import { mapState, mapMutations } from 'vuex';
import DcDialog from '@/components/dcDialog/dcDialog.vue';
import InteractionTable from './interactionTable';
import SeparateEdit from './separateEdit';
import BatchEdit from './batchEdit';
import actionMixin from '../mixins/actionMixin.js';
export default {
  data () {
    return {
      dialogTitle: '联动交互',
      closeFlag: true,
      tableFlag: true,
      separateEditFlag: false,
      batchEditFlag: false,
      deleteFlag: false,
      isEdit: false,
      editDetail: {}
    };
  },
  mixins: [actionMixin],
  props: {
    interactionFlag: {
      type: Boolean,
      default: true
    }
  },
  components: {
    DcDialog,
    InteractionTable,
    SeparateEdit,
    BatchEdit
  },
  computed: {
    ...mapState('dashboard', ['workSheetList']),
  },
  watch: {
    currentDashboardDetail: {
      handler (list) {
        this.getChartList();
        this.getActionList();
      },
      deep: true
    }
  },
  mounted () {
    this.tableFlag = true;
    this.separateEditFlag = false;
    this.batchEditFlag = false;
    this.closeFlag = true;
    this.getChartList();
    this.getActionList();
  },
  methods: {
    ...mapMutations('dashboard', ['setActionFlag', 'setActionList', 'workSheetList']),
    deleteHandler () {
      this.deleteFlag = true;
    },
    selectHandler (index) {
      if (index === 0) {
        this.dialogTitle = '编辑设置';
        this.tableFlag = false;
        this.separateEditFlag = true;
        this.batchEditFlag = false;
        this.closeFlag = false;
        this.isEdit = false;
        this.editDetail = {};
      } else if (index === 1) {
        this.dialogTitle = '编辑设置';
        this.tableFlag = false;
        this.separateEditFlag = false;
        this.batchEditFlag = true;
        this.closeFlag = false;
      };
    },
    async removeHandler (item) {
      let param = {
        project_id: this.projectId,
        dashboard_id: this.currentDashboardDetail.dashboard_id,
        action_id: item.action_id
      };
      let res = await post('delAction', param);
      if (!res || res.code !== 0) {
        this.$message({
          message: '操作失败。',
          type: 'warning'
        });
        return;
      }
      this.$message({
        message: '操作成功',
        type: 'success'
      });
      setTimeout(() => {
        this.actionCardList = [];
        this.getActionList();
      }, 500);
    },
    editHandler (item) {
      this.dialogTitle = '编辑设置';
      this.tableFlag = false;
      this.separateEditFlag = true;
      this.batchEditFlag = false;
      this.closeFlag = false;
      this.isEdit = true;
      this.editDetail = item;
    },
    delCancel () {
      this.deleteFlag = false;
    },
    async delConfirm () {
      this.deleteFlag = false;
      let param = {
        project_id: this.projectId,
        dashboard_id: this.currentDashboardDetail.dashboard_id
      };
      let res = await post('delAction', param);
      if (!res || res.code !== 0) {
        this.$message({
          message: '操作失败。',
          type: 'warning'
        });
        return;
      }
      this.$message({
        message: '操作成功',
        type: 'success'
      });
      setTimeout(() => {
        this.actionCardList = [];
        this.getActionList();
      }, 500);
    },
    cancelHandler () {
      this.dialogTitle = '联动交互';
      this.tableFlag = true;
      this.separateEditFlag = false;
      this.batchEditFlag = false;
      this.closeFlag = true;
    },
    successHandler () {
      this.dialogTitle = '联动交互';
      this.tableFlag = true;
      this.separateEditFlag = false;
      this.batchEditFlag = false;
      this.closeFlag = true;
      setTimeout(() => {
        this.getActionList();
      }, 500);
    }
  }
};
</script>
<style lang="scss">
.interaction-box {
  .el-dialog {
    height: 480px;
    padding: 8px 16px 0px 16px;
    padding-bottom: 0;
  }
  .el-dialog__header {
    padding: 0;
    margin-bottom: 4px;
    .el-dialog__headerbtn {
      top: 10px;
    }
    .el-dialog__close {
      font-weight: bold;
    }
  }
  .el-dialog__title {
    font-size: 14px;
    font-weight: bold;
  }
  .el-dialog__body {
    padding: 0px;
  }
}
</style>
