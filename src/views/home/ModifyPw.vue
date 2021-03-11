<template>
  <dc-alert class="modify-pw">
    <div class="dc-alert-header">
        {{$t('message.modify_title')}}
    </div>
    <div class="dc-alert-body">
      <div class="modify-row">
        <span class="pw-title">{{$t('message.old_pw')}}</span>
        <pw-input @change="changeOld" :place-holder="$t('message.modify_tip')"></pw-input>
      </div>
      <div class="modify-row">
        <span class="pw-title">{{$t('message.new_pw')}}</span>
        <pw-input @change="changeNew" :place-holder="$t('message.modify_tip')"></pw-input>
      </div>
      <div class="modify-row">
        <span class="pw-title">{{$t('message.confirm_pw')}}</span>
        <pw-input @change="changeConfirm" :place-holder="$t('message.modify_tip')"></pw-input>
      </div>
    </div>
    <span class="modify-tip">{{modifyTip}}</span>
    <div class="dc-alert-footer">
      <button class="dc-alert-confirm" @click="confirmModify">{{$t('message.confirm')}}</button>
      <button class="dc-alert-cancel" @click="cancelHandler">{{$t('message.cancel')}}</button>
    </div>
  </dc-alert>
</template>
<script>
import DcAlert from '@/components/dcalert/dcAlert.vue';
import PwInput from './modifyPw/PwInput.vue';
import { post } from '@/api/server';
import { mapMutations, mapState } from 'vuex';
export default {
  data () {
    return {
      param: {
        old_password: '',
        new_password: '',
        re_password: ''
      },
      modifyTip: ''
    };
  },
  components: {
    DcAlert,
    PwInput
  },
  computed: {
    ...mapState('project', ['locale']),
  },
  mounted () {
  },
  methods: {
    ...mapMutations(['setIsModifyPw']),
    changeOld (val) {
      this.$set(this.param, 'old_password', val);
    },
    changeNew (val) {
      this.$set(this.param, 'new_password', val);
    },
    changeConfirm (val) {
      this.$set(this.param, 're_password', val);
    },
    cancelHandler () {
      this.setIsModifyPw(false);
    },
    async confirmModify () {
      let res = await post('security', this.param);
      if (res.code === 0) {
        this.modifyTip = '';
        this.setIsModifyPw(false);
      } else {
        this.modifyTip = (this.locale === 'zh' ? res.cnMsg : res.enMsg);
        // this.modifyTip = this.$t(`backend[${res.code}]`);
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.modify-pw{
  width: 500px;
  padding-bottom: 15px;
  background-color: white;
  .modify-row{
    display: flex;
    width: 300px;
    margin: 0 auto;
    margin-top: 15px;
    align-items: center;
  }
  .pw-title{
    width: 80px;
  }
  .modify-tip {
    color: orangered;
    text-align: center;
    display: block;
    font-size: 12px;
    height: 20px;
  }
}
</style>
