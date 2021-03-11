<template>
  <div class="operate-int">
    <operate-header
      :item="item"
      :dataType="dataType"
      :transformType="transformType"
      @modify="modify"
    ></operate-header>
    <div class="int-panel">
      <operate-input :item="item"></operate-input>
    </div>
  </div>
</template>
<script>
import OperateHeader from './operate/operateHeader';
import OperateInput from './operate/operateInput';
export default {
  name: 'OperateInt',
  data () {
    return {
      transformType: this.$t('dashboard.int')
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
.operate-int {
  box-sizing: border-box;
  .int-panel {
    height: 180px;
    padding: 10px 0px;
  }
}
</style>
