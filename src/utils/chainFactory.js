function ChainFactory (fn) {
  this.fn = fn;
  this.next = null;
}
ChainFactory.prototype = {
  constructor: ChainFactory,
  setNext: function (next) {
    this.next = next;
    return next;
  },
  // 开始执行
  start: function () {
    return this.fn.apply(this, arguments);
  },
  toNext: function () {
    if (this.next) {
      return this.start.apply(this.next, arguments);
    }
  }
};
export default ChainFactory;
