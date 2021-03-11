<template>
  <div class="dc-input" >
    <span class="top-txt">{{topTxt}}</span>
    <input :disabled="disabled" :class="disabled ? 'input-disabled' : ''" v-model="value" @keyup="value=value.replace(/[^\d]/g,'')"><span class="right-txt">{{rightTxt}}</span>
    <span class="bottom-txt" :style="{ textIndent: rightTxt ? '-18px' : '' }">{{bottomTxt}}</span>
  </div>
</template>

<script>
export default {
  name: 'DcInput',
  data () {
    return {
      value: this.val
    };
  },
  props: {
    bottomTxt: {
      type: String,
      default: ''
    },
    rightTxt: {
      type: String,
      default: ''
    },
    topTxt: {
      type: String,
      default: ''
    },
    inputType: {
      type: [String, Number],
      default: ''
    },
    val: {
      type: [String, Number]
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    val (value) {
      this.value = String(value).split('px')[0];
    },
    value (value) {
      this.$emit('change', value, this.inputType);
    }
  },
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
  },
  mounted () {
  },
  destroyed () {
  },
  methods: {
  }
};
</script>

<style scoped lang="scss">
.dc-input{
  display: inline-block;
  input{
    width:5em;// 35px;
    height: 24px;
    outline: none;
    padding: 0px 5px;
    border: 1px solid #dedede;
    background-color: white;
    border-radius: 4px;
  }
  .input-disabled {
    background: #d8d8d8;
  }
  span{
    color: #a4a4a4;
    font-size: 12px;
  }
  .top-txt{
    display: block;
  }
  .right-txt{
    margin: 0px 3px;
  }
  .bottom-txt{
    text-align: center;
    display: block;
  }
}
</style>
