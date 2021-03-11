<template>
  <div class="padding-module flex">
    <div class="title">{{ title }}</div>
    <el-popover placement="bottom" width="248">
      <padding-index
        class="top-box flex"
        :valObj="{
          isLock: curIsLock,
          val: curPadding.top,
          topVal: curPadding.top,
        }"
        position="上"
        @change="changeProcess($event, 'top')"
      ></padding-index>
      <div class="left-right-box flex">
        <padding-index
          class="left"
          :valObj="{
            isLock: curIsLock,
            val: curPadding.left,
            topVal: curPadding.top,
          }"
          position="左"
          @change="changeProcess($event, 'left')"
        ></padding-index>
        <div
          class="icon-box"
          :class="curIsLock ? '' : 'unlock'"
          @click="clockProcess"
        >
          <span class="iconfont" :class="iconClassName"></span>
        </div>
        <padding-index
          class="right"
          :valObj="{
            isLock: curIsLock,
            val: curPadding.right,
            topVal: curPadding.top,
          }"
          position="右"
          @change="changeProcess($event, 'right')"
        ></padding-index>
      </div>
      <padding-index
        class="bottom-box flex"
        :valObj="{
          isLock: curIsLock,
          val: curPadding.bottom,
          topVal: curPadding.top,
        }"
        position="下"
        @change="changeProcess($event, 'bottom')"
      ></padding-index>
      <div slot="reference" class="padding-box flex">
        <input
          v-if="curIsLock"
          type="text"
          readonly
          class="val-box"
          v-model="curPadding.top"
        />
        <span v-else
          >{{ curPadding.top }},{{ curPadding.left }},{{ curPadding.right }},{{
            curPadding.bottom
          }}px</span
        >
        <span class="iconfont icon-db_triangle"></span>
      </div>
    </el-popover>
  </div>
</template>
<script>
import paddingIndex from './padding/index.vue';
export default {
  name: 'paddingModule',
  components: {
    paddingIndex,
  },
  props: {
    title: {
      type: String,
      default: '内边距',
    },
    isLock: {
      type: Boolean,
      default: true,
    },
    padding: {
      type: Object,
      default: (_) => {
        return {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        };
      },
    },
  },

  watch: {
    isLock: {
      handler (val) {
        this.curIsLock = val;
      },
      immediate: true,
    },
    padding: {
      handler (val) {
        this.curPadding = JSON.parse(JSON.stringify(val));
      },
      immediate: true,
      deep: true,
    },
  },
  data () {
    return {
      num: 1,
      curIsLock: true,
      curPadding: { top: 0, left: 0, right: 0, bottom: 0 },
    };
  },
  computed: {
    iconClassName () {
      if (this.curIsLock) {
        return 'icon-db_finance';
      } else {
        return 'icon-db_unlock';
      }
    },
  },
  methods: {
    clockProcess () {
      this.curIsLock = !this.curIsLock;
      if (this.curIsLock) {
        let val = this.curPadding.top;
        this.$set(this.curPadding, 'left', val);
        this.$set(this.curPadding, 'right', val);
        this.$set(this.curPadding, 'bottom', val);
      }
      this.$emit('changePadding', {
        padding: this.curPadding,
        isLock: this.curIsLock,
      });
    },
    changeProcess (val, attr) {
      if (this.curIsLock) {
        this.$set(this.curPadding, 'top', val);
        this.$set(this.curPadding, 'left', val);
        this.$set(this.curPadding, 'right', val);
        this.$set(this.curPadding, 'bottom', val);
      } else {
        this.$set(this.curPadding, attr, val);
      }
      this.$emit('changePadding', {
        padding: this.curPadding,
        isLock: this.curIsLock,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.flex {
  display: flex;
  align-items: center;
}
.top-box,
.bottom-box {
  justify-content: center;
  margin-bottom: 0.8em;
  color: hsl(0, 0%, 64.3%);
  font-size: 12px;
}
.left-right-box {
  color: hsl(0, 0%, 64.3%);
  font-size: 12px;
  margin-bottom: 0.8em;
  & > div {
    margin-left: 0.3em;
    span + span {
      margin-left: 0.1em;
    }
  }
}
.icon-box {
  border-radius: 4px;
  background: hsl(217.9, 89.9%, 61%);
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  cursor: pointer;
  .iconfont {
    color: hsl(0, 0%, 100%);
    line-height: 1;
  }
}
.unlock.icon-box {
  background: hsl(0, 0%, 87.1%);
}

.padding-module {
  font-size: 12px;
  justify-content: flex-start;
  margin-bottom: 0.8em;
  cursor: pointer;
  & > span {
    display: block;
    flex: 1;
  }
  .title {
    color: hsl(0, 0%, 40%);
    font-size: 12px;
    font-weight: bold;
    margin-right: 0.8em;
  }
  .padding-box {
    // width: 13em;
    height: 2.83em;
    margin-left: 16px;
    outline: none;
    border-bottom: 1px solid hsl(0, 0%, 88.2%);
    justify-content: space-between;
    input {
      text-align: center;
    }
    .val-box {
      width: 48px;
      padding: 0.2em;
      border-radius: 4px;
      background: hsl(0, 0%, 100%);
      border: 1px solid hsl(0, 0%, 87.1%);
      outline: none;
    }
    .iconfont {
      color: #c0c4cc;
      margin-left: 0.7em;
      font-size: 10px;
    }
  }
}
</style>
