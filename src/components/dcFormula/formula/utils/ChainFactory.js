function ChainItem (fn) {
  this.fn = fn;
  this.next = null;
}
ChainItem.prototype = {
  constructor: ChainItem,
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
export {
  ChainItem,
};
