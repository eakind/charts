<template>
  <div class="time-name">
    <span class="time-txt">{{splitItem}}</span>
    <span class="iconfont icon-db_triangle" @click="showTimeList"></span>
    <time-list class="time-list" v-if="isTimeList"
               :no-combined="true"
               @hide="hideHandler"
               @change-split="changeHandler"></time-list>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import TimeList from '../capsuleItem/menuList/timeList.vue';
export default {
  data () {
    return {
      isTimeList: false
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
  computed: {
    ...mapState('project', ['timeMap']),
    splitItem () {
      return this.timeMap[this.item];
    },
  },
  components: {
    TimeList
  },
  mounted () {
  },
  methods: {
    showTimeList () {
      this.isTimeList = true;
    },
    hideHandler () {
      setTimeout(() => {
        this.isTimeList = false;
      }, 0);
    },
    changeHandler (key) {
      this.isTimeList = false;
      this.$emit('change-split', key, this.index);
    }
  }
};
</script>
<style lang='scss' scoped>
.time-name {
  height: 30px;
  line-height: 30px;
  background-color: #03B98C;
  display: inline-block;
  margin-right: 4px;
  color: white;
  font-size: 14px;
  border-radius: 4px;
  padding: 0px 5px;
  position: relative;
  .time-txt{
    min-width: 30px;
    display: inline-block;
  }
  .icon-db_triangle{
    cursor: pointer;
    font-size: 12px;
    margin: 0px 0px 0px 4px;
  }
  .time-list{
    left: 0px;
    top: 35px;
    border-radius: 3px;
    z-index: 9999999;
  }
}
</style>
