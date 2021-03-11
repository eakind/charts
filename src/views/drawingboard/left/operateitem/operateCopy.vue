<template>
  <div class="operate-copy">
    <operate-header
      :item="item"
      :dataType="dataType"
      :transformType="transformType"
      @modify="modify"
    ></operate-header>
    <operate-input :item="item"></operate-input>
  </div>
</template>
<script>
import OperateHeader from './operate/operateHeader';
import OperateInput from './operate/operateInput';
export default {
  data () {
    return {
      transformType: this.$t('dashboard.copy_feature')
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
.operate-copy {
  height: 220px;
}
</style>
