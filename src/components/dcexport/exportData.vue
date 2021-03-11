<template>
  <div class="export-data" :style="{height: routeName !== 'dashboard' ? '300px' : ''}">
    <div class="export-header">
      {{$t('message.export_data')}}
    </div>
    <div class="export-body">
      <div class="body-up" v-if="routeName !== 'dashboard'">
        <div class="left">
          <span>{{$t('message.select_canvas')}}</span>
        </div>
        <div class="right">
          <dc-select-view class="select-right" :list="list" :select="selectCanvas" @change="changeCanvas"></dc-select-view>
        </div>
      </div>
      <div class="body-up">
        <div class="left">
          {{$t('message.select_data')}}
        </div>
        <div class="right">
          <div class="data-origin" :class="selectOrigin ? 'origin-active' : ''" @click="selectOrigin=true">
            {{$t('message.canvas_data')}}
          </div>
          <div class="data-origin" :class="!selectOrigin ? 'origin-active' : ''" @click="selectOrigin=false">
            {{$t('message.origin_data')}}
          </div>
        </div>
      </div>
    </div>
    <div class="export-footer">
      <button @click="sureHandler">{{$t('message.confirmed')}}</button>
      <button @click="cancelHandler">{{$t('message.cancel')}}</button>
    </div>
  </div>
</template>

<script>
import DcSelectView from '../dcselectview/dcSelectView';
import { url } from '../../api/url';
import { apiAddr2 } from '../../config';
import { mapState } from 'vuex';
export default {
  name: 'ExportData',
  components: {
    DcSelectView,
  },
  data () {
    return {
      selectOrigin: true,
      selectCanvas: this.worksheetId,
      routeName: this.$route.name,
      list: []
    };
  },
  computed: {
    ...mapState({
      projectId: state => state.project.projectId,
      worksheetId: state => state.dashboard.worksheetId,
      canvasList: state => state.dashboard.canvasList
    })
  },
  watch: {
    canvasList: {
      handler (array) {
        this.initCanvas(array);
      },
      deep: true
    }
  },
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
  },
  mounted () {
    document.body.style.pointerEvents = 'none';
    this.$el.style.pointerEvents = 'auto';
    this.initCanvas(this.canvasList);
  },
  destroyed () {
    document.body.style.pointerEvents = 'auto';
  },
  methods: {
    initCanvas (array) {
      this.list = [];
      for (let i = 0; i < array.length; i++) {
        this.list.push({
          name: array[i].worksheet_title,
          id: array[i].worksheet_id
        });
      }
      this.selectCanvas = this.list[0].id;
    },
    changeCanvas (obj) {
      this.selectCanvas = obj.id;
    },
    sureHandler () {
      let worksheetId = this.worksheetId;
      if (this.routeName === 'displayboard') {
        worksheetId = this.selectCanvas;
      }
      let dcUserToken = localStorage.getItem('dcUserToken');
      let downloadParam = '?project_id=' + this.projectId + '&worksheet_id=' + worksheetId + '&offset=0&limit=999999' + '&token=' + dcUserToken; ;
      let downloadUrl = url.canvasData;
      let downloadType = '&is_agg=0&time=' + new Date().getTime();
      if (this.selectOrigin) {
        downloadType = '&is_agg=1&time=' + new Date().getTime();
      }
      window.open(apiAddr2 + downloadUrl + downloadParam + downloadType);
      this.$emit('cancel');
    },
    cancelHandler () {
      this.$emit('cancel');
    }
  }
};
</script>

<style scoped lang="scss">
.export-data{
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 250px;
  color: black;
  z-index: 999999999;
  background-color: #f6f6f6;
  box-shadow: 0 12px 30px 0 rgba(0,0,0,0.30);
  border-radius: 4px;
  user-select: none;
  .export-header{
    height: 60px;
    line-height: 80px;
    font-size: 18px;
    text-align: center;
  }
  .export-body{
    .body-up{
      display: flex;
      padding: 20px 0px;
      .left{
        width: 200px;
        text-align: right;
        span{
          top: 7px;
          position: relative;
        }
      }
      .right{
        flex: 1;
        .data-origin{
          width: 100px;
          height: 50px;
          color: #666666;
          font-size: 14px;
          padding: 15px 0px 0px;
          border-radius: 4px;
          border: 1px solid #979797;
          box-sizing: border-box;
          margin-left: 20px;
          text-align: center;
          display: inline-block;
        }
        .origin-active{
          color: #4284f5;
          border: 1px solid #4284f5;
          background-color: white;
        }
        .select-right{
          margin-left: 20px;
          width: 210px;
        }
      }
    }
  }
  .export-footer{
    text-align: center;
    padding-top: 20px;
    button{
      width: 130px;
      height: 38px;
      line-height: 25px;
      text-align: center;
      border-radius: 50px;
      margin: 0px 20px;
      outline: none;
      &:first-child{
        color: white;
        border: 1px solid #4284f5;
        background-color: #4284f5;
      }
      &:last-child{
        border: 1px solid #666666;
        background-color: white;
      }
    }
  }
}
</style>
