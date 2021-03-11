<template>
  <div class="target-panel">
    <div
      class="panel-header"
      :class="selectTip===10509||selectTip=== 10504 ? 'header-white' : ''"
      @click="showPanelHandler"
      v-if="!selectItem"
    >
      <span v-if="selectTip!==10509&&selectTip!==10504">{{$t('dashboard.select_one_feature_tip')}}</span>
      <span v-if="selectTip===10509">{{$t('dashboard.select_more_tip')}}</span>
      <span v-if="selectTip===10504">{{$t('dashboard.select_one_tip')}}</span>
      <span class="iconfont icon-db_triangle" :class="showList ? 'rotated' : ''"></span>
      <span class="bottom-line" v-if="selectTip===10509||selectTip=== 10504"></span>
    </div>
    <div class="error-tip-panel" v-if="selectTip===10509&&!selectItem">
      <div>
        <span class="iconfont icon-db_alert"></span>
      </div>
      <div>{{$t('dashboard.error_tip')}}</div>
    </div>
    <div class="error-tip-panel" v-if="selectTip===10504&&!selectItem">
      <div>
        <span class="iconfont icon-db_alert"></span>
      </div>
      <div>{{$t('dashboard.unique_error_tip')}}</div>
    </div>
    <div
      v-if="selectItem && select==='CAT'"
      class="panel-header"
      :class="selectItem ? 'panel-active' : ''"
      @click="showPanelHandler"
    >
      <div class="select-cat">
       {{$t('dashboard.select_one')}}{{Object.entries(this.selectItem.targetMapping).length === 1 ? '一' : '二'}}{{$t('dashboard.num_cat')}}
        <span
          class="iconfont icon-db_triangle"
        ></span>
      </div>
      <div class="select-cat-list">
        <div class="mapping-title">{{$t('dashboard.map')}}</div>
        <div class="mapping-panel">
          <div class="mapping-list" v-for="(item, key) in selectItem.targetMapping" :key="key">
            <div class="mapping-up">
              <div>{{key}}</div>
              <model-radio :select="item" :keyName="key" @change="changeMapping"></model-radio>
            </div>
            <div class="mapping-down">
              {{$t('dashboard.freque')}}:
              <span>{{item.times}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="panel-header" @click="showPanelHandler" v-if="selectItem && select==='NUM'">
      <span>{{selectItem.targetFeatureName}}</span>
      <span class="iconfont icon-db_triangle" :class="showList ? 'rotated' : ''"></span>
    </div>
    <div class="panel-list" v-if="showList">
      <feature-header @select="selectClassify" :target="true" @change="changeValue"></feature-header>
      <div class="target-list">
        <div
          class="list-item"
          :title="item.feature_name"
          v-show="item.feature_name.includes(searchValue)"
          v-for="(item, index) in list"
          :key="index"
          :class="setActive(item)"
          @click="selectFeature(item)"
        >{{item.feature_name}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import FeatureHeader from './featureHeader';
import ModelRadio from './modelRadio';
import { mapState } from 'vuex';
import { get, post } from '@/api/server';
export default {
  name: 'TargetPanel',
  components: {
    FeatureHeader,
    ModelRadio
  },
  computed: {
    ...mapState('project', ['projectId'])
  },
  props: {
    targetObj: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data () {
    return {
      showList: false,
      list: [],
      select: 'CAT',
      searchValue: '',
      catArr: [],
      numArr: [],
      selectItem: null,
      selectTip: null,
      selectTargetItem: null
    };
  },
  watch: {
    targetObj: {
      handler (target) {
        if (!target) return;
        this.selectItem = JSON.parse(JSON.stringify(target));
        this.selectTargetItem = target;
        this.select = 'CAT';
        if (target.targetDataType !== 'STRING') {
          this.select = 'NUM';
        }
      },
      deep: true
    }
  },
  mounted () {
  },
  methods: {
    setActive (item) {
      let str = 'cat-item-acitve';
      if (this.select === 'NUM') {
        str = 'num-item-active';
      }
      if (this.selectTargetItem) {
        if (this.selectTargetItem.targetFeatureIdx === item.feature_idx) {
          return str;
        }
      }
      return '';
    },
    changeMapping (val, key) {
      let obj = JSON.parse(JSON.stringify(this.selectItem.targetMapping));
      this.$set(obj, key, val);
      this.modelTargetModify(this.selectItem.targetFeatureIdx, obj);
    },
    selectFeature (item) {
      if (item.selected === 1) {
        this.modifyFeatureSelect(item);
      } else {
        this.modelTargetModify(item.feature_idx);
      }
    },
    showPanelHandler () {
      this.showList = !this.showList;
      if (this.showList) {
        this.selectItem = null;
        this.selectTip = null;
        this.select = 'CAT';
        this.getModelFeature('CAT');
      } else {
        this.$emit('change');
      }
    },
    changeValue (value) {
      this.searchValue = value;
    },
    selectClassify (str) {
      this.select = str;
      this.list = [];
      this.getModelFeature(str);
    },
    async modifyFeatureSelect (item) {
      let param = {
        project_id: this.projectId,
        feature_idx: item.feature_idx,
        selected: 0
      };
      let res = await post('modelSelected', param);
      if (res.code === 0) {
        this.modelTargetModify(item.feature_idx);
      }
    },
    async getModelFeature (type, flag) {
      let param = {
        project_id: this.projectId,
        feature_type: type,
        offset: 0,
        limit: 1000
      };
      if (type === 'NUM' && this.numArr.length > 0) {
        this.list = this.numArr;
      }
      if (type === 'CAT' && this.catArr.length > 0) {
        this.list = this.catArr;
      }
      if (this.list.length > 0) return;
      let res = await get('modelList', param);
      this.list = res.feature_list;
      if (type === 'CAT') {
        this.catArr = JSON.parse(JSON.stringify(res.feature_list));
      } else {
        this.numArr = JSON.parse(JSON.stringify(res.feature_list));
      }
    },
    async modelTargetModify (featureIdx, mapping) {
      let param = {
        project_id: this.projectId,
        target_feature_idx: featureIdx
      };
      if (mapping) {
        param.target_mapping = mapping;
      }
      let res = await post('modifyTarget', param);
      if (res.code === 0) {
        this.showList = false;
        this.$emit('change');
      } else if (res.code === 10509) {
        this.showList = false;
        this.selectTip = res.code;
      } else if (res.code === 10504) {
        this.showList = false;
        this.selectTip = res.code;
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.target-panel {
  position: relative;
  .panel-header {
    border: 1px solid #e1e1e1;
    border-radius: 4px;
    position: relative;
    min-height: 35px;
    line-height: 35px;
    box-sizing: border-box;
    padding: 0px 10px;
    font-size: 14px;
    width: 100%;
    cursor: pointer;
    color: #a4a4a4;
    .iconfont {
      position: absolute;
      color: #a4a4a4;
      right: 10px;
      display: inline-block;
    }
    .rotated {
      transform: rotate(180deg);
    }
    .select-cat {
      color: #424242;
      border-bottom: 1px solid #e1e1e1;
    }
    .select-cat-list {
      display: flex;
      color: #424242;
      background-color: white;
      .mapping-title {
        width: 35px;
      }
      .mapping-panel {
        flex: 1;
        position: relative;
        .mapping-list {
          line-height: 26px;
          border-bottom: 1px solid #e1e1e1;
          &:last-child {
            border-bottom: none;
          }
          .mapping-up {
            display: flex;
            padding: 3px 0px;
          }
          .mapping-down {
            color: #a4a4a4;
            font-size: 14px;
            font-weight: 200;
          }
        }
        .model-radio {
          right: 0px;
          position: absolute;
        }
      }
    }
    .bottom-line {
      border-bottom: 1px solid #dedede;
      display: block;
    }
  }
  .header-white {
    background-color: white;
    border-bottom: none;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }
  .error-tip-panel {
    padding: 10px;
    color: #424242;
    font-size: 14px;
    display: flex;
    border: 1px solid #e1e1e1;
    border-top: none;
    border-radius: 4px;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    background-color: white;
    .icon-db_alert {
      color: #f5282d;
      font-size: 18px;
      display: inline-block;
      margin: 0px 8px 0px 0px;
    }
  }
  .panel-active {
    min-height: 90px;
    background-color: white;
  }
  .panel-list {
    background: white;
    width: 100%;
    height: 400px;
    position: absolute;
    padding: 10px 10px;
    box-sizing: border-box;
    .target-list {
      height: calc(100% - 50px);
      overflow-x: hidden;
      overflow-y: auto;
      > div {
        padding: 5px;
        cursor: pointer;
        @include ellipsis;
        &:hover {
          background: rgba(66, 132, 245, 0.1);
        }
      }
    }
  }
  .cat-item-acitve{
    color: white;
    background-color: #03b98c ;
  }
  .num-item-active{
    color: white;
    background-color: #4284f5;
  }
}
</style>
