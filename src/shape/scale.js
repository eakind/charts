const scaleLinear = (maxValue, height) => {
  let scale = d3.scaleLinear()
    .domain([0, maxValue * 1.1])
    .range([height, 0])
    .nice();
  return scale;
};

const scaleBand = (data, barWidth) => {
  let scale = d3.scaleBand()
    .domain(data.map((d, index) => {
      return `${d}|~|${index}`;
    }))
    .range([0, barWidth]);
  return scale;
};

export {
  scaleLinear,
  scaleBand
};
