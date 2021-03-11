import {
  isEmpty,
  notEmpty,
  isArray,
  isDefined,
  isString,
  extend,
  dcDeepClone,
  isFunction,
  inArray,
} from './check.js';
import { judgeFeatureType } from './drawHelpers';
import {
  generateMultiMeasuresData,
  generateCmpData,
} from './funnelDataHelpers.js';

const draw = function ({
  data,
  feature_list,
  chart_type,
  ids,
  canvasCss,
  chart_size,
  container,
  scale = 1,
  mapChange,
  zoomPanning,
}) {
  // console.log('drawInitConfig\n', JSON.stringify(arguments[0])); // eslint-disable-line
  let init = initChart({
    chart_type,
    feature_list,
    canvasCss,
  });

  init.checkSize(chart_size);
  let table_title_list = init.getCatAndAggrs().table_title_list;

  let { json_data } = init.getAllData(data);
  if (isEmpty(json_data)) return 'no data!';
  init.getKeys();

  init.getColorSizeLabelData();

  let { unique_list, uniqueName: pieTooltip } = init.getTooltipData();
  // console.log('rawConfig\n', JSON.stringify({ canvasCss, container, scale, mapChange, zoomPanning, ids }));
  let configs = init.updateConfigByCache({
    canvasCss,
    container,
    scale,
    mapChange,
    zoomPanning,
    ids,
  });
  configs.forEach((i) => {
    i.config.tooltip.name = pieTooltip;
    i.config.table.bgCss = canvasCss.bgCss;
  });
  // console.log('drawConfigs\n', JSON.stringify(configs));
  let ins = drawWithoutConfig({
    configs: configs,
    tooltip_list: unique_list,
    table_title_list,
  });

  return ins;
};

