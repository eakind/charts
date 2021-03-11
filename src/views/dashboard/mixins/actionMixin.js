import { get, post } from '@/api/server';
import { mapState, mapMutations } from 'vuex';
import { refreshCanvasMixin } from '../boardLayout/mixins/refreshCanvas.js';
export default {
  mixins: [refreshCanvasMixin],
  data () {
    return {
      // chartList: [],
      actionCardList: [],
      relateList: [],
      originFeatureList: [],
      targetFeatureList: []
    };
  },
  computed: {
    ...mapState('dashboard', ['currentDashboardDetail', 'actionList', 'layoutList', 'workSheetList', 'chartList']),
    ...mapState('project', ['projectId']),
    ...mapState('drawingboard', ['catList'])
  },
  mounted () {
  },
  methods: {
    ...mapMutations('dashboard', ['setActionList', 'setChartList']),
    async getActionList () {
      let param = {
        project_id: this.projectId,
        dashboard_id: this.currentDashboardDetail.dashboard_id,
        offset: 0,
        limit: 100
      };
      if (!this.currentDashboardDetail.dashboard_id) return;
      let res = await get('getActionList', param);
      this.setActionList([]);
      if (!res) return;
      if (res.action_lst.length === 0) return;
      let newArr = [];
      for (var item1 of res.action_lst) {
        let flag = true;
        for (var item2 of newArr) {
          if (item1.origin_worksheet_id === item2.origin_worksheet_id && item1.target_worksheet_id === item2.target_worksheet_id) {
            flag = false;
          }
        }
        if (flag) {
          newArr.push(item1);
        }
      }
      this.setActionList(newArr);
      if (newArr.length === 0) {
        return;
      }
      this.getIndexToList(this.chartList, newArr);
    },
    getIndexToList (chartList, actionList) {
      this.actionCardList = [];
      let flag = false;
      for (let i = 0; i < actionList.length; i++) {
        let obj = JSON.parse(JSON.stringify(actionList[i]));
        obj.originIndex = this.getCanvasIndex(
          chartList,
          actionList[i].origin_worksheet_id
        );
        obj.targetIndex = this.getCanvasIndex(
          chartList,
          actionList[i].target_worksheet_id
        );
        obj.originTitle = this.getCanvasTitle(
          chartList,
          actionList[i].origin_worksheet_id
        );
        obj.targetTitle = this.getCanvasTitle(
          chartList,
          actionList[i].target_worksheet_id
        );
        flag = false;
        for (let j = 0; j < obj.actions.length; j++) {
          if (obj.actions[j].value) {
            flag = true;
          }
        }
        obj.showList = false;
        obj.showName = false;
        if (flag) {
          obj.showList = true;
          obj.showName = true;
        }
        this.actionCardList.push(obj);
      }
      if (flag) {
        this.allShow = true;
      } else {
        this.allShow = false;
      }
    },
    getCanvasIndex (chartList, worksheetId) {
      for (let i = 0; i < chartList.length; i++) {
        if (chartList[i].worksheet_id === worksheetId) {
          return chartList[i].index;
        }
      }
    },
    getCanvasTitle (chartList, worksheetId) {
      for (let i = 0; i < chartList.length; i++) {
        if (chartList[i].worksheet_id === worksheetId) {
          return chartList[i].worksheet_title;
        }
      }
    },
    // getChartList () {
    //   this.chartList = [];
    //   if (this.workSheetList.length === 0) return;
    //   for (let i in this.workSheetList) {
    //     if (this.workSheetList[i].active) {
    //       this.chartList.push(JSON.parse(JSON.stringify(this.workSheetList[i])));
    //     }
    //   }
    //   for (let j in this.chartList) {
    //     this.chartList[j].label = this.chartList[j].worksheet_title;
    //     this.chartList[j].value = this.chartList[j].worksheet_id;
    //     this.chartList[j].index = j;
    //   };
    // },
    getChartList () {
      var chartList = [];
      if (this.workSheetList.length === 0) return;
      for (let i in this.workSheetList) {
        if (this.workSheetList[i].active) {
          chartList.push(JSON.parse(JSON.stringify(this.workSheetList[i])));
        }
      }
      for (let j in chartList) {
        chartList[j].label = chartList[j].worksheet_title;
        chartList[j].value = chartList[j].worksheet_id;
        chartList[j].index = j;
      };
      this.setChartList(chartList);
    },
    async modifyAction (currentAction, actionInfo) {
      let param = {
        project_id: this.projectId,
        dashboard_id: this.currentDashboardDetail.dashboard_id,
        action_id: currentAction.action_id,
        target_worksheet_id: currentAction.target_worksheet_id,
        actions: this.getCatsValue(currentAction.actions, actionInfo),
        cats: currentAction.cats
      };
      let res = await post('modifyAction', param);
      if (!res) return;
      if (res.code === 0) {
        this.refreshCanvas(this.layoutList, currentAction.target_worksheet_id);
      };
    },
    getCatsValue (list, actionInfo) {
      let catsValue = [];
      catsValue = list;
      if (actionInfo !== null) {
        for (let i in list) {
          list[i].value = actionInfo[this.getOriginArr(this.currentAction.actions)[i]];
        }
      } else {
        for (let i in list) {
          list[i].value = '';
        }
      }
      return catsValue;
    },
    getOriginStr (arr) {
      let originStr = '';
      for (let i in arr) {
        originStr = originStr + this.getFeatureName(arr[i].origin_feature_idx) + ',';
      }
      return originStr;
    },
    getOriginArr (arr) {
      let originArr = [];
      for (let i in arr) {
        originArr.push(this.getFeatureName(arr[i].origin_feature_idx));
      }
      return originArr;
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
    getArr (arrOne, arrTwo) {
      let newArr = [];
      for (let i in arrOne) {
        for (let j in arrTwo) {
          if (arrTwo[j].worksheet_id === arrOne[i].worksheet_id) {
            newArr.push(arrOne[i]);
          };
        };
      };
      return newArr;
    },
    setRelateList (actions, flag) {
      this.relateList = [];
      for (let i = 0; i < actions.length; i++) {
        let obj = {
          originFeature: this.getFeatureName(actions[i].origin_feature_idx),
          targetFeature: this.getFeatureName(actions[i].target_feature_idx),
          originFeatureIdx: actions[i].origin_feature_idx,
          targetFeatureIdx: actions[i].target_feature_idx,
          originList: this.originFeatureList,
          targetList: this.targetFeatureList,
          originListVal: actions[i].origin_feature_idx,
          targetListVal: actions[i].origin_feature_idx
        };
        this.relateList.push(obj);
      }
      if (flag) {
        if (this.editDetail && this.editDetail.actions.length !== 0) {
          for (let i in this.editDetail.actions) {
            for (let j in this.relateList) {
              if (this.relateList[j].originFeatureIdx === this.editDetail.actions[i].origin_feature_idx) {
                this.relateList[j].originListVal = this.editDetail.actions[i].origin_feature_idx;
                this.relateList[j].targetListVal = this.editDetail.actions[i].target_feature_idx;
              }
            }
          }
        }
      }
    },
    setOriginFeatureList () {
      this.originFeatureList = [];
      for (let i = 0; i < this.originCatList.length; i++) {
        if (this.originCatList[i].selected) {
          this.originFeatureList.push(this.originCatList[i]);
        }
      }
    },
    settargetFeatureList () {
      this.targetFeatureList = [];
      for (let i = 0; i < this.catList.length; i++) {
        if (this.catList[i].groups) {
          for (let j = 0; j < this.catList[i].groups.length; j++) {
            this.targetFeatureList.push({
              name: this.catList[i].groups[j].feature_name,
              label: this.catList[i].groups[j].feature_name,
              value: this.catList[i].groups[j].feature_idx,
            });
          }
        } else {
          this.targetFeatureList.push({
            name: this.catList[i].feature_name,
            label: this.catList[i].feature_name,
            value: this.catList[i].feature_idx,
          });
        }
      }
    },
    filterCat (list, array) {
      if (list instanceof Array) {
        for (let i = 0; i < list.length; i++) {
          if (list[i].feature) {
            if (!list[i].feature.legend) {
              if (this.getFeatureIdx(list[i].feature.name) !== '') {
                array.push({
                  name: list[i].feature.name,
                  idx: this.getFeatureIdx(list[i].feature.name),
                  selected: true
                });
              }
            }
            if (list[i].feature.color) {
              if (this.getFeatureIdx(list[i].feature.color.name) !== '') {
                array.push({
                  name: list[i].feature.color.name,
                  idx: this.getFeatureIdx(list[i].feature.color.name),
                  selected: true
                });
              }
            }
          } else if (list[i].pills) {
            let pillsArr = list[i].pills;
            for (let j = 0; j < pillsArr.length; j++) {
              if (pillsArr[j].color) {
                array.push({
                  name: pillsArr[j].color.name,
                  idx: this.getFeatureIdx(pillsArr[j].color.name),
                  selected: true
                });
              }
            }
          } else if (list[i].left) {
          } else {
            if (!list[i].legend) {
              if (this.getFeatureIdx(list[i].name) !== '') {
                array.push({
                  name: list[i].name,
                  idx: this.getFeatureIdx(list[i].name),
                  selected: true
                });
              }
            }
          }
        }
      } else {
        if (list.feature) {
          if (!list.feature.legend) {
            array.push({
              name: list.feature.name,
              idx: this.getFeatureIdx(list.feature.name),
              selected: true
            });
          }
        } else {
          if (!list.legend) {
            array.push({
              name: list.name,
              idx: this.getFeatureIdx(list.name),
              selected: true
            });
          }
          if (list.color) {
            if (this.getFeatureIdx(list.color.name) !== '') {
              array.push({
                name: list.color.name,
                idx: this.getFeatureIdx(list.color.name),
                selected: true
              });
            }
          }
        }
      }
      return array;
    },
    getFeatureIdx (featureName) {
      let featureIdx = '';
      for (let i = 0; i < this.catList.length; i++) {
        if (this.catList[i].groups) {
          for (let j = 0; j < this.catList[i].groups.length; j++) {
            if (featureName === this.catList[i].groups[j].feature_name) {
              featureIdx = this.catList[i].groups[j].feature_idx;
            }
          }
        } else {
          if (featureName === this.catList[i].feature_name) {
            featureIdx = this.catList[i].feature_idx;
          }
        }
      }
      return featureIdx;
    },
    async getFeatrue (val) {
      let param = {
        project_id: this.projectId,
        worksheet_id: val
      };
      let features = null;
      let res = await get('canvasDetail', param);
      if (res && res.features) {
        features = res.features;
      };
      let array = [];
      if (features) {
        if (features.col) array = this.filterCat(features.col, array);
        if (features.row) array = this.filterCat(features.row, array);
        if (features.text) array = this.filterCat(features.text, array);
        if (features.area) array = this.filterCat(features.area, array);
        if (features.x) array = this.filterCat(features.x, array);
        if (features.y) array = this.filterCat(features.y, array);
        if (features.color) array = this.filterCat(features.color, array);
        if (features.labels) array = this.filterCat(features.labels, array);
      }
      this.originCatList = array.filter((x, index, self) => {
        var arrids = [];
        array.forEach((item, i) => {
          arrids.push(item.idx);
        });
        return arrids.indexOf(x.idx) === index;
      });
      for (let i in this.originCatList) {
        this.originCatList[i].label = this.originCatList[i].name;
        this.originCatList[i].value = this.originCatList[i].idx;
        this.originCatList[i].selected = true;
      };
    },
    getActions () {
      let list = [];
      for (let i = 0; i < this.relateList.length; i++) {
        list.push({
          origin_feature_idx: this.relateList[i].originListVal,
          target_feature_idx: this.relateList[i].targetListVal
        });
      }
      return list;
    },
    getCats (data) {
      var list = [];
      if (data.cats.length !== 0) {
        list = data.cats;
      }
      for (let i in this.relateList) {
        for (let j in list) {
          if (list[j].feature_idx === this.relateList[i].originFeatureIdx) {
            list[j].flag = 1;
          } else {
            list[j].flag = 0;
          }
        }
      }
      return list;
    },
    getTargetList (val) {
      this.targetList = this.originList.filter((item, index) => {
        return item.worksheet_id !== val;
      });
    }
  }
};
