/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

/**
 * Arrow properties renderer. handles arrows
 * @constructor
 */
define([
  'qowtRoot/dcp/utils/unitConversionUtils'
], function(UnitConversionUtils) {

  'use strict';


  var _api;

  /**
   * calculates the angle of the arrowhead wrt origin and returns array
   * which contains the set of all endpoint co-ordinates of the arrow
   * @param currHeadtype the type of the arrow -
   *                     oval/stealth/arrow/triangle/diamond
   * @param currentPoint endpoint co-ordinates of the actual line which has the
   *                     arrow
   * @param lastPoint  starting co-ordinates of the actual line which has the
   *                   arrow
   * @param linewidth the length of the arrowhead line
   * @param arrowtype (head or tail  whether the arrow to be drawn is at the
   *                  headend or tailend of the line
   * @param fillColorBean contains information about the arrow - arrow type,
   *                      arrowlength arrowWidth
   */
  var adjustArrow = function(currHeadtype, currentPoint, lastPoint, linewidth,
                             arrowtype, fillColorBean, cmdType) {
    var finalXY = {};
    var modx = (currentPoint.x - lastPoint.x);
    var mody = (currentPoint.y - lastPoint.y);
    var slope = mody / modx;
    var perpendicularSlope = 1 / (slope * -1);
    var perTheta = Math.atan(perpendicularSlope);
    var origTheta = Math.atan(slope);
    var pathCommandsForArrowHead = [];
    var finalXYHead, finalXYTail, thetaAndLw;
    var originPoint = {};
    if (arrowtype === "tail") {
      originPoint.x = 0;
      originPoint.y = 0;
      if (cmdType === "curvedArrow") {
        origTheta = origTheta + Math.PI;
      }
    } else {
      originPoint.x = lastPoint.x;
      originPoint.y = lastPoint.y;
    }
    if (origTheta === 0) {

      if (modx > 0) {
        origTheta = origTheta + Math.PI;
      }

      if (mody > 0) {
        origTheta = Math.PI / 2;
      }
      if (mody < 0) {
        origTheta = Math.PI * 3 / 2;
      }
    } else {
      if (arrowtype === "head") {
        origTheta = origTheta + Math.PI;
      }
    }
    if (arrowtype === "tail") {
      if (mody === 0) {
        origTheta = origTheta + Math.PI;
      }
    }
    if (currHeadtype) {
      var ArrowWidth =
        UnitConversionUtils.convertPixelToEmu(linewidth) || 12700;
      if (ArrowWidth < 25400) { //63500
        linewidth = linewidth * 10; //small
      } else if (ArrowWidth >= 25400 && ArrowWidth <= 127000) {
        linewidth = linewidth * 2; //medium
      }
      if (arrowtype === "tail") {
        thetaAndLw = getThetaAndLw(fillColorBean.ends.tailendlength,
          fillColorBean.ends.tailendwidth, origTheta, linewidth, arrowtype);
      } else {
        thetaAndLw = getThetaAndLw(fillColorBean.ends.headendlength,
          fillColorBean.ends.headendwidth, origTheta, linewidth, arrowtype);

      }
      switch (currHeadtype) {
        case "triangle":
        case "stealth":
          finalXY =
            generateArrowCoOrdinates(thetaAndLw, originPoint, origTheta);
          pathCommandsForArrowHead = generateCommandsForTriangle(originPoint,
            finalXY, currHeadtype, currentPoint, arrowtype);
          break;
        case "arrow":
          thetaAndLw.lw = linewidth;
          finalXY =
            generateArrowCoOrdinates(thetaAndLw, originPoint, origTheta);
          pathCommandsForArrowHead = generateCommandsForTriangle(originPoint,
            finalXY, currHeadtype, currentPoint, arrowtype);
          break;
        case "oval":
          pathCommandsForArrowHead.push({
            name: "save",
            args: []
          });
          if (arrowtype === "tail") {
            pathCommandsForArrowHead.push({
              name: "translate",
              args: [currentPoint.x, currentPoint.y]
            });
          } else {
            pathCommandsForArrowHead.push({
              name: "translate",
              args: [originPoint.x, originPoint.y]
            });
          }

          pathCommandsForArrowHead.push({
            name: "save",
            args: []
          });
          pathCommandsForArrowHead.push({
            name: "rotate",
            args: [origTheta + Math.PI / 2]
          });
          pathCommandsForArrowHead.push({
            name: "save",
            args: []
          });
          pathCommandsForArrowHead.push({
            name: "scale",
            args: [thetaAndLw.scaleX, thetaAndLw.scaleY]
          });
          pathCommandsForArrowHead.push({
            name: "beginPath",
            args: []
          });
          pathCommandsForArrowHead.push({
            name: "arc",
            args: [0, 0, linewidth / 1.5, 0, (2 * (Math.PI)), "true"]
          });
          pathCommandsForArrowHead.push({
            name: "closePath",
            args: []
          });
          pathCommandsForArrowHead.push({
            name: "restore",
            args: []
          });
          pathCommandsForArrowHead.push({
            name: "restore",
            args: []
          });
          pathCommandsForArrowHead.push({
            name: "restore",
            args: []
          });
          pathCommandsForArrowHead.arrowFill = true;
          break;
        case "diamond":
          finalXYHead =
            calculateCoOrdinates(perTheta, originPoint, thetaAndLw.d2);
          perTheta = perTheta + Math.PI;
          finalXYTail =
            calculateCoOrdinates(perTheta, originPoint, thetaAndLw.d2);
          finalXY.x1 = finalXYHead.x;
          finalXY.y1 = finalXYHead.y;
          finalXY.x2 = finalXYTail.x;
          finalXY.y2 = finalXYTail.y;
          finalXYHead =
            calculateCoOrdinates(origTheta, originPoint, thetaAndLw.d1);
          perTheta = origTheta + Math.PI;
          finalXYTail =
            calculateCoOrdinates(perTheta, originPoint, thetaAndLw.d1);
          finalXY.x3 = finalXYHead.x;
          finalXY.y3 = finalXYHead.y;
          finalXY.x4 = finalXYTail.x;
          finalXY.y4 = finalXYTail.y;
          if (arrowtype === "tail") {
            pathCommandsForArrowHead.push({
              name: "save",
              args: []
            });
            pathCommandsForArrowHead.push({
              name: "translate",
              args: [currentPoint.x, currentPoint.y]
            });
          }
          pathCommandsForArrowHead.push({
            name: "beginPath",
            args: []
          });
          pathCommandsForArrowHead.push({
            name: "moveTo",
            args: [originPoint.x, originPoint.y]
          });
          pathCommandsForArrowHead.push({
            name: "moveTo",
            args: [finalXY.x1, finalXY.y1]
          });
          pathCommandsForArrowHead.push({
            name: "lineTo",
            args: [finalXY.x3, finalXY.y3]
          });
          pathCommandsForArrowHead.push({
            name: "lineTo",
            args: [finalXY.x2, finalXY.y2]
          });
          pathCommandsForArrowHead.push({
            name: "lineTo",
            args: [finalXY.x4, finalXY.y4]
          });
          pathCommandsForArrowHead.push({
            name: "closePath",
            args: []
          });
          pathCommandsForArrowHead.push({
            name: "moveTo",
            args: [originPoint.x, originPoint.y]
          });
          if (arrowtype === "tail") {
            pathCommandsForArrowHead.push({
              name: "restore",
              args: []
            });
          }
          pathCommandsForArrowHead.arrowFill = true;
          break;
        default:
          break;
      }
    }
    return pathCommandsForArrowHead;
  };


  /**
   * calculates the angle of the arrowhead wrt origin and returns array
   * which contains the set of all endpoint co-ordinates of the arrow
   * @param headendlength the length of arrowhead - long/medium/small
   * @param headendwidth the width of arrowhead - large/medium/small
   * @param theta  angle between actual line and arrow end
   * @param linewidth the length of the arrowhead line
   * @param arrowtype (head or tail  whether the arrow to be drawn is at the
   *                  headend or tailend of the line
   */
  var getThetaAndLw = function(headendlength, headendwidth, theta, linewidth
                                  /* arrowType */) {
    var piDivisionalFactorObj = {
      'long': {
        large: 6,
        medium: 12,
        small: 12,
        def: 6
      },
      medium: {
        large: 4,
        medium: 6,
        small: 12,
        def: 6
      },
      small: {
        large: 3,
        medium: 4,
        small: 6,
        def: 4
      },
      def: {
        large: 6,
        medium: 6,
        small: 6,
        def: 6
      }
    };

    var diagonalLengthFactor = {
      'long': 2 / 3,
      'large': 2 / 3,
      medium: 1 / 2,
      small: 1 / 3
    };

    var scaleFactor = {
      'long': 1,
      large: 1,
      medium: 1 / 2,
      small: 1 / 3
    };

    var lineWidthForArrow = (headendlength === 'long' ||
      headendlength === 'medium') ? linewidth : linewidth / 2;

    var stealthLineWidth;
    if (headendlength === undefined) {
      stealthLineWidth = linewidth / 3;
    } else if (headendlength === 'small' || headendwidth === 'large') {
      stealthLineWidth = 2 * lineWidthForArrow / 5;
    } else {
      stealthLineWidth = 2 * lineWidthForArrow / 3;
    }

    var dimensions = [];
    dimensions.theta1 = theta - Math.PI /
      piDivisionalFactorObj[headendlength || 'def'][headendwidth || 'def'];
    dimensions.theta2 = theta + Math.PI /
      piDivisionalFactorObj[headendlength || 'def'][headendwidth || 'def'];

    dimensions.scaleX = scaleFactor[headendwidth];
    dimensions.scaleY = scaleFactor[headendlength];

    dimensions.lw = lineWidthForArrow;
    dimensions.stlw = stealthLineWidth;

    dimensions.d1 = linewidth * diagonalLengthFactor[headendlength];
    dimensions.d2 = linewidth * diagonalLengthFactor[headendwidth];
    return dimensions;
  };

  /**
   * generates the HTML commands for triangle or stealth arrow and returns them
   * @param originPoint co-ordinates of the line origin
   * @param finalXY co-ordinates of the arrow endpoints
   * @param currHeadtype specifies whether the arrow is of type triangle or
   *                     stealth
   * @param currentPoint the co-ordinates of the line endpoint
   * @param arrowtype specifies whether arrow should be drawn at headEnd or
   *                  tailEnd
   */
  var generateCommandsForTriangle = function(originPoint, finalXY, currHeadtype,
                                             currentPoint, arrowtype) {
    var pathCommandsForArrowHead = [];
    pathCommandsForArrowHead.push({
      name: "save",
      args: []
    });
    switch (currHeadtype) {
      case "stealth":
        pathCommandsForArrowHead.push({
          name: "lineJoin",
          args: ["miter"]
        });
        pathCommandsForArrowHead.push({
          name: "save",
          args: []
        }); //arrow
        pathCommandsForArrowHead.push({
          name: "lineCap",
          args: ["miter"]
        });
        pathCommandsForArrowHead.arrowFill = true;
        break;
      case "triangle":
        pathCommandsForArrowHead.push({
          name: "lineJoin",
          args: ["miter"]
        });
        pathCommandsForArrowHead.arrowFill = true;
        break;
      case "arrow":
        pathCommandsForArrowHead.push({
          name: "lineJoin",
          args: ["miter"]
        });
        pathCommandsForArrowHead.push({
          name: "save",
          args: []
        }); //arrow
        pathCommandsForArrowHead.push({
          name: "lineCap",
          args: ["round"]
        });
        pathCommandsForArrowHead.arrowFill = false;
        break;
      default:
        break;
    }
    if (arrowtype === "tail") {
      pathCommandsForArrowHead.push({
        name: "save",
        args: []
      });
      pathCommandsForArrowHead.push({
        name: "translate",
        args: [currentPoint.x, currentPoint.y]
      });
    }

    pathCommandsForArrowHead.push({
      name: "beginPath",
      args: []
    });
    pathCommandsForArrowHead.push({
      name: "moveTo",
      args: [originPoint.x, originPoint.y]
    });
    switch (currHeadtype) {
      case "stealth":
        pathCommandsForArrowHead.push({
          name: "lineTo",
          args: [finalXY.x1, finalXY.y1]
        });
        pathCommandsForArrowHead.push({
          name: "lineTo",
          args: [finalXY.x3, finalXY.y3]
        }); //extra from triangle
        pathCommandsForArrowHead.push({
          name: "lineTo",
          args: [finalXY.x2, finalXY.y2]
        }); //triangle
        pathCommandsForArrowHead.push({
          name: "lineTo",
          args: [originPoint.x, originPoint.y]
        });
        break;
      case "triangle":
        pathCommandsForArrowHead.push({
          name: "lineTo",
          args: [finalXY.x1, finalXY.y1]
        });
        pathCommandsForArrowHead.push({
          name: "lineTo",
          args: [finalXY.x2, finalXY.y2]
        }); //triangle
        pathCommandsForArrowHead.push({
          name: "lineTo",
          args: [originPoint.x, originPoint.y]
        });
        break;
      case "arrow":
        pathCommandsForArrowHead.push({
          name: "moveTo",
          args: [finalXY.x1, finalXY.y1]
        });
        pathCommandsForArrowHead.push({
          name: "lineTo",
          args: [originPoint.x, originPoint.y]
        });
        pathCommandsForArrowHead.push({
          name: "lineTo",
          args: [finalXY.x2, finalXY.y2]
        }); //arrow
        pathCommandsForArrowHead.push({
          name: "moveTo",
          args: [originPoint.x, originPoint.y]
        });
        break;
      default:
        break;
    }
    pathCommandsForArrowHead.push({
      name: "closePath",
      args: []
    });
    pathCommandsForArrowHead.push({
      name: "restore",
      args: []
    });
    pathCommandsForArrowHead.push({
      name: "restore",
      args: []
    });
    if (arrowtype === "tail") {
      pathCommandsForArrowHead.push({
        name: "restore",
        args: []
      });
    }

    return pathCommandsForArrowHead;
  };


  /**
   * generates the arrow co-ordinates for triangle or stealth arrow and returns
   * them
   * @param thetaAndLw the angle and length of the arrow end
   * @param originPoint the co-ordinates of the origin of the line for which
   *                    arrow is to be drawn
   * @param origTheta the slope of original line
   */
  var generateArrowCoOrdinates = function(thetaAndLw, originPoint, origTheta) {
    var finalXYHead = [];
    var finalXYTail = [];
    var finalXY = [];
    finalXYHead =
      calculateCoOrdinates(thetaAndLw.theta1, originPoint, thetaAndLw.lw);
    finalXYTail =
      calculateCoOrdinates(thetaAndLw.theta2, originPoint, thetaAndLw.lw);
    finalXY.x1 = finalXYHead.x;
    finalXY.y1 = finalXYHead.y;
    finalXY.x2 = finalXYTail.x;
    finalXY.y2 = finalXYTail.y;
    var finalXYStealth =
      calculateCoOrdinates(origTheta, originPoint, thetaAndLw.stlw);
    finalXY.x3 = finalXYStealth.x;
    finalXY.y3 = finalXYStealth.y;
    return finalXY;
  };

  /**
   * calculates the co-ordinates of the arrowhead endpoints and returns the x
   * and y values
   * @param theta angle of the arrow head wrt origin
   * @param lastPoint origin co-ordinates
   * @param linewidth the length of the arrowhead line
   */
  var calculateCoOrdinates = function(theta, lastPoint, linewidth) {

    var finalX, finalY;

    var finalXY = {};
    var newCentre = lastPoint;
    if (theta < 0) //if negative, subtract it from 360 degree
    {
      theta = (2 * Math.PI) + (theta);
    } else if (theta > (Math.PI * 2)) {
      theta = theta - Math.PI * 2;
    }

    if (theta >= 0 && theta <= (Math.PI / 2)) { // 1st quadrant
      theta = (Math.PI / 2) - theta;
      finalX = newCentre.x - Math.ceil((Math.sin(theta) * linewidth));
      finalY = newCentre.y - Math.ceil((Math.cos(theta) * linewidth));
    }
    // 2nd quadrant
    else if (theta >= (Math.PI / 2) && theta <= (Math.PI)) {
      theta = (Math.PI) - theta;
      finalX = newCentre.x + Math.ceil((Math.cos(theta) * linewidth));
      finalY = newCentre.y - Math.ceil((Math.sin(theta) * linewidth));
    }
    // 3rd quadrant
    else if (theta >= (Math.PI) && theta <= (3 * Math.PI / 2)) {
      theta = (3 * Math.PI / 2) - theta;
      finalX = newCentre.x + Math.ceil((Math.sin(theta) * linewidth));
      finalY = newCentre.y + Math.ceil((Math.cos(theta) * linewidth));
    }
    // 4th quadrant
    else if (theta >= (3 * Math.PI / 2) && theta <= (2 * Math.PI)) {
      theta = (2 * Math.PI) - theta;
      finalX = newCentre.x - Math.ceil((Math.cos(theta) * linewidth));
      finalY = newCentre.y + Math.ceil((Math.sin(theta) * linewidth));
    }

    finalXY.x = finalX;
    finalXY.y = finalY;
    return finalXY;
  };

  _api = {

    /**
     * iterates through the pathlist
     * calls adjustarrow function for generating arrow paths
     * appends the arrowhead and arrowTail paths to the pathlist array and
     * returns it
     * @param pathList the pathlist array
     * @param fillColorBean contains information about the arrow - arrow type,
     *                      arrowlength arrowWidth
     */
    handle: function(fillColorBean, pathList) {
      // console.log("Inside ArrowPathGenerator - handle function" +
      // fillColorBean);
      var currHeadtype,
          currTailtype,
          tailCommands = [],
          headCommands = [],
          linewidth = fillColorBean.outlineFill.lineWidth,
          arrowtype,
          headCommandsAdded = 0,
          tailCommandsAdded = 0;

      for (var i = 0, pathListLength = pathList.length; i < pathListLength; i++)
      {
        var cnt = 0;
        var lastPoint = {};
        var currentPoint = {};
        var path = pathList[i];
        for (var j = 0, pathLength = path.length; j < pathLength; j++) {
          var command = path[j];
          var type = command.name;
          var argsArray = command.args;

          switch (type) {
            case "lineTo":
            case "moveTo":
              currentPoint.x = argsArray[0];
              currentPoint.y = argsArray[1];
              //The cnt is checked for 2 here, as we are assuming that the first
              // instruction is going to be biginPath always
              // as per the code in GeometryGuideEvaluator
              if (cnt === 2 && (fillColorBean.ends.headendtype) &&
                fillColorBean.ends.headendtype !== "none") {
                arrowtype = "head";
                currHeadtype = fillColorBean.ends.headendtype;
                headCommands = adjustArrow(currHeadtype, currentPoint,
                  lastPoint, linewidth, arrowtype, fillColorBean);
                headCommandsAdded = 1;
              }
              if (cnt === pathLength - 1 && (fillColorBean.ends.tailendtype) &&
                fillColorBean.ends.tailendtype !== "none") {
                arrowtype = "tail";
                currTailtype = fillColorBean.ends.tailendtype;
                tailCommands = adjustArrow(currTailtype, currentPoint,
                  lastPoint, linewidth, arrowtype, fillColorBean);
                tailCommandsAdded = 1;
              }
              lastPoint.x = currentPoint.x;
              lastPoint.y = currentPoint.y;
              break;
            case "quadraticCurveTo":
            case "bezierCurveTo":
              currentPoint.x = argsArray[4];
              currentPoint.y = argsArray[5];
              //The cnt is checked for 2 here, as we are assuming that the first
              // instruction is going to be biginPath always
              // as per the code in GeometryGuideEvaluator
              if (cnt === 2 && (fillColorBean.ends.headendtype) &&
                fillColorBean.ends.headendtype !== "none") {
                arrowtype = "head";
                currHeadtype = fillColorBean.ends.headendtype;
                headCommands = adjustArrow(currHeadtype, currentPoint,
                  lastPoint, linewidth, arrowtype, fillColorBean);
                headCommandsAdded = 1;
              } else if (cnt === pathLength - 1 &&
                (fillColorBean.ends.tailendtype) &&
                fillColorBean.ends.tailendtype !== "none") {
                arrowtype = "tail";
                currTailtype = fillColorBean.ends.tailendtype;
                tailCommands =
                  adjustArrow(currTailtype, currentPoint, lastPoint, linewidth,
                    arrowtype, fillColorBean, "curvedArrow");
                tailCommandsAdded = 1;
              }
              lastPoint.x = currentPoint.x;
              lastPoint.y = currentPoint.y;
              //TODO: figure out formula for calculating last-point for
              // quadratic and bezier curves
              break;
            default:
              // do nothing
              break;
          }
          cnt = cnt + 1;
        }
      }

      if ((fillColorBean.ends.headendtype) &&
        fillColorBean.ends.headendtype !== "none" && headCommandsAdded === 1) {
        headCommands.stroke = pathList.stroke;
        headCommands.fill = "norm";
        headCommands.lineEnd = true;
        pathList.unshift(headCommands);
      }
      if ((fillColorBean.ends.tailendtype) &&
        fillColorBean.ends.tailendtype !== "none" && tailCommandsAdded === 1) {
        tailCommands.stroke = pathList.stroke;
        tailCommands.fill = "norm";
        tailCommands.lineEnd = true;
        pathList.push(tailCommands);
      }
    }
  };


  return _api;
});
