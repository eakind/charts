let getRangeContent = function (element) {
  let doc = element.ownerDocument || element.document;
  let win = doc.defaultView || doc.parentWindow;
  return {
    getContent: function (funName, containerName, offsetName) {
      let range = win.getSelection().getRangeAt(0);
      let preCaretRange = range.cloneRange(); // 克隆一个选中区域
      preCaretRange.selectNodeContents(element); // 设置选中区域的节点内容为当前节点
      // preCaretRange.setEnd(range.endContainer, range.endOffset)  // 重置选中区域的结束位置
      preCaretRange[funName](range[containerName], range[offsetName]);
      let tempElem = preCaretRange.cloneContents();
      return tempElem;
    },
    getCaretPos: function () {
      let x = 0;
      let y = 0;
      var range = win.getSelection().getRangeAt(0);
      var preCaretRange = range.cloneRange(); // 克隆一个选中区域
      let rect = preCaretRange.getClientRects();
      if (rect.length > 0 && rect[0]) {
        x = rect[0].left;
        y = rect[0].top;
      }
      if (x === 0 && y === 0) {
        var span = doc.createElement('span');
        if (span.getClientRects) {
          span.appendChild(doc.createTextNode('\u200b'));
          range.insertNode(span);
          rect = span.getClientRects()[0];
          x = rect.left;
          y = rect.top;
          var spanParent = span.parentNode;
          spanParent.removeChild(span);

          spanParent.normalize();
        }
      }
      return {
        x, y
      };
    }
  };
};
// 字符宽度
let strlen = function (str) {
  var len = 0;
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
    if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
      len++;
    } else {
      len += 2;
    }
  }
  return len;
};
let getTextWidth = function (text, font) {
  // re-use canvas object for better performance
  var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'));
  var context = canvas.getContext('2d');
  context.font = font;
  var metrics = context.measureText(text);
  return metrics.width;
};
export {
  getRangeContent,
  strlen,
  getTextWidth
};
