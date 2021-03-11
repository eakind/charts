<template>
  <div class="export-data">
    <div class="export-header">
      {{name}}
    </div>
    <div class="export-body">
      <div class="body-up">
        <div>
          <span class="color" v-if='list.colorMin' :style='{backgroundColor: list.colorMin}'></span>
          <dc-range :type='"min"' style='margin-bottom: 10px;'
          :val='temp_list.currentMin'
          :reset='temp_list.currentMin !== temp_list.actualMin && temp_userDefined'
          :userDefined='temp_userDefined'
          @changeRangeVal='changeRangeVal'
          @resetToDefault='resetToDefault'></dc-range>
        </div>
        <div>
          <span class="color" v-if='list.colorMin' :style='{backgroundColor: list.colorMax}'></span>
          <dc-range :type='"max"'
          :val='temp_list.currentMax'
          :reset='temp_list.currentMax !== temp_list.actualMax && temp_userDefined'
          :userDefined='temp_userDefined'
          @changeRangeVal='changeRangeVal'
          @resetToDefault='resetToDefault'></dc-range>
        </div>
        <div class="check-box">
          <div class="check" @click='changeUserDefined'>
            <span class="iconfont icon-db_check" v-if='temp_userDefined'></span>
          </div>
          <span class="info">{{$t('message.user_defined')}} {{isColor}} {{$t('message.range')}}</span>
        </div>
      </div>
    </div>
    <div class="export-footer">
      <button @click="sureHandler">{{$t('message.confirmed')}}</button>
      <button @click="cancelHandler">{{$t('message.cancel')}}</button>
    </div>
  </div>
</template>

<script>
import dcRange from '@/components/minMaxRange/range.vue';
export default {
  name: 'color-size-range',
  components: {
    dcRange
  },
  props: {
    name: {
      type: String,
      default: ''
    },
    list: {
      type: Object,
      default: function () {
        return {};
      }
    },
    userDefined: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      temp_list: '',
      temp_userDefined: false
    };
  },
  computed: {
    isColor () {
      return this.list.colorMin ? this.$t('message.color') : this.$t('message.size');
    }
  },
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
  },
  mounted () {
    this.temp_list = this.list;
    this.temp_userDefined = this.userDefined;
    document.body.style.pointerEvents = 'none';
    this.$el.style.pointerEvents = 'auto';
  },
  destroyed () {
    document.body.style.pointerEvents = 'auto';
  },
  methods: {
    cancelHandler () {
      this.$emit('cancel');
    },
    sureHandler () {
      this.$emit('changeRangeVal', this.temp_list, this.temp_userDefined);
    },
    changeRangeVal (type, val) {
      if (type === 'min') {
        this.temp_list.currentMin = val;
      } else {
        this.temp_list.currentMax = val;
      }
    },
    resetToDefault (type) {
      if (type === 'min') {
        this.temp_list.currentMin = this.temp_list.actualMin;
      } else {
        this.temp_list.currentMax = this.temp_list.actualMax;
      }
    },
    changeUserDefined () {
      this.temp_userDefined = !this.temp_userDefined;
      if (!this.temp_userDefined) {
        this.resetToDefault('min');
        this.resetToDefault('max');
      }
    }
  }
};
</script>

<style scoped lang="scss">
.export-data{
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 560px;
  height: 280px;
  color: black;
  z-index: 9999;
  background-color: #f6f6f6;
  box-shadow: 0 12px 30px 0 rgba(0,0,0,0.30);
  border-radius: 4px;
  user-select: none;
  .export-header{
    height: 60px;
    line-height: 80px;
    font-size: 18px;
    text-align: center;
  }
  .export-body{
    .body-up{
      padding: 20px 0px;
      text-align: center;
      //margin-left: 130px;
      .color {
        width: 10px;
        height: 20px;
        line-height: 30px;
        border-radius: 2px;
        display: inline-block;
        margin-right: 10px;
        vertical-align: middle;
      }
      .check-box {
        margin-top: 10px;
        .check {
          display: inline-block;
          margin-right: 8px;
          width: 18px;
          height: 18px;
          border-radius: 4px;
          box-sizing: border-box;
          border: 1px solid #e1e1e1;
          background-color: #fff;
          position: relative;
          top: 4px;
          span {
            color: steelblue;
            position: absolute;
            left: 0px;
            /*width: 18px;
            height: 18px;
            display: inline-block;
            border-radius: 4px;*/
          }
        }
        .info {
          font-size: 14px;
        }
      }
    }
  }
  .export-footer{
    text-align: center;
    padding-top: 10px;
    button{
      width: 130px;
      height: 38px;
      line-height: 25px;
      text-align: center;
      border-radius: 50px;
      margin: 0px 20px;
      outline: none;
      &:first-child{
        color: white;
        border: 1px solid #4284f5;
        background-color: #4284f5;
      }
      &:last-child{
        border: 1px solid #666666;
        background-color: white;
      }
    }
  }
}
</style>
