<template>
  <div class="tooltip-name">
    <div class="header">
      <span class="color">字段</span>
      <span class="reset" @click="reset">恢复默认</span>
    </div>
    <div class="list">
      <template v-for="(item, index) in tooltipList">
        <div
          class="tooltip-item"
          :class="selectIndex === index ? 'item-active' : ''"
          :key="item.key"
          @click="selectTooltip(index)"
        >
          <span class="title">{{ item.key }}</span>
          <input
            placeholder="显示名称"
            :value="item.title"
            @input="inputProcess($event.target.value, index)"
            v-if="!isLabel"
          />
          <!-- <span v-else-if="isLabel && showTitleFlag">{{ item.key }}</span> -->
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  data () {
    return {
      tooltipList: [],
      selectIndex: 0,
    };
  },
  props: {
    isLabel: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Object,
    },
  },
  computed: {
    ...mapState('drawingboard', ['canvasType']),
    isNoModify () {
      return this.isLabel ? 'no-modify' : '';
    },
  },
  watch: {
    list: {
      handler (list) {
        if (!list) return;
        this.tooltipList = JSON.parse(JSON.stringify(list));
      },
      deep: true,
      immediate: true,
    },
  },
  mounted () {},
  methods: {
    selectTooltip (index) {
      if (this.selectIndex === index) return;
      this.selectIndex = index;
      this.$emit('change', this.selectIndex);
    },
    // changeTitle (value) {
    //   this.$emit('changeTitle', value, this.selectIndex);
    // },
    reset () {
      this.tooltipList.map((i) => {
        i.title = i.key;
      });
      this.$emit('on-reset', this.tooltipList);
    },
    inputProcess (value, index) {
      this.$set(this.tooltipList[index], 'title', value);
      this.$emit('on-reset', this.tooltipList);
    },
  },
};
</script>
<style lang="scss" scoped>
.tooltip-name {
  .header {
    position: relative;
  }
  .reset {
    right: 0px;
    color: #a4a4a4;
    cursor: pointer;
    text-decoration: underline;
    position: absolute;
  }
  .list {
    padding: 0px 8px 0px 0px;
    width: 100%;
    height: 450px;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
  }
  .item-active {
    background-color: #4284f5;
    span {
      color: white;
    }
  }
}
.tooltip-item {
  padding: 5px;
  width: 100%;
  margin: 10px 0px;
  cursor: pointer;
  border-radius: 4px;
  background-color: #f2f2f2;
  span {
    color: #666666;
    padding: 5px 0px;
    display: block;
    font-size: 14px;
  }
  > input {
    width: 100%;
    height: 35px;
    line-height: 35px;
    border: 1px solid #e1e1e1;
    border-radius: 3px;
    padding: 0px 5px;
    outline: none;
    box-sizing: border-box;
    color: #666666;
  }
}
</style>
