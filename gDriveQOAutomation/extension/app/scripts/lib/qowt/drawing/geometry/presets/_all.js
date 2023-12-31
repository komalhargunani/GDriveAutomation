/**
 * Wrapper module for all preset shapes
 */
define([
  'qowtRoot/drawing/geometry/presets/accentBorderCallout1',
  'qowtRoot/drawing/geometry/presets/accentBorderCallout2',
  'qowtRoot/drawing/geometry/presets/accentBorderCallout3',
  'qowtRoot/drawing/geometry/presets/accentCallout1',
  'qowtRoot/drawing/geometry/presets/accentCallout2',
  'qowtRoot/drawing/geometry/presets/accentCallout3',
  'qowtRoot/drawing/geometry/presets/actionButtonBackPrevious',
  'qowtRoot/drawing/geometry/presets/actionButtonBeginning',
  'qowtRoot/drawing/geometry/presets/actionButtonBlank',
  'qowtRoot/drawing/geometry/presets/actionButtonDocument',
  'qowtRoot/drawing/geometry/presets/actionButtonEnd',
  'qowtRoot/drawing/geometry/presets/actionButtonForwardNext',
  'qowtRoot/drawing/geometry/presets/actionButtonHelp',
  'qowtRoot/drawing/geometry/presets/actionButtonHome',
  'qowtRoot/drawing/geometry/presets/actionButtonInformation',
  'qowtRoot/drawing/geometry/presets/actionButtonMovie',
  'qowtRoot/drawing/geometry/presets/actionButtonReturn',
  'qowtRoot/drawing/geometry/presets/actionButtonSound',
  'qowtRoot/drawing/geometry/presets/arc',
  'qowtRoot/drawing/geometry/presets/bentArrow',
  'qowtRoot/drawing/geometry/presets/bentConnector2',
  'qowtRoot/drawing/geometry/presets/bentConnector3',
  'qowtRoot/drawing/geometry/presets/bentConnector4',
  'qowtRoot/drawing/geometry/presets/bentConnector5',
  'qowtRoot/drawing/geometry/presets/bentUpArrow',
  'qowtRoot/drawing/geometry/presets/bevel',
  'qowtRoot/drawing/geometry/presets/blockArc',
  'qowtRoot/drawing/geometry/presets/borderCallout1',
  'qowtRoot/drawing/geometry/presets/borderCallout2',
  'qowtRoot/drawing/geometry/presets/borderCallout3',
  'qowtRoot/drawing/geometry/presets/bracePair',
  'qowtRoot/drawing/geometry/presets/bracketPair',
  'qowtRoot/drawing/geometry/presets/callout1',
  'qowtRoot/drawing/geometry/presets/callout2',
  'qowtRoot/drawing/geometry/presets/callout3',
  'qowtRoot/drawing/geometry/presets/can',
  'qowtRoot/drawing/geometry/presets/chartPlus',
  'qowtRoot/drawing/geometry/presets/chartStar',
  'qowtRoot/drawing/geometry/presets/chartX',
  'qowtRoot/drawing/geometry/presets/chevron',
  'qowtRoot/drawing/geometry/presets/chord',
  'qowtRoot/drawing/geometry/presets/circularArrow',
  'qowtRoot/drawing/geometry/presets/cloud',
  'qowtRoot/drawing/geometry/presets/cloudCallout',
  'qowtRoot/drawing/geometry/presets/corner',
  'qowtRoot/drawing/geometry/presets/cornerTabs',
  'qowtRoot/drawing/geometry/presets/cube',
  'qowtRoot/drawing/geometry/presets/curvedConnector2',
  'qowtRoot/drawing/geometry/presets/curvedConnector3',
  'qowtRoot/drawing/geometry/presets/curvedConnector4',
  'qowtRoot/drawing/geometry/presets/curvedConnector5',
  'qowtRoot/drawing/geometry/presets/curvedDownArrow',
  'qowtRoot/drawing/geometry/presets/curvedLeftArrow',
  'qowtRoot/drawing/geometry/presets/curvedRightArrow',
  'qowtRoot/drawing/geometry/presets/curvedUpArrow',
  'qowtRoot/drawing/geometry/presets/decagon',
  'qowtRoot/drawing/geometry/presets/diagStripe',
  'qowtRoot/drawing/geometry/presets/diamond',
  'qowtRoot/drawing/geometry/presets/dodecagon',
  'qowtRoot/drawing/geometry/presets/donut',
  'qowtRoot/drawing/geometry/presets/doubleWave',
  'qowtRoot/drawing/geometry/presets/downArrow',
  'qowtRoot/drawing/geometry/presets/downArrowCallout',
  'qowtRoot/drawing/geometry/presets/ellipse',
  'qowtRoot/drawing/geometry/presets/ellipseRibbon',
  'qowtRoot/drawing/geometry/presets/ellipseRibbon2',
  'qowtRoot/drawing/geometry/presets/flowChartAlternateProcess',
  'qowtRoot/drawing/geometry/presets/flowChartCollate',
  'qowtRoot/drawing/geometry/presets/flowChartConnector',
  'qowtRoot/drawing/geometry/presets/flowChartDecision',
  'qowtRoot/drawing/geometry/presets/flowChartDelay',
  'qowtRoot/drawing/geometry/presets/flowChartDisplay',
  'qowtRoot/drawing/geometry/presets/flowChartDocument',
  'qowtRoot/drawing/geometry/presets/flowChartExtract',
  'qowtRoot/drawing/geometry/presets/flowChartInputOutput',
  'qowtRoot/drawing/geometry/presets/flowChartInternalStorage',
  'qowtRoot/drawing/geometry/presets/flowChartMagneticDisk',
  'qowtRoot/drawing/geometry/presets/flowChartMagneticDrum',
  'qowtRoot/drawing/geometry/presets/flowChartMagneticTape',
  'qowtRoot/drawing/geometry/presets/flowChartManualInput',
  'qowtRoot/drawing/geometry/presets/flowChartManualOperation',
  'qowtRoot/drawing/geometry/presets/flowChartMerge',
  'qowtRoot/drawing/geometry/presets/flowChartMultidocument',
  'qowtRoot/drawing/geometry/presets/flowChartOfflineStorage',
  'qowtRoot/drawing/geometry/presets/flowChartOffpageConnector',
  'qowtRoot/drawing/geometry/presets/flowChartOnlineStorage',
  'qowtRoot/drawing/geometry/presets/flowChartOr',
  'qowtRoot/drawing/geometry/presets/flowChartPredefinedProcess',
  'qowtRoot/drawing/geometry/presets/flowChartPreparation',
  'qowtRoot/drawing/geometry/presets/flowChartProcess',
  'qowtRoot/drawing/geometry/presets/flowChartPunchedCard',
  'qowtRoot/drawing/geometry/presets/flowChartPunchedTape',
  'qowtRoot/drawing/geometry/presets/flowChartSort',
  'qowtRoot/drawing/geometry/presets/flowChartSummingJunction',
  'qowtRoot/drawing/geometry/presets/flowChartTerminator',
  'qowtRoot/drawing/geometry/presets/foldedCorner',
  'qowtRoot/drawing/geometry/presets/frame',
  'qowtRoot/drawing/geometry/presets/funnel',
  'qowtRoot/drawing/geometry/presets/gear6',
  'qowtRoot/drawing/geometry/presets/gear9',
  'qowtRoot/drawing/geometry/presets/halfFrame',
  'qowtRoot/drawing/geometry/presets/heart',
  'qowtRoot/drawing/geometry/presets/heptagon',
  'qowtRoot/drawing/geometry/presets/hexagon',
  'qowtRoot/drawing/geometry/presets/homePlate',
  'qowtRoot/drawing/geometry/presets/horizontalScroll',
  'qowtRoot/drawing/geometry/presets/irregularSeal1',
  'qowtRoot/drawing/geometry/presets/irregularSeal2',
  'qowtRoot/drawing/geometry/presets/leftArrow',
  'qowtRoot/drawing/geometry/presets/leftArrowCallout',
  'qowtRoot/drawing/geometry/presets/leftBrace',
  'qowtRoot/drawing/geometry/presets/leftBracket',
  'qowtRoot/drawing/geometry/presets/leftCircularArrow',
  'qowtRoot/drawing/geometry/presets/leftRightArrow',
  'qowtRoot/drawing/geometry/presets/leftRightArrowCallout',
  'qowtRoot/drawing/geometry/presets/leftRightCircularArrow',
  'qowtRoot/drawing/geometry/presets/leftRightRibbon',
  'qowtRoot/drawing/geometry/presets/leftRightUpArrow',
  'qowtRoot/drawing/geometry/presets/leftUpArrow',
  'qowtRoot/drawing/geometry/presets/lightningBolt',
  'qowtRoot/drawing/geometry/presets/line',
  'qowtRoot/drawing/geometry/presets/lineInv',
  'qowtRoot/drawing/geometry/presets/mathDivide',
  'qowtRoot/drawing/geometry/presets/mathEqual',
  'qowtRoot/drawing/geometry/presets/mathMinus',
  'qowtRoot/drawing/geometry/presets/mathMultiply',
  'qowtRoot/drawing/geometry/presets/mathNotEqual',
  'qowtRoot/drawing/geometry/presets/mathPlus',
  'qowtRoot/drawing/geometry/presets/moon',
  'qowtRoot/drawing/geometry/presets/noSmoking',
  'qowtRoot/drawing/geometry/presets/nonIsoscelesTrapezoid',
  'qowtRoot/drawing/geometry/presets/notchedRightArrow',
  'qowtRoot/drawing/geometry/presets/octagon',
  'qowtRoot/drawing/geometry/presets/parallelogram',
  'qowtRoot/drawing/geometry/presets/pentagon',
  'qowtRoot/drawing/geometry/presets/pie',
  'qowtRoot/drawing/geometry/presets/pieWedge',
  'qowtRoot/drawing/geometry/presets/plaque',
  'qowtRoot/drawing/geometry/presets/plaqueTabs',
  'qowtRoot/drawing/geometry/presets/plus',
  'qowtRoot/drawing/geometry/presets/quadArrow',
  'qowtRoot/drawing/geometry/presets/quadArrowCallout',
  'qowtRoot/drawing/geometry/presets/rect',
  'qowtRoot/drawing/geometry/presets/ribbon',
  'qowtRoot/drawing/geometry/presets/ribbon2',
  'qowtRoot/drawing/geometry/presets/rightArrow',
  'qowtRoot/drawing/geometry/presets/rightArrowCallout',
  'qowtRoot/drawing/geometry/presets/rightBrace',
  'qowtRoot/drawing/geometry/presets/rightBracket',
  'qowtRoot/drawing/geometry/presets/round1Rect',
  'qowtRoot/drawing/geometry/presets/round2DiagRect',
  'qowtRoot/drawing/geometry/presets/round2SameRect',
  'qowtRoot/drawing/geometry/presets/roundRect',
  'qowtRoot/drawing/geometry/presets/rtTriangle',
  'qowtRoot/drawing/geometry/presets/smileyFace',
  'qowtRoot/drawing/geometry/presets/snip1Rect',
  'qowtRoot/drawing/geometry/presets/snip2DiagRect',
  'qowtRoot/drawing/geometry/presets/snip2SameRect',
  'qowtRoot/drawing/geometry/presets/snipRoundRect',
  'qowtRoot/drawing/geometry/presets/squareTabs',
  'qowtRoot/drawing/geometry/presets/star10',
  'qowtRoot/drawing/geometry/presets/star12',
  'qowtRoot/drawing/geometry/presets/star16',
  'qowtRoot/drawing/geometry/presets/star24',
  'qowtRoot/drawing/geometry/presets/star32',
  'qowtRoot/drawing/geometry/presets/star4',
  'qowtRoot/drawing/geometry/presets/star5',
  'qowtRoot/drawing/geometry/presets/star6',
  'qowtRoot/drawing/geometry/presets/star7',
  'qowtRoot/drawing/geometry/presets/star8',
  'qowtRoot/drawing/geometry/presets/straightConnector1',
  'qowtRoot/drawing/geometry/presets/stripedRightArrow',
  'qowtRoot/drawing/geometry/presets/sun',
  'qowtRoot/drawing/geometry/presets/swooshArrow',
  'qowtRoot/drawing/geometry/presets/teardrop',
  'qowtRoot/drawing/geometry/presets/trapezoid',
  'qowtRoot/drawing/geometry/presets/triangle',
  'qowtRoot/drawing/geometry/presets/upArrow',
  'qowtRoot/drawing/geometry/presets/upArrowCallout',
  'qowtRoot/drawing/geometry/presets/upDownArrow',
  'qowtRoot/drawing/geometry/presets/upDownArrowCallout',
  'qowtRoot/drawing/geometry/presets/uturnArrow',
  'qowtRoot/drawing/geometry/presets/verticalScroll',
  'qowtRoot/drawing/geometry/presets/wave',
  'qowtRoot/drawing/geometry/presets/wedgeEllipseCallout',
  'qowtRoot/drawing/geometry/presets/wedgeRectCallout',
  'qowtRoot/drawing/geometry/presets/wedgeRoundRectCallout'
], function() {
  'use strict';


  var _presets = [];
  for (var i = 0; i < arguments.length; i++) {
    var p = arguments[i];
    _presets[p.id] = p;
  }
  return _presets;
});
