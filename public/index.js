let config = {
  autoFit: true,
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
  xAxis: [{
    position: 'bottom',
    key: ['省'],
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
      value: '省份',
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
  }],
  yAxisPart: [{
    position: 'left',
    key: ['市'],
    title: {
      value: ''
    }
  }, {
    position: 'left',
    key: ['省'],
    title: {
      value: ''
    }
  }],
  yAxis: [{
    position: 'left',
    key: ['sum(销售额)'],
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
      title: 'sum(销售额)',
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
  }, {
    position: 'right',
    key: ['sum(平均售价)'],
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
      title: 'sum(平均售价)',
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
]
};
const data = [
  { 省: '广东省', 市: '广州市', 'sum(销售额)': 2810, 'sum(平均售价)': 120 },
  { 省: '广东省', 市: '深圳市', 'sum(销售额)': 2820, 'sum(平均售价)': 130 },
  // { 省: '广西省', 市: '南宁市', 'sum(销售额)': 2840, 'sum(平均售价)': 150 },
  // { 省: '广西省', 市: '桂林市', 'sum(销售额)': 2850, 'sum(平均售价)': 160 },
  // { 省: '湖南省', 市: '长沙市', 'sum(销售额)': 2860, 'sum(平均售价)': 170 },
  // { 省: '湖南省', 市: '襄阳市', 'sum(销售额)': 2870, 'sum(平均售价)': 180 },
  { 省: '湖北省', 市: '武汉市', 'sum(销售额)': 2880, 'sum(平均售价)': 190 },
  { 省: '湖北省', 市: '孝感市', 'sum(销售额)': 2210, 'sum(平均售价)': 120 },
  { 省: '福建省', 市: '厦门市', 'sum(销售额)': 2420, 'sum(平均售价)': 130  },
  { 省: '福建省', 市: '福州市', 'sum(销售额)': 2140, 'sum(平均售价)': 180  },
]
let test = chart.GeometryDrawingProcess({ data, config, chartType: 'bar' });

test.draw();
