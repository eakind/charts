const drawLabel = (middle, data, scaleY, bandwidth, num, total, key, labelList) => {
  if (!labelList || !labelList.length) return;
  let list = labelList.filter(item => item.key === key);
  for (let i = 0; i < list.length; i++) {
    let labelContainer = middle.append('g');
    let label = labelContainer.selectAll(`label_${num}`).data(data);
    let barWidth = bandwidth / (total * 2);
    label.enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('class', 'label')
      .attr('x', (d, index) => {
        return (index * bandwidth) + (num * (barWidth + 1)) + barWidth * (total / 2) + barWidth / 2;
      })
      .attr('y', d => scaleY(d[key]) - 25 * i + 10)
      .text(d => d[list[i].title]);
  };
};

export {
  drawLabel
};
