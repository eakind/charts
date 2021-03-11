<template>
<!-- data-symbol 标记 -->
  <dc-drag class="classify"
            data-symbol="combineFeature"
            data-property="CAT"
            :data-name="value"
           :className="'feature-width gu-mirror'"
           property="cat"
           :type="type"
           :name="value"
           :idx="idx"
           :group-name="groupName"
           :class="selected ? 'cat-active': ''"
           @dragging="dragging"
           @stopDrag="stopDrag">
    <span class="icon iconfont icon-db_world" data-symbol="combineFeature"
          v-if="map()"
          :group-name="groupName"></span>
    <icon-svg class="icon classify-icon" data-symbol="combineFeature"
              icon="#icon-dbc_string"
              :group-name="groupName"
              v-if="type === 'STRING'"></icon-svg>
    <icon-svg class="icon classify-icon" data-symbol="combineFeature"
              icon="#icon-dbc_clock"
              :group-name="groupName"
              v-if="type === 'DATETIME'"></icon-svg>
    <icon-svg class="icon classify-icon" data-symbol="combineFeature"
              icon="#icon-dbc_section"
              :group-name="groupName"
              v-if="type === 'BIN'"></icon-svg>
    <div class="cat-value-box" data-symbol="combineFeature"
         :title="value"
         :group-name="groupName"
         :name="value">
      <span class="classify-txt" data-symbol="combineFeature"
      :class="formulaType?'formula-text':''"
            :title="value"
            :group-name="groupName"
            :name="value">{{value}}</span>
      <span class="iconfont icon-db_triangle classify-icon" data-symbol="combineFeature"
            :class="showList ? 'rotated' : ''"
            :group-name="groupName"
            v-if="type !== 'DATETIME' || formulaType"
            :name="value"
            @click="showListHandler"></span>
    </div>

  </dc-drag>
</template>
<script>
import { mapState } from 'vuex';

import DcDrag from '@/components/dcdrag/dcDrag';
import IconSvg from '@/components/iconsvg/iconSvg';
import { dragFeature } from '@/mixins/dragFeature';
import { checkFeatureActive } from './checkFeatureActive';

export default {
  components: {
    DcDrag,
    IconSvg
  },
  props: {
    type: {
      type: String,
      defalut: 'string'
    },
    value: {
      type: String,
      defalut: ''
    },
    index: {
      type: Number
    },
    childIndex: {
      type: Number,
      default: null
    },
    idx: {
      type: Number
    },
    hide: {
      type: Object
    },
    selectIndex: {
      type: [Object, Number]
    },
    selectChildIndex: {
      type: [Object, Number]
    },
    groupName: {
      type: String,
      default: ''
    },
    formulaType: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showList: false,
      timer: null
    };
  },
  mixins: [dragFeature],
  computed: {
    ...mapState('drawingboard', ['canvasType', 'rowList', 'columnList', 'colorCapsuleList', 'labelsCapsuleList', 'sizeCapsuleList']),
    selected () {
      let active = 'cat-active';
      if (checkFeatureActive(this.rowList, this.idx)) return active;
      if (checkFeatureActive(this.columnList, this.idx)) return active;
      if (checkFeatureActive(this.colorCapsuleList, this.idx)) return active;
      if (checkFeatureActive(this.labelsCapsuleList, this.idx)) return active;
      if (checkFeatureActive(this.sizeCapsuleList, this.idx)) return active;
      return '';
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
  mounted () {
  },
  methods: {
    map () {
      switch (this.type) {
        case 'ZIPCODE':
        case 'DISTRICT':
        case 'PROVINCE':
        case 'CITY':
        case 'AREACODE':
        case 'CITYCODE':
        case 'MAP':
          return true;
      }
      return false;
    },
    showListHandler (event) {
      this.showList = !this.showList;
      this.$emit(
        'show',
        this.showList,
        'cat',
        this.index,
        event.target.parentNode.parentNode,
        this.childIndex
      );
    },
  }
};
</script>
<style lang='scss' scoped>
.classify {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 28px;
  line-height: 28px;
  width: calc(100% - 10px);
  margin: 3px 0px 3px 0px;
  font-size: 16px;
  border-radius: 0px 4px 4px 0px;
  &:hover {
    border-radius: 4px;
    background-color: white;
    border: 1px solid #4284F5;
  }
  .icon {
    display: block;
    width: 26px;
    height: 22px;
    line-height: 22px;
    text-align: center;
    padding-right: 3px;
    color: #a4a4a4;
  }
  .cat-value-box {
    // flex: 1;
    display: flex;
    width: calc(100% - 30px);
  }
  .classify-txt {
    @include ellipsis;
    padding: 0px 0px 0px 5px;
    box-sizing: border-box;
    // width: 150px;
    display: block;
    // display: inline-block;
    //  width: 75%;
    width: calc(100% - 30px);
  }
 .classify-txt.formula-text{
    color:  #F59E28;;
  }
  .icon-db_triangle {
    position: absolute;
    right: 30px;
    color: #a4a4a4;
    cursor: pointer;
    display: inline-block;
  }

  .rotated {
    transform: rotate(-180deg);
  }
}
.cat-active {
  color: white;
  // background-color: #03b98c;
  .icon-db_triangle {
    color: white;
  }
  .icon {
    background-color: white;
  }
  &:hover {
    // border: none;
    // background-color: #03b98c!important;
  }
}
.cat-active .cat-value-box {
  border-radius: 4px;
  background-color: #03b98c;
}
</style>
