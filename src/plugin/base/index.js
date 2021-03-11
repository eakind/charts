// import Vue from 'vue'
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// import '../../../theme/index.css'

// import BaseButton from './BaseButton'
// import BaseCheckbox from './BaseCheckbox'
// import BaseInput from './BaseInput'
// import BaseRadio from './BaseRadio'
// import BaseSlider from './BaseSlider'
// import BaseSwitch from './BaseSwitch'
// import BaseDropdown from './BaseDropdown'
import BasePopup from './BasePopup';
import DcCollapse from '@/components/dccollapse/dcCollapse';
import DcCollapseItem from '@/components/dccollapse/dcCollapseItem';
import DcTabs from '@/components/dctab/dcTabs';
import DcTabItem from '@/components/dctab/dcTabItem';
import IconSvg from '@/components/iconsvg/iconSvg';

// Vue.use(ElementUI);

const datacube_ui = {
  // BaseButton,
  // BaseCheckbox,
  // BaseInput,
  // BaseRadio,
  // BaseSlider,
  // BaseSwitch,
  // BaseDropdown,
  BasePopup,
  DcCollapse,
  DcCollapseItem,
  DcTabs,
  DcTabItem,
};

datacube_ui.install = function (Vue, options) {
  Object.keys(datacube_ui).forEach(key => {
    Vue.component(key, datacube_ui[key]);
  });
  Vue.component(IconSvg.name, IconSvg);
};

export default datacube_ui;
