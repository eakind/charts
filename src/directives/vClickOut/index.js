import Vue from 'vue';
/*
  点击元素以外的地方触发此接口, 通常用于下拉框点击外部区域收回来
  <div v-click-out="hide"></div>
*/
Vue.directive('click-out', {
  bind (el, binding) {
    function documentHandler (event) {
      if (el.contains(event.target)) {
        return false;
      }
      if (binding.expression) {
        binding.value(event);
      }
    }
    el.clickOut = documentHandler;
    document.addEventListener('click', documentHandler, true);
  },
  unbind (el) {
    document.removeEventListener('click', el.clickOut, true);
    delete el.clickOut;
  }
});
