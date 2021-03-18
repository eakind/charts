/* eslint-disable */
import { notEmpty, isUndefined, isEmpty, isNumber, isDefined } from '../utils/check.js';
export default class map {
  constructor (data, config) {
    this.config = config;
    this.data = data;
    this.scene = null;
    this.clickLabelLayer = null;
    this.markerLayer = null;
    this.zoomLayer = null;
    this.pointLayer = null;
  };

  render () {
    // let idx = n.x;
    // let idy = n.y;
    // $$.bigContainer.append('div')
    //   .attr('id', `${bindto.slice(1)}-${idx}-${idy}`)
    //   .attr('style', `width: ${map_width}px; height: ${map_height}px; display: block; position: absolute;
    //     transform: translate(${idx * width}px,  ${idy * height}px)`)

    // scene = new L7.Scene({
    //   id: `${bindto.slice(1)}-${idx}-${idy}`,
    //   map: new L7.GaodeMap({
    //     pitch: 0,
    //     style: 'light',
    //     center: [ 106.47111650000001, 34.00407302986006 ],
    //     // center: [ 34.00407302986006, 106.47111650000001 ],
    //     // center: [ 121.435159, 31.256971 ],
    //     zoom: 3,
    //     minZoom: 3
    //   })
    // });
    var mapDiv = document.querySelector('#' + this.config.id);
    mapDiv.innerHTML = '';
    if (this.scene) {
      this.scene.destroy();
    }
    this.resetData();
    this.scene = new L7.Scene({
      id: this.config.id,
      map: new L7.GaodeMap({
        pitch: 0,
        style: 'light',
        center: [106.47111650000001, 34.00407302986006],
        // center: [ 34.00407302986006, 106.47111650000001 ],
        // center: [ 121.435159, 31.256971 ],
        zoom: 3,
        minZoom: 3
      })
    });
    this.scene.on('loaded', (ev) => {
      this.fitBoundsMap();
      setTimeout(() => {
        this.addMapSymbols();
        if (this.isMobile()) {
          this.addZoomCtrl();
        }
        this.addMapLabels();
        // setTimeout(() => {
        //   this.addMapLabels();
        // }, 100);
        this.scene.on('zoomend', () => {
          console.log('zoom');
          if (this.markerLayer) {
            this.markerLayer.markers.forEach(item => {
              item.remove();
            });
            this.markerLayer && this.scene.removeMarkerLayer(this.markerLayer);
          }
          this.addMapLabels();
        }); // 缩放停止时触发
      }, 800);
      // this.addMapSymbols();
      // if (this.isMobile()) {
      //   this.addZoomCtrl();
      // }
      // this.addMapLabels();
      // // setTimeout(() => {
      // //   this.addMapLabels();
      // // }, 100);
      // this.scene.on('zoomend', () => {
      //   console.log('zoom');
      //   if (this.markerLayer) {
      //     this.markerLayer.markers.forEach(item => {
      //       item.remove();
      //     });
      //     this.markerLayer && this.scene.removeMarkerLayer(this.markerLayer);
      //   }
      //   this.addMapLabels();
      // }); // 缩放停止时触发

      // this.scene.on('click', (ev, e) => {
      //   console.log('click', ev, e);
      //   ev.originEvent.stopPropagation();
      //   window.event ? window.event.cancelBubble = true : ev.originEvent.stopPropagation();
      //   ev.originEvent.preventDefault ? ev.originEvent.preventDefault() : window.event.returnValue = false;
      // });
    });
  }

  fitBoundsMap () {
    // setTimeout(() => {
    let xAggressions = this.config.column.aggressions;
    let yAggressions = this.config.row.aggressions;
    let latlngs = this.data.map(v => [v[xAggressions[0]], v[yAggressions[0]]]).filter(v => !isUndefined(v[0]) && !isUndefined(v[1]));
    if (notEmpty(latlngs)) {
      let latitudeArr = latlngs.map(item => {
        return item[0];
      });
      let longitudeArr = latlngs.map(item => {
        return item[1];
      });
      this.scene.fitBounds([
        [Math.min(...longitudeArr), Math.min(...latitudeArr)],
        [Math.max(...longitudeArr), Math.max(...latitudeArr)]
      ]);
    }
    // }, 300);
  };

