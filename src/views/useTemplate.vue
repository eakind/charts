<template>
  <div class="dc-use-template">
    <span class="use-template-backbtn" @click="backHandler">
      <span class="iconfont icon-db_arrow"></span>
      {{$t('message.return_back')}}
    </span>
    <div class="use-template-panel">
      <div class="template-panel-header">
        <span class="panel-header-title">{{$t('message.select_temp')}}</span>
        <span class="panel-header-tip">{{$t('message.temp_tip')}}</span>

        <span class="panel-header-createbtn" @click="createTemplate">
          {{$t('message.create_story')}}
          <span class="iconfont icon-db_arrowTo"></span>
        </span>
        <span class="panel-header-temp">
          {{$t('message.selected_temp')}}
          <span class="template-name">{{templateName}}</span>
        </span>
      </div>
      <div class="template-panel-body">
        <div class="template-list">
          <div
            class="template-item"
            :class="select===index ? 'template-item-active' : ''"
            @click="selectHandler(item, index)"
            v-for="(item, index) in tempList"
            :key="index"
          >
            <div class="item-panel"></div>
            <div class="item-logo item-logo-rotate"></div>
            <div class="item-logo"></div>
            <span class="template-text">{{item.template_name}}</span>
          </div>
        </div>

        <div class="panel-body-format">
          <div class="body-format-body">
            <div class="format-body-left">
              <div class="body-left-header">
                <span class="left-header-title">{{$t('message.data_format')}}</span>
                <span class="left-header-download" @click="download">{{$t('message.download_temp')}}</span>
              </div>
              <pre-table class="template-table" :headList="headList" :previewList="tempData" :noModify="true"></pre-table>
            </div>
            <div class="format-body-right">
              <div class="body-right-header">
                <span class="right-header-title">{{$t('message.temp_example')}}</span>
                <span class="right-header-tip">{{$t('message.temp_has')}}</span>
              </div>
              <div class="board-panel">
                <img :src='exampleUrl' width="100%">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PreTable from '@/components/preTable/preTable.vue';
import { mapMutations } from 'vuex';
import { get, downloadData } from '@/api/server.js';
export default {
  components: {
    PreTable
  },
  data () {
    return {
      templateName: '模板名称',
      select: 0,
      tempList: [],
      headList: [],
      tempData: [],
      exampleUrl: ''
    };
  },
  mounted () {
    this.templateList();
  },
  destroyed () {},
  methods: {
    ...mapMutations('project', ['setCreateType', 'setTemplateId']),
    createTemplate () {
      this.setCreateType('template');
      this.setTemplateId(this.tempList[this.select].template_idx);
      this.$router.push({ path: 'createProject' });
    },
    selectHandler (item, index) {
      if (this.select === index) return;
      this.select = index;
      this.templateName = item.template_name;
      this.templateData(this.tempList[this.select]);
      this.templateExample(this.tempList[this.select]);
    },
    backHandler () {
      this.$router.push({ path: '/' });
    },
    async download () {
      let param = {
        template_idx: this.tempList[this.select].template_idx
      };
      await downloadData('templateDownload', param, this.templateName);
    },
    async templateList () {
      let param = {};
      let res = await get('templateList', param);
      if (res.code === 0) {
        this.tempList = res.template_list;
        if (this.tempList.length > 0) {
          this.select = 0;
          this.templateName = this.tempList[this.select].template_name;
          this.templateData(this.tempList[this.select]);
          this.templateExample(this.tempList[this.select]);
        }
      }
    },
    async templateData (item) {
      let param = {
        template_idx: item.template_idx
      };
      this.headList = [];
      let res = await get('templateData', param);
      if (res.code === 0) {
        for (let i = 0; i < res.ncols; i++) {
          this.headList.push({
            data_type: res.dtypes[i],
            feature_name: res.columns[i],
            suggest_dtype: null,
            suggest_modify: 0
          });
          this.tempData = res.data;
        }
      }
    },
    async templateExample (item) {
      let param = {
        template_idx: item.template_idx
      };
      let res = await get('templateExample', param);
      if (res.code === 0) {
        this.exampleUrl = res.url + '?Authorization=' + localStorage.getItem('dcUserToken');
      }
    }
  }
};
</script>

