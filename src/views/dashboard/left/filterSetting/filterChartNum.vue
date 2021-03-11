<!--  -->
<template>
  <div class="number-chart" :style="globalStyle">
    <div class="filter-name" :style="titleStyle">{{filterInfo.filter_name}}</div>
    <div class="number-operate">
      <div class="reduce-number" :class="{'none-operate': numberRange[0] === numberMin}" @click="reduceNumber">
        <span class="iconfont icon-db_arrow"></span>
      </div>
      <div class="number-slider">
        <el-slider
          v-model="numberRange"
          range
          :max="numberMax"
          :min="numberMin">
        </el-slider>
      </div>
      <div class="add-number" :class="{'none-operate': numberRange[1] === numberMax}" @click="addNumber">
        <span class="iconfont icon-db_arrow"></span>
      </div>
    </div>
    <div class="number-show">
      <div class="left-num"><el-input type="number" v-model="numberRange[0]" @input="leftChange(numberRange[0])">{{numberRange[0]}}</el-input></div>
      <div class="right-num"><el-input type="number" v-model="numberRange[1]" @input="rightChange">{{numberRange[1]}}</el-input></div>
      <!-- <div class="left-num"><el-input type="number" v-model="numberLeft" @input="leftChange(numberLeft)">{{numberLeft}}</el-input></div>
      <div class="right-num"><el-input type="number" v-model="numberRight" @input="rightChange">{{numberRight}}</el-input></div> -->
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { get, post } from '@/api/server';
import filterMixins from './mixins/index';
import { refreshCanvasMixin } from '../../boardLayout/mixins/refreshCanvas.js';
export default {
  data () {
    return {
      numberRange: [],
      numberMax: 0,
      numberMin: 0,
      filterInfo: {},
      timer: null,
      leftTimer: null,
      rightTimer: null,
      numberLeft: 0,
      numberRight: 0
    };
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    styleObj: {
      type: [Object, String]
    }
  },
  components: {},
  computed: {
    ...mapState('project', ['projectId']),
    ...mapState('dashboard', ['filterUniqueList', 'layoutList'])
  },
  mixins: [filterMixins, refreshCanvasMixin],
  watch: {
    numberRange (val) {
      let currentFilter = this.filterUniqueList.filter((item, index) => {
        return item.filter_id === this.id;
      });
      if (!currentFilter[0]) return;
      let param = {
        filter_id: this.id,
        filter_name: currentFilter[0].filter_name,
        filter_type: currentFilter[0].filter_type,
        filter_values: {
          max: this.numberMax,
          min: this.numberMin,
          start: parseFloat(this.numberRange[0]),
          end: parseFloat(this.numberRange[1])
        },
        project_id: this.projectId,
        worksheet_list: currentFilter[0].worksheet_list
      };
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.modifyFilter(param);
        }, 1000);
      } else {
        this.timer = setTimeout(() => {
          this.modifyFilter(param);
        }, 1000);
      }
    }
  },
  mounted () {
    // this.id = '7d258f1c347711ebbcd4fa163e6b7e99';
    this.getNumFilterValue();
  },
  methods: {
    reduceNumber () {
      let num0 = this.numberRange[0];
      let num1 = this.numberRange[1];
      num0 = num0 - 1;
      let arr = [num0, num1];
      this.numberRange = arr;
    },
    addNumber () {
      let num0 = this.numberRange[0];
      let num1 = this.numberRange[1];
      num1 = num1 + 1;
      let arr = [num0, num1];
      this.numberRange = arr;
    },
    leftChange (val) {
      if (this.leftTimer) {
        clearTimeout(this.leftTimer);
        this.leftTimer = null;
      }
      this.leftTimer = setTimeout(() => {
        let num1 = this.numberRange[1];
        if (this.numberRange[0] === '') {
          this.numberRange[0] = this.numberMin;
        }
        if (!isNaN(parseFloat(this.numberRange[0]))) {
          let num0 = parseFloat(this.numberRange[0]);
          let arr = [num0, num1];
          this.numberRange = arr;
        }
        clearTimeout(this.leftTimer);
        this.leftTimer = null;
      }, 800);
      // if (this.numberLeft > this.numberMax) {
      //   this.numberLeft = this.numberMax;
      // }
      // if (this.numberLeft < this.numberMin) {
      //   this.numberLeft = this.numberMin;
      // }
      // let arr = [this.numberLeft, this.numberRight];
      // this.numberRange = arr;
    },
    rightChange (val) {
      if (this.rightTimer) {
        clearTimeout(this.rightTimer);
        this.rightTimer = null;
      }
      this.rightTimer = setTimeout(() => {
        let num0 = this.numberRange[0];
        if (this.numberRange[1] === '') {
          this.numberRange[1] = this.numberMax;
        }
        if (!isNaN(parseFloat(this.numberRange[1]))) {
          let num1 = parseFloat(this.numberRange[1]);
          let arr = [num0, num1];
          this.numberRange = arr;
        }
        clearTimeout(this.rightTimer);
        this.rightTimer = null;
      }, 800);
    },
    isNullObj (obj) {
      return Object.keys(obj).length === 0;
    },
    async getNumFilterValue () {
      let param = {
        project_id: this.projectId,
        filter_id: this.id
      };
      let res = await get('filterDetail', param);
      if (res.code === 0) {
        this.filterInfo = res;
        this.numberRange = [];
        this.numberRange.push(res.filter_values.start, res.filter_values.end);
        this.numberMax = res.filter_values.max;
        this.numberMin = res.filter_values.min;
        this.numberLeft = this.numberRange[0];
        this.numberRight = this.numberRange[1];
      }
    },
    async modifyFilter (param) {
      let res = await post('filterModify', param);
      if (res.code === 0) {
        const list = param.worksheet_list || [];
        for (let i = 0; i < list.length; i++) {
          this.refreshCanvas(this.layoutList, list[i].worksheet_id);
        }
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.number-chart {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  padding: 8px;
  .filter-name {
    width: 100%;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    color: #424242;
  }
  .number-operate {
    display: flex;
    align-items: center;
    .min-number {
      width: 68px;
      text-align: center;
    }
    .reduce-number {
      width: 40px;
      text-align: center;
      margin-right: 10px;
      transform: rotate(180deg);
      cursor: pointer;
    }
    .number-slider {
      flex: 1;
    }
    .max-number {
      width: 68px;
      text-align: center;
    }
    .add-number {
      width: 40px;
      text-align: center;
      margin-left: 10px;
      cursor: pointer;
    }
    .none-operate {
      pointer-events: none;
      opacity: 0.2;
    }
  }
  .number-show {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
    div {
      width: 80px;
      height: 24px;
      border-radius: 4px;
      line-height: 36px;
      text-align: center;
    }
  }
}
</style>
<style lang="scss">
.number-chart {
  .el-slider__button-wrapper {
    z-index: 8;
  }
  .number-show {
    .el-input__inner {
      padding: 0 8px;
      text-overflow: ellipsis;
      text-align: center;
    }
    input[type=number]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
}
</style>
