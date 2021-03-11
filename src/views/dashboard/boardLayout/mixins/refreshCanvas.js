
export const refreshCanvasMixin = {
  methods: {
    // updateLayoutText (list, idx, text) {
    //   for (let i = 0; i < list.length; i++) {
    //     if (list[i].idx === idx) {
    //       this.$set(list[i].style, 'value', text);
    //     } else {
    //       this.updateLayoutText(list[i].children, idx, text);
    //     }
    //   }
    // },
    refreshCanvas (list, worksheetId) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].worksheetId === worksheetId) {
          this.$set(list[i], 'needRequest', true);
          setTimeout(() => {
            this.$set(list[i], 'needRequest', false);
          }, 0);
        } else {
          this.refreshCanvas(list[i].children, worksheetId);
        }
      }
    },
    refreshAllCanvas (list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].worksheetId) {
          this.$set(list[i], 'needRequest', true);
          setTimeout(() => {
            this.$set(list[i], 'needRequest', false);
          }, 0);
        } else {
          this.refreshAllCanvas(list[i].children);
        }
      }
    }
  }
};
