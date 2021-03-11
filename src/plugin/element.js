import Vue from 'vue';
import {
  Select,
  Option,
  Message,
  MessageBox,
  InfiniteScroll,
  Button,
  Dialog,
  Tabs,
  TabPane,
  Collapse,
  CollapseItem,
  Checkbox,
  CheckboxGroup,
  Input,
  Popover,
  InputNumber,
  Slider,
  Tooltip,
  Switch
} from 'element-ui';
import 'element-ui/lib/theme-chalk/base.css';
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
Vue.use(Dialog);
Vue.use(InfiniteScroll);
Vue.component(CollapseTransition.name, CollapseTransition);

Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Checkbox);
Vue.use(Input);
Vue.use(Popover);
Vue.use(InputNumber);

Vue.use(Checkbox);
Vue.use(CheckboxGroup);

Vue.use(Slider);
Vue.use(Tooltip);

Vue.use(Switch);

Vue.prototype.$confirm = MessageBox.confirm;

Vue.prototype.$message = function (param) {
  Message.closeAll();
  Message(
    Object.assign(param, {
      duration: 1000,
    })
  );
};
