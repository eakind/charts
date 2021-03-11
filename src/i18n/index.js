import Vue from 'vue';
import VueI18n from 'vue-i18n';
import langEn from './en';
import langCn from './cn';

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: 'zh',
  messages: {
    en: langEn,
    zh: langCn
  }
});

export default i18n;
