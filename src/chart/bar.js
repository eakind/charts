import { getKeyDataList } from '../components/data';
import Base from './base';
export default class Bar extends Base {
  constructor (data, config) {
    super(data, config);
    this.data = data;
    this.config = config;
    this.init();
    // this.drawBar();
  };

  drawBar () {
    if (!this.config.yAxis) return;
    let data = getKeyDataList(this.data, this.config.yAxis[0].key[0]);
    let barContainer = this.middle.append('g')
      .attr('width', this.shapeWidth)
      .attr('height', this.shapeHeight)
      .attr('transform', 'translate(0,10)');
    let bar = barContainer.selectAll('.bar').data(data);
    let druaction = this.scaleX.bandwidth();
    bar.enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d, index) => {
        return index * (this.scaleX.bandwidth()) + (this.scaleX.bandwidth() / 10);
      })
      .attr('y', this.scaleY)
      .attr('width', druaction * 0.8)
      .attr('height', 0)
      .attr('fill', '#4284f5')
      .attr('opacity', 0.7)
      .transition().duration(600)
      .attr('height', (d) => ((this.height - this.xAxisHeight) - this.scaleY(d)))
      .attr('y', (d) => this.scaleY(d));
  }
};
