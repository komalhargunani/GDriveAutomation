/**
 * Gradient Fill handler.
 * Responsible for gradient fill
 *
 *
 * Gradient fill JSON --
 * {
 "type":"gradientFill",
 "flpMode": < x/y/xy/none >,
 "rotWithShape": <boolean>,
 "tileRect": {
 "b": <bottom>,
 "l": <left>,
 "r": <right>,
 "t": <top>
 },
 "gsLst": <array of gradient stop>,
 // Either Linear or path gradient JSON will appear here.
 "lin/path": <linear gradient/ path gradient>
 }

 stop json
 {

 "pos": < value ranging from 0% to 100%>,
 "clr": <hexValue Color>
 "alpha":<opaque value between 0 and 1>
 }

 linear json

 {
 "angle": <Angle value>,
 "scaled": <Boolean>
 }

 path gradient json

 {
 "pathShadeType":<shape/circle/rect>,
 "fillRect": {
 "b": <bottom>,
 "l": <left>,
 "r": <right>,
 "t": <top>
 }
 }
 *
 */

define([
  'qowtRoot/utils/deprecatedUtils',
  'qowtRoot/drawing/color/colorUtility'
], function(DeprecatedUtils, ColorUtility) {

  'use strict';

  /**
   * computes the start and end points of the canvas paint gradient
   * @param height {Number} Height of canvas
   * @param width {Number} Width of canvas
   * @param paintAngle {Number} gradient angle
   * @return {Object} start-point and end-point co-ordinates of linear gradient
   * fill
   */
  var _computePaintLinearCoordinates = function(height, width, paintAngle) {
    // console.log("Inside CanvasPainter - computePaintLineCoordinates
    // function");
    var pie = 3.1428571429;
    var decisionAngle = Math.atan(height / width);
    var paintAngleInRadians = (paintAngle * pie / 180).toFixed(10);

    var paintLineCoordinates = {
      startPoint: {
        x: undefined,
        y: undefined
      },
      endPoint: {
        x: undefined,
        y: undefined
      }
    };

    var shouldSwapEndPoints = false;
    if (paintAngleInRadians > pie) {
      shouldSwapEndPoints = true;
      paintAngleInRadians -= pie;
    }

    //Check for the angle between 0 and 90 degrees. Cosine of such an angle is
    // always between 0 and 1.
    //Cosine of angle between 90 and 180 is between 0 and -1.
    if (Math.cos(paintAngleInRadians) >= 0) {
      if (paintAngleInRadians <= decisionAngle) {
        //between 0 degrees and decision-angle
        paintLineCoordinates.startPoint.x = 0;
        paintLineCoordinates.startPoint.y = parseFloat(((height - (width *
          Math.tan(paintAngleInRadians))) / 2).toFixed(2));
      } else {
        //between decision-angle and 90 degrees
        paintLineCoordinates.startPoint.x = parseFloat(((width - (height *
          Math.tan(paintAngleInRadians))) / 2).toFixed(2));
        paintLineCoordinates.startPoint.y = 0;
      }
    } else {
      if (paintAngleInRadians <= (pie - decisionAngle)) {
        //between 90 degrees and (180-decision-angle) degrees
        paintLineCoordinates.startPoint.x = parseFloat(((width - (height /
          Math.tan(paintAngleInRadians))) / 2).toFixed(2));
        paintLineCoordinates.startPoint.y = 0;
      } else {
        //between (180-decision-angle) degrees and 180 degrees
        paintLineCoordinates.startPoint.x = width;
        paintLineCoordinates.startPoint.y = parseFloat(((height - (width *
          Math.tan(pie - paintAngleInRadians))) / 2).toFixed(2));
      }
    }

    paintLineCoordinates.endPoint.x = width - paintLineCoordinates.startPoint.x;
    paintLineCoordinates.endPoint.y =
      height - paintLineCoordinates.startPoint.y;

    if (shouldSwapEndPoints) {
      var tempPoint = paintLineCoordinates.startPoint;
      paintLineCoordinates.startPoint = paintLineCoordinates.endPoint;
      paintLineCoordinates.endPoint = tempPoint;
    }

    return paintLineCoordinates;
  };

  /**
   * discards duplicate color-stops at stop-positions.
   * Also, re-arranges the color-stops and stop-positions, based on the
   * gradientAngle.
   * @param colorStopList {Array} array containing the color-stops from the DCP
   * @param angle {Number} gradient angle
   * @return {Array} re-arranged color-stops
   */
  var _computeColorStopsToApply = function(colorStopList, angle) {
    var stopPositionColorsMap = {};
    var tempColorStop, tempStopPosition;

    //creating the position,color-Array map
    for (var i = 0; i < colorStopList.length; i++) {
      tempColorStop = colorStopList[i];
      if (stopPositionColorsMap[tempColorStop.pos] === undefined) {
        stopPositionColorsMap[tempColorStop.pos] = [];
      }
      // handle theme color here
      var rgbaColor = ColorUtility.getColor(tempColorStop.color);
      stopPositionColorsMap[tempColorStop.pos].push({ 'clr': rgbaColor});
    }

    var colorStopsToApply = [];

    if (angle < 180) {
      //for angle between 0 and 179.9
      var maxPosition = -1;
      for (tempStopPosition in stopPositionColorsMap) {
        //picking the first color at all the stop-positions
        var firstColorAtPosition = stopPositionColorsMap[tempStopPosition][0];
        tempColorStop = {
          'pos': tempStopPosition,
          'clr': firstColorAtPosition.clr
        };
        colorStopsToApply.push(tempColorStop);

        //calculating the max stop-position
        maxPosition =
          (maxPosition < tempStopPosition) ? tempStopPosition : maxPosition;
      }

      //checking if the max stop-position has multiple colors
      var colorsAtMaxPosition = stopPositionColorsMap[maxPosition];
      if (colorsAtMaxPosition && colorsAtMaxPosition.length > 1) {
        //pick the last color at the max stop-position
        var lastColorAtMaxPosition =
          colorsAtMaxPosition[colorsAtMaxPosition.length - 1];
        var lastColorStop = {
          'pos': 100000,
          'clr': lastColorAtMaxPosition.clr
        };
        colorStopsToApply.push(lastColorStop);
      }

    } else {
      //for angle between 180 and 359.9
      var minPosition = 100001;
      for (tempStopPosition in stopPositionColorsMap) {
        //picking the last color at all the stop-positions
        var colorsAtPosition = stopPositionColorsMap[tempStopPosition];
        var lastColorAtPosition = colorsAtPosition[colorsAtPosition.length - 1];
        tempColorStop = {
          'pos': tempStopPosition,
          'clr': lastColorAtPosition.clr
        };
        colorStopsToApply.push(tempColorStop);

        //calculating the min stop-position
        minPosition =
          (minPosition > tempStopPosition) ? tempStopPosition : minPosition;
      }

      //checking if the min stop-position has multiple colors
      var colorsAtMinPosition = stopPositionColorsMap[minPosition];
      if (colorsAtMinPosition && colorsAtMinPosition.length > 1) {
        //pick the first color at the min stop-position
        var firstColorAtMinPosition = colorsAtMinPosition[0];
        var firstColorStop = {
          'pos': 0,
          'clr': firstColorAtMinPosition.clr
        };
        colorStopsToApply.push(firstColorStop);
      }
    }

    return colorStopsToApply;
  };

  /**
   * for gradient fill on canvas, adds the color stop to the linear gradient
   * object
   * @param gradientStop {Object} color-stop object with information of color,
   * position and alpha values
   * @param context {Object} canvas 2D context
   * @param fillPathAttribute {String} having value either - lighten /
   * lightenLess / darken / darkenLess
   * @param linearGradient {Object} canvas linear gradient object
   * @return {Object} returns color value, which is either a string or an array
   * for RGB representation
   */
  var _addColorStopToCanvasLinearGradient = function(gradientStop, context,
                                                     fillPathAttribute,
                                                     linearGradient) {
    var color = ColorUtility.handleLuminosity(gradientStop.clr, context,
      fillPathAttribute);
    linearGradient.addColorStop((gradientStop.pos / 100000).toFixed(2), color);
    return color;
  };

  /**
   * for gradient fill on DIV, adds the color stop to the color-stops array
   * @param gradientStop {Object} color-stop object with information of color,
   * position and alpha values
   * @param colorStops {Array} array of color-stops to be applied to the css
   * gradient-fill property
   */
  var _addColorStopToCSSLinearGradient = function(gradientStop, colorStops) {
    colorStops.push(gradientStop.clr + " " +
      (gradientStop.pos / 1000).toFixed(2) + "%");
  };

  /**
   * sorts the color-stop array based on stop-position
   * @param colorStops {Array} color-stop array
   * @return {Array} sorted color-stop based on stop-position
   */
  var _sortColorStops = function(colorStops) {
    var posArray = [];
    var posColorStopMap = {};
    for (var i = 0; i < colorStops.length; i++) {
      posArray.push(colorStops[i].pos);
      posColorStopMap[colorStops[i].pos] = colorStops[i];
    }

    posArray.sort(function(a, b) {
      return a - b;
    });

    var sortedColorStops = [];

    for (i = 0; i < posArray.length; i++) {
      sortedColorStops.push(posColorStopMap[posArray[i]]);
    }
    return sortedColorStops;
  };

  /**
   * returns the style for the DIV element
   * @param fill {Object} Fill JSON
   * @return gradientStyle {String} css style of element
   */
  var _computeGradientFillStyleForHTML = function(fill) {
    var gradientStyleValue = "none";
    if (fill.gsLst !== undefined) {

      //For linear gradient fill, calculate angle else make it 0.
      var angle = (fill.lin ? (fill.lin.angle ? fill.lin.angle : 0) : 0);

      var colorStops = _computeColorStopsToApply(fill.gsLst, angle);
      colorStops = _sortColorStops(colorStops);

      var colorStopsCssStringArr = [];

      for (var i = 0; i < colorStops.length; i++) {
        _addColorStopToCSSLinearGradient(colorStops[i], colorStopsCssStringArr);
      }

      if (fill.path && fill.path.pathShadeType === 'circle') {
        //for radial gradient fill
        var fillRect = fill.path.fillRect || {};
        gradientStyleValue = "-webkit-radial-gradient(" + (fillRect.l || 0) +
          "% " + (fillRect.t || 0) + "%, circle farthest-corner,";
      } else {
        //for linear gradient fill
        //for path and rectangular gradient fill, falling back to linear
        // gradient fill
        gradientStyleValue =
          "-webkit-linear-gradient(" + (360 - angle) + "deg, ";
      }

      gradientStyleValue += colorStopsCssStringArr;
      gradientStyleValue += ") ";
    }
    return gradientStyleValue;
  };

  /**
   * returns the style for the canvas element
   * @param canvas {DOM} shape canvas
   * @param context {Object} canvas 2D context
   * @param fillData {JSON} color fill data properties containing fill-type,
   * linear gradient angle, gradient list, etc.
   * @param fillPathAttribute {String} having value either - lighten /
   * lightenLess / darken / darkenLess
   *
   * @return gradientStyle {String} css style of element
   */

  var _computeGradientFillStyleForCanvas = function(canvas, context, fillData,
                                                    fillPathAttribute) {
    if (fillData.gsLst !== undefined) {
      // if gradientFill type is other than linear or radial, (i.e. path,
      // rectangular) then we fall back to linear
      var angle =
        (fillData.lin ? (fillData.lin.angle ? fillData.lin.angle : 0) : 0);

      var canvasGradientStyle;
      if (fillData.path && fillData.path.pathShadeType === 'circle') {
        //renderRadialCanvasGradient
        canvasGradientStyle =
          _renderRadialCanvasGradient(canvas, fillData, context);
      } else {
        //renderLinearCanvasGradient
        canvasGradientStyle =
          _renderLinearCanvasGradient(canvas, angle, context);
      }

      var colorStops = _computeColorStopsToApply(fillData.gsLst, angle);
      for (var i = 0; i < colorStops.length; i++) {
        _addColorStopToCanvasLinearGradient(colorStops[i], context,
            fillPathAttribute, canvasGradientStyle);
      }

      return canvasGradientStyle;
    }
    return "";
  };

  /**
   *
   * returns the linear gradient fill on canvas
   *
   * @param canvas {DOM} shape canvas
   * @param angle {int} the angle of the gradient fill
   * @param context {Object} canvas 2D context
   */
  var _renderLinearCanvasGradient = function(canvas, angle, context) {
    var paintLineCoordinates =
      _computePaintLinearCoordinates(canvas.height, canvas.width, angle);
    return context.createLinearGradient(paintLineCoordinates.startPoint.x,
      paintLineCoordinates.startPoint.y, paintLineCoordinates.endPoint.x,
      paintLineCoordinates.endPoint.y);
  };


  /**
   * returns radial gradient fill on canvas
   *
   * @param canvas {DOM} shape canvas
   * @param fillData {JSON} color fill data properties containing fill-type,
   * linear gradient angle, gradient list, etc.
   * @param context {Object} canvas 2D context
   */
  var _renderRadialCanvasGradient = function(canvas, fillData, context) {

    var greaterSide =
      (canvas.height > canvas.width) ? canvas.height : canvas.width;
    var fillRect = fillData.path.fillRect || {};
    var fillRectForx = fillRect.l || '0';
    var fillRectFory = fillRect.t || '0';
    var x;
    if (fillRectForx === "100") {
      //for leftmost
      x = canvas.width;
    } else if (fillRectForx === "50") {
      //for horizontal center
      x = canvas.width / 2;
    } else {
      x = 0;
    }
    var y;
    if (fillRectFory === "100") {
      //for topmost
      y = canvas.height;
    } else if (fillRectFory === "50") {
      //for vertical center
      y = canvas.height / 2;
    } else {
      y = 0;
    }
    var r1 = (greaterSide / 50);
    var r2 =
      ((fillRectForx === "50") ? (greaterSide * 3) / 5 : (greaterSide * 5) / 4);
    return context.createRadialGradient(x, y, r1, x, y, r2);
  };

  var _api = {
    /**
     * sets the canvas context style for fill of gradient-fill type
     * @param canvas {DOM} shape canvas
     * @param context {Object} canvas 2D context
     * @param fillData {JSON} color fill data properties containing fill-type,
     * linear gradient angle, gradient list, etc.
     * @param fillPathAttribute {String} having value either - lighten /
     * lightenLess / darken / darkenLess
     */
    fillCanvasContext: function(canvas, context, fillData, fillPathAttribute) {
      context.fillStyle = _computeGradientFillStyleForCanvas(canvas, context,
        fillData, fillPathAttribute);

      context.fill();
    },

    fillCanvasContextForBorders: function(canvas, context, fillData,
                                          fillPathAttribute) {

      context.strokeStyle = _computeGradientFillStyleForCanvas(canvas, context,
        fillData, fillPathAttribute);

      context.stroke();
    },

    /**
     * Handle gradient fill using HTML and CSS
     * @param fill The gradient fill JSON
     * @param element The gradient fill application target element
     */
    handleUsingHTML: function(fill, element) {
      // console.log("Inside GradientFillHandler - handleUsingHTML function");
      element.style["background-image"] =
        _computeGradientFillStyleForHTML(fill);
    },

    /**
     * Handle gradient fill using HTML and CSS
     * @param fill The gradient fill JSON
     * @param element The gradient fill application target element
     */
    handleBorderUsingHTML: function(fill) {
      return _computeGradientFillStyleForHTML(fill);
    },

    /**
     * returns the css style text for shape gradient-fill property
     * @param fill {Object} The solid fill JSON
     * @return styleText The css style to be applied to placeHolder shape
     */
    getStyleString: function(fill) {
      var style = {};
      style["background-image"] = _computeGradientFillStyleForHTML(fill);
      return DeprecatedUtils.getElementStyleString(style);
    }

  };

  return _api;
});
