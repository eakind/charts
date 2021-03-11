<template>
  <div class="dc-radio" :class="active ? 'radio-active': ''">
    <span>{{name}}</span>
  </div>
</template>
<script>
export default {
  name: 'DcRadio',
  props: {
    name: {
      type: String
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {};
  },
  components: {},
  mounted () {},
  methods: {}
};
</script>
<style lang='scss' scoped>
.dc-radio {
  position: relative;
  display: inline-block;
  &::before {
    content: "";
    width: 10px;
    height: 10px;
    border-radius: 50px;
    display: inline-block;
    margin: 0px 3px;
    top: 3px;
    position: relative;
    border: 2px solid #a4a4a4;
  }
}
.radio-active {
  position: relative;
  &::before {
    width: 8px;
    height: 8px;
    border: 4px solid #4284f5;
  }
}
</style>
