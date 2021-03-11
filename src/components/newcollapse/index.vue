<template>
  <div class="collapse-box">
    <el-collapse v-model="activeName" :accordion="accordion ? true : false">
      <template v-for="(i, index) in itemsList">
        <el-collapse-item :title="i.title" :name="i.name" :key="index">
          <slot :name="'title' + i.slot"></slot>
          <slot :name="i.slot"></slot>
        </el-collapse-item>
      </template>
    </el-collapse>
  </div>
</template>
<script>
export default {
  name: 'dcCollapse',
  props: {
    itemsList: {
      type: Array,
      default: (_) => [],
    },
    activeName: {
      type: [String, Array],
    },
    accordion: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang="scss">
.collapse-box {
  .el-collapse {
    // background-color: hsl(0, 0%, 100%);
    border: none;
    font-size: 12px;
    .el-collapse-item {
      background: #e7eaf0;
      margin-bottom: 1px;
      & > div:first-child {
        position: relative;
        box-shadow: 0px 2px 4px 0px hsla(0, 0%, 25.9%, 0.2);
        &::after {
          content: ' ';
          display: block;
          box-shadow: 0px 2px 4px 0px rgba(66, 66, 66, 0.2);
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: -1;
        }
      }
      .el-collapse-item__header {
        height: 32px;
        line-height: 32px;
        display: flex;
        flex-direction: row-reverse;
        justify-content: flex-end;
        color: hsl(0, 0%, 25.9%);
        font-size: 12px;
        background: #FBFCFF;
        .el-collapse-item__arrow {
          margin: 0 8px 0 8px;
        }
      }
      .el-collapse-item__wrap {
        background: #fbfcff;
        border: none;
        // box-shadow: 0px -1px 5px 0px #ccc;
        // margin-top: 0.57em;
      }
      .el-collapse-item__content {
        background: #fbfcff;
        padding-bottom: 0.71em;
        padding-left: 0.57em;
        padding-right: 0.83em;
        padding-top: 0.71em;
        overflow: auto;
        // background: hsl(0, 0%, 97.6%);
        max-height: 55em;
      }
    }
  }
}

@media screen and (max-width: 1920px) {
  .collapse-box{
    .el-collapse-item__content {
      max-height: 55em;
    }
  }
}
@media screen and (max-width: 1480px) {
  .collapse-box{
    .el-collapse-item__content {
      height: 43em;
    }
  }
}
@media screen and (max-width: 1370px) {
  .collapse-box{
    .el-collapse-item__content {
      height: 33em;
    }
  }
}
</style>
