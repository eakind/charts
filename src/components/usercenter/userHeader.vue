<template>
  <div class="user-header">
    <div class="left">
      <div class="info-2">
        <div class="title">
          <span class="name">{{$t('message.permission_rules')}}: </span>
        </div>
        <div class="rule">
          <div class="administrator">
            <span class="circle" :style='{background: c1}'></span>
            <span>{{$t('message.administrator')}}</span>
            <span class="iconfont icon-db_arrowTo"></span>
            <span class="circle" :style='{background: c1}'></span>
            <span class="circle" :style='{background: c2}'></span>
            <span class="circle" :style='{background: c3}'></span>
            <span>{{$t('message.all_permissions')}}</span>
          </div>
          <div class="editor">
            <span class="circle" :style='{background: c2}'></span>
            <span>{{$t('message.editor')}}</span>
            <span class="iconfont icon-db_arrowTo"></span>
            <span class="circle" :style='{background: c2}'></span>
            <span class="circle" :style='{background: c3}'></span>
            <span>{{$t('message.editor')}}/{{$t('message.viewer')}}</span>
          </div>
          <div class="viewer">
            <span class="circle" :style='{background: c3}'></span>
            <span>{{$t('message.viewer')}}</span>
            <span class="iconfont icon-db_arrowTo"></span>
            <span class="circle" :style='{background: c3}'></span>
            <span>{{$t('message.viewer')}}</span>
          </div>
        </div>
      </div>
      <div class="info-3">
        <span class="name">{{$t('message.project_name')}}: {{projectName}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    projectName: {
      type: String,
      default: '',
    },
    errorMsg: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      c1: '#4284F5',
      c2: '#03B98C',
      c3: '#FACC14',
    };
  },
  methods: {
    confirmed () {
      this.$emit('confirmed');
    },
    cancel () {
      this.$emit('cancel');
    },
  },
};
</script>

<style scoped lang='scss'>
.user-header {
  .left {
    width: 100%;
    display: inline-block;
    .info-1 {
      font-size: 16px;
      color: #424242;
      height: 40px;
      line-height: 40px;
      margin-bottom: 4px;
      .list {
        font-size: 18px;
        color: #424242;
        margin-right: 20px;
      }
      .name {
        font-size: 14px;
        color: #666666;
      }
    }
    .info-2 {
      display: flex;
      .title {
        min-width: 100px;
        font-size: 14px;
        color: #A4A4A4;
        padding-top: 2px;
      }
      .rule {
        flex: 1;
        font-size: 14px;
        color: #A4A4A4;
        >div {
          margin-bottom: 10px;
        }
        span {
          margin: 0 10px;
        }
        .iconfont {
          margin-left: 3px;
          margin-right: 3px;
          color: #A4A4A4;
        }
        .circle {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          display: inline-block;
        }
      }
    }
    .info-3 {
      height: 32px;
      line-height: 32px;
      font-size: 14px;
      color: #424242;
      margin-bottom: 8px;
      }
    }
    .right {
      display: inline-block;
      float: right;
      font-size: 16px;
      cursor: pointer;
      text-align: right;
      .yes {
        color: #4284F5;
      }
      .cancel {
        color: #666666;
        margin-left: 40px;
      }
      .error {
        color: orangered;
        font-size: 12px;
        margin-top: 5px;
      }
    }
}
</style>
