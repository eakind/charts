<template>
<div class="radius-box" v-if="radiusShow">
      <div class="text">{{radiusObj.text}}</div>
      <dc-slider class="dc-slider"
                 :value="radiusObj.size"
                 @change="changeSlider"
                 :textObj="radiusObj.textObj"
                 :max="radiusObj.max"
                 :min="radiusObj.min"></dc-slider>
    </div>
</template>
<script>
import dcSlider from '@/components/dcslider/dcSlider';
import { delayFunc } from '@/utils/utils';
export default {
  components: { dcSlider },
  props: {
    radiusObj: {
      type: Object,
      default: _ => {
        return {
          text: '半径',
          size: 0,
          textObj: {
            left: '小', // this.$i18n.t('message.small'),
            right: '大', // this.$i18n.t('message.big')
          }
        };
      }
    },
    radiusShow: {
      type: Boolean,
      default: true
    },
    isLine: {
      type: Boolean
    }
  },
  methods: {
    // 半径大小
    changeSlider: delayFunc(async function (val) {
      this.$emit('change', 'radius', val, this.isLine);
    }, 500),
  }
};
</script>
<style lang="scss" scoped>
.text{
  font-size: 12px;
  color: #4284F5;
}
.radius-box{
  margin-bottom: .9em;
}
</style>
