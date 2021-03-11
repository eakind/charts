import {
  userModifyChart
} from '@/mixins/userModifyChart';
import {
  notEmpty,
  isDefined,
  isEmpty,
  isArray
} from '@/utils/check.js';
import {
  modifyCss,
  formatOneNumber
} from '../../utils/canvasStyle';
import {
  mapState
} from 'vuex';
import {
  drawWithoutConfig
} from '@/utils/draw.js';
export const modifyChart = {
  mixins: [userModifyChart],
  data () {
    return {
      defaultBgCss: {
        color: this.fontColor,
        background: '#ffffff',
        opacity: 100,
        index: 0
      },
      canvasCss: {},
      color_list: [],
      size_list: []

    };
  },
  computed: {
    ...mapState('drawingboard', ['currentCanvasDetail', 'chartConfig', 'fontColor']),
    ...mapState('project', ['projectId'])
  },
  watch: {
    currentCanvasDetail: {
      handler () {
        this.canvasCss = this.currentCanvasDetail.css || {};
      },
      immediate: true
    }
  },
  methods: {
    changeCanvasCss () {
      this.canvasCss = this.currentCanvasDetail.css || {};
    },
    formatOneNumber (format, type) {
      return formatOneNumber(format, type, this.$i18n);
    },
    drawCanvas ({
      type = true,
      update = true
    }) {
      if (isEmpty(this.configs)) {
        this.$emit('on-loading-flag', false);
        // this.showLoading = false;
        return;
      }
      this.$emit('on-loading-flag', true);
      let ins;
      if (type) {
        // true 决定返回的数据格式
        ins = drawWithoutConfig({
          configs: this.configs,
          tooltip_list: this.tooltip_list,
          table_title_list: this.table_title_list
        });
      } else {
        console.log(ins);
      }
      this.$emit('on-loading-flag', false);
      // 待修改
      this.mc_insts = ins.instances;

      if (update) {
        this.configs = ins.configs;
        this.updateColorAndSize(ins.styles);
      }
      this.saveData('css', JSON.parse(JSON.stringify(this.canvasCss)));
    },
    updateColorAndSize (obj) {
      this.color_list = isArray(obj.colors) ? obj.colors : [];
      this.size_list = isArray(obj.sizes) ? obj.sizes : [];
      this.updateColorMapRelation();
    },
    updateColorMapRelation () {
      if (!isDefined(this.canvasCss.patterns)) {
        this.canvasCss.patterns = [];
      }
      if (!isDefined(this.canvasCss.colors)) {
        this.canvasCss.colors = [];
      }
      if (!isDefined(this.canvasCss.colors_and_opacities_list)) {
        this.canvasCss.colors_and_opacities_list = [];
      }
      this.color_list.forEach((c, cIdx) => {
        c.list.forEach((m, idx) => {
          m.color = c.schemes[idx];
          m.val = this.canvasCss.colorRanges && this.canvasCss.colorRanges[cIdx].range[idx];
        });
        let temp_color = this.canvasCss.colors.filter(
          co => co.key_id === c.key_id
        );
        if (notEmpty(temp_color)) {} else {
          this.canvasCss.colors.push({
            key_id: c.key_id,
            aggr: c.aggr,
            name: c.name
          });
        }

        let temp_pattern = this.canvasCss.patterns.filter(
          co => co.key_id === c.key_id
        );

        if (notEmpty(temp_pattern)) {} else {
          this.canvasCss.patterns.push({
            key_id: c.key_id,
            aggr: c.aggr,
            name: c.name,
            patternList: {} // patternList
          });
        }

        let temp_schemes = this.canvasCss.colors_and_opacities_list.filter(
          co => co.key_id === c.key_id
        );
        if (isEmpty(temp_schemes)) {
          this.canvasCss.colors_and_opacities_list.push({
            key_id: c.key_id,
            aggr: c.aggr,
            name: c.name,
            opacity: 100,
            schemes: []
          });
        }
      });
    },
    saveData (key, value, flag) {
      let worksheet = JSON.parse(sessionStorage.getItem(this.worksheetId));
      if (worksheet) {
        worksheet[key] = value;
        sessionStorage.setItem(this.worksheetId, JSON.stringify(worksheet));
        if (key === 'css') {
          modifyCss(
            flag, {
              canvasCss: this.canvasCss,
              projectId: this.projectId
            },
          );
          this.canvasCss.worksheetId = this.worksheetId;
          this.$emit('on-canvasCss-change', this.canvasCss);
        }
      }
    }
  }

};
