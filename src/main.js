import Vue from 'vue';
import App from './App.vue';
import router from './router/router';
import store from './store/index';
import Tip from './plugin/tip/index';
import CreateMessage from './plugin/createMessage/index';
import baseComponents from './plugin/base/index';
import messageBox from '@/plugin/messgeBox/index';
import dcAlert from '@/plugin/dcAlert/index';
import i18n from './i18n';
import IconSvg from '@/components/iconsvg/iconSvg';
import VueDragResize from 'vue-drag-resize';

import './style/icon/iconfont.js';
import '@/style/common.scss';

import '@/directives/vClickOut/index.js';

import '@/plugin/element.js';
import '@/plugin/index.js';

Vue.config.productionTip = false;
Vue.config.silent = true;
Vue.config.performance = true;
Vue.use(IconSvg);
Vue.use(dcAlert);
Vue.use(Tip);
Vue.use(CreateMessage);
Vue.use(baseComponents);
Vue.use(messageBox);
Vue.prototype.bus = new Vue();
Vue.component('vue-drag-resize', VueDragResize);

new Vue({
  router,
  i18n,
  store,
  render: (h) => h(App),
}).$mount('#app');
