<template>
  <div class="searchinput">
    <span class="iconfont icon-db_magify"></span>
    <input type="text" v-model="inputValue" :placeholder="$t('message.project_search')" class="input" @keydown.13="enterHandler" />
    <span class="iconfont icon-db_plus" v-if="inputValue" @click="cancelHandler"></span>
  </div>
</template>

<script>
/*
* SearchInput组件
* props: value，设置初始化值
* event: change：输入值改变时触发该事件，enter：按下enter时触发该事件
* */
export default {
  data () {
    return {
      inputValue: this.value,
      timer: null
    };
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  watch: {
    value (val) {
      if (!val) {
        this.inputValue = '';
        this.$emit('change', '');
      }
    },
    inputValue: function (val) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.$emit('change', this.inputValue);
      }, 300);
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
    enterHandler () {
      this.$emit('enter', this.inputValue);
    },
    cancelHandler () {
      this.inputValue = '';
      this.$emit('change', '');
    }
  }
};
</script>

<style scoped lang="scss">
.searchinput{
  // border: 1px solid #a4a4a4;
  // height: 30px;
  // width: 220px;
  // border-radius: 20px;
  // display: inline-block;
  // background-color: white;
  height: 40px;
  width: 300px;
  border-bottom: 1px solid #A4A4A4;
  display: flex;
  align-items: center;
  span{
    display: inline-block;
    margin-left: 6px;
    margin-right: 12px;
    width: 18px;
    height: 18px;
  }
  input{
    height: 80%;
    line-height: 22px;
    width: 80%;
    border: none;
    outline: none;
    font-size: 16px;
    background: none;
    &::-webkit-input-placeholder {
      color: #A4A4A4;
    }
  }
  .icon-db_plus {
    color: #a4a4a4;
    cursor: pointer;
    transform: rotate(45deg);
  }
}
</style>
