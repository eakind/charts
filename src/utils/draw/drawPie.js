import {
  getBaseConfig,
  getColorSizeLabel,
  chartStyleProcessFun
} from './baseConfig';
import { isDefined, notEmpty, isEmpty } from '../check';

let drawPieObj = function ({
  canvasCss,
  data,
  containerSize,
  chartSize,
  ids,
  featureList,
  type,
}) {
  let baseConfig = getBaseConfig(canvasCss);
  /**
   * 设置画布大小
   */
  function setCanvasSize () {
    baseConfig.bindto = `#${ids}`;
    baseConfig.container = containerSize;
    baseConfig.size = chartSize;
  }
  /**
   * 设置数据
   */
  function setCanvasData () {
    baseConfig.data.json = data;
    baseConfig.data.type = type;
  }
  /**
   * 设置颜色
   */
  function setColorRange () {
    let temp_list = notEmpty(canvasCss.colors_and_opacities_list)
      ? canvasCss.colors_and_opacities_list
      : [];
    baseConfig.color.schemes = temp_list.map((c) => c.schemes);
    baseConfig.color.opacity = temp_list.map((c) => c.opacity / 100);
    let colors = notEmpty(canvasCss.colors)
      ? canvasCss.colors.filter((c) => c.colorList).map((c) => c.colorList)
      : [];
    baseConfig.color.colors = colors;
    baseConfig.data.range.color = notEmpty(canvasCss.colorRanges)
      ? canvasCss.colorRanges.map((c) => c.range)
      : [];
    baseConfig.data.range.size = notEmpty(canvasCss.sizeRanges)
      ? canvasCss.sizeRanges.map((c) => c.range)
      : [];
  }
  /**
   * 设置标签颜色大小
   */
  let labeled = [];
  let sized = {};
  let colored = {};

  function setColorSizeLabelData () {
    let label =
      featureList.labels ||
      featureList.label ||
      featureList.text ||
      canvasCss.labeled;
    let color = featureList.color;
    let size = featureList.size;
    colored = isDefined(color) ? getColorSizeLabel('color', color, [], []) : {};
    if (isDefined(canvasCss.labeled) && canvasCss.labeled.length) {
      labeled = canvasCss.labeled.map((el) => ({
        feature: el,
      }));
    } else {
      labeled = isDefined(label) ? getColorSizeLabel('label', label) : [];
    }
    sized = isDefined(size) ? getColorSizeLabel('size', size) : {};
    let labels = labeled
      .map((i) => {
        if (type === 'pie') {
          if (canvasCss.originalChecked) {
            return i.feature;
          } else {
            return i.feature === sized.feature ? '' : i.feature;
          }
        } else {
          return i.feature;
        }
      })
      .filter((i) => i);
    sized = isDefined(size) ? getColorSizeLabel('size', size) : {};
    baseConfig.data.sized = sized;
    baseConfig.data.colored = colored;
    featureList.labels && baseConfig.data.labeled.push(...labels);
    /**
     * `${size.legend.toLowerCase()}${
              size.legend === 'PERCENTILE' ? size.probability : ''
            }(${size.feature_name ? size.feature_name : size.name}) percent`
     */
    if (canvasCss.checked) {
      baseConfig.data.labeled.unshift(
        size.formulaType || size.dtype === 'CAT'
          ? sized.feature + ' percent'
          : `${sized.feature} percent`
      );
      if (
        baseConfig.label.format.length === 0 ||
        baseConfig.label.format[0].list.length === 0
      ) {
        baseConfig.label.format = [
          {
            list: [
              {
                format: {
                  decimal: '2',
                  prefix: '',
                  selectFormat: 'percent',
                  suffix: '%',
                },
              },
            ],
          },
        ];
      } else if (
        baseConfig.label.format[0].list.length < baseConfig.data.labeled.length
      ) {
        baseConfig.label.format[0].list.unshift({
          format: {
            decimal: '2',
            prefix: '',
            selectFormat: 'percent',
            suffix: '%',
          },
        });
      }
    }
    /**
     * `${size.legend.toLowerCase()}${
        size.legend === 'PERCENTILE' ? size.probability : ''
      }(${size.feature_name ? size.feature_name : size.name}) percent`;
     */
    if (!canvasCss.tooltipNumberFormat) {
      let feature = sized.feature;
      baseConfig.tooltip.format[feature] = {
        decimal: 2,
        prefix: '',
        selectFormat: 'percent',
        suffix: '%',
      };
    }

    return baseConfig;
  }

  // 获取提示框数据
  function getTooltipList () {
    let tooltipList = [];
    notEmpty(sized) &&
      tooltipList.push({
        type: 'linear',
        feature: sized.feature,
      });
    notEmpty(colored) &&
      tooltipList.push({
        type: colored.type,
        feature: colored.feature,
      });
    labeled.forEach((l) => {
      tooltipList.push({
        type: l.type,
        feature: l.feature,
      });
    });
    if (type === 'pie') {
      tooltipList.push({
        type: 'linear',
        feature: `${sized.feature} percent`,
        isPercent: true,
      });
    }

    let uniqueList = [];
    tooltipList.forEach((t) => {
      let exit = uniqueList.filter((old) => old.feature === t.feature);
      if (isEmpty(exit)) {
        uniqueList.push(t);
      }
    });
    return uniqueList;
  }
  /**
   *
   * @param {获取styles} ins
   */
  function getStyles (ins) {
    let list = [];
    let size = [];
    list = list.concat(ins.getColorList());
    size = size.concat(ins.getSizeList());
    list.forEach((c) => {
      c.list.forEach((l) => {
        l.id = c.id;
        l.aggr = c.aggr;
        l.type = c.type;
        l.key_id = c.key_id;
      });
    });
    let obj = {
      colors: list,
      sizes: size,
      ids: ids,
    };
    return obj;
  }
  return {
    setCanvasSize,
    setCanvasData,
    setColorSizeLabelData,
    getTooltipList,
    getStyles,
    setColorRange,
  };
};
let drawPie = function ({
  canvasCss,
  data,
  containerSize,
  chartSize,
  ids,
  featureList,
  type = 'pie',
}) {
  let drawPieFun = drawPieObj({
    canvasCss,
    data,
    containerSize,
    chartSize,
    ids,
    featureList,
    type,
  });
  // 设置画布大小
  drawPieFun.setCanvasSize();
  // 设置画布数据
  drawPieFun.setCanvasData();
  // 右边栏
  drawPieFun.setColorRange();
  // 设置颜色大小label
  let baseConfig = drawPieFun.setColorSizeLabelData();
  // 画图
  let ins = mc.generate(baseConfig);

  // 获取tooltipsList

  let tooltipList = drawPieFun.getTooltipList();
  // 获取style
  let styles = drawPieFun.getStyles(ins);
  return {
    ins,
    tooltipList,
    styles,
  };
};

let pieDrawingChartStyleProcess = function ({
  featureList,
  canvasCss,
  chartType,
}) {
  let obj = {};
  let funObj = chartStyleProcessFun(featureList, canvasCss, chartType);

  // 处理颜色
  let colorObj = funObj.colorListProcess();

  obj.colorList = colorObj.color;
  obj.colorOpacity = colorObj.opacity;

  // 处理标签
  obj.labelsList = funObj.labelsProcess() || [];
  // 处理tooltip

  obj.tooltipList = funObj.tooltipProcess();

  let { sized, labeled, colored } = funObj.features();

  obj.sizeFeature = sized;
  obj.labelFeature = labeled;
  obj.colorFeature = colored;

  let referTo = !canvasCss.innerRadius ? 120 : 100;
  obj.size =
    ((canvasCss.size ? canvasCss.size : 70) * 0.85) / referTo.toFixed(2);
  obj.innerRadius = canvasCss.innerRadius;

  return obj;
};

export { drawPie, pieDrawingChartStyleProcess };
