import axios from 'axios';
import './http';
import { api } from './api';
export const post = (path, param) => axios.post(api[path], param);

export const get = (path, param) => axios.get(api[path], { params: param });

export const download = (path, param, name) => axios({
  params: param,
  method: 'get',
  data: param,
  url: api[path],
  responseType: 'arraybuffer'
}).then(res => {
  if (res.code) {
    return res;
  } else {
    const fileName = `${name}.csv`;
    const blob = new Blob([res]);
    const url = window.URL.createObjectURL(blob);
    let dom = document.createElement('a');
    dom.style.display = 'none';
    dom.href = url;
    dom.setAttribute('download', fileName);
    document.body.appendChild(dom);
    dom.click();
    return {};
  }
});

export const downloadData = (path, params) => {
  const apis = axios.getUri({
    url: axios.defaults.baseURL + api[path],
    params
  });
  let dcUserToken = localStorage.getItem('dcUserToken');
  const a = document.createElement('a');
  a.href = apis + '&Authorization=' + dcUserToken;
  a.click();
  a.remove();
};
