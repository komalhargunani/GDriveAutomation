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


  /**
   * Stores predefined guides
   */
  var _map = {
    /**
     * 3/4 of a Circle ('3cd4') - Constant value of "16200000.0"
     * The units here are in 60,000ths of a degree. This is equivalent to 270
     * degrees.
     */
    "threeCD4": "val 16200000.0",

    /**
     * 3/8 of a Circle ('3cd8') - Constant value of "8100000.0"
     * The units here are in 60,000ths of a degree. This is equivalent to 135
     * degrees.
     */
    "threeCD8": "val 8100000.0",

    /**
     * 5/8 of a Circle ('5cd8') - Constant value of "13500000.0"
     * The units here are in 60,000ths of a degree. This is equivalent to 225
     * degrees.
     */
    "fiveCD8": "val 13500000.0",

    /**
     * 7/8 of a Circle ('7cd8') - Constant value of "18900000.0"
     * The units here are in 60,000ths of a degree. This is equivalent to 315
     * degrees.
     */
    "sevenCD8": "val 18900000.0",

    /**
     * Shape Bottom Edge ('b') - Constant value of "h"
     * This is the bottom edge of the shape and since the top edge of the shape
     * is considered the 0 point, the bottom edge is thus the shape height.
     */
    "b": "val h",

    /**
     * 1/2 of a Circle ('cd2') - Constant value of "10800000.0"
     * The units here are in 60,000ths of a degree. This is equivalent to 180
     * degrees.
     */
    "cd2": "val 10800000.0",

    /**
     * 1/3 of a Circle ('cd3') - Constant value of "7200000.0"
     * The units here are in 60,000ths of a degree. This is equivalent to 120
     * degrees.
     * Note: This is not document but used by shape curvedLeftArrow
     */
    "cd3": "val 7200000.0",

    /**
     * 1/4 of a Circle ('cd4') - Constant value of "5400000.0"
     * The units here are in 60,000ths of a degree. This is equivalent to 90
     * degrees.
     */
    "cd4": "val 5400000.0",

    /**
     * 1/8 of a Circle ('cd8') - Constant value of "2700000.0"
     * The units here are in 60,000ths of a degree. This is equivalent to 45
     * degrees.
     */
    "cd8": "val 2700000.0",

    /**
     * Horizontal Center ('hc') - Calculated value of "* / w 1.0 2.0"
     * This is the horizontal center of the shape which is just the width
     * divided by 2.
     */
    "hc": "*/ w 1.0 2.0",

    /**
     * 1/2 of Shape Height ('hd2') - Calculated value of "* / h 1.0 2.0"
     * This is 1/2 the shape height.
     */
    "hd2": "*/ h 1.0 2.0",

    /**
     * 1/3 of Shape Height ('hd3') - Calculated value of "* / h 1.0 3.0"
     * This is 1/3 the shape height.
     */
    "hd3": "*/ h 1.0 3.0",

    /**
     * 1/4 of Shape Height ('hd4') - Calculated value of " * / h 1.0 4.0"
     * This is 1/4 the shape height.
     */
    "hd4": "*/ h 1.0 4.0",

    /**
     * 1/5 of Shape Height ('hd5') - Calculated value of "* / h 1.0 5.0"
     * This is 1/5 the shape height.
     */
    "hd5": "*/ h 1.0 5.0",

    /**
     * 1/6 of Shape Height ('hd6') - Calculated value of "* / h 1.0 6.0"
     * This is 1/6 the shape height.
     */
    "hd6": "*/ h 1.0 6.0",

    /**
     * 1/8 of Shape Height ('hd8') - Calculated value of "* / h 1.0 8.0"
     * This is 1/8 the shape height.
     */
    "hd8": "*/ h 1.0 8.0",

    /**
     * 1/10 of Shape Height ('hd10') - Calculated value of "* / h 1.0 10.0"
     * This is 1/10 the shape height.
     * Note: Not defined in the document but used in shapes flowChartPunchedTape
     * and flowChartManualInput
     */
    "hd10": "*/ h 1.0 10.0",

    /**
     * Shape Left Edge ('l') - Constant value of "0"
     * This is the left edge of the shape and the left edge of the shape is
     * considered the horizontal 0 point.
     */
    "l": "val 0",

    /**
     * Longest Side of Shape ('ls') - Calculated value of "max w h"
     * This is the longest side of the shape. This value is either the width or
     * the height depending on which is greater.
     */
    "ls": "max w h",

    /**
     * Shape Right Edge ('r') - Constant value of "w"
     * This is the right edge of the shape and since the left edge of the shape
     * is considered the 0 point, the right edge is thus the shape width.
     */
    "r": "val w",

    /**
     * Shortest Side of Shape ('ss') - Calculated value of "min w h"
     * This is the shortest side of the shape. This value is either the width or
     * the height depending on which is smaller.
     */
    "ss": "val shortestSide",

    /**
     * 1/2 Shortest Side of Shape ('ssd2') - Calculated value of
     * "* / ss 1.0 2.0"
     * This is 1/2 the shortest side of the shape.
     */
    "ssd2": "*/ shortestSide 1.0 2.0",

    /**
     * 1/4 Shortest Side of Shape ('ssd4') - Calculated value of
     * "* / ss 1.0 4.0"
     * This is 1/4 the shortest side of the shape.
     */
    "ssd4": "*/ shortestSide 1.0 4.0",

    /**
     * 1/6 Shortest Side of Shape ('ssd6') - Calculated value of
     * "* / ss 1.0 6.0"
     * This is 1/6 the shortest side of the shape.
     */
    "ssd6": "*/ shortestSide 1.0 6.0",

    /**
     * 1/8 Shortest Side of Shape ('ssd8') - Calculated value of
     * "* / ss 1.0 8.0"
     * This is 1/8 the shortest side of the shape.
     */
    "ssd8": "*/ shortestSide 1.0 8.0",

    /**
     * 1/8 Shortest Side of Shape ('ssd16') - Calculated value of
     * "* / ss 1.0 16.0"
     * This is 1/16 the shortest side of the shape.
     */
    "ssd16": "*/ shortestSide 1.0 16.0",

    /**
     * 1/8 Shortest Side of Shape ('ssd32') - Calculated value of
     * "* / ss 1.0 32.0"
     * This is 1/32 the shortest side of the shape.
     */
    "ssd32": "*/ shortestSide 1.0 32.0",

    /**
     * hape Top Edge ('t') - Constant value of "0"
     * This is the top edge of the shape and the top edge of the shape is
     * considered the vertical 0 point.
     */
    "t": "val 0",

    /**
     * Vertical Center of Shape ('vc') - Calculated value of "* / h 1.0 2.0"
     * This is the vertical center of the shape which is just the height divided
     * by 2.
     */
    "vc": "*/ h 1.0 2.0",

    /**
     * 1/2 of Shape Width ('wd2') - Calculated value of "* / w 1.0 2.0"
     * This is 1/2 the shape width.
     */
    "wd2": "*/ w 1.0 2.0",

    /**
     * 1/3 of Shape Width ('wd3') - Calculated value of "* / w 1.0 3.0"
     * This is 1/3 the shape width.
     * Note: Not defined in the document but used in shapes trapezoid
     */
    "wd3": "*/ w 1.0 3.0",

    /**
     * 1/4 of Shape Width ('wd4') - Calculated value of "* / w 1.0 4.0"
     * This is 1/4 the shape width.
     */
    "wd4": "*/ w 1.0 4.0",

    /**
     * 1/5 of Shape Width ('wd5') - Calculated value of "* / w 1.0 5.0"
     * This is 1/5 the shape width.
     */
    "wd5": "*/ w 1.0 5.0",

    /**
     * 1/6 of Shape Width ('wd6') - Calculated value of "* / w 1.0 6.0"
     * This is 1/6 the shape width.
     */
    "wd6": "*/ w 1.0 6.0",

    /**
     * 1/8 of Shape Width ('wd8') - Calculated value of "* / w 1.0 8.0"
     * This is 1/8 the shape width.
     */
    "wd8": "*/ w 1.0 8.0",

    /**
     * 1/10 of Shape Width ('wd10') - Calculated value of "* / w 1.0 10.0"
     * This is 1/10 the shape width.
     */
    "wd10": "*/ w 1.0 10.0",

    /**
     * 1/12 of Shape Width ('wd12') - Calculated value of "* / w 1.0 12.0"
     * This is 1/12 the shape width.
     * Note: Not defined in the document but used in shapes rtTriangle
     */
    "wd12": "*/ w 1.0 12.0",

    /**
     * 1/32 of Shape Width ('wd12') - Calculated value of "* / w 1.0 32.0"
     * This is 1/32 the shape width.
     * Note: Not defined in the document but used in shapes rtTriangle
     */
    "wd32": "*/ w 1.0 32.0"
  };


  return _map;
});
