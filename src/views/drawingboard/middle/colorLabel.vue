<template>
  <div class="color-label">
    <color-item></color-item>
    <label-item v-on="$listeners"></label-item>
  </div>
</template>
<script>
import ColorItem from './colorLabel/colorItem.vue';
import LabelItem from './colorLabel/labelItem.vue';
export default {
  data () {
    return {
    };
  },
  components: {
    ColorItem,
    LabelItem
  },
  mounted () {
  },
  methods: {
  }
};
</script>
<style lang='scss' scoped>
.color-label{
  display: flex;
  min-height: 40px;
  margin-bottom: 8px;
}
</style>
