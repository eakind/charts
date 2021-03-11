<template>
  <div class="style-setting-wrap">
    <dc-collapse
      :activeName="activeName"
      :itemsList="itemsList"
      :accordion="true"
    >
      <template #global>
        <global-style></global-style>
      </template>
      <template #module>
        <component :is="currentTarget.type+'Style'"></component>
      </template>
    </dc-collapse>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import dcCollapse from '@/components/newcollapse/index.vue';
import globalStyle from './styleSetting/globalStyle';
import picStyle from './styleSetting/picStyle.vue';
import filterStyle from './styleSetting/filterStyle.vue';
import canvasStyle from './styleSetting/canvasStyle.vue';
import textStyle from './styleSetting/textStyle.vue';
export default {
  name: 'styleSetting',
  components: {
    dcCollapse,
    globalStyle,
    picStyle,
    canvasStyle,
    textStyle,
    filterStyle
  },
  data () {
    return {
      showFlag: true,
      testFont: 'bold',
      testFont2: 'left'
    };
  },
  computed: {
    ...mapState('dashboard', ['currentTarget']),
    activeName () {
      return this.itemsList.length > 1 ? '2' : '1';
    },
    itemsList () {
      let defaultList = [
        {
          name: '1',
          slot: 'global',
          title: '全局',
        },
      ];
      if (!this.currentTarget.type) {
        return defaultList;
      }
      // type: Canvas - 画布  Text - 文本  Pic-图例  过滤 -Filter
      defaultList.push({
        name: '2',
        slot: 'module',
        title: '选定的组件',
      });
      return defaultList;
    },
  },
};
</script>
<style lang="scss" scoped>
// /deep/ .el-collapse .el-collapse-item .el-collapse-item__content {
//   background: hsl(0, 0%, 100%);
// }
</style>
