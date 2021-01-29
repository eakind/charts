import ChartOption from './ChartOption';
export default class Chart extends ChartOption {
  constructor (config) {
    super();
    this.config = config;
    this.createContainer();
    this.initEvent();
  };

  createContainer () {
    let { id, autoFit, width, height } = this.config;
    this.bottom = 100;
    this.width = width;
    this.height = height - this.bottom;
    let dom = document.querySelector(`#${id}`);
    if (autoFit) {
      this.width = dom.clientWidth;
      this.height = dom.clientHeight - this.bottom;
    } else {
      dom.style.width = `${width}px`;
      dom.style.height = `${height}px`;
    }
    this.container = d3.select(`#${id}`)
      .append('div')
      .attr('class', 'chart-container');

    this.leftAxis = this.container.append('div')
      .attr('class', 'left-axis');

    this.middle = this.container.append('div')
      .attr('class', 'middle')
      .style('flex', '1')
      .style('width', '0')
      .style('overflow', 'auto hidden');

    this.rightAxis = this.container.append('div')
      .attr('class', 'right-axis');
  };

  initEvent () {
    this.container.on('click', () => {
      console.log('click');
    });
  };
};