  addMapSymbols () {
    let tooltip = this.config.tooltipList.map(item => {
      return item.key;
    });
    // let mapZoom = scene.getZoom();
    this.pointLayer = new L7.PointLayer({
      name: 'symbol'
    })
      .source(this.data, {
        parser: {
          // 需要指定数据格式，不然默认的是geojson格式
          type: 'json',
          x: 'longitude',
          y: 'latitude'
        }
      })
      .shape('circle')
      // .size(sized_feature, [1, 20])
      .size(this.config.sizeFeature.feature, value => {
        return this.getSize(value);
      })
      .style({
        opacity: this.config.color && this.config.color.opacity,
        strokeWidth: 0
      });
    if (this.config.colorFeature && this.config.colorFeature.feature) {
      this.pointLayer.color(this.config.colorFeature.feature, ['#7AC9F5', '#2A5783']);
    } else {
      this.pointLayer.color('#4284F5');
    }
    this.scene.addLayer(this.pointLayer);
    this.pointLayer.on('click', (ev) => {
      if (this.scene.getLayerByName('clickLabelLayer')) {
        this.scene.removeLayer(this.clickLabelLayer);
      }
      this.pointLayer.setSelect(ev.featureId);
      this.pointLayer.style({
        opacity: 0.2
      });
      this.addClickLabel(ev, this.scene);
    });
    this.pointLayer.on('unclick', (ev) => {
      if (this.scene.getLayerByName('clickLabelLayer')) {
        this.scene.removeLayer(this.clickLabelLayer);
      }
      // this.pointLayer.color(this.config.colorFeature.feature, ['#7AC9F5', '#2A5783']);
      if (this.config.colorFeature && this.config.colorFeature.feature) {
        this.pointLayer.color(this.config.colorFeature.feature, ['#7AC9F5', '#2A5783']);
      } else {
        this.pointLayer.color('#4284F5');
      }
      this.pointLayer.style({
        opacity: 1
      });
      this.pointLayer.setSelect(1000000);
    });
    let popupLayer = new L7.Popup({
      closeButton: false
    });
    this.pointLayer.on('mousemove', (ev) => {
      // if (!config.tooltip_show) return;
      if (this.config.tooltipList.length === 0) return;
      let tooltipData = ev.feature;
      let obj = {};
      for (const key in tooltipData) {
        if (tooltip.indexOf(key) >= 0) {
          obj[key] = tooltipData[key];
        }
      };
      if (this.config.tooltipFormat) {
        this.config.tooltipFormat.forEach(item => {
          if (item.display === 'none' && obj[item.key]) {
            delete obj[item.key];
          } else {
            obj.format = item.format;
          }
        })
      }
      // var html = $$.formatTooltipText(obj);
      let htmlContent = '';
      for (const key in obj) {
        if (key !== 'format') {
          htmlContent = htmlContent + `<div>${key}: ${this.formatNumberFunction(obj[key], obj.format)}</div>`;
        }
      };
      let html = `<div>${htmlContent}</div>`;
      popupLayer.setLnglat([ev.lngLat.lng, ev.lngLat.lat])
        .setHTML(html);
      this.scene.addPopup(popupLayer);
    });
    this.pointLayer.on('mouseout', (ev) => {
      popupLayer.remove();
    });
  };

  addMapLabels () {
    if (this.markerLayer) {
      this.markerLayer = null;
    }
    // let labeleFeatures = this.config.labelFeature.map(item => {
    //   return item.feature;
    // });
    let labeleFeatures = this.config.labelFeature;
    if (isEmpty(labeleFeatures)) return;
    this.markerLayer = new L7.MarkerLayer();
    let getMapService = this.scene.getMapService();
    let longPixelsPerDegree = getMapService.coordinateSystemService.pixelsPerDegree && Math.abs(getMapService.coordinateSystemService.pixelsPerDegree[0]);
    let latPixelsPerDegree = getMapService.coordinateSystemService.pixelsPerDegree && Math.abs(getMapService.coordinateSystemService.pixelsPerDegree[1]);
    let symbolLayer = this.scene.getLayerByName('symbol');
    let symbolCircle = symbolLayer.encodedData;
    // 优化一下文本标签的显示，在文本标签太多导致重叠等等情况下
    // 计算两个地方的半径和文本标签的长度之和，在这个范围内有其他标签的话都不显示
    let noLabel = [];
    let data = this.data;
    for (let i = 0; i < data.length; i++) {
      let v = data[i];
      let circle = symbolCircle[i];
      // let nextCircle = symbolCircle[i + 1];
      let maxTxt = 0;
      labeleFeatures.forEach((l, j) => {
        // let txt = format_list[j].formatLabel(v[l])
        let txt = v[l] + '';
        maxTxt = txt.length > maxTxt ? txt.length : maxTxt;
      });
      let maxTxtLength = maxTxt * 8;
      if (noLabel.indexOf(i) < 0) {
        for (let j = i + 1; j < data.length; j++) {
          let nextCircle = symbolCircle[j];
          let longLength = longPixelsPerDegree * Math.abs(circle.coordinates[0] - nextCircle.coordinates[0]);
          let latLength = latPixelsPerDegree * Math.abs(circle.coordinates[1] - nextCircle.coordinates[1]);
          let circleLength = Math.sqrt(Math.pow(longLength, 2) + Math.pow(latLength, 2));
          if ((maxTxtLength / 2 + circle.size / 2 + nextCircle.size / 2) > circleLength) {
            if (noLabel.indexOf(j) < 0) {
              noLabel.push(j);
            }
          }
        }
      }
    }
    for (let i = 0; i < data.length; i++) {
      if (noLabel.indexOf(i) < 0) {
        const divDom = document.createElement('div');
        divDom.className = 'map-label-text';
        divDom.style = 'display: flex; flex-direction: column; font-size: 12px; align-items: center;';
        labeleFeatures.forEach((lf, lid) => {
          let curLabel = this.config.labelStyle.filter(item => {
            return item.key = lf;
          })[0];
          const pDom = document.createElement('span');
          // pDom.textContent = format_list[lid].formatLabel(data[i][lf]);
          pDom.textContent = this.formatNumberFunction(data[i][lf], curLabel.format);
          divDom.appendChild(pDom);
        });
        const el = document.createElement('label');
        el.className = 'labelclass';
        el.innerHTML = divDom.outerHTML;
        const marker = new L7.Marker({
          element: el
        }).setLnglat({ lng: data[i].longitude, lat: data[i].latitude });
        this.markerLayer.addMarker(marker);
      }
    }
    this.scene.addMarkerLayer(this.markerLayer);
  };

