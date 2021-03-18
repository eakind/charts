const createFirstYPart = (leftAxis, uniqueList, yAxisHeight, leftAxisWidth, topAxisHeight, num) => {
  let grid = leftAxis.append('g')
    .attr('transform', `translate(${0}, ${topAxisHeight})`);
  let lineGroup = grid.append('g').attr('class', 'top-axis-line');
  let yGridGroup = lineGroup.selectAll('top-axis-line')
    .data(uniqueList)
    .enter();
  let len = uniqueList.length - 1;
  let textX = (num - 1) * 50 + 28;
  let lineX = (num - 1) * 50;
  yGridGroup.append('text')
    .attr('transform', (d, index) => {
      let height = yAxisHeight * (index + 1) - yAxisHeight / 2;
      return `translate(${textX}, ${height})`;
    })
    .attr('font-size', 14)
    .attr('text-anchor', 'middle')
    .style('writing-mode', 'tb')
    .text(d => d);

  yGridGroup.append('line')
    .attr('x1', (d, index) => {
      return lineX;
    })
    .attr('y1', (d, index) => {
      let height = yAxisHeight * (index + 1);
      return height;
    })
    .attr('x2', leftAxisWidth)
    .attr('y2', (d, index) => {
      let height = yAxisHeight * (index + 1);
      return height;
    })
    .attr('opacity', (d, index) => {
      let opacity = len === index ? 0 : 1;
      return opacity;
    })
    .attr('stroke-width', 1)
    .attr('stroke', '#c2c9d1');
};

const createLastYPart = (leftAxis, uniqueList, yAxisHeight, leftAxisWidth, topAxisHeight, partMap, partIndex) => {
  let grid = leftAxis.append('g')
    .attr('transform', `translate(${0}, ${topAxisHeight})`);
  let lineGroup = grid.append('g').attr('class', 'top-axis-line');
  let yGridGroup = lineGroup.selectAll('top-axis-line')
    .data(uniqueList)
    .enter();
  let textIndex = 0;
  yGridGroup.append('text')
    .attr('transform', (d) => {
      let len = [...new Set(partMap[d])].length;
      let unitHeight = yAxisHeight * len;
      textIndex = textIndex + len;
      let height = yAxisHeight * (textIndex) - unitHeight / 2;
      return `translate(${partIndex * 50 + 25}, ${height})`;
    })
    .attr('font-size', 14)
    .attr('text-anchor', 'middle')
    .style('writing-mode', 'tb')
    .text(d => d);

  let len = uniqueList.length - 1;
  let startIndex = 0;
  let endIndex = 0;
  yGridGroup.append('line')
    .attr('x1', (d) => {
      return 0;
    })
    .attr('y1', (d) => {
      let len = [...new Set(partMap[d])].length;
      startIndex = startIndex + len;
      let height = yAxisHeight * startIndex;
      return height;
    })
    .attr('x2', leftAxisWidth)
    .attr('y2', (d) => {
      let len = [...new Set(partMap[d])].length;
      endIndex = endIndex + len;
      let height = yAxisHeight * endIndex;
      return height;
    })
    .attr('opacity', (d, index) => {
      let opacity = len === index ? 0 : 1;
      return opacity;
    })
    .attr('stroke-width', 1)
    .attr('stroke', '#c2c9d1');
};

export {
  createFirstYPart,
  createLastYPart
};
