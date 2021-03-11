<template>
  <div class="operate-mapping">
    <operate-header
      :item="item"
      :dataType="dataType"
      :transformType="transformType"
      @modify="modify"
    ></operate-header>
    <div class="mapping-body">
      <operate-input :item="item"></operate-input>
      <div class="mapping-rule">
        <span>{{$t('dashboard.map_rule')}}</span>
        <div class="radio-panel">
          <span>{{$t('dashboard.transform_to')}}</span>
          <span class="radio-label" @click="select=index" v-for="(item, index) in  list" :key="index">
            <dc-radio :name="item" :active="select===index"></dc-radio>
          </span>
        </div>
      </div>
      <div class="data-title">
        <div>{{$t('dashboard.origin_data')}}</div>
        <div>{{$t('dashboard.map')}}</div>
      </div>
      <div class="data-list">
        <list-item v-for="(item, index) in dataList" :key="index" :item="item"></list-item>
      </div>
    </div>
  </div>
</template>
<script>
import OperateHeader from './operate/operateHeader';
import OperateInput from './operate/operateInput';
import DcRadio from './operate/dcRadio';
import ListItem from './operate/listItem';
export default {
  components: {
    OperateHeader,
    OperateInput,
    DcRadio,
    ListItem
  },
  data () {
    return {
      transformType: this.$t('dashboard.int_map'),
      list: [this.$t('dashboard.str'), this.$t('dashboard.num')],
      select: 0,
      dataList: []
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
  mounted () {
    for (let i = 0; i < 100; i++) {
      this.dataList.push(i);
    }
  },
  methods: {
    modify () {
      this.$emit('modify');
    }
  }
};
</script>
<style lang='scss' scoped>
.operate-mapping {
  .mapping-body {
    padding: 3px 0px;
    font-size: 14px;
    color: #666666;
    .mapping-rule {
      margin: 10px 0px 5px;
      .radio-panel {
        padding: 3px 0px;
        font-size: 14px;
        color: #424242;
        .radio-label{
            margin: 0px 15px;
        }
      }
    }
    .data-title {
      display: flex;
      margin-bottom: 5px;
      > div {
        flex: 1;
        text-align: center;
      }
    }
    .data-list {
      max-height: 400px;
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
}
</style>
