<template>
  <div class="operate-time">
    <operate-header
      :item="item"
      :dataType="dataType"
      :transformType="transformType"
      @modify="modify"
    ></operate-header>
    <div class="operate-body">
      <operate-input :item="item"></operate-input>
      <div class="time-format-body">
        <div class="self-time">
          <span class="time-tip">{{$t('dashboard.set_time_format')}}</span>
          <input class="time-input" :placeholder="timeTip" v-model="format" />
        </div>
        <div class="or">{{$t('dashboard.or')}}</div>
        <div class="select-time">
          <span class="time-tip">{{$t('dashboard.select_format')}}</span>
          <select-format class="select-format" @change="changeFormat" :clear="clear"></select-format>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import OperateHeader from './operate/operateHeader';
import SelectFormat from './operate/selectFormat';
import OperateInput from './operate/operateInput';
export default {
  data () {
    return {
      transformType: this.$t('dashboard.time_date'),
      timeFormat: '',
      timeTip: this.$t('dashboard.self_set'),
      format: '',
      clear: false
    };
  },
  props: {
    item: {
      type: Object
    },
    dataType: {
      type: String
    }
  },
  watch: {
    format () {
      this.timeFormat = this.format;
      if (this.format !== '') {
        this.clear = !this.clear;
      }
    },
    timeFormat () {
      this.$emit('change', this.timeFormat);
    }
  },
  components: {
    OperateHeader,
    SelectFormat,
    OperateInput
  },
  mounted () {},
  methods: {
    changeFormat (format) {
      this.format = '';
      this.timeFormat = format;
    },
    modify () {
      this.$emit('modify');
    }
  }
};
</script>
<style lang='scss' scoped>
.operate-time {
  box-sizing: border-box;
  .operate-body {
    padding: 10px 0px;
    .time-format-body {
      display: flex;
      .self-time {
        .time-input {
          width: 150px;
          height: 28px;
          line-height: 28px;
          outline: none;
          border-radius: 4px;
          padding: 0px 3px;
          border: 1px solid #979797;
          color: #424242;
          display: block;
          ::placeholder {
            color: #a4a4a4;
          }
        }
      }
      .or{
        width: 40px;
        height: 100px;
        text-align: center;
        line-height: 78px;
      }
      .select-time {
        height: 120px;
      }
    }
  }
  .time-tip {
    color: #666666;
    font-size: 14px;
    padding: 0px 0px 6px;
    display: block;
  }
}
</style>
