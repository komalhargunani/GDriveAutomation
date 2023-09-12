// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * CellTextRotationDecorator is responsible for rotating the content div of cell
 * according to rotation angle and alignments.
 *
 * @author yuvraj.patel@synerzip.com (Yuvraj Patel)
 */

define([], function() {

  'use strict';

  var _api = {


    /**
     * Rotate the cell's content node element.
     *
     * @param {Object} elm        - The content node  to decorate
     * @param {String} hAlignment - horizontal alignment information
     * @param {String} vAlignment - vertical alignment information
     * @param {Number} angle      - rotation Angle
     * @param {Number} scale      - zoom scale value, required to calculate
     *                              correct position after rotation
     */
    decorate: function(elm, hAlignment, vAlignment, angle, scale) {
      if (angle >= (-90) && angle <= 90 && scale !== 0) {
        var diffInRect, top, left, rectWithoutRotation, rectWithRotation;

        removeRotation_(elm, scale);
        rectWithoutRotation = elm.getBoundingClientRect();
        applyRotation_(elm, angle, hAlignment, vAlignment);
        rectWithRotation = elm.getBoundingClientRect();
        diffInRect =
            calculateDiffInRect_(rectWithRotation, rectWithoutRotation, scale);

        if (hAlignment === 'left') {
          left = diffInRect.left_diff;
        } else if (hAlignment === 'right') {
          left = diffInRect.right_diff;
        }

        if (vAlignment === 'top') {
          top = diffInRect.top_diff;
        } else if (vAlignment === 'bottom') {
          top = diffInRect.bottom_diff;
        }

        if (top) {
          elm.style.top = top;
        }
        if (left) {
          elm.style.left = left;
        }
      }
    }

  };

  /**
   * It applies rotation to element
   *
   * @param {Object} elm        - element on which rotation should be applied
   * @param {Number} angle      - rotation angle
   * @param {String} hAlignment - horizontal alignment information
   * @param {String} vAlignment - vertical alignment information
   */
  var applyRotation_ = function(elm, angle, hAlignment, vAlignment) {
    var originX = hAlignment;
    var originY = vAlignment;

    if (originX === 'centre' || originY === 'centre') {
      originX = 'center';
      originY = 'center';
    }

    // need to do angle * (-1) because 0 to 90 deg value represents degree
    // above horizon (anti-clockwise) and 0 to -90 value represents degree below
    // horizon (clockwise), however css rotate requires the positive angle for
    // clockwise rotation(0 to -90) and negative angle for
    // anti-clockwise(0 to 90) rotation.
    elm.style.webkitTransform = 'rotate(' + (angle * (-1)) + 'deg)';
    elm.style.webkitTransformOriginX = originX;
    elm.style.webkitTransformOriginY = originY;

    // After rotation cell may not render the complete text (even if space
    // is available) as there is width limit and default overflow
    // value for content div is hidden. As content div with rotation will
    // always be wrapped inside burst area node, there is no harm in setting
    // overflow visible.
    elm.style.overflow = 'visible';
  };

  /**
   * Remove Rotation if applied previously. It is required to calculate
   * difference in bounding rect with rotation and without rotation.
   * @param {Object} elm  - dom element
   */
  var removeRotation_ = function(elm) {
    if (elm.style.webkitTransform) {
      elm.style.webkitTransform = '';
      elm.style.webkitTransformOrigin = '';
    }
  };

  /**
   * calculate the diff to find out how much div has moved away from its visual
   * space with rotation. As getBoundingClientRect() returns the scaled left,
   * top, bottom & right position it is necessary to use zoom scale to nullify
   * the scale effect.
   *
   * @param {Object} rectWithRotation    - bounding client rect of element with
   *                                       rotation
   * @param {Object} rectWithoutRotation - bounding client rect of element
   *                                       without rotation
   * @param {Number} scale               - current zoom scale
   */
  var calculateDiffInRect_ =
      function(rectWithRotation, rectWithoutRotation, scale) {
    var diff = {};

    // calculate difference in respective positions
    diff.left_diff = (rectWithoutRotation.left - rectWithRotation.left) / scale;
    diff.top_diff = (rectWithoutRotation.top - rectWithRotation.top) / scale;
    diff.bottom_diff =
        (rectWithoutRotation.bottom - rectWithRotation.bottom) / scale;
    diff.right_diff =
        (rectWithoutRotation.right - rectWithRotation.right) / scale;

    return diff;
  };
  return _api;
});
