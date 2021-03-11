<template>
  <el-dialog
    class="dc-dialog"
    :title="dislogTitle"
    :visible.sync="visible"
    :width="width"
    :top="top"
    :modal="modal"
    :close-on-click-modal="false"
    @close="cancel"
    :class="getContentAlign">
    <slot></slot>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ cancelText }}</el-button>
      <el-button type="primary" @click="sure">{{ confirmText }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      visible: this.dialogVisible,
      contentAlignObj: {
        center: '',
        left: 'contentLeft',
        right: 'contentRight'
      }
    };
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '400px'
    },
    dislogTitle: {
      type: String,
      default: ''
    },
    contentAlign: {
      type: String,
      default: 'center'
    },
    top: {
      type: String,
      default: '0vh'
    },
    modal: {
      type: Boolean,
      default: true
    },
    confirmText: {
      type: String,
      default: '确 定'
    },
    cancelText: {
      type: String,
      default: '取 消'
    }
  },
  watch: {
    dialogVisible () {
      this.visible = this.dialogVisible;
    }
  },
  computed: {
    getContentAlign () {
      return this.contentAlignObj[this.contentAlign];
    }
  },
  components: {
  },
  mounted () {
  },
  methods: {
    handleClose () {
      this.$emit('update:dialogVisible', false);
    },
    cancel () {
      // this.visible = false;
      this.$emit('dialogCancel');
    },
    sure () {
      this.$emit('dialogSure');
      // this.visible = false;
    }
  }
};
</script>
<style lang='scss' scoped>
</style>

<style lang='scss'>
.dc-dialog{
  .el-dialog__header {
    padding: 0;
    margin-bottom: 16px;
  }
  .el-dialog__title {
    font-size: 16px;
    font-weight: bold;
    color: #424242;
  }
  .el-dialog__body {
    background-color: #E7EBF2;
    margin: 0 auto;
    padding: 16px;
    font-size: 16px;
    text-align: center;
    border-radius: 4px;
    color: #424242;
    p {
      margin: 0;
    }
  }
  .el-dialog__footer {
    padding: 10px 16px 10px;
    span {
      width: 100%;
      display: flex;
      justify-content: space-around;
      flex-direction: row-reverse;
      .el-button {
        font-size: 16px;
        background-color: #fff;
        border: none;
        font-weight: bold;
        font-family: "siyuanheiti";
        &--default {
          color: #A4A4A4;
        }
        &--primary {
          color: #4284F5
        }
      }
    }
  }
  .contentLeft {
    .el-dialog__body {
      text-align: left;
    }
  }
  .contentRight {
    .el-dialog__body {
      text-align: right;
    }
  }
}
.dc-dialog {
  width: 100%;
  .el-dialog__wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .el-dialog {
    padding: 16px;
    padding-bottom: 0;
  }
}
</style>
