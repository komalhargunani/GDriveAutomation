/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

define([], function() {

  'use strict';


  var _api;

  /**
   * unit to convert degrees to fractional degrees
   * TODO need to verify it if its really needed
   */
  var FD_CONSTANT = 60000;

  // PRIVATE METHODS
  /**
   * ('* /') - Multiplication and division. Rounds up.
   * Arguments: 3 (fmla="* / x y z")
   * Usage: "* / x y z" = ((x * y) / z) = value of this guide
   * @param x the x value
   * @param y the y value
   * @param z the z value
   * @return calculated value as per formula
   */
  var multiplyDivide = function(x, y, z) {
    return ((parseFloat(x) * parseFloat(y)) / parseFloat(z));
  };

  /**
   * ('+-') - Addition and subtraction. Exact.
   * Arguments: 3
   * (fmla="+- x y z")
   * Usage: "+- x y z" = ((x + y) - z) = value of this guide
   * @param x the x value
   * @param y the y value
   * @param z the z value
   * @return calculated value as per formula
   */
  var addSubtract = function(x, y, z) {
    return ((parseFloat(x) + parseFloat(y)) - parseFloat(z));
  };

  /**
   * ('+/') - Addition and Division. Rounds up.
   * Arguments: 3
   * (fmla="+/ x y z")
   * Usage: "+/ x y z" = ((x + y) / z) = value of this guide
   * @param x the x value
   * @param y the y value
   * @param z the z value
   * @return calculated value as per formula
   */
  var addDivide = function(x, y, z) {
    return Math.floor((parseFloat(x) + parseFloat(y)) / parseFloat(z));
  };

  /**
   * ('?:') - Conditional selection. Exact.
   * Arguments: 3
   * (fmla="?: x y z")
   * Usage: "?: x y z" = if (x > 0), then y = value of this guide,
   *                     else z = value of this guide
   * @param x the x value
   * @param y the y value
   * @param z the z value
   * @return calculated value as per formula
   */
  var ifElse = function(x, y, z) {
    return parseFloat(x) > 0 ? parseFloat(y) : parseFloat(z);
  };

  /**
   * ('abs') - Absolute value. Exact.
   * Arguments: 1
   * (fmla="abs x")
   * Usage: "abs x" = if (x < 0), then (-1) * x = value of this guide
   *                  else x = value of this guide
   * @param x the x value
   * @return calculated value as per formula
   */
  var abs = function(x) {
    return Math.abs(x);
  };

  /**
   *('at2') - Trigonometric arc tangent of a quotient.
   * Arguments: 2
   * (fmla="at2 x y")
   * Usage: "at2 x y" = arctan(y / x) = value of this guide
   * @param x the x value
   * @param y the y value
   * @return calculated value as per formula
   */
  var at2 = function(x, y) {
    return parseFloat(Math.atan2(y, x).toFixed(4));
  };

  /**
   * For shapes like multiply its was observed that return value of at2
   * must be in FD_CONSTANT degrees. Hence creating this at2Modified function
   * Usage: "at2 x y" = arctan(y / x) = value of this guide
   * @param x the x value
   * @param y the y value
   * @return calculated value as per formula
   */
  var at2Modified = function(x, y) {
    return parseFloat((Math.atan2(y, x) * FD_CONSTANT * 180 / Math.PI).
      toFixed(4));
  };

  /**
   * ('cat2') - Cosine ArcTan - Preserves full accuracy in the intermediate
   *                            calculation. Inexact.
   * Arguments: 3
   * (fmla="cat2 x y z")
   * Usage: "cat2 x y z" = (x*(cos(arctan(z / y))) = value of this guide
   * @param x the x value
   * @param y the y value
   * @param z the z value
   * @return calculated value as per formula
   */
  var cat2 = function(x, y, z) {
    return parseFloat(x) * Math.cos(Math.atan(z / y));
  };

  /**
   * ('cos') - Cosine. Argument is in "fd" units or fractional degrees. Inexact.
   * Arguments: 2
   * (fmla="cos x y")
   * Usage: "cos x y" = (x * cos( y )) = value of this guide
   * @param x the x value
   * @param y the y value
   * @return calculated value as per formula
   */
  var cos = function(x, y) {
    y = y / 60000;
    y = y * Math.PI / 180;
    return parseFloat((parseFloat(x) * Math.cos(y)).toFixed(4));
  };

  /**
   * ('max') - Maximum Value - The greater of two values. Exact.
   * Arguments: 2
   * (fmla="max x y")
   * Usage: "max x y" = if (x > y), then x = value of this guide
   *                    else y = value of this guide
   * @param x the x value
   * @param y the y value
   * @return calculated value as per formula
   */
  var max = function(x, y) {
    return Math.max(x, y);
  };

  /**
   *('min') - Minimum Value - The lesser of two values. Exact.
   * Arguments: 2
   * (fmla="min x y")
   * Usage:"min x y" = if (x < y), then x = value of this guide
   *                   else y = value of this guide
   * @param x the x value
   * @param y the y value
   * @return calculated value as per formula
   */
  var min = function(x, y) {
    return Math.min(x, y);
  };

  /**
   * ('mod') - Modulus. Inexact.
   * Arguments: 3
   * (fmla="mod x y z")
   * Usage: "mod x y z" = sqrt(x^2 + b^2 + c^2) = value of this guide
   * @param x the x value
   * @param y the y value
   * @param z the z value
   * @return calculated value as per formula
   */
  var mod = function(x, y, z) {
    return reducePrecision(Math.sqrt(x * x + y * y + z * z));
  };

  /**
   * ('pin') - Pin To Formula
   * Arguments: 3
   * (fmla="pin x y z")
   * Usage: "pin x y z" = if (y < x), then x = value of this guide
   *                      else if (y > z), then z = value of this guide
   *                      else y = value of this guide
   * @param x the x value
   * @param y the y value
   * @param z the z value
   * @return calculated value as per formula
   */
  var pin = function(x, y, z) {
    var retVal = 0;
    x = parseFloat(x);
    y = parseFloat(y);
    z = parseFloat(z);
    if (y < x) {
      retVal = x;
    } else if (y > z) {
      retVal = z;
    } else {
      retVal = y;
    }
    return retVal;
  };

  /**
   * ('sat2') - Sine ArcTan - Preserves full accuracy in the intermediate
   *                          calculation. Inexact.
   * Arguments: 3
   * (fmla="sat2 x y z")
   * Usage: "sat2 x y z" = (x*sin(arctan(z / y))) = value of this guide
   * @param x the x value
   * @param y the y value
   * @param z the z value
   * @return calculated value as per formula
   */
  var sat2 = function(x, y, z) {
    return parseFloat(x) * Math.sin(Math.atan(z / y));
  };

  /**
   * ('sin') - Sine. Argument is in "fd" units or fractional degrees. Inexact.
   * Arguments: 2
   * (fmla="sin x y")
   * Usage: "sin x y" = (x * sin( y )) = value of this guide
   * @param x the x value
   * @param y the y value
   * @return calculated value as per formula
   */
  var sin = function(x, y) {
    y = y / 60000;
    y = y * Math.PI / 180;
    return parseFloat((parseFloat(x) * Math.sin(y)).toFixed(4));
  };

  /**
   * ('sqrt') - Square root. Result is positive and rounds down. Inexact.
   * Arguments: 1
   * (fmla="sqrt x")
   * Usage: "sqrt x" = sqrt(x) = value of this guide
   * @param x the x value
   * @return calculated value as per formula
   */
  var sqrt = function(x) {
    return Math.sqrt(Math.abs(x));
  };

  /**
   * ('tan') - Tangent. Argument is in "fd" units or fractional degrees.Inexact.
   * Arguments: 2
   * (fmla="tan x y")
   * Usage: "tan x y" = (x * tan( y )) = value of this guide
   * @param x the x value
   * @param y the y value
   * @return calculated value as per formula
   */
  var tan = function(x, y) {
    y = y / 60000;
    y = y * Math.PI / 180;
    // According to Android code, degree conversion is not required for tan.
    return parseFloat((parseFloat(x) * Math.tan(y)).toFixed(4));
  };

  /**
   * ('val') - Returns the supplied value. Exact.
   * Arguments: 1
   * (fmla="val x")
   * Usage: "val x" = x = value of this guide
   * @param x the x value
   * @return calculated value as per formula
   */
  var val = function(x) {
    return parseFloat(x);
  };

  /**
   * TODO need to verify it if its really needed
   * Reduce the Precision of inexact calculations to round them towards negative
   * infinity
   * @param number  input to be processed
   * @return number with reduced precision (precision reduced to 1e-8)
   */
  var reducePrecision = function(number) {
    return Math.ceil(number);
  };

  _api = {
    /**
     * Evaluates the formula expression.
     * @param operation to be performed
     * @param args arguments for the operation
     * @return Numerical value of the formula if formula is correct else formula
     *         itself if its not a string or undefined if expression is a string
     *         but not a formula
     */
    evaluateExpression: function(operation, args) {
      var functionName;
      switch (operation) {
        case "*/":
          functionName = multiplyDivide;
          break;
        case "+-":
          functionName = addSubtract;
          break;
        case "+/":
          functionName = addDivide;
          break;
        case "?:":
          functionName = ifElse;
          break;
        case "abs":
          functionName = abs;
          break;
        case "at2":
          functionName = at2;
          break;
        case "at2M":
          functionName = at2Modified;
          break;
        case "cat2":
          functionName = cat2;
          break;
        case "cos":
          functionName = cos;
          break;
        case "max":
          functionName = max;
          break;
        case "min":
          functionName = min;
          break;
        case "mod":
          functionName = mod;
          break;
        case "pin":
          functionName = pin;
          break;
        case "sat2":
          functionName = sat2;
          break;
        case "sin":
          functionName = sin;
          break;
        case "sqrt":
          functionName = sqrt;
          break;
        case "tan":
          functionName = tan;
          break;
        case "val":
          functionName = val;
          break;
        default:
          break;
      }
      var value;
      if (typeof functionName === 'function') {
        value = functionName.apply(null, args);
      }

      if (value !== undefined) {
        parseFloat(value);
      }

      return value;
    }
  };


  return _api;
});
