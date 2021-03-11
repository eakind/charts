<template>
  <div class="interaction-box">
    <div class="hearder-title">使用联动交互，创建展板内各画布间的交互展示。</div>
      <div class="btn-group">
        <div class="btn-box" @click="selectFlag=true">添加交互<span class="iconfont icon-db_arrow arrow-style"></span></div>
        <div class="btn-box" v-if="tableList.length>0" @click="clearHandler">清除所有<span class="iconfont icon-db_plus close-style"></span></div>
        <div class="select-box" v-if="selectFlag" v-click-out="hideHandler">
          <div class="list" v-for="(item, idx) in selectList" :key="idx" @click="selectHandler(idx)">
            <div>{{ item }}</div>
          </div>
        </div>
      </div>
      <div class="operate-box">
        <div class="operate-tip">选择一行交互方式后，点击“编辑”以进入详细设置。</div>
        <div class="operate-btns" v-if="btnFlag">
          <div class="btn-style" @click="editHandler(currentList)">编辑<span class="iconfont icon-db_edit"></span></div>
          <div class="btn-style edit-btn" @click="removeHandler(currentList)">删除<span class="iconfont icon-db_trash"></span></div>
        </div>
      </div>
      <div class="table-box">
        <div class="table-header">
          <div class="name">类型/名称</div>
          <div class="origin">源</div>
          <div class="target">目标</div>
          <div class="origin-data">源字段</div>
          <div class="target-data">目标字段</div>
        </div>
        <template v-if="tableList.length>0">
          <div class="table-row" :class="currentIndex===index ? 'isSelect' : ''" v-for="(list, index) in tableList" :key="index" @click="selectRow(list, index)">
            <div class="name">画布联动</div>
            <div class="origin">{{ list.originTitle }}</div>
            <div class="target">{{ list.targetTitle }}</div>
            <div class="origin-data">{{ getOriginStr(list.actions) }}</div>
            <div class="target-data">{{ getTargetStr(list.actions) }}</div>
          </div>
        </template>
        <div class="table-body" v-else>未添加</div>
      </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  data () {
    return {
      selectFlag: false,
      selectList: ['画布联动（逐个）', '画布联动（批量）'],
      currentIndex: null,
      currentList: null,
      btnFlag: false
    };
  },
  props: {
    tableList: {
      type: Array
    }
  },
  watch: {
    tableList: {
      handler (list) {
        this.currentIndex = null;
        this.btnFlag = false;
      },
      deep: true
    }
  },
  computed: {
    ...mapState('drawingboard', ['catList'])
  },
  mounted () {

  },
  methods: {
    getOriginStr (arr) {
      let originStr = '';
      for (let i in arr) {
        originStr = originStr + this.getFeatureName(arr[i].origin_feature_idx) + ',';
      }
      return originStr.replace(/,$/gi, '');
    },
    getTargetStr (arr) {
      let targetStr = '';
      for (let i in arr) {
        targetStr = targetStr + this.getFeatureName(arr[i].target_feature_idx) + ',';
      }
      return targetStr.replace(/,$/gi, '');
    },
    getFeatureName (featureIdx) {
      let featureName = '';
      for (let i = 0; i < this.catList.length; i++) {
        if (this.catList[i].groups) {
          for (let j = 0; j < this.catList[i].groups.length; j++) {
            if (featureIdx === this.catList[i].groups[j].feature_idx) {
              featureName = this.catList[i].groups[j].feature_name;
            }
          }
        } else {
          if (featureIdx === this.catList[i].feature_idx) {
            featureName = this.catList[i].feature_name;
          }
        }
      }
      return featureName;
    },
    removeHandler (item) {
      this.$emit('on-remove', item);
    },
    editHandler (item) {
      this.$emit('on-edit', item);
    },
    hideHandler () {
      this.selectFlag = false;
    },
    clearHandler () {
      this.$emit('deleteClick');
    },
    selectHandler (index) {
      this.$emit('on-select', index);
      this.selectFlag = false;
    },
    selectRow (list, index) {
      this.currentIndex = index;
      this.currentList = list;
      this.btnFlag = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.interaction-box {
  .hearder-title {
    color: #A4A4A4;
    font-size: 12px;
  }
  .btn-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 5px;
    padding-bottom: 8px;
    border-bottom: 1px solid #E1E1E1;
    position: relative;
  }
  .select-box {
    height: 70px;
    width: 160px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0px 2px 4px rgba(66, 66, 66, 0.2);
    position: absolute;
    top: 0;
    left: 98px;
    .list {
      padding: 0 8px;
      line-height: 32px;
      box-sizing: border-box;
      cursor: pointer;
      &:hover {
        background: #F5F9FE;
      }
      >div {
        border-bottom: 1px solid #E1E1E1;
      }
    }
  }
  .btn-box {
    height: 24px;
    width: 96px;
    line-height: 24px;
    border: 1px solid #DEDEDE;
    border-radius: 4px;
    font-size: 12px;
    color: #666666;
    display: flex;
    justify-content: space-around;
    align-items: center;
    cursor: pointer;
    .arrow-style {
      color: #4284F5;
      font-size: 12px;
    }
    .close-style {
      transform: rotate(45deg);
      color: #A4A4A4;
      font-size: 14px;
    }
  }
  .operate-box {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .operate-tip {
      color: #A4A4A4;
      font-size: 12px;
    }
    .operate-btns {
      display: flex;
      align-items: center;
      .btn-style {
        height: 24px;
        line-height: 24px;
        width: 56px;
        border-radius: 4px;
        background: #4284F5;
        color: #fff;
        font-size: 12px;
        text-align: center;
        cursor: pointer;
        >span {
          margin-left: 3px;
          font-size: 12px;
        }
      }
      .edit-btn {
        background: #A4A4A4;
        margin-left: 16px;
      }
    }
  }
  .table-box {
    height: 340px;
    width: 100%;
    border: 1px solid #DEDEDE;
    border-radius: 4px;
    overflow-y: auto;
    .table-header {
      height: 32px;
      display: flex;
      align-items: center;
      text-align: center;
      background: #F9F9F9;
      font-size: 12px;
      color: #424242;
      border-radius: 4px 4px 0px 0px;
    }
    .table-body {
      height: calc(100% - 32px);
      color: #A4A4A4;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .table-row {
      display: flex;
      height: 35px;
      align-items: center;
      text-align: center;
      font-size: 12px;
      border-bottom: 1px solid #E1E1E1;
      cursor: pointer;
      &:last-child {
        border-bottom: none;
      }
      &:hover {
        border-top: 1px solid #4284F5;
        border-bottom: 1px solid #4284F5;
      }
      > div {
        @include ellipsis;
      }
    }
    .isSelect {
      background: #4284F5;
      color: #fff;
      border-bottom: none;
    }
    .name {
        width: 88px;
      }
      .origin {
        width: 95px;
      }
      .target {
        width: 200px;
      }
      .origin-data {
        width: 200px;
      }
      .target-data {
        flex: 1;
      }
  }
}
</style>
