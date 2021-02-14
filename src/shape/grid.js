const initGrid = (middle, width, height, scaleY) => {
  console.log(width);
  let axis = d3.axisLeft(scaleY)
    .tickPadding(6)
    .tickSizeInner(-(width + 100))
    .tickSizeOuter(0);
  let grid = middle.append('svg')
    .attr('height', height)
    .attr('width', width + 100)
    .append('g')
    .attr('transform', `translate(${0},0)`)
    .call(axis);
  grid.select('path').attr('opacity', 0);
  grid.selectAll('text')
    .attr('opacity', 0)
    .text((d) => {
      return '';
    });
  grid.selectAll('line')
    .attr('stroke-dasharray', '5, 5')
    .attr('stroke', '#4284f5')
    .attr('stroke-width', 1);
};
export {
  initGrid
};