function initChart ({ chart_type, feature_list, canvasCss }) {
  let isRotated = chart_type === 'bar-rotated';
  let isScatter = chart_type === 'scatter';
  let isBarLineType = [
    'bar',
    'line',
    'bar-line',
    'bar-rotated',
    'scatter',
  ].includes(chart_type);
  let isMap = chart_type === 'map';
  let isPie = chart_type === 'pie';
  let isFunnel = chart_type === 'funnel';
  let isBarLine = chart_type === 'bar-line';
  let isArea = chart_type === 'area';
  let multi_aggr = ['bar', 'line', 'bar-line', 'bar-rotated'].includes(
    chart_type
  );
  let hasLocationData = false;

  let x_list = isRotated ? feature_list.y : feature_list.x || [];
  let aggr_list = isRotated ? feature_list.x : feature_list.y || [];
  let y_cat_list = isBarLine
    ? aggr_list.filter((a) => a.level === 0)
    : aggr_list.filter((a) =>
      isDefined(a.feature) ? !isDefined(a.feature.legend) : null
    );
  let y_aggr_list = aggr_list.filter((a) => !inArray(y_cat_list, a));
  let label =
    feature_list.labels ||
    feature_list.label ||
    feature_list.text ||
    canvasCss.labeled;
  let color = feature_list.color;
  let size = feature_list.size;
  let areas = isDefined(feature_list.area)
    ? feature_list.area.map((v) => v.name)
    : [];

  let basicConfig = getBasicConfig(canvasCss);
  basicConfig.data.type =
    chart_type === 'bar' || isRotated ? 'bar' : chart_type;
  if (isBarLineType) {
    basicConfig.axis.rotated = isRotated;
  }

  let columnCat = [];
  let columnAggr = [];
  let rowCat = [];
  let rowAggr = [];
  let chart_keys = [];
  let json_data = [];
  let dataList = [];
  let colored = {};
  let labeled = [];
  let sized = {};

  function checkSize (chart_size) {
    if (!isEmpty(chart_size)) {
      if (+chart_size.width <= 0 || +chart_size.height <= 0) {
        return 'chart size is illegal';
      }
    }
    basicConfig.size = chart_size;
  }

  function getAllData (data) {
    if (isMap) {
      let res_d = data.data;
      // let res_l = data.location || []; // 经纬度没有location data
      // let last_cat = areas[areas.length - 1];
      // let second_last_cat = areas.length > 1 ? areas[areas.length - 2] : null;

      hasLocationData = true; // isEmpty(res_l);
      basicConfig.map.showLatLong = hasLocationData;
      json_data = res_d;
      // json_data = res_d.map(v => {
      //   res_l.forEach(c => {
      //     let v1 = (isDefined(v[last_cat]) && typeof (v[last_cat]) === 'string') ? v[last_cat].trim() : v[last_cat];
      //     let v2 = (isDefined(c[last_cat]) && typeof (c[last_cat]) === 'string') ? c[last_cat].trim() : c[last_cat];
      //     let v3 = 1;
      //     let v4 = 1;
      //     if (second_last_cat !== null && isDefined(v[second_last_cat]) && isDefined(c[second_last_cat])) {
      //       v3 = typeof (v[second_last_cat]) === 'string' ? v[second_last_cat].trim() : v[second_last_cat];
      //       v4 = typeof (c[second_last_cat]) === 'string' ? c[second_last_cat].trim() : c[second_last_cat];
      //     }

      //     if (v1 === v2 && v3 === v4) {
      //       v.latitude = c.latitude;
      //       v.longitude = c.longitude;
      //     }
      //   });
      //   return v;
      // }).filter(d => {
      //   return isDefined(hasLocationData ? d[areas[1]] : d.latitude) && isDefined(hasLocationData ? d[areas[0]] : d.longitude);
      // });
    } else if (isBarLineType) {
      data.forEach((d) => {
        let list = [];
        if (isArray(d)) {
          let flag = false;
          d.forEach((dd) => {
            if (isArray(dd)) {
              json_data = json_data.concat(dd);
              list.push(dd);
            } else {
              json_data.push(dd);
              flag = true;
            }
          });
          if (flag) {
            list.push(d);
          }
        } else if (d.left || d.right) {
          d.left.forEach((l) => {
            json_data = json_data.concat(l);
            list.push(l);
          });
          d.right.forEach((l) => {
            json_data = json_data.concat(l);
            list.push(l);
          });
        } else if (d.feature) {
          json_data = json_data.concat(d.feature);
          list.push(d.feature);
        }

        if (isScatter) {
          json_data.push(d);
          list = [data];
        }

        dataList.push(list);
      });
    } else if (isFunnel) {
      const { x, y, cmp, 'cmp-groups': cmpGroups } = feature_list;
      if (!y || !y.length) {
        // Do not render, feature y needed
      } else if (cmp && cmp.name) {
        const { new_data, cmp_data } = generateCmpData({
          x,
          y,
          cmp,
          cmpGroups,
          data,
        });
        json_data = new_data;
        basicConfig.data.compare = cmp_data;
      } else if (!x.length && y.length) {
        json_data = generateMultiMeasuresData({
          y,
          data,
        });
      } else {
        json_data = data;
      }
    } else if (isArea) {
      json_data = data;
      dataList = data;
    } else {
      json_data = data;
    }

    basicConfig.data.json = json_data;
    return {
      json_data,
      dataList,
    };
  }

  function getCatAndAggrs () {
    if (chart_type === 'map') {
      columnAggr = ['latitude'];
      rowAggr = ['longitude'];
      // if (hasLocationData) {
      //   columnAggr = [areas[1]];
      //   rowAggr = [areas[0]];
      // } else {
      //   columnAggr = ['latitude'];
      //   rowAggr = ['longitude'];
      // }
    } else if (chart_type === 'funnel') {
      // do nothing
    } else if (chart_type === 'area') {
      x_list.forEach((f) => {
        let f_name = modifyAggrFeature(f);
        if (f.legend) {
          rowAggr.push([f_name]);
          columnCat.push(`${f.name}-DUMMY`);
        }
      });
    } else {
      // table 特有的请求格式
      if (isDefined(feature_list.col)) {
        feature_list.col.forEach((f, i) => {
          let f_name = modifyAggrFeature(f);
          let f_feature = isDefined(f.feature) ? f.feature : f;
          if (isDefined(f_feature.legend)) {
            columnAggr.push(f_name);
          } else {
            // if(i === feature_list.col.length-1 && notEmpty(columnAggr)) basicConfig.data.column.catFirst = false
            if (isArray(f_name)) f_name.forEach((c) => columnCat.push(c));
            else columnCat.push(f_name);
          }
        });
      }
      // table 特有的请求格式
      if (isDefined(feature_list.row)) {
        feature_list.row.forEach((f, i) => {
          let f_name = modifyAggrFeature(f);
          let f_feature = isDefined(f.feature) ? f.feature : f;
          if (isDefined(f_feature.legend)) {
            rowAggr.push(f_name);
          } else {
            // if(i === feature_list.row.length-1 && notEmpty(rowAggr)) basicConfig.data.row.catFirst = false
            if (isArray(f_name)) f_name.forEach((c) => rowCat.push(c));
            else rowCat.push(f_name);
          }
        });
      }

      y_cat_list.forEach((f) => {
        let f_name = modifyAggrFeature(f);
        if (isArray(f_name)) f_name.forEach((c) => rowCat.push(c));
        else rowCat.push(f_name);
      });

      x_list.forEach((f) => {
        let f_feature = isDefined(f.feature) ? f.feature : f;
        let { name, percent } = modifyAggrFeature(f_feature, true);

        if (isDefined(f_feature.legend)) {
          // scatter 特有请求格式
          columnAggr.push(isBarLineType ? [name] : name);
          basicConfig.axis.x.percent = percent;
        } else {
          if (isArray(name)) name.forEach((c) => columnCat.push(c));
          else columnCat.push(name);
        }
      });
    }

    basicConfig.data.row.categories = rowCat;
    basicConfig.data.column.categories = columnCat;
    basicConfig.data.column.aggressions = columnAggr;
    basicConfig.data.row.aggressions = JSON.parse(JSON.stringify(rowAggr));

    let table_title_list = [];
    if (chart_type === 'table') {
      let column_name = notEmpty(columnCat) ? [columnCat.join(' / ')] : [];
      if (notEmpty(columnAggr) || notEmpty(rowAggr)) {
        basicConfig.data.labeled = [];
        table_title_list = [
          ...columnAggr,
          ...column_name,
          ...rowAggr,
          ...rowCat,
        ];
      } else {
        table_title_list = [...column_name, ...rowCat];
      }
    }

    return {
      columnCat,
      rowCat,
      columnAggr,
      rowAggr,
      table_title_list: table_title_list,
    };
  }

  function getColorSizeLabelData () {
    // 获取颜色，标签，大小数据
    colored = isDefined(color)
      ? getColorSizeLabel('color', color, columnCat, rowCat)
      : {};
    if (isDefined(canvasCss.labeled) && canvasCss.labeled.length) {
      labeled = canvasCss.labeled.map((el) => ({ feature: el }));
    } else {
      labeled = isDefined(label) ? getColorSizeLabel('label', label) : [];
    }
    if (!isFunnel) {
      sized = isDefined(size) ? getColorSizeLabel('size', size) : {};
    } else if (isFunnel) {
      // 设置funnel的sized和labeled
      const {
        x,
        y,
        cmp,
        // eslint-disable-next-line no-unused-vars
        'cmp-groups': cmpGroups,
      } = feature_list;
      if (!x.length && y.length) {
        sized = {
          feature: 'value',
        };
        colored = {
          feature: 'name',
        };
      } else {
        const size = aggr_list[0] && aggr_list[0].feature;
        const color = x[0];
        sized = isDefined(size) ? getColorSizeLabel('size', size) : {};
        colored = isDefined(color)
          ? getColorSizeLabel('color', color, columnCat, rowCat)
          : {};
      }
      if (cmp && cmp.name) {
        if (judgeFeatureType(cmp.name) === 'int' && x.length) {
          // int compare
          basicConfig.data.compareSized = getColorSizeLabel('size', cmp) || {};
          basicConfig.data.compareColored = colored;
        } else {
          // cat compare
          basicConfig.data.compareSized = sized;
          basicConfig.data.compareColored = colored;
        }
      }
    }

    basicConfig.data.sized = sized;
    basicConfig.data.colored = colored;
    basicConfig.data.labeled = labeled.map((l) => l.feature);

    return {
      colored,
      labeled,
      sized,
    };
  }

  function getKey ({ feature, axis, type }) {
    let obj = isDefined(feature.color)
      ? getColorSizeLabel('color', feature.color, columnCat, rowCat)
      : {};
    let labels = isDefined(feature.labels)
      ? getColorSizeLabel('label', feature.labels)
      : [];
    let { name, percent } = modifyAggrFeature(feature, true);

    return {
      name,
      labels,
      name_config: {
        axis: axis,
        bars: {
          aggr: name,
          colored: obj,
          labels: labels.map((l) => l.feature),
        },
        type: type,
        percent: percent,
        color_style: {
          opacity: 1,
          schemes: [],
          colors: [],
          patterns: [],
          range: [],
        },
        axis_style: {
          show: true,
          zeroAligned: axis === 'y2',
          align: canvasCss.fullyAligned,
          tick: {
            style: {},
            counts: null,
            range: [],
            rotate: undefined,
          },
          text: {
            style: {},
            title: '', // axis === 'y' ? y_key : y2_key,
            show: true,
          },
          line: {
            style: {},
            show: true,
          },
        },
      },
    };
  }

  function getKeys () {
    if (chart_type === 'funnel') {
      return [];
    }
    if (chart_type === 'area') {
      x_list.forEach((x, idx) => {
        let combined = [];
        let left_keys = [];
        let config = {
          y_key: '',
          y2_key: '',
          combined: [],
          labels: [],
          row_aggr: [],
        };
        let feature = x;
        let { name, labels, name_config } = getKey({
          feature,
          axis: 'y',
          type: chart_type,
        });
        left_keys.push(name);
        name_config.bars.colored = {
          feature: color.name,
          type: 'ordinal',
          stacked: true,
        };
        combined.push(name_config);
        labels.forEach((l) => config.labels.push(l));
        config.y_key = left_keys.join(' & ');
        config.row_aggr = left_keys;
        combined.forEach((c, c_idx) => {
          c.data = [dataList[idx]];
          c.axis_style.text.title = left_keys;
          if (canvasCss.isShowLabel) {
            c.bars.labels = [c.bars.aggr];
          }
        });
        config.combined = combined;
        chart_keys.push(config);
      });
      return chart_keys;
    }
    let chartType = chart_type === 'line' ? 'line' : 'bar';
    y_aggr_list.forEach((y, idx) => {
      let config = {
        y_key: '',
        y2_key: '',
        combined: [],
        labels: [],
        row_aggr: [],
      };
      let combined = [];
      let left_keys = [];
      let right_keys = [];
      if (isDefined(y.pills)) {
        y.pills.forEach((v, i) => {
          let feature = isDefined(v.feature) ? v.feature : v;
          let axis = v.status === 'left' ? 'y' : 'y2';
          let { name, labels, name_config } = getKey({
            feature,
            axis,
            type: v.type,
          });

          if (axis === 'y') {
            left_keys.push(name);
          } else {
            right_keys.push(name);
          }
          combined.push(name_config);
          labels.forEach((l) => config.labels.push(l));
        });
      } else if (isDefined(y.left) || isDefined(y.right)) {
        y.left.forEach((v) => {
          let feature = isDefined(v.feature) ? v.feature : v;
          let { name, labels, name_config } = getKey({
            feature,
            axis: 'y',
            type: chartType,
          });

          left_keys.push(name);
          combined.push(name_config);
          labels.forEach((l) => config.labels.push(l));
        });
        y.right.forEach((v) => {
          let feature = isDefined(v.feature) ? v.feature : v;
          let { name, labels, name_config } = getKey({
            feature,
            axis: 'y2',
            type: chartType,
          });

          right_keys.push(name);
          combined.push(name_config);
          labels.forEach((l) => config.labels.push(l));
        });
      } else {
        let feature = isDefined(y.feature) ? y.feature : y;
        let { name, labels, name_config } = getKey({
          feature,
          axis: 'y',
          type: isBarLine ? feature.type : chartType,
        });
        left_keys.push(name);
        combined.push(name_config);
        labels.forEach((l) => config.labels.push(l));
      }

      config.y_key = left_keys.join(' & ');
      config.y2_key = right_keys.join(' & ');
      config.row_aggr = left_keys.concat(right_keys);

      combined.forEach((c, c_idx) => {
        c.data = dataList[idx][c_idx];
        c.axis_style.text.title = c.axis === 'y' ? config.y_key : config.y2_key;
      });
      config.combined = combined;
      chart_keys.push(config);
    });
    return chart_keys;
  }

  function getTooltipData () {
    let tooltip_list = [];
    let pieTooltip = []; // 地图
    areas.forEach((a) => {
      tooltip_list.push({
        type: 'ordinal',
        feature: a,
      });
      pieTooltip.push(a);
    });
    !multi_aggr &&
      columnAggr.concat(rowAggr).forEach((aggr) => {
        if (isMap && !hasLocationData) return;
        if (isArray(aggr)) {
          aggr.forEach((a) =>
            tooltip_list.push({
              type: 'linear',
              feature: a,
            })
          );
        } else {
          tooltip_list.push({
            type: 'linear',
            feature: aggr,
          });
        }
      });
    columnCat.concat(rowCat).forEach((aggr) => {
      tooltip_list.push({
        type: 'ordinal',
        feature: aggr,
      });
    });
    notEmpty(sized) &&
      tooltip_list.push({
        type: 'linear',
        feature: sized.feature,
      });

    notEmpty(sized) && pieTooltip.push(sized.feature);

    notEmpty(colored) &&
      tooltip_list.push({
        type: colored.type,
        feature: colored.feature,
      });

    labeled.forEach((l) => {
      tooltip_list.push({
        type: l.type,
        feature: l.feature,
      });
      pieTooltip.push(l.feature);
    });

    if (isPie) {
      tooltip_list.push({
        type: 'linear',
        feature: `${sized.feature} percent`,
        isPercent: true,
      });
    }
    chart_keys.forEach((chart_key, idx) => {
      let aggr_data = chart_key.combined;
      let label_data = chart_key.labels;

      aggr_data.forEach((d) => {
        tooltip_list.push({
          type: 'linear',
          feature: d.bars.aggr,
        });
        notEmpty(d.bars.colored) &&
          tooltip_list.push({
            type: d.bars.colored.type,
            feature: d.bars.colored.feature,
          });
      });

      label_data.forEach((l) => {
        tooltip_list.push({
          type: l.type,
          feature: l.feature,
        });
      });
    });

    let unique_list = [];
    let uniqueName = [];
    tooltip_list.forEach((t) => {
      let exit = unique_list.filter((old) => old.feature === t.feature);
      pieTooltip.filter((i) => i === t.feature);
      if (isEmpty(exit)) {
        unique_list.push(t);
        uniqueName.push(t.feature);
      }
    });
    // config.tooltip.name = pieTooltip;

    return { unique_list, uniqueName };
  }

  function updateConfigByCache ({
    canvasCss,
    container,
    scale,
    mapChange,
    zoomPanning,
    ids,
  }) {
    let configs = [];

    basicConfig.scale = scale;
    basicConfig.bindto = `#${ids[0]}`;

    if (isMap) {
      basicConfig.map.change = mapChange;
    }
    if (chart_type === 'table') {
      basicConfig.table.mode = canvasCss.mode;
    }
    if (isFunnel) {
      const funnel_minwidth = 200;
      const {
        minwidth_shape,
        compare_layout,
        conversion,
        conversionColor,
        conversionFontsize,
      } = canvasCss.funnel || {};
      basicConfig.container = container;
      if (minwidth_shape) {
        basicConfig.funnel.minwidth =
          minwidth_shape === 'trapezium' ? funnel_minwidth : 0;
      }
      if (compare_layout) {
        basicConfig.funnel.compare.layout = compare_layout;
      }
      Object.assign(basicConfig.funnel, {
        conversion,
        conversionColor,
        conversionFontsize,
      });
      if (
        canvasCss.dashboard_viewMode === 'fitHeight' ||
        canvasCss.dashboard_viewMode === 'full'
      ) {
        basicConfig.funnel.rowMinHeight = 0;
        basicConfig.funnel.gap = 0;
      }
      if (!canvasCss?.funnel?.conversion) {
        basicConfig.funnel.innerPaddingLeft /= 2;
        basicConfig.funnel.innerPaddingright /= 2;
      }
    }
    if (isBarLineType) {
      basicConfig.axis.zoom.panning = zoomPanning;
      basicConfig.container = container;
    }

    if (canvasCss.tooltipTextFormat) {
      let count = 0;
      Object.keys(canvasCss.tooltipTextFormat).forEach((t) => {
        if (canvasCss.tooltipTextFormat[t].display === 'none') {
          count++;
        }
      });
      if (count === Object.keys(canvasCss.tooltipTextFormat).length) {
        basicConfig.tooltip.show = false;
      }
    }

    if (
      isPie &&
      sized.feature &&
      canvasCss.percentage &&
      canvasCss.percentage.show
    ) {
      basicConfig.data.labeled.unshift(`${sized.feature} percent`);

      if (isEmpty(basicConfig.label.text)) {
        basicConfig.label.text = [
          {
            list: [canvasCss.piePercent],
          },
        ];
      } else {
        basicConfig.label.text[0].list.unshift(canvasCss.piePercent);
      }

      if (canvasCss.piePercentFormat) {
        if (isEmpty(basicConfig.label.format)) {
          basicConfig.label.format = [
            {
              list: [canvasCss.piePercentFormat],
            },
          ];
        } else {
          basicConfig.label.format[0].list.unshift(canvasCss.piePercentFormat);
        }
      }
    }

    if (!isBarLineType || isScatter) {
      let temp_list = notEmpty(canvasCss.colors_and_opacities_list)
        ? canvasCss.colors_and_opacities_list
        : [];
      basicConfig.color.schemes = temp_list.map((c) => c.schemes);
      basicConfig.color.opacity = temp_list.map((c) => c.opacity / 100);
      basicConfig.color.colors = notEmpty(canvasCss.colors)
        ? canvasCss.colors.filter((c) => c.colorList).map((c) => c.colorList)
        : [];
      basicConfig.data.range.color = notEmpty(canvasCss.colorRanges)
        ? canvasCss.colorRanges.map((c) => c.range)
        : [];
      basicConfig.data.range.size = notEmpty(canvasCss.sizeRanges)
        ? canvasCss.sizeRanges.map((c) => c.range)
        : [];
    }
    if (isFunnel) {
      if (
        !basicConfig.color.opacity[0] &&
        basicConfig.funnel.compare.layout === 'inner' &&
        basicConfig.data.compare &&
        basicConfig.data.compare.length
      ) {
        basicConfig.color.opacity[0] = 0.6;
      }
    }

    if (notEmpty(chart_keys)) {
      let multi_configs = [];
      let aggr_styles = {
        fontList: [],
        axisList: [],
        scaleList: [],
        scopeList: [],
      };
      let combinedAxis = true;
      let all_keys = chart_keys.map((c) => c.row_aggr);
      let flat_rowAggr = all_keys.flat();

      let x_key = isScatter
        ? columnAggr[0][0]
        : columnCat[columnCat.length - 1];
      let divide_column_key = columnCat
        .slice(0, isRotated ? columnCat.length : columnCat.length - 1)
        .join('/');
      let divide_row_key = rowCat.join('/');

      if (isArea) {
        basicConfig.axis.x.text.title = columnCat;
      } else {
        basicConfig.axis.x.text.title = x_key;
      }
      basicConfig.cutoff.show = isScatter;
      basicConfig.divide.column.text.title = divide_column_key;
      basicConfig.divide.row.text.title = divide_row_key;

      if (canvasCss.axis_style) {
        let axis_style = canvasCss.axis_style;

        basicConfig.grid.style = axis_style.grid_style || {};
        basicConfig.grid.show = isDefined(axis_style.grid_show)
          ? axis_style.grid_show
          : true;
        basicConfig.cutoff.style = axis_style.cutoff_style || {};
        basicConfig.cutoff.show = isDefined(axis_style.cutoff_show)
          ? axis_style.cutoff_show
          : isScatter;

        if (axis_style.fontList) {
          let list = axis_style.fontList;
          list.forEach((l) => {
            let user_style = {
              title: l.title,
              show: l.show,
              style: {
                fill: l.color,
                'font-size': l.fontSize,
                'text-decoration': l.fontStyle,
                'font-style': l.fontStyle,
              },
            };

            let belongTo = [];
            (l.belongTo || []).forEach((feature) => {
              let new_name = modifyAggrFeature(feature);
              if (isArray(new_name)) {
                new_name.forEach((n) => belongTo.push(n));
              } else {
                belongTo.push(new_name);
              }
            });

            if (flat_rowAggr.includes(belongTo[0])) {
              l.user_style = user_style;
              aggr_styles.fontList.push(l);
            }
            if (belongTo[belongTo.length - 1] === x_key) {
              basicConfig.axis.x.text = user_style;
            }
            if (belongTo.join('/') === divide_column_key) {
              basicConfig.divide.column.text = user_style;
            }
            if (belongTo.join('/') === divide_row_key) {
              basicConfig.divide.row.text = user_style;
            }
          });
        }
        if (axis_style.axisList) {
          let list = axis_style.axisList;
          list.forEach((l) => {
            let user_style = {
              show: l.show,
              style: {
                stroke: l.color,
                'stroke-width': l.thickness,
                'stroke-dasharray': l.style === 'dot' ? '5,5' : '0,0',
              },
            };

            let belongTo = [];
            (l.belongTo || []).forEach((feature) => {
              let new_name = modifyAggrFeature(feature);
              if (isArray(new_name)) {
                new_name.forEach((n) => belongTo.push(n));
              } else {
                belongTo.push(new_name);
              }
            });
            if (flat_rowAggr.includes(belongTo[0])) {
              l.user_style = user_style;
              aggr_styles.axisList.push(l);
            }
            if (belongTo[belongTo.length - 1] === x_key) {
              basicConfig.axis.x.line = user_style;
            }
          });
        }
        if (axis_style.scaleList) {
          let list = axis_style.scaleList;
          list.forEach((l) => {
            let rotated =
              l.rotate === 'rotate' ? undefined : +l.rotate.split('rotate')[1];
            let tick_style = {
              fill: l.color,
              'font-size': l.fontSize,
            };
            if (rotated === 135) rotated = -45;

            let belongTo = [];
            (l.belongTo || []).forEach((feature) => {
              let new_name = modifyAggrFeature(feature);
              if (isArray(new_name)) {
                new_name.forEach((n) => belongTo.push(n));
              } else {
                belongTo.push(new_name);
              }
            });

            if (flat_rowAggr.includes(belongTo[0])) {
              l.tick_style = tick_style;
              l.rotated = rotated;
              aggr_styles.scaleList.push(l);
            }
            if (belongTo[belongTo.length - 1] === x_key) {
              basicConfig.axis.x.tick.style = tick_style;
              basicConfig.axis.x.tick.rotate = rotated;
            }
            if (divide_column_key.includes(belongTo.join(''))) {
              basicConfig.divide.column.tick.styleList.push({
                name: belongTo.join(''),
                style: tick_style,
                rotate: rotated,
              });
            }
            if (divide_row_key.includes(belongTo.join(''))) {
              basicConfig.divide.row.tick.styleList.push({
                name: belongTo.join(''),
                style: tick_style,
                rotate: rotated,
              });
            }
          });
        }
        if (axis_style.scopeList) {
          let list = axis_style.scopeList;
          list.forEach((l) => {
            let num = +l.num;
            let min = +l.min;
            let max = +l.max;
            let tick_counts = isNaN(num) ? undefined : num;
            let tick_range = isNaN(min) && isNaN(max) ? [] : [min, max];

            let belongTo = [];
            (l.belongTo || []).forEach((feature) => {
              let new_name = modifyAggrFeature(feature);
              if (isArray(new_name)) {
                new_name.forEach((n) => belongTo.push(n));
              } else {
                belongTo.push(new_name);
              }
            });

            if (flat_rowAggr.includes(belongTo[0])) {
              l.tick_counts = tick_counts;
              l.tick_range = tick_range;
              aggr_styles.scopeList.push(l);
            }
            if (belongTo[belongTo.length - 1] === x_key) {
              basicConfig.axis.x.tick.counts = tick_counts;
              basicConfig.axis.x.tick.range = tick_range;
            }
          });
        }
        if (isDefined(axis_style.combined)) {
          combinedAxis = axis_style.combined;
        }
      }

      let slice_idx = 0;
      let curKeyLen = 0;
      chart_keys.forEach((chart_key, idx) => {
        let aggr_data = chart_key.combined;
        let row_aggr = chart_key.row_aggr;

        !isScatter &&
          aggr_data.forEach((d, n) => {
            let key_id = `${idx}-${n}`;
            let temp_list = notEmpty(canvasCss.colors_and_opacities_list)
              ? canvasCss.colors_and_opacities_list
              : [];
            let color_list = notEmpty(canvasCss.colors) ? canvasCss.colors : [];
            let pattern_list = notEmpty(canvasCss.patterns)
              ? canvasCss.patterns
              : [];
            let range_color = notEmpty(canvasCss.colorRanges)
              ? canvasCss.colorRanges
              : [];
            let schemes_list = temp_list.filter((c) => c.key_id === key_id);
            let colors_list = color_list.filter(
              (c) => c.key_id === key_id && c.colors
            );
            let patterns_list = pattern_list.filter((c) => c.key_id === key_id);
            let range_list = range_color.filter((c) => c.key_id === key_id);
            d.color_style.schemes = notEmpty(schemes_list)
              ? schemes_list[0].schemes
              : [];
            d.color_style.opacity = notEmpty(schemes_list)
              ? schemes_list[0].opacity / 100
              : 1;
            d.color_style.colors = notEmpty(colors_list)
              ? colors_list[0].colors
              : [];
            d.color_style.patterns = notEmpty(patterns_list)
              ? patterns_list[0].patternList
              : [];
            d.color_style.range = notEmpty(range_list)
              ? range_list[0].range
              : [];
          });

        basicConfig.bindto = `#${ids[idx]}`;
        basicConfig.data.row.aggressions = [row_aggr];
        let last = 0;
        let belongList = [];
        aggr_styles.fontList.forEach((l, i) => {
          l.belongTo.forEach((b) => {
            belongList.push({
              user_style: l.user_style,
              belongTo: l.belongTo,
              tick_style: aggr_styles.scaleList[i].tick_style,
              rotated: aggr_styles.scaleList[i].rotated,
              tick_counts: aggr_styles.scopeList[i].tick_counts,
              tick_range: aggr_styles.scopeList[i].tick_range,
              align: aggr_styles.scopeList[i].align,
              line_user_style: aggr_styles.axisList[i].user_style,
            });
          });
        });
        belongList.slice(curKeyLen, aggr_data.length).forEach((m, idx) => {
          let aggr = aggr_data[idx];
          if (aggr) {
            aggr.axis_style.text = m.user_style;
            // aggr.axis_style.line = m.line_user_style;
            // aggr.axis_style.tick.style = m.tick_style;
            // aggr.axis_style.tick.rotate = m.rotated;
            // aggr.axis_style.tick.counts = m.tick_counts;
            // aggr.axis_style.tick.range = m.tick_range;
            // aggr.axis_style.zeroAligned = m.align;
          }
        });
        curKeyLen = aggr_data.length;
        // aggr_styles.fontList.slice(slice_idx).forEach((l, i) => {
        //   count += l.belongTo.length;
        //   let j = -1;
        //   if (count <= aggr_data.length) {
        //     while (j++ < l.belongTo.length) {
        //       let aggr = aggr_data[j + last];
        //       if (aggr) {
        //         aggr.axis_style.text = l.user_style;
        //       }
        //     }
        //   }
        //   last = l.belongTo.length;
        // });
        last = 0;
        aggr_styles.axisList.slice(slice_idx).forEach((l, i) => {
          let j = -1;
          while (++j < l.belongTo.length) {
            let aggr = aggr_data[j + last];
            if (aggr) {
              aggr.axis_style.line = l.user_style;
            }
          }
          last = l.belongTo.length;
        });
        last = 0;
        aggr_styles.scaleList.slice(slice_idx).forEach((l, i) => {
          let j = -1;
          while (++j < l.belongTo.length) {
            let aggr = aggr_data[j + last];
            if (aggr) {
              aggr.axis_style.tick.style = l.tick_style;
              aggr.axis_style.tick.rotate = l.rotated;
            }
          }
          last = l.belongTo.length;
        });
        aggr_styles.scopeList.slice(slice_idx).forEach((l, i) => {
          let aggr = aggr_data[i];
          if (aggr) {
            if (l.select === 3) {
              aggr.axis_style.tick.counts = l.tick_counts;
              aggr.axis_style.tick.range = l.tick_range;
            }
            aggr.axis_style.zeroAligned = l.align;
          }
        });

        slice_idx += row_aggr.length;

        if (canvasCss.axis_scale) {
          let temp = canvasCss.axis_scale.filter((c) => c.target_index === idx);
          if (notEmpty(temp)) {
            basicConfig.axis.zoom.scale = temp[0].scale;
            basicConfig.axis.zoom.translate = temp[0].translate;
          }
        }
        basicConfig.data.combined = [dcDeepClone(aggr_data)];
        multi_configs.push(
          dcDeepClone({
            id: ids[idx],
            config: basicConfig,
          })
        );
      });
      configs = multi_configs;
      if (combinedAxis) {
        let combined_config = {
          id: multi_configs[0].id, // ids.join('_'),
          config: multi_configs[0].config,
        };
        combined_config.config.bindto = `#${combined_config.id}`;
        multi_configs.slice(1).forEach((c) => {
          let data = combined_config.config.data;
          c.config.data.row.aggressions.forEach((t) =>
            data.row.aggressions.push(t)
          );
          c.config.data.combined.forEach((t) => {
            data.combined.push(t);
          });
        });
        configs = [combined_config];
      }
    } else {
      configs.push(
        dcDeepClone({
          id: ids[0],
          config: basicConfig,
        })
      );
    }
    return configs;
  }

  return {
    checkSize,
    getAllData,
    getCatAndAggrs,
    getKeys,
    getTooltipData,
    getColorSizeLabelData,
    updateConfigByCache,
  };
}

