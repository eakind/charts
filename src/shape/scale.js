const scaleLinear = (maxValue, height) => {
  let scale = d3.scaleLinear()
    .domain([0, maxValue * 1.1])
    .range([(height || 600 - 30), 0]);
  return scale;
};

const scaleBand = (data, barWidth) => {
  let scale = d3.scaleBand()
    .domain(data)
    .range([0, barWidth]);
  return scale;
};

export {
  scaleLinear,
  scaleBand
};
