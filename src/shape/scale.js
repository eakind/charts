const scaleLinear = (maxValue, height) => {
  let scale = d3.scaleLinear()
    .domain([0, maxValue])
    .range([(height - 30), 0]);
  return scale;
};

const scaleOrdinal = (data, barWidth) => {
  let scale = d3.scaleOrdinal()
    .domain(data)
    .range(data.map((item, index) => barWidth * index / (data.length - 1)));
  return scale;
};

export {
  scaleLinear,
  scaleOrdinal
};
