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

const createMiddleXAxisPart = (group, uniqueList, top, bandwidth, canvasHeight, key, uniqueObj, perLen) => {
  let data = [...new Set(uniqueList)];
  console.log(data);
  let xGridGroup = group.append('g').attr('class', 'top-axis-text').selectAll('top-axis-text')
    .data(data)
    .enter();
  let len = data.length - 1;
  let textIndex = 0;
  xGridGroup.append('text')
    .attr('transform', (d) => {
      let num = uniqueObj[key].filter(item => item === d).length;
      textIndex = textIndex + num;
      let x = bandwidth * (textIndex + perLen) - bandwidth * num / 2;
      return `translate(${x}, ${top})`;
    })
    .attr('text-anchor', 'middle')
    .attr('font-size', 14)
    .text(d => d);
  let startIndex = 0;
  let endIndex = 0;
  xGridGroup.append('line')
    .attr('x1', (d) => {
      let num = uniqueObj[key].filter(item => item === d).length;
      startIndex = startIndex + num;
      let x = bandwidth * (startIndex + perLen);
      return x;
    })
    .attr('x2', (d) => {
      let num = uniqueObj[key].filter(item => item === d).length;
      endIndex = endIndex + num;
      let x = bandwidth * (endIndex + perLen);
      return x;
    })
    .attr('y1', top)
    .attr('y2', canvasHeight - top)
    .attr('opacity', (d, index) => index === len ? 0 : 1)
    .attr('stroke-width', 1)
    .attr('stroke', '#c2c9d1');
};

const createXAxisPart = (group, uniqueList, top, bandwidth, canvasHeight, uniqueObj) => {
  let xGridGroup = group.append('g').attr('class', 'top-axis-text').selectAll('top-axis-text')
    .data(uniqueList)
    .enter();
  let len = uniqueList.length - 1;
  let textIndex = 0;
  xGridGroup.append('text')
    .attr('transform', (d) => {
      let num = uniqueObj[d].length;
      textIndex = textIndex + num;
      let x = bandwidth * textIndex - bandwidth * num / 2;
      return `translate(${x}, ${top}) rotate(${0})`;
    })
    .attr('text-anchor', 'middle')
    .attr('font-size', 14)
    .text(d => d);
  let startIndex = 0;
  let endIndex = 0;
  xGridGroup.append('line')
    .attr('x1', (d) => {
      let num = uniqueObj[d].length;
      startIndex = startIndex + num;
      let x = bandwidth * startIndex;
      return x;
    })
    .attr('x2', (d) => {
      let num = uniqueObj[d].length;
      endIndex = endIndex + num;
      let x = bandwidth * endIndex;
      return x;
    })
    .attr('y1', 5)
    .attr('y2', canvasHeight - top - 20)
    .attr('opacity', (d, index) => index === len ? 0 : 1)
    .attr('stroke-width', 1)
    .attr('stroke', '#c2c9d1');
};

export {
  createXPartTitle,
  createXAxisPart,
  createMiddleXAxisPart
};
