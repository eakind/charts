<template>
  <div class="dc-color-list">
    <div
      class="bg-item"
      v-show="index >= start"
      :style="[{width: size, height: size, lineHeight: size, margin: margin}, setColor(item)]"
      v-for="(item, index) in colorTemp"
      :key="index"
      @click="selectColor(index)"
      :class="selectColorIndex===index ? 'bg-item-active' : ''"
    >
      <span v-if="index<13" class="iconfont icon-db_text" :style="{fontSize: fontSize}"></span>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  components: {},
  props: {
    index: {
      type: Number,
      defalut: 0
    },
    size: {
      type: String,
      default: '48px'
    },
    fontSize: {
      type: String,
      default: '16px'
    },
    margin: {
      type: String,
      default: '5px'
    },
    start: {
      type: [String, Number],
      default: 1
    }
  },
  data () {
    return {
      selectColorIndex: this.index
    };
  },
  watch: {
    index () {
      this.selectColorIndex = this.index;
    }
  },
  computed: {
    ...mapState('colors', ['colorTemp']),
  },
  mounted () {
    this.selectColorIndex = this.index;
  },
  methods: {
    setColor (item) {
      if (item.backgroundIcon) {
        let obj = {
          background: 'url(' + item.backgroundIcon + ')',
          color: item.color
        };
        return obj;
      } else {
        return item;
      }
    },
    selectColor (index) {
      this.selectColorIndex = index;
      this.$emit('change', index);
    }
  }
};
</script>
<style lang='scss' scoped>
.dc-color-list {
  padding: 0px;
  margin: 0px 0px 5px 0px;
  display: flex;
  flex-wrap: wrap;
  .bg-item {
    height: 48px;
    width: 48px;
    line-height: 48px;
    text-align: center;
    border: 1px solid white;
    border-radius: 4px;
    margin: 5px;
    cursor: pointer;
    background-size: cover;
    display: inline-block;
    &:hover {
      border: 1px solid #4284f5;
    }
  }
  .bg-item-active {
    border: 1px solid #4284f5 !important;
  }
}
</style>
