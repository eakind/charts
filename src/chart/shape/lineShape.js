import { hideTooltip, showTooltip } from './tooltip';
const drawLineShape = (middle, data, scaleY, bandwidth, height, topAxisHeight, key, colorFeature) => {
  let symbol = d3.symbolCircle;
  let rotated = 0;
  const symbols = {
    cross: d3.symbolCross,
    cross45: d3.symbolCross,
    triangle: d3.symbolTriangle,
    triangle180: d3.symbolTriangle,
    square: d3.symbolSquare,
    star: d3.symbolStar,
    diamond: d3.symbolDiamond,
    wye: d3.symbolWye
  };
  const rotateds = {
    cross45: 45,
    triangle180: 180
  };
  console.log(rotated);
  console.log(rotateds);
  console.log(symbols);
  let arc = d3.symbol().type(symbol).size(2 * 25);
  let valueLine = d3.line()
    .defined((d) => (d))
    .x((d, index) => {
      return bandwidth * index + bandwidth / 2;
    })
    .y((d) => {
      return scaleY(d[key]);
    });
  let lineContainer = middle.append('g')
    .attr('transform', `translate(0,${topAxisHeight})`);
  lineContainer.append('path')
    .attr('d', valueLine(data))
    .attr('fill', 'none')
    .attr('stroke-width', 2)
    .attr('stroke', '#4284f5')
    .attr('opacity', 1);

  let pointer = lineContainer.selectAll('.point-group')
    .data(data)
    .enter()
    .append('g');

  pointer.append('path')
    .attr('d', arc)
    .attr('transform', (d, index) => {
      let x = bandwidth * index + bandwidth / 2;
      let y = scaleY(d[key]);
      return `translate(${x}, ${y})`;
    })
    .attr('fill', '#4284f5')
    .on('mouseenter', (d) => {
      showTooltip(d);
    })
    .on('mouseout', () => {
      hideTooltip();
    });

  let line = lineContainer.selectAll('.line-group')
    .data(data)
    .enter()
    .append('g');

  line.append('line')
    .attr('class', 'tooltip-line')
    .attr('x1', (d, index) => {
      return bandwidth * index + bandwidth / 2;
    })
    .attr('y1', 0)
    .attr('x2', (d, index) => {
      return bandwidth * index + bandwidth / 2;
    })
    .attr('y2', (d, index) => {
      return height;
    })
    .attr('stroke-width', 1)
    .attr('stroke', '#c2c9d1')
    .attr('stroke-dasharray', '5, 5')
    .attr('opacity', 0);

  line.append('line')
    .attr('x1', (d, index) => {
      return bandwidth * index + bandwidth / 2;
    })
    .attr('y1', 0)
    .attr('x2', (d, index) => {
      return bandwidth * index + bandwidth / 2;
    })
    .attr('y2', (d, index) => {
      return height;
    })
    .attr('stroke-width', 20)
    .attr('stroke', '#c2c9d1')
    .attr('stroke-dasharray', '3, 3')
    .attr('opacity', 0)
    .on('mouseenter', (d) => {
      let value = d[key];
      lineContainer.selectAll('.tooltip-line').attr('opacity', (d) => {
        return value === d[key] ? 1 : 0;
      });
      showTooltip(d);
    })
    .on('mouseout', () => {
      lineContainer.selectAll('.tooltip-line').attr('opacity', 0);
      hideTooltip();
    });
};

export {
  drawLineShape
};
