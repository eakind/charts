let Tip = {};
let tipVM = null;

Tip.install = function (Vue, options) {
  let opt = {
    duration: '3000',
    local: 'zh'
  };
  for (let property in options) {
    opt[property] = options[property];
  }
  Vue.prototype.$tip = function (tips, language, top) {
    let tmp = '<transition name="fade"><div :style="top" v-show="show"  class="plugin-tip" ><span v-text="tip" ></span>' +
      '<span class="tip-close-btn" v-text="language" @click="closeHandler"></span></div></transition>';
    if (tipVM && tipVM.show) {
      return;
    }
    if (!tipVM) {
      let TipTpl = Vue.extend({
        data: function () {
          return {
            show: false,
            tip: '',
            language: '',
            top: {
              top: '50px'
            }
          };
        },
        template: tmp,
        methods: {
          closeHandler () {
            this.show = false;
          }
        }
      });

      tipVM = new TipTpl();
      let tpl = tipVM.$mount().$el;
      document.body.appendChild(tpl);
    }
    tipVM.tip = tips;
    tipVM.language = language;
    tipVM.show = true;
    tipVM.top.top = top;
    setTimeout(() => {
      tipVM.show = false;
    }, opt.duration);
  };
};
export default Tip;
