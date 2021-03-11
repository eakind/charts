<template>
  <div class="column">
    <div
      class="left"
    >
      <span class="text">{{$t('message.rows')}}</span>
      <span class="line"></span>
    </div>
    <div class="right">
      <span
        class="column-tip"
        v-if="featureList.length < 1&& selectPos !== $t('message.lo_and_lat')"
      >{{$t('message.area_column')}}</span>
      <div class="column-dragula">
        <dc-capsule
          v-for="(item, index) in featureList"
          :key="index"
          :index="index"
          :item="item"
          :hide-add="false"
          :list="aggrList"
          panel-type="column"
          @changeselect="changeSelect"
          @change="changeFeature"
          @remove="dragRemove"
          @capsulesmall="clickRemove"
        ></dc-capsule>
      </div>
    </div>
  </div>
</template>

<script>
import DcCapsule from '@/components/dccapsule/DcCapsule';
import { mapState, mapMutations } from 'vuex';
import { setParam } from '@/mixins/dashboard/setParam';
import { getParam } from '@/mixins/dashboard/getParam';
import { operate } from '@/mixins/dashboard/operate';
import { delayFunc } from '@/utils/utils';
export default {
  name: 'Column',
  components: {
    DcCapsule
  },
  data () {
    return {
      featureList: [],
      setFlag: false,
      changeFlag: false,
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
    })
  },
  watch: {
    featureList: {
      handler (list) {
        this.changeColumn();
      },
      deep: true
    }
  },
  mixins: [setParam, getParam, operate],
  mounted () {
    this.bus.$on('setColumn', (obj, type) => {
      this.initParam(obj, type);
    });
    this.bus.$on('drillFeature', (el) => {
      this.dropHandler(el);
    });
    this.receive();
  },
  destroyed () {
    this.bus.$off('setColumn');
    this.bus.$off('drillFeature');
    this.bus.$off('colNumFeature');
    this.bus.$off('swapColFeature');
  },
  methods: {
    ...mapMutations('dashboard', ['setCatList', 'setAggrList', 'setCanvasType']),
    initParam: delayFunc(function (obj, type) {
      this.featureList = [];
      this.setCanvasType(type);
      this.setParam(obj.x);
    }, 60),
    changeColumn: delayFunc(function () {
      this.$emit('change', this.featureList);
      setTimeout(() => {
        this.bus.$emit('changeColumnFeature');
      }, 0);
    }, 30),
    receive () {
      this.bus.$on('colNumFeature', this.dropHandler);
      this.bus.$on('swapColFeature', this.changeFeature);
    },
    setParam (list) {
      for (let i = 0; i < list.length; i++) {
        this.searchInt(list[i].name, list[i].legend, list[i].probability);
      }
    },
    sortHandler () {
      this.$emit('showSort');
    },
    dropHandler (el) {
      if (!el) return;
      let featureName = el.getAttribute('name');
      let dataType = el.getAttribute('property').toLocaleLowerCase();
      if (this.checkDuplicate(featureName)) { return; } // 已拖入则不进行操作
      if (dataType === 'cat') { return; }
      this.searchInt(featureName); // defined in getParam mixin, push item in featureList;
    },
    checkDuplicate (featureName) {
      const list = this.canvasFeatures.col || [];
      return list.map(el => el.name).indexOf(featureName) !== -1;
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
.column {
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
    .column-tip {
      margin-left: 10px;
      font-weight: 300;
    }
    .column-dragula {
      height: 100%;
      width: 100%;
      padding-left: 10px;
      position: absolute;
      top: 0px;
    }
  }
}
</style>
