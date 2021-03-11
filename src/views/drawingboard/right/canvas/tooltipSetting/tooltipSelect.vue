<template>
  <div class="dc-select-view"  @click="showListHandler" :style="{width: width}">
    <span class="select-view-title">{{selected}}</span>
    <span class="iconfont icon-db_triangle" :class="showList ? 'rotated' : ''"></span>
    <div class="dc-select-view-list"  v-if="showList" v-click-out="hide">
      <ul >
        <li v-for="(item, index) in list" :key="index" :class="selected == item.name ? 'view_active' : ''"
            @click="selectItem(item)">{{item.name}}</li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    list: {
      type: Array,
      default: function () {
        return [{ name: '', id: '' }, { name: '', id: '' }];
      }
    },
    select: {
      type: [String, Object],
      default: ''
    },
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showList: false,
      selected: '',
      unitsObj: {
        '': '',
        K: `K ${this.$i18n.t('message.thousand')}`,
        M: `M ${this.$i18n.t('message.million')}`,
        G: `G ${this.$i18n.t('message.billion')}`,
        T: `T ${this.$i18n.t('message.myriads')}`,
      },
      negativeObj: {
        1: '1234-',
        0: '(1234)',
        '-1': '-1234'
      },
      zoneObj: {
        CN: `¥ ${this.$i18n.t('message.rmb')}`,
        JP: `￥ ${this.$i18n.t('message.jpy')}`,
        HK: `HK$ ${this.$i18n.t('message.hkd')}`,
        US: `＄ ${this.$i18n.t('message.usd')}`,
        EUR: `€ ${this.$i18n.t('message.euro')}`,
        GBP: `£ ${this.$i18n.t('message.gbp')}`
      }
    };
  },
  watch: {
    select: {
      handler (val) {
        let list = this.list;
        for (let i = 0; i < list.length; i++) {
          if (this.unitsObj[val] && this.type === 'unit') {
            this.selected = this.unitsObj[val];
          } else if (this.negativeObj[val] && this.type === 'negative') {
            this.selected = this.negativeObj[val];
          } else if (this.zoneObj[val] && this.type === 'zone') {
            this.selected = this.zoneObj[val];
          } else if (val === list[i].name || val === list[i].id) {
            this.selected = list[i].name;
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted () {
  },
  methods: {
    showListHandler () {
      this.showList = !this.showList;
    },
    hide () {
      setTimeout(() => {
        this.showList = false;
      }, 0);
    },
    selectItem (item) {
      this.selected = item.name;
      this.$emit('change', item);
    }
  }
};
</script>

<style scoped lang="scss">
.dc-select-view{
  height: 30px;
  line-height: 30px;
  text-align: left;
  border: 1px solid #a4a4a4;
  border-radius: 4px;
  position: relative;
  cursor: pointer;
  font-size: 14px;
  min-width: 80px;
  background-color: white;
  display: inline-block;
  .select-view-title{
    display: inline-block;
    width: 80%;
    text-indent: 10px;
    @include ellipsis;
  }
  span{
    color: #424242;
  }
  .dc-select-view-list{
    z-index: 3002;
    width: 100%;
    max-height: 100px;
    overflow-y: auto;
    overflow-x: hidden;
    border-radius: 3px;
    border: 1px solid #a4a4a4;
    top: 30px;
    position: absolute;
    background-color: white;
    ul{
      list-style-type: none;
      margin: 0px;
      padding: 0px;
      width: 101%;
      left: -1px;
      position: relative;
      li{
        margin: 0px;
        height: 30px;
        line-height: 30px;
        padding: 0px 10px;
        box-sizing: border-box;
        text-align: left;
        text-indent: 0px;
        @include ellipsis;
      }
      .view_active{
        color: white;
        border: 1px solid #4284f5;
        background-color: #4284f5;
      }
    }
  }
  .icon-db_triangle{
    color: #a4a4a4;
    display: inline-block;
    position: absolute;
    top: 0px;
    right: 5px;
  }
  .rotated{
     transform: rotate(180deg)
  }
}
</style>
