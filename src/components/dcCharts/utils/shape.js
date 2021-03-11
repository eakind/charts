const bar = (chart, x, y) => {
  const barGeometry = chart.interval().position(`${x}*${y}`).color(x);
  barGeometry.adjust({
    type: 'dodge'
  });
  return barGeometry;
};

const line = (chartView, x, y) => {
  chartView.line().position(`${x}*${y}`);
  chartView.point().position(`${x}*${y}`).size(4).shape('circle').style({
    stroke: '#fff',
    lineWidth: 1
  });
  return chartView;
};

export {
  bar,
  line
};
