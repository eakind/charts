<template>
  <dc-dialog class="create-canvas">
    <span class="newproject_title">{{$t('message.new_canvas')}}</span>
    <div class="bg-panel">
      <span class="newcanvas-title">{{$t('message.background')}}</span>
      <dc-color-list @change="changeBgHandler"
                     :start="0"
                     :index="0"></dc-color-list>
    </div>
    <div class="newproject_chartbg">
      <span class="newcanvas-title">{{$t('message.canvas_type')}}</span>
      <div class="icon-chart-wrap flex">
        <template v-for="id in worksheetTypesList">
          <div class="icon-chart-box" :class="selectChartId === id?'active':''"
               :key="id" @click="selectChart(id)">
                <span class="iconfont chart-icon" :class="newWorksheetTypesIconMap[id]"></span>
                <span class="text">{{worksheetTypesNameMap(id)}}</span>
          </div>
        </template>
      </div>
    </div>
    <div class="chart-footer">
      <button class="confirm-btn"
              @click="createCanvasHandler">{{$t('message.confirm')}}</button>
      <button class="cancel-btn"
              @click="hideHandler">{{$t('message.cancel')}}</button>
    </div>
  </dc-dialog>
</template>

<script>
import DcDialog from '@/components/dialog/dialog.vue';
import DcColorList from '@/components/dccolorlist/dcColorList';
import { post } from '@/api/server';
import { mapState, mapGetters, mapMutations } from 'vuex';
export default {
  name: 'CreateCanvas',
  data () {
    return {
      clickFlag: true,
      selectColorIndex: 0,
      selectChartId: '02'
    };
  },
  computed: {
    ...mapState('drawingboard', ['canvasNum', 'canvasList']),
    ...mapState('project', [
      'projectId',
      'locale',
      'worksheetTypesList',
      'worksheetTypes',
      'worksheetTypesIconMap',
      'worksheetTypesIconActiveMap',
      'newWorksheetTypesIconMap',
    ]),
    ...mapState('colors', ['colorTemp']),
    ...mapGetters('project', ['worksheetTypesNameMap']),
  },
  components: {
    DcDialog,
    DcColorList
  },
  methods: {
    ...mapMutations(['setIsCreateCanvas']),
    ...mapMutations('drawingboard', ['setCanvasType', 'setCanvasNum', 'setCanvasList', 'setCurrentCanvas', 'setColorCapsuleList']),
    ...mapMutations('drawingboard', ['setCurrentCanvasDetail', 'setColumnList', 'setRowList', 'setLabelsCapsuleList', 'setSizeCapsuleList']),
    changeBgHandler (index) {
      this.selectColorIndex = index;
    },
    hideHandler () {
      this.$emit('hide', false);
    },
    createCanvasHandler () {
      if (this.$route.name === 'drawingboard') {
        this.createCanvas();
      } else {
        this.$emit('watting', this.selectChartId);
      }
    },
    selectChart (id) {
      this.selectChartId = id;
    },
    async analyze () {
      let param = {
        project_id: this.projectId
      };
      let res = await post('analyze', param);
      if (!res) return;
      this.createCanvas();
    },
    setCss () {
      return {
        color: this.colorTemp[this.selectColorIndex].color,
        opacity: 100,
        background: this.colorTemp[this.selectColorIndex].background,
        index: this.selectColorIndex
      };
    },
    setTitleCss () {
      return {
        color: this.colorTemp[this.selectColorIndex].color
      };
    },
    async createCanvas () {
      let param = {
        project_id: this.projectId,
        worksheet_type: this.selectChartId,
        css: {
          bgCss: this.setCss(),
          titleCss: this.setTitleCss()
        }
      };
      if (this.clickFlag === false) return;
      this.clickFlag = false;
      this.bus.$emit('showFullLoading', true);
      let res = await post('createCanvas', param);
      this.bus.$emit('showFullLoading', false);
      setTimeout(() => {
        this.clickFlag = true;
      }, 1500);
      if (!res) return;
      this.setCanvasType(this.worksheetTypes[param.worksheet_type]);
      this.$emit('updatelist');
      localStorage.chartType = this.selectChartId;
      this.setCanvasNum(++this.canvasNum);
      let obj = {
        worksheet_id: res.worksheet_id,
        worksheet_idx: res.worksheet_idx,
        worksheet_name: res.worksheet_name,
        worksheet_title: res.worksheet_title,
        worksheet_type: param.worksheet_type
      };
      this.canvasList.push(obj);
      this.setCanvasList(this.canvasList);
      this.setCurrentCanvasDetail({});
      this.setColumnList([]);
      this.setRowList([]);
      this.setLabelsCapsuleList([]);
      this.setColorCapsuleList([]);
      this.setSizeCapsuleList([]);
      this.setCurrentCanvas(obj);
      this.setIsCreateCanvas(false);
      this.$emit('hide', false);
    }
  }
};
</script>

