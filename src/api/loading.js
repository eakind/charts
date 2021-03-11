import { Loading } from 'element-ui';
function loadingService () {
  let count = 0;
  let loading = null;
  let timer = null;
  return {
    showLoading () {
      if (count === 0 && !loading) {
        loading = Loading.service({
          lock: true,
          text: '加载中,请稍后',
          background: 'rgba(0, 0, 0, 0.7)',
        });
      }
      count++;
    },
    hideLoading () {
      count -= 1;
      if (timer) {
        clearTimeout(timer);
      }
      count = Math.max(count, 0);
      if (count === 0) {
        timer = setTimeout(() => {
          loading && loading.close();
          loading = null;
        }, 1000);
      }
    },
  };
}
export default loadingService();
