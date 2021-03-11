export const openMixin = {
  data () {
    return {
      isOpen: false
    };
  },
  computed: {
    isOpenActive () {
      return this.isOpen ? 'open-active' : '';
    },
    isOpenRight () {
      return this.isOpen ? 'open-right' : '';
    },
    isStyle () {
      let dom = this.$el;
      let top = dom.getBoundingClientRect().bottom;
      let left = dom.getBoundingClientRect().left;
      let width = dom.clientWidth;
      return this.isOpen ? {
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`
      } : {};
    },
  },
  methods: {
    hideHandler () {
      setTimeout(() => {
        this.isOpen = false;
      }, 0);
    }
  }
};
