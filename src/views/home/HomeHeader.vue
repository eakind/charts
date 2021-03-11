<template>
  <div class="home-header">
    <user-info v-if="!isCreate"></user-info>
    <project-name v-if="!isList && !isCreate"></project-name>
    <div class="title" v-if="isList && !isCreate">BI Canvas</div>
    <create-title v-if="isCreate"></create-title>
    <menu-list class="middle" v-if="isMenuList"></menu-list>
    <div class="middle" v-show="isEmpty"></div>
    <select-lang v-show="isList"></select-lang>
  </div>
</template>
<script>
import CreateTitle from './homeHeader/CreateTitle.vue';
import SelectLang from './homeHeader/SelectLang.vue';
import UserInfo from './homeHeader/UserInfo.vue';
import MenuList from './homeHeader/MenuList.vue';
import ProjectName from './homeHeader/projectName.vue';
export default {
  data () {
    return {
    };
  },
  components: {
    CreateTitle,
    SelectLang,
    UserInfo,
    MenuList,
    ProjectName,
  },
  computed: {
    isList () {
      let routeName = this.$route.name;
      let obj = {
        projectlist: true
      };
      return obj[routeName];
    },
    isCreate () {
      let routeName = this.$route.name;
      let obj = {
        createprojectname: true,
        useTemplate: true,
        createprojectfile: true,
        createprojectpreview: true,
        createprojecttype: true,
        manualUpdate: true
      };
      return obj[routeName];
    },
    isEmpty () {
      let routeName = this.$route.name;
      let obj = {
        projectlist: true,
        useTemplate: true,
        createproject: true,
        createprojectpreview: true,
        createprojecttype: true
      };
      return obj[routeName];
    },
    isMenuList () {
      let routeName = this.$route.name;
      let obj = {
        dashboard: true,
        drawingboard: true
      };
      return obj[routeName];
    },
    showBack () {
      let routeName = this.$route.name;
      let obj = {
        createproject: true
      };
      return obj[routeName];
    }
  },
  mounted () {
  },
  methods: {
    backList () {
      this.$router.push({ path: '/' });
    }
  }
};
</script>
<style lang='scss' scoped>
.home-header {
  height: 60px;
  display: flex;
  align-items: center;
  background-color: #FBFCFF;
  margin-bottom: 8px;
  .title{
    font-size: 18px;
    color: #424242;
    margin-left: 20px;
  }
  .back{
    font-size: 14px;
    text-align: center;
  }
  .middle {
    flex: 1;
    width: 0;
    height: 60px;
  }
}
</style>
