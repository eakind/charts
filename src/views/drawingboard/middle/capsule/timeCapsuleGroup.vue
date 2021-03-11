<template>
  <div class="time-capsule-group">
    <time-name v-for="(timeItem, timeIndex) in item.split" :item="timeItem" :key="timeIndex" :index="timeIndex"
               @change-split="changeSplit"></time-name>
    <span class="time-capsule-name">{{item.feature_name}}</span>
  </div>
</template>
<script>
import TimeName from './timeCapsuleGroup/timeName.vue';
export default {
  data () {
    return {
    };
  },
  props: {
    item: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  components: {
    TimeName
  },
  mounted () {
  },
  methods: {
    changeSplit (item, index) {
      this.$emit('change', item, index);
    }
  }
};
</script>
<style lang='scss' scoped>
.time-capsule-group {
  position: relative;
  background-color: white;
  box-sizing: border-box;
  padding: 2px 0px;
  height: 30px;
  display: flex;
  .time-capsule-name{
    max-width: 80px;
    font-size: 14px;
    color: #03B98C;
    @include ellipsis;
  }
}
</style>
