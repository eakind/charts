export const jsxMix = {
  components: {
    multiSpanCreate: {
      render: function (h) {
        return <div class={this.parentClass} onClick={this.clk}>
          {
            this.childClassArr.map((i, idx) => {
              if (this.hasChild && idx === 0) {
                return (<span class={i}>{this.contentArr[idx]} <span class="beta-tip"> &nbsp;&nbsp;(beta)</span></span>);
              }
              return (<span class={i}>{this.contentArr[idx]} </span>);
            })
          }
        </div>;
      },
      props: {
        childClassArr: {
          type: Array,
          default: _ => ['title', 'line', 'text']
        },
        parentClass: {
          type: Array,
          default: ['create', 'manually', 'blue']
        },
        contentArr: {
          type: Array,
          default: _ => []
        },
        hasChild: {
          type: Boolean,
          default: false
        }
      },
      methods: {
        clk () {
          this.$emit('on-click');
        }
      }
    },
    singleSpanCreate: {
      render: function (h) {
        let content = '';
        if (this.items.status === 'UPLOADED' || this.items.status === 'APPEND' || this.items.status === 'REPLACE') {
          content = this.$t('projectList.upgrade_data');
        }
        if (this.items.status === 'UPLOADING' || this.items.status === 'ANALYZING') {
          content = this.$t('projectList.creating_project');
        }
        if (this.items.status === 'APPENDING' || this.items.status === 'REPLACING') {
          content = this.$t('projectList.data_upgrade');
        }
        if (content) {
          return <span class="text">{content}</span>;
        }
      },
      props: {
        items: {
          type: Object,
        }
      }
    }
  }
};
