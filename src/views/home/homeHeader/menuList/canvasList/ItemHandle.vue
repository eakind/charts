<template>
  <div class="item-handle">
    <div class="triangle-box">
      <div class="item-triangle"></div>
    </div>
    <div class="iconfont icon-dbc_copy" @click.stop="copyCanvas">
      {{$t('home.copy_canvas')}}
    </div>
    <div class="iconfont icon-db_trash" @click.stop="delCanvasProcess">
      {{$t('home.del_canvas')}}
      <span class="line"></span>
    </div>
  </div>
</template>
<script>
import { post } from '@/api/server';
import { mapState, mapMutations } from 'vuex';
export default {
  data () {
    return {
    };
  },
  props: {
    itemId: {
      type: String
    },
    itemIndex: {
      type: Number
    }
  },
  computed: {
    ...mapState('project', ['projectId']),
    ...mapState('drawingboard', ['canvasList', 'currentCanvas', 'canvasNum'])
  },
  components: {
  },
  mounted () {
  },
  methods: {
    ...mapMutations(['setIsCreateCanvas']),
    ...mapMutations('drawingboard', ['setCanvasList', 'setCurrentCanvas', 'setCanvasNum', 'setCurrentCanvasDetail']),
    ...mapMutations('drawingboard', ['setLabelsCapsuleList', 'setColorCapsuleList', 'setSizeCapsuleList', 'setCanvasType', 'setColumnList', 'setRowList']),
    async copyCanvas () {
      let param = {
        project_id: this.projectId,
        worksheet_id: this.itemId
      };
      this.$emit('close');
      let res = await post('copyWorksheet', param);
      if (res.code !== 0) return;
      let obj = {
        worksheet_id: res.worksheet_id,
        worksheet_idx: res.worksheet_idx,
        worksheet_name: res.worksheet_name,
        worksheet_title: res.worksheet_title,
        worksheet_type: res.worksheet_type
      };
      let list = JSON.parse(JSON.stringify(this.canvasList));
      list.push(obj);
      this.setCanvasList(list);
      this.setCanvasNum(++this.canvasNum);
    },
    delCanvasProcess () {
      this.$showMessageBox({
        title: '删除画布',
        confirmText: '确定',
        cancelText: '取消',
        contentHtml: '确定删除画布吗?',
        cb: () => {
          this.delCanvas();
          this.$closeMessageBox();
        }
      });
    },
    async delCanvas () {
      let param = {
        project_id: this.projectId,
        worksheet_id: this.itemId
      };
      let res = await post('deleteCanvas', param);
      if (res.code !== 0) return;
      this.$emit('close');
      for (let i = 0; i < this.canvasList.length; i++) {
        if (this.itemId === this.canvasList[i].worksheet_id) {
          this.canvasList.splice(i, 1);
          break;
        }
      }
      this.setCanvasNum(--this.canvasNum);
      this.setCanvasList(this.canvasList);
      if (this.canvasNum === 0) {
        this.setIsCreateCanvas(true);
        return;
      };
      if (this.currentCanvas.worksheet_id === this.itemId) {
        this.setCurrentCanvasDetail({});
        this.setColumnList([]);
        this.setRowList([]);
        this.setLabelsCapsuleList([]);
        this.setColorCapsuleList([]);
        this.setSizeCapsuleList([]);
        this.setCurrentCanvas(this.canvasList[0]);
        this.bus.$emit('del-canvas');
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.item-handle {
  height: auto;
  color: #fff;
  padding: 0 6px;
  position: fixed;
  z-index: 999;
  .triangle-box {
    height: 10px;
    width: 120px;
  }
  .item-triangle {
    display: inline-block;
    border-bottom: 12px solid #666666;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    position: absolute;
    left: calc(50% - 3px);
    top: 0px;
  }
  .iconfont{
    height: 35px;
    width: 120px;
    cursor: pointer;
    padding: 8px 15px;
    font-size: 14px;
    background: #666666;
  }
  .icon-db_trash {
    border-radius: 0px 0px 4px 4px;
    position: relative;
    .line {
      height: 1px;
      width: 108px;
      background: #fff;
      position: absolute;
      left: 6px;
      top: 0px;
    }
  }
}
</style>
