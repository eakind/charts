<template>
  <div class="sort-wrap">
      <!-- 排序 -->
    <dc-alert
      class="capsule-sort-box dc-dialog-box"
      :appendToBody="true"
      :enabled="true"
      :zIndex="100"
    >
      <div class="dc-dialog-header">
        <div class="title title-large">排序</div>
        <div class="iconfont icon-db_plus" @click="closeHandler"></div>
      </div>
      <div class="dc-dialog-body">
        <div class="flex">
          <div class="title">特征名称:{{ item.name }}</div>
          <a class="clear" @click="clearSort">清除排序</a>
        </div>
        <div class="sort-style-box flex">
          <template v-for="i in sortStyle">
            <div :key="i.name" class="flex">
              <div
                class="s-icon"
                :class="i.ascending === curAscending ? 'active' : ''"
                @click="curAscending = i.ascending"
              ></div>
              <div class="s-label">{{ i.label }}</div>
            </div>
          </template>
        </div>
        <div class="sort-content-box">
          <div class="title">排序依据</div>
          <div class="sort-base-box">
            <template v-for="(i, idx) in sortBase">
              <div :key="i.value" class="base-item">
                <div class="flex">
                  <div
                    class="s-icon"
                    :class="i.value === curSortBase ? 'active' : ''"
                    @click="curSortBase = i.value"
                  ></div>
                  <div class="s-label">{{ i.label }}</div>
                </div>
                <template v-if="idx === 2">
                  <field-sort
                    @change="fieldSortChange"
                    :item="item.order || {}"
                    :disabled="curSortBase !== 'COLUMN'"
                  ></field-sort>
                </template>
                <template v-if="idx === 3">
                  <manual-sort
                    :item="item"
                    :disabled="curSortBase !== 'CUSTOM'"
                    @manualChange="manualChange"
                  ></manual-sort>
                </template>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="dc-dialog-footer">
        <div class="sure-btn" @click="comfirmHandler">确定</div>
        <div class="cancel-btn" @click="closeHandler">取消</div>
      </div>
    </dc-alert>
  </div>
</template>
<script>
import dcAlert from '@/components/dcalert/dcAlert.vue';
import fieldSort from './capsuleSort/field.vue';
import manualSort from './capsuleSort/manual.vue';
export default {
  name: 'capsuleSort',
  components: { dcAlert, fieldSort, manualSort },
  props: {
    item: {
      type: Object,
      default: (_) => {},
    },
  },
  watch: {
    item: {
      handler (val) {
        let order = val.order || {};
        this.curSortBase = order.by || 'LETTER';
        this.curAscending =
          typeof order.ascending === 'undefined' ? true : order.ascending;
      },
      immediate: true,
      deep: true,
    },
  },
  data () {
    return {
      sortStyle: [
        {
          label: '升序 (默认)',
          ascending: true,
        },
        {
          label: '降序',
          ascending: false,
        },
      ],
      sortBase: [
        {
          label: this.$t('message.letter') + '默认',
          value: 'LETTER',
        },
        {
          label: this.$t('message.source_order'),
          value: 'DATA',
        },
        {
          label: this.$t('message.field'),
          value: 'COLUMN',
        },
        {
          label: this.$t('message.manual_appoint'),
          value: 'CUSTOM',
        },
      ],
      curItem: {},
      curSortBase: 'LETTER',
      curAscending: true,
    };
  },

  methods: {
    closeHandler () {
      this.$emit('close');
    },
    comfirmHandler () {
      this.$set(this.curItem, 'by', this.curSortBase);
      this.$set(this.curItem, 'ascending', this.curAscending);
      this.$emit('sortChange', this.curItem);
      this.$emit('close');
    },
    fieldSortChange (order) {
      this.$set(this.curItem, 'col', order.col);
      this.$set(this.curItem, 'query', order.query);
    },
    manualChange (val) {
      this.$set(this.curItem, 'categories', val);
    },
    clearSort () {
      this.$emit('clearSort');
      this.$emit('close');
    },
  },
};
</script>
<style lang="scss" scoped>
@import './countList/style/index.scss';
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sort-wrap {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .6);
  z-index: 5;
}
.capsule-sort-box {
  min-width: 560px;
  max-width: 768px;
  max-height: 702px;
  background-color: #fff;
  padding: 16px;
  .clear {
    font-size: 14px;
    color: #4284f5;
    text-decoration: underline;
    cursor: pointer;
  }

  .sort-style-box {
    padding: 0.8em 0.5em;
    border-bottom: 1px solid #e1e1e1;
    & > div {
      flex: 1;
      text-align: left;
    }
    .flex {
      justify-content: flex-start;
    }
  }

  .s-icon:not(.active) {
    border: 2px solid #a4a4a4;
  }

  .sort-content-box {
    padding: 0 0.5em;
    color: #666666;
    .sort-base-box {
      padding: 0.5em;
    }
    .base-item > .flex {
      justify-content: flex-start;
    }
    .base-item + .base-item {
      margin-top: 0.8em;
    }
  }
}
</style>
