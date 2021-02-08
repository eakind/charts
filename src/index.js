import Bubble from './geometry/Bubble.js';
import Scatter from './geometry/Scatter.js';
import Map from './chart/map.js';
import Bar from './chart/bar.js';

let drawClasses = {
  bubble: Bubble,
  scatter: Scatter,
  map: Map,
  bar: Bar
};

let GeometryDrawingProcess = function ({ config, data, chartType }) {
  let instance = new drawClasses[chartType](data, config);
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
