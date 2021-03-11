<template>
  <div class="percent-list">
    <div class="item">
      <el-checkbox
        v-model="originalChecked"
        @change="change('originalChecked', $event)"
        >原数据</el-checkbox
      >
    </div>
    <div class="item">
      <el-checkbox v-model="checked" @change="change('checked', $event)"
        >百分比</el-checkbox
      >
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState('drawingboard', ['currentCanvasDetail'])
  },
  watch: {
    currentCanvasDetail: {
      handler (val) {
        if (val.css) {
          this.checked = val.css.checked;
          this.originalChecked = val.css.originalChecked;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  data () {
    return {
      checked: false,
      originalChecked: false,
    };
  },
  methods: {
    change (attr, val) {
      if (!this.currentCanvasDetail.css) {
        this.currentCanvasDetail.css = {};
      }
      this.$set(this.currentCanvasDetail.css, attr, val);
      this.$emit('change-percent', {
        checked: this.currentCanvasDetail.css[attr],
        type: attr,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.percent-list {
  position: absolute;
  width: 120px;
  background-color: white;
  right: -121px;
  top: 0px;
  max-height: 300px;
  overflow-x: hidden;
  overflow-y: auto;
  box-shadow: 0 6px 14px 0 rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 0px 8px;
  border-radius: 4px;
  .item {
    line-height: 36px;
    .check {
      vertical-align: middle;
    }
    .text {
      margin-left: 8px;
    }
  }
}
</style>
