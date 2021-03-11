import { drawPie, pieDrawingChartStyleProcess } from './drawPie';
let bubbleDrawingChartStyleProcess = function ({
  featureList,
  canvasCss,
  chartType,
}) {
  let chartStyle = pieDrawingChartStyleProcess({
    featureList,
    canvasCss,
    chartType,
  });

  chartStyle.orderStyle = canvasCss.orderStyle;
  return chartStyle;
};

let drawBubble = function ({
  canvasCss,
  data,
  containerSize,
  chartSize,
  ids,
  featureList,
}) {
  return drawPie({
    canvasCss,
    data,
    containerSize,
    chartSize,
    ids,
    featureList,
    type: 'bubble',
  });
};
export { drawBubble, bubbleDrawingChartStyleProcess };
