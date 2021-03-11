<template>
  <div class="operate-input">
    <span class="panel-tip">{{$t('dashboard.new_feature_name')}}</span>
    <input class="panel-input" v-model="featureName" />
  </div>
</template>
<script>
export default {
  data () {
    return {
      featureName: ''
    };
  },
  props: {
    item: {
      type: Object
    }
  },
  components: {},
  mounted () {
    this.featureName = this.item.feature_name;
  },
  methods: {}
};
</script>
<style lang='scss' scoped>
.operate-input {
  margin: 5px 0px 10px;
  .panel-tip {
    font-size: 12px;
    color: #666666;
  }
  .panel-input {
    height: 30px;
    width: 260px;
    line-height: 30px;
    padding: 0px 3px;
    margin: 3px 0px;
    outline: none;
    background-color: white;
    border: 1px solid #dedede;
    border-radius: 4px;
    display: block;
    pointer-events: none;
  }
}
</style>
