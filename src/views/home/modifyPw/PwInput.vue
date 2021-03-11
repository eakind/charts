<template>
  <div class="pw-input">
    <!-- :type="isPassword ? 'password' : 'text'"  -->
    <input type="hidden" v-model="inputValue" />
    <input  readonly onfocus="this.removeAttribute('readonly');" @input="inputProcess" type="text" :placeholder="placeHolder" v-model="tempVal" />
    <span
      class="iconfont"
      :class="!isPassword ? 'icon-db_display' :'icon-db_hide'"
      @click="showProcess"
    ></span>
  </div>
</template>
<script>
export default {
  data () {
    return {
      isPassword: true,
      inputValue: '',
      tempVal: ''
    };
  },
  props: {
    placeHolder: {
      type: String
    }
  },
  components: {},
  watch: {
    inputValue (value) {
      this.$emit('change', value);
    }
  },
  mounted () {},
  methods: {
    inputProcess (e) {
      let val = e.target.value;
      if (val.length > this.inputValue.length) {
        this.inputValue += val[val.length - 1];
      } else {
        this.inputValue.slice(0, this.inputValue.length - 1);
      }
      if (this.isPassword) {
        // eslint-disable-next-line no-useless-escape
        this.tempVal = val.replace(/./g, '\*');
      } else {
        this.tempVal = val;
      }
    },
    showProcess () {
      if (this.isPassword) {
        this.tempVal = this.inputValue;
        this.isPassword = false;
      } else {
        // eslint-disable-next-line no-useless-escape
        this.tempVal = this.tempVal.replace(/./g, '\*');
        this.isPassword = true;
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.pw-input {
  border-radius: 4px;
  outline: none;
  width: 220px;
  font-size: 14px;
  padding: 0px;
  box-sizing: border-box;
  border: 1px solid #666666;
  > input {
    width: 180px;
    border: none;
    height: 40px;
    line-height: 40px;
    padding: 0px 5px;
    margin: 0px;
    background: transparent;
    outline: none;
    text-align: left;
    position: relative;
  }
  .iconfont {
    cursor: pointer;
  }
}
</style>
