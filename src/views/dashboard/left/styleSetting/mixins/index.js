import { mapState } from 'vuex';
export default {
  data () {
    return {
      borderList: [
        { label: '无', value: 'none' },
        { label: '细线', value: 'solid' },
        { label: '粗线', value: 'bold' },
        { label: '虚线', value: 'dotted' },
      ],
      fontSizeList: [
        8,
        9,
        10,
        12,
        14,
        16,
        20,
        24,
        28,
        32,
        36,
        40,
        48,
        56,
        64,
        72,
      ],
      modeList: [
        { label: this.$t('dashboard.standard_view'), value: 'standard' },
        { label: this.$t('dashboard.fit_width'), value: 'fitWidth' },
        { label: this.$t('dashboard.fit_height'), value: 'fitHeight' },
        { label: this.$t('dashboard.full_view'), value: 'full' },
      ],
    };
  },
  watch: {
    'title.showFlag' (val) {
      this.title.showFlag = val;
      this.emitSetCss('title', this.title);
    },
    'title.textAlign' (val) {
      this.title.textAlign = val;
      this.emitSetCss('title', this.title);
    },
  },
  computed: {
    ...mapState('project', ['projectId', 'worksheetTypes']),
    ...mapState('dashboard', ['workSheetList']),
  },
  methods: {
    changeColor (type, item, flag) {
      if (typeof (item.background) === 'string') {
        if (!this[type].bgColor.background || typeof (this[type].bgColor.background) === 'string') {
          this[type].bgColor.background = {};
        }
        this.$set(this[type].bgColor.background, 'background', item.background);
        this.$set(this[type].bgColor, 'opacity', item.opacity);
        this.$set(this[type].bgColor, 'bgSelected', item.bgSelected);
      } else {
        this.$set(this[type], 'bgColor', JSON.parse(JSON.stringify(item)));
      }
      let color = this[type].bgColor.background ? this[type].bgColor.background.color : '';
      this.setTitleColor(this.layoutList, color);
      this.emitSetCss(type, this[type]);
      if (color) {
        let fontObj = JSON.parse(JSON.stringify(this.title.colorStyle));
        if (!this[type].bgColor.bgSelected) {
          color = '#6b6b6b';
        }
        fontObj.background = color;
        this.changeFontColor('title', fontObj);
      }
      if (flag) {
        // 全局
        setTimeout(() => {
          this.workSheetList.map((i) => {
            //
            // if ((i.active && this.worksheetTypes[i.worksheet_type] === 'table') || (i.active && !item.bgSelected)) {
            if (i.active) {
              this.refreshCanvas(this.layoutList, i.worksheet_id);
            }
          });
        }, 0);
        return;
      }
      if (typeof this.refreshCanvas === 'function' && this.currentTarget) {
        setTimeout(() => {
          let match = this.workSheetList.find(
            (i) => i.worksheet_id === this.currentTarget.worksheetId
          );
          if (match && this.worksheetTypes[match.worksheet_type] === 'table') {
            this.refreshCanvas(this.layoutList, this.currentTarget.worksheetId);
          }
        }, 0);
      }
    },
    setTitleColor (list, color) {
      if (!color) return;
      for (let i = 0; i < list.length; i++) {
        if (list[i].style && (list[i].type === 'canvas' || list[i].type === 'filter')) {
          this.$set(list[i].style.title.colorStyle, 'background', color);
          // list[i].style.title.colorStyle.background = color;
        }
        this.setTitleColor(list[i].children, color);
      }
    },
    changePadding (type, { padding, isLock }) {
      this.$set(this[type], 'padding', padding);
      this.$set(this[type], 'isLock', isLock);
      this.emitSetCss(type, this[type]);
    },
    changeFontSize (item) {
      this.$set(this.title, 'fontSize', item.bgSelected);
      this.emitSetCss('title', this.title);
    },
    changeFontColor (type, item) {
      this.$set(this[type], 'colorStyle', item);
      this.emitSetCss('title', this.title);
    },
    changeBorderColor (type, item) {
      this.$set(this[type], 'border', item);
      this.emitSetCss(type, this[type]);
    },
    fontStyleProcess (val, type) {
      type = type || 'title';
      this[type].fontStyle = this[type].fontStyle || [];
      let idx = this[type].fontStyle.indexOf(val);
      if (idx > -1) {
        this[type].fontStyle.splice(idx, 1);
      } else {
        this[type].fontStyle.push(val);
      }
      this.emitSetCss(type, this[type]);
    },
  },
};
