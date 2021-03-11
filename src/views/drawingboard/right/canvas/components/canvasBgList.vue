<template>
  <div class="canvas-bg-list">
    <div class="list first-child">
      <span
        class="list-item"
        :class="selectIndex === index ? 'is-active' : ''"
        v-for="(item, index) in colorList"
        :key="index"
        :style="item"
        @click="selectColor(item, index)"
      >
        <span>T</span>
      </span>
    </div>
    <div class="list">
      <span
        class="list-item"
        :class="selectIndex === index + colorList.length ? 'is-active' : ''"
        v-for="(item, index) in picList"
        :key="index"
        :style="setStyle(item)"
        @click="selectColor(item, index)"
      ></span>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  data () {
    return {
      selectIndex: 0,
    };
  },
  props: {
    index: {
      type: Number,
    },
  },
  watch: {
    index: {
      handler (value) {
        this.selectIndex = value;
      },
      immediate: true,
    },
  },
  computed: {
    ...mapState('colors', ['colorTemp']),
    picList () {
      return this.colorTemp.filter((item) => item.backgroundIcon);
    },
    colorList () {
      return this.colorTemp.filter((item) => !item.backgroundIcon);
    },
  },
  components: {},
  mounted () {},
  methods: {
    setStyle (item) {
      return {
        background: `url(${item.backgroundIcon})`,
        color: item.color,
      };
    },
    selectColor (item) {
      let colorItem = JSON.parse(JSON.stringify(item));
      let len = this.colorTemp.length;
      let list = this.colorTemp;
      for (let i = 0; i < len; i++) {
        if (item.background === list[i].background) {
          this.selectIndex = i;
          colorItem.color = list[i].color;
        }
      }
      colorItem.index = this.selectIndex;
      this.$emit('change', colorItem);
    },
  },
};
</script>
<style lang="scss" scoped>
.canvas-bg-list {
  .list {
    display: flex;
    flex-wrap: wrap;
  }
  .list-item {
    width: 22px;
    height: 22px;
    margin: 2px 5px;
    text-align: center;
    border-radius: 3px;
    border: 2px solid white;
    display: inline-block;
    cursor: pointer;
  }
  .first-child .list-item:not(.active):first-child {
    border: 1px solid #dedede;
  }

 .list .list-item.is-active {
   border-width: 2px !important;
    border-color: #4284f5 !important;
  }
}
</style>
