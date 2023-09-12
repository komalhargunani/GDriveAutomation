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
 * Point Bullet Decorator, decorates paragaphs with bullets.
 *
 * JSON structure for Bullet from DCP is
 * {
 *      "type": "buNone" / "buChar" / "buBlip" / "buAuto",
 *      "char": "<bullet character>", // optional
 *      "autotype": "<auto numbering type>", // optional
 *      "idx":"<index number>", // optional
 *      "clr" : "<hexadecimal color value>", // optional
 *      "font" : "<font name>", // optional
 *      "sz" : "<font size in points>" // optional
 *      "startAt" : <integer> // number specifying start number. optional
 * }
 */
define([
  'qowtRoot/dcp/utils/unitConversionUtils',
  'qowtRoot/utils/converters/converter',
  'qowtRoot/variants/configs/point',
  'qowtRoot/drawing/color/colorUtility',
  'qowtRoot/drawing/theme/themeStyleRefManager',
  'qowtRoot/drawing/theme/themeFontManager',
  'qowtRoot/models/point',
  'qowtRoot/presentation/placeHolder/placeHolderTextStyleManager',
  'qowtRoot/variants/utils/resourceLocator',
  'qowtRoot/utils/fontManager',
  'qowtRoot/presentation/placeHolder/defaultTextStyleManager',
  'qowtRoot/presentation/explicitTextStyleManager',
  'qowtRoot/dcp/pointHandlers/textSpacingHandler',
  'third_party/lo-dash/lo-dash.min'
], function(
  UnitConversionUtils,
  Converter,
  PointConfig,
  ColorUtility,
  ThemeStyleRefManager,
  ThemeFontManager,
  PointModel,
  PlaceHolderTextStyleManager,
  ResourceLocator,
  Fonts,
  DefaultTextStyleManager,
  ExplicitTextStyleManager,
  TextSpacingHandler) {

  'use strict';

  // TODO(elqursh): Get rid of this decorator once the bullet mixins support
  // all the DCP properties. (crbug/440956)
  /*
   * Holds bullet formatting which depends upon autoType in case of
   * auto-numbered bullets.
   * Array index represents autoType and value represents content format for
   * corresponding autoType.
   */
  var LIST_TYPE_TO_COUNTER = [
    '"("counter(item, upper-alpha)")"', // (A), (B), (C),
    '"("counter(item, decimal)")"', //Thai numerical parentheses - both
    'counter(item, decimal)"."', //Hindi numerical period
    'counter(item, upper-alpha)"."', //A., B., C., .
    'counter(item, decimal)"."', //Thai numerical period
    'counter(item, decimal)"."', //EA: Simplified Chinese w/ single-byte period
    'counter(item, decimal)":"', //Dbl-byte Arabic numbers w/ double-byte period
    'counter(item, upper-alpha)"."', //Thai alphabet period
    'counter(item, decimal)"."', //EA: Japanese/Korean (TypeC 1-)
    //EA: Traditional Chinese (TypeA 1-19, TypeC 20-)
    'counter(item, decimal)"."',
    '"("counter(item, upper-roman)")"', //(I), (II), (III), .
    'counter(item, decimal)"."', //EA
    //Dbl-byte circle numbers (1-10 circle[0x2460-], 11- arabic numbers)
    'counter(item, decimal)"."',
    '"("counter(item, lower-roman)")"', //(i), (ii), (iii), .
    //Wingdings white circle numbers (0-10 circle[0x0080-], 11- arabic numbers)
    'counter(item, decimal)"."',
    'counter(item, lower-alpha)")"', //a), b), c), .
    'counter(item, decimal)"."', //Dbl-byte Arabic numbers
    //EA: Simplified Chinese (TypeA 1-99, TypeC 100-)
    'counter(item, decimal)"."',
    'counter(item, decimal)")"', //Thai numerical parentheses - right
    'counter(item, decimal)":"', //EA: Japanese w/ double-byte period
    'counter(item, decimal)"-"', //Bidi Hebrew 2 with ANSI minus symbol
    'counter(item, decimal)"."', //1., 2., 3., .
    '"("counter(item, upper-alpha)")"', //Thai alphabet parentheses - both
    '"("counter(item, decimal)")"', //(1), (2), (3), .
    //Bidi Arabic 1 (AraAlpha) with ANSI minus symbol
    'counter(item, decimal)"-"',
    '"("counter(item, lower-alpha)")"', //(a), (b), (c), .
    'counter(item, lower-roman)"."', //i., ii., iii., .
    'counter(item, lower-alpha)"."', //Hindi alphabet period - vowels
    'counter(item, decimal)', //1, 2, 3, .
    'counter(item, upper-alpha)"."', //Hindi alphabet period - consonants
    'counter(item, upper-roman)"."', //I., II., III., .
    'counter(item, decimal)")"', //1), 2), 3), .
    'counter(item, decimal)"."', //EA: Japanese/Korean w/ single-byte period
    'counter(item, lower-roman)")"', //i), ii), iii), .
    'counter(item, lower-alpha)"."', //a., b., c., .
    'counter(item, upper-roman)")"', //I), II), III), .
    'counter(item, upper-alpha)")"', //A), B), C), .
    'counter(item, upper-alpha)")"', //Thai alphabet parentheses - right
    'counter(item, decimaal")"', //Hindi numerical parentheses - right
    //Bidi Arabic 2 (AraAbjad) with ANSI minus symbol
    'counter(item, deciaml)"-"',
    'counter(item, upper-alpha)")"' //Wingdings black circle numbers
  ];

  var _factory = {

    create: function() {

      // use module pattern for instance object
      var module = function() {
        var _bullet, // Holds bullet JSON
          _firstRunProperties, // Holds first text run's run properties
          _resolvedFirstRunProperty, // Holds Resolved Properties
          _style; // Holds string representation of bullet style

        /**
        * Resolves and applies color to the bullets.
         * @param {object} paraProp Paragraph properties
        */
        var _applyBulletColor = function(paraProp) {
          var colorObj;
          var bulletColorFollowsText = paraProp.bulletColorFollowText;
          if(!bulletColorFollowsText) {
            // Only if isBullerClrTx is false or undefined, the specified bullet
            // color needs to be picked up . Otherwise, color of the bullet
            // should follow text color.
            colorObj =  paraProp.bulletColor;
          }

          if(!colorObj) {
            if(_firstRunProperties.fill) {
              colorObj = _firstRunProperties.fill.color;
            }
            else {
              // Check color in fontRef before cascaded color if explicit color
              // is not specified.
              var fontRefStyle = ThemeStyleRefManager.
                  getResolvedFontRefStyle(_firstRunProperties);
              colorObj = fontRefStyle.color || (_resolvedFirstRunProperty.fill ?
                  _resolvedFirstRunProperty.fill.color : undefined);
            }
          }
          var rgbaColor = colorObj && ColorUtility.getColor(colorObj);

          if (rgbaColor) {
            _style.color = rgbaColor;
          }
        };

        /**
         * Applies font to the bullets.
         *
         * @param type the type of bullet e.g. character bullet, auto-numbered
         *             bullet, picture bullet etc
         * @param {object} paraProp Paragraph properties
         */
        var _applyBulletFont = function(type, paraProp) {
          // For auto-numbered bullets, always apply first run properties font.
          var resolvedFont = _firstRunProperties.font ||
              _resolvedFirstRunProperty.font;
          var fontFace =
              ((type === 'buAuto' || paraProp.bulletFontFollowText) === true) ?
              resolvedFont : paraProp.bulletFont;

          // Map theme font names
          if (fontFace && ThemeFontManager.isThemeFont(fontFace)) {
            fontFace = ThemeFontManager.getThemeFontFace(fontFace);
          }

          if (fontFace) {
            var fontFamily = Fonts.family(fontFace);
            if (fontFamily) {
              _style['font-family'] = fontFamily;
            }
          }
        };

        /**
         * Applies margins to the picture bullets.
         *
         * @param size the bullet size after applying percentage size to bullets
         * @param originalSize the original size of bullets
         */
        var _applyMarginsForPictureBullets = function(size, originalSize) {
          var lineSpacing = TextSpacingHandler.getLineSpacing();
          // If value is in 'pt' divide it by 10 to get approximate value
          // related to pt. If value is unitless multiply by 10
          lineSpacing = parseFloat(lineSpacing, 10) * (isNaN(lineSpacing) ?
              0.1 : 10);

          _style['margin-left'] = '-' + size + 'px';
          var diff = (size - originalSize) * (-1);
          //  use 0 for Default line spacing value(12)
          diff = diff + (lineSpacing ===
            PointConfig.kDEFAULT_LINE_SPACING_VALUE ? 0 : lineSpacing);
          _style['margin-top'] = diff + 'pt';
        };

        /**
         * Applies size to the bullets.
         *
         * @param type the type of bullet e.g. character bullet, auto-numbered
         *             bullet, picture bullet etc
         * @param {object} paraProp Paragraph properties
         */
        var _applyBulletSize = function(type, paraProp) {
          var size = _bullet.sz || _firstRunProperties.siz ||
              _resolvedFirstRunProperty.siz || PointConfig.kDEFAULT_FONT_SIZE;
          var originalSize = size;

          var bulletSizeInPercentage = paraProp.bulletSizePercentage;
          if (bulletSizeInPercentage && bulletSizeInPercentage !== 0) {
            size = size * (bulletSizeInPercentage / 100);
          }



          if (type === 'buBlip') {
            _style.height = size + 'px';
            _style.width = size + 'px';
            _style['background-size'] = size + 'px ' + size +'px';
            _applyMarginsForPictureBullets(size, originalSize);
          } else {
            // to support autoFit normal, we have to give all font sizes in em
            // hence convert to em
            size = Converter.pt2em(size);
            _style['font-size'] = size + 'em; ';
          }
        };

        /**
         * Applies indent to the bullets.
         * @param {String} type - type of the bullet
         */
        var _applyBulletIndent = function(indent) {
          if (indent) {
            indent = UnitConversionUtils.convertEmuToPoint(indent);
            _style['min-width'] = Math.abs(indent) + 'pt';
            if (indent > 0) {
              _style['margin-left'] = -indent + 'pt';
            } else {
              _style['margin-left'] = '0pt';
            }
          }
        };

        /**
         * Resolves cascaded first run properties for bullets.
         *
         * @param firstRunPropertyJSON {JSON} first run property JSON of slide
         *                                    level.
         * @param level the paragraph level
         */
        var _resolveCascadedRunProperties = function(firstRunPropertyJSON,
                                                     level) {
          _firstRunProperties = firstRunPropertyJSON || {};
          // We might get unresolved RunProperty in some cases (level > 0 for
          // title type placeholder). Title placeholder is normally expected to
          // be of first level and hence properties for other levels can be
          // undefined if not specified anywhere.
          var placeholderType = PointModel.CurrentPlaceHolderAtSlide.phTyp;
          if (placeholderType) {
            _resolvedFirstRunProperty = PlaceHolderTextStyleManager.
              resolveRunPropertyFor(level) || {};
          } else {
            ExplicitTextStyleManager.resolveRunPropertyFor(level,
              _firstRunProperties);
            _resolvedFirstRunProperty = DefaultTextStyleManager.
              resolveRunPropertyFor(level) || {};
          }

        };

        /**
         * Resolves cascaded bullet properties.
         *
         * @param level the paragraph level
         */
        var _resolvedCascadedBulletProperties = function(level) {
          if (PointModel.currentPHLevel === 'sld') {
            var resolvedParaPr = PlaceHolderTextStyleManager.
              resolveParaPropertyFor(level);
            if (resolvedParaPr && resolvedParaPr.bullet) {
              _bullet = _bullet || {};

              for (var bulletProperty in resolvedParaPr.bullet) {
                _bullet[bulletProperty] = _bullet[bulletProperty] ||
                  resolvedParaPr.bullet[bulletProperty];
              }
            }
          }
        };

        var _api = {
          /**
           * Handles bullets for a paragraph.
           *
           * @param {HTMLElement} paraElement the paragraph element
           * @param {Object} paraProp Paragraph properties
           * @param {Object} firstRunProperty the run-property of the first
           *                                  text run of the paragraph to
           *                                  which bullet need to handle
           */
          decorate: function(paraElement, paraProp, firstRunProperty) {
            var level = (paraProp && paraProp.level) || 0;

            _bullet = _.cloneDeep(paraProp.bullet) || {};

            _resolvedCascadedBulletProperties(level);
            _resolveCascadedRunProperties(firstRunProperty, level);

            var type = _bullet && _bullet.type;

            _style = {};

            var counterName = 'qowt-lc-' + level;

            switch (type) {
              case 'buNone':
                _style['background-image'] = 'none';
                _style.content = '""';
                _style.display = 'none';
                break;
              case 'buChar':
                var bulletChar = _bullet.char ||
                    PointConfig.kDEFAULT_BULLET_CHARACTER;
                _style['background-image'] = 'none';
                _style.content = '"' + bulletChar + '"';
                _style.display = 'inline-block';
                break;
              case 'buAuto':
                var autoType = _bullet.autotype ||
                  PointConfig.kDEFAULT_BULLET_AUTO_TYPE;

                // Additionally each paragraph should reset deeper levels
                // counters.
                paraElement.style.counterReset = '';
                for (var i = level + 1; i < 10; i++) {
                  paraElement.style.counterReset += 'qowt-lc-' + i + ' ';
                }

                paraElement.style.counterIncrement = counterName + ' 1';
                var template = LIST_TYPE_TO_COUNTER[autoType];
                _style['background-image'] = 'none';
                _style.content = template.replace('item', counterName);
                _style.display = 'inline-block';
                break;
              case 'buBlip':
                var bulletImage = _bullet.buImg;
                if (bulletImage) {
                  var qualifiedPath = ResourceLocator.pathToUrl(
                      bulletImage.src);
                  _style['background-image'] = "url('" + qualifiedPath + "');";
                  _style['background-repeat'] = 'no-repeat';
                  _style.content = '""';
                } else {
                  // Remove this when picture bullet support is enabled for 2003
                  // right now falling back to dash bullet when there is a
                  // picture bullet in 2003 file '25cf' is the hex code for
                  // black circle
                  _style.content = '\\25cf';
                  _style['background-image'] = 'none';
                }
                _style.display = 'inline-block';
                break;
              default : // do nothing
                break;
            }

            // In case of auto numbered bullets, get bold, italics properties
            // from first run properties and apply them to bullet
            if (type === "buAuto") {
              var bold =  _firstRunProperties.bld ||
                  _resolvedFirstRunProperty.bld;
              var italic = _firstRunProperties.itl ||
                  _resolvedFirstRunProperty.itl;
              if (bold) {
                _style['font-weight'] = 'bold';
              }
              if (italic) {
                _style['font-style'] = 'italic';
              }
            }

            _applyBulletColor(paraProp);
            _applyBulletFont(type, paraProp);
            _applyBulletSize(type, paraProp);
            _applyBulletIndent(paraProp.indent);

            // As we render the bullet as an inline-block it may inherit
            // paragraph specific formatting. To avoid this, we explicitly
            // override inheritable paragraph attributes.
            _style['text-indent'] = '0pt';
            _style['text-align'] = 'left';

            return _style;
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
