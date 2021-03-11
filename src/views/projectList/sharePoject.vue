<template>
  <div class="share-project">
    <el-dialog title="分享项目" width="768px" :visible="shareFlag" :close-on-click-modal="false" @close="closeHandeler()">
      <div class="title">项目设为公开时，不需要权限即可查看。设为私密时，请确认成员有相关项目的查看权限。</div>
      <div class="name">项目名称：</div>
      <div class="project-url">{{ shareUrl }}</div>
      <div class="btn-box">
        <div class="left">
          <el-switch v-model="authorityValue" active-color="#4284F5" inactive-color="#A4A4A4">
          </el-switch>
          <span>{{authorityValue ? '公开' : '私密'}}</span>
        </div>
        <div class="right" :data-clipboard-text="shareUrl" @click="copy">
          <i class="iconfont icon-dbc_copy"></i>复制链接
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Clipboard from 'clipboard';
export default {
  data () {
    return {
      authorityValue: true,
      shareUrl: ''
    };
  },
  props: {
    shareFlag: {
      type: Boolean,
      default: true
    },
    projectDetail: {
      type: Object
    }
  },
  watch: {
    projectDetail: {
      handler (list) {
        if (window.location.hostname === 'localhost') {
          this.shareUrl = `http://192.168.1.225/dist-dcee/#/?projectId=${this.projectDetail.project_id}`;
        } else {
          let url = window.location.origin;
          this.shareUrl = `${url}/dist-dcee/#/?projectId=${this.projectDetail.project_id}`;
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
  },
  methods: {
    closeHandeler () {
      this.$emit('on-close');
    },
    copy () {
      var clipboard = new Clipboard('.right');
      clipboard.on('success', e => {
        this.$message({
          message: '链接已复制',
          type: 'success'
        });
        clipboard.destroy();
      });
      clipboard.on('error', e => {
        this.$message({
          message: '该浏览器不支持自动复制',
          type: 'warning'
        });
        clipboard.destroy();
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.share-project {
  font-size: 14px;
  .title {
    color: #A4A4A4;
    font-size: 12px;
  }
  .name {
    color: #424242;
    padding: 14px 0px;
  }
  .project-url {
    height: 40px;
    line-height: 40px;
    width: 100%;
    border: 1px solid #DEDEDE;
    padding: 0px 8px;
    border-radius: 4px;
  }
  .btn-box {
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
    margin-bottom: 284px;
    .left {
      display: flex;
      align-items: center;
      span {
        margin-left: 5px;
      }
    }
    .right {
      height: 32px;
      line-height: 32px;
      text-align: center;
      width: 120px;
      border-radius: 4px;
      border: 1px solid #DEDEDE;
      cursor: pointer;
      .icon-dbc_copy {
        color: #4284F5;
        margin-right: 5px;
      }
    }
  }
}
</style>
