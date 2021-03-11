<template>
  <div class="feature-select">
    <div
      class="feature-select-header"
      :class="selectItem ? 'header-active' : ''"
      @click="showListHandler"
      v-show="!showList"
    >
      <div v-if="!selectItem">
        <span>{{$t('dashboard.all_feature')}}</span>
        <span class="iconfont icon-db_edit"></span>
      </div>
      <div v-if="selectItem" @click="showPanelHandler">
        <div class="has-feature">
          {{$t('dashboard.filter_has_feature')}}
          <span class="iconfont icon-db_edit"></span>
        </div>
        <div
          class="feature-panel cat-panel"
          v-if="catStatus !== 'NONE'"
        >{{translate(catStatus)}}{{$t('dashboard.classification_features')}}</div>
        <div
          class="feature-panel num-panel"
          v-if="numStatus !== 'NONE'"
        >{{translate(numStatus)}}{{$t('dashboard.numerical_features')}}</div>
      </div>
    </div>
    <div class="feature-panel" v-if="showList">
      <div class="list-header">
        {{$t('dashboard.filter_feature')}}
        <button @click="confirmHandler">{{$t('dashboard.confirm')}}</button>
        <button @click="cancelHandler">{{$t('dashboard.cancel')}}</button>
      </div>
      <feature-header
        @select="selectClassify"
        @selectAll="selectAll"
        @change="changeValue"
        :list="list"
      ></feature-header>
      <feature-list :list="list" :targetName="targetName" :dataType="select" :searchValue="searchValue" @change="changeList"></feature-list>
    </div>
  </div>
