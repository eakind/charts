<template>
  <div class="view-loading">
    <div class="loading">
      <img src="../../../../assets/cutbi/transform.gif" alt="">
      <span class="info-1">{{$t('dashboard.building_tip')}}</span>
      <span class="info-2">{{$t('dashboard.building_second_tip')}}</span>
    </div>
  </div>
</template>

<script>
export default {

};
</script>

<style lang="scss" scoped>
.view-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  .loading {
    text-align: center;
    img {
      width: 126px;
      height: 126px;
    }
    span {
      display: block;
    }
    .info-1 {
      font-size: 18px;
      font-weight: bold;
    }
    .info-2 {
      font-size: 14px;
      font-weight: 200;
      margin-top: 20px;
    }
  }
}
</style>
