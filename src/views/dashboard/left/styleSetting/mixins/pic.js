import { mapState, mapActions } from 'vuex';
export default {
  data () {
    return {
      title: {
        showFlag: true,
        colorStyle: {
          bgSelected: true,
          background: '#000',
          opacity: 100,
        },
        fontSize: 14,
        textAlign: 'left',
      },
      global: {
        bgColor: {
          bgSelected: false,
        },
        border: {
          bgSelected: 'none',
        },
      },
    };
  },
  computed: {
    ...mapState('dashboard', ['currentTarget']),
  },
  methods: {
    ...mapActions('dashboard', ['setTargetCss']),
    initStyle () {
      if (!this.currentTarget.style) {
        this.emitSetCss('title', this.title);
        this.emitSetCss('global', this.global);
        return;
      }
      if (!this.currentTarget.style.title) {
        this.emitSetCss('title', this.title);
      }
      if (!this.currentTarget.style.global) {
        this.emitSetCss('global', this.global);
      }
      this.title = JSON.parse(JSON.stringify(this.currentTarget.style.title));
      this.global = JSON.parse(JSON.stringify(this.currentTarget.style.global));
    },
    emitSetCss (attr, css) {
      this.setTargetCss({ id: this.currentTarget.id, attr, css, projectId: this.projectId });
    },
  },
};
