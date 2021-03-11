export default (function () {
  function retHeadEle (binding) {
    let head = document.createElement('div');
    head.setAttribute('class', 'update-header');
    let backBtn = document.createElement('div');
    backBtn.setAttribute('class', 'back-btn');
    backBtn.innerHTML = binding.value.updateObj.cancel;
    backBtn.addEventListener('click', () => {
      typeof binding.value.cancelFun === 'function' && binding.value.cancelFun(binding.value.id);
    });
    let updateTime = document.createElement('div');
    updateTime.setAttribute('class', 'update-time');
    let updateTimeLeft = document.createElement('span');
    updateTimeLeft.setAttribute('class', 'h-left');
    updateTimeLeft.innerHTML = binding.value.updateTime;
    updateTime.append(updateTimeLeft);
    let updateTimeRight = document.createElement('span');
    updateTimeRight.setAttribute('class', 'iconfont icon-dbc_clock h-right');
    let rightTitle = document.createElement('span');
    rightTitle.setAttribute('class', 'h-right-title');
    rightTitle.innerHTML = binding.value.updateObj.updateTitle;
    updateTimeRight.append(rightTitle);
    // updateTime.append(updateTimeRight);
    let secondTile = document.createElement('div');
    secondTile.setAttribute('class', 'second-title');
    secondTile.innerHTML = binding.value.updateObj.updateType;
    head.append(backBtn);
    head.append(updateTime);
    head.append(secondTile);
    return head;
  }

  function retBodyEle (binding) {
    let html = '';
    let eleArr = binding.value.updateObj.eleArr;
    eleArr.map(i => {
      html += `<div class="${i.className}" data-id="${i.id}">
      <span class="update-btn">
        <span class="${i.iconName}"></span>
      </span>
      <span class="update-btn-txt">${i.content}</span>
    </div>`;
    });
    let bodyBox = document.createElement('div');
    bodyBox.setAttribute('class', 'update-body');
    bodyBox.addEventListener('click', (event) => {
      let target = event.target;
      let parEle = target.parentElement;
      if (parEle.dataset.id || target.dataset.id) {
        let id = parEle.dataset.id || target.dataset.id;
        typeof binding.value[id] === 'function' && binding.value[id](binding.value.id);
      } else {
        return false;
      }
    });
    bodyBox.innerHTML = html;
    return bodyBox;
  }
  return {
    bind (el, binding) {
      let head = retHeadEle(binding);
      let body = retBodyEle(binding);
      let wrap = document.createElement('div');
      wrap.setAttribute('class', 'update-panel');
      wrap.append(head);
      wrap.append(body);
      wrap.style.display = 'none';
      el.append(wrap);
    },
    update (el, binding) {
      let wrap = el.lastChild;
      //   wrap.style.opacity = binding.value.flag ? '1' : '0';
      wrap.style.display = binding.value.flag ? 'block' : 'none';
    }
  };
}());
