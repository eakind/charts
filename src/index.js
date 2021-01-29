// import Chart from './chart.js';
// const chart = (config) => {
//   const inst = new Chart(config);
//   return inst;
// };

// export { chart };
// export default chart;

import Bubble from './geometry/Bubble.js';
import Scatter from './geometry/Scatter.js';
let drawClasses = { bubble: Bubble, scatter: Scatter };

let GeometryDrawingProcess = function ({ config, data, chartType }) {
  let instance = new drawClasses[chartType](data, config);
  return {
    draw: () => {
      instance.render();
    }
  };
};
export { GeometryDrawingProcess };
export default GeometryDrawingProcess;