</template>
<script>
import FeatureList from './featureList';
import FeatureHeader from './featureHeader';
import { mapState } from 'vuex';
import { get, post } from '@/api/server';
export default {
  name: 'FeatureSelect',
  data () {
    return {
      showList: false,
      select: 'CAT',
      list: [], // 当前特征列表
      catArr: [],
      numArr: [],
      searchValue: '',
      selectItem: null,
      tempSelect: null,
      catStatus: 'NONE',
      numStatus: 'NONE'
    };
  },
  props: {
    featureObj: {
      type: Object
    },
    targetName: {
      type: String
    }
  },
  computed: {
    ...mapState('project', ['projectId'])
  },
  components: {
    FeatureList,
    FeatureHeader
  },
  watch: {
    showList () {
      this.$emit('showList', this.showList);
    },
    featureObj: {
      handler (obj) {
        this.catStatus = 'NONE';
        this.numStatus = 'NONE';
        if (!obj) return;
        if (obj.aggrSelected) {
          this.numStatus = obj.aggrSelected;
        }
        if (obj.catSelected) {
          this.catStatus = obj.catSelected;
        }
        if (this.catStatus !== 'NONE' || this.numStatus !== 'NONE') {
          this.selectItem = {};
        }
      },
      deep: true
    }
  },
  mounted () {},
  methods: {
    translate (str) {
      switch (str) {
        case 'ALL':
          return this.$t('dashboard.all');
        case 'UNIT':
          return this.$t('dashboard.unit');
      }
    },
    changeValue (value) {
      this.searchValue = value;
    },
    changeList (item, index, dataType) {
      let obj = JSON.parse(JSON.stringify(item));
      obj.selected === 1 ? (obj.selected = 0) : (obj.selected = 1);
      this.list.splice(index, 1, obj);
      if (dataType === 'CAT') {
        this.catArr.splice(index, 1, obj);
      } else {
        this.numArr.splice(index, 1, obj);
      }
    },
    confirmHandler () {
      this.showList = false;
      this.tempSelect = null;
      let len = this.catArr.length;
      let catFlag = true;
      let numFlag = true;
      let cat = [];
      let num = [];
      if (len === 0) catFlag = false;
      for (let i = 0; i < len; i++) {
        if (this.catArr[i].selected === 0) {
          catFlag = false;
        } else {
          cat.push(this.catArr[i]);
        }
      }
      len = this.numArr.length;
      if (len === 0) numFlag = false;
      for (let i = 0; i < len; i++) {
        if (this.numArr[i].selected === 0) {
          numFlag = false;
        } else {
          num.push(this.numArr[i]);
        }
      }
      this.modelSelectList(this.catArr);
      this.modelSelectList(this.numArr);
      this.setSelectItem(catFlag, cat, numFlag, num);
    },
    cancelHandler () {
      this.showList = false;
      if (this.tempSelect) {
        this.selectItem = JSON.parse(JSON.stringify(this.tempSelect));
        this.tempSelect = null;
      }
    },
    setSelectItem (catFlag, cat, numFlag, num) {
      // NONE-没有选择
      // ALL-全选
      // UNIT-部分选择
      if (catFlag) {
        this.catStatus = 'ALL';
      } else {
        if (cat.length > 0) {
          this.catStatus = 'UNIT';
        } else {
          if (this.catArr.length > 0) {
            this.catStatus = 'NONE';
          }
        }
      }
      if (numFlag) {
        this.numStatus = 'ALL';
      } else {
        if (num.length > 0) {
          this.numStatus = 'UNIT';
        } else {
          if (this.numArr.length > 0) {
            this.numStatus = 'NONE';
          }
        }
      }
      this.selectItem = {
        cat: {
          selectAll: catFlag,
          list: JSON.parse(JSON.stringify(cat)),
          status: this.catStatus
        },
        num: {
          selectAll: numFlag,
          list: JSON.parse(JSON.stringify(num)),
          status: this.numStatus
        }
      };
      this.modelSelectedStatus();
    },
    showListHandler () {
      this.showList = true;
      this.select = 'CAT';
      if (this.selectItem) {
        this.tempSelect = JSON.parse(JSON.stringify(this.selectItem));
      }
      this.selectItem = null;
      this.selectClassify(this.select);
    },
    selectAll (boolean) {
      if (this.select === 'CAT') {
        for (let i = 0; i < this.catArr.length; i++) {
          this.$set(this.catArr[i], 'selected', boolean ? 1 : 0);
        }
      } else {
        for (let i = 0; i < this.numArr.length; i++) {
          this.$set(this.numArr[i], 'selected', boolean ? 1 : 0);
        }
      }
      this.selectClassify(this.select);
    },
    selectClassify (str) {
      this.select = str;
      this.list = [];
      this.getModelFeature(str);
    },
    async getModelFeature (type) {
      let param = {
        project_id: this.projectId,
        feature_type: type,
        offset: 0,
        limit: 1000
      };
      if (type === 'CAT' && this.catArr.length) {
        this.list = this.catArr;
        return;
      }
      if (type === 'NUM' && this.numArr.length) {
        this.list = this.numArr;
        return;
      }
      let res = await get('modelList', param);
      this.list = res.feature_list;
      if (type === 'CAT') {
        this.catArr = res.feature_list;
      } else {
        this.numArr = res.feature_list;
      }
    },
    async modelSelectedStatus () {
      let param = {
        project_id: this.projectId,
        cat_selected: this.selectItem.cat.status,
        aggr_selected: this.selectItem.num.status
      };
      let res = await post('modelSelectedStatus', param);
      console.log(res);
      if (
        this.selectItem.cat.status === 'NONE' &&
        this.selectItem.num.status === 'NONE'
      ) {
        this.selectItem = null;
      }
      this.$emit('change');
    },
    async modelSelectList (list) {
      let param = {
        project_id: this.projectId,
        feature_list: list
      };
      if (list.length === 0) return;
      let res = await post('modelSelectedList', param);
      console.log(res);
    }
  }
};
</script>
<style lang='scss' scoped>
.feature-select {
  height: 100%;
  background-color: white;
  .feature-select-header {
    border: 1px solid #e1e1e1;
    position: relative;
    height: 35px;
    line-height: 35px;
    border-radius: 4px;
    padding: 0px 10px;
    color: #424242;
    cursor: pointer;
    .iconfont {
      position: absolute;
      right: 10px;
      color: #4284f5;
    }
    .has-feature {
      margin-bottom: 10px;
      border-bottom: 1px solid #e1e1e1;
      .icon-db_edit {
        color: #4284f5;
      }
    }
    .feature-panel {
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      padding: 0px 8px;
      border-radius: 4px;
      border: 1px solid #e1e1e1;
      display: inline-block;
    }
    .cat-panel {
      border: 1px solid #03b98c;
      color: #03b98c;
      margin-right: 10px;
    }
    .num-panel {
      border: 1px solid #4284f5;
      color: #4284f5;
    }
  }
  .header-active {
    height: 90px;
  }
  .feature-panel {
    height: 100%;
    padding: 0px 10px;
    background-color: white;
    .list-header {
      height: 45px;
      line-height: 45px;
      color: #424242;
      position: relative;
      border-bottom: 1px solid #e1e1e1;
      > button {
        border: none;
        outline: none;
        font-size: 14px;
        color: #a4a4a4;
        cursor: pointer;
        top: 11px;
        background-color: transparent;
        position: absolute;
        &:nth-child(1) {
          right: 40px;
          color: #4284f5;
        }
        &:nth-child(2) {
          right: 0px;
        }
      }
    }
  }
}
</style>
