const scale = (chart, field) => {
  chart.scale(field, {
    // min: 0,
    // max: 100,
    tickCount: 10,
    formatter: (value, index) => {
      return value;
    }
  });
};

export default scale;
