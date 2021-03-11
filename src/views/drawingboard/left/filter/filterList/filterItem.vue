<template>
  <div class="filter-item" :class="isNoRelate">
    <div class="filter-content">
      <div class="content-left iconfont icon-dbc_filterbl" :class="featureType"></div>
      <div class="content-right">
        <div class="content-up">
          <div class="content" :title="item.filter_name">
            {{item.filter_name}}
          </div>
          <span class="iconfont icon-db_menuDot" @click.stop="showOperate($event)"></span>
        </div>
        <div class="content-down" v-if="item.worksheet_list.length">
          {{$t('dashboard.relate_canvas')}}<span v-for="(childItem, index) in changeCanvas(item.worksheet_list)" :key="index">
            {{childItem}}<span v-if="index !== item.worksheet_list.length - 1">、</span>
          </span>
        </div>
        <div class="content-down" v-else>
          {{$t('dashboard.relate_tip')}}
        </div>
      </div>
    </div>
    <div class="edit-btn" v-if="item.relate===1" @click="editFilter">
        {{$t('dashboard.into_edit')}}
    </div>
    <div class="relate-canvas" v-else @click="relateCanvas">
        <span class="iconfont icon-db_chain">{{$t('dashboard.relate_current')}}</span>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { post } from '@/api/server';
