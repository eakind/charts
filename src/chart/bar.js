import Base from './base';
export default class Bar extends Base {
  constructor (config, middle) {
    super();
    this.config = config;
    this.middle = middle;
  };

  drawChart () {
    this.middle.insert('text')
      .text('hahaha')
      .attr('fill', 'black');
  }
};
