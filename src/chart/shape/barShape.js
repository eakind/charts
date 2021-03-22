import { showTooltip, hideTooltip } from './tooltip';
const drawBarShape = (middle, data, scaleY, bandwidth, height, topAxisHeight, num, total, key, colorFeature) => {
  // let linear = d3.scaleLinear().domain([249.15331511, 1428.5]).range([0, 1]).clamp(true);
  // let compute = d3.interpolate('#4284F5', '#F59E28');
  if (colorFeature) {
    drawStackBar(middle, data, scaleY, bandwidth, height, topAxisHeight, num, total, key, colorFeature);
    return;
  }
  let barContainer = middle.append('g')
    .attr('transform', `translate(0,${topAxisHeight})`);
  let bar = barContainer.selectAll(`bar_${num}`).data(data);
  let barWidth = bandwidth / (total * 2);
  bar.enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (d, index) => {
      return (index * bandwidth) + (num * (barWidth + 1)) + barWidth * (total / 2);
    })
    .attr('y', 0)
    .attr('width', barWidth)
    .attr('height', d => scaleY(d[key]))
    .attr('fill', (d) => {
      return '#4284f5'; // compute(linear(d[key]));
    })
    .attr('opacity', 1)
    .attr('height', (d) => (height - scaleY(d[key])))
    .attr('y', (d) => scaleY(d[key]))
    .on('mouseout', (d) => {
      hideTooltip();
    })
    .on('mouseenter', (d) => {
      showTooltip(d);
    });
};

const drawStackBar = (middle, data, scaleY, bandwidth, height, topAxisHeight, num, total, key) => {
  let colorStack = {
    null: '#4284f5',
    个人护理: '#03B98C',
    彩妆: '#F85742',
    护肤品: '#FACC14'
  };
  // let colorArr = [];
  let keyCode = '产品主类';
  // for (let i = 0, len = data.length; i < len; i++) {
  //   colorArr.push(data[i][keyCode]);
  // }
  // console.log(colorArr);
  // debugger;
  let list = [];
  let barWidth = bandwidth / (total * 2);
  let barContainer = middle.append('g')
    .attr('transform', `translate(0,${topAxisHeight})`);
  let groupColor = barContainer.selectAll('group-color')
    .data(list)
    .enter().append('g')
    .attr('class', (d, index) => `group-${index}`);

  let categoryColor = groupColor.selectAll('category-color')
    .data(d => {
      return d;
    })
    .enter().append('g')
    .attr('class', (d, index) => `category-${index}`);
  categoryColor.append('rect')
    .attr('class', 'bar')
    .attr('x', (d, index) => {
      return (index * bandwidth) + (num * (barWidth + 1)) + barWidth * (total / 2);
    })
    .attr('y', (d, index) => {
      console.log(scaleY(d[1]));
      return scaleY(d[1]);
    })
    .attr('width', barWidth)
    .attr('fill', (d, index) => {
      return colorStack[d[keyCode]];
    })
    .attr('opacity', 1)
    .attr('height', (d) => {
      return height - scaleY(d[1] - d[0]);
    });
};

export {
  drawBarShape,
  drawStackBar
};
