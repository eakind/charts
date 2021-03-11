import DataColor from '../../right/data/dataColor.vue';
import DataSetting from '../../right/data/dataSetting.vue';
import TooltipSetting from '../../right/canvas/tooltipSetting.vue';
import CanvasColor from '../../right/canvas/canvasColor.vue';
import dashboardTitle from '../../middle/dashboardTitle.vue';
import BgColor from '../../middle/bgColor';
import layout from '../../middle/chartsLayout.vue';
import McChart from '@/components/dcCharts/index.vue';

import colorSizeLabel from '../../middle/colorSizeLabel.vue';

import { mapState, mapMutations } from 'vuex';

export const commonComponentsMixin = {
  components: {
    DataColor,
    DataSetting,
    TooltipSetting,
    CanvasColor,
    BgColor,
    layout,
    McChart,
    colorSizeLabel,
    dashboardTitle
  },
  computed: {
    ...mapState('drawingboard', [
      'colorCapsuleList',
      'labelsCapsuleList',
      'sizeCapsuleList',
      'currentCanvasDetail',
    ]),
    ...mapState('drawingboard', [
      'fontColor',
      'catList',
      'aggrList',
      'canvasType',
    ]),
  },
  methods: {
    ...mapMutations('drawingboard', [
      'setColorCapsuleList',
      'setLabelsCapsuleList',
      'setSizeCapsuleList',
      'setCurrentCanvasDetail',
      'setChartArrys',
    ]),
  }
};

export default commonComponentsMixin;
