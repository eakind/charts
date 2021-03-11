<template>
  <div class="compare">
    <div class="left">
      <span class="text">{{$t('message.compare')}}</span>
      <span class="line"></span>
    </div>
    <div class="right">
      <span
        class="compare-tip"
        v-if="featureList.length < 1"
      >{{$t('message.drop_features')}}</span>
      <div class="compare-dragula">
        <dc-capsule
          v-for="(item, index) in featureList"
          :key="index"
          :index="index"
          :item="item"
          :hide-add="false"
          :list="catList"
          :drill-arr="judgeDrill(item)"
          panel-type="compare"
          @changeselect="changeSelect"
          @change="changeFeature"
          @remove="dragRemove"
          @sort="sortHandler(item, index)"
          @capsulesmall="clickRemove"
        ></dc-capsule>
        <cmp-groups v-if="activeFeature.type === 'cat'" :feature-item="activeFeature" v-model="cmpGroups" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import DcCapsule from '@/components/dccapsule/DcCapsule';
import CmpGroups from './funnelCmpGroups';
import { getParam } from '@/mixins/dashboard/getParam';
import { operate } from '@/mixins/dashboard/operate';
import { delayFunc } from '@/utils/utils';
import { judgeFeatureType } from '@/utils/drawHelpers';
export default {
  name: 'Compare',
  components: { DcCapsule, CmpGroups },
  data () {
    return {
      featureList: [],
      setFlag: false,
      changeFlag: false,
      cmpGroups: [],
    };
  },
  computed: {
    ...mapState({
      aggrList: state => state.dashboard.aggrList,
      catList: state => state.dashboard.catList,
      chartType: state => state.dashboard.chartType,
      aggCode: state => state.dashboard.aggCode,
      timeCode: state => state.dashboard.timeCode,
      locale: state => state.project.locale,
      worksheetId: state => state.dashboard.worksheetId,
      canvasFeatures: state => state.dashboard.canvasFeatures
    }),
    activeFeature () {
      return (this.featureList[0] && this.featureList[0][0]) || {};
    },
  },
  watch: {
    featureList: {
      handler: delayFunc(function (list) {
        const item = (list[0] && list[0][0]) || null;
        let cmp = item ? { name: item.name } : {};
        if (item && item.type === 'int' && item.selectItem.code) {
          cmp.legend = item.selectItem.code;
        }
        this.$emit('change', {
          cmp,
        });
        if (!cmp.name || judgeFeatureType(cmp.name) === 'int') {
          this.cmpGroups = [];
        }
      }, 30),
      deep: true
    },
    cmpGroups: delayFunc(function (val) {
      this.$emit('cmp-groups-change', val);
    }, 30),
  },
  mixins: [getParam, operate],
  beforeCreate () {},
  created () {},
  beforeMount () {},
  mounted () {
    this.bus.$on('setCompare', (obj, type) => {
      this.initParam(obj, type);
    });
    this.bus.$on('dropCompareFeature', (el) => {
      this.dropHandler(el);
    });
    this.bus.$on('removeCompareFeature', (el, target) => {
      this.drillRemove(el, target);
    });
    this.bus.$on('swapCompareFeature', this.changeFeature);
  },
  destroyed () {
    this.bus.$off('setCompare');
    this.bus.$off('dropCompareFeature');
    this.bus.$off('removeCompareFeature');
    this.bus.$off('swapCompareFeature');
  },
  methods: {
    ...mapMutations('dashboard', ['setCatList', 'setAggrList', 'setCanvasType']),
    initParam: delayFunc(function (obj, type) {
      this.featureList = [];
      this.setCanvasType(type);
      this.setParam(obj);
    }, 60),
    sortHandler () {
      this.$emit('showSort');
    },
    dropHandler (el) {
      if (!el) return;
      let featureType = el.getAttribute('type').toLocaleLowerCase();
      let featureName = el.getAttribute('name');
      let dataType = el.getAttribute('property').toLocaleLowerCase();
      if (this.checkDuplicate(featureName)) { return; } // 已拖入则不进行操作
      this.getParam(dataType, featureType, featureName, 'compare');
      this.cmpGroups = [];
    },
    checkDuplicate (featureName) {
      const cmp = this.canvasFeatures.cmp;
      const list = cmp ? [cmp] : [];
      return list.map(el => el.name).indexOf(featureName) !== -1;
    },
    getParam (dataType, featureType, featureName) {
      if (dataType === 'cat') {
        this.searchCat(featureName); // Defined in getParam mixin, push item in featureList;
      } else {
        this.searchInt(featureName); // Defined in getParam mixin, push item in featureList;
      }
      if (this.featureList.length > 1) { // After search, two items in featureList, splice to be one;
        this.featureList.splice(0, 1);
      }
    },
    setParam ({ cmp, 'cmp-groups': cmpGroups }) {
      if (!cmp || !cmp.name) { return; }
      const item = cmp;
      if (judgeFeatureType(item.name) === 'cat') {
        this.searchCat(item.name, item.split, item.order);
      } else {
        this.searchInt(item.name, item.legend, item.probability, null, item.color, item.labels, false, item.rate);
      }
      this.cmpGroups = cmpGroups;
    },
    changeFeature (el, target) {
      let sourceName = el.getAttribute('name');
      let targetName = target.getAttribute('name');
      let sourceIndex = el.getAttribute('index');
      let targetIndex = target.getAttribute('index');
      let property = el.getAttribute('property').toLocaleLowerCase();
      if (sourceName === targetName) return;
      if (this.checkDuplicate(sourceName)) return;
      if (sourceIndex !== -1) {
        if (sourceIndex === null) {
          let featureObj = null;
          if (property === 'cat') {
            featureObj = this.returnCatObj(sourceName);
          } else {
            featureObj = this.returnNumObj(sourceName);
          }
          this.featureList.splice(targetIndex, 1, featureObj);
        } else {
          let sourceObj = JSON.parse(
            JSON.stringify(this.featureList[sourceIndex])
          );
          let targetObj = JSON.parse(
            JSON.stringify(this.featureList[targetIndex])
          );
          this.featureList.splice(sourceIndex, 1, targetObj);
          this.featureList.splice(targetIndex, 1, sourceObj);
        }
      } else {
        this.dropHandler(el);
        if (this.chartType !== 'scatter') {
          let lastObj = JSON.parse(
            JSON.stringify(this.featureList[this.featureList.length - 1])
          );
          this.featureList.splice(targetIndex, 1, lastObj);
          this.featureList.pop();
        }
      }
    },
  }
};
</script>

<style scoped lang="scss">
.compare {
  width: 100%;
  min-height: 60px;
  line-height: 60px;
  display: flex;
  padding: 0px 20px 0px 0px;
  box-sizing: border-box;
  border-radius: 4px;
  background-color: #f4f4f4;
  position: relative;
  .left {
    position: relative;
    width: 80px;
    padding-left: 10px;
    .text {
      display: inline-block;
    }
    .line {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 0px;
      height: 32px;
      border-right: 1px solid #e1e1e1;
    }
    .rotated {
      margin: 0px 7px 0px 0px;
    }
    .rotated-bar-icon {
      display: inline-block;
      transform: rotate(90deg);
    }
  }
  .right {
    flex: 1;
    color: #cccccc;
    .compare-tip {
      margin-left: 10px;
    }
    .compare-dragula {
      display: flex;
      align-items: center;
      height: 100%;
      width: 100%;
      padding-left: 10px;
      position: absolute;
      top: 0px;
    }
  }
}
</style>
