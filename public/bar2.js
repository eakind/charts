const config = {
  fitModel: 'standard',
  width: 600,
  height: 600,
  id: 'mc_bar',
  isCombined: true,
  xAxisPart: [{
    position: 'top',
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
        fontStyle: 'normal',
        fontSize: 14,
        fontWeight: 'normal',
        opacity: 1
      },
      rotate: 0
    },
    title: {
      value: '宽度开导开导宽度开导开导',
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
    position: 'top',
    key: '省份',
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
      rotate: 0
    },
    title: {
      value: '产品主类/省份/是否为天美品牌',
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
    position: 'top',
    key: '是否为天美品牌',
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
      rotate: 0
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
    }
    //   }, {
    //     position: 'top',
    //     key: '区域',
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
    // }
  }],
  xAxis: [{
    position: 'bottom',
    key: '城市',
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
  //   yAxisPart: [{
  //     position: 'left-part',
  //     key: ['省份'],
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
  //     }
  //     //   }, {
  //     //     position: 'left-part',
  //     //     key: ['省份'],
  //     //     line: {
  //     //       style: {
  //     //         lineWidth: 1,
  //     //         fontColor: '#c2c9d1',
  //     //         opacity: 1,
  //     //         lineDash: [0, 0]
  //     //       }
  //     //     },
  //     //     label: {
  //     //       style: {
  //     //         fontColor: 'blue',
  //     //         fontStyle: 'normal',
  //     //         fontSize: 14,
  //     //         fontWeight: 'normal',
  //     //         opacity: 1
  //     //       },
  //     //       rotate: 0
  //     //     }
  //   }, {
  //     position: 'left-part',
  //     key: ['城市'],
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
  //       rotate: 0,
  //       formatter: (text, item, index) => {
  //         return text;
  //       }
  //     },
  //     title: {
  //       value: '品牌名称',
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
  //   }, {
  //     position: 'left-part',
  //     key: ['区域'],
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
  //       rotate: 0,
  //       formatter: (text, item, index) => {
  //         return text;
  //       }
  //     },
  //     title: {
  //       value: '品牌名称',
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
  //   }, {
  //     position: 'left-part',
  //     key: ['是否为天美品牌'],
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
  //       rotate: 0,
  //       formatter: (text, item, index) => {
  //         return text;
  //       }
  //     },
  //     title: {
  //       value: '品牌名称',
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
  //   }],
  yAxis: [[{
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
    }
  }],[{
    position: 'left',
    type: ['bar'],
    key: ['sum(销售单价)'],
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
      value: 'sum(销售单价)',
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
  }]]
    // }, {
    //   position: 'right',
    //   type: ['line'], // 组合图需要
    //   key: ['sum(平均售价)', 'sum(销售金额)'],
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
    //     value: 'sum(平均售价)',
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
    // }], [{
    //   position: 'left',
    //   type: ['line'], // 组合图需要
    //   key: ['sum(销售数量)'],
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
    //     value: 'sum(销售数量)',
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
    //   position: 'right',
    //   type: ['line'], // 组合图需要
    //   key: ['sum(销售金额)'],
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
    //     value: 'sum(销售金额)',
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
  // }]]
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
  // colorFeature: [
  //   { feature: '', type: 'ordinal', key: 'sum(PassengerId)' },
  //   { feature: '', type: 'linear', key: 'sum(PassengerId)' }
  // ]
};
const data = [
  [
    { 'sum(平均售价)': 110.85618736, 'sum(销售金额)': 120, 产品主类: 'null', 城市: '红河哈尼族彝族自治州', 是否为天美品牌: '非天美品牌', 省份: '云南省' },
    { 'sum(平均售价)': 105.6, 'sum(销售金额)': 120, 产品主类: 'null', 城市: '兴安盟', 是否为天美品牌: '非天美品牌', 省份: '内蒙古' },
    { 'sum(平均售价)': 145.31204546, 'sum(销售金额)': 120, 产品主类: '个人护理', 城市: '红河哈尼族彝族自治州', 是否为天美品牌: '非天美品牌', 省份: '云南省' },
    { 'sum(平均售价)': 55.55331511, 'sum(销售金额)': 120, 产品主类: '个人护理', 城市: '兴安盟', 是否为天美品牌: '非天美品牌', 省份: '内蒙古' },
    { 'sum(平均售价)': 68, 'sum(销售金额)': 120, 产品主类: '彩妆', 城市: '红河哈尼族彝族自治州', 是否为天美品牌: '非天美品牌', 省份: '云南省' },
    { 'sum(平均售价)': 1243.4420729799997, 'sum(销售金额)': 120, 产品主类: '护肤品', 城市: '红河哈尼族彝族自治州', 是否为天美品牌: '非天美品牌', 省份: '云南省' },
    { 'sum(平均售价)': 88, 'sum(销售金额)': 120, 产品主类: '护肤品', 城市: '兴安盟', 是否为天美品牌: '非天美品牌', 省份: '内蒙古' }
  ],
  [
    { 'sum(销售单价)': 110.85618736, 'sum(销售金额)': 120, 产品主类: 'null', 城市: '红河哈尼族彝族自治州', 是否为天美品牌: '非天美品牌', 省份: '云南省' },
    { 'sum(销售单价)': 105.6, 'sum(销售金额)': 120, 产品主类: 'null', 城市: '兴安盟', 是否为天美品牌: '非天美品牌', 省份: '内蒙古' },
    { 'sum(销售单价)': 145.31204546, 'sum(销售金额)': 120, 产品主类: '个人护理', 城市: '红河哈尼族彝族自治州', 是否为天美品牌: '非天美品牌', 省份: '云南省' },
    { 'sum(销售单价)': 55.55331511, 'sum(销售金额)': 120, 产品主类: '个人护理', 城市: '兴安盟', 是否为天美品牌: '非天美品牌', 省份: '内蒙古' },
    { 'sum(销售单价)': 68, 'sum(销售金额)': 120, 产品主类: '彩妆', 城市: '红河哈尼族彝族自治州', 是否为天美品牌: '非天美品牌', 省份: '云南省' },
    { 'sum(销售单价)': 1243.4420729799997, 'sum(销售金额)': 120, 产品主类: '护肤品', 城市: '红河哈尼族彝族自治州', 是否为天美品牌: '非天美品牌', 省份: '云南省' },
    { 'sum(销售单价)': 88, 'sum(销售金额)': 120, 产品主类: '护肤品', 城市: '兴安盟', 是否为天美品牌: '非天美品牌', 省份: '内蒙古' }
  ]
];
let test = chart.GeometryDrawingProcess({ data, config, chartType: 'bar' });
test.draw();
