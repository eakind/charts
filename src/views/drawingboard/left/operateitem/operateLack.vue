<template>
  <div class="operate-lack">
    <operate-header
      :item="item"
      :dataType="dataType"
      :transformType="transformType"
      @modify="modify"
    ></operate-header>
    <div class="lack-body">
      <operate-input :item="item"></operate-input>
      <span class>{{$t('dashboard.set_value')}}</span>
      <input class="self-input" v-model="selfInput" :placeholder="selfInputTip" />
      <div>{{$t('dashboard.select_fill')}}</div>
      <div class="lack-radio">
        <span
          class="radio-label"
          @click="select=index"
          v-for="(item, index) in lackList"
          :key="index"
        >
          <dc-radio :name="item.name" :active="select===index"></dc-radio>
        </span>
        <span class="radio-label" @click="select=-1">
          <dc-radio :active="select===-1"></dc-radio>
          <input class="special-input" :placeholder="specialTip" v-model="specialInput" />
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import OperateHeader from './operate/operateHeader';
import OperateInput from './operate/operateInput';
import DcRadio from './operate/dcRadio';
export default {
  data () {
    return {
      transformType: this.$t('dashboard.fill'),
      selfInput: '',
      selfInputTip: this.$t('dashboard.default_empty'),
      specialInput: '',
      specialTip: this.$t('dashboard.self_value'),
      select: -1,
      code: 'CUSTOM',
      lackList: []
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
    select (val) {
      if (val === -1) {
        this.code = 'CUSTOM';
      } else {
        this.code = this.lackList[val].code;
      }
      this.$emit('change', this.selfInput, this.code, this.specialInput);
    },
    selfInput () {
      this.$emit('change', this.selfInput, this.code, this.specialInput);
    },
    specialInput () {
      this.$emit('change', this.selfInput, this.code, this.specialInput);
    }
  },
  components: {
    OperateHeader,
    OperateInput,
    DcRadio
  },
  mounted () {
    if (this.item.type === 'cat') {
      this.lackList = [
        {
          name: this.$t('dashboard.mode'),
          code: 'MODE'
        }
      ];
    } else {
      this.lackList = [
        {
          name: this.$t('dashboard.mean'),
          code: 'MEAN'
        },
        {
          name: this.$t('dashboard.median'),
          code: 'MEDIAN'
        },
        {
          name: this.$t('dashboard.mode'),
          code: 'MODE'
        }
      ];
    }
  },
  methods: {
    modify () {
      this.$emit('modify');
    }
  }
};
</script>
<style lang='scss' scoped>
.operate-lack {
  .lack-body {
    font-size: 14px;
    min-height: 100px;
    .self-input {
      width: 260px;
      height: 28px;
      line-height: 28px;
      padding: 0px 3px;
      border-radius: 4px;
      outline: none;
      margin-bottom: 10px;
      border: 1px solid #dedede;
      background-color: white;
      display: block;
    }
    .lack-radio {
      padding: 5px 0px;
      .radio-label {
        padding: 10px 0px;
        cursor: pointer;
        margin: 0px 10px 0px 0px;
        .special-input {
          width: 90px;
          height: 28px;
          line-height: 28px;
          padding: 0px 3px;
          margin: 0px 5px;
          border-radius: 4px;
          outline: none;
          border: 1px solid #dedede;
          background-color: white;
        }
      }
    }
  }
}
</style>
