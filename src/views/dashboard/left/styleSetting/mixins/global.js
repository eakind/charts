import { isEmpty } from 'lodash';
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  data () {
    return {
      setCssTime: null,
      dashboard: {
        border: {
          bgSelected: 'none',
          background: '#dedede',
        },
        bgColor: {
          bgSelected: false,
          opacity: 100,
          index: -1,
          background: '#ffffff', // {}
        },
        padding: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
        isLock: true,
        size: {
          width: 1366,
          height: 768,
        },
        mobileSize: {
          width: 375,
          height: 812,
        },
        modeType: 'fixedWidth',
      },
      title: {
        showFlag: true,
        colorStyle: {
          background: '#000000',
          opacity: 100,
        },
        fontSize: 14,
        fontStyle: [],
        textAlign: 'left',
        bgColor: {
          bgSelected: false,
          background: '#ffffff',
          opacity: 100,
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
          background: '#dedede',
        },
      },
      isShowLegend: true,
      device: 'pc',
      time: null,
    };
  },
  watch: {
    device (val) {
      this.$set(this.currentDashboardDetail.css, 'device', val);
      this.emitSetCss('device', val);
    },
    isShowLegend (val) {
      this.emitSetCss('isShowLegend', val);
    },
    'currentDashboardDetail.dashboard_id' (val) {
      this.initStyle();
    },
    'currentDashboardDetail.css.isShowLegend': {
      handler (val) {
        this.isShowLegend = val;
      },
      deep: true,
    },
  },
  computed: {
    ...mapState('dashboard', ['currentDashboardDetail', 'layoutList']),
  },
  methods: {
    ...mapMutations('dashboard', ['setCurrentDashboardDetail']),
    ...mapActions('dashboard', ['setCss']),
    initStyle () {
      if (!this.currentDashboardDetail.css) {
        this.emitSetCss('dashboard', this.dashboard);
        this.emitSetCss('title', this.title);
        this.emitSetCss('isShowLegend', this.isShowLegend);
        this.emitSetCss('device', this.device);
        return;
      }
      if (!this.currentDashboardDetail.css.dashboard) {
        this.emitSetCss('dashboard', this.dashboard);
      }
      if (!this.currentDashboardDetail.css.title) {
        this.emitSetCss('title', this.title);
      }
      if (!this.currentDashboardDetail.css.device) {
        this.emitSetCss('device', this.device);
      }
      this.dashboard = JSON.parse(
        JSON.stringify(this.currentDashboardDetail.css.dashboard)
      );
      this.title = JSON.parse(
        JSON.stringify(this.currentDashboardDetail.css.title)
      );
      this.isShowLegend = this.currentDashboardDetail.css.isShowLegend;
      this.device = this.currentDashboardDetail.css.device || 'pc';
    },
    changeSize ({ width, height, curType }) {
      this.$set(this.dashboard, 'size', { width, height });
      this.$set(this.dashboard, 'curSizeType', curType);
      if (typeof this.refreshCanvas === 'function') {
        if (this.time) {
          clearTimeout(this.time);
        }
        this.time = setTimeout(() => {
          this.workSheetList.map((i) => {
            if (i.active && this.worksheetTypes[i.worksheet_type] === 'table') {
              // && this.worksheetTypes[i.worksheet_type] === 'table'
              this.refreshCanvas(this.layoutList, i.worksheet_id);
            }
          });
        }, 100);
      }
      this.emitSetCss('dashboard', this.dashboard);
    },
    changeMobileSize ({ width, height }) {
      this.$set(this.dashboard, 'mobileSize', { width, height });
      this.$set(
        this.currentDashboardDetail.css.dashboard,
        'mobileSize',
        this.dashboard.mobileSize
      );
      if (this.time) {
        clearTimeout(this.time);
        this.time = null;
      }
      this.time = setTimeout(() => {
        this.workSheetList.map((i) => {
          if (i.active && this.worksheetTypes[i.worksheet_type] === 'table') {
            // && this.worksheetTypes[i.worksheet_type] === 'table'
            this.refreshCanvas(this.layoutList, i.worksheet_id);
          }
        });
      }, 0);
      this.emitSetCss('dashboard', this.dashboard);
      this.setCurrentDashboardDetail(this.currentDashboardDetail);
    },
    // changeColor (type, item) {
    //   this.$set(this[type], 'bgColor', item);
    //   this.emitSetCss(type, this[type]);
    // },
    changePresetColor (color) {
      let obj = {
        background: color.background,
        color: color.color,
        backgroundIcon: color.backgroundIcon || '',
        index: color.index,
      };
      this.$set(this.dashboard.bgColor, 'background', obj);
      this.$set(this.dashboard.bgColor, 'opacity', 100);
      this.setTitleColor(this.layoutList, obj.color);
      this.emitSetCss('dashboard', this.dashboard);
      let fontObj = JSON.parse(JSON.stringify(this.title.colorStyle));
      fontObj.background = obj.color;
      this.changeFontColor('title', fontObj);
      if (typeof this.refreshCanvas === 'function') {
        setTimeout(() => {
          this.workSheetList.map((i) => {
            if (i.active) {
              // && this.worksheetTypes[i.worksheet_type] === 'table'
              this.refreshCanvas(this.layoutList, i.worksheet_id);
            }
          });
        }, 0);
      }
    },
    // changePadding (type, { padding, isLock }) {
    //   this.$set(this[type], 'padding', padding);
    //   this.$set(this[type], 'isLock', isLock);
    //   this.emitSetCss(type, this[type]);
    // },
    // changeBorderColor (type, item) {
    //   this.$set(this[type], 'border', item);
    //   this.emitSetCss(type, this[type]);
    // },
    // changeFontSize (item) {
    //   this.$set(this.title, 'fontSize', item.bgSelected);
    //   this.emitSetCss('title', this.title);
    // },
    emitSetCss (attr, css) {
      if (isEmpty(this.currentDashboardDetail)) return;
      // if (this.setCssTime) {
      //   clearTimeout(this.setCssTime);
      //   this.setCssTime = null;
      // }
      // this.setCssTime = setTimeout(() => {
      this.setCss({ attr, css, projectId: this.projectId });
      // }, 30);
    },
  },
};
