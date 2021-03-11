<template>
  <div class="operate-float">
    <operate-header
      :item="item"
      :dataType="dataType"
      :transformType="transformType"
      @modify="modify"
    ></operate-header>
    <div class="float-panel">
      <operate-input :item="item"></operate-input>
    </div>
  </div>
</template>
<script>
import OperateHeader from './operate/operateHeader';
import OperateInput from './operate/operateInput';
export default {
  data () {
    return {
      transformType: this.$t('dashboard.float')
    };
  },
  props: {
    item: {
      type: Object
    },
    dataType: {
      type: String
    }
  },
  components: {
    OperateHeader,
    OperateInput
  },
  mounted () {},
  methods: {
    modify () {
      this.$emit('modify');
    }
  }
};
</script>
<style lang='scss' scoped>
.operate-float {
  box-sizing: border-box;
  .float-panel {
    height: 180px;
    padding: 10px 0px;
  }
}
</style>
