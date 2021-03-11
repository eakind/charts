import { delayFunc } from '@/utils/utils';
import { post } from '@/api/server';
/**
 * @param { Bool } fixedWH 大小不随数据发生变化
 */
function getSize (parent, view_mode, chartArrs, fixedWH, chartType) {
  if (!parent) { return { chartSize: {}, containerSize: {} }; }

  let containerWidth = parent.offsetWidth - 20; // 距离右侧有一些距离
  let containerHeight = parent.offsetHeight - 50; // 留点位置给画布标题和滚动条

  let size = {};
  let width = containerWidth;
  let height = containerHeight;
  if (fixedWH) {
    if (view_mode === 'standard') {
      size = { width: width / 2, height: height * 4 / 5 };
    } else if (view_mode === 'fitWidth') {
      size = { width: width, height: height * 4 / 5 };
    } else if (view_mode === 'fitHeight') {
      size = { width: width / 2, height: height };
    } else {
      size = { width: width, height: height };
    }
  } else {
    let setType = {
      bar: true,
      line: true,
      'bar-line': true,
      'bar-rotated': false
    };
    if (view_mode === 'full') {
      if (setType[chartType]) {
        size.width = width;
        height /= chartArrs.length;
        size.height = height;
      } else {
        size.width = width / chartArrs.length;
        size.height = height;
      }
    } else if (view_mode === 'fitWidth') {
      if (setType[chartType]) {
        // width /= chartArrs.length;
        size.width = width - 50;
      } else {
        width /= chartArrs.length;
        size.width = width - 10;
      }
    } else if (view_mode === 'fitHeight') {
      if (setType[chartType]) {
        height /= chartArrs.length;
        size.height = height;
      } else {
        size.height = height;
      }
    }
    console.log(size);
  }
  return {
    chartSize: size,
    containerSize: {
      width: containerWidth,
      height: containerHeight
    }
  };
}

const modifyCss = delayFunc(
  async function _modifyCss ({ projectId, canvasCss }) {
    if (!canvasCss.worksheetId) return;
    let param = {
      project_id: projectId,
      worksheet_id: canvasCss.worksheetId,
      css: canvasCss,
      notShowLoading: true
    };
    let res = await post('modifyCss', param);
    if (!res) {
      console.log('上一个画布的样式保存失败！');
    }
  },
  30
);
const formatOneNumber = function (format, type, $i18n) {
  let negativeList = ['-1234', '(1234)', '1234-'];
  let unitList = [
    '',
    `K ${$i18n.t('message.thousand')}`,
    `M ${$i18n.t('message.million')}`,
    `G ${$i18n.t('message.billion')}`,
    `T ${$i18n.t('message.myriads')}`
  ];
  let areaList = [
    '',
    `¥ ${$i18n.t('message.rmb')}`,
    `￥ ${$i18n.t('message.jpy')}`,
    `HK$ ${$i18n.t('message.hkd')}`,
    `＄ ${$i18n.t('message.usd')}`,
    `€ ${$i18n.t('message.euro')}`,
    `£ ${$i18n.t('message.gbp')}`
  ];
  let negativeCode = [-1, 0, 1];
  let unitCode = ['', 'K', 'M', 'G', 'T'];
  let areaCode = ['', 'CN', 'JP', 'HK', 'US', 'EUR', 'GBP'];

  let obj = JSON.parse(JSON.stringify(format));
  if (format.selectFormat === 'currency') {
    if (type === 0) {
      format.zone = areaCode.indexOf(obj.zone) >= 0 ? obj.zone : areaCode[areaList.indexOf(obj.zone)];
      format.unit = unitList.indexOf(obj.unit) >= 0 ? obj.unit : unitCode[unitList.indexOf(obj.unit)];
    } else {
      format.zone = areaCode.indexOf(obj.zone) >= 0 ? obj.zone : areaList[areaCode.indexOf(obj.zone)];
      format.unit = unitList.indexOf(obj.unit) >= 0 ? obj.unit : unitList[unitCode.indexOf(obj.unit)];
    }
  }
  if (format.selectFormat === 'digit' || format.selectFormat === -1) {
    if (type === 0) {
      format.unit = unitCode[unitList.indexOf(obj.unit)];
    } else {
      format.unit = unitList[unitCode.indexOf(obj.unit)];
    }
  }
  if (type === 0) {
    format.negative = negativeCode[negativeList.indexOf(obj.negative)];
  } else {
    format.negative = negativeList[negativeCode.indexOf(obj.negative)];
  }

  return format;
};

// 更改所有label的文字样式
const defaultLabelStyle = {
  align: 'right',
  decoration: 'none',
  fontColor: '#6B6B6B',
  fontSize: 12,
  fontStyle: '',
  letterSpacing: '0',
  lineHeight: '24'
};
function changeAllLabelsStyle (settings, labelsNum, params = {}) {
  let stylesForFill = Object.assign({}, defaultLabelStyle, params);
  const formatLen = labelsNum || 1;
  let settingsList = settings;
  if (settingsList?.length) {
    settingsList.forEach((setting, settingIdx) => {
      const formatList = setting.list;
      while (formatList.length > formatLen) {
        formatList.pop();
      }
      for (let i = 0; i < formatLen; i++) {
        const format = formatList[i]?.format;
        if (i === 0 && settingIdx === 0) {
          stylesForFill = { ...format, ...params };
        }
        if (format) {
          formatList[i].format = stylesForFill;
        } else {
          formatList[i] = {
            format: stylesForFill,
          };
        }
      }
    });
  } else {
    const formatList = Array(formatLen).fill(
      {
        format: stylesForFill
      },
    );
    settingsList = [
      {
        list: formatList,
      }
    ];
  }
  return settingsList;
}

const setCanvasColor = (axisStyle, textSettings, color) => {
  if (!color) return;
  let axisList = axisStyle.axisList || [];
  let fontList = axisStyle.fontList || [];
  let gridStyle = axisStyle.grid_style || {};
  let scaleList = axisStyle.scaleList || [];
  setListColor(axisList, color, true);
  setListColor(fontList, color);
  setListColor(gridStyle, color);
  setListColor(scaleList, color);

  if (!textSettings) return;
  for (let i = 0; i < textSettings.length; i++) {
    let list = textSettings[i].list || [];
    for (let j = 0; j < list.length; j++) {
      if (list[j].format) {
        list[j].format.fontColor = color;
      }
    }
  }

  function setListColor (list, color, flag) {
    for (let i = 0; i < list.length; i++) {
      if (flag) {
        if (color !== '#c2c9d1') {
          list[i].color = '#c2c9d1';
        }
      } else {
        list[i].color = color;
      }
    }
  }
};

export {
  getSize,
  modifyCss,
  formatOneNumber,
  changeAllLabelsStyle,
  setCanvasColor
};
