const axis = (chart, field, position, isShow) => {
  if (!isShow) {
    chart.axis(field, isShow);
    return;
  }
  chart.axis(field, {
    position: position,
    line: {
      style: {
        lineWidth: 1,
        stroke: '#c2c9d1',
        opacity: 1,
        lineDash: [0, 0] // [3, 3]
      }
    },
    tickLine: {
      style: {
        stroke: '#c2c9d1',
        opacity: 1,
        lineWidth: 1,
      },
      alignTick: true,
      length: 6
    },
    label: {
      style: {
        fill: 'blue', // 字体颜色
        fontStyle: 'normal', // italic, oblique
        fontSize: 14, // 字体大小
        fontWeight: 'normal'
      },
      rotate: 0,
      autoEllipsis: true,
      formatter: (text, item, index) => {
        return text;
      }
    },
    title: {
      style: {
        fill: 'blue',
        fontSize: 16,
        fontWeight: 'normal',
        fontStyle: 'normal'
      }
    },
    grid: {
      alignTick: true,
      line: {
        type: 'line',
        style: {
          stroke: '#c2c9d1',
          opacity: 0,
          lineDash: [0, 0], // [3,3]
          lineWidth: 1
        }
      }
    },
    verticalLimitLength: 100
  });
};

export default axis;
