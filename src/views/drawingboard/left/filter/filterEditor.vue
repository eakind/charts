<template>
  <div class="filter-editor">
    <filter-select v-if="currentItem" :item="currentItem" @change="changeHandler"></filter-select>
    <div class="relate-canvas" v-if="currentItem">
      {{$t('dashboard.relate_canvas')}}:
      <span v-for="(childItem, index) in changeCanvas(currentItem.worksheet_list)" :key="index">{{childItem}}<span v-if="(currentItem.worksheet_list.length - 1) !== index">、</span></span>
    </div>
    <div class="date-format" v-if="currentItem && currentItem.datetime_type">
      <span class="date-title">{{$t('dashboard.select_format')}}</span>
      <dc-select-view :list="timeList" :select="currentItem.datetime_type" @change="changeTime"></dc-select-view>
    </div>
    <cat-filter-editor class="cat-filter" :class="{'cat-filter-datetime': currentItem.datetime_type}" v-if="isCat" :item="currentItem"
                      @selectAll="selectCatAll" @changeType="changeCatType" @changeValue="changeCatValue"></cat-filter-editor>
    <num-filter-editor v-if="isNum" :item="currentItem" @change="changeNumFilter"></num-filter-editor>
  </div>
</template>
<script>
import FilterSelect from './filterEditor/filterSelect';
import CatFilterEditor from './filterEditor/catFilterEditor.vue';
import NumFilterEditor from './filterEditor/numFilterEditor';
import DcSelectView from '@/components/dcselectview/dcSelectView.vue';
import { post } from '@/api/server';
import { mapState } from 'vuex';
export default {
  data () {
    return {
      currentItem: null,
      select: 'YEAR',
      selectType: '01'
    };
  },
  props: {
    item: {
      type: Object
    }
  },
  computed: {
    ...mapState('drawingboard', ['canvasList', 'currentCanvas']),
    ...mapState('project', ['projectId', 'timeMap']),
    isCat () {
      return this.currentItem && this.currentItem.filter_type !== '03';
    },
    isNum () {
      return this.currentItem && this.currentItem.filter_type === '03';
    },
    timeList () {
      let arr = [];
      for (let key in this.timeMap) {
        arr.push({
          name: this.timeMap[key],
          id: key
        });
      }
      return arr;
    }
  },
  components: {
    FilterSelect,
    CatFilterEditor,
    NumFilterEditor,
    DcSelectView
  },
  beforeDestroy () {
    this.bus.$off('updateCurrentFilter');
  },
  mounted () {
    this.currentItem = this.item;
    this.select = this.currentItem.datetime_type;
    this.selectType = this.currentItem.filter_type;
    this.bus.$on('updateCurrentFilter', (item) => {
      if (!this.currentItem) return;
      if (item.filter_id === this.currentItem.filter_id) {
        this.$set(this.currentItem, 'isUpdate', !this.currentItem.isUpdate);
      }
    });
  },
  methods: {
    changeTime (item) {
      let obj = {
        datetime_type: item.id,
        filter_type: this.selectType
      };
      this.filterModify(obj, 'time', item.id);
    },
    changeHandler (item) {
      this.currentItem = item;
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
    selectCatAll (boolean) {
      let obj = {
        select_all: boolean
      };
      this.filterModify(obj, 'selectAll');
    },
    changeCatType (type) {
      let obj = {
        filter_type: type,
        // select_all: !!this.currentItem.select_all
      };
      if (this.currentItem.select_all) {
        obj.select_all = true;
      }
      this.selectType = type;
      this.filterModify(obj, 'filterType');
    },
    changeCatValue (list) {
      let obj = {
        filter_values: list,
        filter_type: this.currentItem.filter_type
      };
      this.filterModify(obj);
    },
    changeNumFilter (list) {
      let obj = {
        filter_values: {
          start: list[0],
          end: list[1],
          min: list[2],
          max: list[3]
        }
      };
      this.filterModify(obj);
    },
    async filterModify (obj, type, timeType) {
      let param = {
        project_id: this.projectId,
        worksheet_id: this.currentCanvas.worksheet_id,
        filter_id: this.currentItem.filter_id,
        filter_name: this.currentItem.filter_name,
        ...obj
      };
      let res = await post('filterModify', param);
      if (res.code === 0) {
        this.$set(this.currentItem, 'select_all', res.select_all);
        this.bus.$emit('update-chart-for-filter');
        switch (type) {
          case 'filterType':
            this.$set(this.currentItem, 'filter_type', obj.filter_type);
            break;
          case 'time':
            this.$set(this.currentItem, 'datetime_type', timeType);
            break;
        }
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.filter-editor{
  width: 100%;
  height: calc(100% - 50px);
  box-sizing: border-box;
  .relate-canvas{
    min-height: 30px;
    line-height: 30px;
    padding: 0px 5px;
    box-sizing: border-box;
    > span {
      color: #4284f5;
      margin: 0px 3px;
    }
  }
  .date-format{
    display: flex;
    align-items: center;
    height: 48px;
  }
  .date-title{
    margin-right: 10px;
  }
  .cat-filter{
    height: calc(100% - 90px);
    &.cat-filter-datetime {
      height: calc(100% - 140px);
    }
  }
}
</style>