function drawWithoutConfig ({ configs, tooltip_list, table_title_list }) {
  let mc_insts = queue(configs);
  let list = [];
  let size = [];
  let map_zoom_level = 5;
  let chart_size = {};
  let axis_domain = {};
  mc_insts.forEach((m) => {
    if (isEmpty(m)) return;
    list = list.concat(m.getColorList());
    size = size.concat(m.getSizeList());

    map_zoom_level = m.getMapZoomLevel();

    chart_size = m.getChartSize();
    extend(axis_domain, m.getAxisDomain());
  });

  // 修改返回的color_list格式
  let type = configs[0].config.data.type;
  if (type !== 'area') {
    list.forEach((c) => {
      c.list.forEach((l) => {
        l.id = c.id;
        l.aggr = c.aggr;
        l.type = c.type;
        l.key_id = c.key_id;
      });
    });
  }

  let obj = {
    colors: list,
    sizes: size,
    ids: configs.map((c) => c.id),
  };

  return {
    info:
      'instances是图表实例数组，styles是图例，configs是图表的配置，map_zoom_level是地图的缩放指数，size是SVG大小，axis_domain是坐标轴的domain，tooltip_list是提示信息列表',
    instances: mc_insts,
    styles: obj,
    configs,
    map_zoom_level,
    size: chart_size || {},
    axis_domain,
    tooltip_list,
    table_title_list,
  };
}

