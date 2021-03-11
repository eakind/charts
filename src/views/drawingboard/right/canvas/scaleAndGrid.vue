<template>
  <dc-collapse-item :title="$t('dashboard.scale_grid')">
    <div class="scale-and-grid">
      <div class="scale-row">
        <span class="scale-title">{{ $t('dashboard.scale_txt') }}</span>
        <button class="edit-btn" @click="isFont = true">
          {{ $t('dashboard.edit') }}
        </button>
      </div>
      <div class="scale-row">
        <span class="scale-unit">刻度单位</span>
        <dc-select-view
          :list="unitList"
          :select="selected"
          @change="changeUnit"
        ></dc-select-view>
      </div>
      <div class="scale-row">
        <span class="scale-title">{{ $t('dashboard.scope_num') }}</span>
        <button class="edit-btn" @click="isScope = true">
          {{ $t('dashboard.edit') }}
        </button>
      </div>
      <div class="align-row">
        <span>{{ $t('dashboard.align_type') }}{{ alignType }}</span>
      </div>
      <grid-setting :axis-style="axisStyle" @change="changeGrid"></grid-setting>
    </div>
    <scale-font
      v-if="isFont"
      @close="closeFont"
      :scaleList="curScaleList"
      @change="changeScale"
    ></scale-font>
    <scale-scope
      v-if="isScope"
      @close="closeScope"
      :selectItem="curScopeObj"
      @change="changeScope"
    ></scale-scope>
  </dc-collapse-item>
</template>
<script>
import GridSetting from './components/gridSetting.vue';
import ScaleFont from './components/scaleFont.vue';
import ScaleScope from './components/scaleScope.vue';
import DcSelectView from '@/components/dcselectview/dcSelectView.vue';
export default {
  data () {
    return {
      isFont: false,
      isScope: false,
      scaleList: [],
      scopeList: [],
      selected: 'auto',
      unitList: [
        {
          name: '自动',
          id: 'auto',
        },
        {
          name: '显示原始数据',
          id: 'origin',
        },
      ],
      curScopeObj: {},
      curScaleList: [],
      curAxisStyle: [],
    };
  },
  props: {
    axisStyle: {
      type: Object,
    },
    hasUnit: {
      type: String,
    },
    scopeObj: { type: Object },
  },
  computed: {
    alignType () {
      let obj = {
        0: '默认',
        1: '图表上选择',
        2: '完全对齐',
        3: '手工指定',
      };
      // if (!this.scopeList.length) return '默认';
      return obj[this.curScopeObj.select];
    },
  },
  watch: {
    axisStyle: {
      handler (val) {
        if (!val || val.length === 0) return;
        if (Object.prototype.toString.call(val) === '[object Object]') {
          return;
        }
        this.curAxisStyle = JSON.parse(JSON.stringify(val)) || [];
        let scaleList = [];
        this.curAxisStyle.forEach((i) => {
          let { label, axisType, key } = i;
          label.feature = key;
          label.axisType = axisType;
          scaleList.push(label);
        });
        this.curScaleList = scaleList;
      },
      immediate: true,
      deep: true,
    },
    hasUnit (val) {
      if (val) {
        this.selected = val;
      }
    },
    scopeObj: {
      handler (val) {
        if (!val) { return; }
        this.curScopeObj = JSON.parse(JSON.stringify(val));
      },
      immediate: true,
      deep: true,
    },
  },
  components: {
    GridSetting,
    ScaleFont,
    ScaleScope,
    DcSelectView,
  },
  mounted () {},
  methods: {
    closeFont () {
      this.isFont = false;
    },
    closeScope () {
      this.isScope = false;
    },
    changeUnit (item) {
      this.$emit('changeUnit', item.id);
    },
    changeGrid (lineStyle) {
      let list = this.curAxisStyle.map((i) => {
        i.grid.line.style = lineStyle.style;
        i.grid.line.show = lineStyle.show;
        return i;
      });
      this.curAxisStyle = list;
      this.$emit('changeGrid', this.curAxisStyle);
    },

    changeScale (val) {
      let list = this.curAxisStyle.map((i) => {
        let match = val.find((m) => m.axisType === i.axisType);
        if (match) {
          i.label.style = match.style;
        }
        return i;
      });
      this.curAxisStyle = list;
      this.isFont = false;
      this.$emit('changeScale', this.curAxisStyle);
    },

    changeScope (item) {
      this.curScopeObj = item;
      this.isScope = false;
      this.$emit('changeScope', this.curScopeObj);
    },
  },
};
</script>
<style lang="scss" scoped>
.scale-and-grid {
  padding: 5px;
  .scale-row {
    display: flex;
    align-items: center;
    padding: 10px 0px;
    &:nth-child(2) {
      border-bottom: 1px solid #e1e1e1;
    }
  }
  .scale-unit {
    font-size: 12px;
    color: #424242;
    flex: 1;
  }
  .scale-title {
    font-size: 12px;
    color: #4284f5;
    flex: 1;
  }
  .edit-btn {
    border: none;
    border-radius: 4px;
    color: white;
    padding: 3px 10px;
    background-color: #4284f5;
  }
  .align-row {
    padding: 10px 0px;
    border-bottom: 1px solid #e1e1e1;
  }
}
</style>
