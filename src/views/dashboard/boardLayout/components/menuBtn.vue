<template>
  <div class="menu-btn" @click.stop="" v-click-out="hide">
    <div class="iconfont icon-db_plus"  @click="delHandler"></div>
    <div class="iconfont icon-db_triangle" @click="isShow=!isShow"></div>
    <menu-list class="menu-list"  v-if="isShow"
                :style="listPosition"
                :menu-list="list"
                @set-float="setFloat"
                @set-action="setAction"
                @cancel-current="cancelCurrentAction"
                @cancel-all="cancelAllAction"
                @canvas-edit="gotoCanvasEdit"
                @cancel-select="cancelSelected"
                @set-text="setTextHandler"
                @del="delHandler"
                @set-layout-item="setCurrentLayoutItem"></menu-list>
  </div>
</template>
<script>
import { mapMutations, mapState, mapActions } from 'vuex';
import { post } from '@/api/server';
import MenuList from './menuList.vue';
import { refreshCanvasMixin } from '../mixins/refreshCanvas.js';
import { operateLayout } from '../mixins/operateLayout.js';
export default {
  mixins: [refreshCanvasMixin, operateLayout],
  data () {
    return {
      isShow: false,
      currentAction: {},
      targetIndex: 0
    };
  },
  props: {
    itemData: {
      type: Object
    }
  },
  components: {
    MenuList
  },
  computed: {
    ...mapState('dashboard', ['workSheetList', 'actionList', 'currentDashboardDetail', 'layoutList', 'floatComponents']),
    ...mapState('project', ['projectId']),
    listPosition () {
      let value = -104;
      if (this.itemData && this.itemData.isDir === 'right') {
        value = 0;
      }
      return {
        right: `${value}px`
      };
    },
    list () {
      let list = [];

      let editor = {
        title: '',
        children: [{
          title: '编辑文本',
          emit: 'set-text',
          active: true
        }]
      };

      let layout = {
        title: '布局',
        children: [{
          title: this.floatStr,
          emit: 'set-float',
          active: false
        }]
      };

      let action = {
        title: '联动交互',
        children: [{
          title: '联动交互设置',
          emit: 'set-action',
          active: true
        }]
        // }, {
        //   title: '取消所有选中',
        //   emit: 'cancel-all',
        //   active: true
        // }]
      };
      if (this.hasAction()) {
        action.children.push({
          title: '取消当前选中',
          emit: 'cancel-current',
          active: true
        });
      }

      let other = {
        title: '其他',
        children: [{
          title: '取消选择',
          emit: 'cancel-select',
          active: true
        }, {
          title: '移除',
          emit: 'del',
          active: true
        }]
      };
      if (this.itemData.type === 'canvas') {
        other.children.unshift({
          title: '转至画布编辑',
          emit: 'canvas-edit',
          active: true
        });
      };
      if (this.currentDashboardDetail.css.device === 'mobile') {
        if (this.itemData.type === 'text') {
          list.push(editor, other);
        } else if (this.itemData.type === 'filter') {
          list.push(other);
        } else {
          list.push(action, other);
        }
      } else {
        if (this.itemData.type === 'text') {
          list.push(layout, editor, other);
        } else if (this.itemData.type === 'filter') {
          list.push(layout, other);
        } else {
          list.push(layout, action, other);
        }
      }
      return list;
    },
    floatStr () {
      return this.itemData.float ? '清除浮动' : '浮动';
    }
  },
  mounted () {
  },
  methods: {
    ...mapMutations('drawingboard', ['setCurrentCanvas']),
    ...mapMutations('dashboard', ['setActionFlag', 'setFloatComponents', 'setCurrentTarget', 'setSelectedTarget']),
    ...mapActions('dashboard', ['setCss']),
    hasAction () {
      let list = this.actionList;
      let worksheetId = this.itemData.worksheetId;
      for (let i = 0; i < list.length; i++) {
        if (worksheetId === list[i].origin_worksheet_id) {
          return true;
        }
      }
      return false;
    },
    setTextHandler () {
      this.$emit('set-text');
    },
    delHandler () {
      this.$showMessageBox({
        title: '移除',
        confirmText: this.$t('home.confirm'),
        cancelText: this.$t('home.cancel'),
        contentHtml: '确定移除吗？',
        cb: () => {
          this.delDashboard();
          this.$closeMessageBox();
        }
      });
    },
    delDashboard () {
      this.$emit('del');
    },
    setFloat (item) {
      if (item.title === '浮动') {
        this.itemData.float = true;
        let dom = this.$parent.$el;
        let domWdith = dom.getBoundingClientRect().width;
        let domHeight = dom.getBoundingClientRect().height;
        this.itemData.widthPx = domWdith;
        this.itemData.heightPx = domHeight;
        let domOffsetParent = this.getDomOffset(dom, 'fixed-width');
        this.itemData.floatX = domOffsetParent.left;
        this.itemData.floatY = domOffsetParent.top + 1;
        this.itemData.floatZIndex = 100;
        this.floatComponents.push(this.itemData);
        this.setFloatComponents(this.floatComponents);
        let params = {
          dashboard_id: this.currentDashboardDetail.dashboard_id,
          project_id: this.projectId,
          floats: this.floatComponents
        };
        let res = post('dashboardFloats', params);
        if (res.code === 0) {
        }
        this.$emit('del');
        this.setCurrentTarget(this.itemData);
        this.setSelectedTarget(this.itemData);
        setTimeout(() => {
          if (this.floatComponents) this.refreshAllCanvas(this.floatComponents);
        }, 200);
      } else {
        let dom = this.$parent.$el;
        let rootDom = document.querySelector('.fixed-width');
        let rootRect = rootDom.getBoundingClientRect();
        let floatItemTop = this.itemData.floatY + rootRect.top;
        let floatItemLeft = this.itemData.floatX + rootRect.left;
        let getIndex = 0;
        let startTop = rootRect.top;
        let endTop = rootRect.top;
        this.targetIndex = 0;
        for (let i = 0; i < this.layoutList.length - 1; i++) {
          this.targetIndex = this.targetIndex + 1;
          getIndex = this.targetIndex;
          startTop = startTop + rootRect.height * this.layoutList[i].height / 100;
          endTop = endTop + startTop + rootRect.height * this.layoutList[i + 1].height / 100;
          if (startTop > floatItemTop) {
          } else if (startTop <= floatItemTop && endTop >= floatItemTop) {
            if (this.layoutList[i + 1].children.length === 0) {
              if (rootRect.width / 2 > floatItemLeft) {
                this.$emit('set-layout-item', this.layoutList[i + 1], 'left');
              } else {
                this.$emit('set-layout-item', this.layoutList[i + 1], 'right');
              }
            } else {
              this.getCurElement(rootRect, this.layoutList[i + 1], getIndex, floatItemLeft, floatItemTop);
            }
            break;
          } else {
          }
        }
        let domRect = dom.getBoundingClientRect();
        this.bus.$emit('stop-drag-module', domRect.left, domRect.top, this.itemData.type, this.itemData.worksheetId, this.itemData.filterId, this.itemData.filterType);
        let getFloatComp = this.floatComponents.filter(floatItem => {
          return floatItem.filterId !== this.itemData.filterId;
        });
        this.setFloatComponents(getFloatComp);
        let params = {
          dashboard_id: this.currentDashboardDetail.dashboard_id,
          project_id: this.projectId,
          floats: this.floatComponents
        };
        let res = post('dashboardFloats', params);
        if (res.code === 0) {
          if (this.floatComponents) this.refreshAllCanvas(this.floatComponents);
        }
      }
    },
    getCurElement (rootRect, layoutList, getIndex, floatItemLeft, floatItemTop) {
      let startChildLeft = 0;
      let endChildLeft = 0;
      let startChildTop = 0;
      let endChildTop = 0;
      let layoutListChild = layoutList.children;
      if (layoutList.dir === 'row' && layoutListChild.length > 0) {
        for (let n = 0; n < layoutListChild.length; n++) {
          this.targetIndex = this.targetIndex + 1;
          getIndex = this.targetIndex;
          let curDomRect = document.getElementsByClassName('layout-item')[getIndex].getBoundingClientRect();
          startChildLeft = curDomRect.left;
          endChildLeft = curDomRect.left + curDomRect.width;
          if (startChildLeft <= floatItemLeft && endChildLeft >= floatItemLeft) {
            if (layoutListChild[n].children.length > 0) {
              let parentRect = document.getElementsByClassName('layout-item')[getIndex].getBoundingClientRect();
              this.getCurElement(parentRect, layoutListChild[n], getIndex, floatItemLeft, floatItemTop);
            } else {
              let targetDir = this.calcTargetDir(floatItemLeft, floatItemTop, getIndex);
              this.$emit('set-layout-item', layoutListChild[n], targetDir);
            }
          } else {
          }
        }
      } else if (layoutList.dir === 'column' && layoutListChild.length > 0) {
        for (let m = 0; m < layoutListChild.length; m++) {
          this.targetIndex = this.targetIndex + 1;
          getIndex = this.targetIndex;
          let curDomRect = document.getElementsByClassName('layout-item')[getIndex].getBoundingClientRect();
          startChildTop = curDomRect.top;
          endChildTop = curDomRect.top + curDomRect.height;
          if (startChildTop <= floatItemTop && endChildTop >= floatItemTop) {
            if (layoutListChild[m].children.length > 0) {
              let parentRect = document.getElementsByClassName('layout-item')[getIndex].getBoundingClientRect();
              this.getCurElement(parentRect, layoutListChild[m], getIndex, floatItemLeft, floatItemTop);
            } else {
              let targetDir = this.calcTargetDir(floatItemLeft, floatItemTop, getIndex);
              this.$emit('set-layout-item', layoutListChild[m], targetDir);
              break;
            }
          } else {
          }
        }
      }
    },
    getDomOffset (curDom, CurParentClass) {
      let curDomOffset = curDom.getBoundingClientRect();
      let CurParent = curDom;
      while (CurParent.getAttribute('class').indexOf(CurParentClass) < 0) {
        CurParent = CurParent.parentNode;
      }
      let curParentOffset = CurParent.getBoundingClientRect();
      let left = curDomOffset.left - curParentOffset.left;
      let top = curDomOffset.top - curParentOffset.top;
      return {
        left,
        top
      };
    },
    // 计算浮动元素的方向
    calcTargetDir (floatItemLeft, floatItemTop, getIndex) {
      let dom = document.getElementsByClassName('layout-item')[getIndex];
      let domLeft = dom.getBoundingClientRect().left;
      let domTop = dom.getBoundingClientRect().top;
      let domWidth = dom.getBoundingClientRect().width;
      let domHeight = dom.getBoundingClientRect().height;
      let targetX = floatItemLeft - domLeft;
      let targetY = floatItemTop - domTop;
      let layoutDir;
      if ((targetY <= (domHeight / domWidth) * targetX) && (targetY >= domHeight - (domHeight / domWidth * targetX))) {
        layoutDir = 'right';
      }
      if ((targetY < (domHeight / domWidth) * targetX) && (targetY < domHeight - (domHeight / domWidth * targetX))) {
        layoutDir = 'top';
      }
      if ((targetY >= (domHeight / domWidth) * targetX) && (targetY >= domHeight - (domHeight / domWidth * targetX))) {
        layoutDir = 'bottom';
      }
      if ((targetY > (domHeight / domWidth) * targetX) && (targetY < domHeight - (domHeight / domWidth * targetX))) {
        layoutDir = 'left';
      }
      return layoutDir;
    },
    setAction () {
      this.setActionFlag(true);
      this.isShow = true;
    },
    async cancelCurrentAction () {
      if (this.actionList.length === 0) return;
      let tempAction = [];
      this.actionList.forEach(item => {
        if (item.origin_worksheet_id === this.itemData.worksheetId) {
          tempAction.push(item);
        }
      });
      this.currentAction = this.actionList.find(
        (i) => i.origin_worksheet_id === this.itemData.worksheetId
      );
      if (tempAction.length === 0) return;
      tempAction.forEach(item => {
        this.modifyAction(item);
      });
    },
    async modifyAction (item) {
      let param = {
        project_id: this.projectId,
        dashboard_id: this.currentDashboardDetail.dashboard_id,
        action_id: item.action_id,
        target_worksheet_id: item.target_worksheet_id,
        actions: this.getCatsValue(item.actions),
        cats: item.cats
      };
      let res = await post('modifyAction', param);
      if (!res) return;
      if (res.code === 0) {
        this.isShow = false;
        this.refreshCanvas(this.layoutList, item.target_worksheet_id);
      };
    },
    getCatsValue (list) {
      let catsValue = [];
      catsValue = list;
      for (let i in list) {
        list[i].value = '';
      }
      return catsValue;
    },
    cancelAllAction () {
    },
    gotoCanvasEdit () {
      let worksheetId = this.itemData.worksheetId;
      let currentTarget = this.workSheetList.filter((item) => item.worksheet_id === worksheetId)[0];
      this.setCurrentCanvas(currentTarget);
      this.$router.push({
        path: 'drawingboard'
      });
    },
    cancelSelected () {
      this.$emit('cancel-select');
    },
    hide () {
      this.isShow = false;
    }
  }
};
</script>
<style lang='scss' scoped>
.menu-btn{
  background-color: #666666;
  height: 32px;
  width: 16px;
  z-index: 10;
  position: absolute;
  .iconfont {
    color: white;
    font-size: 14px;
    display: block;
    width: 16px;
    height: 16px;
    text-align: center;
    line-height: 16px;
    cursor: pointer;
  }
  .icon-db_plus{
    transform: rotate(45deg);
  }
  .menu-list {
    top: 32px;
    position: absolute;
  }
}
</style>
