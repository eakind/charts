<template>
 <dc-collapse-item :title="$t('dashboard.shape_size')">
    <div class="shape-size-box">
      <dc-shape v-if="!isLine && !hasShape" v-bind="$attrs" v-on="$listeners"></dc-shape>
      <dc-radius v-if="!isLine" v-bind="$attrs" v-on="$listeners"></dc-radius>
      <dc-radius v-if="showLineShape" :is-line="true" :radiusObj="lineRadiusObj" v-on="$listeners"></dc-radius>
      <dc-line-shape v-if="showLineShape" v-bind="$attrs" v-on="$listeners"></dc-line-shape>
    </div>
 </dc-collapse-item>
</template>
<script>
import dcShape from './shapeAndSize/shape.vue';
import dcRadius from './chartStyle/radius.vue';

import dcLineShape from './chartStyle/shape';
export default {
  components: { dcRadius, dcShape, dcLineShape },
  props: {
    lineRadiusObj: {
      type: Object,
      default: _ => {
        return {
          text: '线粗细',
          size: 0,
          textObj: {
            left: '小', // this.$i18n.t('message.small'),
            right: '大', // this.$i18n.t('message.big')
          }
        };
      }
    },
    isLine: {
      type: Boolean,
      default: false
    },
    showLineShape: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array
    }
  },
  computed: {
    hasShape () {
      let list = this.list;
      for (let i = 0; i < list.length; i++) {
        if (list[i].left || list[i].right) {
          let left = list[i].left || [];
          let right = list[i].right || [];
          for (let j = 0; j < left.length; j++) {
            if (left[j].color && left[j].color.dtype === 'CAT') {
              return false;
            };
            if (!left[j].color) return false;
          }
          for (let j = 0; j < right.length; j++) {
            if (right[j].color && right[j].color.dtype === 'CAT') {
              return false;
            }
            if (!right[j].color) return false;
          }
        } else {
          if (list[i].color && list[i].color.dtype === 'CAT') {
            return false;
          }
          if (!list[i].color) return false;
        }
      }
      return true;
    }
  },
  watch: {
    lineRadiusObj: {
      handler (val) {
      },
      immediate: true
    }
  },
  methods: {
  }
};
</script>
<style lang="scss" scoped>
.shape-size-box{
    padding: 8px;
}
</style>
