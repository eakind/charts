<template>
  <div class="menu-item" @mouseenter="mouseEnter" @mouseleave="mouseLeave">
    <span class="item-txt">{{ txt }}</span>
    <span class="iconfont" :class="[icon, isColor, isRotate]"></span>
    <el-collapse-transition>
      <slot v-if="isSlot"></slot>
    </el-collapse-transition>
  </div>
</template>
<script>
export default {
  data () {
    return {
      isSlot: false,
    };
  },
  props: {
    txt: {
      type: String,
    },
    icon: {
      type: String,
    },
    iconType: {
      type: String,
      default: '',
    },
  },
  computed: {
    isColor () {
      return `icon-${this.iconType}`;
    },
    isRotate () {
      return this.txt === '下钻' ? 'is-rotate' : '';
    }
  },
  components: {},
  mounted () {},
  methods: {
    mouseEnter () {
      this.isSlot = true;
    },
    mouseLeave () {
      this.isSlot = false;
    },
  },
};
</script>
<style lang='scss' scoped>
.menu-item {
  border-top: 1px solid #e1e1e1;
  cursor: pointer;
  .item-txt {
    font-size: 14px;
    color: #424242;
    font-weight: bold;
  }
  .iconfont {
    right: 10px;
    color: #a4a4a4;
    position: absolute;
  }
  .icon-db_triangle {
    transform: rotate(-90deg);
    display: inline-block;
  }
  .icon-db_plus {
    color: #4284f5;
  }
  .icon-warn {
    color: #f5282d;
  }
  .icon-db_trash {
    color: #f5282d;
  }
  .icon-db_sort {
    color: #4284f5;
  }
  .icon-db_up{
    color: #4284f5;
  }
  .is-rotate{
    transform: rotate(180deg);
    display: inline-block;
  }
}
</style>
