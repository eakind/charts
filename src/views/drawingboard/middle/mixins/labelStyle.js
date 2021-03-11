import { mapState } from 'vuex';
// import { formatOneNumber } from '../../utils/canvasStyle';
// import { notEmpty } from '@/utils/check.js';
export default {
  data () {
    return {
      labelStyle: {
        show: false,
        list: [],
      },
    };
  },
  computed: {
    ...mapState('drawingboard', ['currentCanvasDetail', 'canvasType']),
  },
  methods: {

    showLabelStyleBox () {
      this.labelStyle.show = true;
      if (!this.currentCanvasDetail.css) {
        this.currentCanvasDetail.css = {};
      }
      let css = this.currentCanvasDetail.css;
      let list = css.labelsList;
      this.$set(this.labelStyle, 'list', list);
    },
    closeLabelStyleBox () {
      this.labelStyle.show = false;
    },

    changeLabelStyle (list, flag) {
      this.$set(this.labelStyle, 'list', list);
      this.$emit('modify-label-format', {
        list,
        noDrawFlag: flag,
      });
    },
    removeLabelFormat (item) {
      if (item) {
        let feature =
          item.dtype === 'CAT' || item.formulaType
            ? item.feature_name
            : `${item.legend.toLowerCase()}(${item.feature_name})`;
        let list = this.labelStyle.list.filter((i) => i.key !== feature);
        this.changeLabelStyle(list, true);
      }
    },
    initSingleLabelFormat (item, feature) {
      let obj = {
        key: feature,
        display: 'auto',
        title: feature,
        text: {
          align: 'left',
          fontSize: 12,
          fontColor: '#6B6B6B',
          fontStyle: 'normal',
          decoration: '',
          letterSpacing: '0',
          lineHeight: '24',
          sketchStyle: {},
          check: false,
        },
        format: {
          selectFormat: -1,
          decimal: '',
          prefix: '',
          suffix: '',
          isPercent: false,
          check: false,
        },
        type: '', // list.type
      };
      if (item.dtype === 'AGGR') {
        obj.format.decimal = 2;
        obj.format.useThousandMark = true;
        obj.format.negative = '-1234';
        obj.format.unit = '';
        obj.format.zone = `¥ ${this.$i18n.t('message.rmb')}`;
      }
      obj.type = item.dtype === 'AGGR' ? 'linear' : 'ordinal';
      return obj;
    },
    checkedProcess (obj, item) {
      if (!obj.checked) {
        let feature = '';
        if (obj.type === 'checked') {
          feature = `${item.legend.toLowerCase()}(${
            item.feature_name
          }) percent`;
        } else {
          feature = `${item.legend.toLowerCase()}(${item.feature_name})`;
        }
        let list = this.labelStyle.list.filter((i) => i.key !== feature);
        this.changeLabelStyle(list, true);
      } else {
        if (obj.type === 'originalChecked') {
          let feature = `${item.legend.toLowerCase()}(${item.feature_name})`;
          let idx = this.labelsCapsuleList.findIndex(
            (i) =>
              i.legend === item.legend && i.feature_name === item.feature_name
          );
          this.labelStyle.list.splice(
            idx + 1,
            0,
            this.initSingleLabelFormat(item, feature)
          );
          this.changeLabelStyle(this.labelStyle.list, true);
        }
      }
    },
    repeatProcess (list) {
      let ret = [];
      list.forEach((i) => {
        let match = ret.find(
          (mt) =>
            mt.feature_name === i.feature_name &&
            mt.legend === i.legend &&
            JSON.stringify(mt.rate) === JSON.stringify(i.rate)
        );
        if (!match) {
          ret.push(i);
        }
      });
      return ret;
    },
  },
};
