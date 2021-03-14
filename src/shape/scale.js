const scaleLinear = (maxValue, height) => {
  let scale = d3.scaleLinear()
    .domain([0, maxValue * 1.1])
    .range([height, 0])
    .nice();
  return scale;
};

const scaleBand = (data, barWidth, unique) => {
  let scale = d3.scaleBand();
  if (unique) {
    scale.domain(data);
  } else {
    scale.domain(data.map((d, index) => {
      return `${d}|~|${index}`;
    }));
  }
  scale.range([0, barWidth]);
  return scale;
};

export {
  scaleLinear,
  scaleBand
};
