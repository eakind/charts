<template>
  <div class="manual-update">
    <div class="left">
      <div class="back-btn" @click="backHandler">
        <span>取消更新</span>
      </div>
      <div class="title">项目名称</div>
      <div class="title-name">{{ projectName }}</div>
    </div>
    <div class="right">
      <div class="header">
        <span class="body-title">更新方式</span>
        <div class="body-next" @click="sureHandler">确定</div>
      </div>
      <div class="tips">请选择一种更新方式，更新数据操作不可逆，项目内画布和展板数据将相应变化，请谨慎选择。</div>
      <div class="select-box">
        <div class="content" :class="currentIndex === index ? 'active-border' : 'default-border'" v-for="(item, index) in methodsList" :key="index" @click="selectHandler(index)">
          <div class="top">
            <span class="radius-style" :class="currentIndex === index ? 'radius-active' : ''"></span>
            {{ item.name }}
          </div>
          <div class="bottom">{{ item.message }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { post } from '@/api/server';
export default {
  data () {
    return {
      methodsList: [{
        name: '添加数据 （增量更新）',
        message: '在原有数据基础上添加数据。新数据必须与项目已有数据列一一对应。'
      }, {
        name: '替换数据 （全量更新）',
        message: '原数据将被替换。新数据须要与项目已有数据列对应，同时可新增数据列。'
      }],
      currentIndex: 0,
      mode: ''
    };
  },
  computed: {
    ...mapState('project', ['projectName', 'projectId'])
  },
  methods: {
    backHandler () {
      this.$router.push({ path: '/' });
    },
    selectHandler (index) {
      if (this.currentIndex === index) return;
      this.currentIndex = index;
    },
    async sureHandler () {
      if (this.currentIndex === 0) {
        this.mode = 'APPEND';
      } else {
        this.mode = 'REPLACE';
      };
      let param = {
        project_id: this.projectId,
        mode: this.mode
      };
      let res = await post('enterProject', param);
      if (res.code === 0) {
        this.$router.push({ path: '/createProject/createProjectFile' });
      }
    }
  }
};
</script>

<style scoped lang="scss">
.manual-update{
  width: 100%;
  height: 100%;
  display: flex;
  .left {
    width: 260px;
    height: 100%;
    background: #FBFCFF;
    padding: 25px;
    box-sizing: border-box;
    .back-btn {
      font-size: 16px;
      color: #424242;
      display: block;
      width: 280px;
      cursor: pointer;
      box-sizing: border-box;
      &::before {
        content: "";
        height: 10px;
        width: 10px;
        border-top: 2px solid #4284F5;
        border-left: 2px solid #4284F5;
        transform: rotate(-45deg);
        display: inline-block;
      }
    }
    .title {
      padding: 15px 0;
      color: #A4A4A4;
    }
  }
  .right {
    background: #FFFFFF;
    padding: 16px;
    width: 100%;
    .header {
      width: calc(100% - 40px);
      height: 40px;
      position: relative;
      box-sizing: content-box;
      background: #E7EBF2;
      border-radius: 4px;
      font-size: 16px;
      color: #424242;
      line-height: 40px;
      padding-left: 8px;
      .body-next {
        position: absolute;
        top: 0;
        right: 0;
        width: 120px;
        height: 40px;
        background: #4284F5;
        border-radius: 4px;
        font-size: 16px;
        color: #FFFFFF;
        text-align: center;
        cursor: pointer;
      }
    }
    .tips {
      font-size: 14px;
      color: #A4A4A4;
      margin: 5px 0 10px 8px;
    }
    .select-box {
      .content {
        height: 80px;
        width: 715px;
        border-radius: 4px;
        font-size: 14px;
        color: #424242;
        margin-top: 15px;
        .top {
          padding: 10px 0 15px 10px;
          .radius-style {
            display: inline-block;
            width: 14px;
            height: 14px;
            border: 2px solid #A4A4A4;
            border-radius: 50%;
            margin-right: 5px;
            box-sizing: border-box;
            top: 1px;
            position: relative;
          }
          .radius-active{
            background: #4284F5;
            border: none;
            &::after{
              content: '';
              height: 6px;
              width: 6px;
              border-radius: 50%;
              background-color: #fff;
              border: none;
              display: inline-block;
              position: absolute;
              left: 4px;
              top: 4px;
            }
          }
        }
        .bottom {
          padding-left: 28px;
          color: #A4A4A4;
        }
      }
      .active-border {
        border: 1px solid #4284F5;
      }
      .default-border {
        border: 1px solid #A4A4A4;
      }
    }
  }
}
</style>
