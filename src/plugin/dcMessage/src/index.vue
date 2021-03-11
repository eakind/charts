<template>
  <!-- 消息提示 -->
  <div class="dc-message" v-if="show">
    <div
      class="dc-message-content flex"
      :class="'dc-message-' + msgType + '-content'"
    >
      <div class="content">
          <span class="iconfont icon-db10_noticeError"></span>
          <span>{{content}}</span>
      </div>
      <div class="iconfont icon-db_plus" @click="closeHandler"></div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      msgType: 'error',
      show: false,
      content: ''
    };
  },
  methods: {
    closeHandler () {
      this.show = false;
    },
  },
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.dc-message {
  --message-error: #ffe8e8;
}
.flex {
  display: flex;
  justify-content: space-between;
  align-content: center;
}
.dc-message {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  z-index: 5;
}
.dc-message-content {
  padding: 0.6em;
  font-size: 14px;
  width: 40em;
  margin: auto;
  border-radius: 4px;
  margin-top: 1.2em;
  .content{
      .iconfont{
          margin-right: 8px;
      }
  }
}
.icon-db_plus {
  transform: rotate(-45deg);
  cursor: pointer;
}
.dc-message-error-content {
  background-color: var(--message-error);
  .content {
    color: #424242;
    .iconfont{
        color: #F5282D;;
    }
  }
  .icon-db_plus {
    color: #a4a4a4;
  }
}
</style>
