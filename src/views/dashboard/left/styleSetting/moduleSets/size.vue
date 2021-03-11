<template>
  <div class="size-module">
    <div class="flex">
      <div class="title size">大小</div>
      <dc-select
        class="no-border"
        :list="list"
        v-model="curVal"
        @change="change"
      ></dc-select>
    </div>
    <template v-if="curVal === 'fixedWidth'">
      <div class="fixed-box">
        <div class="flex">
          <span class="title">宽</span>
          <input type="number" v-model="curWidth" @change="change" />
        </div>
        <span class="title">高度不限制</span>
      </div>
    </template>
    <template v-else-if="curVal === 'common'">
      <dc-select
        class="common-box"
        :list="commonSize"
        v-model="curSize"
        @change="sizeChangeProcess"
      ></dc-select>
    </template>
    <template v-else>
      <div class="define-box flex">
        <span class="title">宽</span>
        <input
          type="number"
          v-model="curWidth"
          @input="inputProcess('curWidth', $event.target.value)"
        />
        <span class="title">高</span>
        <input
          type="number"
          v-model="curHeight"
          @input="inputProcess('curHeight', $event.target.value)"
        />
      </div>
    </template>
  </div>
</template>
<script>
import dcSelect from '@/components/newSelect/index.vue';
import sizeMixins from './mixins/size.js';
export default {
  name: 'sizeModule',
  components: {
    dcSelect,
  },
  mixins: [sizeMixins],
  props: {
    modeType: {
      type: String,
      default: 'fixedWidth',
    },
    sizeObj: {
      type: Object,
      default: (_) => {
        return {
          width: 1366,
          height: 768,
        };
      },
    },
  },
  watch: {
    sizeObj: {
      handler (val) {
        this.curWidth = val.width;
        this.curHeight = val.height;
        let match = this.commonSize.find(
          (i) => i.size.height === val.height && i.size.width === val.width
        );
        if (match) {
          this.curSize = match.value;
        }
      },
      immediate: true,
      deep: true,
    },
    modeType: {
      handler (val) {
        this.curVal = val;
      },
      immediate: true,
    },
  },
  data () {
    return {
      curVal: 'fixedWidth',
      curWidth: 1366,
      curHeight: 768,
      curSize: 0,
    };
  },
  methods: {
    change (val) {
      this.$emit('changeSize', {
        width: this.curWidth,
        height: this.curHeight,
        modeType: this.curVal,
      });
    },
    sizeChangeProcess (val) {
      let match = this.commonSize.find((i) => i.value === val);
      if (match) {
        this.curWidth = match.size.width;
        this.curHeight = match.size.height;
      }
      this.$emit('changeSize', {
        width: this.curWidth,
        height: this.curHeight,
        modeType: this.curVal,
      });
    },
    inputProcess (attr, val) {
      this[attr] = val;
      this.$emit('changeSize', {
        width: this.curWidth,
        height: this.curHeight,
        modeType: this.curVal,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import './style/index.scss';
.flex {
  display: flex;
  align-items: center;
}

.size-module {
  font-size: 12px;
  margin-bottom: 0.8em;
  .title.size {
    width: 2em;
  }
  .title {
    font-weight: bold;
    color: hsl(0, 0%, 40%);
    margin-right: 0.8em;
    width: 2em;
  }
  .fixed-box,
  .define-box,
  .common-box {
    margin-left: 2em;
    margin-top: 0.8em;
    color: hsl(0, 0%, 40%);
  }
  input {
    width: calc(100% - 2em);
    padding: 0.2em;
    background-color: hsl(0, 100%, 100%);
    outline: none;
    border: none;
    appearance: none;
    border-radius: 4px;
    background: hsl(0, 0%, 100%);
    border: 1px solid hsl(0, 0%, 87.1%);
    margin-bottom: 0.4em;
  }

  .define-box {
    input {
      width: 4em;
    }
    span {
      margin-left: 0.2em;
    }
  }
  // .common-box.el-select {
  //   width: 160px;
  // }
}
</style>
