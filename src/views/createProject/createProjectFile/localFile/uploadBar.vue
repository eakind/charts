<template>
  <div class="dc-upload-bar" ref="bar">
    <span class="upload-bar" :style="progress"></span>
  </div>
</template>

<script>
export default {
  data () {
    return {
    };
  },
  props: {
    precent: {
      type: Number,
      default: 0
    }
  },
  computed: {
    progress () {
      return {
        transform: `translateX(${Math.floor(this.precent - 100)}%)`
      };
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
.dc-upload-bar{
  margin: 0px 0px 10px;
  background: rgba(66,132,245, 0.1);
  border-radius: 92px;
  height: 6px;
  width: 83%;
  position: relative;
  left: 20px;
  overflow: hidden;
  .upload-bar{
    background-color: #4284F5;
    height: 2px;
    width: 100%;
    content: '';
    border-radius: 92px;
    display: block;
    left: 2px;
    top: 2px;
    position: relative;
  }
}
</style>
