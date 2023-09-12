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
 * Text Body properties handler.
 *
 * JSON structure for shape text body properties from DCP is
 * {
 *      "anchor":<top/bottom/ctr>
 *      "anchorCtr":<boolean>
 *      "horzOverflow":<clip/overflow>
 *      "wrap": <none/square>
 *      "lIns": <left inset value in integer>
 *      "tIns": <top inset value in integer>
 *      "rIns": <right inset value in integer>
 *      "bIns": <bottom inset value in integer pt>
 *      "normAutofit":
 *      {
 *          "fontScale": <font scaling value in integer>,
 *          "lnSpcReduction":<line space reduction value in integer>
 *      }
 *      "vert":<horz/vert/vert270/wordArtVert>
 * }
 *
 */

define([
  'qowtRoot/variants/configs/point',
  'qowtRoot/dcp/utils/unitConversionUtils'], function(
    PointConfig,
    UnitConversionUtils) {

  'use strict';

  var _factory = {

    create: function() {

      // use module pattern for instance object
      var module = function() {

          var _kAnchorStyleValueMap = {
            'top': 'start',
            'bottom': 'end',
            'ctr': 'center'
          };

          /**
           * Handles text body inset class for element representing shape text
           * body in HTML
           * @param textBodyStyle {Object} text-body div style
           * @param bodyProperties JSON holding all the body properties.
           */
          var _handleInset = function(textBodyStyle, bodyProperties) {
              // QOWT.utils.debug("Inside QOWT.POINT.CSSManagers.Drawing -
              // createTextBodyInset");
              // THIS IS IF NO INSET COMES FROM DCP. IN ALL CASES IT SHOULD
              // COME.THESE ARE DEFAULT VALUES FOR THE MARGIN -
              // FOR LEFT AND RIGHT IT IS 0.1 INCH  WHICH IS EQUAL TO 91440 EMU,
              // HENCE THE VALUE. FOR TOP AND BOTTOM IT IS 0.05 INCHES,
              // WHICH IS 45720 EMU
              //handle left inset
              textBodyStyle['margin-left'] = (UnitConversionUtils.
                convertEmuToPoint(bodyProperties.lIns ? bodyProperties.lIns :
                PointConfig.kDEFAULT_LEFT_INSET)) + "pt ";
              //handle top inset
              textBodyStyle['padding-top'] = (UnitConversionUtils.
                convertEmuToPoint(bodyProperties.tIns ? bodyProperties.tIns :
                PointConfig.kDEFAULT_TOP_INSET)) + "pt ";
              //handle right inset
              textBodyStyle['margin-right'] = (UnitConversionUtils.
                convertEmuToPoint(bodyProperties.rIns ? bodyProperties.rIns :
                PointConfig.kDEFAULT_RIGHT_INSET)) + "pt ";
              //handle bottom inset
              textBodyStyle['padding-bottom'] = (UnitConversionUtils.
                convertEmuToPoint(bodyProperties.bIns ? bodyProperties.bIns :
                PointConfig.kDEFAULT_BOTTOM_INSET)) + "pt ";
            };

          var _api = {

            /**
             * Handles body properties
             * Flow --
             * 1. Self initialization using passed shape text body properties
             * 2. Handle insets
             *
             * @param {HTMLElement} shapeTextBodyDiv shape text-body div element
             * @param {Object} bodyProperties holding shape text body properties
             */
            decorate: function(shapeTextBodyDiv, bodyProperties) {
              var shapeTextBodyDivStyle = shapeTextBodyDiv.style;
              var wrap =
                  bodyProperties.wrap ? bodyProperties.wrap === "square" :
                  PointConfig.kDEFAULT_IS_BODY_PROPERTY_WRAP;
              var anchorCenter = (bodyProperties.anchorCtr !== undefined) ?
                  bodyProperties.anchorCtr :
                  PointConfig.kDEFAULT_IS_BODY_PROPERTY_ANCHOR_CENTER;

              // Set wrap and anchor-center attributes in shape text body div,
              // so that we can apply width and white space styles using CSS
              // selectors
              shapeTextBodyDiv.setAttribute('wrap', wrap);
              shapeTextBodyDiv.setAttribute('anchor-center', anchorCenter);

              shapeTextBodyDivStyle['font-size'] =
                (bodyProperties.normAutofit) ?
                  (bodyProperties.normAutofit.fontScale + "%") : '100%';

              _handleInset(shapeTextBodyDivStyle, bodyProperties);
            },

            /**
             * Computes webkitBox css style for the shape-div
             * @param bodyProperties {JSON} holding shape text body properties
             * @param shapeStyle {Object} css style of the shape
             */
            getContainingShapeBoxAlignProperty: function(bodyProperties,
                                                         shapeStyle) {
              var anchorStyleValue =
                _kAnchorStyleValueMap[bodyProperties.anchor];
              if(anchorStyleValue) {
                shapeStyle['-webkit-box-align'] = anchorStyleValue;
              }

              if(bodyProperties.anchorCtr) {
                shapeStyle['-webkit-box-pack'] = "center";
              }
            }
          };

          return _api;
        };

      // We create a new instance of the object by invoking
      // the module constructor function.
      var instance = module();
      return instance;
    }
  };

  return _factory;
});
