<template>
  <div class="create-title">
    <span class="iconfont icon-db_menuBurger">{{isTxt}}</span>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { post } from '@/api/server';
export default {
  data () {
    return {
    };
  },
  components: {
  },
  computed: {
    ...mapState('project', ['projectStatus', 'projectId', 'createType']),
    isCreate () {
      let obj = {
        UPLOADING: true,
        ANALYZING: true
      };
      return obj[this.projectStatus];
    },
    isTxt () {
      let routeName = this.$route.name;
      let obj = {
        createprojectname: '创建项目',
        createprojectfile: '创建项目',
        useTemplate: '套用模板',
        createprojectpreview: '创建项目',
        createprojecttype: '创建项目',
        manualUpdate: '手动更新数据'
      };

      if (this.createType === 'template') {
        return '套用模板';
      } else if (this.projectStatus === 'REPLACE' || this.projectStatus === 'REPLACING') {
        return '替换数据';
      } else if (this.projectStatus === 'APPEND' || this.projectStatus === 'APPENDING') {
        return '添加数据';
      } else {
        return obj[routeName];
      }
    }
  },
  mounted () {
  },
  methods: {
    async giveUp () {
      let param = {
        project_id: this.projectId
      };
      if (!this.projectId) return;
      let res = await post('exitProject', param);
      if (res.code === 0) {
        this.$router.push({ path: '/' });
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.create-title {
  margin-left: 25px;
  .icon-db_menuBurger{
    font-weight: bold;
    &::before{
      margin-right: 10px;
    }
  }
}
</style>
