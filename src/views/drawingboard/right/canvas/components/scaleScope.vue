<template>
  <div class="scale-scope-box">
    <dc-alert class="scale-scope">
      <div class="dc-alert-header">
        <span class="title">刻度范围与数量</span>
        <span class="iconfont icon-db_plus" @click="closeHandler"></span>
      </div>
      <div class="dc-alert-body">
        <div class="reset">
          <span class="reset-tip">请选择刻度显示方式</span>
          <span class="reset-btn" @click="resetHandler">恢复默认</span>
        </div>
        <scope-item v-for="(scopeItem, index) in selectList" :key="index" :index="index"  :item="scopeItem" :curSelect="curSelectItem"
                    @click.native="selectScopeItem(scopeItem, index)" @change="changeScope"></scope-item>
      </div>
      <div class="dc-alert-footer">
        <span class="confirm-btn" @click="confirmHandler">确定</span>
        <span class="cancel-btn" @click="closeHandler">取消</span>
      </div>
    </dc-alert>
  </div>
</template>
<script>
import DcAlert from '@/components/dcalert/dcAlert.vue';
import ScopeItem from './scaleScope/scopeItem.vue';
import { mapState } from 'vuex';
export default {
  data () {
    return {
      scopes: ['默认', '图表上选择(在图表上缩放滚动查看)', '完全对齐(刻度数量与范围保持一致)', '手工指定'],
      scopeList: [],
      outList: [],
      curSelectItem: {}
    };
  },
  computed: {
    ...mapState('drawingboard', ['canvasType']),
    selectList () {
      let list = this.canvasType === 'scatter' ? ['默认', '图表上选择(在图表上缩放滚动查看)', '手工指定'] : this.scopes;
      let obj = {
        默认: 0,
        '图表上选择(在图表上缩放滚动查看)': 1,
        手工指定: 3
      };
      if (this.canvasType !== 'scatter') {
        obj['完全对齐(刻度数量与范围保持一致)'] = 2;
      }
      return list.map(item => ({ id: obj[item], name: item }));
    }
  },
  props: {
    selectItem: {
      type: Object
    }
  },
  watch: {
    selectItem: {
      handler (val) {
        if (!val) return;
        this.curSelectItem = JSON.parse(JSON.stringify(val));
        // this.outList = JSON.parse(JSON.stringify(list));
      },
      immediate: true
    }
  },
  components: {
    DcAlert,
    ScopeItem
  },
  mounted () {
  },
  methods: {
    resetHandler () {
      this.curSelectItem = JSON.parse(JSON.stringify(this.selectItem));
      // for (let i = 0; i < this.scopeList.length; i++) {
      //   this.$set(this.scopeList[i], 'select', 0);
      //   this.$set(this.outList[i], 'select', 0);
      //   this.$set(this.scopeList[i], 'align', true);
      //   this.$set(this.outList[i], 'align', true);
      //   this.$set(this.scopeList[i], 'tick_counts', '');
      //   this.$set(this.outList[i], 'tick_counts', '');
      //   this.$set(this.scopeList[i], 'tick_range', []);
      //   this.$set(this.outList[i], 'tick_range', []);
      // }
    },
    closeHandler () {
      this.$emit('close');
    },
    confirmHandler () {
      this.$emit('change', this.curSelectItem);
    },
    selectScopeItem (item) {
      // for (let i = 0; i < this.scopeList.length; i++) {
      //   this.$set(this.scopeList[i], 'select', item.id);
      //   this.$set(this.outList[i], 'select', item.id);
      // }
      this.curSelectItem.select = item.id;
    },
    changeScope (item) {
      this.curSelectItem = item;
    }
  }
};
</script>
<style lang='scss' scoped>
.scale-scope-box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.6);
  z-index: 5;
}
.scale-scope{
  width: 560px;
  height: 626px;
  box-sizing: border-box;
  background: #fff;
  .dc-alert-header{
    text-align: left;
    padding: 16px;
    position: relative;
  }
  .title {
    color: #424242;
    font-size: 14px;
    font-weight: 600;
  }
  .icon-db_plus{
    color: #a4a4a4;
    right: 10px;
    cursor: pointer;
    display: inline-block;
    transform: rotate(45deg);
    position: absolute;
  }
  .reset{
    padding: 0px;
    display: flex;
    position: relative;
  }
  .reset-tip{
    font-size: 14px;
    flex:1;
    color: #a4a4a4;
  }
  .reset-btn {
    font-size: 14px;
    cursor: pointer;
    text-decoration: underline;
    color: #4284f5;
  }
  .confirm-btn{
    font-size: 16px;
    color: #4284F5;
    margin: 0px 40px;
    font-weight: bold;
    cursor: pointer;
  }
  .cancel-btn{
    font-size: 16px;
    color: #a4a4a4;
    margin: 0px 40px;
    cursor: pointer;
  }
  .dc-alert-body{
    padding: 0 16px;
  }
  .dc-alert-footer{
    padding: 0px 10px;
  }
}
</style>
