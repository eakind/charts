import right from './dashboard/right';
import left from './dashboard/left';
import middle from './dashboard/middle';
export default {
  cnDashboard: Object.assign({}, right.cnRight, left.cnLeft, middle.cnMiddle),
  enDashboard: Object.assign({}, right.enRight, left.enLeft, middle.enMiddle)
};
