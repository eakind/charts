<template>
  <div class="tabbar">
    <div
      :class="selectIndex===index ? 'tabbar-active' : ''"
      v-for="(item, index) in list"
      :key="index"
      @click="selectTab(index)"
    >
      {{item.name}}
    </div>
  </div>
</template>
<script>
export default {
  name: 'Tabbar',
  data () {
    return {
      styleObj: {
        height: '0.9em',
        width: '0.9em'
      },
      selectIndex: 0,
      list: []
    };
  },
  props: {
    select: {
      type: Number,
      defalut: 0
    }
  },
  watch: {
    select (val) {
      this.selectIndex = val;
    }
  },
  mounted () {
    this.list = [{
      name: this.$t('dashboard.feature_list'),
      icon: '#icon-dbc_featureList'
    }, {
      name: this.$t('dashboard.filter'),
      icon: '#icon-dbc_filter'
    }, {
      name: '建模',
      icon: '#icon-dbc_filter'
    }];
    this.selectIndex = this.select;
  },
  methods: {
    selectTab (index) {
      if (this.selectIndex !== index) {
        this.selectIndex = index;
        this.$emit('change', this.selectIndex);
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.tabbar {
  display: flex;
  height: 36px;
  padding: 0px;
  text-align: center;
  align-items: center;
  box-sizing: border-box;
  background-color: #F2F2F2;
  > div {
    flex: 1;
    width: 0;
    height: 100%;
    cursor: pointer;
    color: #424242;
    display: block;
    font-size: 14px;
    line-height: 36px;
    position: relative;
  }
  .tabbar-active {
    background: #FBFCFF;
    border-radius: 4px 4px 0px 0px;
    &::after{
      content: '';
      border-radius: 4px;
      background-color: #4284F5;
      width: 40%;
      height: 4px;
      display: inline-block;
      position: absolute;
      left: 50%;
      bottom: 0px;
      transform: translateX(-50%);
    }
  }
}
</style>
