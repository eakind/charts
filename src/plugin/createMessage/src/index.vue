<template>
  <transition name="fade">
    <div :style="top" v-show="show"  class="plugin-tip" >
      <svg class="icon svg-icon" aria-hidden="true">
        <use xlink:href="#icon-db10_noticeError"></use>
      </svg>
      <span v-text="tip" ></span>
      <span class="iconfont icon-db_plus" v-text="language" @click="closeHandler"></span>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Loading',
  data () {
    return {
    };
  },
  props: {
    tip: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: true
    }
  },
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
  },
  mounted () {
  },
  destroyed () {
  },
  methods: {
    closeHandler () {
      this.show = false;
    }
  }
};
</script>

<style lang="scss" scoped>

.plugin-tip {
  top: 100px;
  left: 50%;
  color: #424242;;
  z-index: 999999999;
  font-size: 12px;
  max-width: 60%;
  position: fixed;
  border-radius: 4px;
  padding: 10px 60px 10px 36px;
  pointer-events: visible!important;
  transform: translateX(-50%);
  background-color: #FFE8E8;
  font-weight: bold;
  .tip-close-btn{
    margin-left: 15px;
    display: inline-block;
    cursor: pointer;
    text-decoration: underline;
  }
  .svg-icon {
    position: absolute;
    left: 10px;
    top: 10px;
    width: 16px;
    height: 16px;
    fill: #F5282D;
  }
  .icon-db_plus {
    position: absolute;
    right: 10px;
    top: 12px;
    font-size: 12px;
    color: #A4A4A4;
    transform: rotate(45deg);
    cursor: pointer;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s
}
.fade-enter,
.fade-leave-to {
  opacity: 0
}
</style>
