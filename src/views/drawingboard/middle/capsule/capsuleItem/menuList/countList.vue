<template>
  <div class="count-list">
    <template v-for="i in countList">
      <div @click="showCountBox(i)" :key="i.type" :class="activeClass(i)">
        {{ i.name }}
      </div>
    </template>
    <div class="count-remove" v-if="item.rate" @click="removeCount">
      <span class="iconfont icon-db_minus">移除计算</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: (_) => {},
    },
    type: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      show: false,
      countList: [
        {
          name: '同比',
          type: 'ON',
        },
        {
          name: '环比',
          type: 'RING',
        },
      ],
    };
  },
  mounted () {},
  methods: {
    activeClass (i) {
      if (!this.item.rate) {
        return '';
      }
      return this.item.rate.type === i.type ? 'active' : '';
    },
    showCountBox (i) {
      this.$emit('show-count-box', i.type, this.type);
    },
    removeCount () {
      this.$emit('remove-count');
    }
  },
};
</script>
<style lang='scss' scoped>
.count-list {
  right: -121px;
  top: 0px;
  width: 120px;
  box-shadow: 0 6px 14px 0 rgba(0, 0, 0, 0.1);
  border-radius: 0 0 4px 4px;
  background-color: white;
  position: absolute;
  > div {
    height: 36px;
    line-height: 36px;
    padding: 0px 10px;
    &:hover {
      color: #4284f5;
    }
  }
  > div.active {
    color: #4284f5;
  }
  .count-remove {
    font-size: 16px;
    color: #424242;
    position: relative;
    .icon-db_minus{
      &::before{
        position: absolute;
        right: 8px;
        color: #a4a4a4;
      }
    }
  }
}
</style>
