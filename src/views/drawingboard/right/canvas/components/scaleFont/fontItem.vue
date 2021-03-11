<template>
  <div class="font-item">
    <div class="property">
      <div class="propert-name" :title="itemObj.feature">{{ itemObj.feature }}</div>
    </div>
    <div class="color">
      <color-picker
        class="color-picker"
        v-model="itemObj.style.fontColor"
        @on-tpl-confirm="colorChangeHandler"
        :colorList="[
          {
            list: [{ color: itemObj.style.fontColor, val: itemObj.feature }],
            name: itemObj.feature,
          },
        ]"
        @pick-color="triggerChange"
      ></color-picker>
    </div>
    <div class="size">
      <tooltip-select
        class="select"
        :select="itemObj.style.fontSize"
        :list="fontList"
        @change="changeSize"
      ></tooltip-select>
    </div>
    <div class="direct">
      <tooltip-select
        class="select"
        :select="itemObj.style.rotate"
        :list="dirList"
        @change="changeDir"
      ></tooltip-select>
    </div>
  </div>
</template>
<script>
import TooltipSelect from '../../tooltipSetting/tooltipSelect.vue';
import ColorPicker from '@/components/colorPicker/colorPicker.vue';
// import CanvasChecked from '../canvasChecked.vue';
export default {
  data () {
    return {
      color: '#424242',
      fonts: [12, 13, 14, 15, 16, 17, 18],
      direct: 'rotate',
      directions: ['横向', '竖向', '斜上', '斜下'],
      itemObj: {},
    };
  },
  props: {
    item: {
      type: Object,
    },
    index: {
      type: Number,
    },
  },
  watch: {
    item: {
      handler (obj) {
        if (!obj) return;
        this.itemObj = JSON.parse(JSON.stringify(obj));
      },
      immediate: true,
    },
  },
  computed: {
    fontList () {
      let list = this.fonts;
      return list.map((item) => ({ id: item, name: item }));
    },
    dirList () {
      const values = this.directions;
      const obj = {
        横向: 0,
        斜上: -45,
        竖向: 90,
        斜下: 45,
      };
      return values.map((item) => ({ name: item, id: obj[item] }));
    },
  },
  components: {
    TooltipSelect,
    ColorPicker,
    // CanvasChecked
  },
  mounted () {},
  methods: {
    colorChangeHandler (list) {
      this.emitChange('fontColor', list[0].color);
    },
    triggerChange (color) {
      this.emitChange('fontColor', color);
    },
    changeSize (item) {
      this.emitChange('fontSize', item.id);
    },
    changeDir (item) {
      this.emitChange('rotate', item.id);
    },
    emitChange (attr, val) {
      this.$set(this.itemObj.style, attr, val);
      this.$emit('change', this.itemObj.style);
    },
  },
};
</script>
<style lang="scss" scoped>
.font-item {
  height: 50px;
  align-items: center;
  display: flex;
  .property {
    flex: 1;
    display: flex;
    width: 0;
    align-items: center;
  }
  .propert-name {
    width: 100%;
    font-size: 14px;
    @include ellipsis;
  }
  .color {
    width: 80px;
  }
  .size {
    width: 120px;
  }
  .direct {
    width: 120px;
  }
  .select {
    width: 80px;
  }
}
</style>
