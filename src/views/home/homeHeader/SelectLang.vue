<template>
  <div class="select-lang">
    <div class="lang-panel" @click="isList=!isList">
      <span class="iconfont icon-db_arrow" :class="isOpen"></span>
      {{langName}}
    </div>
    <div class="lang-list" v-if="isList" @click="isList=false">
      <div v-for="(item, index) in langList" :key="index" @click="selectLang(item)">
        {{item.name}}
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
export default {
  data () {
    return {
      isList: false,
      langName: '简体中文',
      langList: [{
        name: '简体中文',
        value: 'zh'
      }, {
        name: 'English',
        value: 'en'
      }]
    };
  },
  props: {
    select: {
      type: String
    },
    list: {
      type: Array
    }
  },
  computed: {
    ...mapState('project', ['locale']),
    isOpen () {
      return this.isList ? 'open-active' : '';
    }
  },
  beforeDestroy () {
    document.removeEventListener('click', this.clickProcess, false);
  },
  mounted () {
    document.addEventListener('click', this.clickProcess, false);
    this.name = this.locale === 'zh' ? '简体中文' : 'English';
  },
  methods: {
    ...mapMutations('project', ['setLocale']),
    clickProcess (e) {
      let dom = document.querySelector('.select-lang');
      if (dom && !dom.contains(e.target)) {
        this.hideHandler();
      }
    },
    hideHandler () {
      this.isList = false;
    },
    selectLang (obj) {
      this.langName = obj.name;
      this.isList = false;
      this.setLocale(obj.value);
      this.$i18n.locale = obj.value;
    }
  }
};
</script>
<style lang='scss' scoped>
.select-lang{
  margin-right: 64px;
  width: 120px;
  padding: 5px 0px 0px;
  position: relative;
  .lang-panel {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30px;
    width: 100%;
    cursor: pointer;
    position: relative;
  }
  .icon-db_arrow{
    color: #A4A4A4;
    font-size: 20px;
    display: inline-block;
    transform: rotate(90deg);
    margin-right: 10px;
  }
  .open-active{
    transform: rotate(-90deg);
  }
  .lang-list{
    top: 40px;
    width: 100%;
    z-index: 1000;
    padding-top: 10px;
    border-radius: 3px;
    background-color: white;
    position: absolute;
    > div {
      padding: 0px 10px;
      height: 30px;
      font-weight: 300;
      cursor: pointer;
    }
  }
}
</style>