function getDataChartList ({
  data,
  chart_type,
  location,
  canvasCss,
  id,
  feature_list,
  // times,
}) {
  let item = {
    data: [],
    chartArrs: [],
  };
  if (chart_type !== 'map') {
    item.data = JSON.parse(JSON.stringify(data));
  } else {
    item.data = {
      data: data,
      location: location,
    };
  }

  let oneChart = ['map', 'pie', 'bubble', 'table', 'scatter', 'funnel'];
  let isRotated = chart_type === 'bar-rotated';
  let isBarLine = chart_type === 'bar-line';
  // let x_list = isRotated ? feature_list.y : feature_list.x || [];
  let aggr_list = isRotated
    ? feature_list
      ? feature_list.x
      : []
    : feature_list
      ? feature_list.y
      : [] || [];
  let y_cat_list = !aggr_list
    ? []
    : isBarLine
      ? aggr_list.filter((a) => a.level === 0)
      : aggr_list.filter((a) =>
        isDefined(a.feature) ? !isDefined(a.feature.legend) : null
      );
  let y_aggr_list = !aggr_list
    ? []
    : aggr_list.filter((a) => !inArray(y_cat_list, a));
  let isCombined = true;

  if (canvasCss.axis_style && isDefined(canvasCss.axis_style.combined)) {
    isCombined = canvasCss.axis_style.combined;
  }

  if (oneChart.indexOf(chart_type) !== -1 || isCombined) {
    let chart = {
      id: `mc_${chart_type}_${id}`,
      chart_type: chart_type,
      hover: false,
    };

    if (chart_type === 'map') {
      // times = times || new Date().getTime();
      chart.id += `_${new Date().getTime()}`;
    }
    item.chartArrs.push(chart);
  } else {
    y_aggr_list.forEach((d, i) =>
      item.chartArrs.push({
        id: `mc_${chart_type}_${i}_${id}`,
        chart_type: chart_type,
        hover: false,
      })
    );
  }
  return item;
}

