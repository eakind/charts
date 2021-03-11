<template>
  <div class="scope-item" :class="isScopeActive">
    <div class="no-scope" v-if="item.id !== 3">
      <dc-radio :active="curSelectScope.select === item.id"></dc-radio>
      <span class="text">{{item.name}}</span>
      <span class="" v-if="(item.id === 1 || item.id === 0) && isHideCheck" @click="changeAlign">
        <dc-checked class="checked" :active="isAlign" ></dc-checked>
        <span>原点对齐</span>
      </span>
    </div>
    <div class="has-scope" v-else>
      <div class="has-scope-header">
        <dc-radio class="radio" :active="curSelectScope.select === item.id"></dc-radio>
        <span class="text">{{item.name}}</span>
      </div>
      <div class="has-scope-title">
        <span class="axis">Y轴</span>
        <span class="scope">数值范围</span>
        <span class="num">数量</span>
      </div>
      <div class="has-scope-body">
        <scope-num  :item="curSelectScope"   @change="changeScope"></scope-num>
      </div>
    </div>
  </div>
</template>
<script>
import DcRadio from '@/components/dcradio/dcRadio.vue';
import DcChecked from '@/components/dcchecked/dcChecked.vue';
import ScopeNum from './scopeNum.vue';
import { mapState } from 'vuex';
export default {
  data () {
    return {
      scopeList: [],
      isAlign: true,
      curSelectScope: {}
    };
  },
  props: {
    item: {
      type: Object
    },
    index: {
      type: Number
    },
    curSelect: {
      type: Object
    }
  },
  computed: {
    ...mapState('drawingboard', ['canvasType']),
    isScopeActive () {
      let select = this.curSelectScope.select;
      return select === this.item.id ? 'scope-active' : '';
    },
    isHideCheck () {
      return this.canvasType !== 'scatter';
    }
  },
  watch: {
    curSelect: {
      handler (val) {
        this.curSelectScope = JSON.parse(JSON.stringify(val));
        this.isAlign = val.align;
      },
      immediate: true,
      deep: true
    }
  },
  components: {
    DcRadio,
    DcChecked,
    ScopeNum
  },
  mounted () {
  },
  methods: {
    changeScope (item) {
      this.curSelectScope = item;
      this.$emit('change', this.curSelectScope);
    },
    changeAlign () {
      this.isAlign = !this.isAlign;
      for (let i = 0; i < this.scopeList.length; i++) {
        this.$set(this.scopeList[i], 'align', this.isAlign);
      }
      this.$emit('change', this.scopeList);
    }
  }
};
</script>
<style lang='scss' scoped>
.scope-item{
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid #e7ebf2;
  background-color: #e7ebf2;
  min-height: 40px;
  margin: 10px 0px;
}
.no-scope{
  display: flex;
  height: 40px;
  line-height: 40px;
  align-items: center;
  box-sizing: border-box;
  padding: 0px 10px;
  font-size: 14px;
}
.checked{
  top: 3px;
  margin: 0px 3px;
}
.text{
  flex: 1;
  color: #424242;
  font-weight: 300;
  margin: 0px 10px;
}
.scope-active{
  border: 1px solid #4284f5;
  background: #fff;
}
.has-scope{
  padding: 10px;
  box-sizing: border-box;
  overflow-y: auto;
}
.has-scope-header{
  display: flex;
  align-items: center;
}
.has-scope-title{
  display: flex;
  height: 30px;
  font-size: 14px;
  color: #a4a4a4;
  align-items: center;
  .axis{
    width: 200px;
    padding: 0px 10px;
    box-sizing: border-box;
  }
  .scope{
    color: #666666;
    text-align: center;
    width: 400px;
  }
  .num{
    color: #666666;
    text-align: center;
    width: 200px;
  }
}
.has-scope-body{
  height: 250px;
}

</style>
