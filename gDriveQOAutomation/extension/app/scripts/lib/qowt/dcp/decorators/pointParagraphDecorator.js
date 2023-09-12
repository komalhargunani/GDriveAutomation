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
 * Decorator for text paragraph properties.
 *
 * JSON structure for text paragraph properties from DCP is
 * {
 *      "leftMargin": <left margin>,
 *      "rightMargin": <right margin>,
 *      "indent": <indent value>,
 *      "jus": <l> / <ctr> / <r> / <just>
 *      "lnSpc": <text spacing JSON>,
 *      "spcAft": <text spacing JSON>,
 *      "spcBef": <text spacing JSON>,
 *      "bullet": <bullet JSON>,
 *      "level":"<level number>" // 0 - 8
 * }
 *
 */
define([
  'qowtRoot/dcp/pointHandlers/textSpacingHandler',
  'qowtRoot/models/point',
  'qowtRoot/utils/converters/converter',
  'qowtRoot/dcp/utils/unitConversionUtils',
  'qowtRoot/dcp/pointHandlers/util/cssManagers/presentation',
  'qowtRoot/presentation/placeHolder/placeHolderTextStyleManager',
  'qowtRoot/presentation/explicitTextStyleManager',
  'qowtRoot/presentation/placeHolder/defaultTextStyleManager',
  'qowtRoot/dcp/decorators/pointTextDecorator',
  'third_party/lo-dash/lo-dash.min'
], function(
  TextSpacingHandler,
  PointModel,
  Converter,
  UnitConversionUtils,
  CssManagerPresentation,
  PlaceHolderTextStyleManager,
  ExplicitTextStyleManager,
  DefaultTextStyleManager,
  PointTextDecorator) {

  'use strict';

  var _factory = {

    create: function() {

      // use module pattern for instance object
      var module = function() {
        var _properties; // Holds paragraph properties JSON
        var _pointTextDecorator; // Instance of the text decorator

        /**
         * Map for paragraph alignment property.
         * @type {Object}
         * @private
         */
        var _paragraphAlignMap = {
          L: "left",
          C: "center",
          R: "right",
          J: "justify"
        };

        /**
         * Handles paragraph indentation and margins.
         *
         * @param paraDivStyle {Object} paragraph div style
         */
        var _handleMarginsIndent = function(paraDivStyle) {
          var origMarL = 0;
          var rightMargin = 0;
          var indent = _properties.indent;
          var leftMargin = _properties.leftMargin;
          indent = UnitConversionUtils.convertEmuToPoint(indent);

          if (leftMargin !== undefined) {
            origMarL = parseInt(leftMargin, 10);
          }

          /**
           * This is for long text with wrap off and anchor center off. We are
           * handling following alignments:
           * left : do nothing.
           * right : Apply a negative left margin to the paragraph. The left
           *         margin value is calculates as (shape's  start point X
           *         co-ordinate)
           * center : Apply a negative left and right margin to the paragraph.
           * The left margin value is (shape's start point X co-ordinate)
           * ------------- val1
           * The right margin is calculated as (slide's width - shape's endpoint
           * X co-ordinate) -------------- val2
           * Apply left and right margin with the minimum of val1 and val2
           * This is done so that the paragraph bounding box doesn't flow out of
           * the slide in any case.
           */
          if (PointModel.textBodyProperties.wrap === false &&
            PointModel.textBodyProperties.anchorCtr === false) {
            var shapeDimensions = PointModel.shapeDimensions;

            if (shapeDimensions && shapeDimensions.off) {
              var alignCssStyle = _paragraphAlignMap[_properties.jus];

              if (alignCssStyle === "right") {
                leftMargin = ( parseInt(shapeDimensions.off.x, 10) * -1 ) || 0;
              } else if (alignCssStyle === "center") {
                leftMargin = ( parseInt(shapeDimensions.off.x, 10) * -1 ) || 0;
                rightMargin = ((CssManagerPresentation.getX() -
                  (parseInt(shapeDimensions.ext.cx, 10) +
                    parseInt(shapeDimensions.off.x, 10))) * -1 ) || 0;
                rightMargin = rightMargin >= leftMargin ?
                    rightMargin : leftMargin;
                leftMargin = rightMargin + (origMarL / 2);
              }
            }
          }

          if (leftMargin !== undefined) {
            paraDivStyle['margin-left'] =
              UnitConversionUtils.convertEmuToPoint(leftMargin) + "pt";
          }

          paraDivStyle['margin-right'] =
            UnitConversionUtils.convertEmuToPoint(rightMargin) + "pt";

          if (indent !== undefined) {
            var originalMarginLeftValue =
              UnitConversionUtils.convertEmuToPoint(origMarL);
            paraDivStyle['text-indent'] =
              ((originalMarginLeftValue + indent ) < 0 ?
              (originalMarginLeftValue * -1) : indent) + "pt";
          }
        };

        /**
         * Handles alignment of paragraph.
         *
         * @param paraDivStyle {Object} paragraph div style
         */
        var _handleAlign = function(paraDivStyle) {
          paraDivStyle['text-align'] = _paragraphAlignMap[_properties.jus];
        };

        /**
         * Handles end paragraph run properties of current paragraph.
         *
         * @param {Object} paraDivStyle paragraph div style
         * @param {JSON} endParaRunProperties the JSON of end paragraph run
         *     properties
         * @param {number} paraLevel Level of the paragraph
         * @private
         */
        var _handleEndParaRunProperties = function(
            paraDivStyle, endParaRunProperties, paraLevel) {
          /**
           * We need to apply properties, so that end paragraph run properties
           * are rendered correctly, like font size
           *
           * Solution - Compute the styling of a text run associated with the
           *            end paragraph run property. Since the only renderable
           *            property of a end paragraph run property is the font
           *            size. Apply a min-height styling to the paragraph based
           *            on the computed height.
           */
          if (!endParaRunProperties) {
            return;
          }

          var endParaRprRun = {
            'rpr': endParaRunProperties
          };

          if (!_pointTextDecorator) {
            _pointTextDecorator = PointTextDecorator.create();
          }

          var decorateText = _pointTextDecorator.decorate().withNewDiv(
              endParaRunProperties.eid);

          var textRunElement = decorateText.withTextRunProperties(
              endParaRprRun, paraLevel).getDecoratedDiv();

          // set the paragraph minimum height to be equal to the computed
          // height.
          var computedHeight = 1;
          var fontSize = textRunElement.style['font-size'];
          // Handle only font sizes in 'em' units.
          if (fontSize && fontSize.length > 2 &&
              fontSize.substr(-2) === 'em') {
            computedHeight = parseFloat(fontSize);
          }

          var lineHeight = paraDivStyle['line-height'];
          if (lineHeight) {
            if (!isNaN(lineHeight)) {
              computedHeight *= lineHeight;
            } else if (lineHeight.length > 2 &&
                lineHeight.substr(-2) === 'pt') {
              var points = parseFloat(lineHeight);
              computedHeight = Converter.pt2em(points);
            }
          }

          paraDivStyle['min-height'] = computedHeight + 'em';
        };

        /**
         * Resolves cascaded paragraph properties.
         *
         * @param isEmptyParagraph {boolean} flag to check for empty paragraph
         */
        var _resolveParagraphProperties = function(isEmptyParagraph) {
          var resolvedParaProperty;
          var paraLevel = (_properties && _properties.level) || 0;
          ExplicitTextStyleManager.resolveParaPropertyFor(_properties);

          if (PointModel.CurrentPlaceHolderAtSlide.phTyp) {
            if (isEmptyParagraph) {
              resolvedParaProperty =
                PlaceHolderTextStyleManager.resolveParaPropertyFor('def');
            }

            if (resolvedParaProperty === undefined) {
              resolvedParaProperty =
                PlaceHolderTextStyleManager.resolveParaPropertyFor(paraLevel);
            }
          } else {
            if (isEmptyParagraph) {
              resolvedParaProperty =
                DefaultTextStyleManager.resolveParaPropertyFor('def');
            }

            if (resolvedParaProperty === undefined) {
              resolvedParaProperty =
                DefaultTextStyleManager.resolveParaPropertyFor(paraLevel);
            }
          }

          for (var paraProperty in resolvedParaProperty) {
            _properties[paraProperty] = _properties[paraProperty] ||
              resolvedParaProperty[paraProperty];
          }
        };

        /**
         * Returns true when runs are not present in current paragraph.
         * @return {Boolean} true when current paragraph is empty
         */
        var _isEmptyParagraph = function(runs) {
          return (!runs || runs.length === 0);
        };

        var _api = {
          /**
           * Decorates pragraph with given paragraph properties
           * @param textParagraphDiv {DOM} text paragraph HTML div
           */
          decorate: function(textParagraphDiv) {

            var _localApi = {

              /**
               * Decorator / creator of the new paragraph div
               * @param id {String} id for the new paragraph div to be created
               * @return {Object} local API for the decorator
               */
              withNewDiv: function(id) {
                textParagraphDiv = new QowtPointPara();
                textParagraphDiv.setEid(id);

                return _localApi;
              },

              /**
               * Decorates the paragraph div with the properties in the
               * -paragraphObject-
               * @param {Object} paragraphObject paragraph JSON object
               * @return {Object} local API for the decorator
               */
              withParagraphProperties: function(paragraphObject) {
                _properties = _.cloneDeep(paragraphObject.ppr) || {};
                var paraLevel = _properties.level || 0;

                PointModel.maxParaFontSize = 0;

                var endParaRunProperties = paragraphObject.endParaRPr;
                var runs = paragraphObject.elm;
                var isEmptyParagraph = _isEmptyParagraph(runs);

                _resolveParagraphProperties(isEmptyParagraph);

                /*
                 * Pass paragraph properties to spacing handler so that whenever
                 * we need line spacing value, spacing before value, and spacing
                 * after value; we can ask it to spacing handler
                 */
                TextSpacingHandler.setProperties(_properties);

                _handleAlign(textParagraphDiv.style);
                _handleMarginsIndent(textParagraphDiv.style);
                textParagraphDiv.style['line-height'] =
                    TextSpacingHandler.getLineSpacing();

                if (isEmptyParagraph) {
                  _handleEndParaRunProperties(textParagraphDiv.style,
                      endParaRunProperties, paraLevel);
                }

                // Add qowt attributes to the paragraph, these attributes are
                // being used to apply bullets to paragraph.
                textParagraphDiv.setAttribute('qowt-level', paraLevel);

                return _localApi;
              },

              /**
               * Getter for the decorated div
               * @return {DOM Object} returns the decorated div
               */
              getDecoratedDiv: function() {
                return textParagraphDiv;
              }
            };
            return _localApi;
          },

          /**
           * Handles text paragraph spacing. This method must be called after
           * text runs are handled because as of now percent specific spacing
           * requires maximum font size for paragraph
           *
           * @param paraDivStyle {Object} paragraph div style
           */
          handleParagraphSpacing: function(paraDivStyle) {

            var spacingAfter = TextSpacingHandler.getSpacingAfter();
            if (spacingAfter) {
              paraDivStyle['padding-bottom'] = spacingAfter;
            }

            var spacingBefore = TextSpacingHandler.getSpacingBefore();
            if (spacingBefore) {
              paraDivStyle['padding-top'] = spacingBefore;
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