function getColorSizeLabel (type, list, x_cat_list, y_cat_list) {
  if (type === 'color') {
    let color_feature = {};
    let new_feature = list && isDefined(list.feature) ? list.feature : list;
    let feature_name = '';
    let f_name = modifyAggrFeature(new_feature);
    if (isArray(f_name)) feature_name = f_name[0];
    else feature_name = f_name;

    color_feature.feature = feature_name;

    if (
      inArray(x_cat_list, feature_name) ||
      inArray(y_cat_list, feature_name)
    ) {
      color_feature.type = 'ordinal';
      color_feature.stacked = false;
    } else {
      color_feature.type =
        new_feature && isDefined(new_feature.legend) ? 'linear' : 'ordinal';
      color_feature.stacked = color_feature.type === 'ordinal';
    }

    return color_feature;
  } else if (type === 'label') {
    return list.map((v) => {
      let new_feature = isDefined(v.feature) ? v.feature : v;
      let temp = '';
      let f_name = modifyAggrFeature(new_feature);
      if (isArray(f_name)) temp = f_name[0];
      else temp = f_name;
      return {
        type: isDefined(new_feature.legend) ? 'linear' : 'ordinal',
        feature: temp,
      };
    });
  } else if (type === 'size') {
    let size_feature = {};
    let temp = '';
    let f_name = modifyAggrFeature(list);
    if (isArray(f_name)) temp = f_name[0];
    else temp = f_name;

    size_feature.feature = temp;

    return size_feature;
  }
}

