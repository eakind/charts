<template>
  <div class="set-range-wrap">
    <div class="header flex">
      <div class="title">{{$t('dashboard.color_scope')}}</div>
      <div class="icon-close-box"
           @click="$emit('close')">
        <span class="iconfont icon-db_plus"></span>
      </div>
    </div>
    <div class="tips flex">
      <div class="name">test</div>
      <div class="btn-reset"
           @click="resetProcess">恢复默认</div>
    </div>
    <div class="content flex">
      <template v-for="(i,index) in colorList">
        <div :key="i.rangeType">
          <div class="check-box flex">
            <div @click="i.check=!i.check">
              <dc-checked class="check"
                          :active="i.check"></dc-checked>
            </div>
            <div class="tips">{{i.rangeType==='min'?'开始':'结束'}}</div>
          </div>
          <div><input type="text" :value="i.originalVal"
                   @input="inputProcess($event.target.value,i,index)"
                   :class="i.check?'check':''"
                   :readonly="i.check?false:'readonly'" /></div>
        </div>
      </template>
    </div>
    <div class="error-tips" v-if="showTips">{{errortext}}</div>
    <div class="btn-group flex">
      <div class="sure"
           @click="sure">确定</div>
      <div class="cancel"
           @click="$emit('close')">取消</div>
    </div>
  </div>
</template>
<script>
import DcChecked from '@/components/dcchecked/dcChecked.vue';
export default {
  name: 'rangeSet',
  components: { DcChecked },
  props: {
    list: {
      type: Array,
      default: _ => []
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      startCheck: false,
      endCheck: false,
      colorList: [],
      name: '',
      showTips: false,
      errortext: ''
    };
  },
  watch: {
    list: {
      handler (val) {
        if (val.length === 0) {
          return;
        }
        this.name = val[this.index].aggr;
        this.colorList = JSON.parse(JSON.stringify(val[this.index].list));
        this.colorList.map(i => {
          if (!i.check) {
            this.$set(i, 'check', false);
          }
        });
      },
      immediate: true,
      depp: true
    }
  },
  methods: {
    resetProcess () {
      this.colorList = JSON.parse(JSON.stringify(this.list[this.index].list));
      this.colorList.map(i => {
        if (!this.check) {
          this.$set(i, 'check', false);
        }
      });
      this.showTips = false;
    },
    sure () {
      if (this.showTips) {
        return;
      }
      this.$emit('on-range-change', this.colorList, this.index);
      this.$emit('close');
    },
    inputProcess (val, i, index) {
      let curVal = val.replace(/[^\d.]/g, '');// .replace(/\.{2,}/g, '.').replace(/^(\-)*(\d )\.(\d\d).*$/, '$1$2.$3'); ;
      i.originalVal = parseFloat(curVal);
      let match = this.colorList.find(m => m.rangeType !== i.rangeType);
      if (match) {
        if (i.rangeType === 'min' && parseFloat(curVal) > match.originalVal) {
          this.errortext = '*最小值不能大于最大值';
          this.showTips = true;
          this.$set(this.colorList, index, i);
          return;
        } else if (i.rangeType === 'max' && parseFloat(curVal) < match.originalVal) {
          this.errortext = '*最大值不能小于最小值';
          this.showTips = true;
          this.$set(this.colorList, index, i);
          return;
        } else {
          this.showTips = false;
        }
      }

      // i.unique = curVal || 0;
      // i.val = curVal;
      this.$set(this.colorList, index, i);
    },
  }
};
</script>
<style lang="scss" scoped>
.set-range-wrap {
  width: 558px;
  background-color: #fff;
  padding: 0px 16px;
  border-radius: 4px;
  .flex {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .header {
    padding: 8px 0;
    .title {
      flex: 1;
      font-weight: bold;
      font-size: 14px;
    }
    .icon-close-box {
      cursor: pointer;
      width: 30px;
      height: 30px;
      transform: rotate(-45deg);
      line-height: 30px;
      text-align: center;
    }
  }
  .tips {
    justify-content: space-between;
    padding: 8px 0;
    .name {
      font-weight: bold;
    }
    .btn-reset {
      font-weight: bold;
      color: #4284f5;
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .content {
    // width: 528px;
    height: 100px;
    margin: auto;
    background-color: #e7ebf2;
    border-radius: 4px;
    padding:8px 0;
    input {
      width: 192px;
      padding: 8px;
      background: #dedede;
      border-radius: 4px;
      font-size: 16px;
      color: #a4a4a4;
      appearance: none;
      outline: none;
      border: none;
    }
    input.check {
      background: #ffffff;
      border: 1px solid #dedede;
      border-radius: 4px;
      color: #424242;
    }
    .check-box {
      justify-content: space-around;
      div.tips {
        flex: 1;
        margin-left: 8px;
      }
    }
  }

  .btn-group {
    margin: 8px 0;
    padding: 8px;
    & > div {
      cursor: pointer;
      font-size: 16px;
    }
    .sure {
      color: #4284f5;
    }
    .cancel {
      color: #a4a4a4;
    }
  }
  .error-tips{
      color: #f45;
  }
}
</style>
