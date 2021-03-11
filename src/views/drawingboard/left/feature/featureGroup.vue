<template>
  <div class="feature-group">
    <div class="group-header">
      <span class="feature-type" :class="colorClass">{{title}}</span>
      <div class="search-input">
        <div class="search-title" v-if="show">
          <span class="iconfont icon-db_magify" @click="changeSearch"></span>
          <span>查找</span>
        </div>
        <div class="input-content" v-else>
          <input ref="searchInput" :placeholder="inputTip" v-model="inputValue" />
          <span class="iconfont icon-db_magify" v-if="inputValue.length === 0" @click="changeSearch"></span>
          <span class="iconfont icon-db_plus" v-else @click="inputValue='';show=false"></span>
        </div>
      </div>
    </div>
    <div class="feature-scroll" ref="feaScroll">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  name: 'FeatureGroup',
  data () {
    return {
      inputValue: '',
      show: true
    };
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  components: {},
  computed: {
    ...mapState('drawingboard', ['currentCanvas']),
    colorClass () {
      return this.title === '数值' ? 'init-type' : '';
    },
    inputTip () {
      return `请输入${this.title}特征`;
    }
  },
  watch: {
    inputValue: function (val) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.$emit('change', this.inputValue);
      }, 300);
    },
    currentCanvas: {
      handler () {
        this.inputValue = '';
      },
      deep: true
    }
  },
  mounted () {
  },
  methods: {
    changeSearch () {
      this.show = !this.show;
      if (this.show) {
        setTimeout(() => {
          this.$refs.searchInput.focus();
        }, 0);
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.feature-group {
  text-align: left;
  box-sizing: border-box;
  display: block;
  height: calc(50% - 75px);
  width: 100%;
  border-bottom: 1px solid #cccccc;
  .group-header{
    height: 48px;
    display: flex;
    align-items: center;
    .feature-type{
      color: white;
      font-size: 12px;
      height: 20px;
      width: 40px;
      text-align: center;
      display: inline-block;
      border-radius: 0px 4px 4px 0px;
      background-color: #03B98C;
    }
    .init-type{
      background-color: #4284f5;
    }
    .search-input{
      flex:1;
      width: 0;
      margin: 0px 8px;
      .search-title{
        display: block;
        text-align: right;
        font-size: 12px;
        color: #A4A4A4;
        .iconfont{
          margin-right: 4px;
          font-size: 14px;
          cursor: pointer;
        }
      }
      .input-content{
        width: 100%;
        align-items: center;
        display: flex;
        > input {
          flex:1;
          padding: 0px;
          margin: 0px;
          outline: none;
          border: none;
          background-color: transparent;
        }
        .iconfont{
          width: 24px;
          color: #a4a4a4;
          cursor: pointer;
        }
        .icon-db_plus{
          transform: rotate(45deg);
        }
      }
    }
  }
  .feature-scroll {
    max-height: calc(100% - 60px);
    min-height: 35px;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    box-sizing: border-box;
    padding: 0px 12px;
    .active {
      background-color: #03b98c;
      color: white;
    }
    .select {
      background-color: #4284f5;
      color: white;
    }
  }
}
</style>
