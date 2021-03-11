import { isEmpty } from 'lodash';
import { mapState, mapActions } from 'vuex';
import { refreshCanvasMixin } from '../../../boardLayout/mixins/refreshCanvas';
export default {
  mixins: [refreshCanvasMixin],
  data () {
    return {
      title: {
        showFlag: true,
        colorStyle: {
          bgSelected: true,
          background: '#000', // {}
          opacity: 100,
        },
        fontSize: 14,
        textAlign: 'left',
        bgColor: {
          bgSelected: false,
        },
      },
      chart: {
        mode: 'standard',
        bgColor: {
          bgSelected: false,
          opacity: 100,
          index: -1,
          background: '#ffffff',
        },
      },
      global: {
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
    };
  },
  computed: {
    ...mapState('dashboard', ['currentTarget', 'workSheetList', 'layoutList']),
    ...mapState('project', ['newWorksheetTypesIconMap']),
  },
  methods: {
    ...mapActions('dashboard', ['setTargetCss']),
    initStyle (val) {
      let mode = this.handlerChartMode(val);
      if (isEmpty(this.currentTarget.style)) {
        this.emitSetCss('title', this.title);
        this.emitSetCss('chart', this.chart);
        this.emitSetCss('global', this.global);
        return;
      }
      if (!this.currentTarget.style.title) {
        this.emitSetCss('title', this.title);
      }
      if (!this.currentTarget.style.chart) {
        this.emitSetCss('chart', this.chart);
      }
      if (!this.currentTarget.style.global) {
        this.chart.mode = mode;
        this.emitSetCss('global', this.global);
      }
      this.title = JSON.parse(JSON.stringify(this.currentTarget.style.title));
      this.chart = JSON.parse(JSON.stringify(this.currentTarget.style.chart));
      this.global = JSON.parse(JSON.stringify(this.currentTarget.style.global));
    },
    emitSetCss (attr, css) {
      this.setTargetCss({
        id: this.currentTarget.id,
        attr,
        css,
        projectId: this.projectId,
      });
    },
    changeMode (item) {
      this.$set(this.chart, 'mode', item.bgSelected);
      this.emitSetCss('chart', this.chart);
      setTimeout(() => {
        this.refreshCanvas(this.layoutList, this.currentTarget.worksheetId);
      }, 0);
    },
    handlerChartMode (val) {
      let curId = val;
      let match = this.workSheetList.find((i) => curId === i.worksheet_id);
      let mode = 'standard';
      this.workSheetType = match ? match.worksheet_type : '';
      let full = ['06', '07', '08'];
      this.curModeList = JSON.parse(JSON.stringify(this.modeList));
      if (full.indexOf(this.workSheetType) > -1) {
        mode = 'full';
        this.curModeList = [
          { label: this.$t('dashboard.full_view'), value: 'full' },
        ];
        return mode;
      }
      let fitHeight = ['02', '03', '04', '05', '01', '09'];
      if (fitHeight.indexOf(this.workSheetType) > -1) {
        mode = 'fitHeight';
        if (this.workSheetType === '09') {
          mode = 'full';
        }
        this.curModeList = [
          { label: this.$t('dashboard.standard_view'), value: 'standard' },
          { label: this.$t('dashboard.fit_width'), value: 'fitWidth' },
          { label: this.$t('dashboard.fit_height'), value: 'fitHeight' },
          { label: this.$t('dashboard.full_view'), value: 'full' },
        ];
      }
      if (this.workSheetType === '01') {
        mode = 'standard';
      }
      return mode;
    },
  },
};
