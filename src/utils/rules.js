import pie from './chartRules/pie.js';
import bubble from './chartRules/bubble.js';
import table from './chartRules/table.js';
import scatter from './chartRules/scatter.js';
import bar from './chartRules/bar.js';
import line from './chartRules/line.js';
import map from './chartRules/map.js';
import barRotated from './chartRules/barRotated.js';
import barLine from './chartRules/barLine.js';
window.pie = pie;
window.bubble = bubble;
window.table = table;
window.scatter = scatter;
window.bar = bar;
window.map = map;
window.line = line;
window['bar-rotated'] = barRotated;
window['bar-line'] = barLine;
/**
 * target 目标对象
 * capsuleType 胶囊类型
 * chartType 图表类型
 * context 上下文 vue 实例
 * @param {*} param0
 */
function rules ({ target, capsuleType, chartType, context, legend }) {
  console.log(chartType);
  let instance = new window[chartType](target, capsuleType, context, legend);
  return {
    command: (...args) => {
      return instance.draggingTipsFlag(args);
    },
    swapFeature: (...args) => {
      return instance.swapSingleFeature(args);
    }
  };
}
export default rules;
