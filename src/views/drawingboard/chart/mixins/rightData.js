export const rightDataMix = {
  data () {
    return {
    };
  },
  methods: {
    onRangeChange (list, index) {
      // let detail = JSON.parse(sessionStorage.getItem(this.worksheetId));
      // let colors = detail.css.colors || [];
      // colors.forEach((i, idx) => {
      //   this.colorList[idx] = i;
      // });
      this.$set(this.canvasCss, 'colors', JSON.parse(JSON.stringify(this.colorList)));
      this.colorList[index].list = list;
      let range = [];
      let check = [];
      let val = [];
      list.forEach((i, idx) => {
        this.colorList[index].colors[i.index] = i.color;
        // range.push(i.originalVal);
        if (i.check) {
          range[idx] = i.originalVal;
        }
        check.push(i.check);
        val.push(i.val);
      });
      this.canvasCss.colorRanges = [];
      this.canvasCss.colorRanges[index] = {
        aggr: this.colorList[index].aggr,
        key_id: '0-0',
        range: range,
        check,
        val
      };
      this.colorList[index].colors.length = list.length;
      let arr = Array.from(this.colorList[index].colors);

      this.$set(this.canvasCss.colors[index], 'colors', arr);
      this.$set(this.canvasCss.colors[index], 'colorList', arr);
      this.colorList = JSON.parse(JSON.stringify(this.canvasCss.colors));
      this.drawChart();
      // console.log(list);
    },
    changeDataColor ({
      colors,
      colors_and_opacities_list,
      index,
      idx: curIndex,
    }) {
      let colorList = this.colorList;
      this.$set(this.canvasCss, 'colors', JSON.parse(JSON.stringify(this.colorList)));
      if (colors) {
        colorList[curIndex].list.map((m, idx) => {
          if (colors[curIndex].colorList[m.val]) {
            m.color = colors[curIndex].colorList[m.val];
          }
          this.colorList[curIndex].colors[idx] = m.color;
        });
        this.colorList[curIndex].colors.length = colorList[curIndex].list.length;
        let arr = Array.from(colorList[curIndex].colors);
        if (colorList[curIndex].colored_type === 'ordinal' && Object.prototype.toString.call(colorList[curIndex].colors) === '[object Object]') {
          for (const key in colorList[curIndex].colors) {
            if (colorList[curIndex].colors.hasOwnProperty(key)) {
              const element = colorList[curIndex].colors[key];
              arr.push(element);
            }
          }
        }
        this.$set(this.canvasCss.colors[curIndex], 'colors', arr);
        this.$set(this.canvasCss.colors[curIndex], 'colorList', arr);
        this.$set(this.canvasCss.colors[curIndex], 'schemes', arr);
        this.colorList = JSON.parse(JSON.stringify(this.canvasCss.colors));
      }
      if (colors && colors_and_opacities_list) {
        this.colorList.map((i, index) => {
          i.list.map((m, idx) => {
            let curColors = colors_and_opacities_list[index].schemes.slice(0, 2);
            m.color = curColors[idx];
            // this.colorList.filter(i => i.key_id === colors_and_opacities_list[0].key_id).colors = curColors;
          });
          i.opacity = colors_and_opacities_list[index].opacity;
        });
        // this.colorList[0].list.map((m, idx) => {
        //   m.color = curColors[idx];
        // });
        this.canvasCss.colors_and_opacities_list = colors_and_opacities_list;
      }
      if (colors_and_opacities_list) {
        this.canvasCss.colors_and_opacities_list = colors_and_opacities_list;
      }
      this.drawChart();
    },
    setColorList (value, key, list) {
      for (let i = 0; i < list.length; i++) {
        if (key === list[i].val) {
          this.$set(list[i], 'color', value);
        }
      }
      return list;
    },
    changeTemplate (list, idx) {
      this.$set(this.canvasCss, 'colors', JSON.parse(JSON.stringify(this.colorList)));
      this.colorList[idx].list = list;
      if (this.colorList[idx].colored_type === 'linear') {
        list.forEach(i => {
          this.colorList[idx].colors[i.index] = i.color;
        });
      } else {
        list.forEach(i => {
          this.colorList[idx].colors[i.val] = i.color;
        });
      }
      let arr = JSON.parse(JSON.stringify(this.colorList[idx].colors));
      if (this.colorList[idx].colored_type === 'linear') {
        this.colorList[idx].colors.length = list.length;
        arr = Array.from(this.colorList[idx].colors);
      }
      this.$set(this.canvasCss.colors[idx], 'colors', arr);
      // this.$set(this.canvasCss.colors[idx], 'colorList', arr);
      this.drawChart();
    },
    changeCatColor (index, colors, list, colorList) {
      let detail = this.currentCanvasDetail; ;// JSON.parse(sessionStorage.getItem(this.currentCanvasDetail.worksheet_id)); // this.worksheetId;
      let tempColors = detail.css.colors || [];
      tempColors.forEach((i, idx) => {
        this.colorList[idx] = i;
      });
      this.$set(this.canvasCss.colors, index, colorList[index]);
      this.canvasCss.colors[index].colorList = colors;
      this.canvasCss.colors[index].colors = colors;
      this.canvasCss.colors[index].list = list;
      this.canvasCss.colorList = colors;
      this.colorList = JSON.parse(JSON.stringify(this.canvasCss.colors));
      this.drawChart();
    },
    // 修改数据设置
    changeSetting (type, data, flag) {
      this.$set(this.canvasCss, type, data);
      this.defaultSetting = this.getDefaulstSetting(data);
      this.getChartData();
      this.saveCss();
    },
    changeShape (list) {
      this.$set(this.canvasCss, 'patterns', list);
      this.saveCss();
      this.drawChart();
    },
    changeSize (type, size, item) {
      if ((type === 'radius' || type === 'shape') && item) {
        this.radiusProcess(type, size, item);
        return;
      }
      this.$set(this.canvasCss, 'size', size);
      this.saveCss();
      this.drawChart();
    },
    dataSettingInit () {
      let defaultDataSetting = JSON.parse(JSON.stringify(this.defaultDataSetting));
      this.dataSetting = this.canvasCss.data_setting ? this.canvasCss.data_setting : defaultDataSetting;
    },
    getDefaulstSetting (list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].selected) {
          if (list[i].values) {
            return list[i].values[0].val;
          } else {
            if (list[i].content) {
              return list[i].content[0].val;
            }
          }
        }
      }
    }
  }
};
