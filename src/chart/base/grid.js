const createYGrid = (middle, width, height, scaleY, topAxisHeight, index) => {
  let axis = d3.axisLeft(scaleY)
    .tickPadding(6)
    .ticks(5)
    .tickSizeInner(-(width))
    .tickSizeOuter(0);
  let grid = middle.append('g')
    .attr('height', height)
    .attr('width', width)
    .append('g')
    .attr('transform', `translate(${0},${topAxisHeight + (index * height)})`)
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

const createYAxisPartHorGrid = (leftAxis, yAxisHeight, uniqueData, width, xIndex, topAxisHeight, list, isLast) => {
  let grid = leftAxis.append('g')
    .attr('transform', `translate(${0}, ${topAxisHeight})`);
  let lineGroup = grid.append('g').attr('class', 'top-axis-line');
  let yGridGroup = lineGroup.selectAll('top-axis-line')
    .data(uniqueData)
    .enter();
  yGridGroup.append('text')
    .attr('transform', (d, index) => {
      let x = xIndex * 45 + 30;
      let gap = list.filter(item => item === d).length;
      let start = list.indexOf(d, index);
      if (isLast) {
        gap = 1;
      }
      let height = (start + gap) * yAxisHeight - (gap * yAxisHeight) / 2;
      return `translate(${x}, ${height})`;
    })
    .attr('font-size', 14)
    .attr('text-anchor', 'middle')
    .style('writing-mode', 'tb')
    .text(d => d);

  // 画多Y轴横线
  let lienLen = uniqueData.length - 1;
  yGridGroup.append('line')
    .attr('x1', (d, index) => {
      return 50 * xIndex;
    })
    .attr('y1', (d) => {
      let gap = list.filter(item => item === d).length;
      let start = list.indexOf(d);
      let height = (start + gap) * yAxisHeight;
      return height;
    })
    .attr('x2', width)
    .attr('y2', (d) => {
      let gap = list.filter(item => item === d).length;
      let start = list.indexOf(d);
      let height = (start + gap) * yAxisHeight;
      return height;
    })
    .attr('opacity', (d, index) => {
      let opacity = lienLen === index ? 0 : 1;
      return opacity;
    })
    .attr('stroke-width', 1)
    .attr('stroke', '#c2c9d1');
};

const createYAxisPartVerLine = (leftAxis, topAxisHeight, height, xIndex) => {
  let grid = leftAxis.append('g').attr('class', 'line');
  grid.append('line')
    .attr('x1', xIndex * 50)
    .attr('y1', topAxisHeight)
    .attr('x2', xIndex * 50)
    .attr('y2', topAxisHeight + height)
    .attr('stroke-width', 1)
    .attr('stroke', '#c2c9d1');
};

const initYPartMiddleGrid = (middle, yAxisHeight, uniqueData, width, topAxisHeight) => {
  let grid = middle.append('g')
    .attr('transform', `translate(${0}, ${topAxisHeight + yAxisHeight})`);
  let lineGroup = grid.append('g').attr('class', 'top-axis-line');
  let yGridGroup = lineGroup.selectAll('top-axis-line')
    .data(uniqueData)
    .enter();
  let lineLen = uniqueData.length - 1;
  yGridGroup.append('line')
    .attr('x1', 0)
    .attr('y1', (d, index) => {
      return index * yAxisHeight;
    })
    .attr('x2', width)
    .attr('y2', (d, index) => {
      return index * yAxisHeight;
    })
    .attr('opacity', (d, index) => {
      return index === lineLen ? 0 : 1;
    })
    .attr('stroke-width', 1)
    .attr('stroke', '#c2c9d1');
};

const drawCombinedXGrid = (middle, topAxisHeight, index, width, height) => {
  let grid = middle.append('g').attr('class', 'line');
  let y = topAxisHeight + height * index;
  grid.append('line')
    .attr('x1', 0)
    .attr('y1', y)
    .attr('x2', width)
    .attr('y2', y)
    .attr('stroke-width', 1)
    .attr('stroke', '#c2c9d1');
};

export {
  createYGrid,
  createYAxisPartHorGrid,
  initYPartMiddleGrid,
  createYAxisPartVerLine,
  drawCombinedXGrid
};