  addZoomCtrl () {
    this.zoomLayer = new L7.Zoom({
      position: 'topright'
    });
    this.scene.addControl(this.zoomLayer);
  };

  resetData () {
    this.scene = null;
    this.clickLabelLayer = null;
    this.markerLayer = null;
    this.zoomLayer = null;
    this.pointLayer = null;
  };

  getSize (n) {
    const minRadius = this.config.point.size;
    const maxRadius = minRadius * 8;
    const midRadius = maxRadius / 3;
    let data = this.data;
    let sizeRange = [];
    let sizeFeature = this.config.sizeFeature.feature;
    let domain = [];
    let range = [];
    if (!isUndefined(sizeFeature)) {
      // domain = d3.extent(data.map(v => v[sizeFeature]))
      let featureSizeArr = data.map(v => v[sizeFeature]);
      domain[0] = Math.min(...featureSizeArr);
      domain[1] = Math.max(...featureSizeArr);
      if (!isUndefined(sizeRange[0]) && sizeRange[0] !== null) domain[0] = Number(sizeRange[0]);
      if (!isUndefined(sizeRange[1]) && sizeRange[1] !== null) domain[1] = Number(sizeRange[1]);
      if (domain[0] > domain[1]) domain[0] = domain[1];
      range = [minRadius, maxRadius];
      if (domain[0] === domain[1]) range = [midRadius, midRadius];
    } else {
      range = [midRadius, midRadius];
    }
    // $$.userDefined_sizeRange = domain
    // let scale = d3.scaleLinear().range(range).domain(domain).clamp(true)
    let curSize = range[0] + ((n - domain[0]) * (range[1] - range[0]) / (domain[1] - domain[0]));

    return curSize;
    // return function(d) {
    //   return isDefined(d) ? Math.max(scale(d), 0) : mid_radius;
    // }
  };

