<template>
  <div class="view-error">
    <div class="error">
      <span class="iconfont icon-db_alert"></span>
      <span class="info-1">{{$t('dashboard.fail_tip')}}</span>
    </div>
  </div>
</template>

<script>
export default {

};
</script>

<style lang="scss" scoped>
.view-error {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  .error {
    text-align: center;
    .iconfont {
      font-size: 66px;
      color: #F5282D;
    }
    .info-1 {
      font-size: 18px;
      font-weight: bold;
      display: block;
    }
  }
}
</style>