function modifyAggrFeature (feature_name, returnObj) {
  if (!feature_name) return feature_name;
  let f_name = isDefined(feature_name.feature)
    ? feature_name.feature
    : feature_name;
  let new_name = f_name.name;
  let f_splits = f_name.split;
  let f_legend = f_name.legend;
  let f_prop = f_name.probability || '';
  let f_rate = f_name.rate || {};
  if (isDefined(f_splits) && !isFunction(f_splits)) {
    if (isString(f_splits)) {
      let temp_str = f_splits
        .split(',')
        .map((e) => e.toLowerCase())
        .join('-');
      new_name = `${f_name.name} ${temp_str}`;
    } else {
      let temp_arr = [];
      f_splits.forEach((v) =>
        temp_arr.push(`${f_name.name} ${v.toLowerCase()}`)
      );
      new_name = temp_arr;
    }
  }
  if (isDefined(f_legend)) {
    let val = f_legend.toLowerCase();
    new_name = `${val}${f_prop}(${f_name.name})`;
    // 同比环比
    if (notEmpty(f_rate)) {
      let { type, growth } = f_rate;
      if (growth) {
        new_name = `${
          type === 'RING' ? 'Last Period' : 'Same Period'
        } Growth ${new_name}`;
      } else {
        new_name = `${
          type === 'RING' ? 'Last Period' : 'Same Period'
        } ${new_name}`;
      }
    }
  }

  return returnObj
    ? {
      name: new_name,
      percent: notEmpty(f_rate),
    }
    : new_name;
}

