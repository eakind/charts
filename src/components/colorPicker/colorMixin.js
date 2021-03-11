// v-model by color, only in child components
// 单向数据流, value 全部向下传递, 顶层元素绑定value, 只通过 pick-color 完成更新, 以完成不同的更新逻辑
export const colorModel = {
  props: {
    value: { // color
      type: String,
      default: '',
    },
    startColor: {
      type: String,
      default: ''
    },
    endColor: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      color: this.value || this.startColor || this.endColor
    };
  },
  watch: {
    value: {
      handler (val) {
        this.color = val;
      },
      immediate: true
    },
    startColor: {
      handler (val) {
        if (!this.value) {
          this.color = val;
        }
      },
      immediate: true
    },
    endColor: {
      handler (val) {
        if (!this.value) {
          this.color = val;
        }
      },
      immediate: true
    }
  },
  methods: {
    onColorPick (color) {
      if (color === this.color || color === this.endColor || color === this.startColor) {
        return;
      }
      this.$emit('input', color);
      this.$emit('pick-color', color);
    },
  },
};