<style scoped lang="scss">
*{
  box-sizing: border-box;
}
.newproject_title {
  color: #424242;
  display: block;
  font-size: 16px;
  padding: 15px;
  text-align: center;
  position: relative;
  font-weight: bold;
}
.newproject-close {
  color: white;
  display: inline-block;
  position: absolute;
  top: -20px;
  right: 0px;
  transform: rotate(-45deg);
}
.newcanvas-title {
  font-size: 14px;
  color: #424244;
  padding: 0px 0px 10px;
  display: block;
  font-weight: bold;
}
.newproject_chartbg {
  width: 1200px;
  padding: 10px 20px 40px;
  border-radius: 5px;
  box-sizing: border-box;
  background-color: rgb(231, 235, 242);
  font-size: 12px;
  margin: 20px;
  position: relative;
  .newproject_chart {
    height: 80px;
    width: 80px;
    margin-right: 30px;
    border-radius: 50%;
    cursor: pointer;
    display: inline-block;
    text-align: center;
    span {
      top: 90px;
      color: #424242;
      font-size: 14px;
      position: relative;
    }
    &:hover {
      span {
        color: #4284f5;
      }
    }
  }
  .newproject_span_en {
    font-size: 12px !important;
  }
}
.bg-panel {
  background-color: rgb(231, 235, 242);
  border-radius: 4px;
  margin: 20px;
  padding: 10px 20px;
  .bg-list {
    padding: 0px;
    margin: 0px;
    list-style-type: none;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    .bg-item {
      height: 48px;
      width: 48px;
      line-height: 48px;
      text-align: center;
      border: 1px solid white;
      border-radius: 4px;
      margin-right: 10px;
      display: inline-block;
      &:hover {
        border: 1px solid #4284f5;
      }
    }
  }
}
.bg-item-active {
  border: 1px solid #4284f5 !important;
}
.chart-footer {
  padding: 0px 10px 15px;
  text-align: center;
  button {
    margin: 0px 50px;
    border: none;
    outline: none;
    cursor: pointer;
    font-size: 16px;
    background-color: transparent;
  }
  .confirm-btn {
    color: #4284f5;
  }
  .cancel-btn {
    color: #666666;
  }
}
.chart-title__active {
  color: #4284f5 !important;
}
.flex{
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.icon-chart-wrap{
  .icon-chart-box{
    width: 150px;
    height: 43px;
    line-height: 43px;;
    margin: 9px 20px;
    padding-left: 8px;
    .chart-icon{
      font-size: 20px;
      color:#A4A4A4;;
    }
    .text{
      font-size: 16px;
      margin-left: 9px;
    }
    &:hover{
      border: 1px solid #4284F5;
      border-radius: 4px;
      background-color: #fff;
      .chart-icon{
        color: #FACC14;;
      }
      .text{
        color: #4284F5;;
      }
    }
  }
  .icon-chart-box.active{
    border: 1px solid #4284F5;
      border-radius: 4px;
      background-color: #fff;
       .chart-icon{
        color: #FACC14;;
      }
      .text{
        color: #4284F5;;
      }
  }
}
</style>
