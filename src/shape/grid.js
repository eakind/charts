// import { setPartHeight } from '../utils/utils';
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

const initYAxisGrid = (leftAxis, yAxisHeight, uniqueData, width, xIndex, topAxisHeight) => {
  let grid = leftAxis.append('g')
    .attr('transform', `translate(${0}, ${topAxisHeight})`);
  let lineGroup = grid.append('g').attr('class', 'top-axis-line');
  let yGridGroup = lineGroup.selectAll('top-axis-line')
    .data(uniqueData)
    .enter();
  // let perNum = 0;
  yGridGroup.append('text')
    .attr('transform', (d, index) => {
      let x = xIndex * 45 + 30;
      // let isUnit = i === 0;
      let height = (index + 1) * yAxisHeight - yAxisHeight / 2;
      // if (!isUnit) {
      //   let perIndex = setPartHeight(d, data, perKey, key);
      //   height = (perNum + perIndex / 2) * yAxisHeight;
      //   perNum = perNum + perIndex;
      // }
      return `translate(${x}, ${height})`;
    })
    .attr('font-size', 14)
    .attr('text-anchor', 'middle')
    .style('writing-mode', 'tb')
    .text(d => d);

  // 画多Y轴横线
  // let lineStartNum = 0;
  // let lineEndNum = 0;
  let lienLen = uniqueData.length - 1;
  yGridGroup.append('line')
    .attr('x1', (d, index) => {
      return 50 * xIndex;
    })
    .attr('y1', (d, index) => {
      // let isUnit = i === 0;
      let height = (index + 1) * yAxisHeight;
      // if (!isUnit) {
      //   let perIndex = setPartHeight(d, data, perKey, key);
      //   height = (lineStartNum + perIndex / 2) * yAxisHeight;
      //   lineStartNum = lineStartNum + perIndex;
      // }
      return height;
    })
    .attr('x2', width)
    .attr('y2', (d, index) => {
      // let isUnit = i === 0;
      let height = (index + 1) * yAxisHeight;
      // if (!isUnit) {
      //   let perIndex = setPartHeight(d, data, perKey, key);
      //   height = (lineEndNum + perIndex / 2) * yAxisHeight;
      //   lineEndNum = lineEndNum + perIndex;
      // }
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

const createXPartTxt = (group, data, top, xAxisList, bandwidth, shapeHeight) => {
  let xGridGroup = group.append('g').attr('class', 'top-axis-text').selectAll('top-axis-text')
    .data(data)
    .enter();
  let len = data.length - 1;
  xGridGroup.append('text')
    .attr('transform', (d) => {
      let num = xAxisList.filter(item => item === d).length;
      let start = xAxisList.indexOf(d);
      let gap = bandwidth * num;
      let startGap = bandwidth * start;
      let translateX = startGap + gap / 2;
      return `translate(${translateX}, ${top}) rotate(${0})`;
    })
    .attr('text-anchor', 'middle')
    .attr('font-size', 14)
    .text(d => d);
  xGridGroup.append('line')
    .attr('x1', (d) => {
      let num = xAxisList.filter(item => item === d).length;
      let start = xAxisList.indexOf(d);
      let gap = bandwidth * num;
      let startGap = bandwidth * start;
      let x = startGap + gap;
      return x;
    })
    .attr('x2', (d) => {
      let num = xAxisList.filter(item => item === d).length;
      let start = xAxisList.indexOf(d);
      let gap = bandwidth * num;
      let startGap = bandwidth * start;
      let x = startGap + gap;
      return x;
    })
    .attr('y1', 0)
    .attr('y2', shapeHeight + top + 30)
    .attr('opacity', (d, index) => index === len ? 0 : 1)
    .attr('stroke-width', 1)
    .attr('stroke', '#c2c9d1');
};

const createXPartTitle = (width, group, title) => {
  // 添加title
  group.append('g').attr('class', 'top-axis-title').append('text')
    .text(title)
    .attr('font-size', 14)
    .attr('text-anchor', 'middle')
    .attr('transform', (d) => {
      let translateX = width / 2;
      return `translate(${translateX}, 0)`;
    });
};

const setUniqueForKey = (perKey, key, data) => {
  let len = data.length;
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
  return uniqueObj;
};

const setUniqueData = (uniqueObj) => {
  let arr = [];
  for (let key in uniqueObj) {
    let temp = uniqueObj[key];
    for (let i = 0; i < temp.length; i++) {
      arr.push({
        perKey: key,
        value: temp[i]
      });
    };
  }
  return arr;
};

const setUniqueNum = (uniqueObj, d, isLast) => {
  let arr = uniqueObj[d.perKey];
  if (isLast) {
    let list = [...new Set(arr)];
    if (list.length === 1) return 1;
  }
  return arr.filter(item => item === d.value).length;
};

const createXAxisPart = (group, uniqueObj, top, bandwidth, shapeHeight, isLast) => {
  let uniqueData = setUniqueData(uniqueObj);
  let partGrid = group.append('g').attr('class', 'top-axis-part').selectAll('top-axis-part')
    .data(uniqueData)
    .enter();
  let startIndex = 0;
  partGrid.append('text')
    .attr('transform', (d) => {
      let y = top;
      let num = setUniqueNum(uniqueObj, d, isLast);
      startIndex = startIndex + num;
      let x = bandwidth * startIndex - (num * bandwidth) / 2;
      return `translate(${x}, ${y})`;
    })
    .attr('text-anchor', 'middle')
    .attr('font-size', 14)
    .text(d => d.value);

  let len = uniqueData.length - 1;
  let lineStart = 0;
  let lineEnd = 0;
  partGrid.append('line')
    .attr('x1', (d) => {
      let num = setUniqueNum(uniqueObj, d, isLast);
      lineStart = lineStart + num;
      return bandwidth * lineStart;
    })
    .attr('x2', (d) => {
      let num = setUniqueNum(uniqueObj, d, isLast);
      lineEnd = lineEnd + num;
      return bandwidth * lineEnd;
    })
    .attr('y1', top - 20)
    .attr('y2', shapeHeight + top + 18)
    .attr('opacity', (d, index) => {
      return len === index ? 0 : 1;
    })
    .attr('stroke-width', 1)
    .attr('stroke', '#c2c9d1');
};

export {
  initYGrid,
  initYAxisGrid,
  initMiddleGrid,
  initYAxisLine,
  drawCombinedXGrid,
  createXPartTxt,
  createXPartTitle,
  setUniqueForKey,
  createXAxisPart
};
