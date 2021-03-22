const config = {
  fitModel: 'standard',
  width: 600,
  height: 600,
  id: 'mc_bar',
  isCombined: false,
  xAxis: [{
    position: 'bottom',
    key: '产品主类',
    line: {
      style: {
        lineWidth: 1,
        fontColor: '#c2c9d1',
        opacity: 1,
        lineDash: [0, 0]
      }
    },
    label: {
      style: {
        fontColor: 'blue',
        fontSize: 14,
        fontWeight: 'normal',
        opacity: 1
      },
      rotate: 0
    },
    title: {
      value: 'Sex',
      style: {
        fontColor: 'blue',
        fontSize: 16,
        fontStyle: 'normal'
      }
    },
    grid: {
      line: {
        style: {
          fontColor: '#c2c9d1',
          opacity: 0,
          lineDash: [0, 0], // [3,3]
          lineWidth: 1
        }
      }
    }
  }],
  yAxis: [
    [{
      position: 'left',
      type: ['bar'],
      key: ['sum(平均售价)'],
      line: {
        style: {
          lineWidth: 1,
          fontColor: '#c2c9d1',
          opacity: 1,
          lineDash: [0, 0]
        }
      },
      label: {
        style: {
          fontColor: 'blue',
          fontStyle: 'normal',
          fontSize: 14,
          fontWeight: 'normal',
          opacity: 1
        },
        rotate: 0,
        formatter: (text, item, index) => {
          return text;
        }
      },
      title: {
        value: 'sum(平均售价)',
        style: {
          fontColor: 'blue',
          fontSize: 16,
          fontWeight: 'normal',
          fontStyle: 'normal'
        }
      },
      grid: {
        line: {
          style: {
            fontColor: '#c2c9d1',
            opacity: 0,
            lineDash: [0, 0], // [3,3]
            lineWidth: 1
          }
        }
      },
      data: [
        [
          { 'sum(平均售价)': 7229040.533898278, 产品主类: 'null' },
          { 'sum(平均售价)': 4638621.811793221, 产品主类: '个人护理' },
          { 'sum(平均售价)': 614627.9891372194, 产品主类: '儿童' },
          { 'sum(平均售价)': 337542.2107235185, 产品主类: '化妆工具' },
          { 'sum(平均售价)': 658529.0291089071, 产品主类: '居家日用' },
          { 'sum(平均售价)': 13616259.997656284, 产品主类: '彩妆' },
          { 'sum(平均售价)': 32893235.100178048, 产品主类: '护肤品' },
          { 'sum(平均售价)': 93426.93007641491, 产品主类: '服饰' },
          { 'sum(平均售价)': 1632135.1565759764, 产品主类: '男士' },
          { 'sum(平均售价)': 3198105.230653463, 产品主类: '面膜' }
        ]
      ]
    }]]
//   yAxisPart: [{
//     position: 'top',
//     key: '是否为天美品牌',
//     line: {
//       style: {
//         lineWidth: 1,
//         fontColor: '#c2c9d1',
//         opacity: 1,
//         lineDash: [0, 0]
//       }
//     },
//     label: {
//       style: {
//         fontColor: 'blue',
//         fontStyle: 'normal',
//         fontSize: 14,
//         fontWeight: 'normal',
//         opacity: 1
//       },
//       rotate: 0
//     },
//     title: {
//       value: '是否为天美品牌',
//       style: {
//         fontColor: 'blue',
//         fontSize: 16,
//         fontWeight: 'normal',
//         fontStyle: 'normal'
//       }
//     },
//     grid: {
//       line: {
//         style: {
//           fontColor: '#c2c9d1',
//           opacity: 0,
//           lineDash: [0, 0], // [3,3]
//           lineWidth: 1
//         }
//       }
//     }
//   }]
  // labelsList: [
  //   {
  //     type: 'linear',
  //     key: 'sum(销售金额)',
  //     title: 'sum(客户编号)',
  //     display: 'auto',
  //     format: {
  //       selectFormat: -1,
  //       decimal: 2,
  //       negative: '-1',
  //       unit: '',
  //       prefix: '',
  //       suffix: '',
  //       zone: 'CN',
  //       useThousandMark: true
  //     },
  //     text: {
  //       fontColor: '#6b6b6b',
  //       fontSize: 12,
  //       textAlign: 'left',
  //       lineHeight: 24,
  //       display: 'auto'
  //     }
  //   }
  //   // {
  //   //   type: 'linear',
  //   //   key: 'median(客户ID) percent',
  //   //   title: 'median(客户ID) percent',
  //   //   display: 'auto',
  //   //   format: {
  //   //     selectFormat: 'percent',
  //   //     decimal: 2,
  //   //     prefix: '',
  //   //     suffix: '%',
  //   //     isPercent: true
  //   //   },
  //   //   text: {
  //   //     fontColor: '#6b6b6b',
  //   //     fontSize: 12,
  //   //     textAlign: 'left',
  //   //     lineHeight: 24,
  //   //     display: 'auto'
  //   //   }
  //   // },
  //   // {
  //   //   type: 'ordinal',
  //   //   key: '区域',
  //   //   title: '区域',
  //   //   display: 'auto',
  //   //   format: {},
  //   //   text: {
  //   //     fontColor: '#6b6b6b',
  //   //     fontSize: 12,
  //   //     textAlign: 'left',
  //   //     lineHeight: 24,
  //   //     display: 'auto'
  //   //   }
  //   // }
  // ]
  // tooltipList: [
  //   {
  //     type: 'linear',
  //     key: 'median(客户ID)',
  //     title: 'median(客户ID)',
  //     display: 'auto',
  //     format: {
  //       selectFormat: -1,
  //       decimal: 2,
  //       negative: '-1',
  //       unit: '',
  //       prefix: '',
  //       suffix: '',
  //       zone: 'CN',
  //       useThousandMark: true
  //     },
  //     text: {
  //       fontColor: '#6b6b6b',
  //       fontSize: 12,
  //       textAlign: 'left',
  //       lineHeight: 24,
  //       display: 'auto'
  //     }
  //   },
  //   {
  //     type: 'linear',
  //     key: 'median(客户ID) percent',
  //     title: 'median(客户ID) percent',
  //     display: 'auto',
  //     format: {
  //       selectFormat: 'percent',
  //       decimal: 2,
  //       prefix: '',
  //       suffix: '%',
  //       isPercent: true
  //     },
  //     text: {
  //       fontColor: '#6b6b6b',
  //       fontSize: 12,
  //       textAlign: 'left',
  //       lineHeight: 24,
  //       display: 'auto'
  //     }
  //   },
  //   {
  //     type: 'linear',
  //     key: 'sum(数量)',
  //     title: 'sum(数量)',
  //     display: 'auto',
  //     format: {
  //       selectFormat: -1,
  //       decimal: 2,
  //       negative: '-1',
  //       unit: '',
  //       prefix: '',
  //       suffix: '',
  //       zone: 'CN',
  //       useThousandMark: true
  //     },
  //     text: {
  //       fontColor: '#6b6b6b',
  //       fontSize: 12,
  //       textAlign: 'left',
  //       lineHeight: 24,
  //       display: 'auto'
  //     }
  //   },
  //   {
  //     type: 'ordinal',
  //     key: '区域',
  //     title: '区域',
  //     display: 'auto',
  //     format: {},
  //     text: {
  //       fontColor: '#6b6b6b',
  //       fontSize: 12,
  //       textAlign: 'left',
  //       lineHeight: 24,
  //       display: 'auto'
  //     }
  //   }
  // ],
  // labelFeature: [
  //   { type: 'linear', feature: 'median(客户ID)' },
  //   { type: 'ordinal', feature: '区域' }
  // ],
  //   colorFeature: [
  //     { feature: '', type: 'ordinal', key: 'sum(PassengerId)' },
  //     { feature: '', type: 'linear', key: 'sum(PassengerId)' }
  //   ]
};

const data = [];

let test = chart.GeometryDrawingProcess({ data, config, chartType: 'line' });
test.draw();
