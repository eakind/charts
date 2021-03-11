import { getLayoutCompStyle } from '@/utils/utils.js';
import { post } from '@/api/server';
import { mapState } from 'vuex';
export const operateLayout = {
  computed: {
    ...mapState('project', ['projectId']),
    ...mapState('dashboard', ['currentDashboardDetail'])
  },
  methods: {
    // 交换组件
    swapCompList (list, originIdx, targetIdx) {
      let targetInfo = this.getLayoutCompInfo(list, targetIdx);
      let originInfo = this.getLayoutCompInfo(list, originIdx);
      this.swapComp(list, originInfo, targetIdx);
      this.swapComp(list, targetInfo, originIdx);
      return list;
    },
    swapComp (list, info, idx) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].idx === idx) {
          let temp = JSON.parse(JSON.stringify(list[i]));
          temp.worksheetId = info.worksheetId;
          temp.type = info.type;
          list.splice(i, 1, temp);
        } else {
          this.swapComp(list[i].children, info, idx);
        }
      }
    },
    // swapCompList (list, originItem, targetItem) {
    //   let isDir = targetItem.isDir;
    //   if (isDir === 'bottom' || isDir === 'top') {
    //     originItem.width = 100;
    //     originItem.height = 50;
    //     originItem.dir = 'row';
    //     targetItem.width = 100;
    //     targetItem.height = 50;
    //     targetItem.dir = 'row';
    //   } else {
    //     originItem.width = 50;
    //     originItem.height = 100;
    //     originItem.dir = 'column';
    //     targetItem.width = 50;
    //     targetItem.height = 100;
    //     targetItem.dir = 'column';
    //   }
    //   let tempList = JSON.parse(JSON.stringify(list));
    //   this.swapComp(list, tempList, targetItem, originItem.idx, true, originItem);
    //   this.swapComp(list, tempList, originItem, targetItem.idx, false);
    // },
    // swapComp (list, tempList, info, idx, flag, info2) {
    //   for (let i = 0; i < tempList.length; i++) {
    //     if (tempList[i].idx === info.parentIdx) {
    //       const obj = {
    //         column: 'row',
    //         row: 'column'
    //       };
    //       list[i].dir = obj[info.dir];
    //     }
    //     if (tempList[i].idx === idx) {
    //       const posObj = {
    //         bottom: 'top',
    //         top: 'bottom',
    //         left: 'right',
    //         right: 'left'
    //       };
    //       if (flag) {
    //         if (tempList[i].isDir === info.isDir) {
    //           info2.isDir = posObj[info.isDir];
    //         } else {
    //           list.splice(i, 1, info);
    //         }
    //       }
    //     } else {
    //       this.swapComp(list[i].children, tempList[i].children, info, idx);
    //     }
    //   }
    // },
    getLayoutCompInfo (list, idx) {
      let infoObj = null;
      for (let i = 0; i < list.length; i++) {
        if (list[i].idx === idx) {
          infoObj = JSON.parse(JSON.stringify(list[i]));
        } else {
          let obj = this.getLayoutCompInfo(list[i].children, idx);
          if (obj) {
            infoObj = obj;
          }
        }
      }
      return infoObj;
    },
    // 中间插入布局元素
    addInsertLevelItem (worksheetId, currentItem, list, type, filterId, filterType, canvasType, layoutIdx) {
      let obj = JSON.parse(JSON.stringify(currentItem));
      if (layoutIdx) {
        obj = this.getLayoutCompInfo(list, layoutIdx);
        obj.idx = this.getIdx(list);
      } else {
        obj.worksheetId = worksheetId;
        obj.filterId = filterId;
        obj.filterType = filterType;
        obj.type = type;
        obj.isEmpty = false;
        obj.idx = this.getIdx(list);
        obj.styleId = obj.idx;
        obj.needRequest = false;
        obj.style = getLayoutCompStyle(type, canvasType);
        obj.children = [];
      }
      if (this.currentDashboardDetail.css.device === 'mobile') {
        if (obj.level === 0) {
          for (let i = 0; i < list.length; i++) {
            let arr = [];
            this.getRowItem(list[i], currentItem, arr);
            if (arr.length > 0) {
              obj.isDir = 'top';
              obj.width = 100;
              obj.height = 34;
              if (currentItem.isDir === 'top') {
                list.splice(i, 0, obj);
                break;
              } else {
                list.splice(i + 1, 0, obj);
              }
            }
          }
        } else {
          this.insertTargetItem(obj, currentItem, list);
        }
      } else {
        if (obj.level === 0) {
          for (let i = 0; i < list.length; i++) {
            if (currentItem.idx === list[i].idx) {
              obj.isDir = 'top';
              if (currentItem.isDir === 'top') {
                list.splice(i, 0, obj);
                break;
              } else {
                list.splice(i + 1, 0, obj);
              }
            }
          }
        } else {
          this.insertTargetItem(obj, currentItem, list);
        }
      }
    },
    getRowItem (item, target, arr) {
      if (item.idx === target.idx) {
        arr.push(item);
      } else {
        if (item.children && item.children.length > 0) {
          for (let i = 0; i < item.children.length; i++) {
            this.getRowItem(item.children[i], target, arr);
          }
        }
      }
    },
    // 在行内插入布局元素
    addDownLevelItem (worksheetId, currentItem, list, type, filterId, filterType, canvasType, layoutIdx) {
      let addLevel = currentItem.level + 1;
      let idx = this.getIdx(list);
      let children = [];
      let targetInfo = this.getLayoutCompInfo(list, layoutIdx);
      let obj = {
        width: 50,
        height: 100,
        idx: idx,
        styleId: targetInfo ? targetInfo.styleId : idx,
        style: targetInfo ? targetInfo.style : getLayoutCompStyle(type, canvasType),
        level: addLevel,
        parentIdx: currentItem.idx,
        worksheetId: worksheetId,
        needRequest: false,
        filterId: targetInfo ? targetInfo.filterId : filterId,
        filterType: targetInfo ? targetInfo.filterType : filterType,
        isDir: currentItem.isDir,
        dir: 'column',
        type: type,
        isEmpty: false,
        children: []
      };
      let isDir = currentItem.isDir;
      const posObj = {
        bottom: 'top',
        top: 'bottom',
        left: 'right',
        right: 'left'
      };
      if (isDir === 'bottom' || isDir === 'top') {
        obj.width = 100;
        obj.height = 50;
        obj.dir = 'row';
      }
      children.push(JSON.parse(JSON.stringify(obj)));
      idx = idx + 1;
      obj.idx = idx;
      obj.styleId = currentItem.styleId;
      obj.style = JSON.parse(JSON.stringify(currentItem.style));
      obj.isEmpty = true;
      obj.isDir = posObj[currentItem.isDir];
      delete obj.needRequest;
      delete obj.worksheetId;
      delete obj.type;
      delete obj.filterId;
      delete obj.filterType;
      if (isDir === 'top' || isDir === 'left') {
        children.push(obj);
      } else {
        children.unshift(obj);
      }
      this.getTargetList(list, currentItem, children);
    },
    // 递归遍历深层次的布局
    getTargetList (list, currentItem, children) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].idx === currentItem.idx) {
          let worksheetId = list[i].worksheetId;
          let type = list[i].type;
          let filterId = list[i].filterId;
          let filterType = list[i].filterType;
          let childrenDir = children[0].isDir;
          for (let i = 0; i < children.length; i++) {
            if (!children[i].worksheetId && !children[i].type) {
              children[i].worksheetId = worksheetId;
              children[i].type = type;
              children[i].isEmpty = false;
              children[i].filterId = filterId;
              children[i].filterType = filterType;
              children[i].needRequest = false;
              children[i].style = JSON.parse(JSON.stringify(currentItem.style));
            }
          }
          const posObj = {
            left: 'row',
            right: 'row',
            top: 'column',
            bottom: 'column'
          };
          this.$set(list[i], 'isEmpty', true);
          this.$set(list[i], 'dir', posObj[childrenDir]);
          delete list[i].worksheetId;
          delete list[i].type;
          delete list[i].style;
          delete list[i].styleId;
          delete list[i].filterId;
          delete list[i].filterType;
          delete list[i].needRequest;
          this.$set(list[i], 'children', JSON.parse(JSON.stringify(children)));
          return;
        } else {
          this.getTargetList(list[i].children, currentItem, children);
        }
      }
    },
    // 删除布局中的元素
    delTargetList (list, item) {
      if (item.level === 0) {
        for (let i = 0; i < list.length; i++) {
          if (item.idx === list[i].idx) {
            list.splice(i, 1);
            return;
          }
        }
      }
      for (let i = 0; i < list.length; i++) {
        if (list[i].idx === item.parentIdx) {
          let children = list[i].children;
          let index = 0;
          for (let j = 0; j < children.length; j++) {
            if (children[j].idx === item.idx) {
              index = j;
            } else {
              let property = {
                left: 'width',
                right: 'width',
                top: 'height',
                bottom: 'height'
              };
              let width = children[j][property[item.isDir]] + item.width / (children.length - 1);
              this.$set(children[j], property[item.isDir], width);
            }
          }
          children.splice(index, 1);
          if (children.length === 1) {
            let isTrue = {
              canvas: true,
              filter: true,
              text: true
            };
            if (isTrue[children[0].type]) {
              this.$set(list[i], 'worksheetId', children[0].worksheetId);
              this.$set(list[i], 'needRequest', false);
              this.$set(list[i], 'type', children[0].type);
              this.$set(list[i], 'styleId', children[0].styleId);
              this.$set(list[i], 'style', children[0].style);
              this.$set(list[i], 'children', children[0].children);
              this.$set(list[i], 'filterId', children[0].filterId);
              this.$set(list[i], 'filterType', children[0].filterType);
              this.$set(list[i], 'isEmpty', false);
            } else {
              this.$set(list[i], 'children', children[0].children);
              this.$set(list[i], 'idx', children[0].idx);
              if (children[0].children[0] && children[0].children[0].width === 100) {
                // this.$set(list[i], 'isDir', 'top');
                this.$set(list[i], 'dir', 'column');
              } else {
                // this.$set(list[i], 'isDir', 'left');
                this.$set(list[i], 'dir', 'row');
              }
            }
          }
          return;
        } else {
          this.delTargetList(list[i].children, item);
        }
      }
    },
    // 重设布局中的子元素信息
    resetChildren (list, parentIdx, parentLevel) {
      if (!list.length) return;
      let idx = list[0].idx;
      let level = list[0].level;
      for (let i = 0; i < list.length; i++) {
        list[i].level = parentLevel;
        list[i].parentIdx = parentIdx;
        if (list[i].children.length) {
          this.resetChildren(list[i].children, idx, level);
        }
      }
    },
    // 获取布局id
    getIdx (arr) {
      return new Date().getTime();
      // let list = flatten(arr);
      // let len = this.uniqueId(list.length, list, list.length);
      // return len;
    },
    uniqueId (len, list, idx) {
      for (let i = 0; i < len; i++) {
        if (idx === list[i].idx) {
          idx++;
          return this.uniqueId(len, list, idx);
        }
      }
      return idx;
    },
    // 插入布局
    insertTargetItem (obj, currentItem, list) {
      for (let i = 0; i < list.length; i++) {
        if (currentItem.idx === list[i].idx) {
          let whObj = {
            left: 'width',
            right: 'width',
            top: 'height',
            bottom: 'height'
          };
          let addSize = this.setAndGetWidth(list, i, whObj);
          if (this.currentDashboardDetail.css.device !== 'mobile') {
            obj.isDir = list[i].isDir;
          }
          obj[whObj[obj.isDir]] = addSize;
          if (currentItem.level === 0) {
            obj[whObj[obj.isDir]] = currentItem[whObj[obj.isDir]];
            const dirObj = {
              top: true,
              bottom: true
            };
            if (dirObj[obj.isDir]) {
              obj.width = 100;
            } else {
              obj.height = 100;
            }
            obj.level = 0;
            if (this.currentDashboardDetail.css.device === 'mobile') {
              if (obj.isDir === 'top') {
                list.splice(i, 0, obj);
              } else {
                list.splice(i + 1, 0, obj);
              }
            } else {
              if (obj.isDir === 'top') {
                list.splice(i + 1, 0, obj);
              } else {
                list.splice(i, 0, obj);
              }
            }
          } else {
            list.splice(i + 1, 0, obj);
          }
          return;
        } else {
          this.insertTargetItem(obj, currentItem, list[i].children);
        }
      }
    },
    // 计算插入布局中的尺寸
    setAndGetWidth (list, index, obj) {
      let perSize = list[index][obj[list[index].isDir]];
      let nextSize = list[index + 1] ? list[index + 1][obj[list[index + 1].isDir]] : 0;
      let total = perSize + nextSize;
      let size = Number((total / 3).toFixed(2));
      this.$set(list[index], obj[list[index].isDir], size);
      if (list[index + 1]) {
        this.$set(list[index + 1], obj[list[index].isDir], size);
      }
      return size;
    },
    // 设置展板画布，flag：true，为新增，false为删除
    async setWorksheetForBackend (worksheetId, flag) {
      let worksheets = JSON.parse(JSON.stringify(this.currentDashboardDetail.worksheets)) || [];
      if (flag) {
        let isIn = worksheets.filter((item) => item.worksheetId === worksheetId).length;
        if (isIn) return;
        worksheets.push({
          worksheetId: worksheetId
        });
      } else {
        for (let i = 0; i < worksheets.length; i++) {
          if (worksheets[i].worksheetId === worksheetId) {
            worksheets.splice(i, 1);
            break;
          }
        }
      }
      this.$set(this.currentDashboardDetail, 'worksheets', worksheets);
      let param = {
        dashboard_id: this.currentDashboardDetail.dashboard_id,
        project_id: this.projectId,
        worksheets: worksheets
      };
      await post('dashboardWorksheets', param);
    }
  }
};
