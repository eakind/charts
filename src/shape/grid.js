const initYGrid = (middle, width, height, scaleY, topAxisHeight) => {
  let axis = d3.axisLeft(scaleY)
    .tickPadding(6)
    .tickSizeInner(-(width))
    .tickSizeOuter(0);
  let grid = middle.append('g')
    .attr('height', height)
    .attr('width', width)
    .append('g')
    .attr('transform', `translate(${0},${topAxisHeight})`)
    .call(axis);
  grid.select('path').attr('opacity', 0);
  grid.selectAll('text')
    .attr('opacity', 0)
    .text((d) => {
      return '';
    });
  grid.selectAll('line')
    .attr('stroke-dasharray', '5, 5')
    .attr('stroke', '#c2c9d1')
    .attr('opacity', 0)
    .attr('stroke-width', 1);
};

const initXGrid = (middle, width, height, scaleX, topAxisHeight, topAxis) => {
  let axis = d3.axisTop(scaleX)
    .tickPadding(6)
    .tickSizeInner(-(height + topAxis))
    .tickSizeOuter(0);
  let grid = middle.append('g')
    .attr('height', height)
    .attr('width', width)
    .append('g')
    .attr('transform', `translate(${0}, ${topAxisHeight - topAxis})`)
    .call(axis);
  grid.select('path').attr('opacity', 0);
  grid.selectAll('line')
    .attr('stroke-dasharray', '0, 0')
    .attr('stroke', '#c2c9d1')
    .attr('transform', () => {
      return `translate(${scaleX.bandwidth()}, 0)`;
    })
    .attr('stroke-width', 1);
};

export {
  initYGrid,
  initXGrid
};
