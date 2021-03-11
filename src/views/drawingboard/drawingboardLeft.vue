<template>
  <div class="drawingboard-left" :class="openLeft">
    <div class="left-title">
      <span class="text">{{$t('dashboard.data')}}</span>
      <span class="circle"
            @click="openHandler"
            v-show="selectIndex !== 2">
        <span class="iconfont icon-db_download"
              :class="openStatus !==1 ? '' : 'rotate'"></span>
      </span>
    </div>
    <tabbar @change="changeTabbar"
            :select="selectIndex"></tabbar>
    <transition name="fade" mode="out-in">
      <component :is="tabList[selectIndex]"></component>
    </transition>
    <div class="left-popups"
         v-show="showPopup">
      <div class="popup filter"
           v-if="modelFilterShow">
        <feature-filter></feature-filter>
      </div>
      <div class="popup result"
           v-if="modelResultShow">
        <model-view v-bind="model"
                    @exportData="exportModelData"
                    @saveChart="saveModelChart"></model-view>
      </div>
    </div>
  </div>
</template>
<script>
import Tabbar from './left/tabbar';
import FeatureList from './left/feature/featureList';
import ModelPanel from './left/model/modelPanel';
import FilterPanel from './left/filter/filterPanel';
import FeatureFilter from './left/model/featureFilter';
import ModelView from './left/model/modelView.vue';
import { AIModel } from '@/mixins/AIModel';
import { mapState, mapMutations } from 'vuex';
import { get } from '@/api/server';
export default {
  components: {
    Tabbar,
    FeatureList,
    ModelPanel,
    FilterPanel,
    FeatureFilter,
    ModelView,
  },
  data () {
    return {
      selectIndex: 0,
      tabList: ['FeatureList', 'FilterPanel', 'ModelPanel']
    };
  },
  computed: {
    ...mapState('project', ['projectId']),
    ...mapState('drawingboard', ['openStatus']),
    ...mapState('drawingboard', ['openStatus', 'modelFilterShow', 'modelResultShow']),
    showPopup () {
      return this.modelFilterShow || this.modelResultShow;
    },
    openLeft () {
      return this.openStatus === 1 ? 'open-left' : '';
    }
  },
  mixins: [AIModel],
  destroyed () { },
  mounted () {
    this.getModelStatus();
  },
  methods: {
    ...mapMutations('drawingboard', [
      'setOpenStatus',
      'setFilterList',
      'setModelFilterShow',
      'setModelResultShow',
      'setModelStatus'
    ]),
    openHandler () {
      if (this.openStatus === 1) {
        this.setOpenStatus(0);
      } else {
        this.setOpenStatus(1);
      }
    },
    changeFilter () {
      this.$emit('changeFilter');
    },
    changeTabbar (index) {
      this.selectIndex = index;
      if (index === 2) {
        this.setOpenStatus(0);
      } else {
        this.setModelFilterShow(false);
        this.setModelResultShow(false);
      }
    },
    async getModelStatus () {
      let param = {
        project_id: this.projectId
      };
      let res = await get('modelStatus', param);
      if (res.code === 0) {
        this.setModelStatus(res.status);
      } else {
        this.setModelStatus('');
      }
    },
  }
};
</script>
<style lang='scss' scoped>
.drawingboard-left {
  flex-shrink: 0;
  position: relative;
  width: 260px;
  height: 100%;
  border-radius: 6px;
  background-color: #fbfcff;
  transition: width 160ms linear;
  .left-title {
    display: flex;
    height: 32px;
    padding: 8px;
    align-items: center;
    box-sizing: border-box;
    background-color: #FBFCFF;
    box-shadow: 0px 2px 4px rgba(66, 66, 66, 0.2);
    border-radius: 4px 4px 0px 0px;
    margin-bottom: 4px;
    .text{
      flex: 1;
      font-size: 14px;
      color: #424242;
    }
    .circle {
      width: 16px;
      .icon-db_download {
        color: #A4A4A4;
        cursor: pointer;
        transform: rotate(-90deg);
        display: inline-block;
      }
      .rotate {
        transform: rotate(90deg);
      }
    }
  }
  .feature-filter {
    width: 100%;
    padding: 10px 20px 10px 15px;
    box-sizing: border-box;
  }
  .show-filter-group {
    height: calc(50% - 120px) !important;
    transition: height 120ms linear;
  }
  .hide-filter-group {
    transition: height 120ms linear;
  }
  .show-filter {
    height: 210px !important;
    transition: height 120ms linear;
  }
  .hide-filter {
    transition: height 120ms linear;
  }
}

.left-popups {
  width: 800px;
  width: calc(100vw - 260px);
  height: 100%;
  position: absolute;
  top: 0;
  left: 100%;
  z-index: 100000;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  .popup {
    height: calc(100% - 110px);
    margin-left: 5px;
    margin-top: 110px;
    border-radius: 5px;
  }
  .filter {
    width: 278px;
  }
  .result {
    box-sizing: border-box;
    width: calc(100% - 278px - 20px);
  }
}
.open-left{
  width: 360px;
  transition: width 160ms linear;
}
</style>
