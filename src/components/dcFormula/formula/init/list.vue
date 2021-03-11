<template>
  <div class="formula-list-box">
    <div class="formula-list" v-if="formulaList.length > 0">
      <template v-for="(i, index) in formulaList">
        <div
          class="item"
          :class="index === activeIndex ? 'active' : ''"
          :key="index"
          @click="activeIndex = index"
        >
          {{ i.formula_name }}
        </div>
      </template>
    </div>
    <div class="empty-box" v-else>
      <div class="icon-empty-box">
        <icon-svg
          icon="#icon-db10_box"
          :styleObj="{ width: '24px', height: '24px' }"
        ></icon-svg>
      </div>
      <div>没有该类型运算</div>
    </div>
    <div class="formula-item-content" v-if="formulaList.length > 0">
      <div class="item-head">
        <!-- 描述 -->
        <div class="title-box">
          <span class="title">{{ title.formulaType }}</span>
          <span class="desc">{{ title.dataType }}</span>
        </div>
        <!-- 编辑 -->
        <div class="edit-box-btn" @click="editClk">
          <div class="edit-icon-box">
            <icon-svg
              class="icon"
              className="icon-edit"
              icon="#icon-db_edit"
            ></icon-svg>
          </div>
          <div class="edit-btn">{{ $t('message.edit') }}</div>
        </div>
      </div>
      <div class="item-content" v-html="formulaCurContent"></div>
    </div>
  </div>
</template>
<script>
import mix from '../mixins/index';
export default {
  props: {
    formulaList: {
      type: Array,
      default: (_) => [],
    },
  },
  mixins: [mix],
  data() {
    return {
      activeIndex: 0,
      formulaCurContent: '',
      formulaText: '',
    };
  },
  computed: {
    // ...mapState('formula', ['formulaType', 'dataType']),
    // ...mapState('project', ['projectId']),
    title() {
      if (this.formulaList.length === 0) {
        return {};
      }
      let item = this.formulaList[this.activeIndex];
      return {
        formulaType: this.formulaType[item.formula_type],
        dataType: this.dataType[item.data_type],
      };
    },
  },
  watch: {
    activeIndex: {
      handler(val, oldVal) {
        if (val === oldVal) {
          return;
        }
        this.fetchFormulaDetail(this.formulaList[val].formula_id);
        this.setFormulaObj(this.formulaList[val]);
      },
      immediate: true,
    },
  },
  mounted() {
    this.dataObj.string = this.string || /\"[^"]*\"/gi;
    this.dataObj.condition = this.condition || /IF|CASE|WHEN|ELSE|END|THEN|GROUPBY/gi;
    this.initData('fun', this.formulaFunList, 'name');
    this.initData('cat', this.catObjList);
    this.initData('agg', this.numObjList);
  },
  methods: {
    editClk() {
      let item = this.formulaList[this.activeIndex];
      this.setFormulaId(item.formula_id);
      this.setFormulaContent(this.formulaText);
      this.$emit('on-formula-add');
    },
  },
};
</script>
<style lang="scss">
@import '../style/index';
</style>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.formula-list-box {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  padding: 8px;
  .empty-box {
    // width: 250px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #a4a4a4;
    text-align: center;
    .icon-empty-box {
      width: 48px;
      height: 48px;
      line-height: 48px;
      margin-left: 32px;
    }
  }
  .formula-list {
    width: 250px;
    overflow-y: scroll;
    @include scroll;
    .item {
      width: 240px;
      padding: 8px 9px;
      margin-bottom: 8px;
      text-align: left;
      font-size: 16px;
      color: #a4a4a4;
      border-radius: 4px;
      background-color: #f4f5f6;
      cursor: pointer;
    }
    .item.active {
      color: #4284f5;
      background-color: #fff;
    }
  }
  .formula-item-content {
    width: calc(100% - 250px);
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: normal;
    padding: 0 9px;
    .item-head {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #e1e1e1;
      padding: 9px 0;
      .title-box {
        font-weight: bold;
        .title {
          font-size: 16px;
          color: #052b71;
        }
        .desc {
          font-size: 14px;
          color: #666666;
          margin-left: 16px;
        }
      }
      .edit-box-btn {
        display: flex;

        align-items: center;
        cursor: pointer;
        .edit-icon-box {
          width: 30px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          .icon-edit {
            color: #4284f5;
          }
        }
        .edit-btn {
          font-size: 16px;
          color: #424242;
        }
      }
    }
  }
  .item-content {
    height: calc(100% - 50px);
    overflow: auto;
  }
}
</style>
