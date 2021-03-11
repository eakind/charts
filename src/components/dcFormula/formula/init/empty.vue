<template>
  <div class="empty-box">
    <div class="tips">未添加formula</div>
    <div class="btn-add" @click="$emit('on-formula-add')">
      <div class="add-icon-box">
        <icon-svg class="icon"
                  className='icon-add'
                  icon="#icon-db_plus"></icon-svg>
      </div>
      <div class="add-text">{{$t('message.formulaAddText')}}</div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.btn-add {
  display: flex;
  width: 132px;
  height: 36px;
  line-height: 36px;
  background: #4284f5;
  border-radius: 4px;
  color: #fff;
  text-align: center;
  justify-content: space-around;
  cursor: pointer;
}
.empty-box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -40%);
  .tips {
    text-align: center;
    color: #a4a4a4;
    margin-bottom: 21px;
  }
}
</style>
