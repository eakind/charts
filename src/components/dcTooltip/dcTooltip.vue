<template>
  <div class="text-tooltip">
    <el-tooltip class="item" effect="dark" :disabled="isShowTooltip" :content="content" placement="top">
      <p class="over-flow" :class="className" @mouseover="onMouseOver(refName)">
        <span :ref="refName">{{content||''}}</span>
      </p>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'dcTooltip',
  props: {
    content: {
      type: String,
      default: () => {
        return '';
      }
    },
    className: {
      type: String,
      default: () => {
        return '';
      }
    },
    refName: {
      type: String,
      default: () => {
        return '';
      }
    }
  },
  data () {
    return {
      isShowTooltip: true
    };
  },
  methods: {
    onMouseOver (str) {
      var parentWidth;
      var contentWidth;
      if (this.$refs[str] && this.$refs[str].parentNode) {
        parentWidth = this.$refs[str].parentNode.offsetWidth;
        contentWidth = this.$refs[str].offsetWidth;
      } else {
        parentWidth = 0;
        contentWidth = 0;
      };
      if (contentWidth > parentWidth) {
        this.isShowTooltip = false;
      } else {
        this.isShowTooltip = true;
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.over-flow {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.tipwidth {
  width: 100%;
}
p{
  margin: 0;
}
</style>
