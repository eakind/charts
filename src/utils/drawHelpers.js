import store from '@/store/index';

// input feature name
// returns feature type: int 数值特征, cat 分类特征
function judgeFeatureType (name) {
  const numList = store.state.dashboard.numList;
  let flag = 'cat';
  for (let i = 0; i < numList.length; i++) {
    if (name === numList[i].feature_name) {
      flag = 'int';
    }
  }
  return flag;
}

export { judgeFeatureType };