function queue (configs) {
  let mc_insts = [];
  configs.forEach((c) => {
    console.log('realConfig', c.config);
    // eslint-disable-next-line no-undef
    let ins = mc.generate(c.config);
    mc_insts.push(ins);
  });
  return mc_insts;
}

function clickElement (element) {
  sessionStorage.setItem('userClickItem', JSON.stringify(element));
}

function getBasicConfig (canvasCss) {
  return {
    // 画布id
    bindto: '',
    // svg大小
    size: {
      width: '', // 1080
      height: '', // 600
    },
    // 固定y, y2轴的时候需要
    container: {
      width: '', // 1080
      height: '', // 600
    },
    // 图表缩放因素会影响到鼠标事件中的位置
    scale: 1,
    // smallMultiplePadding: {left: 10, right: 18, top: 10, bottom: 10},
    // 除了标签之外图表中其他元素的字体
    font: {
      size: canvasCss.fontSize || 12,
      color: canvasCss.bgCss ? canvasCss.bgCss.color : '#424242',
    },
    /** *
    1. label_format 格式
    [
      {
      name: 'sum(sales)',
      'sum(sales)': {
        decimal: 2,
        negative: -1, ['-1234', '(1234)', '1234-'] => [-1, 0, 1]
        prefix: "",
        selectFormat: 'digit', ['digit', 'percent', 'currency']
        suffix: "",
        unit: "", ['', 'k', 'M', 'G', 'T']
        useThousandMark: true,
        zone: '', ['', 'CN', 'JP', 'HK', 'US', 'EUR', 'GBP']
      },
      'sum(profits)': {...}
      }
    ]
    2. label_text 格式
    [
      {
      name: 'sum(sales)',
      'sum(sales)': {
        align: "right", [left, right, center]
        decoration: "underline",
        fontColor: "#AB1717",
        fontSize: 12,
        fontStyle: "",
        letterSpacing: "0",
        lineHeight: "16.5",
      },
      'sum(profits)': {...}
      }
    ]
    ***/
    label: {
      // 标签的显示：使用千分符、百分比格式、货币格式、数值格式（小数位数、负值显示、单位、前缀后缀，货币的话有区域设置）
      format: canvasCss.labelList || [],
      // 标签的样式：字体大小、颜色、行距、decoration
      text: canvasCss.textSettings || [],
    },
    tooltip: {
      // tooltip的显示：使用千分符、百分比格式、货币格式、数值格式（小数位数、负值显示、单位、前缀后缀，货币的话有区域设置）
      format: canvasCss.tooltipNumberFormat || {},
      // tooltip的样式：字体大小、颜色、行距、decoration
      text: canvasCss.tooltipTextFormat || {},
      show: true,
    },
    color: {
      // 每个aggression所应用的色板[[], [], ...]
      schemes: [],
      // 每个aggression的透明度[1, 0.9, 0.6,...]
      opacity: [],
      // 每个aggression所对应的颜色[{}, {}, ...]
      colors: [],
      // 每个aggression所对应的填充[{}, {}, ...]
      patterns: [],
    },
    data: {
      type: '',
      // 当combined已有数据时json数组可为空
      json: [],
      // 颜色对象，包括feature, type, stacked这些key (该属性柱、线、或其组合不可用)
      colored: {},
      // 标签数组 (该属性柱、线、或其组合不可用)
      labeled: [],
      // 大小对象 (该属性柱、线、或其组合不可用)
      sized: {},
      // 用户自定义颜色或大小范围
      range: {
        // 每个aggression所对应的大小范围[[], [], ...]，气泡图、地图有
        size: [],
        // 每个aggression所对应的颜色范围[[], [], ...]，颜色为渐变时有
        color: [],
      },
      // 行列数据
      row: {
        categories: [],
        aggressions: [],
      },
      column: {
        categories: [],
        aggressions: [],
      },
      // funnel only, 对比数据
      compare: [],
      compareSized: {},
      compareColored: {},
      /***
      combined 格式 (该属性只有柱、线、或其组合可用)
      [
      {
        axis: 'y',
        bars: {
          aggr: 'sum(Installs)',
          colored: {
          feature: 'Category',
          type: 'ordinal',
          stacked: false
          },
          labels: ['sum(Installs)']
        },
        type: 'bar'
       },
       {
        axis: 'y2',
        bars: {
          aggr: 'sum(Reviews)',
          colored: {
          feature: 'sum(Reviews)',
          type: 'linear',
          stacked: false
          },
          labels: ['sum(Reviews)']
        },
        type: 'line'
       }
      ]
      ***/
      combined: [],
      click: clickElement,
    },
    bar: {
      // 柱子间的距离
      padding: {
        inner: 0.01,
        outter:
          (1 - (isDefined(canvasCss.size) ? canvasCss.size : 50) / 100) / 2,
      },
    },
    line: {
      // 线粗细+点大小
      size: canvasCss.size_line / 25 || 2,
      // 点形状
      pattern: canvasCss.point_style || 'circle', // cross, cross45, triangle, triangle180, star, diamond, square, wye
    },
    // 画坐标轴
    axis: {
      combined: false,
      rotated: false,
      x: {
        show: true,
        type: canvasCss.x_dataType || 'category', // bin, category, numeric, (timeseries: 暂未实现)
        tick: {
          style: {},
          counts: null,
          range: [],
          rotate: undefined,
        },
        text: {
          style: {},
          title: '',
          show: true,
        },
        line: {
          style: {},
          show: true,
        },
        percent: false, // 按照百分比展示
      },
      // 这几个跟zoom axis有关
      zoom: {
        scale: 1,
        translate: undefined,
        panning: undefined,
        enable: canvasCss.selectFromChart || false,
      },
    },
    grid: {
      style: {},
      show: true,
    },
    cutoff: {
      style: {},
      show: true,
    },
    divide: {
      column: {
        text: {
          style: {},
          title: '',
          show: true,
        },
        tick: {
          styleList: [],
          rotate: 0,
        },
      },
      row: {
        text: {
          style: {},
          title: '',
          show: true,
        },
        tick: {
          styleList: [],
          rotate: 0,
        },
      },
    },
    // table
    table: {
      mode: 'standard',
      // 外边框
      outter: isDefined(canvasCss.tableSetting)
        ? canvasCss.tableSetting.outter
        : {
          color: '#424242', // canvasCss.bgCss ? canvasCss.bgCss.color : '#424242', // '#424242',
          width: 2,
        },
      // 内边框
      inner: isDefined(canvasCss.tableSetting)
        ? canvasCss.tableSetting.inner
        : {
          color: '#a4a4a4', // canvasCss.bgCss ? canvasCss.bgCss.color : '#a4a4a4', // '#a4a4a4',
          width: 1,
        },
      // 边距
      padding: isDefined(canvasCss.tableSetting)
        ? canvasCss.tableSetting.padding
        : {
          top: 0,
          left: 3,
          bottom: 0,
          right: 3,
        },
      // 表头
      header: {
        top: {
          height: 35,
        },
        left: {
          width: [], // auto为true时可不提供
        },
        auto: true,
      },
      // cell
      body: {
        width:
          isDefined(canvasCss.tableSetting) &&
          isDefined(canvasCss.tableSetting.cell)
            ? canvasCss.tableSetting.cell.width
            : 100,
        height: 24,
        auto:
          canvasCss.dashboard_viewMode === 'fitWidth' ||
          canvasCss.dashboard_viewMode === 'full', // true:忽略width
      },
      title: canvasCss.tableTitleDataFormat || [],
      background: canvasCss.bgCss,
      /* table_text 格式
      {
        key: '',
        style: {},
        title: '',
        show: true
      }
      */
    },
    // funnel 漏斗图
    funnel: {
      type: 'data', // data 根据数据绘制, smooth, smooth_invert 直接无视数据等差绘制
      shape: 'trapezium', // rect 矩形, trapezium  梯形 | 三角形, 由 minwidth 控制
      minwidth: 200, // 最小宽度，设为0表现为三角形
      sort: 0, // -1, 0, 1 数据排序
      gap: 2, // 行间距
      align: 'center', // 对齐 left,center,right
      rowMinHeight: 40, // 最小行高
      innerPaddingLeft: 120, // 漏斗图的内padding，避免 label 超出
      innerPaddingRight: 120,
      labelPosition: 'middle', // left, middle, right
      conversion: true,
      conversionColor: '#424242',
      conversionFontsize: 12,
      compare: {
        type: 'data',
        layout: 'horizontal', // inner, horizontal, (vertical 暂时废弃)
        labelPosition: 'middle',
      },
    },
    // map
    map: {
      // 放大倍数
      level: canvasCss.mapZoom || undefined,
      // 中心点
      center: canvasCss.mapCenter || [],
      // zoom对应的事件
      change: undefined,
      showLatLong: false,
    },
    // map, scatter 点最小直径
    point: {
      size: canvasCss.size / 25 || 2,
    },
    // bubble and pie 直径
    arc: {
      size: canvasCss.size || 90,
      innerRadius: canvasCss.innerRadius || 0,
    },
    // bubble
    order: {
      style: isDefined(canvasCss.orderStyle) ? canvasCss.orderStyle : -1,
    },
    area: {
      opacity: canvasCss.isFillArea ? 0.25 : 0,
    },
  };
}

export { draw, drawWithoutConfig, getDataChartList };
