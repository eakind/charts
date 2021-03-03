import { getTxtWidth, setUnitHeight } from '../utils/utils';
const initYGrid = (middle, width, height, scaleY, topAxisHeight, index) => {
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
    .attr('opacity', 1)
    .attr('stroke-width', 1);
};

const getTextNum = (value, list) => {
  let num = 0;
  let start = 0;
  for (let i = 0, len = list.length; i < len; i++) {
    if (list[i] === value) {
      if (!num) start = i;
      num++;
    }
  }
  return { num, start };
};

const initXGrid = (middle, width, height, topAxisHeight, topAxis, bandwidth, xAxisList, title) => {
  let grid = middle.append('g')
    .attr('transform', `translate(${0}, ${topAxisHeight - topAxis})`);
  let uniqueData = [...new Set(xAxisList)];
  let lineLen = uniqueData.length - 1;
  let textGroup = grid.append('g').attr('class', 'top-axis-text');
  textGroup.append('g').append('text')
    .text(title)
    .attr('font-size', 14)
    .attr('transform', (d) => {
      let translateX = (width - getTxtWidth(title, 14)) / 2;
      return `translate(${translateX}, -32)`;
    });
  let xGridGroup = textGroup.selectAll('top-axis-text')
    .data(uniqueData)
    .enter();
  xGridGroup.append('text')
    .attr('transform', (d) => {
      let { num, start } = getTextNum(d, xAxisList);
      let translateX = (bandwidth * start) + (bandwidth * num) / 2;
      return `translate(${translateX}, ${-12}) rotate(${0})`;
    })
    .attr('font-size', 14)
    .text(d => d);
  xGridGroup.append('line')
    .attr('x1', (d) => {
      let { num, start } = getTextNum(d, xAxisList);
      let width = (num + start) * bandwidth;
      return width;
    })
    .attr('y1', -30)
    .attr('x2', (d) => {
      let { num, start } = getTextNum(d, xAxisList);
      let width = (num + start) * bandwidth;
      return width;
    })
    .attr('y2', height)
    .attr('opacity', (d, index) => {
      return lineLen === index ? 0 : 1;
    })
    .attr('stroke-width', 1)
    .attr('stroke', '#c2c9d1');
};

const initYAxisGrid = (leftAxis, yAxisHeight, uniqueData, width, xIndex, topAxisHeight, key, data, i) => {
  let grid = leftAxis.append('g')
    .attr('transform', `translate(${0}, ${yAxisHeight + topAxisHeight})`);
  let lineGroup = grid.append('g').attr('class', 'top-axis-line');
  let yGridGroup = lineGroup.selectAll('top-axis-line')
    .data(uniqueData)
    .enter();
  let lineLen = uniqueData.length - 1;
  yGridGroup.append('text')
    .attr('transform', (d, index) => {
      let x = xIndex * 45 + 30;
      let isUnit = i === 0;
      let height = setUnitHeight(yAxisHeight, d, data, key, isUnit, index);
      let y = height - 50;
      return `translate(${x}, ${y})`;
    })
    .attr('font-size', 14)
    .attr('text-anchor', 'end')
    .style('writing-mode', 'tb')
    .text(d => d);
  yGridGroup.append('line')
    .attr('x1', (d, index) => {
      return i * 50;
    })
    .attr('y1', (d, index) => {
      return index * yAxisHeight;
    })
    .attr('x2', width)
    .attr('y2', (d, index) => {
      return index * yAxisHeight;
    })
    .attr('opacity', (d, index) => {
      let opacity = lineLen === index ? 0 : 1;
      return opacity;
    })
    .attr('stroke-width', 1)
    .attr('stroke', '#c2c9d1');
};

const initYAxisLine = (leftAxis, topAxisHeight, height, xIndex) => {
  let grid = leftAxis.append('g').attr('class', 'line');
  grid.append('line')
    .attr('x1', xIndex * 50)
    .attr('y1', topAxisHeight)
    .attr('x2', xIndex * 50)
    .attr('y2', topAxisHeight + height)
    .attr('stroke-width', 1)
    .attr('stroke', '#c2c9d1');
};

const initMiddleGrid = (middle, yAxisHeight, uniqueData, width, topAxisHeight) => {
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

export {
  initYGrid,
  initXGrid,
  initYAxisGrid,
  initMiddleGrid,
  initYAxisLine
};
