<template>
  <div class="operate-interval">
    <operate-header
      :item="item"
      :dataType="dataType"
      :transformType="transformType"
      @modify="modify"
    ></operate-header>
    <div class="interval-body">
      <operate-input :item="item"></operate-input>
      <div class="interval-title">{{$t('dashboard.cut_section')}}</div>
      <span>{{$t('dashboard.cut_same')}}</span>
      <input v-model="num" />
      <span>{{$t('dashboard.part')}}</span>
    </div>
  </div>
</template>
<script>
import OperateHeader from './operate/operateHeader';
import OperateInput from './operate/operateInput';
export default {
  data () {
    return {
      transformType: this.$t('dashboard.section'),
      num: ''
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
  watch: {
    num () {
      this.$emit('change', this.num);
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
.operate-interval {
  height: 250px;
  .interval-body {
    font-size: 14px;
    color: #666666;
    margin: 0px 0px 10px;
    padding: 15px 0px;
    .interval-title{
      padding: 0px 0px 5px;
    }
    > input {
      width: 35px;
      height: 22px;
      padding: 0px;
      margin: 0px 10px;
      border: 1px solid #979797;
      border-radius: 4px;
      outline: none;
      text-align: center;
      color: #424242;
    }
  }
}
</style>
