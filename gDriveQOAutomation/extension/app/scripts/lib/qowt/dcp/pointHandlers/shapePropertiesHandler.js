/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */


/**
 * Shape properties handler. handles element spPr
 * @constructor
 */
/**
 * JsDoc description
 */
define([
  'qowtRoot/dcp/pointHandlers/transform2DHandler',
  'qowtRoot/models/point'],
function(Transform2D, PointModel) {

  'use strict';

  /**
     * Re-evaluates the shape-extent by the group scale factor
     * @param {Object} shapeTransformExtents Shape extent
     * @param {Object} groupShapePropertiesBean Group properties
     */
  var _reEvaluateShapeExtent = function(shapeTransformExtents,
      groupShapePropertiesBean) {
    if (groupShapePropertiesBean !== undefined) {
      shapeTransformExtents.cx *= groupShapePropertiesBean.scale.x;
      shapeTransformExtents.cy *= groupShapePropertiesBean.scale.y;
    }
  };

  var _api = {
    /**
       * Handle rendering of shape properties
       * @param {JSON} shapeObj The shape response object
       * @param {HTMLElement} shapeDiv The shape DIV HTML DOM element
       * @param {JSON} groupShapePropertiesBean Bean having shape-group
       *                                        properties
       */
    handle: function(shapeObj, shapeDiv, groupShapePropertiesBean) {
      var shapeProperties = shapeObj.spPr;
      // console.log("Inside ShapeProperties handler - handle");
      if (shapeProperties && shapeProperties.xfrm &&
          shapeProperties.xfrm.ext) {

        PointModel.shapeDimensions = shapeProperties.xfrm;

        var shapeTransformExtents = shapeProperties.xfrm.ext;

        _reEvaluateShapeExtent(shapeTransformExtents,
            groupShapePropertiesBean);

        Transform2D.
            handle(shapeProperties.xfrm, groupShapePropertiesBean, shapeDiv);

        shapeDiv.style['-webkit-transform'] =
            _api.handleFlipAndRotate(shapeProperties.xfrm.flipH,
                shapeProperties.xfrm.flipV, shapeProperties.xfrm.rot);

        if (shapeProperties.ln) {
          //if line-width is less than 5500 emus, then make it 5500 emus.
          //Also, if line-width is undefined, and even line-ref style is not
          // there, then give it the default line-width, that is 5500 emus.
          var isLineRefPresent = shapeObj.style && shapeObj.style.lnRef;
          shapeProperties.ln.w = (shapeProperties.ln.w < 5500 ||
              (!shapeProperties.ln.w && !isLineRefPresent)) ?
              5500 : shapeProperties.ln.w;
        }
      }
    },

    /**
       * Computes the webkit-transform property for the shape div
       * @param {Boolean} isFlippedHorizontal True when flip-horizontal property
       *                                      is true
       * @param {Boolean} isFlippedVertical True when flip-vertical property is
       *                                    true
       * @param {Number} rotation Rotation degree
       * @return {String} value for webkit-transform css property
       */
    handleFlipAndRotate: function(isFlippedHorizontal, isFlippedVertical,
                                  rotation) {
      var rule = '';

      if (rotation !== undefined && rotation !== '0') {
        rule = 'rotate(' + rotation + 'deg) ';
      }

      var scaleX = isFlippedHorizontal === true ? -1 : 1;
      var scaleY = isFlippedVertical === true ? -1 : 1;
      rule = rule + 'scale(' + scaleX + ',' + scaleY + ')';

      return rule;
    }
  };

  function _init() {
  }

  _init();

  return _api;
});
