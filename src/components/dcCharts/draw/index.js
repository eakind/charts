import pie from './chart/pie.js';
import bubble from './chart/bubble.js';
import scatter from './chart/scatter.js';
import map from './chart/map.js';
import table from './chart/table.js';
let drawClasses = {};
drawClasses.pie = pie;
drawClasses.bubble = bubble;
drawClasses.scatter = scatter;
drawClasses.map = map;
drawClasses.table = table;

function GeometryDrawingProcess (chartType, data, config, ...arg) {
  let instance = new drawClasses[chartType](data, config);
  return {
    draw: () => {
      instance.draw();
    },
    chartUpdate: (type, newData) => {
      instance.chartUpdate(type, newData);
    },
    getColorList: () => {
      return instance.getColorList();
    },
    getDomain () {
      return instance.getDomain();
    }
  };
}

export default GeometryDrawingProcess;
