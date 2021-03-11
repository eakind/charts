<template>
  <div class="feature-header">
    <div class="classify-btn">
      <button :class="select==='CAT' ? 'btn-cat-active':'' " @click="selectClassify('CAT')">{{$t('dashboard.classification_features')}}</button>
      <button :class="select==='NUM' ? 'btn-int-active' : ''" @click="selectClassify('NUM')">{{$t('dashboard.numerical_features')}}</button>
    </div>
    <div class="search-panel" v-show="!searchFlag">
      <span class="check-label" v-if="!target" @click="allSelectHandler">
        <dc-check :active="allSelect"></dc-check>
        <span class="label-txt">{{$t('dashboard.all_select')}}</span>
      </span>
      <span class="iconfont icon-db_magify" @click="searchFlagHandler"></span>
    </div>
    <div class="search-input" v-show="searchFlag">
      <span
        class="iconfont icon-db_magify"
        @click="searchFlagHandler"
        :style="{pointerEvents: target ? 'none' : 'auto'}"
      ></span>
      <input :placeholder="$t('dashboard.input_tip')" v-model="searchValue" />
    </div>
  </div>
</template>
<script>
import DcCheck from './dcCheck';
export default {
  name: 'FeatureHeader',
  data () {
    return {
      select: 'CAT',
      allSelect: true,
      searchFlag: false,
      searchValue: ''
    };
  },
  props: {
    list: {
      type: Array
    },
    target: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    list: {
      handler (list) {
        this.allSelect = true;
        this.setAll();
      },
      deep: true
    },
    searchValue () {
      this.$emit('change', this.searchValue);
    }
  },
  components: {
    DcCheck
  },
  mounted () {
    if (this.target) {
      this.searchFlag = true;
    }
  },
  methods: {
    selectClassify (val) {
      this.select = val;
      this.searchValue = '';
      this.$emit('select', this.select);
    },
    allSelectHandler () {
      // let flag = true;
      // for (let i = 0; i < this.list.length; i++) {
      //   if (this.list[i].selected === 0) {
      //     flag = false;
      //   }
      // }
      this.allSelect = !this.allSelect;
      // if(!this.allSelect&&flag){
      //   this.allSelect = true
      // }
      this.$emit('selectAll', this.allSelect);
    },
    searchFlagHandler () {
      this.searchValue = '';
      this.searchFlag = !this.searchFlag;
    },
    setAll () {
      for (let i = 0; i < this.list.length; i++) {
        if (!this.list[i].selected) {
          this.allSelect = false;
        }
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.feature-header {
  .classify-btn {
    height: 40px;
    line-height: 40px;
    display: flex;
    > button {
      border: none;
      outline: none;
      flex: 1;
      font-size: 14px;
      cursor: pointer;
      color: #a4a4a4;
      text-align: center;
      position: relative;
    }
    .btn-cat-active {
      color: #424242;
      &::before {
        content: "";
        width: 45px;
        height: 3px;
        border-radius: 4px;
        background: #03b98c;
        display: inline-block;
        position: absolute;
        bottom: 5px;
        left: 50%;
        transform: translate(-50%);
      }
    }
    .btn-int-active {
      color: #424242;
      &::before {
        content: "";
        width: 45px;
        height: 3px;
        border-radius: 4px;
        background: #4284f5;
        display: inline-block;
        position: absolute;
        bottom: 5px;
        left: 50%;
        transform: translate(-50%);
      }
    }
  }
  .search-panel {
    height: 30px;
    line-height: 30px;
    position: relative;
    .check-label {
      cursor: pointer;
      color: #424242;
      font-size: 14px;
      position: relative;
      top: 5px;
      display: inline-block;
      width: 100px;
    }
    .label-txt {
      top: 0px;
      margin-left: 5px;
      position: absolute;
    }
    .iconfont {
      right: 10px;
      top: 5px;
      color: #a4a4a4;
      position: absolute;
    }
  }
  .search-input {
    width: 100%;
    height: 30px;
    position: relative;
    margin-top: 5px;
    border-bottom: 2px solid #424242;
    .iconfont {
      color: #a4a4a4;
      position: relative;
      top: 2px;
      left: 5px;
      display: inline-block;
      width: 20px;
    }
    > input {
      width: calc(100% - 40px);
      height: calc(100% - 1px);
      border: none;
      outline: none;
      padding: 0px 3px;
      margin: 0px;
      position: relative;
      left: 5px;
    }
  }
}
</style>
