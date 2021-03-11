import Vue from 'vue';
import tooltips from './tooltips/index.js';
import dcMessageBox from './dcMessageBox/index.js';
import dcDraggingTips from './draggingTips/index.js';
import dcMessage from './dcMessage/index.js';
import ConfirmBox from './confirmBox/index.js';
import MoreDataTip from './moreDataTip/index.js';

import chartEmpty from '@/components/chartEmpty/index.vue';
Vue.use(tooltips);
Vue.use(dcMessageBox);
Vue.use(dcDraggingTips);
Vue.use(dcMessage);
Vue.use(ConfirmBox);
Vue.use(MoreDataTip);
Vue.component('chart-empty', chartEmpty);
