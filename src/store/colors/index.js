import i18n from '@/i18n';
const state = {
  colorsRecentlyUsed: [], // 各处的最近使用颜色
  colorsCustomRecent: [], // 自定义颜色中的最近使用
  colorTemp: [{
    background: '#FFFFFF',
    color: '#6B6B6B'
  }, {
    background: '#E6F0EE',
    color: '#6B6B6B'
  }, {
    background: '#E6F4FE',
    color: '#6B6B6B'
  }, {
    background: '#F8F4E9',
    color: '#6B6B6B'
  }, {
    background: '#F6D7A1',
    color: '#6B6B6B'
  }, {
    background: '#EBDFDB',
    color: '#6B6B6B'
  }, {
    background: '#CDB198',
    color: '#6B6B6B'
  }, {
    background: '#BDC6B9',
    color: '#6B6B6B'
  }, {
    background: '#D3D7E4',
    color: '#6B6B6B'
  },
  {
    background: '#667389',
    color: '#FFFFFF'
  }, {
    background: '#609BBD',
    color: '#FFFFFF'
  }, {
    background: '#DB9595',
    color: '#FFFFFF'
  }, {
    background: '#668971',
    color: '#FFFFFF'
  }, {
    backgroundIcon: require('../../assets/bgicon/bg-icon01.png'),
    background: require('../../assets/bgicon/bg-01.jpg'),
    color: '#FFFFFF'
  }, {
    backgroundIcon: require('../../assets/bgicon/bg-icon02.png'),
    background: require('../../assets/bgicon/bg-02.jpg'),
    color: '#FFFFFF'
  }, {
    backgroundIcon: require('../../assets/bgicon/bg-icon03.png'),
    background: require('../../assets/bgicon/bg-03.png'),
    color: '#FFFFFF'
  }, {
    backgroundIcon: require('../../assets/bgicon/bg-icon04.png'),
    background: require('../../assets/bgicon/bg-04.jpg'),
    color: '#FFFFFF'
  }, {
    backgroundIcon: require('../../assets/bgicon/bg-icon05.png'),
    background: require('../../assets/bgicon/bg-05.jpg'),
    color: '#FFFFFF'
  }, {
    backgroundIcon: require('../../assets/bgicon/bg-icon06.png'),
    background: require('../../assets/bgicon/bg-06.jpg'),
    color: '#FFFFFF'
  }],
  tplList: [
    {
      title: i18n.t('message.standard'), // 标准
      show: true,
      color: [
        '#4284F5',
        '#03B98C',
        '#FACC14',
        '#F5282D',
        '#8543E0',
        '#3FAECC',
        '#3110D0',
        '#E88F00',
        '#DE2393',
        '#91BA38',
        '#99B4BF',
        '#216A58',
        '#AB9438',
        '#F4999B',
        '#C9BFE1',
        '#055166',
        '#1F135A',
        '#43140A',
        '#96005A',
        '#8D8D8D'
      ]
    },
    {
      title: i18n.t('message.business'), // 商务
      show: true,
      color: [
        '#D3E1ED',
        '#52BAD9',
        '#026BDB',
        '#013F81',
        '#E8550C',
        '#6F492A',
        '#328689',
        '#3A3C32',
        '#527F13',
        '#137F7B',
        '#9D8257',
        '#4F6F59',
        '#0E0A18',
        '#8E2728',
        '#135A2F',
        '#E9BC33'
      ]
    },
    {
      title: i18n.t('message.vitality'), // 活力
      show: true,
      color: [
        '#A9AFBA',
        '#097BE5',
        '#F0C808',
        '#F23400',
        '#53BBE7',
        '#FFAE0C',
        '#68B723',
        '#C9009D',
        '#5C53E7',
        '#F27522',
        '#27C974',
        '#01A2BB',
        '#f0c808',
        '#CA2736',
        '#9EB62C',
        '#F867B1',
        '#E14B19',
        '#161616',
        '#F17467',
        '#756C2C'
      ]
    },
    {
      title: i18n.t('message.simple'), // 简朴
      show: true,
      color: [
        '#5E5E5E',
        '#B7A084',
        '#32658B',
        '#87BCDA',
        '#BF9547',
        '#5A4010',
        '#9A9B73',
        '#6C756E',
        '#A26212',
        '#A87A70',
        '#B4A9A0',
        '#A2463E',
        '#A4BAC5',
        '#FACC14',
        '#8543E0',
        '#4284F5',
        '#DABF61',
        '#4E3C44',
        '#F5282D',
        '#345150'
      ]
    },
    {
      title: i18n.t('message.strong'), // 浓烈
      show: true,
      color: [
        '#C1272D',
        '#2B59C3',
        '#66666E',
        '#090446',
        '#FAA916',
        '#0FA3B1',
        '#42113C',
        '#36645D',
        '#eac435',
        '#394648',
        '#8E2728',
        '#104862',
        '#BD5E24',
        '#3C4204',
        '#02453D',
        '#D4487D',
        '#743E2C',
        '#2B91C3',
        '#E37813',
        '#0E0A18'
      ]
    },
    {
      title: i18n.t('message.fresh'), // 清新
      show: true,
      color: [
        '#1B3764',
        '#4AB8B8',
        '#EFA35C',
        '#E7B3B3',
        '#575151',
        '#7DC383',
        '#2D4059',
        '#F8BC91',
        '#B8D1BD',
        '#9B8E9B',
        '#6D9CBA',
        '#ED9D82',
        '#626088',
        '#E5CF62',
        '#C4BD9A',
        '#B0D4D5',
        '#C49A9A',
        '#EB981C',
        '#9EB62C',
        '#F08D7F'
      ]
    },
    {
      title: i18n.t('message.custom'), // 国风
      show: true,
      color: [
        '#e29c45',
        '#c83c23',
        '#eedeb0',
        '#003472',
        '#a78e44',
        '#3d3b4f',
        '#f0c239',
        '#9d2933',
        '#8c4356',
        '#a98175',
        '#486B55',
        '#EF7A82',
        '#725e82',
        '#fcefe8',
        '#739E98',
        '#5C97B5',
        '#75664d'
      ]
    }
  ] // 颜色模板
};

const getters = {
  getColorsRecentlyUsed: state => (max = 7) => state.colorsRecentlyUsed.slice(0, max),
};

const mutations = {
  setColorsRecentlyUsed (state, { color, max = 10 } = {}) {
    if (!color) { return; }
    const list = state.colorsRecentlyUsed;
    const idx = list.indexOf(color);
    // 1. 如果最近使用列表包含当前颜色, 从列表中移除
    if (idx !== -1) {
      list.splice(idx, 1);
    }
    // 2. 将当前颜色放到第一个
    list.unshift(color);
    // 限制数组长度, 避免内存占用过多。重设数组以保证触发DOM更新
    state.colorsRecentlyUsed = list.slice(0, max);
  },
  setColorsCustomRecent (state, { color, max = 14 } = {}) {
    if (!color) { return; }
    const list = state.colorsCustomRecent;
    const idx = list.indexOf(color);
    // 1. 如果最近使用列表包含当前颜色, 从列表中移除
    if (idx !== -1) {
      list.splice(idx, 1);
    }
    // 2. 将当前颜色放到第一个
    list.unshift(color);
    // 限制数组长度, 避免内存占用过多。重设数组以保证触发DOM更新
    state.colorsCustomRecent = list.slice(0, max);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};
