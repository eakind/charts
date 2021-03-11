<template>
  <dc-collapse-item title="画布颜色">
    <div class="canvas-color">
      <div class="title-color">
        <span class="canvas-title">标题颜色</span>
        <color-picker v-model="titleColor"
                    @pick-color="triggerChange"
                    @on-tpl-confirm="titleChange"
                    :colorList="[{list:[{color:titleColor,val:'标题颜色'}],name:'标题颜色'}]"
        >
        </color-picker>
      </div>
      <div class="canvas-bg">
        <span class="canvas-title">画布背景</span>
        <span class="title">模板</span>
        <canvas-bg-list @change="changeBg" :index="templateIndex"></canvas-bg-list>
        <span class="title">纯色</span>
        <div class="color-pure">
          <colors-pure :is-min="true" v-model="customColor" :index="templateIndex" @pick-color="changeCustom"></colors-pure>
        </div>
      </div>
    </div>
  </dc-collapse-item>
</template>
<script>
import CanvasBgList from './components/canvasBgList.vue';
import ColorPicker from '@/components/colorPicker/colorPicker.vue';
import ColorsPure from '@/components/colorPicker/colorsPure.vue';
export default {
  data () {
    return {
      titleColor: '#424242',
      customColor: '',
      templateIndex: -1
    };
  },
  props: {
    bgCss: {
      type: Object
    },
    titleCss: {
      type: Object
    }
  },
  components: {
    CanvasBgList,
    ColorPicker,
    ColorsPure
  },
  watch: {
    bgCss: {
      handler (obj) {
        if (!obj) return;
        this.templateIndex = obj.index;
        if (obj.index === -2) {
          this.customColor = obj.background;
        }
      },
      immediate: true
    },
    titleCss: {
      handler (obj) {
        if (!obj) return;
        this.titleColor = obj.color;
      }
    }
  },
  mounted () {
  },
  methods: {
    titleChange (list) {
      this.triggerChange(list[0].color);
    },
    triggerChange (item) {
      this.titleColor = item;
      this.$emit('changeTitle', this.titleColor);
    },
    changeBg (item) {
      this.$emit('change', item);
    },
    changeCustom (val) {
      let obj = {
        index: -2,
        color: this.bgCss.color,
        background: val
      };
      this.$emit('change', obj);
    }
  }
};
</script>
<style lang='scss' scoped>
.canvas-color{
  box-sizing: border-box;
  .title-color{
    display: flex;
    padding: 5px 0px;
    align-items: center;
  }
  .canvas-title {
    color: #4284f5;
    margin-right: 5px;
  }
  .color-block{
    width: 16px;
    height: 16px;
    border-radius: 3px;
    background-color: #4284f5;
    display: inline-block;
  }
  .title {
    color: #666666;
    display: block;
  }
  .color-pure{
    box-sizing: border-box;
    padding: 5px;
  }
}
</style>
