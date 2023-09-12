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
  'qowtRoot/utils/converters/converter',
  'qowtRoot/models/point',
  'qowtRoot/configs/point',
  'qowtRoot/utils/fontManager',
  'qowtRoot/drawing/color/colorUtility',
  'qowtRoot/drawing/theme/themeStyleRefManager',
  'qowtRoot/drawing/theme/themeFontManager',
  'qowtRoot/presentation/placeHolder/placeHolderTextStyleManager',
  'qowtRoot/presentation/placeHolder/defaultTextStyleManager',
  'qowtRoot/presentation/explicitTextStyleManager',
  'qowtRoot/drawing/styles/tableStyles/tableStyleManager',
  'qowtRoot/utils/qowtMarkerUtils',
  'third_party/lo-dash/lo-dash.min'
], function(
  Converter,
  PointModel,
  PointConfig,
  Fonts,
  ColorUtility,
  ThemeStyleRefManager,
  ThemeFontManager,
  PlaceHolderTextStyleManager,
  DefaultTextStyleManager,
  ExplicitTextStyleManager,
  TableStyleManager,
  QOWTMarkerUtils) {

  'use strict';

  var _properties, // Holds text run properties
    _text; // Holds actual text

  var _factory = {

    create: function() {

      // use module pattern for instance object
      var module = function() {

        /**
         * Computes font size.
         * @param style JSON Object
         */
        var _computeFontSize = function(style) {
          var size = _properties.siz;

          // When processing table, do not apply default font-size style if not
          // explicitly mentioned.
          if (size === undefined && PointModel.currentTable.isProcessingTable) {
            return;
          }

          // When currently NOT processing table, apply default font-size if not
          // available in passed 'style'
          if (size === undefined) {
            size = PointConfig.kDEFAULT_FONT_SIZE;
          }

          PointModel.maxParaFontSize = PointModel.maxParaFontSize < size ?
              size : PointModel.maxParaFontSize;

          // Add font size to CSS string
          // to support autoFit normal, we have to give all font sizes in em
          // hence convert to em
          if (size) {
            style['font-size'] = Converter.pt2em(size) + 'em';
          }
        };

        /**
         * Computes Text Shadow
         * If TextShadow property is found in properties then append
         * corresponding CSS to style
         * @param style JSON object
         */
        var _computeTextShadow = function(style) {
          if (_properties.hasOwnProperty('outSdwEff')) {
            // Add typeface to CSS string
            var colorObj = _properties.outSdwEff.color;
            var rgbaColor = colorObj && ColorUtility.getColor(colorObj);
            if (rgbaColor) {
              style['text-shadow'] = "3px 1px 1px " + rgbaColor;
            }
          }
        };

        /**
         * Computes super/sub script
         * If baseline property is found in properties then
         * append corresponding CSS to style
         * @param style JSON object
         */
        var _computeScript = function(style) {
          var script = _properties.baseline;

          if (script) {
            // TODO(jliebrand): we no longer have a TextDecorator. More
            // importantly, we need to determine why word and point have
            // different zoom levels for sub/super script. For now hardcode
            // style.zoom = TextDecorator.getPolicy(
            //     'sub_or_super_script_font_ratio');
            style.zoom = '70%';
            style['vertical-align'] = script + "% ";
          }
        };

        /**
         * Computes case of the text
         * If cap property if found in properties then
         * get cap value and append corresponding CSS to style
         * @param style JSON object
         */
        var _computeCap = function(style) {
          if (_properties.hasOwnProperty('cap')) {
            // This sets the small caps, all caps property of the text.
            // Here we handle 20.1.10.64 ECMA element. This does not actually
            // modify the text.
            switch (_properties.cap) {
              case "all"        :
                style['text-transform'] = "uppercase";
                break;
              case "small"    :
                style['font-variant'] = "small-caps";
                break;
              case "none"        :
                style['text-transform'] = "none";
                break;
              default            :
                break;
            }
          }
        };

        /**
         * Computes font color
         * If color property is found in properties then append corresponding
         * CSS to style
         * @param style {JSON} text run properties.
         * @param fontRefStyle {JSON} The font-ref property of the shape being
         *                            rendered.
         */
        var _computeColor = function(style, fontRefStyle) {
          //Add text color to CSS string, fallback to black if not found in text
          // run properties.
          var textFill = _properties.fill;

          var colorObj;
          if (textFill) {
            if (textFill.alpha) {
              style.opacity = textFill.alpha;
            }

            if (textFill.type === "gradientFill") {
              // pick up the first color and use that for text color.
              colorObj = textFill.gsLst[0].color;
            } else if (textFill.type === "noFill") {
              style.color = 'none';
            }
            else {
              colorObj = textFill.color;
            }
          } else {
            colorObj = (fontRefStyle && fontRefStyle.color);
          }

          if (colorObj) {
            var rgbaColor = ColorUtility.getColor(colorObj);

            if (rgbaColor) {
              style.color = rgbaColor;
            }
          }
        };

        /**
         * Computes strike-through
         * Get the strike-through property from paragraph bean and append
         * corresponding CSS to style adding code in for double strike-through -
         * in case the ability to implement becomes easily accessible in future
         * @param style JSON object
         */
        var _computeStrike = function(style) {
          if (_properties.hasOwnProperty('strike')) {
            if (_properties.strike === 'single') {
              style['text-decoration'] = "line-through";
            }
            else if (_properties.strike === 'double') {
              style['text-decoration'] = "line-through";
            }
          }
        };

        /**
         * Gets all the styles from the text run properties and populate them in
         * the style object
         * @param textRunPropertiesJSON {Object} The text run properties JSON
         * @param fontRefStyle {JSON} The font-ref property of the shape being
         *                            rendered.
         * @return style JSON object
         */
        var _getElementStyle = function(textRunPropertiesJSON, fontRefStyle) {
            _properties = textRunPropertiesJSON || {};

          var style = {};

          _computeFontSize(style);

          if (_properties.hasOwnProperty('bld')) {
            if (_properties.bld === true) {
              style['font-weight'] = "bold";
            } else {
              style['font-weight'] = "normal";
            }
          }

          if (_properties.hasOwnProperty('itl')) {
            if (_properties.itl === true) {
              style['font-style'] = "italic";
            } else {
              style['font-style'] = "normal";
            }
          }

          style['text-decoration'] = '';
          _computeStrike(style);

          if (_properties.udl === true) {
            style['text-decoration'] += " underline";
          } else if (_properties.udl === false && !_properties.strike) {
            style['text-decoration'] = "none";
          }

          _computeScript(style);
          _computeCap(style);

          _computeColor(style, fontRefStyle);
          _computeTextShadow(style);

          return style;
        };

        /**
         * Applies the styles to the text run element
         * @param elementStyle css style
         * @param textRunElement text run  HTML element
         */
        var _applyStyleToElement = function(elementStyle, textRunElement) {
          for (var key in elementStyle) {
            textRunElement.style[key] = elementStyle[key];
          }
        };

        /**
         * Resolve text run properties
         * @param paraLevel {integer} paragraph level
         */
        var _resolveRunProperties = function(paraLevel) {
          if (!_properties) {
            _properties = {};
          }
          // Color should be taken from style->fontRef if its not specified
          // explicitly. For table color is taken from css rather than through
          // cascaded. Setting color to sane value so that cascaded style is not
          // applied if explicit style was not specified in case of table.
          if (_properties.fill === undefined) {
            var fontRefStyle = ThemeStyleRefManager.
                getResolvedFontRefStyle(_properties);
            if (fontRefStyle.color ||
              (PointModel.currentTable.isProcessingTable === true)) {
              _properties.fill = {};
              _properties.fill.color = fontRefStyle.color;
              _properties.fill.alpha = fontRefStyle.alpha;
            }
          }

          ExplicitTextStyleManager.
            resolveRunPropertyFor(paraLevel, _properties);

          // If processing table, do not resolve styles further
          if (PointModel.currentTable.isProcessingTable) {
            return;
          }

          var resolvedRunPr = {};
          if (PointModel.CurrentPlaceHolderAtSlide.phTyp) {
            resolvedRunPr = PlaceHolderTextStyleManager.
              resolveRunPropertyFor(paraLevel);
          } else {
            resolvedRunPr = DefaultTextStyleManager.
              resolveRunPropertyFor(paraLevel);
          }

          if (resolvedRunPr) {
            for (var runProperty in resolvedRunPr) {
              if (_properties[runProperty] === undefined) {
                _properties[runProperty] = resolvedRunPr[runProperty];
              }
            }
          }

        };

        /**
         * Handles text run with only blank spaces or empty string.
         * @param textRunDiv {DOM} text run HTML div
         */
        var _handleBlankSpace = function(textRunDiv) {
          if (_text.trim() === '') {
            textRunDiv.style['text-decoration'] = 'none';
          }
        };

        /**
         * Handles hyperlinking
         * @param textRunDiv {DOM} text run HTML div
         */
        var _handleHyperlink = function(textRunDiv) {
          if (_properties && textRunDiv) {
            var lnk = _properties.lnk;
            if (lnk && (lnk.indexOf('ppt/slides') !== 0 &&
              lnk.indexOf('file:') !== 0 && lnk.indexOf('../') !== 0)) {
              QOWTMarkerUtils.addQOWTMarker(textRunDiv, 'textHyperlink', lnk);
              textRunDiv.classList.add('qowt-point-thumbnail-textLink');
              textRunDiv.style.color =
                ColorUtility.getHexEquivalentOfSchemeColor('hlink');
            }
          }
        };

        var _api = {

          /**
           * Decorates textRun with given textRun properties
           * @param textRunDiv {DOM} text run HTML div
           */
          decorate: function(textRunDiv) {

            var _localApi = {

              /**
               * Decorator / creator of the new text run div
               * @param {String} id - id for the new text run div to be created
               * @return {Object} local API for the decorator
               */
              withNewDiv: function(id) {
                textRunDiv = new QowtPointRun();
                textRunDiv.setEid(id);
                textRunDiv.setAttribute('qowt-eid', id);


                //handle the _text fill for table - apply css classes
                if (PointModel.currentTable.isProcessingTable === true) {
                  TableStyleManager.applyTblCellStyleClasses(textRunDiv,
                    TableStyleManager.styleType.cellTextStyle);
                }

                return _localApi;
              },

              /**
               * Decorates the textRun div with the properties in the
               * -textRunObject-
               * @param {Object} textRunObject textRun JSON object
               * @param {Number=} opt_paraLevel level of paragraph
               * @return {Object} local API for the decorator
               */
              withTextRunProperties: function(textRunObject, opt_paraLevel) {

                _properties = _.cloneDeep(textRunObject.rpr) || {};
                _text = textRunObject.data;
                opt_paraLevel = opt_paraLevel || 0;
                _resolveRunProperties(opt_paraLevel);

                var fontRefStyle = ThemeStyleRefManager.
                    getResolvedFontRefStyle(_properties);

                var elementStyle = _getElementStyle(_properties, fontRefStyle);
                if(elementStyle.color === 'none') {
                  textRunDiv.style.display = 'none';
                } else {
                  _applyStyleToElement(elementStyle, textRunDiv);
                }

                var fontFace = _properties.font;
                // Map theme font names
                if (fontFace && ThemeFontManager.isThemeFont(fontFace)) {
                  fontFace = ThemeFontManager.getThemeFontFace(fontFace);
                }

                // Fallback to fontRefStyle
                // TODO(elqursh): Shouldn't be needed if we rely on CSS to
                // cascade correct font face.
                fontFace = fontFace || (fontRefStyle && fontRefStyle.font);

                if (fontFace) {
                  Fonts.setFontClassName(textRunDiv, fontFace);
                }

                _handleHyperlink(textRunDiv);

                if (_text !== undefined) {
                  _handleBlankSpace(textRunDiv);
                  textRunDiv.textContent = _text;
                }

                return _localApi;
              },

              /**
               * Getter for the decorated div
               * @return {DOM Object} returns the decorated div
               */
              getDecoratedDiv: function() {
                return textRunDiv;
              }
            };
            return _localApi;
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
