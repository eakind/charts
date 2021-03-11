<template>
  <div class="dc-db-file">
    <div class="db-file-header">
      <div class="file-header-row">
        <div class="header-row-left">{{$t('message.db_type')}}</div>
        <div class="header-row-middle">
          <dc-drop :list="typeList" :tip="dbFileObj.dialect" :select="dbFileObj.dialect" @change="changeSQL" style="border: 1px solid #dedede"></dc-drop>
        </div>
      </div>
      <div class="file-header-row">
        <div class="header-row-left">{{$t('message.db_name')}}</div>
        <div class="header-row-middle">
          <input v-model="dbFileObj.database" />
        </div>
      </div>
      <div class="file-header-row">
        <div class="header-row-left">{{$t('message.db_server')}}</div>
        <div class="header-row-middle">
          <input v-model="dbFileObj.host" />
        </div>
        <div class="header-row-right">
          <div class="row-right-left">{{$t('message.db_port')}}</div>
          <div class="row-right-right">
            <input v-model="dbFileObj.port"/>
          </div>
        </div>
      </div>
      <div class="file-header-row">
        <div class="header-row-left">{{$t('message.db_username')}}</div>
        <div class="header-row-middle">
          <input v-model="dbFileObj.user" />
        </div>
      </div>
      <div class="file-header-row">
        <div class="header-row-left">{{$t('message.db_password')}}</div>
        <div class="header-row-middle">
          <div class="input-panel">
            <input type="password" style="display:none"/>
            <input v-model="dbFileObj.password" autocomplete="new-password" :type="showPw ? 'text' :'password'"/>
            <span class="iconfont" :class="showPw ? 'icon-db_display' : 'icon-db_hide'" @click="showPw=!showPw"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="db-file-body">
      <div class="file-body-title">
        {{$t('message.self_sql')}}
        <span class="db-file-tip">{{tipMsg}}</span>
      </div>
      <textarea v-model="dbFileObj.sql"></textarea>
    </div>
  </div>
</template>

<script>
import DcDrop from '@/components/dcdrop/dcDrop.vue';
import { post } from '@/api/server';
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'DbFile',
  components: {
    DcDrop
  },
  data () {
    return {
      dbFileObj: {
        dialect: 'mysql',
        database: '',
        host: '',
        port: '3306',
        user: '',
        password: '',
        sql: ''
      },
      portObj: {
        postgresql: 5432,
        mysql: 3306,
        oracle: 1521,
        'sql server': 1433
      },
      typeList: ['postgresql', 'mysql', 'oracle', 'sql server'],
      tipMsg: '',
      showPw: false
    };
  },
  computed: {
    ...mapState('project', ['dbObj', 'projectId', 'projectName', 'successFileList', 'templateId'])
  },
  watch: {
    dbObj: {
      handler (obj) {
        this.dbFileObj = JSON.parse(JSON.stringify(this.dbObj));
        this.dbFileObj.password = '';
      },
      deep: true
    }
  },
  mounted () {
    this.dbFileObj = JSON.parse(JSON.stringify(this.dbObj));
    this.dbFileObj.password = '';
    this.bus.$on('dbPreview', () => {
      this.preDbHandler();
    });
  },
  destroyed () {
    this.bus.$off('dbPreview');
  },
  methods: {
    ...mapMutations('project', ['setDbObj', 'setProjectId', 'setSuccessFileList']),
    preDbHandler () {
      if (!this.dbFileObj.database) return;
      if (!this.dbFileObj.host) return;
      if (!this.dbFileObj.user) return;
      let param = this.dbFileObj;
      if (this.projectId) {
        param.project_id = this.projectId;
        this.getSQL(param);
      } else {
        this.createProject(param);
      }
    },
    changeSQL (item) {
      this.dbFileObj.port = this.portObj[item];
    },
    async createProject (param) {
      let obj = {
        project_name: this.projectName,
        project_type: 'BI'
      };
      if (this.templateId) {
        obj.template_idx = this.templateId;
      }
      if (this.projectName.length > 64) return;
      let res = await post('create', obj);
      this.setProjectId(res.project_id);
      param.project_id = this.projectId;
      this.getSQL(param);
    },
    async getSQL (param) {
      if (param.password.length === 0 || !param.password) {
        param.password = null;
      }
      let res = await post('dbData', param);
      if (res.code !== 0) {
        this.tipMsg = this.$t(`backend[${res.code}]`);
      } else {
        this.tipMsg = '';
      }
      this.successFileList.push({
        fileName: res.file_name ? res.file_name : '',
        fileId: res.file_id,
        msg: res.msg ? res.msg : '',
        code: res.code
      });
      this.setSuccessFileList(this.successFileList);
      if (res.code === 0) {
        this.setDbObj(this.dbFileObj);
        this.bus.$emit('getPreviewType', true);
        this.$router.push({
          name: 'createprojectpreview'
        });
      }
    },
    getEnable () {
      if (!this.projectName) return false;
      if (!this.dbFileObj.database) return false;
      if (!this.dbFileObj.host) return false;
      if (!this.dbFileObj.user) return false;
      return true;
    }
  }
};
</script>

<style scoped lang="scss">
@mixin inputMix{
  background: #FFFFFF;
  border: 1px solid #DEDEDE;
  border-radius: 4px;
  padding: 0px 5px;
  outline: none;
}
.dc-db-file{
  padding: 5px;
  width: 100%!important;
  .db-file-header{
    border: 1px solid #e1e1e1;
    border-radius: 4px;
    padding: 5px 10px 5px;
    width: 750px;
    .file-header-row{
      display: flex;
      font-size: 14px;
      padding: 10px 10px 5px 30px;
      .header-row-left{
        width: 100px;
      }
      .header-row-middle{
        width: 200px;
         > input{
          @include inputMix;
          width: 180px;
        }
        .input-panel{
          width: 190px;
          height: 27px;
          line-height: 27px;
          border-radius: 4px;
          border: 1px solid #DEDEDE;
          > input{
            @include inputMix;
            width: 160px;
            border: none;
          }
          .iconfont{
            color: #666;
            cursor: pointer;
            font-size: 14px;
            margin-top: 1px;
            display: inline-block;
            position: absolute;
          }
        }
      }
      .header-row-right{
        flex: 1;
        padding: 0px 30px;
        display: flex;
        .row-right-left{
          width: 40px;
        }
        .row-right-right{
          flex: 1;
          input{
            @include inputMix;
            width: 60px;
          }
        }
      }
    }
  }
  .db-file-body{
    .file-body-title{
      color: #424242;
      font-size: 12px;
      height: 50px;
      line-height: 50px;
      position: relative;
      button{
        right: 0px;
        width: 80px;
        height: 30px;
        top: 10px;
        color: white;
        outline: none;
        position: absolute;
        border-radius: 20px;
        cursor: pointer;
        border: 1px solid #4284F5;
        background-color: #4284F5;
      }
      .disable-btn{
        pointer-events: none;
        background-color: #d8d8d8;
        border: 1px solid #d8d8d8;
      }
    }
    .db-file-tip{
      font-size: 12px;
      color: #F5282D;
      margin: 0px 15px;
    }
    textarea{
      width: 100%;
      margin-top: 5px;
      height: 50px;
      border-radius: 4px;
      padding: 5px;
      border: 1px solid #dedede;
      resize: none;
      outline: none;
    }
  }
}
</style>
