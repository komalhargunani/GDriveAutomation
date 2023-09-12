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
 * Outline Decorator.
 * Responsible for line style (outline) rendering for html-elements,
 * and NOT canvas paths.
 * @constructor
 */
define([
  'qowtRoot/utils/deprecatedUtils',
  'qowtRoot/dcp/utils/unitConversionUtils',
  'qowtRoot/drawing/color/colorUtility',
  'qowtRoot/models/point',
  'qowtRoot/dcp/pointHandlers/common/gradientFillHandler'
], function(DeprecatedUtils,
            UnitConversionUtils,
            ColorUtility,
            PointModel,
            GradientFillHandler) {

  'use strict';

  var _factory = {

    create: function() {

      var module = function() {

        var _api;
        /**
         * compute border style to element using border properties
         * @param borderProperties Object holding border properties
         * @param edge The side to which border properties to be applied
         * return style The list of styles to be applied to element
         */
        var _computeBorderStyle = function(borderProperties, edge) {
          var style = {};
          var width;

          _handlePrstDash(borderProperties, style, edge);
          if (borderProperties.w) {
            width = UnitConversionUtils.convertEmuToPixel(borderProperties.w);

            width = (width > 0 && width < 1) ? 1 : width;

            style["border" + edge + "-width"] = width + "px";
          }

          if (borderProperties.fill && borderProperties.fill.type) {
            var fill = borderProperties.fill;

            if (fill.type === "noFill") {
              style["border" + edge + "-style"] = "none";
            } else if (fill.type === 'solidFill') {
              _handleSolidFillBorder(fill.color, edge, style);
            } else if (fill.type === 'gradientFill') {
              if (borderProperties.prstDash &&
                borderProperties.prstDash !== 'solid') {
                _handleSolidFillBorder(fill.gsLst[0].color, edge, style);
              } else {
                _handleGradientFillBorder(fill, width, style);
              }
            } else if(fill.type === "patternFill") {
              _handleSolidFillBorder(fill.fgClr, edge, style);
            }
          }
          return style;
        };

        /**
         * Adjust prstDash of border as per fallback mechanism.
         *
         * @param borderProperties - the outline properties JSON
         * @param style - shape style element
         * @param edge - the side to which border properties to be applied
         */
        var _handlePrstDash = function(borderProperties, style, edge) {
          //for solid dash prstDash the dash type remains solid for all other
          // types manipulate prstDash as per fallback mechanism
          var prstDash = borderProperties.prstDash;
          if (prstDash && prstDash !== 'solid') {
            if (prstDash === 'sysDot' || prstDash === 'dot') {
              prstDash = 'dotted';
            } else {
              prstDash = 'dashed';
            }
          } else if (prstDash === undefined && borderProperties.fill &&
              borderProperties.fill.type === 'patternFill') {
            //for pattern fill default to solid border
            prstDash = 'solid';
          }
          style['border' + edge + '-style'] = prstDash;
        };

        /**
         * Adjusts outline properties (fill and prstDash)
         *
         * @param outlineObj - {JSON} outline JSON
         * @return outlineObj - {JSON} modified outline JSON
         */
        var _adjustOutline = function(outlineObj) {
          outlineObj = outlineObj || {};
          if (!outlineObj.prstDash) {
            var transparentFill = {
              color: {
                effects: [
                  {
                    name: 'alpha',
                    value: 0
                  }
                ],
                clr: "#ffffff",
                type: "srgbClr"
              },
              type: "solidFill"
            };

            outlineObj.prstDash = "solid";
            outlineObj.fill = outlineObj.fill || transparentFill;
          }

          return outlineObj;
        };

        /**
         * Handle solid fill border rendering
         *
         * @param fill - the outline fill JSON
         * @param edge - the side to which border properties to be applied
         * @param style - shape style element
         */
        var _handleSolidFillBorder = function(color, edge, style) {
          var rgbaColor = ColorUtility.getColor(color);
          style["border" + edge + "-color"] = rgbaColor;
        };

        /**
         * Handle gradient fill border rendering
         *
         * @param fill - the outline fill JSON
         * @param width - image slice width
         * @param style - shape style element
         */
        var _handleGradientFillBorder = function(fill, width, style) {
          style["border-image-source"] =
            GradientFillHandler.handleBorderUsingHTML(fill);
          style["border-image-slice"] =
            (width === undefined ? 2 : Math.floor(width));
          style["border-image-repeat"] = "repeat";
        };

        /**
         * apply computed border style to element
         * @param borderProperties Object holding border properties
         * @param element The HTML div to which the style is applied
         * @param edge The side to which border properties to be applied
         */
        var _applyStylesToElement = function(propertiesContainer, element,
                                             edge) {
          var returnedStyle = propertiesContainer ?
            _computeBorderStyle(propertiesContainer, edge) : {};
          for (var key in returnedStyle) {
            element.style[key] = returnedStyle[key];
          }
        };

        _api = {
          /**
           * Handles outline for rectangular shapes only.
           * @param element The DIV HTML DOM element to which outline to be
           *                applied
           * @param propertiesContainer The container which holds outline
           *                            properties
           */
          handleUsingHTML: function(element, propertiesContainer) {
            if (element && propertiesContainer) {
              if (propertiesContainer.ln) {
                _applyStylesToElement(propertiesContainer.ln, element, "");
              } else {
                _applyStylesToElement(propertiesContainer.lnB, element,
                  "-bottom");
                _applyStylesToElement(propertiesContainer.lnL, element,
                  "-left");
                _applyStylesToElement(propertiesContainer.lnT, element,
                  "-top");
                _applyStylesToElement(propertiesContainer.lnR, element,
                  "-right");
              }
            }
          },

          /**
           *
           * @param outlineJSON {Object} The outlineJSON JSON
           * @return outlineStyleText css style
           */
          getPlaceHolderStyle: function(outlineJSON, edge) {
            var outLineEdge = edge ? '-' + edge : "";
            // add border with prstDash 'solid' and transparent border color if
            // undefined at master level so that even if prstDash at any level
            // is not defined in xml then the border renders correctly.
            if (PointModel.currentPHLevel === 'sldmt' ||
              PointModel.currentTable.isProcessingTable) {
              outlineJSON = _adjustOutline(outlineJSON);
            }

            return DeprecatedUtils.getElementStyleString(_computeBorderStyle(
              outlineJSON, outLineEdge));
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
