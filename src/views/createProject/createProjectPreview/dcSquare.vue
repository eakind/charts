<template>
  <div class="dc-square" >
    <span class="square-checked" :class="checked ? 'square-active' : ''"></span>
    <span class="square-label">{{label}}</span>
  </div>
</template>

<script>
export default {
  data () {
    return {
    };
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    checked: {
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
  }
};
</script>

<style scoped lang="scss">
.dc-square{
  display: inline-block;
  .square-checked{
    display: inline-block;
    width: 16px;
    height: 16px;
    border-radius: 4px;
    border: 1px solid #4284F5;
    top: 4px;
    margin: 0px 5px;
    position: relative;
  }
  .square-active{
    &::after{
      content: '';
      height: 9px;
      width: 14px;
      border-top: 1px solid #4284F5;
      border-right: 1px solid #4284F5;
      display: inline-block;
      transform: rotate(125deg);
      position: absolute;
    }
  }

  .square-label{
    display: inline-block;
  }
}
</style>
