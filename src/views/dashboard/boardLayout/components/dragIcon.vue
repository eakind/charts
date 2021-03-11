<template>
<!-- :className="'hide-mirror'" @dragging="draggingHandler(arguments, itemData.type)"  stopDragHandler(arguments, itemData.type)  @stopDrag="stopDragHandler"-->
  <dc-drag class="drag-icon" :hide="true"   @dragging="draggingHandler(arguments, itemData.type)" @stopDrag="stopDragHandler(arguments, itemData.type)">
  </dc-drag>
</template>
<script>
import DcDrag from '@/components/dcdrag/dcDrag.vue';
export default {
  data () {
    return {
    };
  },
  props: {
    itemData: {
      type: Object
    }
  },
  components: {
    DcDrag
  },
  mounted () {
  },
  methods: {
    draggingHandler (paramList, type) {
      let clientX = paramList[2];
      let clientY = paramList[3];
      let worksheetId = this.itemData.worksheetId;
      let canvasType = this.itemData.type;
      let idx = this.itemData.idx;
      this.bus.$emit('dragging-module', clientX, clientY, type, worksheetId, null, null, canvasType, idx);
    },
    stopDragHandler (paramList, type) {
      let clientX = paramList[2];
      let clientY = paramList[3];
      let worksheetId = this.itemData.worksheetId;
      let canvasType = this.itemData.type;
      let idx = this.itemData.idx;
      this.bus.$emit('stop-drag-module', clientX, clientY, type, worksheetId, null, null, canvasType, idx);
    },
    // stopDragHandler (element, target) {
    //   let targetIdx = Number(this.getTargetIdx(target));
    //   let originIdx = Number(this.itemData.idx);
    //   if (!targetIdx) return;
    //   if (originIdx === targetIdx) return;
    //   this.$emit('swap-comp', originIdx, targetIdx);
    // },
    // getTargetIdx (target) {
    //   if (target.dataset.idx) {
    //     return target.dataset.idx;
    //   } else {
    //     return this.getTargetIdx(target.parentElement);
    //   }
    // }
  }
};
</script>
<style lang="scss">
.hide-mirror {
  display: none !important;;
}
</style>
<style lang='scss' scoped>
.drag-icon {
  z-index: 99;
  position: absolute;
  top: -16px;
  left: calc(50% - 40px);
  height: 16px;
  width: 80px;
  min-width: 80px;
  cursor: move;
  display: inline-block;
  background-color: #666666;
  border-radius: 4px 4px 0px 0px;
  // pointer-events: none;
  &::before{
    content: '';
    height: 2px;
    width: 64px;
    border-radius: 4px;
    background-color: white;
    top: 4px;
    left: 50%;
    transform: translateX(-50%);
    position: absolute;
  }
  &::after{
    content: '';
    height: 2px;
    width: 64px;
    border-radius: 4px;
    background-color: white;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    position: absolute;
  }
}
</style>
