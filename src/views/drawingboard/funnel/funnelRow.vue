<template>
  <div class="row">
    <div class="left" :class="locale === 'en' ? 'left-en' : ''">
      <span class="text">{{$t('message.measures')}}</span>
      <span class="line"></span>
    </div>
    <div class="right">
      <div class="row-dragula">
        <span
          class="row-tip"
          v-if="featureList.length < 1"
          style="position: relative;"
        >{{$t('message.drop_num_features_min_one')}}{{$t('message.drop_num_max_one_while_cat_exists')}}</span>
        <template v-if="featureList.length > 0 && changeWorksheet">
          <dc-capsule
            v-for="(item, index) in featureList"
            :key="index"
            :index="index"
            :list="catList"
            :hide-add="false"
            :drill-arr="judgeDrill(item)"
            :item="item"
            panel-type="row"
            @removebig="removebig"
            @changeselect="changeSelect"
            @change="changeFeature"
            @changegroup="changeGroup"
            @remove="dragRemove"
            @capsulesmall="clickRemove"
            @drop="mergeHandler"
          ></dc-capsule>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import DcCapsule from '@/components/dccapsule/DcCapsule';
import { mapState, mapMutations } from 'vuex';
import { getParam } from '@/mixins/dashboard/getParam';
import { operate } from '@/mixins/dashboard/operate';
import { delayFunc } from '@/utils/utils';
export default {
  name: 'Row',
  components: {
    DcCapsule
  },
  data () {
    return {
      groupList: [],
      featureList: [],
      changeWorksheet: true
    };
  },
  computed: {
    ...mapState({
      aggrList: state => state.dashboard.aggrList,
      catList: state => state.dashboard.catList,
      chartType: state => state.dashboard.chartType,
      chart_type: state => state.dashboard.chartType,
      aggCode: state => state.dashboard.aggCode,
      timeCode: state => state.dashboard.timeCode,
      locale: state => state.project.locale,
      canvasFeatures: state => state.dashboard.canvasFeatures,
      worksheetId: state => state.dashboard.worksheetId
    })
  },
  watch: {
    worksheetId: {
      handler (val) {
        this.changeWorksheet = false;
      },
      deep: true
    },
    featureList: {
      handler (list) {
        this.changeRow();
      },
      deep: true
    }
  },
  mixins: [getParam, operate],
  mounted () {
    this.bus.$on('setRow', (obj, type) => {
      this.initParam(obj, type);
    });
    this.bus.$on('rowCatFeature', el => {
      // 接收分类特征
      this.dropHandler(el);
    });
    this.bus.$on('swapFeature', (el, target) => {
      this.changeFeature(el, target);
    });
    this.bus.$on('removerowfeature', (el, target) => {
      this.drillRemove(el, target);
    });
    this.bus.$on('grouprowfeature', (el, target) => {
      if (target) {
        this.drillupFeature(el, target);
      } else {
        this.dropHandler(el);
      }
    });

    this.bus.$on('rowNumFeature', this.dropHandler);
    this.bus.$on('addGroupFeature', this.addGroup);
    this.bus.$on('swapRowFeature', this.changeFeature);
    this.bus.$on('mergeFeature', this.mergeHandler);
    this.bus.$on('changeFeatureList', this.setFeatureList);
    this.bus.$on('removeRowRate', () => {
      for (let i = 0; i < this.featureList.length; i++) {
        for (let j = 0; j < this.featureList[i].length; j++) {
          let obj = JSON.parse(JSON.stringify(this.featureList[i][j]));
          delete obj.rate;
          this.$set(this.featureList[i], j, obj);
        }
      }
    });
  },
  destroyed () {
    this.bus.$off('setRow');
    this.bus.$off('rowCatFeature');
    this.bus.$off('swapFeature');
    this.bus.$off('removerowfeature');
    this.bus.$off('grouprowfeature');
    this.bus.$off('rowNumFeature');
    this.bus.$off('addGroupFeature');
    this.bus.$off('swapRowFeature');
    this.bus.$off('mergeFeature');
    this.bus.$off('changeFeatureList');
    this.bus.$off('removeRowRate');
  },
  methods: {
    ...mapMutations('dashboard', ['setCatList', 'setAggrList', 'setCanvasType']),
    initParam: delayFunc(function (obj, type) {
      this.setCanvasType(type);
      this.featureList = [];
      this.groupList = [];
      this.changeWorksheet = true;
      this.setParam(obj, type, 'row');
    }, 60),
    changeRow: delayFunc(function () {
      this.bus.$emit('changeGroupFeature', this.featureList);
      this.$emit('change', this.featureList);
    }, 200),
    setFeatureList (list, type) {
      let index = 0;
      for (let i = 0; i < this.featureList.length; i++) {
        for (let j = 0; j < this.featureList[i].length; j++) {
          if (!list[index]) continue;
          if (
            this.featureList[i][j].feature_name === list[index].feature_name
          ) {
            if (list[index].color) {
              this.$set(this.featureList[i][j], 'color', list[index].color);
            } else {
              delete this.featureList[i][j].color;
            }
            if (list[index].labels) {
              this.$set(this.featureList[i][j], 'labels', list[index].labels);
            } else {
              delete this.featureList[i][j].labels;
            }
            if (list[index].selectItem) {
              this.$set(
                this.featureList[i][j],
                'selectItem',
                list[index].selectItem
              );
            } else {
              delete this.featureList[i][j].selectItem;
            }

            this.$set(this.featureList[i][j], 'bar', list[index].bar);
            this.$set(this.featureList[i][j], 'line', list[index].line);
          }
          index = index + 1;
        }
      }
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
        let lastObj = JSON.parse(
          JSON.stringify(this.featureList[this.featureList.length - 1])
        );
        this.featureList.splice(targetIndex, 1, lastObj);
        this.featureList.pop();
      }
    },
    dropHandler (el) {
      if (!el) return;
      let featureType = el.getAttribute('type').toLocaleLowerCase();
      let featureName = el.getAttribute('name');
      let dataType = el.getAttribute('property').toLocaleLowerCase();
      if (this.checkDuplicate(featureName)) return;
      if (dataType !== 'int') { return; }
      this.getParam(dataType, featureType, featureName, 'row');
    },
    checkDuplicate (featureName) {
      const list = this.canvasFeatures.y || [];
      return list.map(el => el.name).indexOf(featureName) !== -1;
    },
    getParam (dataType, featureType, featureName) {
      if (dataType !== 'int') { return; }
      this.searchInt(featureName); // defined in getParam mixin, push item in featureList;
    },
    setParam ({ y }) {
      for (let i = 0; i < y.length; i++) {
        const item = y[i].feature;
        if (item.name) {
          this.searchInt(item.name, item.legend, item.probability);
        }
      }
    },
    addGroup (el, target) {
      let dir = target.getAttribute('dir');
      let name = el.getAttribute('name');
      let objArr = [];
      for (let i = 0; i < this.aggrList.length; i++) {
        if (name === this.aggrList[i].feature_name) {
          let obj = JSON.parse(JSON.stringify(this.aggrList[i]));
          obj.name = this.aggrList[i].feature_name;
          obj.type = 'int';
          obj.selectItem = {
            name: this.$i18n.t('message.sum'),
            code: 'SUM'
          };
          obj.dir = dir;
          if (dir === 'right') {
            obj.line = true;
            obj.bar = false;
          } else {
            obj.bar = true;
            obj.line = false;
          }
          obj.dataType = this.aggrList[i].data_type;
          objArr.push(obj);
        }
      }
      this.groupList.push(objArr);
    },
    changeGroup (el, target) {
      let sourceName = el.getAttribute('name');
      let index = -1;
      for (let i = 0; i < this.featureList.length; i++) {
        for (let j = 0; j < this.featureList[i].length; j++) {
          if (this.featureList[i][j].feature_name === sourceName) {
            index = i;
          }
        }
      }
      if (index > -1) {
        this.featureList.splice(index, 1);
      }
      this.addGroup(el, target);
    },
    mergeHandler (el, target) {
      let sourceObj = null;
      let property = el.getAttribute('property').toLocaleLowerCase();
      let dir = target.getAttribute('dir');
      let targetIndex = Number(target.getAttribute('index'));
      let sourceName = el.getAttribute('name');
      if (el.classList.contains('dc-capsule-panel')) {
        for (let i = 0; i < this.featureList.length; i++) {
          if (sourceName === this.featureList[i][0].feature_name) {
            this.featureList.splice(i, 1);
          }
        }
      }
      if (property === 'cat') {
        sourceObj = this.returnCatObj(sourceName)[0];
      } else {
        sourceObj = this.returnNumObj(sourceName)[0];
      }
      sourceObj.dir = dir;
      if (dir === 'left') {
        this.featureList[targetIndex].unshift(sourceObj);
      } else {
        if (this.featureList[targetIndex].length === 1) {
          this.$set(this.featureList[targetIndex][0], 'dir', 'left');
        }
        this.featureList[targetIndex].push(sourceObj);
      }
    },
    removebig (index) {
      this.featureList.splice(index, 1);
    }
  }
};
</script>

<style scoped lang="scss">
.row {
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
  }
  .left-en {
    width: 80px !important;
  }
  .right {
    flex: 1;
    color: #cccccc;
    .row-dragula {
      height: 100%;
      width: 100%;
      padding-left: 10px;
    }
  }
}
</style>
