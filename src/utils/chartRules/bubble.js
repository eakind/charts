
import Pie from './pie.js';

function BubbleRule (target, capsuleType, context) {
  Pie.call(this, target, capsuleType, context);
}
BubbleRule.prototype = Object.create(Pie.prototype);
export default BubbleRule;
