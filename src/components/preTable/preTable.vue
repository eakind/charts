<template>
  <div class="dc-pre-table">
    <div class="pre-table"
         ref="preTable"
         :style="{width: wFlag ? 'calc(100% - 5px)' : ''}">
      <div class="table-header"
           v-if="noData">
        <div class="header-panel"
             ref="headerPanel"
             :class="noModify ? 'pointer-none': ''">
          <div class="row-item"
               v-for="(item, index) in headList"
               v-show="showModify(index)"
               :style="{lineHeight: item.feature_name ? '':'40px'}"
               :key="index"
               :class="[itemIndex !== index && showList ? 'itemOpacity' : '', routeName === 'createprojectpreview' ? 'top-line' : '']">
            <span class="item-name">{{item.feature_name ? item.feature_name : item}}</span>
            <span class="item-type"
                  v-if="item.hasOwnProperty('suggest_modify') && !noModify"
                  :class="item.suggest_modify === 1 ? 'item-type-red' : ''"
                  @click.stop="showType($event, item, index)">
              {{typeObj[item.data_type]}}
              <span class="iconfont icon-db_refresh"
               v-if="projectStatus !== 'REPLACE' && projectStatus !== 'APPEND' && projectStatus !== 'REPLACING' && projectStatus !== 'APPENDING'">
              </span>
            </span>
          </div>
          <table-type-list class="type-list"
                     :list="typeList"
                     :sugType="suggestType"
                     :typeCode="typeCode"
                     @hide="hide"
                     @change="changeType"
                     v-if="showList"></table-type-list>
        </div>
      </div>
      <div class="table-left"
           v-if="noData">
        <div class="left-header" :class="routeName === 'createprojectpreview' ? 'left-line top-line' : ''">#</div>
        <div class="left-body"
             ref="leftBody">
          <div class="row-num" :class="routeName === 'createprojectpreview' ? 'left-line' : ''"
               v-for="(item, index) in previewList"
               :key="index">{{index + 1}}</div>
        </div>
      </div>
      <div class="table-body"
           ref="body"
           v-if="noData"
           @scroll="handler">
        <div class="body-item"
             v-for="(item, index) in previewList"
             :key="index">
          <div class="item"
               :class="String(childItem).includes('http') || String(childItem).includes('https') ? 'item-acitve':''"
               @click.stop="openHref(item)"
               v-for="(childItem, childIndex) in item"
               v-show="showModify(childIndex)"
               :key="childIndex">{{childItem}}</div>
        </div>
      </div>
      <div class="no-data-tip"
           v-if="!noData && dataFlag">
        <span class="iconfont icon-db_log"></span>
        <span class="data-tip">{{$t('message.no_data_file_tip')}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { post } from '@/api/server';
import { mapState } from 'vuex';
import TableTypeList from './tableTypeList.vue';
export default {
  components: {
    TableTypeList
  },
  data () {
    return {
      list: [],
      noData: false,
      dataFlag: false,
      showList: false,
      timeList: null,
      listNum: 100,
      selectHead: null,
      checkArr: [],
      typeObj: {
        INT: this.$t('message.int'),
        FLOAT: this.$t('message.float'),
        STRING: this.$t('message.string'),
        DATETIME: this.$t('message.time_date'),
        CITY: this.$t('message.map'),
        PROVINCE: this.$t('message.map'),
        MAP: this.$t('message.map'),
        DISTRICT: this.$t('message.map'),
        ZIPCODE: this.$t('message.map'),
        AREACODE: this.$t('message.map'),
        BIN: 'bin'
      },
      typeList: [],
      typeCode: '',
      suggestType: '',
      itemIndex: -1,
      iconFlag: true,
      routeName: this.$route.name
    };
  },
  props: {
    headList: {
      type: Array
    },
    previewList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    checkFlag: {
      type: Boolean
    },
    noModify: {
      type: Boolean,
      default: false
    },
    wFlag: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('project', ['projectId', 'successFileList', 'projectStatus']),
  },
  watch: {
    checkFlag (val) {
      if (!val) {
        this.checkArr = [];
        this.init();
        return;
      }
      for (let i = 0; i < this.headList.length; i++) {
        if (this.headList[i].suggest_modify === 1) {
          this.checkArr.push(i);
        }
      }
      this.init();
    },
    headList: {
      handler () {
        this.init();
      },
      deep: true
    }
  },
  mounted () {
    this.init();
  },
  methods: {
    init () {
      this.dataFlag = false;
      setTimeout(() => {
        this.dataFlag = true;
        this.initData();
        this.previewList.length > 0
          ? (this.noData = true)
          : (this.noData = false);
      }, 1500);
    },
    hide () {
      this.showList = false;
      this.itemIndex = -1;
    },
    openHref (item) {
      if (item.includes('http') || item.includes('https')) {
        let dcUserToken = localStorage.getItem('dcUserToken');
        if (item.indexOf('?') > -1) {
          item += '&token=' + dcUserToken;
        } else {
          item += '?token=' + dcUserToken;
        }
        window.open(item, '_blank');
      }
    },
    showModify (index) {
      if (this.checkFlag) {
        if (this.checkArr.includes(index)) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },
    handler (event) {
      this.$refs.headerPanel.scrollLeft = event.currentTarget.scrollLeft;
      this.$refs.leftBody.scrollTop = event.currentTarget.scrollTop;
    },
    showType (event, item, index) {
      switch (this.projectStatus) {
        case 'REPLACING':
        case 'REPLACE':
        case 'APPEND':
        case 'APPENDING':
          return;
      }
      let top = event.currentTarget.getBoundingClientRect().top;
      let left = event.currentTarget.getBoundingClientRect().left;
      this.showList = !this.showList;
      this.itemIndex = this.showList ? index : -1;
      this.setTypeList(item.data_type);
      this.suggestType = item.suggest_dtype;
      if (!this.showList) {
        this.selectHead = null;
        return;
      }
      this.selectHead = item;
      setTimeout(() => {
        let dom = this.$el.querySelector('.type-list');
        dom.style.left = left + 1 + 'px';
        dom.style.top = top + 29 + 'px';
      }, 0);
    },
    setTypeList (str) {
      this.typeList = [];
      this.typeCode = str;
      switch (str) {
        case 'STRING':
          this.typeList.unshift(this.$t('message.float'));
          this.typeList.unshift(this.$t('message.int'));
          this.typeList.push(this.$t('message.time'));
          this.typeList.push(this.$t('message.spatial_variable'));
          break;
        case 'FLOAT':
          this.typeList.unshift(this.$t('message.string'));
          this.typeList.unshift(this.$t('message.int'));
          this.typeList.push(this.$t('message.time'));
          this.typeList.push(this.$t('message.spatial_variable'));
          break;
        case 'INT':
          this.typeList.unshift(this.$t('message.float'));
          this.typeList.unshift(this.$t('message.string'));
          this.typeList.push(this.$t('message.spatial_variable'));
          break;
        case 'DATETIME':
          this.typeList.unshift(this.$t('message.float'));
          this.typeList.unshift(this.$t('message.int'));
          this.typeList.unshift(this.$t('message.string'));
          this.typeList.push(this.$t('message.spatial_variable'));
          break;
        case 'MAP':
        case 'CITY':
        case 'PROVINCE':
        case 'DISTRICT':
        case 'AREACODE':
        case 'ZIPCODE':
          this.typeList.unshift(this.$t('message.float'));
          this.typeList.unshift(this.$t('message.string'));
          this.typeList.unshift(this.$t('message.int'));
          this.typeList.push(this.$t('message.time'));
          break;
      }
    },
    changeType (name, type) {
      let param = {
        project_id: this.projectId,
        name: this.selectHead.feature_name,
        file_id: this.successFileList[0].fileId,
        limit: 100
      };
      switch (type) {
        case 'time':
          param.data_type = 'DATETIME';
          param.datetime_format = name;
          if (name === 'AUTO') {
            param.datetime_format = '';
          }
          break;
        case 'geo':
          param.map_type = name;
          param.data_type = 'MAP';
          break;
        default:
          param.data_type = type.toLocaleUpperCase();
          break;
      }
      this.modifyDtype(param);
    },
    initData () {
      if (this.headList) {
        let width = 162 * this.headList.length + 80;
        if (this.checkFlag) {
          width = 162 * this.checkArr.length + 80;
        }
        if (width > this.$el.parentNode.clientWidth) {
          width = this.$el.parentNode.clientWidth - 15;
        }
        if (width === 80) {
          setTimeout(() => {
            this.noData = false;
          });
        } else {
          // 处理一下没有滚动条是头部下边框的样式问题
          if (this.$refs.body && !(this.$refs.body.scrollHeight > this.$refs.body.clientHeight)) {
            width = width - 16;
          }
          this.$el.style.width = width + 'px';
        }
      }
    },
    async modifyDtype (param) {
      let res = await post('modifyDtype', param);
      if (res.code === 0) {
        this.showList = false;
        this.itemIndex = -1;
        this.$emit('modifyDtype');
      }
    }
  }
};
</script>

<style scoped lang="scss">
@mixin item($dc-width) {
  width: $dc-width;
  height: 50px;
  text-align: center;
  display: inline-block;
}
.pointer-none {
  pointer-events: none;
  .row-item {
    line-height: 40px;
  }
}
.dc-pre-table {
  height: calc(100% - 100px);
  width: 100%;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border-top-right-radius: 4px;
  .pre-table {
    height: calc(100% - 10px);
    width: calc(100% - 20px);
    overflow: hidden;
    position: relative;
    .table-header {
      width: calc(100% - 80px);
      height: 40px;
      left: 80px;
      font-size: 12px;
      color: #424242;
      font-weight: bold;
      position: absolute;
      overflow: hidden;
      background-color: white;
      .header-panel {
        white-space: nowrap;
        overflow: hidden;
        width: 100%;
        height: 100%;
        &::-webkit-scrollbar {
          height: 0px;
          background-color: #f6f6f6;
        }

        &::-webkit-scrollbar-track {
          border-radius: 5px;
          background-color: #f6f6f6;
        }

        &::-webkit-scrollbar-thumb {
          border-radius: 5px;
          background-color: #dedede;
        }
      }
    }
    .table-left {
      width: 80px;
      height: 100%;
      font-size: 12px;
      color: #424242;
      font-weight: bold;
      overflow: hidden;
      overflow-y: auto;
      display: inline-block;
      top: 0px;
      position: absolute;
      background-color: white;
      .left-header {
        text-align: center;
        height: 40px;
        line-height: 40px;
        border-right: 1px solid #C2C9D1;
        border-bottom: 1px solid #C2C9D1;
      }
      .left-body {
        height: calc(100% - 50px);
        overflow: hidden;
        background-color: white;
        &::-webkit-scrollbar {
          width: 0px;
          background-color: #f6f6f6;
        }

        &::-webkit-scrollbar-track {
          border-radius: 5px;
          background-color: #f6f6f6;
        }

        &::-webkit-scrollbar-thumb {
          border-radius: 5px;
          background-color: #dedede;
        }
      }
    }
    .table-body {
      width: calc(100% - 80px);
      height: calc(100% - 40px);
      overflow: auto;
      position: absolute;
      left: 80px;
      top: 40px;
      display: inline-block;
      box-sizing: border-box;
      &::-webkit-scrollbar {
        width: 10px;
        height: 10px;
        background-color: #f6f6f6;
      }

      &::-webkit-scrollbar-track {
        border-radius: 5px;
        background-color: #f6f6f6;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background-color: #dedede;
      }
      .body-item {
        &:nth-child(2n) {
          .item{
            background-color: #fff;
          }

        }
        &:nth-child(2n + 1) {
          .item {
            background-color: #F5F9FE;
          }

        }
      }
      .body-item {
        height: 32px;
        line-height: 32px;
        white-space: nowrap;
        .item {
          height: 100%;
          width: 150px;
          text-align: center;
          display: inline-block;
          padding: 0px 5px;
          font-size: 12px;
          @include ellipsis;
          border-right: 1px solid #C2C9D1;
          border-top: 1px solid #C2C9D1;
          &:last-child {
            border-right: 1px solid #C2C9D1;
          }
        }
        &:last-child {
          .item {
            border-bottom: 1px solid #C2C9D1;
          }
        }
        &:first-child {
          .item {
            border-top: none;
          }
        }
        .item-acitve {
          color: #4284f5;
          cursor: pointer;
          text-decoration: underline;
        }
      }
    }
    .row-num {
      @include item(80px);
      height: 32px;
      line-height: 32px;
      border-top: 1px solid #C2C9D1;
      border-right: 1px solid #C2C9D1;
      &:last-child {
        border-bottom: 1px solid #C2C9D1;
      }
      &:first-child {
        border-top: none;
      }
    }
    .left-line {
      border-left: 1px solid #C2C9D1;
    }
    .top-line {
      border-top: 1px solid #C2C9D1;
    }
    .row-item {
      @include item(150px);
      height: 40px;
      border-left: 1px solid transparent;
      border-right: 1px solid #C2C9D1;
      border-bottom: 1px solid #C2C9D1;
      .item-name {
        width: 160px;
        padding: 0px 10px;
        box-sizing: border-box;
        display: inline-block;
        @include ellipsis;
      }
      .item-type {
        color: #4284f5;
        font-size: 14px;
        display: block;
        top: -2px;
        cursor: pointer;
        position: relative;
        .iconfont {
          font-size: 16px;
          top: 2px;
          right: 10px;
          position: absolute;
        }
      }
      .item-type-red {
        color: #f5282d;
      }
    }
    .itemOpacity {
      opacity: 0.5;
    }
    .no-data-tip {
      width: 100%;
      height: 100%;
      position: relative;
      .iconfont {
        display: inline-block;
        position: absolute;
        top: 45%;
        left: 50%;
        font-size: 36px;
        color: #d8d8d8;
        transform: translate(-50%, -45%);
      }
      .data-tip {
        display: block;
        color: #666666;
        font-size: 12px;
        position: absolute;
        top: 50%;
        left: 50%;
        font-weight: 100;
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>
