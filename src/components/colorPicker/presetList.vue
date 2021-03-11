<template>
  <div class="preset-box">
    <div class="default-color flex">
      <span class="title">默认</span>
      <div
        class="item"
        :class="selectIndex === -1 ? 'is-active' : ''"
        @click="selectDefault()"
      >
        T
      </div>
    </div>
    <div class="list flex">
      <div
        class="item"
        :class="selectIndex === index ? 'is-active' : ''"
        v-for="(item, index) in colorList"
        :key="index"
        :style="item"
        @click="selectColor(item, index)"
      >
        <span>T</span>
      </div>
    </div>
    <div class="list flex">
      <div
        class="item"
        :class="selectIndex === index + colorList.length ? 'is-active' : ''"
        v-for="(item, index) in picList"
        :key="index"
        :style="setStyle(item)"
        @click="selectColor(item, index)"
      ></div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  name: 'presetList',
  props: ['idx'],
  watch: {
    idx: {
      handler (val) {
        this.selectIndex = val;
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
      return this.colorTemp
        .filter((item) => !item.backgroundIcon)
        .filter((i) => i.background !== '#FFFFFF');
    },
  },
  data () {
    return {
      selectIndex: -1,
    };
  },
  methods: {
    setStyle (item) {
      return {
        background: `url(${item.backgroundIcon})`,
        color: item.color,
      };
    },
    selectDefault () {
      let colorItem = JSON.parse(JSON.stringify(this.colorTemp[0]));
      colorItem.index = 0;
      this.selectIndex = -1;
      this.$emit('change', colorItem);
    },
    selectColor (item) {
      let colorItem = JSON.parse(JSON.stringify(item));
      let len = this.colorTemp.length;
      let list = this.colorTemp;
      for (let i = 0; i < len; i++) {
        if (item.background === list[i].background) {
          this.selectIndex = i - 1;
          colorItem.color = list[i].color;
        }
      }
      colorItem.index = this.selectIndex + 1;
      this.$emit('change', colorItem);
    },
  },
};
</script>
<style lang="scss" scoped>
.flex {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.default-color {
  margin-left: 0.9em;
}
.list {
  justify-content: center;
}
.item {
  display: block;
  width: 2em;
  height: 2em;
  border-radius: 4px;
  background: hsl(0, 0%, 100%);
  border: 1px solid hsl(0, 0%, 87.1%);
  line-height: 2em;
  margin-right: 0.4em;
  margin-top: 0.6em;
  border: 1px solid hsl(0, 0%, 87.1%);
  cursor: pointer;
}
.is-active {
  border-color: #4284f5;
}

.preset-box {
  height: 210px;
  font-size: 12px;
  background-color: hsl(0, 100%, 100%);
  padding: 7px 6px;
  .title {
    color: hsl(0, 0%, 64.3%);
    margin-right: 0.8em;
  }
}
</style>
