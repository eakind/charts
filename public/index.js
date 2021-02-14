const data = [
  {
    'sum(客户编号)': 665,
    省: '云南省',
    市: '云南市1'
  },
  {
    'sum(客户编号)': 1665,
    省: '广东省',
    市: '广东市1'
  },
  {
    'sum(客户编号)': 3500,
    省: '广西省',
    市: '广西市1'
  },
  {
    'sum(客户编号)': 2665,
    省: '湖北省',
    市: '湖北市1'
  },
  {
    'sum(客户编号)': 1065,
    省: '湖南省',
    市: '湖南市1'

  },
  {
    'sum(客户编号)': 1865,
    省: '河南省',
    市: '河南市1'
  },
  {
    'sum(客户编号)': 2065,
    省: '河北省',
    市: '河北市1'
  }
];

let config = {
  autoFit: false,
  width: 800,
  height: 600,
  id: 'bar_0',
  colorList: [
    '#4284F5',
    '#f45',
    '#3FAECC',
    '#FACC14',
    '#F5282D',
    '#8543E0',

    '#3110D0',
    '#E88F00',
    '#DE2393',
    '#91BA38',
    '#99B4BF',
    '#216A58',
    '#AB9438',
    '#F4999B',
    '#C9BFE1',
    '#055166',
    '#1F135A',
    '#43140A',
    '#96005A',
    '#8D8D8D'
  ],
  hasUnit: true,
  xAxis: {
    position: 'bottom',
    key: '省',
    titleValue: '省',
    line: {
      style: {
        lineWidth: 1,
        fontColor: '#c2c9d1',
        opacity: 1,
        lineDash: [0, 0]
      }
    },
    tickLine: {
      style: {
        fontColor: '#c2c9d1',
        opacity: 1,
        lineWidth: 1
      }
    },
    label: {
      style: {
        fontColor: 'blue',
        fontStyle: 'normal',
        fontSize: 14,
        fontWeight: 'normal'
      },
      rotate: 0,
      formatter: (text, item, index) => {
        return text;
      }
    },
    title: {
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
    limitLength: 100
  },
  yAxis: {
    position: 'left',
    key: ['sum(客户编号)'],
    titleValue: 'sum(客户编号)',
    line: {
      style: {
        lineWidth: 1,
        fontColor: '#c2c9d1',
        opacity: 1,
        lineDash: [0, 0]
      }
    },
    tickLine: {
      style: {
        fontColor: '#c2c9d1',
        opacity: 1,
        lineWidth: 1
      }
    },
    label: {
      style: {
        fontColor: 'blue',
        fontStyle: 'normal',
        fontSize: 14,
        fontWeight: 'normal'
      },
      rotate: 0,
      formatter: (text, item, index) => {
        return text;
      }
    },
    title: {
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
    limitLength: 100
  },
  labelsList: [
    {
      type: 'linear',
      key: 'median(客户ID)',
      title: 'median(客户ID)',
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
    },
    {
      type: 'linear',
      key: 'median(客户ID) percent',
      title: 'median(客户ID) percent',
      display: 'auto',
      format: {
        selectFormat: 'percent',
        decimal: 2,
        prefix: '',
        suffix: '%',
        isPercent: true
      },
      text: {
        fontColor: '#6b6b6b',
        fontSize: 12,
        textAlign: 'left',
        lineHeight: 24,
        display: 'auto'
      }
    },
    {
      type: 'ordinal',
      key: '区域',
      title: '区域',
      display: 'auto',
      format: {},
      text: {
        fontColor: '#6b6b6b',
        fontSize: 12,
        textAlign: 'left',
        lineHeight: 24,
        display: 'auto'
      }
    }
  ],
  tooltipList: [
    {
      type: 'linear',
      key: 'median(客户ID)',
      title: 'median(客户ID)',
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
    },
    {
      type: 'linear',
      key: 'median(客户ID) percent',
      title: 'median(客户ID) percent',
      display: 'auto',
      format: {
        selectFormat: 'percent',
        decimal: 2,
        prefix: '',
        suffix: '%',
        isPercent: true
      },
      text: {
        fontColor: '#6b6b6b',
        fontSize: 12,
        textAlign: 'left',
        lineHeight: 24,
        display: 'auto'
      }
    },
    {
      type: 'linear',
      key: 'sum(数量)',
      title: 'sum(数量)',
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
    },
    {
      type: 'ordinal',
      key: '区域',
      title: '区域',
      display: 'auto',
      format: {},
      text: {
        fontColor: '#6b6b6b',
        fontSize: 12,
        textAlign: 'left',
        lineHeight: 24,
        display: 'auto'
      }
    }
  ],
  sizeFeature: { feature: 'median(客户ID)' },
  labelFeature: [
    { type: 'linear', feature: 'median(客户ID)' },
    { type: 'ordinal', feature: '区域' }
  ],
  colorFeature: { feature: 'median(客户ID)', type: 'linear', stacked: false }
};

let barChart = chart.GeometryDrawingProcess({ data, config, chartType: 'bar' });


// barChart.axisY('左坐标轴', {
//   position: 'left',
//   line: {
//     style: {
//       lineWidth: 1,
//       stroke: '#c2c9d1',
//       opacity: 1,
//       lineDash: [0, 0]
//     }
//   },
//   tickLine: {
//     style: {
//       stroke: '#c2c9d1',
//       opacity: 1,
//       lineWidth: 1
//     }
//   },
//   label: {
//     style: {
//       fill: 'blue',
//       fontStyle: 'normal',
//       fontSize: 12,
//       fontWeight: 'normal'
//     },
//     rotate: 0,
//     formatter: (text, item, index) => {
//       return text;
//     }
//   },
//   title: {
//     style: {
//       fill: 'blue',
//       fontSize: 16,
//       fontWeight: 'normal',
//       fontStyle: 'normal'
//     }
//   },
//   grid: {
//     line: {
//       style: {
//         stroke: '#c2c9d1',
//         opacity: 0,
//         lineDash: [0, 0], // [3,3]
//         lineWidth: 1
//       }
//     }
//   },
//   limitLength: 100
// });

// barChart.axisY('右坐标轴', {
//   position: 'right',
//   line: {
//     style: {
//       lineWidth: 1,
//       stroke: '#c2c9d1',
//       opacity: 1,
//       lineDash: [0, 0]
//     }
//   },
//   tickLine: {
//     style: {
//       stroke: '#c2c9d1',
//       opacity: 1,
//       lineWidth: 1
//     }
//   },
//   label: {
//     style: {
//       fill: 'blue',
//       fontStyle: 'normal',
//       fontSize: 14,
//       fontWeight: 'normal'
//     },
//     rotate: 0,
//     formatter: (text, item, index) => {
//       return text;
//     }
//   },
//   title: {
//     style: {
//       fill: 'blue',
//       fontSize: 16,
//       fontWeight: 'normal',
//       fontStyle: 'normal'
//     }
//   },
//   grid: {
//     line: {
//       style: {
//         stroke: '#c2c9d1',
//         opacity: 0,
//         lineDash: [0, 0], // [3,3]
//         lineWidth: 1
//       }
//     }
//   },
//   limitLength: 100
// });
// barChart.axisX('底部坐标轴', {
//   position: 'bottom'
// });

// barChart.axisX('顶部坐标轴1', {
//   position: 'top'

// });
// barChart.axisX('顶部坐标轴2', {
//   position: 'top'
// });

// barChart.render('bar');
