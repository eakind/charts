<template>
  <div class="multiple-filter">
    <el-dialog title="过滤器编辑器" width="980px" :close-on-click-modal="false" :show-close="false" :visible="true">
      <div class="filter">
        <span class="edit-tip">{{$t('dashboard.filter_tip')}}</span>
        <div class="filter-list">
          <div class="list-item"
              v-for="(item, index) in currentList"
              :key="index"
              @click="selectFilter(item, index)">
            <dc-checked class="dc-checked"
                        :active="item.active"></dc-checked>
            <div>{{item.filter_name}}</div>
          </div>
        </div>
      </div>
      <div class="current-filter">
        <div class="current-item"
            v-for="(item, index) in activeList"
            :key="index"
            v-show="item.relate">
          <div class="current-header">
            <span class="iconfont icon-dbc_filterbl"
                  :class="setCatorNum(item)"> {{item.filter_name}}</span>
          </div>
          <div class="relate-canvas">
            {{$t('dashboard.relate_canvas')}}:
            <span v-for="(childItem, index) in changeCanvas(item.worksheet_list)"
                  :key="index">{{childItem}}<span v-if="(item.worksheet_list.length - 1)!==index">、</span></span>
          </div>
          <cat-filter-editor v-if="item.filter_type !== '03'"
                            :item="item"
                            :index="index"
                            @selectAll="selectCatAll"
                            @changeType="changeCatType"
                            @changeValue="changeCatValue"></cat-filter-editor>
          <num-filter-editor v-else
                            :item="item"
                            :index="index"
                            @change="changeNumFilter"></num-filter-editor>
        </div>
      </div>
      <div class="filter-footer">
        <button class="exit-btn" @click="exitHandler">{{$t('dashboard.exit_btn')}}</button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import DcChecked from './dcChecked';
