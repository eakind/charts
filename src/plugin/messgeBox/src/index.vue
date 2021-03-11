<template>
  <div class="message-box-wrap" v-if="show">
    <div class="message-box-box"
         >

      <div class="head-confirm">
        {{title}}
        <!-- {{$t('message.cancelEdit')}} -->
      </div>
      <div class="content-confirm">
        {{content}}
        <!-- {{$t('message.formulaConfirmBoxText')}} -->
      </div>
      <!--  @click="$emit('on-sure')" -->
      <div class="add-btn-group">
        <div class="btn-sure"
             @click="sure">
          {{sureText}}
          <!-- {{$t('message.confirm')}} -->
        </div>
        <!-- $emit('update:confirmShow',false) -->
        <div class="btn-cancel"
             @mousedown="cancel">
          <!-- {{$t('message.cancelEdit')}} -->
          {{cancelText}}
        </div>
      </div>
    </div>
  </div>

</template>
<script>
export default {
  name: 'formulaConfirm',
  data () {
    return {
      title: '',
      content: '',
      sureText: '',
      sureCb: null,
      cancelText: '',
      cancelCb: null,
      show: false
    };
  },
  methods: {
    sure () {
      typeof this.sureCb === 'function' && this.sureCb();
    },
    cancel () {
      typeof this.cancelCb === 'function' && this.cancelCb();
    }
  }
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.add-btn-group {
  display: flex;
  justify-content: center;
  & > div {
    padding: 9px;
    margin: 0 20px;
    font-size: 16px;
    cursor: pointer;
  }
  .btn-sure {
    color: #4284f5;
  }
  .btn-cancel {
    color: #a4a4a4;
  }
}
.message-box-wrap {
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}
.message-box-box {
  position: absolute;
  width: 400px;
  min-height: 220px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 24px 56px 0 rgba(0, 0, 0, 0.1), 0 4px 14px 0 rgba(0, 0, 0, 0.1);
  padding: 8px;
  z-index: 100;
  .head-confirm {
    color: #424242;
    font-weight: bold;
    font-size: 16px;
    padding: 8px;
  }
  .content-confirm {
    background: #e7ebf2;
    border-radius: 4px;
    font-size: 16px;
    width: 368px;
    min-height: 88px;
    padding: 22px 24px;
    margin: 13px auto;
  }
}
</style>