  isMobile () {
    if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
      return true;
    } else {
      return false;
    }
  }

  // 增加一个图层，用来显示点击某个数据时高亮，而其他数据不显示
  addClickLabel (ev, scene) {
    this.clickLabelLayer = new L7.PointLayer({
      name: 'clickLabelLayer'
    })
      .source(this.data, {
        parser: {
          type: 'json',
          x: 'longitude',
          y: 'latitude'
        }
      })
      .shape('circle')
      .size(this.config.sizeFeature.feature, [1, 20])
      // .color(this.config.colorFeature.feature, value => {
      //   if (value === ev.feature[this.config.colorFeature.feature]) {
      //     return '#2A5783';
      //   }
      // })
      .style({
        opacity: 1,
        strokeWidth: 0
      });
    if (this.config.colorFeature && this.config.colorFeature.feature) {
      this.clickLabelLayer.color(this.config.colorFeature.feature, value => {
        console.log('value', value);
        console.log('ev.fearture', ev.feature);
        if (value === ev.feature[this.config.colorFeature.feature]) {
          return '#2A5783';
        }
      });
    } else {
      // this.clickLabelLayer.color('#4284F5');
      this.clickLabelLayer.color(this.config.sizeFeature.feature, value => {
        if (value === ev.feature[this.config.sizeFeature.feature]) {
          return '#4284F5';
        }
      });
    }
    this.scene.addLayer(this.clickLabelLayer);
  };

  formatNumberFunction (label, format) {
    let prefixes = {
      y: 1e-24,
      z: 1e-21,
      a: 1e-18,
      f: 1e-15,
      p: 1e-12,
      mu: 1e-6,
      m: 1e-3,
      none: 1e-0,
      K: 1e+3,
      M: 1e+6,
      G: 1e+9,
      T: 1e+12,
      P: 1e+15,
      E: 1e+18,
      Z: 1e+21,
      Y: 1e+24
    };
    let new_label = label
    let original = false, k_mark = true;
    
    if(format.decimal < 0) format.decimal = 0
    if(format.decimal === '') original = true
  
    if(isNumber(new_label)) {
      // if(isNaN(new_label)) return ''
      let format_decimal = `.${format.decimal}`,
          format_kMark = format.useThousandMark ? ',' : '';
      if(format_kMark === '') k_mark = false
  
      if(format.selectFormat !== 'percent') {
        //单位换算
        Object.keys(prefixes).forEach(p => {
          // if(p === format.unit) new_label /= prefixes[p]
          let splitUnit = format.unit ? format.unit.split(' ')[0] : '';
          if(p === format.unit) {
            new_label /= prefixes[p]
          } else if (p === splitUnit) {
            new_label /= prefixes[splitUnit]
          }
        })
        //小数位数
        new_label = original ? (k_mark ? d3.format(format_kMark)(new_label) : new_label) : 
                               d3.format(`${format_kMark}${format_decimal}f`)(new_label);
        //负值显示
        if (format.negative === '(1234)') {
          format.negative = 0;
        } else if (format.negative === '1234-') {
          format.negative = 1;
        }
        if(parseFloat(new_label) < 0) {
          if(format.negative === 0) {
            new_label = original ? `(${k_mark ? d3.format(format_kMark)(Math.abs(new_label)) : Math.abs(new_label)})` : 
                                   `(${k_mark ? d3.format(`${format_kMark}${format_decimal}f`)(Math.abs(label)) : d3.format(`${format_kMark}${format_decimal}f`)(Math.abs(new_label))})`
          } else if(format.negative === 1) {
            new_label = original ? `${k_mark ? d3.format(format_kMark)(Math.abs(new_label)) : Math.abs(new_label)}-` : 
                                   `${k_mark ? d3.format(`${format_kMark}${format_decimal}f`)(Math.abs(label)) : d3.format(`${format_kMark}${format_decimal}f`)(Math.abs(new_label))}-`
          }
        }
        
        new_label += isDefined(format.unit) ? format.unit : ''
      } else {
        new_label *= 100
        //小数位数
        let num = original ? (k_mark ? d3.format(`${format_kMark}`)(Math.abs(new_label)) : d3.format('')(Math.abs(new_label))) :
                             d3.format(`${format_kMark}.${format.decimal}f`)(Math.abs(new_label))
  
        if(new_label < 0) {
          if(format.negative === 0) new_label = `(${num})`
          else if(format.negative === 1) new_label = `${num}-` 
          else new_label = `-${num}` 
        } else {
          new_label = num
        }
      }
  
      //货币
      if(format.selectFormat === 'currency') {
        let areaCode = ['', 'CN', 'JP', 'HK', 'US', 'EUR', 'GBP'];
        let moneyCode = ['', '¥', '￥', 'HK$', '＄', '€', '£'];
        let zoneObj = {
          CN: `¥ 人民币`,
          JP: `￥ 日元`,
          HK: `HK$ 港元`,
          US: `＄ 美元`,
          EUR: `€ 欧元`,
          GBP: `£ 英镑`
        };
        let format_zone = isDefined(format.zone) ? format.zone : '¥ 人民币';
        for (let item in zoneObj) {
          if (format_zone === zoneObj[item]) {
            format_zone = item;
          }
        };
        let prefix = moneyCode[areaCode.indexOf(format_zone.toUpperCase())] || ''
        new_label = `${prefix}${new_label}`
      }
      //前缀后缀
      new_label = `${format.prefix}${new_label}${format.suffix}`
    } else {
      new_label += ''
    }
  
    if(new_label === 'undefined' || new_label === 'NaN') new_label = '' 
  
    return new_label
  };

/**
  getColorList() {
    $$.modifyColorList({
      colored_type: colored_type,
      colored_feature: colored_feature,
      keys: keys
    })
  }

  getSizeList() {
    if(isDefined(sized_feature)) {
      let range = d3.extent(data.sort((a, b) => a[sized_feature] - b[sized_feature]).map(d => d[sized_feature]))
      $$.modifySizeList({
        sizeRange: range,
        sized_feature: sized_feature
      })
    }
  }
  */
};
