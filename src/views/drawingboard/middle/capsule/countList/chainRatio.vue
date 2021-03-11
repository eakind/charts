<template>
  <!-- 环比 -->
  <div class="chain-radio-box">
    <dc-alert
      class="dc-dialog-box"
      :appendToBody="true"
      :enabled="true"
      :zIndex="5"
    >
      <div class="dc-dialog-header">
        <div class="title title-large">计算-{{ title }}</div>
        <div class="iconfont icon-db_plus" @click="closeHandler"></div>
      </div>
      <div class="dc-dialog-body">
        <div class="title">特征名称:{{ item.name }}</div>
        <div class="select-box">
          <div class="title">选择计算方式</div>
          <div
            v-for="i in chooseList"
            class="flex"
            :key="i.name"
            @click="clkHandler(i)"
          >
            <div
              class="s-icon"
              :class="i.isGrouth === isGrouth ? 'active' : ''"
            ></div>
            <div class="s-label">{{ i.name }}</div>
          </div>
          <slot>
            <div class="default flex" v-if="showDefault">
              <div class="iconfont icon-db_alert"></div>
              <div>默认按列特征计算</div>
            </div>
          </slot>
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
import { mapState } from 'vuex';
export default {
  components: { dcAlert },
  props: {
    item: {
      type: Object,
      default: (_) => {},
    },
    countType: {
      type: String,
      default: 'RING',
    },
  },
  watch: {
    countType: {
      handler (val) {
        this.chooseList =
          val === 'RING'
            ? [
              { name: '环比', isGrouth: false },
              { name: '环比增长', isGrouth: true },
            ]
            : [
              { name: '同比', isGrouth: false },
              { name: '同比增长', isGrouth: true },
            ];
        this.title = val === 'RING' ? '环比' : '同比';
      },
      immediate: true,
    },
  },
  data () {
    return {
      chooseList: [],
      isGrouth: false,
      title: '',
    };
  },
  computed: {
    ...mapState('drawingboard', ['rowList', 'columnList']),
    showDefault () {
      let hasRowCat = this.rowList.find((i) => i.dtype === 'AGGR');
      let hasColCat = this.columnList.find((i) => i.dtype === 'AGGR');
      return (
        this.rowList.length > 0 &&
        this.columnList.length > 0 &&
        !hasRowCat &&
        !hasColCat
      );
    },
  },
  methods: {
    closeHandler () {
      this.$emit('close');
    },
    clkHandler (i) {
      this.isGrouth = i.isGrouth;
    },
    comfirmHandler () {
      let rate = {
        growth: this.isGrouth,
        type: this.countType,
      };
      this.$emit('sure', rate);
    },
  },
};
</script>
<style scoped lang="scss">
@import './style/index.scss';

.flex {
  display: flex;
  align-items: center;
  padding: 6px 0 6px 8px;
}
.chain-radio-box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 5;
}
.dc-dialog-body {
  .default {
    font-size: 14px;
    color: #a4a4a4;
    border-top: 1px solid #e1e1e1;
    .iconfont {
      margin-right: 4px;
    }
  }

  .select-box {
    padding: 8px;
    background: #e7ebf2;
    border-radius: 4px;
    .title {
      color: #666666;
    }
  }
}
.dc-alert {
  width: 768px;
  z-index: 4;
}
</style>
