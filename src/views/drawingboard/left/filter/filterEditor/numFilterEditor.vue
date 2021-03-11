<template>
  <div class="num-filter-editor">
    <div class="up">
      <span class="iconfont icon-db_arrow left" @click="setMin()"></span>
      <range-slider
        class="range-silder"
        v-if="min !== max"
        :min="min"
        :max="max"
        :value="sliderVal"
        @change="changeSilder"
      ></range-slider>
      <div v-if="min===max" class="dc-min-max"></div>
      <span class="iconfont icon-db_arrow right" @click="setMax()"></span>
    </div>
    <div class="bottom">
      <input :disabled="min === max" @keyup="setMinInput" v-model="minInput" />
      <input :disabled="min === max" @keyup="setMaxInput" v-model="maxInput" />
    </div>
  </div>
</template>
<script>
import RangeSlider from '@/components/rangeslider/rangeSlider.vue';
import { get } from '@/api/server';
import { mapState } from 'vuex';
export default {
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
  watch: {
    item: {
      handler () {
        this.getFilterDetail();
      },
      deep: true,
      immediate: true
    }
  },
  components: {
    RangeSlider
  },
  mounted () {
  },
  methods: {
    changeSilder (min, max) {
      this.$set(this.sliderVal, 0, min);
      this.$set(this.sliderVal, 1, max);
      this.$set(this.sliderVal, 2, this.min);
      this.$set(this.sliderVal, 3, this.max);
      this.minInput = min;
      this.maxInput = max;
      this.$emit('change', this.sliderVal, this.item, this.index);
    },
    setMin () {
      this.$set(this.sliderVal, 0, this.min);
      this.minInput = this.min;
    },
    setMax () {
      this.$set(this.sliderVal, 1, this.max);
      this.maxInput = this.max;
    },
    setMinInput () {
      if (this.minInput.length === 1 && this.minInput.charAt(0) === '-') {
        return;
      }
      if (this.minInput < this.min) {
        this.minInput = this.min;
        return;
      }
      if (this.minInput > this.max) {
        this.minInput = this.max;
        return;
      }
      if (isNaN(this.minInput)) {
        this.minInput = this.sliderVal[0];
      } else {
        this.sliderVal.splice(0, 1, Number(this.minInput));
        this.$emit('change', this.sliderVal, this.item, this.index);
      }
    },
    setMaxInput () {
      if (this.maxInput.length === 1 && this.maxInput.charAt(0) === '-') {
        return;
      }
      if (this.maxInput < this.min) {
        this.maxInput = this.min;
        return;
      }
      if (this.maxInput > this.max) {
        this.maxInput = this.max;
        return;
      }
      if (isNaN(this.maxInput)) {
        this.maxInput = this.sliderVal[1];
      } else {
        this.sliderVal.splice(1, 1, Number(this.maxInput));
        this.$emit('change', this.sliderVal, this.item, this.index);
      }
    },
    async getFilterDetail () {
      let param = {
        project_id: this.projectId,
        filter_id: this.item.filter_id
      };
      let res = await get('filterDetail', param);
      if (res.code === 0) {
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
  }
};
</script>
<style lang='scss' scoped>
.num-filter-editor{
  padding: 5px 10px;
  box-sizing: border-box;
  position: relative;
  .iconfont{
    text-align: right;
    color: #4284f5;
    cursor: pointer;
    display: inline-block;
  }
  .left{
    transform: rotate(-180deg);
    width: 30px;
  }
  .right {
    width: 30px;
  }
  .range-silder{
    align-items: center;
    display: flex;
  }
  .up {
    padding: 5px 0px;
    display: flex;
  }
  .bottom{
    padding: 10px 0px;
    position: relative;
    input {
      width: 80px;
      height: 48px;
      line-height: 48px;
      position: absolute;
      display: inline-block;
      outline: none;
      text-align: center;
      padding: 0px 5px;
      box-sizing: border-box;
      border-radius: 4px;
      border: 1px solid #dedede;
      &:first-child {
        left: 0px;
      }
      &:last-child {
        right: 0px;
      }
    }
  }
}
</style>
