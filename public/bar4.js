const config = {
  fitModel: 'standard',
  width: 600,
  height: 600,
  id: 'mc_bar',
  isCombined: false,
  xAxis: [{
    position: 'bottom',
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
  //   colorFeature: [
  //     { feature: '', type: 'ordinal', key: 'sum(PassengerId)' },
  //     { feature: '', type: 'linear', key: 'sum(PassengerId)' }
  //   ]
};

const data = [[{ 'sum(平均售价)': 2068257.0974930085, 省份: '云南省' }, { 'sum(平均售价)': 1349601.85068834, 省份: '内蒙古' }, { 'sum(平均售价)': 854763.2916256813, 省份: '吉林省' }, { 'sum(平均售价)': 2946951.44348545, 省份: '四川省' }, { 'sum(平均售价)': 305027.33232023346, 省份: '天津市' }, { 'sum(平均售价)': 802707.7669248144, 省份: '宁夏' }, { 'sum(平均售价)': 2808488.6218790165, 省份: '安徽省' }, { 'sum(平均售价)': 4249162.841391318, 省份: '山东省' }, { 'sum(平均售价)': 1145457.6407870671, 省份: '山西省' }, { 'sum(平均售价)': 580370.0404584326, 省份: '广东省' }, { 'sum(平均售价)': 161121.2958616102, 省份: '广西省' }, { 'sum(平均售价)': 3843188.712334913, 省份: '新疆' }, { 'sum(平均售价)': 775943.4912519273, 省份: '江苏省' }, { 'sum(平均售价)': 3542068.2521087853, 省份: '江西省' }, { 'sum(平均售价)': 3882829.624201943, 省份: '河北省' }, { 'sum(平均售价)': 4813060.276175303, 省份: '河南省' }, { 'sum(平均售价)': 3266151.8234917503, 省份: '浙江省' }, { 'sum(平均售价)': 4937367.845920079, 省份: '湖北省' }, { 'sum(平均售价)': 6424287.318640892, 省份: '湖南省' }, { 'sum(平均售价)': 4645347.2445145, 省份: '甘肃省' }, { 'sum(平均售价)': 1321766.8002248523, 省份: '福建省' }, { 'sum(平均售价)': 276864.00468342914, 省份: '西藏' }, { 'sum(平均售价)': 1180383.5721069693, 省份: '贵州省' }, { 'sum(平均售价)': 2421782.3008436607, 省份: '辽宁省' }, { 'sum(平均售价)': 85841.69428866176, 省份: '重庆市' }, { 'sum(平均售价)': 4183418.4117029672, 省份: '陕西省' }, { 'sum(平均售价)': 1626355.8525274366, 省份: '青海省' }, { 'sum(平均售价)': 412957.5418679617, 省份: '黑龙江' }]];

let test = chart.GeometryDrawingProcess({ data, config, chartType: 'bar' });
test.draw();
