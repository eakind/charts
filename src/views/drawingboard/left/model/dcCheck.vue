<template>
  <div class="dc-check" :class="active ? 'checked-active' : ''"></div>
</template>
<script>
export default {
  name: 'DcCheck',
  data () {
    return {};
  },
  props: {
    active: {
      type: Boolean
    }
  },
  components: {},
  mounted () {},
  methods: {}
};
</script>
<style lang='scss' scoped>
.dc-check {
  display: inline-block;
  height: 16px;
  width: 16px;
  cursor: pointer;
  border: 1px solid #dedede;
  border-radius: 3px;
}
.dc-check.checked-active {
  position: relative;
  border: 1px solid #4284f5;
  background-color:#4284f5;
  &::before {
    content: "";
    width: 10px;
    height: 5px;
    border-top: 2px solid white;
    border-right: 2px solid white;
    border-radius: 0px 2px 0px 0px;
    display: inline-block;
    position: absolute;
    top: 1.5px;
    left: 1.5px;;
    transform: rotate(135deg);
  }
}
</style>
