<template>
  <div class="time-list" v-click-out="hideList">
    <div v-for="(item, key) in timeMap" :key="key" @click="selectTime(item, key)" :class="isNoActive(key)">
      {{item}}
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  data () {
    return {
    };
  },
  props: {
    noCombined: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('project', ['timeMap']),
  },
  components: {
  },
  mounted () {
  },
  methods: {
    selectTime (item, key) {
      this.$emit('change-split', key);
    },
    hideList () {
      this.$emit('hide');
    },
    isNoActive (item) {
      if (!this.noCombined) return '';
      const obj = {
        'YEAR,MONTH': 'is-no-select',
        'YEAR,MONTH,DAY': 'is-no-select',
        'YEAR,SEASON': 'is-no-select'
      };
      return obj[item];
    }
  }
};
</script>
<style lang='scss' scoped>
.time-list {
  right: -121px;
  top: 0px;
  width: 120px;
  box-shadow: 0 6px 14px 0 rgba(0,0,0,0.10);
  border-radius: 0 0 4px 4px;
  background-color: white;
  position: absolute;
  color: #424242;
  > div {
    height: 30px;
    line-height: 30px;
    padding: 0px 10px;
    &:hover{
       color: #4284f5;
    }
  }
  .is-no-select{
    pointer-events: none;
    color: #a4a4a4
  }
}
</style>
