<template>
  <div class="color-item">
    <div class="flex flex-head" :class="!showList ? 'fixed' : ''">
      <span
        class="iconfont"
        :class="colorType === 'linear'?'icon-db_edit':''"
        :style="{ cursor: colorType === 'linear' ? 'pointer' : 'default' }"
        @click="rangeProcess"
        >{{ name }}</span
      >
      <span class="title" @click="showList = !showList">{{
        showList ? '收起' : '展开'
      }}</span>
    </div>

    <div class="opacity">
      {{ $t('dashboard.opacity') }}
      <input
        class="opacity-input"
        v-model="opactiyValue"
        @blur="onOpacityChange"
      />
      %
    </div>
    <transition class="fade">
      <template v-if="showList">
        <template v-if="colorOptions.length > 0 && colorType === 'linear'">
          <div>
            <div class="flex linear-color-wrap">
              <!--  className="linear-color-wrap" -->
              <color-picker
                v-on="$listeners"
                v-bind="$attrs"
                :value="colorOptions[0].color"
                @pick-color="(color) => onColorPick(colorOptions[0], color,0)"
                :index="index"
                :key="colorOptions[0].id"
              >
              </color-picker>
              <div
                class="linear"
                :style="{
                  backgroundColor: colorOptions[0].color,
                  backgroundImage:
                    'linear-gradient(to right,' +
                    colorOptions[0].color +
                    ', ' +
                    colorOptions[1].color +
                    ')',
                }"
              ></div>
              <!-- className="linear-color-wrap" -->
              <color-picker
                v-on="$listeners"
                v-bind="$attrs"
                :value="colorOptions[1].color"
                :index="index"
                @pick-color="(color) => onColorPick(colorOptions[1], color,1)"
                :key="colorOptions[1].id"
              />
            </div>
            <div class="flex-start">
              <div>
                <span class="tips">{{ $t('dashboard.start') }}</span>
                {{ colorOptions[0].id }}
              </div>
              <div>
                <span class="tips">{{ $t('dashboard.end') }}</span>
                {{ colorOptions[1].id }}
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="colorType === 'ordinal'">
          <cat-color-list
            v-bind="$attrs"
            v-on="$listeners"
            :option="index"
          ></cat-color-list>
        </template>
      </template>
    </transition>
  </div>
</template>
<script>
import colorPicker from '@/components/colorPicker/colorPicker.vue';
import catColorList from './catColorList.vue';
// import dcCollapse from '@/components/newcollapse/index.vue';
export default {
  components: { colorPicker, catColorList },
  props: {
    name: String,
    opacity: Number,
    colorOptions: Array,
    // // 是否设置颜色范围 // 根据colorType判断
    // setFlag: {
    //   type: Boolean,
    //   default: false
    // },
    // ordinal-分类特征,linear-数值特征
    colorType: {
      type: String,
      default: 'linear',
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  data () {
    return {
      opactiyValue: 100,
      showList: true,
    };
  },
  computed: {
    itemList () {
      return [
        {
          name: '1',
          slot: 'ColorItem',
          title: this.name,
        },
      ];
    },
  },
  watch: {
    opacity: {
      handler (val) {
        if (typeof val !== 'number') {
          return;
        }
        this.opactiyValue = Math.round(val);
      },
      immediate: true,
    },
  },
  mounted () {},
  methods: {
    onColorPick (item, color, idx) {
      item.color = color;
      this.$forceUpdate();
      this.$emit('change-item-color', item.id, color, idx);
    },
    onOpacityChange () {
      this.$emit('change-opacity', parseInt(this.opactiyValue));
    },
    rangeProcess () {
      if (this.colorType !== 'linear') {
        return;
      }
      this.$emit('on-range-set', this.index);
    },
  },
};
</script>
<style lang="scss" scoped>
.color-item {
  position: relative;
  margin-top: 10px;
  // border-bottom: 1px solid #e1e1e1;
  .flex-head.fixed {
    position: sticky;
    top: 0;
    z-index: 2;
  }
  .flex-head {
    display: flex;
    justify-content: space-between;

    .title {
      display: block;
      width: 30px;
      color: #4284f5;
      text-decoration: underline;
      cursor: pointer;
      font-weight: bold;
    }
  }
  .icon-db_edit {
    &::before {
      margin-right: 5px;
      color: #4284f5;
    }
  }
  .opacity {
    padding: 5px 0px 5px 20px;
    box-sizing: border-box;
  }
  .opacity-input {
    width: 30px;
    height: 20px;
    border-radius: 3px;
    margin: 0px 3px;
    text-align: center;
    border: 1px solid #dedede;
    outline: none;
  }
  /deep/ .dc-color-picker {
    margin-right: 16px;
  }
}
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.flex-start {
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
  .tips {
    color: #a4a4a4;
    font-size: 12px;
  }
}
.linear-color-wrap{
  margin-bottom: 10px;
}
.linear {
  width: 120px;
  height: 16px;
  border-radius: 4px;
}
.fade-enter-active {
  transition: all 3s ease;
}
.fade-leave-active {
  transition: all 3s cubic-bezier(1, 0.5, 0.8, 1);
}
.fade-enter,
.fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
