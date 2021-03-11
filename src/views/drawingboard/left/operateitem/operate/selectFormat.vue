<template>
  <div class="select-format" v-click-out="hide">
    <div class="format-title" @click="showList=!showList">
      {{selected}}
      <span class="title-tip" v-if="!selected">{{tip}}</span>
    </div>
    <div class="format-list" v-if="showList">
      <div v-for="(item, index) in list" :key="index" @click="selectFormat(item)">{{item}}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SelectFormat',
  data () {
    return {
      showList: false,
      selected: '',
      tip: this.$t('dashboard.select_time_format'),
      list: [
        'YYYY-MM-DD HH:MI:SS',
        'YYYY-MM-DD HH:MI:SS.FFFFFF',
        'MM/DD/YYYY HH:MI:SS',
        'MM/DD/YY HH:MI:SS',
        'YYYY-MM-DD',
        'MM/DD/YYYY',
        'MM/DD/YY',
        'YYYYMMDD',
        'HH:MI',
        'HH:MI:SS',
        'HH:MI:SS PM',
        '下午 HH:MI:SS'
      ]
    };
  },
  props: {
    clear: {
      type: Boolean
    }
  },
  watch: {
    clear () {
      this.selected = '';
    }
  },
  components: {},
  mounted () {},
  methods: {
    selectFormat (item) {
      this.selected = item;
      this.showList = false;
      this.$emit('change', this.selected);
    },
    hide () {
      this.showList = false;
    }
  }
};
</script>
<style lang='scss' scoped>
.select-format {
  width: 260px;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  background-color: white;
  border: 1px solid #979797;
  border-radius: 4px;
  position: relative;
  .format-title {
    width: 100%;
    height: 100%;
    padding: 0px 5px;
    font-size: 14px;
    color: #424242;
    .title-tip {
      width: 100%;
      height: 100%;
      color: #a4a4a4;
    }
  }
  .format-list {
    width: 100%;
    max-height: 200px;
    overflow: auto;
    background: white;
    border: 1px solid #979797;
    border-radius: 0px 0px 4px 4px;
    position: relative;
    top: 2px;
    > div {
      font-size: 14px;
      color: #424242;
      cursor: pointer;
      padding: 0px 10px;
      &:hover {
        color: #4284f5;
      }
    }
  }
}
</style>
