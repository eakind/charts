<template>
  <!-- 手动排序 -->
  <div class="manual-wrap flex" :class="disabled ? 'disabled' : ''">
    <div class="manual-box">
      <template v-for="(i, idx) in list">
        <div
          @click="!disabled && (selVal = i.name)"
          :key="idx"
          :class="selVal === i.name ? 'active' : ''"
        >
          {{ i.name }}
        </div>
      </template>
    </div>
    <div class="btn-group">
      <div
        @click="exchange('up')"
        :class="list.findIndex((i) => i.name === selVal) > 0 ? '' : 'disabled'"
      >
        上移
      </div>
      <div
        @click="exchange('down')"
        :class="
          list.findIndex((i) => i.name === selVal) < list.length - 1
            ? ''
            : 'disabled'
        "
      >
        下移
      </div>
    </div>
  </div>
</template>
<script>
import { get } from '@/api/server.js';
import { mapState } from 'vuex';
export default {
  name: 'manualSort',
  data () {
    return {
      list: [],
      selVal: '',
    };
  },
  props: {
    disabled: {
      type: Boolean,
      default: true,
    },
    item: {
      type: Object,
      default: (_) => {},
    },
    // categories: {
    //   type: Array,
    //   default: (_) => [],
    // },
  },
  computed: {
    ...mapState('project', ['projectId']),
    ...mapState('drawingboard', ['aggrList', 'catList']),
  },
  watch: {
    item: {
      handler (val) {
        if (
          val.order &&
          val.order.categories &&
          val.order.categories.length > 0
        ) {
          this.list = JSON.parse(JSON.stringify(val.order.categories));
          return;
        }
        this.getUniqueData(val.feature_idx);
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    async getUniqueData (feature_idx) {
      let list = [...this.catList, ...this.aggrList];
      let match = list.find((i) => i.feature_name === this.item.feature_name);
      let param = {
        project_id: this.projectId,
        feature_idx: match ? match.feature_idx : feature_idx,
        offset: 0,
        limit: 99999,
      };
      let res = await get('featureUnique', param);
      if (res && res.code === 0) {
        this.list = res.unique;
        this.$emit('manualChange', this.list);
      }
    },
    exchange (type) {
      let idx = this.list.findIndex((i) => i.name === this.selVal);
      let targetIdx = idx;
      if (type === 'up') {
        targetIdx = idx - 1;
      } else {
        targetIdx = idx + 1;
      }
      this.list.splice(idx, 1);
      this.list.splice(targetIdx, 0, { name: this.selVal });
      this.$emit('manualChange', this.list);
    },
  },
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.flex {
  display: flex;
}
.manual-wrap {
  padding-left: 1.5em;
}
.manual-box {
  background: #fff;
  border: 1px solid #dedede;
  border-radius: 4px;
  width: 27em;
  max-height: 10.2em;
  overflow-y: auto;
  margin-top: 0.8em;
  padding-left: 0.8em;
  color: #424242;
  @include scroll(#dedede, #fff);
  & > div {
    line-height: 2.57em;
    cursor: pointer;
  }
  & > div.active {
    color: #4284f5;
  }
}
.manual-wrap.disabled {
  .manual-box {
    background: #d8d8d8;
    color: #a4a4a4;
    @include scroll(#fff, #d8d8d8);
    & > div {
      cursor: not-allowed;
      color: #424242;
    }
  }
  .btn-group div {
    background: #d8d8d8;
    color: #ffffff;
    cursor: not-allowed;
  }
}
.btn-group {
  // margin-left: .5em;
  & > div {
    width: 5.7em;
    padding: 0.4em 0;
    background: #4284f5;
    border-radius: 4px;
    color: #ffffff;
    text-align: center;
    margin: 0.5em;
    cursor: pointer;
  }
  div.disabled {
    background: #d8d8d8;
    color: #ffffff;
    cursor: not-allowed;
  }
}
</style>
