const ENV = process.env.http_env;

let apiAddr = 'http://localhost:3001';
let apiAddr2 = ''; // 'http://192.168.1.201:8084';
let wsAddr = 'ws://192.168.1.201:8084';
let apiAddr3 = 'http://localhost:8080';
let time = 0;

if (ENV === 'production') {
  // apiAddr2 = 'http://192.168.1.201'
  apiAddr2 = '';
  wsAddr = 'ws://192.168.1.201';
} else if (ENV === 'hk') {
  apiAddr2 = 'https://bi.datacube.hk';
  wsAddr = 'wss://bi.datacube.hk';
  apiAddr3 = 'https://bi.datacube.hk';
}

export {
  apiAddr,
  apiAddr2,
  wsAddr,
  apiAddr3,
  time
};
