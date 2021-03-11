import { isEmpty } from 'lodash';
import { mapState, mapActions } from 'vuex';
export default {
  data () {
    return {
      title: {
        colorStyle: {
          bgSelected: true,
          background: '#000',
          opacity: 100,
        },
        showFlag: true,
        fontSize: 14,
        textAlign: 'center',
        fontStyle: [],
        bgColor: {
          bgSelected: false,
          opacity: 100,
          index: -1,
          background: '#ffffff',
        },
        padding: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
        isLock: true,
        border: {
          bgSelected: 'none',
        },
      },
    };
  },
  computed: {
    ...mapState('dashboard', ['currentTarget', 'currentDashboardDetail']),
  },
  watch: {
    currentTarget: {
      handler (val) {
        this.initStyle(val);
      },
      deep: true,
    },
  },
  methods: {
    // ...mapMutations('dashboard', ['setTargetCss']),
    ...mapActions('dashboard', ['setTargetCss']),
    initStyle (val) {
      let title = val ? val.style.title : this.currentTarget.style.title;
      if (!title) {
        this.emitSetCss('title', this.title);
        return;
      }
      if (!title) {
        this.emitSetCss('title', this.title);
      }
      this.title = JSON.parse(JSON.stringify(title));
    },
    changeBorderColor (type, item) {
      this.$set(this[type], 'border', item);
      this.emitSetCss(type, this[type]);
    },
    emitSetCss (attr, css) {
      if (isEmpty(this.currentDashboardDetail)) return;
      this.setTargetCss({
        id: this.currentTarget.id,
        attr,
        css,
        projectId: this.projectId,
      });
    },
  },
};
