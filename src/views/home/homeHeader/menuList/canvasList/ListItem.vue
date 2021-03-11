<template>
  <div class="list-item" @mouseenter="mouseEnter" @click="isDot=true" @mouseleave="isDot=false;isHandle=false">
    <div class="item-up">
      <span class="chart-type">{{num}}
        <span class="worksheet-type" v-if="item.worksheet_type">. {{worksheetTypesNameMap(item.worksheet_type)}}</span>
      </span>
    </div>
    <div class="item-down" :class="isActive">
      {{item.worksheet_title}}
    </div>
    <span class="iconfont icon-db_menuDot" v-show="isDot" @click.stop="showHandler"></span>
    <item-handle class="item-handle" :style="setPos" v-if="isHandle"
                :item-id="item.worksheet_id" :item-index="num-1"
                v-click-out="hideHandler" @close="hideHandler"></item-handle>
                 <!-- v-if="isHandle" -->
  </div>
</template>
<script>
import ItemHandle from './ItemHandle.vue';
import { mapState, mapGetters } from 'vuex';
export default {
  data () {
    return {
      isHandle: false,
      isDot: false
    };
  },
  props: {
    item: {
      type: Object
    }
  },
  computed: {
    ...mapState('drawingboard', ['currentCanvas', 'canvasList']),
    ...mapGetters('project', ['worksheetTypesNameMap']),
    isActive () {
      if (this.item.worksheet_id === this.currentCanvas.worksheet_id) {
        return 'item-active';
      }
      return '';
    },
    setPos () {
      if (this.isHandle) {
        let left = this.$el.getBoundingClientRect().left + 80;
        let top = this.$el.getBoundingClientRect().bottom;
        return {
          left: left + 'px',
          top: top + 'px'
        };
      }
      return {};
    },
    num () {
      let list = this.canvasList;
      let len = this.canvasList.length;
      for (let i = 0; i < len; i++) {
        if (list[i].worksheet_id === this.item.worksheet_id) {
          return i + 1;
        }
      }
      return '';
    }
  },
  components: {
    ItemHandle
  },
  mounted () {
  },
  methods: {
    mouseEnter () {
      // if (this.isActive){
      this.isDot = true;
      // }
    },
    hideHandler () {
      this.isHandle = false;
    },
    showHandler () {
      this.isHandle = !this.isHandle;
    }
  }
};
</script>
<style lang='scss' scoped>
@import '../scss/listItem.scss';
</style>
