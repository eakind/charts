<template>
  <div class="export-file" @click.stop @mouseleave="mouseleave">
    <span class="export-title">{{$t('home.exoprt_tip')}}</span>
    <div class="export-row">
      <div class="export-btn" @click="exportImage">{{$t('home.picture_format')}}</div>
      <div class="export-tip">{{$t('home.create_table_tip')}}</div>
    </div>
    <div class="export-row">
      <div class="export-btn" @click="exportData">{{$t('home.data_table')}}</div>
      <div class="export-tip">{{$t('home.download_data')}}</div>
    </div>
    <div class="export-row" v-if="false">
      <div class="export-btn" @click="exportPrint">{{$t('home.print_board')}}</div>
      <div class="export-tip">{{$t('home.pdf_format')}}</div>
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
    ...mapState('displayboard', ['dashboardId']),
    ...mapState('project', ['projectId']),
    isDashboard () {
      return this.$route.name === 'displayboard';
    }
  },
  components: {
  },
  mounted () {
  },
  methods: {
    ...mapMutations('dashboard', ['setSelectedTarget']),
    mouseOut () {
      this.$emit('hide');
    },
    exportImage () {
      this.setSelectedTarget({});
      this.$emit('hide');
      this.bus.$emit('selectExport', true);
    },
    exportData () {
      this.$emit('hide');
      this.bus.$emit('selectExport', false);
    },
    exportPrint () {
      this.$emit('hide');
      sessionStorage.setItem('printDashboards' + this.projectId, JSON.stringify([this.dashboardId]));
      sessionStorage.removeItem('printDashboardImgs' + this.projectId); // 移除缓存的打印内容，避免图表已更新未检测到
      this.$router.push('/printview');
    },
    mouseleave () {
      this.$emit('hide');
    }
  }
};
</script>
<style lang='scss' scoped>
.export-file{
  box-sizing: border-box;
  width: 334px;
  padding-left: 24px;
  background: #FBFCFF;
  position: absolute;
  right: -128px;
  top: 50px;
  z-index: 100;
  box-shadow: 0px 2px 4px rgba(66, 66, 66, 0.2);
  .export-title {
    color: #A4A4A4;
    display: block;
    margin: 5px 0px;
    font-size: 12px;
    text-align: left;
  }
  .export-row{
    display: flex;
    align-items: center;
    margin: 8px 0;
  }
  .export-btn{
    height: 32px;
    line-height: 32px;
    width: 120px;
    box-sizing: border-box;
    background: #fff;
    color: #424242;
    border: 1px solid#DEDEDE;
    border-radius: 4px;
    text-align: center;
    font-size: 14px;
    &:hover {
      cursor: pointer;
      border: 1px solid #4284F5;
    }
  }
  .export-tip{
    flex: 1;
    width: 0;
    font-size: 12px;
    color: #A4A4A4;
    box-sizing: border-box;
    padding-left: 8px;
    text-align: left;
  }
}
</style>
