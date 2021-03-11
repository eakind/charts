<template>
  <div class="dc-type-list" v-click-out="hide">
    <div
      class="type-list-item"
      @mouseenter.stop="mouseEnter($event, item, index)"
      @click="selectInt(item, index)"
      v-for="(item, index) in list"
      :key="index"
      :class="[timeFlag && item === $t('message.time') ? 'type-active' : '', geoFlag&&item===$t('message.spatial_variable') ? 'type-active' : '', setTip(item) ? 'suggest-tip' : '']"
    >
      {{item}}
      <span
        class="iconfont icon-db_arrow"
        v-if="item === $t('message.spatial_variable') || item === $t('message.time')"
      ></span>
    </div>
    <div class="time-panel" ref="timeRef" v-show="timeFlag">
      <span
        class="time-item"
        v-for="(item, index) in timeList"
        @click="selectTime(item, index)"
        :key="index"
      >{{item.name}}</span>
    </div>
    <div class="geo-panel" ref="geoRef" v-show="geoFlag">
      <span
        class="geo-item"
        v-for="(item, index) in geoList"
        @click="selectGeo(item, index)"
        :key="index"
      >{{item.name}}</span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      timeList: [{
        name: 'AUTO'
      },
      {
        name: 'YYYY-MM-DD HH:MI:SS'
      },
      {
        name: 'YYYY-MM-DD HH:MI:SS.FFFF'
      },
      {
        name: 'MM/DD/YYYY HH:MI:SS'
      },
      {
        name: 'MM/DD/YY HH:MI:SS'
      },
      {
        name: 'YYYY-MM-DD'
      },
      {
        name: 'MM/DD/YYYY'
      },
      {
        name: 'MM/DD/YY'
      },
      {
        name: 'YYYYMMDD'
      },
      {
        name: 'HH:MI'
      },
      {
        name: 'HH:MI:SS'
      },
      {
        name: 'HH:MI:SS'
      },
      {
        name: 'HH:MI:SS PM'
      },
      {
        name: '下午 HH:MI:SS'
      }],
      geoList: [],
      timeFlag: false,
      geoFlag: false
    };
  },
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      }
    },
    typeCode: {
      type: String
    },
    sugType: {
      type: [String, Object]
    }
  },
  methods: {
    hide () {
      this.timeFlag = false;
      this.geoFlag = false;
      this.$emit('hide');
    },
    setTip (item) {
      let temp = '';
      switch (this.sugType) {
        case 'FLOAT':
          temp = this.$t('message.float');
          break;
        case 'INT':
          temp = this.$t('message.int');
          break;
        case 'DATETIME':
          temp = this.$t('message.time');
          break;
        case 'MAP':
        case 'CITY':
        case 'PROVINCE':
        case 'DISTRICT':
        case 'AREACODE':
        case 'ZIPCODE':
          temp = this.$t('message.spatial_variable');
          break;
      }
      return item === temp;
    },
    mouseEnter (event, item, index) {
      let secondMenu;
      switch (item) {
        case this.$t('message.time'):
          this.timeFlag = true;
          this.geoFlag = false;
          break;
        case this.$t('message.spatial_variable'):
          this.timeFlag = false;
          this.geoFlag = true;
          if (this.typeCode === 'STRING') {
            this.geoList = [
              {
                name: this.$t('message.province'),
                code: 'PROVINCE'
              },
              {
                name: this.$t('message.city'),
                code: 'CITY'
              },
              {
                name: this.$t('message.district'),
                code: 'DISTRICT'
              }
            ];
          } else {
            this.geoList = [
              {
                name: this.$t('message.zip_code'),
                code: 'ZIPCODE'
              },
              {
                name: this.$t('message.area_code'),
                code: 'AREACODE'
              }
            ];
          }
          break;
        default:
          this.timeFlag = false;
          this.geoFlag = false;
          break;
      }
      secondMenu = event.target.getBoundingClientRect().top;
      this.$nextTick(() => {
        if (this.timeFlag) {
          this.setPos(this.$refs.timeRef, secondMenu);
        }
        if (this.geoFlag) {
          this.setPos(this.$refs.geoRef, secondMenu);
        }
      });
    },
    setPos (dom, topVal) {
      let panelWidth = this.$el.parentNode.clientWidth;
      let rightWidth = dom.getBoundingClientRect().right;
      let elTop = this.$el.getBoundingClientRect().top;
      let width = dom.clientWidth;
      if ((panelWidth + width) < rightWidth) {
        dom.style.left = -width + 'px';
      }
      dom.style.top = (topVal - elTop) + 'px';
    },
    selectTime (item) {
      this.$emit('change', item.name, 'time');
    },
    selectInt (item) {
      let code = '';
      switch (item) {
        case this.$t('message.string'):
          code = 'STRING';
          break;
        case this.$t('message.int'):
          code = 'INT';
          break;
        case this.$t('message.float'):
          code = 'FLOAT';
          break;
      }
      if (code) {
        this.$emit('change', item, code);
      }
    },
    selectGeo (item) {
      this.$emit('change', item.code, 'geo');
    }
  }
};
</script>

<style scoped lang="scss">
.dc-type-list {
  width: 159px;
  border-bottom: 1px solid #e1e1e1;
  background-color: white;
  display: inline-block;
  padding-bottom: 4px;
  border-radius: 4px;
  position: fixed;
  left:-1000px;
  z-index: 9999;
  .type-active {
    background-color: #e1e1e1;
  }
  .type-list-item {
    padding: 6px 10px;
    position: relative;
    color: #424242;
    font-size: 14px;
    height: 36px;
    box-sizing: border-box;
    line-height: 24px;
    cursor: pointer;
    &:hover {
      background-color: #e1e1e1;
    }
    .iconfont {
      color: #a4a4a4;
      right: 10px;
      top: 8px;
      position: absolute;
    }
  }
  .time-panel {
    background-color: white;
    border: 1px solid #dedede;
    position: absolute;
    left: 160px;
    top: 0px;
    .time-item {
      padding: 3px 10px;
      font-size: 14px;
      display: block;
      height: 36px;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      line-height: 30px;
      cursor: pointer;
      &:hover {
        background-color: #e1e1e1;
      }
    }
  }
  .geo-panel {
    width: 160px;
    background-color: white;
    border: 1px solid #dedede;
    position: absolute;
    left: 160px;
    top: 70px;
    padding-bottom: 4px;
    border-radius: 0 0 4px 4px;
    .geo-item {
      padding: 3px 10px;
      font-size: 14px;
      display: block;
      height: 36px;
      box-sizing: border-box;
      line-height: 30px;
      cursor: pointer;
      &:hover {
        background-color: #e1e1e1;
      }
    }
  }
  .suggest-tip {
    color: #4284f5;
  }
}
</style>
