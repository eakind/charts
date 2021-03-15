/*
周日：完成一些文字跟刻度的适配。
周一：柱状图改版完成(上午堆叠图，颜色)（下午刻度值自定义，视图自定义，颜色)（晚上:画线形图，组合图）
周二:改造线形图跟组合图(刻度值自定义，视图自定义，颜色)
周三: 条形图的改版
*/

const config = {
  autoFit: true,
  fitWidth: false,
  fitHeight: false,
  width: 600,
  height: 600,
  id: 'mc_bar',
  isCombined: true,
  // xAxisPart: [{
  //   position: 'top',
  //   key: '省',
  //   line: {
  //     style: {
  //       lineWidth: 1,
  //       fontColor: '#c2c9d1',
  //       opacity: 1,
  //       lineDash: [0, 0]
  //     }
  //   },
  //   label: {
  //     style: {
  //       fontColor: 'blue',
  //       fontStyle: 'normal',
  //       fontSize: 14,
  //       fontWeight: 'normal',
  //       opacity: 1
  //     },
  //     rotate: 0
  //   },
  //   title: {
  //     value: '市/省',
  //     style: {
  //       fontColor: 'blue',
  //       fontSize: 16,
  //       fontWeight: 'normal',
  //       fontStyle: 'normal'
  //     }
  //   },
  //   grid: {
  //     line: {
  //       style: {
  //         fontColor: '#c2c9d1',
  //         opacity: 0,
  //         lineDash: [0, 0], // [3,3]
  //         lineWidth: 1
  //       }
  //     }
  //   }
  // }, {
  //   position: 'top',
  //   key: '省',
  //   line: {
  //     style: {
  //       lineWidth: 1,
  //       fontColor: '#c2c9d1',
  //       opacity: 1,
  //       lineDash: [0, 0]
  //     }
  //   },
  //   label: {
  //     style: {
  //       fontColor: 'blue',
  //       fontStyle: 'normal',
  //       fontSize: 14,
  //       fontWeight: 'normal',
  //       opacity: 1
  //     },
  //     rotate: 0
  //   },
  //   title: {
  //     style: {
  //       fontColor: 'blue',
  //       fontSize: 16,
  //       fontWeight: 'normal',
  //       fontStyle: 'normal'
  //     }
  //   },
  //   grid: {
  //     line: {
  //       style: {
  //         fontColor: '#c2c9d1',
  //         opacity: 0,
  //         lineDash: [0, 0], // [3,3]
  //         lineWidth: 1
  //       }
  //     }
  //   }
  // }, {
  //   position: 'top',
  //   key: '市',
  //   line: {
  //     style: {
  //       lineWidth: 1,
  //       fontColor: '#c2c9d1',
  //       opacity: 1,
  //       lineDash: [0, 0]
  //     }
  //   },
  //   label: {
  //     style: {
  //       fontColor: 'blue',
  //       fontStyle: 'normal',
  //       fontSize: 14,
  //       fontWeight: 'normal',
  //       opacity: 1
  //     },
  //     rotate: 0
  //   },
  //   title: {
  //     style: {
  //       fontColor: 'blue',
  //       fontSize: 16,
  //       fontWeight: 'normal',
  //       fontStyle: 'normal'
  //     }
  //   },
  //   grid: {
  //     line: {
  //       style: {
  //         fontColor: '#c2c9d1',
  //         opacity: 0,
  //         lineDash: [0, 0], // [3,3]
  //         lineWidth: 1
  //       }
  //     }
  //   }
  // }],
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
      value: 'X轴哈哈哈',
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
  // yAxisPart: [{
  //   position: 'left-part',
  //   key: ['市'],
  //   line: {
  //     style: {
  //       lineWidth: 1,
  //       fontColor: '#c2c9d1',
  //       opacity: 1,
  //       lineDash: [0, 0]
  //     }
  //   },
  //   label: {
  //     style: {
  //       fontColor: 'blue',
  //       fontStyle: 'normal',
  //       fontSize: 14,
  //       fontWeight: 'normal',
  //       opacity: 1
  //     },
  //     rotate: 0
  //   }
  // }, {
  //   position: 'left-part',
  //   key: ['省'],
  //   line: {
  //     style: {
  //       lineWidth: 1,
  //       fontColor: '#c2c9d1',
  //       opacity: 1,
  //       lineDash: [0, 0]
  //     }
  //   },
  //   label: {
  //     style: {
  //       fontColor: 'blue',
  //       fontStyle: 'normal',
  //       fontSize: 14,
  //       fontWeight: 'normal',
  //       opacity: 1
  //     },
  //     rotate: 0
  //   }
  // }, {
  //   position: 'left-part',
  //   key: ['区域'],
  //   line: {
  //     style: {
  //       lineWidth: 1,
  //       fontColor: '#c2c9d1',
  //       opacity: 1,
  //       lineDash: [0, 0]
  //     }
  //   },
  //   label: {
  //     style: {
  //       fontColor: 'blue',
  //       fontStyle: 'normal',
  //       fontSize: 14,
  //       fontWeight: 'normal',
  //       opacity: 1
  //     },
  //     rotate: 0,
  //     formatter: (text, item, index) => {
  //       return text;
  //     }
  //   },
  //   title: {
  //     value: '区域',
  //     style: {
  //       fontColor: 'blue',
  //       fontSize: 16,
  //       fontWeight: 'normal',
  //       fontStyle: 'normal'
  //     }
  //   },
  //   grid: {
  //     line: {
  //       style: {
  //         fontColor: '#c2c9d1',
  //         opacity: 0,
  //         lineDash: [0, 0], // [3,3]
  //         lineWidth: 1
  //       }
  //     }
  //   }
  // }],
  yAxis: [[{
    position: 'left',
    type: ['bar'],
    key: ['sum(客户编号)'],
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
      value: 'sum(客户编号)',
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
    }
  }, {
    position: 'right',
    type: ['line'], // 组合图需要
    key: ['sum(平均售价)', 'sum(销售金额)'],
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
    }
  }], [{
    position: 'left',
    type: ['line'], // 组合图需要
    key: ['sum(销售数量)'],
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
      value: 'sum(销售数量)',
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
    }
  }, {
    position: 'right',
    type: ['line'], // 组合图需要
    key: ['sum(销售金额)'],
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
      value: 'sum(销售金额)',
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
    }
  }]]
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
  // colorFeature: { feature: 'median(客户ID)', type: 'linear', stacked: false }
};