<style scoped lang="scss">
@mixin square {
  display: inline-block;
  width: 10px;
  height: 10px;
  border: 5px solid #4284f5;
  content: "";
  margin: 0px 2px;
  border-radius: 5px;
}
.dc-use-template {
  position: relative;
  width: 100%;
  height: 100%;
  .use-template-backbtn {
    font-size: 16px;
    color: #4284f5;
    left: 30px;
    top: 20px;
    cursor: pointer;
    position: absolute;
    .iconfont {
      transform: rotate(-180deg);
      display: inline-block;
    }
  }
  .use-template-panel {
    width: 100%;
    height: 100%;
    display: inline-block;
    padding: 20px 150px;
    box-sizing: border-box;
    .template-panel-header {
      position: relative;
      .panel-header-title {
        font-size: 16px;
        color: #424242;
        margin: 0px 5px;
      }
      .panel-header-tip {
        font-size: 14px;
        margin: 0px 20px;
        color: #666666;
        font-weight: 100;
      }
      .panel-header-createbtn {
        padding: 5px 0px;
        color: #4284f5;
        font-size: 16px;
        right: 0px;
        top: 0px;
        cursor: pointer;
        position: absolute;
        .iconfont {
          transform: rotate(-45deg);
          display: inline-block;
        }
      }
      .panel-header-temp {
        right: 0px;
        top: 26px;
        display: inline-block;
        position: absolute;
        font-size: 14px;
        color: #666666;
        font-weight: 100;
      }
    }
    .template-panel-body {
      padding: 20px 0px;
      .template-list {
        width: 100%;
        .template-item-active {
          .item-panel {
            display: block !important;
          }
          .item-logo {
            opacity: 1 !important;
          }
        }
        .template-item {
          background-color: white;
          height: 120px;
          width: 120px;
          margin: 5px 30px 5px 0px;
          padding-top: 25px;
          box-sizing: border-box;
          border-radius: 10px;
          text-align: center;
          display: inline-block;
          cursor: pointer;
          position: relative;
          .item-panel {
            width: 80%;
            height: 80%;
            left: 10%;
            top: 10px;
            border-radius: 10px;
            border: 2px solid #4284f5;
            position: absolute;
            display: none;
          }
          .item-logo {
            opacity: 0.3;
            &::before {
              @include square;
            }
            &::after {
              @include square;
            }
          }
          .item-logo-rotate {
            &::after {
              transform: rotate(45deg);
            }
          }
          .template-text {
            bottom: 16px;
            left: 50%;
            font-size: 14px;
            color: #666666;
            transform: translateX(-50%);
            position: absolute;
            width: 80px;
            display: inline-block;
            @include ellipsis;
          }
        }
      }

      .panel-body-format {
        margin-top: 20px;
        border-radius: 10px;
        background-color: white;
        height: 650px;
        box-shadow: 0 8px 20px 0 rgba(196, 196, 196, 0.2);
        .body-format-body {
          display: flex;
          width: 100%;
          height: 100%;
          padding: 10px 0px;
          .format-body-left {
            width: 70%;
            padding: 0px 10px 0px 20px;
            .body-left-header {
              padding: 10px 0px 30px 0px;
              position: relative;
              .left-header-title {
                font-size: 16px;
                color: #424242;
                position: absolute;
                left: 0px;
              }
              .left-header-download {
                font-size: 16px;
                color: #4284f5;
                right: 20px;
                text-decoration: underline;
                position: absolute;
                cursor: pointer;
              }
            }
            .template-table {
              height: calc(100% - 50px) !important;
            }
          }
          .format-body-right {
            border-left: 1px solid #e1e1e1;
            width: 30%;
            padding: 10px 20px;
            box-sizing: border-box;
            .body-right-header {
              .right-header-title {
                color: #424242;
                font-size: 16px;
              }
              .right-header-tip {
                color: #666666;
                font-size: 14px;
                margin-left: 15px;
              }
            }
            .board-panel {
              width: 100%;
              height: 500px;
              margin-top: 10px;
              border-radius: 5px;
              border: 1px solid #dedede;
            }
          }
        }
      }
    }
  }
}
</style>
