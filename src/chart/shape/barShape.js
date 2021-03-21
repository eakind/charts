import { showTooltip, hideTooltip } from './tooltip';
const drawBarShape = (middle, data, scaleY, bandwidth, height, topAxisHeight, num, total, key) => {
  let linear = d3.scaleLinear().domain([249.15331511, 1428.5]).range([0, 1]).clamp(true);
  let compute = d3.interpolate('#4284F5', '#F59E28');
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
      return compute(linear(d[key]));
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

const drawStackBar = (data, scaleY, height, topAxisHeight, num, total, key) => {
  let colorStack = {
    null: '#4284f5',
    个人护理: '#03B98C',
    彩妆: '#F85742',
    护肤品: '#FACC14'
  };
  let keyCode = '产品主类';
  let arr = ['内蒙古', '河北省', '贵州省'];
  let temp = [];
  for (let i = 0; i < arr.length; i++) {
    let list = JSON.parse(JSON.stringify(data.filter(item => item['省份'] === arr[i])));
    for (let j = 0; j < list.length; j++) {
      let obj = list[j];
      obj[0] = list[j - 1] ? list[j - 1][1] : 0;
      obj[1] = list[j][key] + obj[0];
      temp.push(obj);
    }
  }
  let colorArr = ['null', '个人护理', '彩妆', '护肤品'];
  let list = [];
  for (let i = 0; i < colorArr.length; i++) {
    list.push(temp.filter(item => item['产品主类'] === colorArr[i]));
  }
  let bandwidth = this.scaleX.bandwidth();
  let barWidth = bandwidth / (total * 2);
  let barContainer = this.middle.append('g')
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
