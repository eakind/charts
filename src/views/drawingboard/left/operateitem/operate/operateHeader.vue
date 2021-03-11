<template>
  <div class="operate-header" :style="{border: !noBorder ? 'none' : ''}">
    <div>
      {{item.feature_name}}
      <span>({{dataType}})</span>
    </div>
    <div>
      <icon-svg icon="#icon-dbc_exchange"></icon-svg>
      <span class="icon-text">{{transformType}}</span>

      <button class="modify-btn" @click="modify">{{$t('dashboard.pre')}}</button>
    </div>
  </div>
</template>
<script>
import IconSvg from '@/components/iconsvg/iconSvg';
export default {
  name: 'OperateHeader',
  props: {
    item: {
      type: Object
    },
    dataType: {
      type: String
    },
    transformType: {
      type: String
    },
    noBorder: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {};
  },
  components: {
    IconSvg
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
.operate-header {
  height: 70px;
  line-height: 30px;
  border-bottom: 1px solid #e1e1e1;
  > div {
    position: relative;
    .icon-svg {
      margin-right: 5px;
    }
    .icon-text {
      color: #4284f5;
    }
  }
  .modify-btn {
    color: white;
    margin: 0px;
    width: 70px;
    height: 26px;
    line-height: 22px;
    font-size: 14px;
    border-radius: 20px;
    cursor: pointer;
    border: 1px solid #4284f5;
    background-color: #4284f5;
    position: absolute;
    right: 10px;
    outline: none;
  }
}
</style>
