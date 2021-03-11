<template>
  <div class="dc-radio" :class="isActive">
  </div>
</template>
<script>
export default {
  data () {
    return {
    };
  },
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isActive () {
      return this.active ? 'radio-active' : '';
    }
  },
  components: {
  },
  mounted () {
  },
  methods: {
  }
};
</script>
<style lang='scss' scoped>
.dc-radio {
  height: 14px;
  width: 14px;
  border-radius: 50px;
  box-sizing: border-box;
  display: inline-block;
  border: 2px solid #a4a4a4;
}
.radio-active{
  border: 4px solid #4284f5;
}
</style>
