<template>
  <!-- 分类特征列表 -->
  <div class="cat-color-list-wrap">
    <template v-for="(i, index) in colorList">
      <div class="cat-color-item flex" :key="index">
        <!-- className="cat-color-list-wrap" -->
        <color-picker
          v-bind="$attrs"
          v-on="$listeners"
          :key="index"
          :value="i.color"
          :index="option"
          @pick-color="(color) => onColorPick(i, color, index)"
        />

        <div>{{ i.val }}</div>
      </div>
    </template>
  </div>
</template>
<script>
import colorPicker from '@/components/colorPicker/colorPicker.vue';
export default {
  name: 'catColorList',
  components: { colorPicker },
  props: {
    // colors: {
    //   type: Object,
    //   default: _ => { }
    // },
    list: {
      type: Object,
      default: (_) => [],
    },
    option: {
      type: Number,
    },
  },
  data () {
    return {
      colorList: [],
    };
  },
  watch: {
    list: {
      handler (val) {
        this.colorList = JSON.parse(JSON.stringify(val));
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    onColorPick (item, color, index) {
      item.color = color;
      this.$set(this.colorList, index, item);
      this.$emit('on-cat-color-change', { list: this.colorList });
    },
  },
};
</script>
<style lang="scss" scoped>
// @media screen and (max-width:1336px){
//   .cat-color-list-wrap {
//   max-height: 100px;
//   }
// }
// @media screen and (min-width:1336px) and (max-width:1440px){
//    .cat-color-list-wrap {
//   max-height: 200px;
//   }
// }
// @media screen and (max-width:3000px) and (min-width:1440px){
//    .cat-color-list-wrap {
//   max-height: 400px;
//   }
// }

.cat-color-list-wrap {
  // max-height: 400px;
  //  overflow-y: scroll;
  //  overflow-x:hidden ;
  .cat-color-item {
    margin: 3px 0;
  }
  .flex {
    display: flex;
    align-items: center;
    padding: 5px 0;
  }
}
</style>
