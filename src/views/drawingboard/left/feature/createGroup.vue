<template>
  <div  class="create-group">
    <el-dialog title="创建分组特征" width="400px" :close-on-click-modal="false" :show-close="true" :visible="true" @close="groupCancel">
      <div class="dc-alert-body">
        <span class="input-message">{{$t('dashboard.group_name')}}</span>
        <input class="content-input" type="text" v-model="groupName" />
      </div>
      <div class="dc-alert-footer">
        <div class="sure-btn" @click="groupConfirm">{{$t('dashboard.confirmed')}}</div>
        <div class="cancel-btn" @click="groupCancel">{{$t('dashboard.cancel')}}</div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'CreateGroup',
  data () {
    return {
      groupName: ''
    };
  },
  mounted () {},
  methods: {
    groupCancel () {
      this.$emit('cancel');
    },
    groupConfirm () {
      this.$emit('confirm', this.groupName);
    }
  }
};
</script>
<style lang='scss' scoped>
.create-group {
  width: 600px;
  height: 230px;
  .dc-alert-header {
    height: 50px;
    line-height: 50px;
  }
  .dc-alert-body {
    height: 100px;
    width: 100%;
    background: #E7EBF2;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    .input-message {
      display: block;
      padding: 14px 8px;
      color: #424242;
      font-size: 14px;
      text-align: left;
    }
    .content-input {
      border: 1px solid #dedede;
      outline: none;
      height: 40px;
      line-height: 40px;
      padding: 0px 4px;
      margin: 0px 8px;
      border-radius: 4px;
      display: block;
      width: 342px;
      color: #cccccc;
      font-size: 16px;
    }
  }
  .dc-alert-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 16px;
    &>div {
      width: 7.5em;
      cursor: pointer;
      text-align: center;
    }
    .sure-btn {
      font-size: 16px;
      color: #4284F5;
      font-weight: bold;
    }

    .cancel-btn {
      font-size: 16px;
      color: #A4A4A4;
    }
  }
}
</style>
<style lang="scss">
.create-group {
  .el-dialog__header {
    padding: 16px;
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
}
</style>
