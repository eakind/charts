/* eslint-disable no-useless-constructor */
import { dataProcess, getTextWidth } from '../utils/utils.js';
import defaultConfig from '../utils/defaultConfig.js';

import Geometry from './Geometry.js';
let { defaultFormat, defaultText } = defaultConfig;
class Bubble extends Geometry {
  constructor (data, config) {
    super(data, config);
    this.init();
  }

  init () {
    this.createContainer();
  }

  labelsConfig () {
    let list = this.config.labelsList;
    let textDom = this.geometry
      .append('text')
      .attr('class', 'bubble-labels')
      .attr('text-anchor', 'middle')
      .attr('startOffset', '50%')
      .attr('textLength', (d) => d.radius)
      .attr(
        'transform',
        (d) =>
          `translate(0, -${
            list.reduce((a, b) => a + b.text.lineHeight, 0) / 2
          })`
      );
    textDom
      .selectAll('tspan')
      .data((d) => {
        let tempList = list
          .map((l) => {
            let { format = defaultFormat } = l;
            return {
              ...d,
              key: l.key,
              title: l.title,
              format: l.format,
              text: l.text || defaultText,
              formatVal: dataProcess(d[l.key], format)
            };
          })
          .filter((f) => getTextWidth(f.formatVal) < d.radius * 2 * 0.7);
        let totalHeight = tempList.reduce((a, b) => {
          return a + b.text.lineHeight;
        }, 0);
        if (totalHeight > d.radius * 2 * 0.7) {
          tempList = tempList.slice(0, 2);
        }
        return tempList;
      })
      .enter()
      .append('tspan')
      .attr('x', (d) => 0)
      .attr('dy', (d) => `${d.text.lineHeight}px`)
      .attr('fill', (d) => d.text.fontColor)
      .attr('font-size', (d) => d.text.fontSize)
      .text((d) => d.formatVal);
  }

  draw () {
    let { size, width, height } = this.config;
    let pack = d3.pack().size([width * size, height * size]);
    let root = d3
      .hierarchy({
        children: this.data
      })
      .sum((d) => {
        return d[this.config.sizeFeature.feature];
      });

    var nodes = pack(root)
      .leaves()
      .map((d, idx) => {
        return {
          x: d.x,
          y: d.y,
          r: d.r,
          color: this.getItemColor(idx, d.value),
          id: 'bubble-circle' + idx,
          radius: d.r,
          value: d.value,
          ...d.data
        };
      });

    this.geometry = this.svg
      .append('g')
      .attr('class', 'bubble-wrap')
      .attr('transform', 'translate(0,0)')
      .selectAll('bubble-circle')
      .data(nodes)
      .enter()
      .append('g')
      .attr('id', (d) => d.id)
      .attr('transform', (d) => `translate(${d.x},${d.y})`);

    this.geometry
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', (d) => d.r)
      .attr('fill', (d) => d.color);
  }
}

export default Bubble;
