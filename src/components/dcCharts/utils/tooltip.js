const tooltip = (chart, isShow) => {
  if (!isShow) {
    chart.tooltip(false);
    return;
  }
  chart.tooltip({
    position: 'top',
    showCrosshairs: true,
    showTitle: false,
    crosshairs: {
      type: 'y'
    }
  });
};

export default tooltip;
