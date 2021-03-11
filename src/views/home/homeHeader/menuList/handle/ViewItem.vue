<template>
  <div class="view-item" @mouseleave="mouseleave">
    <span class="view-title">{{$t('home.view_tip')}}</span>
    <div class="view-row">
      <div class="view-btn" :class="isStandard" @click="setView('standard')">{{$t('home.standard_view')}}</div>
      <div class="view-btn" :class="isFull" @click="setView('full')">{{$t('home.full_view')}}</div>
    </div>
    <div class="view-row">
      <div class="view-btn" :class="isFitHeight" @click="setView('fitHeight')">{{$t('home.height_view')}}</div>
      <div class="view-btn" :class="isFitWidth" @click="setView('fitWidth')">{{$t('home.width_view')}}</div>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex';
export default {
  data () {
    return {
    };
  },
  computed: {
    ...mapState('displayboard', ['viewMode']),
    isStandard () {
      if (this.viewMode === 'standard') {
        return 'view-active';
      }
      return '';
    },
    isFull () {
      if (this.viewMode === 'full') {
        return 'view-active';
      }
      return '';
    },
    isFitHeight () {
      if (this.viewMode === 'fitHeight') {
        return 'view-active';
      }
      return '';
    },
    isFitWidth () {
      if (this.viewMode === 'fitWidth') {
        return 'view-active';
      }
      return '';
    }
  },
  components: {
  },
  mounted () {
  },
  methods: {
    ...mapMutations('displayboard', ['setViewMode']),
    setView (type) {
      this.setViewMode(type);
      this.$emit('hide');
    },
    mouseleave () {
      this.$emit('hide');
    }
  }
};
</script>
<style lang='scss' scoped>
.view-item{
  box-sizing: border-box;
  padding: 10px 20px 10px;
  .view-title{
    font-size: 12px;
    display: block;
    margin: 5px 0px;
  }
  .view-row{
    display: flex;
  }
  .view-btn {
    flex: 50%;
    margin: 5px;
    font-size: 14px;
    border-radius: 4px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
    border: 1px solid white;
    background-color: white;
  }
  .view-active{
    border: 1px solid #4284f5;
  }
}
</style>
