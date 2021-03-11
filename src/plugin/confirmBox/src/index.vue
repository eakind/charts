<template>
  <el-dialog
    class="confirm-dialog"
    :visible="show"
    :title="title"
    :confirmText="confirmText"
    :cancelText="cancelText"
    :close-on-click-modal="false"
    width="400px"
    @close="cancelHandler"
    @dialogCancel="cancelHandler"
    @dialogSure="confirmHandler">
    <div class="confirm-content" v-if="!hasInput">
      <span class="message">{{message}}</span>
      <div class="select-content" v-if="hasSelect">
        <div class="content-title">{{selectTextt}}</div>
        <div class="content-select">
          <el-select  v-model="selectValue">
            <el-option v-for="(item, index) in selectList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="confirm-content" v-else>
      <span class="input-message">{{message}}</span>
      <input class="content-input" v-model="inputValue" />
    </div>
    <div class="footer-btn">
      <button @click="confirmHandler">{{confirmText}}</button>
      <button @click="cancelHandler">{{cancelText}}</button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      show: false,
      hasSelect: true,
      hasInput: false,
      title: '',
      message: '',
      confirmText: '确定',
      cancelText: '取消',
      selectTextt: '指定特征',
      selectList: [],
      selectValue: '',
      inputValue: 0.5
    };
  },
  components: {
  },
  methods: {
    confirmHandler () {
      if (this.hasInput) {
        this.clickConfirm(this.inputValue);
        return;
      }
      if (this.hasSelect) {
        this.clickConfirm(this.selectValue);
        return;
      }
      this.clickConfirm();
    },
    cancelHandler () {
      this.show = false;
      if (this.clickCancel) {
        this.clickCancel();
      }
    }
  }
};
</script>
<style scoped lang="scss">
.confirm-content {
  background: #E7EBF2;
  height: 100px;
  border-radius: 4px;
  .message {
    display: block;
    padding: 8px;
    color: #424242;
    font-size: 16px;
    text-align: center;
  }
  .select-content{
    display: flex;
    align-items: center;
    padding: 8px 24px;
    .content-title{
      margin-right: 8px;
      font-size: 16px;
      color: #424242;
    }
  }
  .content-input{
    border: 1px solid #dedede;
    outline: none;
    height: 40px;
    line-height: 40px;
    padding: 0px 4px;
    margin: 0px 8px;
    border-radius: 4px;
    display: block;
    width: 342px;
    color: #424242;
    font-size: 16px;
  }
  .input-message {
    display: block;
    padding: 14px 8px;
    color: #424242;
    font-size: 14px;
    text-align: left;
  }
}
.footer-btn {
  display: flex;
  align-items: center;
  text-align: center;
  padding-top: 16px;
  > button {
    width: 120px;
    border: none;
    height: 40px;
    line-height: 40px;
    margin-left: 40px;
    background-color: transparent;
    outline: none;
    cursor: pointer;
    font-size: 16px;
    &:first-child{
      color: #4284f5;
    }
    &:last-child{
      color: #a4a4a4;
    }
  }
}
</style>
<style lang="scss">
.confirm-dialog {
  .el-dialog__header {
    .el-dialog__title {
      color: #424242;
      font-size: 14px;
      font-weight: 600;
    }
    .el-dialog__close {
      font-weight: 600;
      color: #A4A4A4;
    }
  }
}
</style>
