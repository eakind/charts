<template>
  <!-- 展板左侧 -->
  <div class="dashboard-wrap">
    <div class="dashboard-tab flex">
      <template v-for="(i, index) in tabList">
        <div
          :key="index"
          class="tab-item"
          :class="index === activeIndex ? 'active' : ''"
          @click="activeIndex = index"
        >
          {{ i }}
        </div>
      </template>
    </div>
    <transition name="fade" mode="out-in">
      <component :is="comName" :moduleList="workSheetList"></component>
    </transition>
  </div>
</template>
<script>
import moduleList from './left/moduleList.vue';
import styleSetting from './left/styleSetting.vue';
import filterSetting from './left/filterSetting.vue';
import index from './mixins/index.js';
export default {
  name: 'dashboardLeft',
  components: {
    moduleList,
    styleSetting,
    filterSetting,
  },
  mixins: [index],
  data () {
    return {
      comList: ['moduleList', 'styleSetting', 'filterSetting'],
      tabList: ['组件', '样式', '过滤'],
      activeIndex: 0,
    };
  },
  computed: {
    comName () {
      return this.comList[this.activeIndex];
    },
  },
  created () {
    this.initDashboardData();
  },
  methods: {},
};
</script>
<style lang="scss" scoped>

.dashboard-wrap {
  width: 15%;
  height: calc(100% - 0.1em);
  background-color: #fbfcff;
  // background-color: hsl(225, 100%, 99.2%);
  // padding: 0.57em;
  font-size: 14px;
  border-radius: 4px;
  .flex {
    display: flex;
  }
  .dashboard-tab {
    width: 100%;
    background-color: hsl(0, 0%, 94.9%);
    color: hsl(0, 0%, 64.3%);
    justify-content: space-around;
    align-items: center;
    border-radius: 4px;
    // margin-bottom: 0.57em;
    & > div {
      text-align: center;
      padding: 0.27em 0;
      flex: 1;
      cursor: pointer;
    }
  }
  .dashboard-tab > div.active {
    position: relative;
    color: hsl(0, 0%, 25.9%);
    font-weight: bold;
    background-color: #fff;

    &::after {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      content: ' ';
      display: inline-block;
      width: 2.85em;
      height: 4px;
      border-bottom: 4px solid hsl(217.9, 89.9%, 61%);
    }
  }
}
@media screen and (max-width: 1920px) {
  .dashboard-wrap {
    width: 15%;
  }
}
@media screen and (max-width: 1440px) {
  .dashboard-wrap {
    width: 20%;
  }
}
@media screen and (max-width: 1368px) {
  .dashboard-wrap {
    width: 22%;
  }
}
</style>
