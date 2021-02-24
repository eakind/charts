import { setTextPos, setLinePos } from '../utils/utils';
const initYGrid = (middle, width, height, scaleY, topAxisHeight, index) => {
  let axis = d3.axisLeft(scaleY)
    .tickPadding(6)
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
    .attr('opacity', 1)
    .attr('stroke-width', 1);
};

const initXGrid = (middle, width, height, xAixsKey, topAxisHeight, topAxis, unitWidth, data, xAxisList) => {
  let grid = middle.append('g')
    .attr('transform', `translate(${0}, ${topAxisHeight - topAxis})`);
  let uniqueData = [...new Set(xAxisList)];
  let textGroup = grid.append('g').attr('class', 'top-axis-text');
  let xGridGroup = textGroup.selectAll('top-axis-text')
    .data(uniqueData)
    .enter();
  xGridGroup.append('text')
    .attr('transform', (d) => {
      let pos = setTextPos(unitWidth, d, data, xAixsKey);
      return `translate(${pos}, ${0}) rotate(${0})`;
    })
    .text(d => d);
  xGridGroup.append('line')
    .attr('x1', (d) => {
      let width = setLinePos(unitWidth, d, data, xAixsKey);
      return width;
    })
    .attr('y1', 0)
    .attr('x2', (d) => {
      let width = setLinePos(unitWidth, d, data, xAixsKey);
      return width + 100;
    })
    .attr('y2', height)
    .attr('stroke-width', 1)
    .attr('stroke', '#c2c9d1');
};

const initYAxisGrid = (leftAxis, yAxisHeight, uniqueData, width, xIndex) => {
  let grid = leftAxis.append('g')
    .attr('transform', `translate(${0}, ${100 + yAxisHeight})`);
  let lineGroup = grid.append('g').attr('class', 'top-axis-line');
  let yGridGroup = lineGroup.selectAll('top-axis-line')
    .data(uniqueData)
    .enter();
  yGridGroup.append('text')
    .attr('transform', (d, index) => {
      return `translate(${30 + xIndex * 100}, ${index * yAxisHeight - (yAxisHeight / 2)})`;
    })
    .text(d => d);
  yGridGroup.append('line')
    .attr('x1', (d, index) => {
      return 0;
    })
    .attr('y1', (d, index) => {
      return index * yAxisHeight;
    })
    .attr('x2', width)
    .attr('y2', (d, index) => {
      return index * yAxisHeight;
    })
    .attr('opacity', (d, index) => {
      return 1;
    })
    .attr('stroke-width', 1)
    .attr('stroke', '#c2c9d1');
  // if (!isTop) {
  //   leftAxis.append('line')
  //     .attr('x1', 100)
  //     .attr('y1', topAxisHeight)
  //     .attr('x2', 100)
  //     .attr('y2', (shapeHeight + topAxisHeight))
  //     .attr('stroke', '#c2c9d1')
  //     .attr('stroke-width', 1);
  // }
};

const initMiddleGrid = (middle, yAxisHeight, uniqueData, width) => {
  let grid = middle.append('g')
    .attr('transform', `translate(${0}, ${100 + yAxisHeight})`);
  let lineGroup = grid.append('g').attr('class', 'top-axis-line');
  let yGridGroup = lineGroup.selectAll('top-axis-line')
    .data(uniqueData)
    .enter();
  yGridGroup.append('line')
    .attr('x1', 0)
    .attr('y1', (d, index) => {
      return index * yAxisHeight;
    })
    .attr('x2', width)
    .attr('y2', (d, index) => {
      return index * yAxisHeight;
    })
    .attr('opacity', 1)
    .attr('stroke-width', 1)
    .attr('stroke', '#c2c9d1');
};

export {
  initYGrid,
  initXGrid,
  initYAxisGrid,
  initMiddleGrid
};
