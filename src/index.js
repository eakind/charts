import Bubble from './geometry/Bubble.js';
import Scatter from './geometry/Scatter.js';
import Map from './chart/map.js';
import Bar from './chart/bar.js';
import Line from './chart/line.js';
import barLine from './chart/barLine.js';
import barRotated from './chart/barRotated.js';

let drawClasses = {
  bubble: Bubble,
  scatter: Scatter,
  map: Map,
  bar: Bar,
  line: Line,
  barLine: barLine,
  barRotated: barRotated
};

let GeometryDrawingProcess = function ({ config, data, chartType }) {
  let instance = new drawClasses[chartType](data, config);
  let timer = null;
  console.log('!!!!');
  window.addEventListener('resize', () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      if (instance) {
        instance = null;
        document.querySelector(`#${config.id}`).innerHTML = '';
      }
      debugger;
      instance = new drawClasses[chartType](data, config);
    }, 300);
  });
  return {
    draw: () => {
      instance.render();
    },
    update: (type, data) => {
      instance.update(type, data);
    },
    getColorList: () => {
      return instance.getColorList();
    }
  };
};

export { GeometryDrawingProcess };
export default GeometryDrawingProcess;
