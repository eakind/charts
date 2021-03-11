<template>
   <div class="canvas-checked">
    <span class="title">{{title}}</span>
    <span class="checked">
      <dc-checked :active="active"></dc-checked>
      <span class="txt">显示</span>
    </span>
  </div>
</template>
<script>
import DcChecked from '@/components/dcchecked/dcChecked.vue';
export default {
  data () {
    return {
    };
  },
  props: {
    active: {
      type: Boolean,
      default () {
        return false;
      }
    },
    title: {
      type: String,
      default () {
        return '';
      }
    }
  },
  components: {
    DcChecked
  },
  mounted () {
  },
  methods: {
  }
};
</script>
<style lang='scss' scoped>
.canvas-checked{
  display: flex;
  cursor: pointer;
  align-items: center;
  .title {
    flex: 1;
    color: #4284f5;
  }
  .checked {
    width: 60px;
    top: 3px;
    position: relative;
  }
  .txt{
    top: -2px;
    font-size: 14px;
    margin-left: 5px;
    position: absolute;
  }
}
</style>
