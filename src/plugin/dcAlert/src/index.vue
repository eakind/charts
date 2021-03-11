<template>
  <div class="dc-message-wrap"
       v-if="show">
  <dc-alert class="dc-alert-wrap">
    <div class="dc-message-box"
         :class="'dc-message-box-'+type">
      <!-- 暂时注释 -->
      <!-- <div class="dc-message-box-header">

      </div>-->
      <div class="dc-message-box-content"
           :class="center?'center':''">
        <span v-if="showIcon"
              class="dc-message-box-type-icon-box">
          <dc-icon :icon="icon"></dc-icon>
        </span>
        <div>{{message}}</div>
      </div>
      <div class="dc-message-box-footer"
           :class="center?'center':''">
        <button @click='sure'
                type='text'
                v-if="showConfirmButton"
                :class="confirmButtonClass">{{confirmButtonText}}</button>
        <button @click="show=false"
                type='text'
                v-if="showCancelButton"
                :class="cancelButtonClass">{{cancelButtonText}}</button>
      </div>
    </div>
  </dc-alert>

  </div>
</template>
<script>
import dcAlert from '@/components/dcalert/dcAlert.vue';
let iconName = {
  info: 'db_alert',
  error: 'db10_noticeError',
  warning: 'db10_noticeAlert',
  success: 'db10_noticeSuccess'
}; ;
export default {
  name: 'dcMessageBox',
  components: { dcAlert },
  data () {
    return {
      type: 'info',
      message: '',
      showIcon: true,
      center: false, // 是否居中
      showConfirmButton: true,
      confirmButtonText: '确定',
      confirmButtonClass: '',
      showCancelButton: false,
      cancelButtonText: '取消',
      cancelButtonClass: '',
      show: false,
      callback: null
    };
  },
  computed: {
    icon () {
      return iconName[this.type];
    }
  },
  methods: {
    sure () {
      typeof this.callback === 'function' && this.callback();
      this.show = false;
    }
  }
};
</script>

<style scoped lang='scss'>
.dc-message,
.dc-message-wrap {
  --message-info-bg-color: #f2f2f2;
  --message-info-icon-color: #666666;

  --message-error-bg-color: #ffe8e8;
  --message-error-icon-color: #f5282d;

  --message-warning-bg-color: #fff5d9;
  --message-warning-icon-color: #f59e28;

  --message-success-bg-color: #f1f9df;
  --message-success-icon-color: #03b98c;

  --message-close-icon-color: #a4a4a4;
  --message-title-color: #424242;
}
.dc-message-wrap {
  --message-wrap-bg-color: rgba(0, 0, 0, 0.5);
  --message-content-color: #424242;
  /* 部分样式公用message.css */
}
@function messageColor($color-name) {
  @return var(--message-#{$color-name}-color);
}
@mixin message-box-color($bgColor, $iconColor) {
  background-color: $bgColor;
  color: var(--message-content-color);
  .dc-message-box-type-icon-box {
    color: $iconColor;
  }
}
button,
div,
ul,
li,
span,
a {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  outline: none;
  text-decoration: none;
}
input {
  appearance: none;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
}

.dc-message-wrap {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: var(--message-wrap-bg-color);
  z-index: 10000000;

}
 .dc-message-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 416px;
    padding: 8px;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    z-index: 2101;
    .dc-message-box-content {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .dc-message-box-type-icon-box {
        width: 30px;
        height: 30px;
        line-height: 30px;
      }
    }
    .dc-message-box-content.center {
      justify-content: center;
    }
    .dc-message-box-footer {
      display: flex;
      width: 100%;
      justify-content: flex-end;
      padding: 8px 16px;
      button {
        width: 120px;
        height: 30px;
        line-height: 3px;
        border-radius: 25px;
        border: 1px solid #666666;
        background-color: white;
        margin: 0px 40px;
        outline: none;
        cursor: pointer;
      }
    }
    .dc-message-box-footer.center {
      justify-content: center;
    }
  }

  .dc-message-success {
    @include message-box-color(
      messageColor(success-bg),
      messageColor(success-icon)
    );
  }

  .dc-message-box-info {
    @include message-box-color(messageColor(info-bg), messageColor(info-icon));
  }

  .dc-message-box-error {
    @include message-box-color(
      messageColor(error-bg),
      messageColor(error-icon)
    );
  }

  .dc-message-box-warning {
    @include message-box-color(
      messageColor(warning-bg),
      messageColor(warning-icon)
    );
  }
  .dc-alert-wrap{
     width: 416px;
    z-index: 9999999
  }
</style>
