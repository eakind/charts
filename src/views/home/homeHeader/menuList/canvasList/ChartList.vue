<template>
  <div class="chart-list">
    <!-- <span class="iconfont icon-db_arrow drop-btn" :class="isOpen" @click="dropList" v-if="totalList.length > 0"></span> -->
    <div class="list">
      <list-item v-for="(item, index) in pageList" :key="index" :item="item"
                 @click.native.stop="changeItem(item)"></list-item>
    </div>
    <template v-if="isPreActive||isNextActive">
      <span class="iconfont icon-db_arrow current-btn left"  :class="isPreActive" @click="preHandler"></span>
      <span class="iconfont icon-db_arrow current-btn right" :class="isNextActive" @click="nextHandler"></span>
    </template>
<!-- v-click-out="hideList" -->
    <!-- <scroll-list class="scroll-list"  v-click-out="hideList"  v-if="isDrop" @loadMore="loadMore">
      <scroll-item v-for="(item, index) in totalList" :key="index"
                  :item="item" :item-id="itemId" :index="index"
                  @click.native="changeItem(item, index)"></scroll-item>
    </scroll-list> -->
  </div>
</template>
<script>
import ListItem from './ListItem.vue';
// import ScrollList from './ScrollList.vue';
// import ScrollItem from './ScrollItem.vue';
import { mapMutations, mapState } from 'vuex';
import { get } from '@/api/server';
export default {
  data () {
    return {
      isDrop: false,
      itemId: '',
      listOffset: 0,
      listLimit: 100,
      list: []
    };
  },
  props: {
    pageList: {
      type: Array
    },
    offset: {
      type: Number
    },
    limit: {
      type: Number
    },
    totalList: {
      type: Array
    }
  },
  computed: {
    ...mapState('project', ['projectId']),
    ...mapState('drawingboard', ['currentCanvas', 'canvasNum']),
    isOpen () {
      return this.isDrop ? 'open-active' : '';
    },
    isPreActive () {
      if (this.offset > 0) {
        return 'icon-active';
      }
      return '';
    },
    isNextActive () {
      if ((this.offset + this.limit) < this.canvasNum) {
        return 'icon-active';
      }
      return '';
    }
  },
  components: {
    ListItem,
    // ScrollList,
    // ScrollItem
  },
  methods: {
    ...mapMutations('drawingboard', ['setCurrentCanvas', 'setCanvasList', 'setCurrentCanvasDetail', 'setRowList', 'setColumnList']),
    ...mapMutations('drawingboard', ['setLabelsCapsuleList', 'setColorCapsuleList', 'setSizeCapsuleList', 'setCanvasType']),
    preHandler () {
      this.$emit('pre');
    },
    nextHandler () {
      this.$emit('next');
    },
    hideList (e) {
      if (!e) {
        this.isDrop = false;
        return;
      }
      let curDom = document.querySelector('.menu-list .icon-db_arrow.drop-btn');
      if (curDom && curDom.contains(e.target)) {
        return;
      }
      this.isDrop = false;
    },
    dropList () {
      this.itemId = this.setCurrentCanvas.worksheet_id;
      this.isDrop = !this.isDrop;
      if (this.totalList.length < this.canvasNum) {
        this.getCanvasList();
      }
    },
    changeItem (item, index) {
      if (item.worksheet_id === this.currentCanvas.worksheet_id) return;
      this.itemId = item.worksheet_id;
      // 清空上一个画布的数据
      this.setCurrentCanvasDetail({});
      this.setColumnList([]);
      this.setRowList([]);
      this.setLabelsCapsuleList([]);
      this.setColorCapsuleList([]);
      this.setSizeCapsuleList([]);
      this.setCanvasType('');
      this.setCurrentCanvas(item);
      this.hideList();
      if (index || index === 0) {
        this.$emit('setPage', index);
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
@import '../scss/chartList.scss';
</style>
