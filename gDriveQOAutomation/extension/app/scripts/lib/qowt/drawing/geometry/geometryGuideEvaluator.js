/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

define([
  'qowtRoot/dcp/utils/unitConversionUtils',
  'qowtRoot/drawing/geometry/formula',
  'qowtRoot/drawing/geometry/preDefinedGuideMap'
], function(UnitConversionUtils, Formula, PredefinedGuideMap) {

  'use strict';

  var _convertEmuToPixel = UnitConversionUtils.convertEmuToPixel;

  var _api;

  /**
   * fetches the pre-defined guide elements' value. If element is not there in
   * pre-defined guide, and element is a number, then return the element itself,
   * else return undefined.
   * @param preDefinedGuide pre-defined guide
   * @param element pre-defined guide element
   */
  var _getGuideValue = function(preDefinedGuide, element) {
    var property;
    switch (element) {
      case "3cd4":
        property = "threeCD4";
        break;
      case "3cd8":
        property = "threeCD8";
        break;
      case "5cd8":
        property = "fiveCD8";
        break;
      case "7cd8":
        property = "sevenCD8";
        break;
      default:
        property = element;
        break;
    }

    if (!isNaN(property)) {
      return element;
    }

    return preDefinedGuide[property];
  };

  /**
   * replaces the variables with their values in the preDefinedGuide
   * @param args arguments to be passed to the operation
   * @param preDefinedGuide pre-defined guide
   */
  var _quantifyExpressionArguments = function(args, preDefinedGuide) {
    for (var i = 0; i < args.length; i++) {
      var value = _getGuideValue(preDefinedGuide, args[i]);
      if (value !== undefined) {
        args[i] = value;
      }
    }
  };

  /**
   * updates the margin-properties, accounting for the current point being drawn
   * @param x x-coordinate of the current point
   * @param y y-coordinate of the current point
   * @param marginProperties {Object} object having margin properties defined -
   *                          x-min, x-max, y-min, y-max
   */
  var _updateMarginProperties = function(x, y, marginProperties) {
    if (x < marginProperties.xMin) {
      marginProperties.xMin = x;
    }
    if (x > marginProperties.xMax) {
      marginProperties.xMax = x;
    }
    if (y < marginProperties.yMin) {
      marginProperties.yMin = y;
    }
    if (y > marginProperties.yMax) {
      marginProperties.yMax = y;
    }
  };

  /**
   * set proper margins and add to paths array
   * @param paths {Object} array containing all the paths
   * @param width {Number} width of the shape
   * @param height {Number} height of the shape
   * @param marginProperties {Object} object having margin properties defined -
   *                          x-min, x-max, y-min, y-max
   */
  var _setMargins = function(paths, width, height, marginProperties) {
    paths.topMargin =
      marginProperties.yMin < 0 ? marginProperties.yMin * -1 : 0;
    paths.leftMargin =
      marginProperties.xMin < 0 ? marginProperties.xMin * -1 : 0;
    paths.rightMargin =
      marginProperties.xMax > width ? marginProperties.xMax - width : 0;
    paths.bottomMargin =
      marginProperties.yMax > height ? marginProperties.yMax - height : 0;
  };

  _api = {
    /**
     * evaluates pre-defined guide
     * @param height height of the shape
     * @param width width of the shape
     * @return pre-defined guide
     */
    evaluatePreDefinedGuide: function(height, width) {
      // console.log("Inside Geometry Guide Evaluator - evaluatePreDefinedGuide
      // function");
      var preDefinedGuide = {
        w: width,
        h: height,
        shortestSide: (parseInt(height, 10) < parseInt(width, 10)) ? height :
          width
      };

      var guideFormulae = PredefinedGuideMap;
      for (var guideItem in guideFormulae) {
        if (guideFormulae[guideItem] !== undefined) {
          var expressionArray = guideFormulae[guideItem].split(" ");

          var args = expressionArray.slice(1);
          _quantifyExpressionArguments(args, preDefinedGuide);

          preDefinedGuide[guideItem] =
            Formula.evaluateExpression(expressionArray[0], args);
        }
      }

      return preDefinedGuide;
    },

    /**
     * evaluates adjust-value / preset-guide lists
     * @param preDefinedGuide pre-defined guide
     * @param guideList adjust-value / preset-guide lists
     */
    evaluateGuideList: function(preDefinedGuide, guideList) {
      // console.log("Inside Geometry Guide Evaluator - evaluateGuideList
      // function");
      if (guideList !== undefined) {

        var guideListLength = guideList.length;
        for (var i = 0; i < guideListLength; i++) {
          // we need to clone this args in order to not change the preset
          // objects. If preset objects themselves are changed then as they are
          // all singletons, next time we render the same shape, all old values
          // will be used.
          var formulaArgs = guideList[i].fmla.args.slice(0);
          _quantifyExpressionArguments(formulaArgs, preDefinedGuide);

          preDefinedGuide[guideList[i].gname] =
            Formula.evaluateExpression(guideList[i].fmla.op, formulaArgs);
        }
      }
    },

    /**
     * evaluates path-list for the shape
     * @param preDefinedGuide pre-defined guide
     * @param pathList path list
     * @param height geometry height
     * @param width geometry width
     * @return double-dimension array of paths, with path-commands in each path
     */
    evaluatePathList: function(preDefinedGuide, pathList, height, width) {
      // console.log("Inside Geometry Guide Evaluator - evaluatePathList
      // function");
      var marginProperties = {
        xMin: 0,
        xMax: 0,
        yMin: 0,
        yMax: 0
      };

      //TODO: handling remains for drawing of call-outs and creation of
      // path-list accordingly.
      var paths = [];

      for (var i = 0, plen = pathList.length; i < plen; i++) {
        var path = pathList[i];
        var pathCommands = [];
        var lastPoint = {};
        var scaleX = 1;
        var scaleY = 1;

        if (path.w) {
          scaleX = width / path.w;
        }
        if (path.h) {
          scaleY = height / path.h;
        }

        var operation;
        var cnt = 0;
        var piRadiansAngularConstant = (Math.PI / 180) / 60000;
        var pieBy2 = parseFloat((Math.PI / 2).toFixed(4));
        var twoPi = parseFloat((Math.PI * 2).toFixed(4));
        var threePiBy2 = parseFloat((3 * pieBy2).toFixed(4));

        // path.paths is optional. Can be Empty.
        var olen = path.paths ? path.paths.length || 0 : 0;

        for (var k = 0; k < olen; k++) {
          var pathOperation = path.paths[k];
          cnt = cnt + 1;
          var type = pathOperation.pathType;
          operation = {
            name: undefined,
            args: []
          };

          var x, y;
          switch (type) {
            case "arcTo":

              // in case of custom geometry, preDefinedGuide will always be
              // undefined, and no need to make call to _getGuideValue
              var heightRadius, widthRadius, startAngle, swingAngle;
              if (preDefinedGuide === undefined) {
                heightRadius = _convertEmuToPixel(pathOperation.hr);
                widthRadius = _convertEmuToPixel(pathOperation.wr);
                startAngle = pathOperation.stAng * piRadiansAngularConstant;
                swingAngle = pathOperation.swAng * piRadiansAngularConstant;
              } else {
                heightRadius = _convertEmuToPixel(
                  _getGuideValue(preDefinedGuide, pathOperation.hr));
                widthRadius = _convertEmuToPixel(
                  _getGuideValue(preDefinedGuide, pathOperation.wr));
                startAngle = _getGuideValue(preDefinedGuide,
                  pathOperation.stAng) * piRadiansAngularConstant;
                swingAngle = _getGuideValue(preDefinedGuide,
                  pathOperation.swAng) * piRadiansAngularConstant;
              }
              var isAntiClockwiseDirection = false;
              if (swingAngle < 0) {
                isAntiClockwiseDirection = true;
              }


              if (startAngle < 0) {
                startAngle = twoPi + startAngle;
              }
              var endAngle = parseFloat((startAngle + swingAngle).toFixed(4));
              if (endAngle > twoPi) {
                endAngle = parseFloat((endAngle - twoPi).toFixed(4));
              } else if (endAngle < 0) {
                endAngle = parseFloat((twoPi + endAngle).toFixed(4));
              }

              startAngle = parseFloat(startAngle.toFixed(4));
              if (startAngle === endAngle) {
                endAngle = endAngle + twoPi;
              }

              var xCenter, yCenter;
              x = lastPoint.x;
              y = lastPoint.y;

              widthRadius = Math.ceil(widthRadius * scaleX);
              heightRadius = Math.ceil(heightRadius * scaleY);
              var theta;
              if (startAngle >= 0 && startAngle <= pieBy2) { // 1st quadrant
                theta = pieBy2 - startAngle;
                xCenter = x - Math.ceil((Math.sin(theta) * widthRadius));
                yCenter = y - Math.ceil((Math.cos(theta) * heightRadius));
              }
              // 2nd quadrant
              else if (startAngle >= pieBy2 && startAngle <= (Math.PI)) {
                theta = (Math.PI) - startAngle;
                xCenter = x + Math.ceil((Math.cos(theta) * widthRadius));
                yCenter = y - Math.ceil((Math.sin(theta) * heightRadius));
              }
              // 3rd quadrant
              else if (startAngle >= (Math.PI) && startAngle <= threePiBy2) {
                theta = threePiBy2 - startAngle;
                xCenter = x + Math.ceil((Math.sin(theta) * widthRadius));
                yCenter = y + Math.ceil((Math.cos(theta) * heightRadius));
              }
              // 4th quadrant
              else if (startAngle >= threePiBy2 && startAngle <= twoPi) {
                theta = twoPi - startAngle;
                xCenter = x - Math.ceil((Math.cos(theta) * widthRadius));
                yCenter = y + Math.ceil((Math.sin(theta) * heightRadius));
              }

              pathCommands.push({
                name: 'save',
                args: []
              });
              var scaleOperation;
              var scaleOp = 0;
              var nXCenter = xCenter;
              var nYCenter = yCenter;
              var radius;
              if (widthRadius > heightRadius) {
                scaleOp = parseFloat((widthRadius / heightRadius).toFixed(4));
                scaleOperation = {
                  name: 'scale',
                  args: [
                    scaleOp, 1]
                };
                nXCenter = xCenter / (scaleOp);
                radius = heightRadius;
              } else {
                scaleOp = parseFloat((heightRadius / widthRadius).toFixed(4));
                scaleOperation = {
                  name: 'scale',
                  args: [
                    1, scaleOp]
                };
                nYCenter = yCenter / (scaleOp);
                radius = widthRadius;
              }

              pathCommands.push(scaleOperation);

              var arcOperation = {
                name: 'arc',
                args: [nXCenter, nYCenter, radius, startAngle, endAngle,
                  isAntiClockwiseDirection]
              };
              pathCommands.push(arcOperation);

              operation.name = "restore";
              operation.args = [];

              //Calculate the end point of the arc.
              x = xCenter;
              y = yCenter;

              if (endAngle >= 0 && endAngle <= pieBy2) { // 1st quadrant
                theta = pieBy2 - endAngle;
                lastPoint.x = x + Math.ceil((Math.sin(theta) * widthRadius));
                lastPoint.y = y + Math.ceil((Math.cos(theta) * heightRadius));
              }
              // 2nd quadrant
              else if (endAngle >= pieBy2 && endAngle <= Math.PI) {
                theta = (Math.PI) - endAngle;
                lastPoint.x = x - Math.ceil((Math.cos(theta) * widthRadius));
                lastPoint.y = y + Math.ceil((Math.sin(theta) * heightRadius));
              }
              // 3rd quadrant
              else if (endAngle >= Math.PI && endAngle <= threePiBy2) {
                theta = threePiBy2 - endAngle;
                lastPoint.x = x - Math.ceil((Math.sin(theta) * widthRadius));
                lastPoint.y = y - Math.ceil((Math.cos(theta) * heightRadius));
              }
              // 4th quadrant
              else if (endAngle >= threePiBy2 && endAngle <= twoPi) {
                theta = twoPi - endAngle;
                lastPoint.x = x + Math.ceil((Math.cos(theta) * widthRadius));
                lastPoint.y = y - Math.ceil((Math.sin(theta) * heightRadius));
              }
              break;

            case "close":
              operation.name = "closePath";
              operation.args = [];
              break;

            case "lnTo":
            case "moveTo":

              if (type === "moveTo") {
                // We should only call beginPath when this is the first time we
                // are moving to a location or if we have closed a previous
                // path.
                if (pathCommands.length === 0) {
                  pathCommands.push({
                    name: 'beginPath',
                    args: []
                  });
                }
              }

              // in case of custom geometry, preDefinedGuide will always be
              // undefined, and no need to make call to _getGuideValue
              if (preDefinedGuide === undefined) {
                x = _convertEmuToPixel(pathOperation.pt.x);
                y = _convertEmuToPixel(pathOperation.pt.y);
              } else {
                x = _convertEmuToPixel(_getGuideValue(preDefinedGuide,
                  pathOperation.pt.x));
                y = _convertEmuToPixel(_getGuideValue(preDefinedGuide,
                  pathOperation.pt.y));
              }
              x = Math.ceil(x * scaleX);
              y = Math.ceil(y * scaleY);
              operation.name = (type === "lnTo") ? "lineTo" : "moveTo";
              operation.args = [x, y];
              lastPoint.x = x;
              lastPoint.y = y;
              break;

            case "cubicBezTo":
            case "quadBezTo":
              var BezToPoints = pathOperation.pts;
              var BezToValues = [];
              for (var j = 0, len = BezToPoints.length; j < len; j++) {
                var BezToPoint = BezToPoints[j];
                if (preDefinedGuide === undefined) {
                  x = _convertEmuToPixel(BezToPoint.x);
                  y = _convertEmuToPixel(BezToPoint.y);
                } else {
                  x = _convertEmuToPixel(_getGuideValue(preDefinedGuide,
                    BezToPoint.x));
                  y = _convertEmuToPixel(_getGuideValue(preDefinedGuide,
                    BezToPoint.y));
                }
                x = Math.ceil(x * scaleX);
                y = Math.ceil(y * scaleY);
                BezToValues.push(x);
                BezToValues.push(y);
                if (j === len - 1) {
                  lastPoint.x = x;
                  lastPoint.y = y;
                }
              }

              operation.name =
                (type === "quadBezTo") ? "quadraticCurveTo" : "bezierCurveTo";
              operation.args = BezToValues;


              //TODO: figure out formula for calculating last-point for
              // quadratic and bezier curves
              break;

            default:
              //TODO if we are here then unknown operation encountered, throw
              // exception.
              break;
          }

          pathCommands.push(operation);

          _updateMarginProperties(lastPoint.x, lastPoint.y, marginProperties);
        }
        pathCommands.fill = path.fill;
        pathCommands.stroke = path.stroke;
        paths.push(pathCommands);
      }
      var w = _convertEmuToPixel(width);
      var h = _convertEmuToPixel(height);

      _setMargins(paths, w, h, marginProperties);

      return paths;
    }
  };


  return _api;
});
