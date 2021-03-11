<template>
  <div class="map-right-lo-lat" >
    <!-- data-symbol="columnCapsule" -->
    <div class="capsule-panel"

         data-dragging="columnDragging">
      <span class="map-tip"
            data-symbol="columnCapsule"
            data-dragging="columnDragging"
            v-if="columnList.length<1">{{$t('message.longitude_tip')}}</span>
      <capsule-item class="capsule-item"
                    data-symbol="columnCapsuleReplace"
                    data-dragging="columnDragging"
                    v-else
                    :item="columnList[0]"
                    index="0"
                    type="column"
                    @change-aggr="changeAggr"
                    @remove="removeHandler(0)"></capsule-item>
    </div>
    <!-- data-symbol="columnCapsule" -->
    <div class="capsule-panel right"

         data-dragging="columnDragging">
      <span class="map-tip"
            data-symbol="columnCapsule"
            data-dragging="columnDragging"
            v-if="columnList.length<=1">{{$t('message.latitude_tip')}}</span>
      <capsule-item class="capsule-item"
                    data-symbol="columnCapsuleReplace"
                    data-dragging="columnDragging"
                    v-else
                    :item="columnList[1]"
                    index="1"
                    type="column"
                    @change-aggr="changeAggr"
                    @remove="removeHandler(1)"></capsule-item>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import CapsuleItem from './capsule/capsuleItem.vue';
export default {
  components: { CapsuleItem },
  computed: {
    ...mapState('drawingboard', ['columnList'])
  },
  methods: {
    ...mapMutations('drawingboard', ['setColumnList']),
    removeHandler (idx) {
      this.columnList.splice(idx, 1);
      this.setColumnList(this.columnList);
    }
  }
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}
.map-right-lo-lat {
  flex: 1;
  display: flex;
  height: 36px;
  .capsule-panel {
    flex: 1;
    background: #ffffff;
    border: 1px solid #4284f5;
    border-radius: 4px;
    max-width: 10vw;
    text-align: center;
    line-height: 30px;
    padding: 2px 0;
  }
  .map-tip {
    font-size: 14px;
    color: #a4a4a4;
  }
  .right {
    margin-left: 8px;
  }
}
/deep/ .dc-drag{
    margin: auto;
}
</style>
