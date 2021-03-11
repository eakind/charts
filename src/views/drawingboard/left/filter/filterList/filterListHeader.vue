<template>
  <div class="filter-list-header" v-if="item">
    <div class="filter-header">
     <!-- <span class="total-num">{{$t('dashboard.total_num')}}{{isCurrent ? num : allNum}}{{$t('dashboard.total_unit')}}</span> -->
     <span class="back-list" v-if="item" @click="backHandler">{{$t('dashboard.back_list')}}</span>
    </div>
    <!-- <div class="open-btn" @click="openEdit">
        {{$t('dashboard.open_edit')}}
    </div> -->
  </div>
</template>
<script>
export default {
  data () {
    return {
    };
  },
  props: {
    isCurrent: {
      type: Boolean
    },
    num: {
      type: Number,
    },
    item: {
      type: Object
    },
    allNum: {
      type: Number
    }
  },
  components: {
  },
  mounted () {
  },
  methods: {
    backHandler () {
      this.$emit('back');
    },
    openEdit () {
      this.$emit('openEdit');
    }
  }
};
</script>
<style lang='scss' scoped>
.filter-list-header {
  height: 85px;
  margin-bottom: 10px;
  border-bottom: 1px solid #E1E1E1;
  .filter-header{
    height: 35px;
    line-height: 35px;
    position: relative;
  }
  .total-num {
    color: #424242;
  }
  .back-list{
    right: 0px;
    color: #4284f5;
    cursor: pointer;
    text-decoration: underline;
    position: absolute;
  }
  .open-btn{
    margin: 5px 10px;
    border: 1px solid #4284f5;
    border-radius: 4px;
    height: 30px;
    line-height: 30px;
    color: #4284f5;
    text-align: center;
    cursor: pointer;
  }
}
</style>
