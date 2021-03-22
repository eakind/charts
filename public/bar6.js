const config = {
  fitModel: 'standard',
  width: 600,
  height: 600,
  id: 'mc_bar',
  isCombined: false,
  xAxis: [
    {
      position: 'bottom',
      key: '产品主类',
      line: {
        show: true,
        style: {
          lineWidth: 1,
          fontColor: '#c2c9d1',
          opacity: 1,
          lineDash: [0, 0]
        }
      },
      label: {
        style: {
          fontColor: '#6B6B6B',
          fontSize: 14,
          fontWeight: 'normal',
          opacity: 1
        },
        rotate: 0
      },
      title: {
        value: '产品主类',
        show: true,
        style: {
          fontColor: '#6B6B6B',
          fontSize: 14,
          fontStyle: 'normal'
        }
      },
      grid: {
        line: {
          show: true,
          style: {
            fontColor: '#c2c9d1',
            opacity: 0,
            lineDash: [0, 0],
            lineWidth: 1
          }
        }
      }
    }],
  yAxis: [
    [{
    //   position: 'left',
    //   key: ['sum(平均售价)'],
    //   line: {
    //     show: true,
    //     style: {
    //       lineWidth: 1,
    //       fontColor: '#c2c9d1',
    //       opacity: 1,
    //       lineDash: [0, 0]
    //     }
    //   },
    //   label: {
    //     style: {
    //       fontColor: '#6B6B6B',
    //       fontSize: 14,
    //       fontWeight: 'normal',
    //       opacity: 1
    //     },
    //     rotate: 0
    //   },
    //   title: {
    //     value: 'sum(平均售价)',
    //     show: true,
    //     style: {
    //       fontColor: '#6B6B6B',
    //       fontSize: 14,
    //       fontStyle: 'normal'
    //     }
    //   },
    //   grid: {
    //     line: {
    //       show: true,
    //       style: {
    //         fontColor: '#c2c9d1',
    //         opacity: 0,
    //         lineDash: [0, 0],
    //         lineWidth: 1
    //       }
    //     }
    //   },
    //   type: ['line'],
    //   data: [
    //     [
    //       { 'sum(平均售价)': 7229040.533898278, 'sum(平均售价)': 7229040.533898278,  产品主类: 'null' },
    //       { 'sum(平均售价)': 4638621.811793221, 'sum(平均售价)': 4638621.811793221, 产品主类: '个人护理' },
    //       { 'sum(平均售价)': 614627.9891372194, 'sum(平均售价)': 614627.9891372194, 产品主类: '儿童' },
    //       { 'sum(平均售价)': 337542.2107235185, 'sum(平均售价)': 337542.2107235185, 产品主类: '化妆工具' },
    //       { 'sum(平均售价)': 658529.0291089071, 'sum(平均售价)': 658529.0291089071, 产品主类: '居家日用' },
    //       { 'sum(平均售价)': 13616259.997656284, 'sum(平均售价)': 13616259.997656284, 产品主类: '彩妆' },
    //       { 'sum(平均售价)': 32893235.100178048, 'sum(平均售价)': 32893235.100178048, 产品主类: '护肤品' },
    //       { 'sum(平均售价)': 93426.93007641491, 'sum(平均售价)': 93426.93007641491, 产品主类: '服饰' },
    //       { 'sum(平均售价)': 1632135.1565759764, 'sum(平均售价)': 1632135.1565759764, 产品主类: '男士' },
    //       { 'sum(平均售价)': 3198105.230653463, 'sum(平均售价)': 3198105.230653463, 产品主类: '面膜' }
    //     ]
    //   ]
    // }, {
      position: 'right',
      key: ['sum(Count BarCode)'],
      line: {
        show: true,
        style: {
          lineWidth: 1,
          fontColor: '#c2c9d1',
          opacity: 1,
          lineDash: [0, 0]
        }
      },
      label: {
        style: {
          fontColor: '#6B6B6B',
          fontSize: 14,
          fontWeight: 'normal',
          opacity: 1
        },
        rotate: 0
      },
      title: {
        value: 'sum(Count BarCode)',
        show: true,
        style: {
          fontColor: '#6B6B6B',
          fontSize: 14,
          fontStyle: 'normal'
        }
      },
      grid: {
        line: {
          show: true,
          style: {
            fontColor: '#c2c9d1',
            opacity: 0,
            lineDash: [0, 0],
            lineWidth: 1
          }
        }
      },
      type: ['bar'],
      data: [
        [
          { 'sum(Count BarCode)': 1445047, 'sum(销售金额)': 3105, 'sum(客户编号)': 112, 产品主类: 'null' },
          { 'sum(Count BarCode)': 556656, 'sum(销售金额)': 3205, 'sum(客户编号)': 122, 产品主类: '个人护理' },
          { 'sum(Count BarCode)': 62571, 'sum(销售金额)': 3305, 'sum(客户编号)': 132, 产品主类: '儿童' },
          { 'sum(Count BarCode)': 46976, 'sum(销售金额)': 3405, 'sum(客户编号)': 102, 产品主类: '化妆工具' },
          { 'sum(Count BarCode)': 106856, 'sum(销售金额)': 3105, 'sum(客户编号)': 212, 产品主类: '居家日用' },
          { 'sum(Count BarCode)': 482759, 'sum(销售金额)': 3205, 'sum(客户编号)': 111, 产品主类: '彩妆' },
          { 'sum(Count BarCode)': 596018, 'sum(销售金额)': 3305, 'sum(客户编号)': 115, 产品主类: '护肤品' },
          { 'sum(Count BarCode)': 15964, 'sum(销售金额)': 3405, 'sum(客户编号)': 116, 产品主类: '服饰' },
          { 'sum(Count BarCode)': 52160, 'sum(销售金额)': 3105, 'sum(客户编号)': 117, 产品主类: '男士' },
          { 'sum(Count BarCode)': 118168, 'sum(销售金额)': 3005, 'sum(客户编号)': 110, 产品主类: '面膜' }
        ]
      ]
    }]],
  labelsList: [{
    type: 'linear',
    key: 'sum(Count BarCode)',
    title: 'sum(客户编号)',
    display: 'auto',
    format: {
      selectFormat: -1,
      decimal: 2,
      negative: '-1',
      unit: '',
      prefix: '',
      suffix: '',
      zone: 'CN',
      useThousandMark: true
    },
    text: {
      fontColor: '#6b6b6b',
      fontSize: 12,
      textAlign: 'left',
      lineHeight: 24,
      display: 'auto'
    }
  }, {
    type: 'linear',
    key: 'sum(Count BarCode)',
    title: 'sum(销售金额)',
    display: 'auto',
    format: {
      selectFormat: -1,
      decimal: 2,
      negative: '-1',
      unit: '',
      prefix: '',
      suffix: '',
      zone: 'CN',
      useThousandMark: true
    },
    text: {
      fontColor: '#6b6b6b',
      fontSize: 12,
      textAlign: 'left',
      lineHeight: 24,
      display: 'auto'
    }
  }, {
    type: 'linear',
    key: 'sum(平均售价)',
    title: 'sum(平均售价)',
    display: 'auto',
    format: {
      selectFormat: -1,
      decimal: 2,
      negative: '-1',
      unit: '',
      prefix: '',
      suffix: '',
      zone: 'CN',
      useThousandMark: true
    },
    text: {
      fontColor: '#6b6b6b',
      fontSize: 12,
      textAlign: 'left',
      lineHeight: 24,
      display: 'auto'
    } 
  }],
  // colorFeature: [
  //   { feature: '', type: 'ordinal', key: 'sum(PassengerId)' },
  // ]
};
const data = [];

let test = chart.GeometryDrawingProcess({ data, config, chartType: 'barRotated' });
test.draw();
