<template>
  <div class="operate-str">
    <operate-header
      :item="item"
      :dataType="dataType"
      :transformType="transformType"
      @modify="modify"
    ></operate-header>
    <div class="str-panel">
      <operate-input :item="item"></operate-input>
    </div>
  </div>
</template>
<script>
import OperateHeader from './operate/operateHeader';
import OperateInput from './operate/operateInput';
export default {
  name: 'OperateStr',
  data () {
    return {
      transformType: this.$t('dashboard.string')
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
.operate-str {
  box-sizing: border-box;
  .str-panel {
    height: 180px;
    padding: 10px 0px;
  }
}
</style>
