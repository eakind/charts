let Error = {};
let errVM = null;

Error.install = function (Vue, options) {
  let opt = {
    duration: '3000',
    local: 'zh'
  };
  for (let property in options) {
    opt[property] = options[property];
  }
  Vue.prototype.$error = function (message, language, top) {
    let tmp = '<transition name="fade"><div :style="top" v-show="show"  class="error-tip" >' +
      '<span class="iconfont icon-db_alert"><span class="error-tip-txt " v-text="message"></span></span>' +
      '<span class="error-close-btn" v-text="language" @click="closeHandler"></span></div></transition>';
    if (errVM && errVM.show) {
      return;
    }
    if (!errVM) {
      let ErrTpl = Vue.extend({
        data: function () {
          return {
            show: false,
            message: '',
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
            document.body.style.pointerEvents = '';
            window.location.href = '#/projectlist';
          }
        }
      });
      errVM = new ErrTpl();
      let tpl = errVM.$mount().$el;
      document.body.appendChild(tpl);
      document.body.style.pointerEvents = 'none';
    }
    errVM.message = message;
    errVM.language = language;
    errVM.show = true;
    errVM.top = top;
    setTimeout(() => {
      document.body.style.pointerEvents = '';
      errVM.show = false;
    }, opt.duration);
  };
};
export default Error;
