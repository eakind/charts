<template>
<!-- data-symbol 标记 -->
  <div class="classify-feature" property="cat" data-property="CAT"  :group-name="item.feature_name" v-if="!item.hide">
    <div class="classify-group" data-symbol="combineFeature" v-show="item.data_type === 'GROUP'" :index="index" :group-name="item.feature_name">
      <div class="group-header" data-symbol="combineFeature" :group-name="item.feature_name">
        <span class="iconfont icon-db_group" :group-name="item.feature_name"></span>
        <span class="group-title" data-symbol="combineFeature" :group-name="item.feature_name">{{item.feature_name}}</span>
        <span
          :group-name="item.feature_name"
          class="iconfont icon-db_triangle"
          :class="showGroup ? 'rotated':''"
          @click.stop="operateGroup"
        ></span>
      </div>
      <div class="group-body" :group-name="item.feature_name">
        <classify
          class="group-feature"
          v-for="(childItem, childIndex) in item.groups"
          data-property="CAT"
          property="cat"
          :key="childIndex"
          :type="childItem.data_type"
          :index="index"
          :childIndex="childIndex"
          :name="childItem.feature_name"
          :value="childItem.feature_name"
          :group-name="item.feature_name"
          :idx="childItem.feature_idx"
          @show="showGroupListHandler"
          :hide="hide"
          :selectIndex="selectIndex"
          :selectChildIndex="selectChildIndex"
          :formulaType="item.formula_type"
        ></classify>
      </div>
      <div class="feature-group" v-show="showGroup" v-click-out="hideHandler">
        <!-- <div>修改分组名称</div> -->
        <div @click="dismissGroup">{{$t('dashboard.cancel_group')}}</div>
      </div>
    </div>
    <classify
      v-show="item.data_type !== 'GROUP'"
      :type="item.data_type"
      property="cat"
      :index="index"
      :name="item.feature_name"
      :value="item.feature_name"
      :idx="item.feature_idx"
      :formulaType="item.formula_type"
      @show="showListHandler"
      :hide="hide"
      :selectIndex="selectIndex"
    ></classify>
  </div>
</template>
<script>
import Classify from './classify';
export default {
  data () {
    return {
      showGroup: false,
      timer: null
    };
  },
  components: {
    Classify
  },
  props: {
    item: {
      type: Object
    },
    index: {
      type: Number
    },
    hide: {
      type: Object
    },
    selectIndex: {
      type: [Object, Number]
    },
    selectChildIndex: {
      type: [Object, Number]
    }
  },
  watch: {
    hide: {
      handler (obj) {
        if (!obj) {
          setTimeout(() => {
            this.showGroup = false;
          }, 0);
        } else {
          if (obj.feature_name !== this.item.feature_name) {
            setTimeout(() => {
              this.showGroup = false;
            }, 0);
          }
        }
      }
    }
  },
  methods: {
    hideHandler () {
      this.showGroup = false;
    },
    operateGroup () {
      this.showGroup = !this.showGroup;
      this.$emit('show', null, 'group');
    },
    showListHandler (showList, type, index, target, childIndex) {
      this.$emit('show', showList, type, index, target, childIndex, 'classify');
    },
    showGroupListHandler (showList, type, index, target, childIndex) {
      this.$emit('show', showList, type, index, target, childIndex, 'group');
    },
    dismissGroup () {
      this.$showMessageBox({
        title: this.$t('dashboard.cancel_group'),
        confirmText: this.$t('dashboard.confirm'),
        cancelText: this.$t('dashboard.cancel'),
        contentHtml: this.$t('dashboard.cancel_group_tip'),
        cb: () => {
          this.$emit('dismissGroup', this.item.feature_idx);
          this.$closeMessageBox();
        }
      });
    }
  }
};
</script>
<style lang='scss' scoped>
.classify-feature {
  color: #424242;
  text-align: left;
  font-size: 16px;
  user-select: none;
  min-height: 30px;
  margin: 3px 0px;
  width: 100%;
  .classify-group {
    position: relative;
    width: 100%;
    .feature-group {
      background-color: white;
      z-index: 999;
      border-radius: 4px;
      border: 1px solid #e1e1e1;
      width: calc(100% - 20px);
      left: 12px;
      top: 30px;
      position: absolute;
      > div {
        font-size: 14px;
        cursor: pointer;
        padding: 6px 10px;
        &:hover {
          background: rgba(66, 132, 245, 0.2);
        }
      }
    }
  }
  .group-header {
    padding: 5px 0px;
    width: 100%;
    position: relative;
    .group-title{
      width: calc(100% - 50px);
      display: inline-block;
      @include ellipsis;
      left: 20px;
      position: relative;
    }
    .icon-db_group {
      font-size: 16px;
      font-weight: 100;
      left: 10px;
      top: -4px;
      color: #a4a4a4;
      cursor: pointer;
      position: relative;
    }
    .icon-db_triangle {
      right: 14px;
      font-size: 18px;
      cursor: pointer;
      display: inline-block;
      color: #a4a4a4;
      position: absolute;
    }
    .rotated {
      transform: rotate(180deg);
    }
  }
  .group-body {
    .group-feature {
      height: 25px !important;
      line-height: 25px !important;
      font-size: 14px;
      width: 185px !important;
      margin-left: 25px !important;
    }
  }
}
</style>
