<template>
  <div class="filter-int-item">
    <span class="dc-filter-left" @click="setMin()"></span>
    <range-slider
      v-if="min !== max"
      :min="min"
      :max="max"
      :value="sliderVal"
      @change="changeSilder"
    ></range-slider>
    <div v-if="min===max" class="dc-min-max"></div>
    <span class="dc-filter-right" @click="setMax()"></span>
    <div class="dc-filter-bottom">
      <input :disabled="min === max" @keyup="setInput('min')" v-model="minInput" />
      <input :disabled="min === max" @keyup="setInput('max')" v-model="maxInput" />
    </div>
  </div>
</template>
<script>
import RangeSlider from '../rangeslider/rangeSlider';
import { mapState } from 'vuex';
import { get } from '../../api/server';
export default {
  name: 'FilterIntItem',
  components: {
    RangeSlider
  },
  data () {
    return {
      max: 0,
      min: 0,
      minInput: 0,
      maxInput: 0,
      sliderVal: []
    };
  },
  props: {
    item: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  computed: {
    ...mapState('project', ['projectId'])
  },
  mounted () {
    this.getFilterDetail();
  },
  methods: {
    changeSilder (min, max) {
      this.sliderVal = [];
      this.sliderVal.push(min);
      this.sliderVal.push(max);
      this.sliderVal.push(this.min);
      this.sliderVal.push(this.max);
      this.minInput = this.sliderVal[0];
      this.maxInput = this.sliderVal[1];
      this.$emit('change', this.item, this.sliderVal, this.index);
    },
    setInput (type) {
      if (type === 'min') {
        if (this.minInput.length === 1 && this.minInput.charAt(0) === '-') {
          return;
        }
        if (isNaN(this.minInput)) {
          this.minInput = this.sliderVal[0];
        } else {
          this.sliderVal.splice(0, 1, this.minInput);
        }
      } else {
        if (this.maxInput.length === 1 && this.maxInput.charAt(0) === '-') {
          return;
        }
        if (isNaN(this.maxInput)) {
          this.maxInput = this.sliderVal[1];
        } else {
          this.sliderVal.splice(1, 1, this.maxInput);
        }
      }
      this.$emit('change', this.item, this.sliderVal, this.index);
    },
    setMin () {
      this.sliderVal.splice(0, 1, this.min);
      this.minInput = this.min;
      this.$emit('change', this.item, this.sliderVal, this.index);
    },
    setMax () {
      this.sliderVal.splice(1, 1, this.max);
      this.maxInput = this.max;
      this.$emit('change', this.item, this.sliderVal, this.index);
    },
    async getFilterDetail () {
      let param = {
        project_id: this.projectId,
        filter_id: this.item.filter_id
      };
      let res = await get('filterDetail', param);
      if (!res) return;
      this.minInput = res.filter_values.start;
      this.maxInput = res.filter_values.end;
      this.min = res.filter_values.min;
      this.max = res.filter_values.max;
      this.sliderVal.push(res.filter_values.start);
      this.sliderVal.push(res.filter_values.end);
      this.sliderVal.push(res.filter_values.min);
      this.sliderVal.push(res.filter_values.max);
    }
  }
};
</script>
<style lang='scss' scoped>
@mixin direct {
  width: 8px;
  height: 8px;
  cursor: pointer;
  border-top: 2px solid #4284f5;
  border-right: 2px solid #4284f5;
}
.filter-int-item {
  padding: 0px 25px;
  position: relative;
  .dc-filter-left {
    @include direct;
    transform: rotate(225deg);
    left: 12px;
    position: absolute;
  }
  .dc-filter-right {
    @include direct;
    transform: rotate(45deg);
    right: 15px;
    top: 0px;
    position: absolute;
  }
  .dc-filter-bottom {
    padding: 20px 0px;
    position: relative;
    input {
      width: 70px;
      height: 18px;
      line-height: 18px;
      position: absolute;
      display: inline-block;
      outline: none;
      text-align: center;
      padding: 0px 5px;
      box-sizing: border-box;
      border: 1px solid #dedede;
      &:first-child {
        left: -15px;
      }
      &:last-child {
        right: -15px;
      }
    }
  }
}
</style>
