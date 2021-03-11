<template>
  <div class="line-style">
    <div class="line-block">
      <span class="line-title">线颜色</span>
      <color-picker
        v-model="styleObj.fontColor"
        :colorList="[
          {
            list: [{ color: styleObj.fontColor, val: '线颜色' }],
            name: '线颜色',
          },
        ]"
        @on-tpl-confirm="emitChange('fontColor', $event[0].color)"
        @pick-color="emitChange('fontColor', $event)"
      >
      </color-picker>
    </div>
    <div class="line-block">
      <span class="line-title">线粗细</span>
      <dc-select-view
        :list="lineSizeList"
        :select="styleObj.lineWidth"
        @change="emitChange('lineWidth', $event.id)"
      ></dc-select-view>
    </div>
    <div class="line-block">
      <span class="line-title">线样式</span>
      <style-select
        :select="styleObj.lineDash"
        @change="emitChange('lineDash', $event === 'line' ? [0, 0] : [2, 2])"
      ></style-select>
    </div>
  </div>
</template>
<script>
import DcSelectView from '@/components/dcselectview/dcSelectView.vue';
import ColorPicker from '@/components/colorPicker/colorPicker.vue';
import StyleSelect from './StyleSelect.vue';
export default {
  data () {
    return {
      size: 1, // 当前线的粗细
      lineSizes: [1, 2, 3],
      line: 'line',
      lineColor: '#4284f5',
      styleObj: {
      },
    };
  },
  props: {
    lineStyle: {
      type: Object,
    },
  },
  components: {
    DcSelectView,
    StyleSelect,
    ColorPicker,
  },
  watch: {
    lineStyle: {
      handler (obj) {
        if (!obj) return;
        if (!obj.lineDash) { return; }
        this.$set(this.styleObj, 'fontColor', obj.fontColor);
        this.$set(
          this.styleObj,
          'lineDash',
          obj.lineDash[0] === 0 ? 'line' : 'dot'
        );
        this.$set(this.styleObj, 'lineWidth', obj.lineWidth);
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    lineSizeList () {
      const values = this.lineSizes;
      return values.map((item) => ({ name: item, id: item }));
    },
  },
  mounted () {},
  methods: {
    // lineChange (list) {
    //   this.$set(this.styleObj, 'color', list[0].color);
    //   this.$emit('change', this.styleObj);
    // },
    // triggerChange (val) {
    //   this.$set(this.styleObj, 'color', val);
    //   this.$emit('change', this.styleObj);
    // },
    // changeSize (item) {
    //   this.$set(this.styleObj, 'thickness', item.id);
    //   this.$emit('change', this.styleObj);
    // },
    // changeStyle (val) {
    //   this.$set(this.styleObj, 'style', val);
    //   this.$emit('change', this.styleObj);
    // },
    emitChange (attr, val) {
      let tempObj = JSON.parse(JSON.stringify(this.styleObj));
      tempObj[attr] = val;
      this.$emit('change', tempObj);
    },
  },
};
</script>
<style lang="scss" scoped>
.line-style {
  .line-block {
    display: flex;
    align-items: center;
    padding: 5px 0px;
  }
  .line-title {
    color: #666666;
    margin: 0px 10px 0px 0px;
  }
  .color-block {
    height: 15px;
    width: 15px;
    background-color: #4284f5;
    border-radius: 3px;
  }
}
</style>
