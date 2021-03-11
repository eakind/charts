<template>
  <div class="text-module flex">
    <div class="title">{{ title }}</div>
    <div class="flex font-box">
      <div
        v-for="(i, index) in iconList"
        :key="index"
        class="item"
        :class="getClassName(index)"
        @click="clkProcess(index)"
      >
        <span class="iconfont" :class="i"></span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'textFontModule',
  props: {
    val: {
      type: [String, Array],
      default: '',
    },
    type: {
      type: String,
      default: 'font', // 字形  / 对齐 align
    },
    title: {
      type: String,
      default: '文本字形',
    },
  },
  computed: {
    iconList () {
      let defaultIconList = [
        'icon-db_bold',
        'icon-db_itallic',
        'icon-db_underline',
      ];
      if (this.type === 'align') {
        defaultIconList = [
          'icon-db_textLeft',
          'icon-db_textCenter',
          'icon-db_textRight',
        ];
      }
      return defaultIconList;
    },
    styleList () {
      let tempList = ['bold', 'italic', 'underline'];
      if (this.type === 'align') {
        tempList = ['left', 'center', 'right'];
      }
      return tempList;
    },
  },
  methods: {
    getClassName (idx) {
      if (typeof this.val === 'string') {
        return this.styleList[idx] === this.val ? 'active' : '';
      }
      return this.val.indexOf(this.styleList[idx]) > -1 ? 'active' : '';
    },
    clkProcess (idx) {
      this.$emit('update:val', this.styleList[idx]);
    },
  },
};
</script>
<style lang="scss" scoped>
.flex {
  display: flex;
  align-items: center;
}
.text-module {
  font-size: 12px;
  margin-bottom: 0.8em;

  .title {
    font-weight: bold;
    color: hsl(0, 0%, 40%);
    margin-right: 0.8em;
  }
  .font-box {
    width: 10em;
    border-radius: 4px;
    background: hsl(0, 0%, 100%);
    border: 1px solid hsl(0, 0%, 87.1%);
    // margin-left: 16px;
    .item {
      // width: 2.66em;
      // height: 2.66em;
      flex: 1;
      text-align: center;
      text-align: center;
      line-height: 2.66em;
      cursor: pointer;
      span {
        color: hsl(0, 0%, 87.1%);
        font-size: 14px;
      }
    }
    .item.active {
      span {
        color: hsl(217.9, 89.9%, 61%);
      }
    }
  }
}
</style>