import CatFilterEditor from './catFilterEditor';
import NumFilterEditor from './numFilterEditor';
import { post } from '@/api/server';
import { mapState } from 'vuex';
export default {
  data () {
    return {
      isModify: false, // 判断是否有进行过滤器修改
      currentList: [], // 关联当前画布的过滤器
      activeList: [] // 编辑中的过滤器
    };
  },
  computed: {
    ...mapState('drawingboard', ['filterAllList', 'currentCanvas', 'canvasList']),
    ...mapState('project', ['projectId'])
  },
  watch: {
    filterAllList: {
      handler (list) {
        this.currentList = [];
        this.activeList = [];
        for (let i = 0; i < this.filterAllList.length; i++) {
          if (this.filterAllList[i].relate) {
            let obj = JSON.parse(JSON.stringify(this.filterAllList[i]));
            if (this.currentList.length < 3) {
              obj.active = true;
              this.activeList.push(obj);
            }
            this.currentList.push(obj);
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  components: {
    DcChecked,
    CatFilterEditor,
    NumFilterEditor
  },
  mounted () {
  },
  methods: {
    setCatorNum (item) {
      return item.filter_type !== '03' ? 'cat-active' : 'num-active';
    },
    changeCanvas (list) {
      let arr = [];
      for (let j = 0; j < list.length; j++) {
        for (let i = 0; i < this.canvasList.length; i++) {
          if (list[j].worksheet_id === this.canvasList[i].worksheet_id) {
            arr.push(i + 1);
          }
        }
      }
      return arr.sort((a, b) => a - b);
    },
    exitHandler () {
      this.$emit('exit', this.isModify);
    },
    selectFilter (item, index) {
      if (!item.active && this.activeList.length === 3) {
        return;
      };
      item.active = !item.active;
      this.$set(this.currentList, index, item);
      if (item.active && this.activeList.length < 3) {
        this.activeList.push(item);
        return;
      }
      for (let i = 0; i < this.activeList.length; i++) {
        if (!item.active && item.filter_id === this.activeList[i].filter_id) {
          this.activeList.splice(i, 1);
        }
      }
    },
    selectCatAll (boolean, item, index) {
      let obj = {
        select_all: boolean,
        filter_type: item.filter_type
      };
      this.filterModify(obj, '', item, index);
    },
    changeCatType (filterType, item, index) {
      let obj = {
        filter_type: filterType
      };
      this.filterModify(obj, 'filterType', item, index);
    },
    changeCatValue (list, item, index) {
      let obj = {
        filter_values: list,
        filter_type: item.filter_type
      };
      this.filterModify(obj, '', item, index);
    },
    changeNumFilter (list, item, index) {
      let obj = {
        filter_values: {
          start: list[0],
          end: list[1],
          min: list[2],
          max: list[3]
        }
      };
      this.filterModify(obj, '', item, index);
    },
    async filterModify (obj, type, currentItem, index) {
      let param = {
        project_id: this.projectId,
        worksheet_id: this.currentCanvas.worksheet_id,
        filter_id: currentItem.filter_id,
        filter_name: currentItem.filter_name,
        ...obj
      };
      let res = await post('filterModify', param);
      if (res.code === 0) {
        this.isModify = true;
        this.bus.$emit('updateCurrentFilter', JSON.parse(JSON.stringify(currentItem)));
        if (res.hasOwnProperty('select_all')) {
          this.$set(this.activeList[index], 'select_all', res.select_all);
        }
        switch (type) {
          case 'filterType':
            this.$set(this.activeList[index], 'filter_type', obj.filter_type);
            break;
        }
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.multiple-filter {
  .dc-alert-header {
    text-align: left;
    padding: 5px 20px;
  }
  .filter {
    padding: 5px 0px;
  }
  .edit-tip {
    font-size: 12px;
    color: #666666;
  }
  .filter-list {
    padding:5px 10px;
    box-sizing: border-box;
    border-radius: 4px;
    background-color: #e7ebf2;
    max-height: 110px;
    overflow-y: auto;
    .list-item {
      display: flex;
      width: 180px;
      height: 30px;
      align-items: center;
      cursor: pointer;
    }
  }
  .current-filter {
    display: flex;
    max-height: 600px;
    min-height: 400px;
    // max-height: calc(100% - 240px);
    // min-height: calc(100% - 180px);
  }

  .current-item {
    flex: 1;
    padding: 0px 20px;
    border-right: 1px solid #e1e1e1;
    &:last-child {
      padding-right: 0px;
      border-right: none;
    }
    &:first-child {
      padding-left: 0px;
    }
  }
  .filter-footer {
    display: flex;
    justify-content: center;
    margin-top: 16px;
    // position: absolute;
    // bottom: 0;
    // left: 50%;
    // transform: translateX(-50%);
    // height: 50px;
    // line-height: 50px;
    // text-align: center;
  }
  .exit-btn {
    border: none;
    outline: none;
    background-color: #4284f5;
    color: white;
    padding: 6px 20px;
    border-radius: 4px;
    cursor: pointer;
  }
  .relate-canvas {
    color: #666666;
    > span {
      color: #4284f5;
    }
  }
  .current-header {
    display: flex;
    padding: 3px 0px;
  }
  .cat-active {
    &::before {
      color: #03b98c;
    }
  }
  .num-active {
    &::before {
      color: #4284f5;
    }
  }
}
// @media screen and (max-width: 1368px) {
//   .multiple-filter {
//     height: 450px;
//     .current-filter {
//       min-height: 275px;
//     }
//   }
// }
// @media screen and (max-width: 1445px) and (min-width: 1368px) {
//   .multiple-filter {
//     height: 700px;
//     .current-filter {
//       min-height: 425px;
//     }
//   }
// }
// @media screen and (max-width: 1960px) and (min-width: 1445px) {
//   .multiple-filter {
//     height: 780px;
//     .current-filter {
//       min-height: 665px;
//     }
//   }
// }
// @media screen and (max-width: 2560px) and (min-width: 1960px) {
//   .multiple-filter {
//     height: 850px;
//     .current-filter {
//       min-height: 555px;
//     }
//   }
// }
</style>
<style lang="scss">
.multiple-filter {
  .el-dialog__header {
    padding-bottom: 0;
    .el-dialog__headerbtn {
      top: 10px;
    }
    .el-dialog__close {
      font-weight: bold;
    }
  }
  .el-dialog__title {
    font-size: 14px;
    font-weight: bold;
  }
}
</style>
