import { getTxtWidth, setPartHeight } from '../utils/utils';
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
    .attr('opacity', 0)
    .attr('stroke-width', 1);
};

const setUniqueForKey = (perKey, key, data) => {
  let len = data.length;
  let arr = [];
  let uniqueValue = '';
  let uniqueObj = {};
  for (let i = 0; i < len; i++) {
    if (uniqueValue !== data[i][perKey]) {
      uniqueValue = data[i][perKey];
      uniqueObj[uniqueValue] = [data[i][key]];
    } else {
      if (uniqueObj[uniqueValue]) {
        uniqueObj[uniqueValue].push(data[i][key]);
      }
    }
  }
  for (let key in uniqueObj) {
    arr.push(...new Set(uniqueObj[key]));
  }
  return arr;
};

const getNum = (d, index, list) => {
  let total = 0;
  for (let i = index; i < list.length; i++) {
    if (list[i] === d) {
      total++;
    } else {
      return total;
    }
  }
  return total;
};

const initXGrid = (middle, width, height, topAxis, bandwidth, xAxisList, data, title, perKey, perList, key) => {
  let grid = middle.append('g')
    .attr('transform', `translate(${0}, ${topAxis})`);
  let uniqueData = [];
  if (!perKey) {
    uniqueData = [...new Set(xAxisList)];
  } else {
    uniqueData = setUniqueForKey(perKey, key, data);
  }
  let lineLen = uniqueData.length - 1;
  let textGroup = grid.append('g').attr('class', 'top-axis-text');
  // 添加title
  textGroup.append('g').append('text')
    .text(title)
    .attr('font-size', 14)
    .attr('transform', (d) => {
      let translateX = (width - getTxtWidth(title, 14)) / 2;
      return `translate(${translateX}, -32)`;
    });
  // 添加文本
  // let perValue = '';
  // let perIndex = '';
  let xGridGroup = textGroup.selectAll('top-axis-text')
    .data(uniqueData)
    .enter();
  xGridGroup.append('text')
    .attr('transform', (d, index) => {
      let num = xAxisList.filter(item => item === d).length;
      let start = xAxisList.indexOf(d);
      let gap = bandwidth * num;
      let startGap = bandwidth * start;
      let translateX = startGap + gap / 2;
      if (perKey) {
        let gapNum = getNum(d, index, xAxisList);
        // console.log(gapIndex);
        // let total = uniqueData.length;
        // // gap = gap / total;
        // // translateX = startGap + gap / 2 + gap * (perIndex - 1);
        // console.log(perValue);
        // console.log(perIndex);
        // console.log(total);
        // console.log(gap);
        // translateX = bandwidth * total / (index + 1);
        translateX = index * bandwidth + (gapNum * bandwidth / 2);
      }
      return `translate(${translateX}, ${-12}) rotate(${0})`;
    })
    .attr('text-anchor', 'middle')
    .attr('font-size', 14)
    .text(d => d);
  // 添加线
  xGridGroup.append('line')
    .attr('x1', (d) => {
      let num = xAxisList.filter(item => item === d).length;
      let start = xAxisList.indexOf(d);
      let width = (num + start) * bandwidth;
      return width;
    })
    .attr('y1', -30)
    .attr('x2', (d) => {
      let num = xAxisList.filter(item => item === d).length;
      let start = xAxisList.indexOf(d);
      let width = (num + start) * bandwidth;
      return width;
    })
    .attr('y2', height)
    .attr('opacity', (d, index) => {
      return lineLen === index ? 1 : 1;
    })
    .attr('stroke-width', 1)
    .attr('stroke', '#c2c9d1');
};

const initYAxisGrid = (leftAxis, yAxisHeight, uniqueData, width, xIndex, topAxisHeight, perKey, key, data, i) => {
  let grid = leftAxis.append('g')
    .attr('transform', `translate(${0}, ${topAxisHeight})`);
  let lineGroup = grid.append('g').attr('class', 'top-axis-line');
  let yGridGroup = lineGroup.selectAll('top-axis-line')
    .data(uniqueData)
    .enter();
  // let lineLen = uniqueData.length - 1;
  let perNum = 0;
  yGridGroup.append('text')
    .attr('transform', (d, index) => {
      let x = xIndex * 45 + 30;
      let isUnit = i === 0;
      let height = (index + 1) * yAxisHeight - yAxisHeight / 2;
      if (!isUnit) {
        let perIndex = setPartHeight(d, data, perKey, key);
        height = (perNum + perIndex / 2) * yAxisHeight;
        perNum = perNum + perIndex;
      }
      return `translate(${x}, ${height})`;
    })
    .attr('font-size', 14)
    .attr('text-anchor', 'middle')
    .style('writing-mode', 'tb')
    .text(d => d);

  // 画多Y轴横线
  let lineStartNum = 0;
  let lineEndNum = 0;
  let lienLen = uniqueData.length - 1;
  yGridGroup.append('line')
    .attr('x1', (d, index) => {
      return 50 * xIndex;
    })
    .attr('y1', (d, index) => {
      // let perIndex = setPartHeight(d, data, perKey, key);
      // let height = (lineStartNum + perIndex) * yAxisHeight;
      // lineStartNum = lineStartNum + perIndex;
      let isUnit = i === 0;
      let height = (index + 1) * yAxisHeight;
      if (!isUnit) {
        let perIndex = setPartHeight(d, data, perKey, key);
        height = (lineStartNum + perIndex / 2) * yAxisHeight;
        lineStartNum = lineStartNum + perIndex;
      }
      return height;
    })
    .attr('x2', width)
    .attr('y2', (d, index) => {
      // let perIndex = setPartHeight(d, data, perKey, key);
      // let height = (lineEndNum + perIndex) * yAxisHeight;
      // lineEndNum = lineEndNum + perIndex;
      let isUnit = i === 0;
      let height = (index + 1) * yAxisHeight;
      if (!isUnit) {
        let perIndex = setPartHeight(d, data, perKey, key);
        height = (lineEndNum + perIndex / 2) * yAxisHeight;
        lineEndNum = lineEndNum + perIndex;
      }
      return height;
    })
    .attr('opacity', (d, index) => {
      let opacity = lienLen === index ? 0 : 1;
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
