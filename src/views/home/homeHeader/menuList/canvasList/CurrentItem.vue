<template>
  <div class="current-item">
    <div class="item-top">
      {{worksheetTypesNameMap(item.worksheet_type)}}
    </div>
    <div class="item-bottom">
      <span class="canvas-name">{{item.worksheet_title}}</span>
      <span class="iconfont icon-db_menuDot" @click.stop="showHandler"></span>
    </div>
    <!-- <span class="iconfont icon-db_arrow c-icon-db-arrow" :class="isOpen" @click.stop="isDropHandler"></span> -->
    <!-- <span class="canvas-name" @click.stop="isDropHandler">
      {{item.worksheet_title}}
    </span>
    <span class="canvas-type">({{worksheetTypesNameMap(item.worksheet_type)}})</span>
    <span class="iconfont icon-db_menuDot" @click.stop="showHandler"></span> -->
    <!-- <scroll-list class="scroll-list"  v-click-out="hideList"  v-if="isDrop" @loadMore="loadMore">
      <scroll-item v-for="(item, index) in canvasList" :key="index" :item="item" :index="index"
                   @click.native="changeItem(item, index)"></scroll-item>
    </scroll-list> -->
    <!-- <item-handle class="item-handle" :style="setPos" v-if="isHandle"
                :item-id="item.worksheet_id" :item-index="num-1"
                v-click-out="hideHandler" @close="hideHandler"></item-handle> -->
                <item-handle class="item-handle" :style="setPos" v-if="isHandle"
                :item-id="item.worksheet_id" :item-index="num-1"
                v-click-out="hideHandler" @close="hideHandler"></item-handle>
  </div>
</template>
<script>
// import ScrollList from './ScrollList.vue';
// import ScrollItem from './ScrollItem.vue';
import ItemHandle from './ItemHandle.vue';
import { mapState, mapGetters, mapMutations } from 'vuex';
import { get } from '@/api/server';
export default {
  data () {
    return {
      isDrop: false,
      isHandle: false,
      listOffset: 0,
      listLimit: 100,
      list: []
    };
  },
  props: {
    item: {
      type: Object
    },
  },
  computed: {
    ...mapState('project', ['projectId']),
    ...mapGetters('project', ['worksheetTypesNameMap']),
    ...mapState('drawingboard', ['canvasList', 'canvasNum']),
    setPos () {
      if (this.isHandle) {
        let curDom = document.querySelector('.menu-list .item-bottom');
        let left = curDom.getBoundingClientRect().left + curDom.getBoundingClientRect().width - 70;
        let top = curDom.getBoundingClientRect().top + 30;
        return {
          left: left + 'px',
          top: top + 'px'
        };
      }
      return {};
    },
    isOpen () {
      return this.isDrop ? 'open-active' : '';
    }
  },
  components: {
    // ScrollList,
    // ScrollItem,
    ItemHandle
  },
  methods: {
    ...mapMutations('drawingboard', ['setCurrentCanvas', 'setCanvasList', 'setCurrentCanvasDetail']),
    ...mapMutations('drawingboard', ['setLabelsCapsuleList', 'setColorCapsuleList', 'setSizeCapsuleList', 'setCanvasType']),
    isDropHandler () {
      this.isDrop = !this.isDrop;
      this.isHandle = false;
      if (this.canvasList.length < this.canvasNum) {
        this.setCanvasList([]);
        this.getCanvasList();
      }
    },
    hideList (e) {
      if (!e) {
        this.isDrop = false;
        return;
      }
      let curDom = document.querySelector('.menu-list .c-icon-db-arrow');
      if (curDom && curDom.contains(e.target)) {
        return;
      }
      this.isDrop = false;
    },
    hideHandler () {
      this.isHandle = false;
    },
    showHandler (e) {
      this.isHandle = true;
      this.isDrop = false;
    },
    changeItem (item) {
      if (item.worksheet_id) {
        this.setCurrentCanvasDetail({});
        this.setColumnList([]);
        this.setRowList([]);
        this.setLabelsCapsuleList([]);
        this.setColorCapsuleList([]);
        this.setSizeCapsuleList([]);
        this.setCurrentCanvas(item);
        this.hideList();
      }
    },
    loadMore () {
      if (this.listOffset > this.canvasNum) return;
      this.getCanvasList();
    },
    async getCanvasList () {
      let param = {
        project_id: this.projectId,
        offset: this.listOffset,
        limit: this.listLimit
      };
      let res = await get('canvasList', param);
      if (res.code === 0) {
        this.list = this.list.concat(res.worksheet_list);
        this.setCanvasList(this.list);
        this.listOffset = this.listOffset + this.listLimit;
      }
    }
  }
};
</script>
<style lang='scss' scoped>
@import '../scss/currentItem.scss';
</style>
