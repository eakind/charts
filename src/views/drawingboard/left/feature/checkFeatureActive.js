const checkFeatureActive = (list, idx) => {
  for (let i = 0; i < list.length; i++) {
    if (!list[i]) {
      return false;
    }
    if (list[i].left || list[i].right) {
      if (checkList(list[i].left, idx)) {
        return true;
      }
      if (checkList(list[i].right, idx)) {
        return true;
      }
    } else {
      if (list[i].feature_idx === idx) {
        return true;
      }
      if (checkList(list[i].labels, idx)) {
        return true;
      }
      if (checkList(list[i].color, idx)) {
        return true;
      }
    }
  }
  return false;
};

const checkList = (list, idx) => {
  if (!list) return false;
  if (!Array.isArray(list)) {
    return list.feature_idx === idx;
  }
  for (let i = 0; i < list.length; i++) {
    if (!list[i]) {
      return false;
    }
    if (list[i].feature_idx === idx) {
      return true;
    }
    if (checkList(list[i].labels, idx)) {
      return true;
    }
    if (checkList(list[i].color, idx)) {
      return true;
    }
  }
  return false;
};

export {
  checkFeatureActive
};
