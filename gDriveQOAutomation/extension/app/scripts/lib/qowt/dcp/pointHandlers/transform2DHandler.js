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
 * Transform 2D handler
 * @constructor
 */
define([
  'qowtRoot/models/point',
  'qowtRoot/dcp/utils/unitConversionUtils'
], function(PointModel, UnitConversionUtils) {

  'use strict';

  /**
   * formulates a bean with shape-group specific 2D transform properties
   * @param transform JSON for the transformation details
   * @return group-shape properties bean
   */
  var _getGroupTransformProperties = function(transform) {
    var groupTransformPropertiesBean = {};

    if (transform.chOff) {
      groupTransformPropertiesBean.childOffset = {
        x: transform.chOff.x,
        y: transform.chOff.y
      };
    }

    return groupTransformPropertiesBean;
  };

  /**
   * Shape size class for element representing shape in HTML
   * @param x the x offset for shape
   * @param y the y offset for shape
   * @param width the width of shape in pixels
   * @param height the height of shape in pixels
   * @param shapeDiv of shape
   */
  var _createShapeSize = function(x, y, width, height, shapeDiv) {
    x = UnitConversionUtils.convertEmuToPoint(x);
    y = UnitConversionUtils.convertEmuToPoint(y);

    shapeDiv.style.top = y + "pt";
    shapeDiv.style.left = x + "pt";
    shapeDiv.style.width = width + "px";
    shapeDiv.style.height = height + "px";
  };

  var _api = {
    /**
     * Handle transform 2D
     * @param transform JSON for the transformation details
     * @param groupPropertiesBean group-shape properties bean
     * @param shapeDiv holds the shape
     * @return group-shape properties bean
     */
    handle: function(transform, groupPropertiesBean, shapeDiv) {
      if (transform && transform.ext && transform.ext.cy !== undefined &&
        transform.ext.cx !== undefined) {

        var width = UnitConversionUtils.convertEmuToPixel(transform.ext.cx);
        var height = UnitConversionUtils.convertEmuToPixel(transform.ext.cy);

        //In case of table, need to round a width upward to it's nearest integer
        // to get rid of big whitespace between cell.
        if(PointModel.currentTable.isProcessingTable === true){
          width = Math.ceil(width);
        }

        //Check if the current entity(shape/shape-group) is contained in any
        // shape-group
        if (!groupPropertiesBean) {
          //TODO rotation is passed here for group shape too, need to verify if
          // it works for group shapes too
          var x = transform.off ? transform.off.x : 0;
          var y = transform.off ? transform.off.y : 0;
          _createShapeSize(x, y, width, height, shapeDiv);
        } else {
          //If the current entity is contained in the shape-group, its origin
          // point is calculated by subtracting the shape-group child offsets
          // from the given offsets.
          var groupTransformChildOffset =
            groupPropertiesBean.transform.childOffset;

          var origin = {
            x: (transform.off.x - groupTransformChildOffset.x) *
              groupPropertiesBean.scale.x,
            y: (transform.off.y - groupTransformChildOffset.y) *
              groupPropertiesBean.scale.y
          };
          _createShapeSize(origin.x, origin.y, width, height, shapeDiv);
        }

        return _getGroupTransformProperties(transform);
      }
    }
  };

  return _api;
});
