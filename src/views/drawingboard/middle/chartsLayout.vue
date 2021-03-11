<template>
  <div class="dashboard-charts">
    <div class="charts-main" :style="`width: ${chartsMainWidth}px`" ref="chartsMain">
      <slot></slot>
    </div>
    <div class="charts-right" :class="isRightExpand ? 'expand' : ''">
      <div class="right-folded" v-show="!isRightExpand" @click="expandRight">
        <icon-svg class="right-icon expand" icon="#icon-db_download" :style-obj="{ width: '16px', height: '16px' }" />
        <span class="folded-title">样式</span>
      </div>
      <div class="right-title" v-show="isRightExpand" @click="foldRight">
        <span>样式</span>
        <icon-svg class="right-icon fold" icon="#icon-db_download" :style-obj="{ width: '16px', height: '16px' }" />
      </div>
      <div v-show="isRightExpand" class="right-content">
        <slot name="right">
          <dc-tabs class="right-tabs">
            <dc-tab-item class="right-dc-tab-item" :title="$t('dashboard.data')">
              <dc-collapse>
                <slot name="right-data" />
              </dc-collapse>
            </dc-tab-item>
            <dc-tab-item  class="right-dc-tab-item" :title="$t('dashboard.canvas')">
              <dc-collapse>
                <slot name="right-canvas" />
              </dc-collapse>
            </dc-tab-item>
          </dc-tabs>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>

import { mapState, mapMutations } from 'vuex';

export default {
  computed: {
    ...mapState('drawingboard', [
      'openStatus'
    ]),
    isRightExpand () {
      return this.openStatus === 2;
    },
    chartsMainWidth () {
      const isLeftExpand = this.openStatus === 1;
      const isRightExpand = this.isRightExpand;
      const leftWidth = isLeftExpand ? 440 : 260;
      const rightWidth = isRightExpand ? 200 : 30;
      return window.innerWidth - leftWidth - rightWidth;
    }
  },
  methods: {
    ...mapMutations('drawingboard', [
      'setOpenStatus',
    ]),
    foldRight () {
      this.setOpenStatus(0);
    },
    expandRight () {
      this.setOpenStatus(2);
    },
  }
};
</script>

<style lang="scss" scoped>
.dashboard-charts {
  position: relative;
  flex-grow: 1;
  display: flex;
  box-sizing: border-box;
  height: 100%;
  background-color: #E8EAF1;
}
.charts-main {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  box-sizing: border-box;
  padding: 0px 10px 10px;
}

.charts-right {
  flex-shrink: 0;
  background-color: #FBFCFF;
  position: relative;
  width: 30px;
  transition: width 640ms linear;
  border-radius: 4px;
  &.expand {
    width: 200px;
    transition: width 180ms linear;
  }
}
.right-title {
  display: flex;
  justify-content: space-between;
  padding: 0px 8px;
  line-height: 32px;
  font-size: 14px;
  background-color: #FBFCFF;
  box-shadow: 0px 2px 4px rgba(66, 66, 66, 0.2);
  border-radius: 4px 4px 0px 0px;
    margin-bottom: 4px;
  cursor: pointer;
}
.right-icon {
  display: inline-block;
  color: #a4a4a4;
  &.expand {
    margin: 10px -2px 7px 0;
    transform: rotateZ(90deg);
  }
  &.fold {
    margin-left: 7px;
    transform: rotateZ(-90deg);
  }
}

.right-folded {
  width: 30px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
}
.folded-title {
  writing-mode: vertical-rl;
}

.right-content{
  height: 100%;
  /deep/ .scale-radio {
    display: block;
    top: 0;
    width: 100%;
    > div {
      display: flex;
      align-items: center;
      margin: 0;
      height: 36px;
      cursor: pointer;
      .radio-cricle{
        width: 14px;
        height: 14px;
        border-radius: 50%;
        display: inline-block;
        position: relative;
        border: 1px solid #e1e1e1;
        .radio-dot {
          position: absolute;
          left: 0px;
          top: 0px;
          box-sizing: border-box;
          width: 14px;
          height: 14px;
          border: 4px solid #4284F5;
          border-radius: 50%;
          background-color: unset;
        }
      }
      .text{
          top: 0px;
          left: 5px;
          font-size: 14px;
      }
    }
  }
  .right-tabs{
    height: 100%;
  }
  .right-dc-tab-item{
    height: calc(100% - 72px);
  }
}
</style>
