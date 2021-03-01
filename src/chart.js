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
    debugger;
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

    this.tipTpl = this.initTip();
  };

  initTip () {
    let tipTpl = document.createElement('div');
    tipTpl.style.padding = '4px';
    tipTpl.style.backgroundColor = 'white';
    tipTpl.style.fontSize = '14px';
    tipTpl.style.color = '#424242';
    tipTpl.style.borderRadius = '4px';
    tipTpl.style.boxShadow = 'rgba(0, 0, 0, 0.4) 0px 1px 3px';
    tipTpl.style.position = 'fixed';
    document.body.appendChild(tipTpl);
    return tipTpl;
  }

  initEvent () {
    this.container.on('click', () => {
      console.log('click');
    });
  };
};
