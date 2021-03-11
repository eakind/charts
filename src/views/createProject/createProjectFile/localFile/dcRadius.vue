<template>
  <div class="dc-radius">
    <span class="radius-panel" :class="select ? 'radius-active' : ''"></span>
    <span class="radius-label">{{label}}<span v-if="showBeta" class="beta-tip">(beta)</span></span>
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
      default: 'radio'
    },
    select: {
      type: Boolean,
      default: false
    },
    showBeta: {
      type: Boolean,
      default: false
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
.dc-radius{
  margin: 0px 10px;
  display: inline-block;
  box-sizing: border-box;
  cursor: pointer;
  .radius-panel{
    display: inline-block;
    width: 13px;
    height: 13px;
    border: 1px solid #4284F5;
    border-radius: 50%;
    margin-right: 5px;
    top: 3px;
    position: relative;
  }
  .radius-active{
    &::after{
      content: '';
      height: 9px;
      width: 9px;
      border-radius: 50%;
      background-color: #4284F5;
      border: none;
      display: inline-block;
      position: absolute;
      left: 1px;
      top: 1px;
     // position: relative;
     // left: 2px;
     // top: -4px;
    }
  }
  .radius-label{
    position: relative;
  }

}
</style>
