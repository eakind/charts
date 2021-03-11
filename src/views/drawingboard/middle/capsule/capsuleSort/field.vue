<template>
  <!-- 字段排序 -->
  <div class="field-box">
    <div class="flex">
      <dc-select
        :disabled="disabled"
        :list="featureList"
        :value="featureSel.name"
        @change="changeFeature($event, 'name')"
      ></dc-select>
      <dc-select
        :disabled="disabled"
        :list="featureTypeList"
        :value="featureSel.legend"
        @change="changeFeature($event, 'legend')"
      ></dc-select>
      <div class="edit-box" v-if="!disabled" @click="showAddField = true">
        <span class="iconfont icon-db_edit"></span>
        <span>编辑更多</span>
      </div>
    </div>
    <div
      v-show="!disabled && order.query && order.query.length > 0"
      class="text"
    >
      已筛选{{ selText }}等作为排序依据
    </div>

    <add-field
      :list="curCatList"
      :query="order.query"
      v-if="showAddField"
      @close="showAddField = false"
      @sure="addFieldSure"
    ></add-field>
  </div>
</template>
<script>
import dcSelect from '@/components/newSelect/index.vue';
import addField from './addField.vue';
import { mapState } from 'vuex';
export default {
  name: 'filedSort',
  components: {
    dcSelect,
    addField,
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: (_) => {},
    },
  },
  watch: {
    item: {
      handler (val) {
        this.order = JSON.parse(JSON.stringify(val || {}));
        let list = [...this.catList, ...this.aggrList];
        let curList = [];
        list.map((i, index) => {
          curList.push({
            value: i.feature_name,
            label: i.feature_name,
            type: i.data_type,
            id: i.feature_idx,
          });
        });
        this.featureList = curList;
        if (!this.order.col || !this.order.col.name) {
          this.setFeatureType1();
          this.$set(this.featureSel, 'name', this.catList[0].feature_name);
          this.$set(this.featureSel, 'legend', 'Count');
          this.$set(this.order, 'col', this.featureSel);
          this.$emit('change', this.order);
        } else {
          this.$set(this.featureSel, 'name', this.order.col.name);
          this.$set(this.featureSel, 'legend', this.order.col.legend);
          this.initFeatureTypeList(this.order.col.name);
          this.$emit('change', this.order);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  data () {
    return {
      featureSel: {},
      featureTypeList: [],
      featureList: [],
      showAddField: false,
      order: {},
      // selText: '',
    };
  },
  computed: {
    ...mapState('drawingboard', ['catList', 'aggrList']),
    ...mapState('project', ['legendMap']),
    curCatList () {
      return this.featureList.filter((i) => i.type === 'STRING');
    },
    selText () {
      let arr = JSON.parse(JSON.stringify(this.order.query || {}));
      if (arr && arr.length > 0) {
        return arr
          .slice(0, 2)
          .map((i) => `"${i.name}"`)
          .join(',');
      }
      return '';
    },
  },
  methods: {
    changeFeature (val, attr) {
      this.$set(this.featureSel, attr, val);
      if (attr === 'name') {
        this.initFeatureTypeList(val);
        this.$set(this.featureSel, 'legend', this.featureTypeList[0].value);
      }
      this.$set(this.order, 'col', this.featureSel);
      this.$emit('change', this.order);
    },
    initFeatureTypeList (name) {
      let item = this.featureList.find((i) => i.label === name);
      if (item.type !== 'FLOAT' && item.type !== 'INT') {
        this.setFeatureType1();
      } else {
        this.setFeatureType2();
      }
    },
    setFeatureType1 () {
      this.featureTypeList = [
        { label: this.$t('message.count'), value: 'Count' },
        {
          label: `${this.$t('message.dimension')}(${this.$t(
            'message.unique'
          )})`,
          value: 'CountD',
        },
      ];
    },
    setFeatureType2 () {
      let list = [];
      for (const key in this.legendMap) {
        if (this.legendMap.hasOwnProperty(key)) {
          const ele = this.legendMap[key];
          list.push({
            label: ele,
            value: key,
          });
        }
      }
      this.featureTypeList = list;
    },
    addFieldSure (curSelect) {
      let arr = curSelect.filter((i) => i.name);
      this.showAddField = false;
      this.$set(this.order, 'query', JSON.parse(JSON.stringify(arr)));
      this.$emit('change', this.order);
    },
  },
};
</script>
<style lang="scss" scoped>
.flex {
  display: flex;
  align-items: center;
  & > div {
    margin-right: 0.8em;
  }
}
.field-box {
  margin-top: 0.8em;
  padding-left: 1.5em;
}
.edit-box {
  cursor: pointer;
  .iconfont {
    color: #4284f5;
    margin-right: 0.5em;
  }
}
.text {
  margin-top: 0.8em;
  color: #666666;
}
</style>