const data = [[
  { 'sum(客户编号)': 450000000000000000000, 'sum(平均售价)': 1000, 'sum(销售金额)': 2320, 'sum(销售数量)': 3300, 省: '湖北省', 市: '武汉市', 区域: '华中', 产品主类: '护理' },
  { 'sum(客户编号)': 1865, 'sum(平均售价)': 1000, 'sum(销售金额)': 2320, 'sum(销售数量)': 3400, 省: '湖北省', 市: '武汉市', 区域: '华中', 产品主类: '护肤' },
  { 'sum(客户编号)': 1265, 'sum(平均售价)': 1000, 'sum(销售金额)': 2320, 'sum(销售数量)': 3500, 省: '湖北省', 市: '武汉市', 区域: '华中', 产品主类: '化妆111111' },
  { 'sum(客户编号)': 2865, 'sum(平均售价)': 1500, 'sum(销售金额)': 2320, 'sum(销售数量)': 3600, 省: '河南省', 市: '郑州市', 区域: '华中', 产品主类: '护理' },
  { 'sum(客户编号)': 1865, 'sum(平均售价)': 1600, 'sum(销售金额)': 2320, 'sum(销售数量)': 3700, 省: '河南省', 市: '郑州市', 区域: '华中', 产品主类: '护肤' },
  { 'sum(客户编号)': 1965, 'sum(平均售价)': 1800, 'sum(销售金额)': 2320, 'sum(销售数量)': 3800, 省: '河南省', 市: '郑州市', 区域: '华中', 产品主类: '化妆111111' },
  { 'sum(客户编号)': 1065, 'sum(平均售价)': 1190, 'sum(销售金额)': 2320, 'sum(销售数量)': 3900, 省: '福建省', 市: '厦门市', 区域: '华东', 产品主类: '护理' },
  { 'sum(客户编号)': 2065, 'sum(平均售价)': 1300, 'sum(销售金额)': 2320, 'sum(销售数量)': 4000, 省: '福建省', 市: '厦门市', 区域: '华东', 产品主类: '护肤' },
  { 'sum(客户编号)': 1865, 'sum(平均售价)': 1200, 'sum(销售金额)': 2320, 'sum(销售数量)': 3100, 省: '福建省', 市: '厦门市', 区域: '华东', 产品主类: '化妆111111' },
  { 'sum(客户编号)': 1165, 'sum(平均售价)': 1290, 'sum(销售金额)': 2120, 'sum(销售数量)': 3900, 省: '福建省', 市: '福州市', 区域: '华东', 产品主类: '护理' },
  { 'sum(客户编号)': 2165, 'sum(平均售价)': 1200, 'sum(销售金额)': 2120, 'sum(销售数量)': 4000, 省: '福建省', 市: '福州市', 区域: '华东', 产品主类: '护肤' },
  { 'sum(客户编号)': 1265, 'sum(平均售价)': 1100, 'sum(销售金额)': 2120, 'sum(销售数量)': 3100, 省: '福建省', 市: '福州市', 区域: '华东', 产品主类: '化妆111111' }],
[
  { 'sum(销售数量)': 3500, 省: '湖北省', 市: '武汉市', 'sum(平均售价)': 1200, 'sum(销售金额)': 1320, 产品主类: '护理' },
  { 'sum(销售数量)': 3500, 省: '湖北省', 市: '武汉市', 'sum(平均售价)': 1200, 'sum(销售金额)': 1320, 产品主类: '护肤' },
  { 'sum(销售数量)': 3500, 省: '湖北省', 市: '武汉市', 'sum(平均售价)': 1200, 'sum(销售金额)': 1320, 产品主类: '化妆111111' },
  { 'sum(销售数量)': 2820, 省: '河南省', 市: '郑州市', 'sum(平均售价)': 1300, 'sum(销售金额)': 1400, 产品主类: '护理' },
  { 'sum(销售数量)': 2820, 省: '河南省', 市: '郑州市', 'sum(平均售价)': 1300, 'sum(销售金额)': 1400, 产品主类: '护肤' },
  { 'sum(销售数量)': 2820, 省: '河南省', 市: '郑州市', 'sum(平均售价)': 1300, 'sum(销售金额)': 1400, 产品主类: '化妆111111' },
  { 'sum(销售数量)': 2290, 省: '福建省', 市: '厦门市', 'sum(平均售价)': 1400, 'sum(销售金额)': 1300, 产品主类: '护理' },
  { 'sum(销售数量)': 2290, 省: '福建省', 市: '厦门市', 'sum(平均售价)': 1400, 'sum(销售金额)': 1300, 产品主类: '护肤' },
  { 'sum(销售数量)': 2290, 省: '福建省', 市: '厦门市', 'sum(平均售价)': 1400, 'sum(销售金额)': 1300, 产品主类: '化妆111111' },
  { 'sum(销售数量)': 4220, 省: '福建省', 市: '福州市', 'sum(平均售价)': 1500, 'sum(销售金额)': 1560, 产品主类: '护理' },
  { 'sum(销售数量)': 4220, 省: '福建省', 市: '福州市', 'sum(平均售价)': 1500, 'sum(销售金额)': 1560, 产品主类: '护肤' },
  { 'sum(销售数量)': 4220, 省: '福建省', 市: '福州市', 'sum(平均售价)': 1500, 'sum(销售金额)': 1560, 产品主类: '化妆111111' }
]];

// const data = [
//   { 'sum(客户编号)': 3100, 产品主类: '化妆品' },
//   { 'sum(客户编号)': 3200, 产品主类: '化妆品' },
//   { 'sum(客户编号)': 2500, 产品主类: '化妆品' },
//   { 'sum(客户编号)': 3500, 产品主类: '化妆品' }
// ];

let test = chart.GeometryDrawingProcess({ data, config, chartType: 'bar' });
test.draw();
