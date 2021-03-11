<template>
  <dc-alert class="colors-template">
    <div class="dc-alert-header">
      <span>套用色板</span>
      <span class="iconfont icon-db_plus" @click="closeHandler"></span>
    </div>
    <div class="dc-alert-body">
      <feature-list></feature-list>
      <template-list></template-list>
    </div>
    <div class="dc-alert-footer">
      <span class="confirm-btn">确定</span>
      <span class="cancel-btn" @click="closeHandler">取消</span>
    </div>
  </dc-alert>
</template>
<script>
import DcAlert from '@/components/dcalert/dcAlert.vue';
import FeatureList from './colorsTemplate/featureList.vue';
import TemplateList from './colorsTemplate/templateList.vue';
export default {
  data () {
    return {
    };
  },
  components: {
    DcAlert,
    FeatureList,
    TemplateList
  },
  mounted () {
  },
  methods: {
    closeHandler () {
      this.$emit('close');
    }
  }
};
</script>
<style lang='scss' scoped>
.colors-template{
  width: 600px;
  height: 700px;
  box-sizing: border-box;
  background-color: white;
  .dc-alert-header {
    text-align: left;
    font-size: 16px;
    color: #424242;
    position: relative;
  }
  .icon-db_plus{
    color: #a4a4a4;
    cursor: pointer;
    font-size: 20px;
    transform: rotate(45deg);
    display: inline-block;
    position: absolute;
    right: 10px;
  }
  .dc-alert-body{
    display: flex;
    height: 600px;
    padding: 0px 15px;
    > div {
      flex: 1;
      margin: 0px 10px;
    }
  }
  .dc-alert-footer{
    font-size: 16px;
  }
  .confirm-btn {
    cursor: pointer;
    margin: 0px 20px;
    color: #4284f5;
  }
  .cancel-btn {
    cursor: pointer;
    color: #666666;
    margin: 0px 20px;
  }
}
</style>
