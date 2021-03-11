<template>
  <div class="shape-item" :class="itemActive">
    <dc-radio :active="itemActive"></dc-radio>
    <span class="iconfont" :class="item.icon"></span>
    <span class="">{{fillTxt}}</span>
  </div>
</template>
<script>
import DcRadio from '@/components/dcradio/dcRadio.vue';
export default {
  data () {
    return {
    };
  },
  props: {
    item: {
      type: Object
    },
    select: {
      type: Number,
    },
    index: {
      type: Number
    }
  },
  computed: {
    fillTxt () {
      let obj = {
        fill: '实心',
        shu: '竖线',
        heng: '横线',
        zuo: '斜线(上)',
        you: '斜线(下)',
        ge: '横竖交叉',
        zha: '斜线交叉',
        empty: '空心'
      };
      return obj[this.item.value];
    },
    itemActive () {
      return this.select === this.index ? 'item-active' : false;
    }
  },
  components: {
    DcRadio
  },
  mounted () {
  },
  methods: {
  }
};
</script>
<style lang='scss' scoped>
.shape-item {
  padding: 5px 10px;
  height: 36px;
  line-height: 30px;
  border-radius: 4px;
  margin: 10px 0px;
  box-sizing: border-box;
  background: #F2F2F2;
  display: flex;
  cursor: pointer;
  align-items: center;
  .iconfont{
    margin: 0px 5px 0px 10px;
    font-size: 16px;
  }
  .fill {
    width: 16px;
    height: 16px;
    top: 0px;
    position: relative;
  }
  .empty{
    height: 16px;
    width: 16px;
    top: 0px;
    position: relative;
  }
}
.item-active{
  background-color: white;
  .iconfont {
    color: #4284f5;
  }
  .fill {
    background-color: #4284f5!important;
    border: 2px solid #4284f5!important;
  }
  .empty {
    border: 2px solid #4284f5!important;
  }
}
</style>
