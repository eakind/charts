const initTooltip = () => {
  let dom = document.querySelector('#tooltipChart');
  if (!dom) {
    dom = document.createElement('div');
    let styleStr1 = 'position: fixed;min-width: 120px;padding:8px;background-color:white;font-size:14px;color:#424242;';
    let styleStr2 = 'border-radius:4px;box-shadow:rgba(0, 0, 0, 0.4) 0px 1px 3px;transfrom:translateX(-50%)';
    dom.id = 'tooltipChart';
    dom.style.cssText = styleStr1 + styleStr2;
    document.body.appendChild(dom);
  }
  return dom;
};

const setContent = (dataObj) => {
  let content = '';
  for (let key in dataObj) {
    content += `<div>
                  <span>${key}：</span><span>${dataObj[key]}</span>
                </div>`;
  }
  return content;
};

const showTooltip = (dataObj) => {
  let clientLeft = d3.event.clientX;
  let clientTop = d3.event.clientY;
  let dom = document.querySelector('#tooltipChart');
  dom.style.display = 'inline-block';
  dom.innerHTML = setContent(dataObj);
  let domWidth = dom.clientWidth / 2;
  let domHeight = dom.clientHeight + 10;
  dom.style.left = `${clientLeft - domWidth}px`;
  dom.style.top = `${clientTop - domHeight}px`;
  if (clientTop < domHeight) {
    dom.style.top = `${clientTop + 10}px`;
  };
  if (clientLeft < domWidth) {
    dom.style.left = `${clientLeft}px`;
  };
};

const hideTooltip = () => {
  let dom = document.querySelector('#tooltipChart');
  dom.innerHTML = '';
  dom.style.display = 'none';
};

export {
  initTooltip,
  showTooltip,
  hideTooltip
};
