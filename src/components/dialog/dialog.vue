<template>
  <transition name="fade" :style="{zIndex:zIndex}">
    <div class="dialog">
        <div class="dialog_content">
          <slot>
          </slot>
        </div>
      <div class="dialog_mark" @click="hideHandler"></div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'DcDialog',
  props: {
    zIndex: {
      type: [String, Number],
      default: 99999
    }
  },
  data () {
    return {
    };
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
    hideHandler () {
      this.$emit('hide', false);
    }
  }
};
</script>

<style scoped lang="scss">
.dialog{
  @include wh100;
  .dialog_content{
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -45%);
    border-radius: 4px;
    box-shadow: 0 4px 12px 0 rgba(66,66,66,0.30);
    z-index: 1000000000001;
    background-color: white;
  }
  .dialog_mark{
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    opacity: 0.5;
    background-color: black;
    position: fixed;
    z-index: 999999;
  }
}
</style>
