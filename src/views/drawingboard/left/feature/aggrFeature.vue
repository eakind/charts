<template>
  <dc-drag
    class="num-feature"
    :className="'feature-width gu-mirror'"
    data-property="CAT"
    :data-name="value"
    :data-legend="setLegend"
    property="int"
    :type="type"
    :name="value"
    :title="value"
    :class="selected"
    @dragging="dragging"
    @stopDrag="stopDrag"
  >
    <span class="feature-txt" :class="item.formula_type?'formula-text':''">{{value}}</span>
    <span
      class="iconfont icon-db_triangle"
      :class="showList ? 'rotated' : ''"
      @click="showListHandler"
    ></span>
  </dc-drag>
</template>

<script>
import { mapState } from 'vuex';
import DcDrag from '@/components/dcdrag/dcDrag';
import { dragFeature } from '@/mixins/dragFeature';
import { checkFeatureActive } from './checkFeatureActive';
export default {
  name: 'NumFeature',
  components: {
    DcDrag
  },
  data () {
    return {
      showList: false,
      timer: null
    };
  },
  mixins: [dragFeature],
  props: {
    item: {
      type: Object,
      default: _ => {}
    },
    value: {
      type: String,
      defalut: 'string'
    },
    index: {
      type: [String, Number]
    },
    type: {
      type: String
    },
    hide: {
      type: Object
    },
    selectIndex: {
      type: [Object, Number]
    }
  },
  watch: {
    hide: {
      handler (obj) {
        if (!obj) {
          setTimeout(() => {
            this.showList = false;
          }, 0);
        } else {
          if (obj.feature_name !== this.value) {
            setTimeout(() => {
              this.showList = false;
            });
          }
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapState('drawingboard', ['canvasType', 'rowList', 'columnList', 'colorCapsuleList', 'labelsCapsuleList', 'sizeCapsuleList']),
    selected () {
      let active = 'num-active';
      if (checkFeatureActive(this.rowList, this.item.feature_idx)) return active;
      if (checkFeatureActive(this.columnList, this.item.feature_idx)) return active;
      if (checkFeatureActive(this.colorCapsuleList, this.item.feature_idx)) return active;
      if (checkFeatureActive(this.labelsCapsuleList, this.item.feature_idx)) return active;
      if (checkFeatureActive(this.sizeCapsuleList, this.item.feature_idx)) return active;
      return '';
    },
    setLegend () {
      if (this.item.formula_type && this.item.formula_type === 'AGGR') {
        return null;
      }
      return this.item.legend;
    }
  },
  methods: {
    showListHandler (event) {
      this.showList = !this.showList;
      this.$emit(
        'show',
        this.showList,
        'num',
        this.index,
        event.target.parentNode
      );
    },
  }
};
</script>

<style scoped lang="scss">
.num-feature {
  height: 28px;
  line-height:28px;
  width: 100%;
  margin: 3px 0px 3px 0px;
  display: inline-block;
  text-align: left;
  color: #424242;
  font-size: 16px;
  padding-left: 10px;
  border-radius: 4px;
  box-sizing: border-box;
  position: relative;
  // &::after {
  //   @include clear;
  // }
  &:hover {
    background-color: white;
    border: 1px solid #4284F5;
  }
  .feature-txt {
    display: inline-block;
    width: 85%;
    @include ellipsis;
  }
  .iconfont {
    position: absolute;
    right: 10px;
    color: #a4a4a4;
    cursor: pointer;
    display: inline-block;
  }

  .rotated {
    transform: rotate(-180deg);
  }
}
.num-active {
  color: white;
  border: 1px solid #4284f5 !important;
  background-color: #4284f5 !important;
  .iconfont {
    color: white !important;
  }
}
 .formula-text{
    color:  #F59E28;;
  }
</style>