export default {
  data () {
    return {
      filterName: '',
      timeList: [],
      isOperate: false
    };
  },
  props: {
    item: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  computed: {
    ...mapState('drawingboard', ['canvasList', 'currentCanvas']),
    ...mapState('project', ['projectId']),
    featureType () {
      let obj = {
        '03': 'num-active',
        '01': 'cat-active',
        '02': 'cat-active'
      };
      return obj[this.item.filter_type];
    },
    isNoRelate () {
      let obj = {
        1: 'has-relate',
        0: 'none-relate'
      };
      return obj[this.item.relate];
    }
  },
  components: {
  },
  mounted () {
    this.filterName = this.item.filter_name;
  },
  beforeDestroy () {
    document.removeEventListener('click', this.hideOperate);
  },
  methods: {
    changeCanvas (list) {
      let arr = [];
      for (let j = 0; j < list.length; j++) {
        for (let i = 0; i < this.canvasList.length; i++) {
          if (list[j].worksheet_id === this.canvasList[i].worksheet_id) {
            arr.push(i + 1);
          }
        }
      }
      return arr.sort((a, b) => a - b);
    },
    hideOperate () {
      this.isOperate = false;
      document.removeEventListener('click', this.hideOperate);
    },
    showOperate (event) {
      if (this.isOperate) {
        this.$closeTooltips();
        document.removeEventListener('click', this.hideOperate);
        this.isOperate = false;
        return;
      }
      this.isOperate = true;
      document.addEventListener('click', this.hideOperate);
      let obj = {
        target: event.target,
        firstText: this.$t('dashboard.edit_name'),
        firstFunc: this.editFilterName,
      };
      if (!this.item.worksheet_list.length) {
        this.$set(obj, 'secondText', this.$t('dashboard.del_filter'));
        this.$set(obj, 'secondFunc', this.delFilterProcess);
        this.$showTooltips(obj);
        return;
      }
      if (this.item.relate) {
        this.$set(obj, 'secondText', this.$t('dashboard.cancel_relate'));
        this.$set(obj, 'secondFunc', this.cancelRelate);
      }
      this.$showTooltips(obj);
    },
    editFilterName () {
      this.$showMessageBox({
        title: this.$t('dashboard.edit_name'),
        confirmText: this.$t('dashboard.confirm'),
        cancelText: this.$t('dashboard.cancel'),
        message: this.item.filter_name,
        inputObj: {
          show: true,
          placeHolder: this.$t('dashboard.input_new'),
        },
        cb: (text) => {
          if (text === this.item.filter_name) {
            this.$tip(this.$t('dashboard.modify_same_tip'));
            return;
          }
          if (!text.length) {
            this.$tip(this.$t('dashboard.modify_empty_tip'));
            return;
          }
          if (text.length > 64) {
            this.$tip(this.$t('dashboard.modify_length_tip'));
            return;
          }
          let param = {
            project_id: this.projectId,
            worksheet_id: this.currentCanvas.worksheet_id,
            filter_id: this.item.filter_id,
            filter_name: text,
            filter_type: this.item.filter_type,
            worksheet_list: this.item.worksheet_list
          };
          if (this.item.datetime_type) {
            param.datetime_type = this.item.datetime_type;
          }
          this.filterModify(param);
          this.$closeMessageBox();
        }
      });
    },
    cancelRelate () {
      let contentHtml = `<div style="padding-bottom: 10px">${this.$t('dashboard.cancel_confirm')}${this.filterName}${this.$t('dashboard.relate')}?</div>`;
      this.$showMessageBox({
        title: this.$t('dashboard.cancel_relate'),
        confirmText: this.$t('dashboard.confirm'),
        cancelText: this.$t('dashboard.cancel'),
        contentHtml: `${contentHtml}${this.$t('dashboard.cancel_relate_tip')}`,
        cb: () => {
          let param = {
            project_id: this.projectId,
            filter_id: this.item.filter_id,
            worksheet_id: this.currentCanvas.worksheet_id
          };
          this.filterUnlink(param);
          this.$closeMessageBox();
        }
      });
    },
    // 编辑过滤器
    editFilter () {
      this.$emit('editFilter', this.item);
    },
    // 过滤器关联画布
    async relateCanvas () {
      let list = this.item.worksheet_list;
      list.push({
        worksheet_id: this.currentCanvas.worksheet_id
      });
      let param = {
        project_id: this.projectId,
        filter_id: this.item.filter_id,
        worksheet_id: this.currentCanvas.worksheet_id,
        filter_name: this.item.filter_name,
        filter_type: this.item.filter_type,
        worksheet_list: list
      };
      let res = await post('filterModify', param);
      if (res.code === 0) {
        this.$emit('change');
        this.bus.$emit('update-chart-for-filter');
      }
    },
    // 修改过滤器
    async filterModify (param) {
      let res = await post('filterModify', param);
      if (!res) return;
      if (res.code === 0) {
        this.$emit('change');
      }
    },
    delFilterProcess () {
      this.$showMessageBox({
        title: this.$t('dashboard.del_filter'),
        confirmText: this.$t('dashboard.confirm'),
        cancelText: this.$t('dashboard.cancel'),
        contentHtml: this.$t('dashboard.del_filter'),
        cb: () => {
          this.delFilter();
          this.$closeMessageBox();
        }
      });
    },
    // 删除过滤器
    async delFilter () {
      let param = {
        project_id: this.projectId,
        filter_id: this.item.filter_id,
        worksheet_id: this.currentCanvas.worksheet_id
      }; ;
      let res = await post('filterDelete', param);
      if (!res) return;
      if (res.code === 0) {
        this.$emit('change');
      }
    },
    // 过滤器取消关联画布
    async filterUnlink (param) {
      let res = await post('filterUnlink', param);
      if (!res) return;
      if (res.code === 0) {
        this.$emit('change');
        this.bus.$emit('update-chart-for-filter');
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.has-relate{
  border: 1px solid #4284f5;
}
.none-relate{
  border: 1px solid #E7EBF2;
}
.filter-item {
  border-radius: 4px;
  background: white;
  margin-bottom: 10px;
  box-sizing: border-box;
  .filter-content{
    display: flex;
    padding: 5px 5px 0px 5px;
  }
  .content-left {
    width: 20px;
    text-align: center;
  }
  .content-right{
    flex: 1;
  }
  .content-up{
    position: relative;
    .icon-db_menuDot{
      position: absolute;
      right: 5px;
      top: 0px;
      cursor: pointer;
      display: inline-block;
      transform: rotate(90deg);
    }
    .content{
          max-width: 194px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    }
  }
  .content-down{
    padding: 5px 0px;
    font-size: 14px;
    font-weight: 300;
    color: #a4a4a4;
  }
  .date-format{
    display: flex;
  }
  .num-active {
    color: #4284f5;
  }
  .cat-active {
    color: #03B98C;
  }
  .edit-btn{
    font-size: 14px;
    text-align: center;
    color:#4284f5;
    cursor: pointer;
    text-indent: -20px;
    padding: 5px 0px;
  }
  .relate-canvas{
    padding: 5px 6px;
    border-radius: 0 0 4px 4px;
    background-color: #E7EBF2;
    font-size: 14px;
    cursor: pointer;
  }
  .icon-db_chain{
    font-size: 14px;
    &::before{
      font-size: 18px;
      color: #4284f5;
      margin-right: 5px;
    }
  }
}
</style>
