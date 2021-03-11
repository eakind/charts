<template>
  <div v-if="type === 'min'" class="min-max-range">
    <span
      class="reset reset-left"
      @click="resetToDefault('min')"
      :class="{ active: activate }"
      ><i class="arrow left"></i><i class="arrow left"></i
    ></span>
    <span class="val val-min">{{ $t("message.min_val") }}</span
    ><span class="divide-line">|</span>
    <input
      type="text"
      v-model="dc_val"
      @input="changeRangeVal('min', $event)"
      :style="{ color: userDefined ? 'black' : 'grey' }"
      :disabled="!userDefined"
    />
  </div>
  <div v-else class="min-max-range">
    <input
      type="text"
      v-model="dc_val"
      @input="changeRangeVal('max', $event)"
      :style="{ color: userDefined ? 'black' : 'grey' }"
      :disabled="!userDefined"
    />
    <div>
      <span class="divide-line">|</span>
      <span class="val val-max">{{ $t("message.max_val") }}</span>
      <span
        class="reset reset-right"
        @click="resetToDefault('max')"
        :class="{ active: activate }"
        ><i class="arrow right"></i><i class="arrow right"></i
      ></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'min-max-range',
  props: {
    type: {
      type: String,
      default: 'min',
    },
    val: {
      type: [String, Number],
      default: 0,
    },
    reset: {
      type: Boolean,
      default: false,
    },
    userDefined: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      activate: false,
      dc_val: '',
    };
  },
  watch: {
    val (newval) {
      this.dc_val = newval;
    },
    reset (newval) {
      this.activate = newval;
    },
  },
  mounted () {
    this.activate = this.reset;
    this.dc_val = this.val;
  },
  methods: {
    resetToDefault (type) {
      if (!this.userDefined) return;
      this.$emit('resetToDefault', type);
      this.activate = false;
    },
    changeRangeVal: lodash.debounce(function (type, e) {
      this.$emit('changeRangeVal', type, +e.target.value);
      this.activate = true;
    }, 500),
  },
};
</script>

<style scoped lang='scss'>
.min-max-range {
  display: inline-block;
  width: 300px;
  height: 30px;
  border-radius: 15px;
  border: 1px solid #dedede;
  background: #fff;
  font-size: 14px;
  box-sizing: border-box;
  > div {
    display: inline-block;
    float: right;
    margin-right: 5px;
  }
  input {
    width: calc(100% - 100px);
    border: none;
    height: 100%;
    padding-left: 3px;
    outline: none;
    background: transparent;
    vertical-align: top;
    text-align: center;
    color: black;
  }
  .val {
    line-height: 30px;
  }
  .val-min {
    margin: 0 3px 0 10px;
  }
  .val-max {
    margin: 0 10px 0 3px;
  }
  .divide-line {
    color: #ccc;
  }
  .active {
    .arrow {
      border-color: #4284f5;
    }
  }
  .reset {
    display: inline-block;
    width: 20px;
    text-align: right;
    line-height: 30px;
    cursor: pointer;
    &:hover {
      .arrow {
        border-color: #4284f5;
      }
    }
  }
  .reset-left {
    margin-left: 5px;
  }
  .reset-right {
    margin-right: 5px;
  }
  .arrow {
    border: solid #bbb;
    border-width: 0 3px 3px 0;
    display: inline-block;
    padding: 3px;
  }
  .right {
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
  }
  .left {
    transform: rotate(135deg);
    -webkit-transform: rotate(135deg);
  }
}
</style>
