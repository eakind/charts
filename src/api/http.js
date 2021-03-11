import Vue from 'vue';
import axios from 'axios';
import { apiAddr2 } from './config';
import Error from '../plugin/error/index';
import errorCodeObj from '@/i18n/backend.js';
import loadingObj from './loading.js';
let { showLoading, hideLoading } = loadingObj;
Vue.use(Error);
console.log(errorCodeObj);
let { cnBackend, enBackend } = errorCodeObj;
axios.defaults.baseURL = apiAddr2;
axios.defaults.headers = {
  'Content-Type': 'application/json;charset=UTF-8',
};
axios.interceptors.request.use(
  (config) => {
    for (let key in config.params) {
      if (
        config.params[key] === null ||
        config.params[key] === undefined ||
        config.params[key] === ''
      ) {
        if (key !== 'user_id' && key !== 'feature_name') {
          delete config.params[key];
        }
      }
    }
    if (config.method === 'get') {
      config.params.dc_current_time = Date.now();
    }
    // modify by lss 20200619 jwt验证
    let dcUserToken = localStorage.getItem('dcUserToken');
    if (dcUserToken) {
      config.headers.Authorization = dcUserToken;
    }
    if (config.method === 'post') {
      if (config.url.includes('upload-file')) {
        config.headers['Content-Type'] = 'multipart/form-data';
      }
    }
    let showFlag = config.params
      ? !config.params.notShowLoading
      : config.data
        ? !config.data.notShowLoading
        : true;
    if (showFlag) {
      showLoading();
    } else {
      config.params && delete config.params.showLoading;
      config.data && delete config.data.showLoading;
    }

    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);
axios.interceptors.response.use(
  (response) => {
    hideLoading();
    if (response.status === 200) {
      if (typeof response.data === 'object') {
        if (response.data.code === 0) {
          return response.data;
        } else {
          let resObj = response.data;
          return {
            code: resObj.code,
            cnMsg: cnBackend[resObj.code],
            enMsg: enBackend[resObj.code],
          };
        }
      } else {
        // eslint-disable-next-line no-eval
        return eval('(' + response.data + ')');
        // return {};
      }
    } else if (response.status === 401 || response.status === 403) {
      sessionStorage.clear();
      window.location.href = '/dist-dcee/#/';
    }
  },
  (error) => {
    hideLoading();
    if (error.response) {
      let txt = '';
      switch (error.response.status) {
        case 401:
          txt = '当前登录用户已过期，请重新登录';
          Vue.prototype.$message({
            type: 'error',
            message: txt,
          });
          setTimeout(() => {
            sessionStorage.clear();
            window.location.href = '/dist-dcee/#/';
          }, 1000);
          break;
        case 500: {
          txt = '系统错误，请联系管理员处理';
          Vue.prototype.$showAlert({
            type: 'info',
            message: txt,
            confirmButtonText: '知道了',
          });
          break;
        }
        case 504: {
          txt = '系统错误，请联系管理员处理';
          Vue.prototype.$showAlert({
            type: 'info',
            message: txt,
            confirmButtonText: '知道了',
          });
          break;
        }
      }
    } else {
      let txt = '系统错误，请联系管理员处理';
      Vue.prototype.$showAlert({
        type: 'info',
        message: txt,
        confirmButtonText: '知道了',
      });
    }
    return Promise.reject(error);
  }
);
Vue.prototype.$axios = axios;
