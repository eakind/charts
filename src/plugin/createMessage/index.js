import Message from './src/index.vue';

let CreateMassage = {};
let createMassageVM = null;

CreateMassage.install = function (Vue, options) {
  let opt = {
    duration: '2000',
    local: 'zh'
  };
  for (let property in options) {
    opt[property] = options[property];
  }
  Vue.component('Message', Message);
  Vue.prototype.$createMassage = function (tips, language, top) {
    if (createMassageVM && createMassageVM.show) {
      return;
    }
    if (!createMassageVM) {
      let CreateMassageTpl = Vue.extend({
        render (h) {
          let props = {
            top: {
              top: '50px'
            },
            show: this.show,
            tip: this.tip,
          };
          return h('message', { props });
        },
        data () {
          return {
            show: true,
            tip: '',
            top: {
              top: '50px'
            }
          };
        },
        methods: {
          closeHandler () {
            this.show = false;
          }
        }
      });

      createMassageVM = new CreateMassageTpl();
      let tpl = createMassageVM.$mount().$el;
      document.body.appendChild(tpl);
    }
    createMassageVM.tip = tips;
    createMassageVM.show = true;
    createMassageVM.top.top = top;
    setTimeout(() => {
      createMassageVM.show = false;
    }, opt.duration);
  };
};
export default CreateMassage;
