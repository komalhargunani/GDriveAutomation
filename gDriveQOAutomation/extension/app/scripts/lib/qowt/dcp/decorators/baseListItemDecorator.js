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
 * BaseListItemDecorator
 * =====================
 *
 * It is the center piece to decorate the list elements. The tasks accomplished
 * during the decoration of a list element are

  1) Preparation of the Pseudo Element to render the content of the level, for
     the particular list element.
     ( The content itself is to be provided by BulletedListItemDecorator or
      NumberedListItemDecorator)
     a) The pseduo element would have various properties applied via the
        CSSManager, They are
         i) content
         ii) text-indent ( which appears as the fli ( first line indent) or hin
             (hanging indent) in dcp response)
           1) hangingIndent is applied with a -ve sign while first line indent
              is applied with a +ve sign.
         iii) Font properties which are obtained via the level's run properties
              are applied.

  2) Applying various indent related properties to the list element.
     a) The left indent, right indent properties appearing from the elm.lin,
        elm.rin respectively.
         These are applied as margin-left (leftIndent), margin-right
         (rightIndent) css properties.

  3) Applying margin-left CSS property to the first-child of the list element.
     This is done to achieve the appropriate space between
     the leveltext and the first paragraph rendered. This is a property which
     would be influenced post inclusion of TABS, in indentation.

 * A module for generating new ParagraphDecorator instances on demand.
 * The client asks this factory for a new decorator instance
 * and then calls the returned decorator to adorn the target
 * element with supplied formatting information.
 *
 * Typical usage:
 * var decorator = BaseListItemDecorator.create(element);
 * decorator.decorate(formatting);
 *
 * @author hussain.pithawala@quickoffice.com (Hussain Pithawala)
 *
 */

define([
  'qowtRoot/dcp/utils/listStyleManager',
  'qowtRoot/utils/deprecatedUtils',
  'qowtRoot/utils/fontManager',
  'qowtRoot/utils/cssManager'
], function(ListStyleManager, DeprecatedUtils, FontManager, CssManager) {

  'use strict';


  var _factory = {

    /**
     * Create a new BaseListItem Decorator instance.
     *
     * @param {Element} , DCP element being visited by the listItemHandler.
     *                    The element has necessary information used by the
     *                    decorator to prepare the dynamically generated CSS.
     * @return {BaseListItemDecorator} A new decorator instance.
     */
    create: function(elm) {
      var _level, _numInstanceId;

      if (elm) {
        // _numInstanceId lies in the range [1-*] a natural number series;
        // elm.level lies in the range [0-8]
        // referes to a concrete representation of an abstract List.
        _numInstanceId = elm.numID;
        // _level refers to an object containing all the level related
        // properties
        _level = ListStyleManager.getlevel(_numInstanceId, elm.level);

        if(!_level){
          // could not continue further, there are a certain 2K3 docs, for which
          // an undesired level value arrives in DCP response.
          return undefined;
        }

      }else {
        throw ('create must be given an element.');
      }


      // use module pattern for instance object
      /**
       * @param _level
       */
      var module = function(_level, _numInstanceId) {
        // selector for the PseudoListItem e.g. #Para<id>::before
        var _pseudoSelector;

        // selector for the ListItem,
        var _parentSelector;

        // selector for the first child element of the ListItem
        var _childSelector;

        var _firstLineIndent = 0;
        var _hangingIndent = 0;
        var _textIndentOffset = 0;
        var _leftIndent = 0;
        var _rightIndent = 0;

        var _fontProperties;
        var _noContentLevel = false;

        var _api = {
          decorate: function(props) {

            _calculateIndent();

            _fontProperties = {};

            if (_level.rpr) {

              /**
               * TODO A subjective fontDecorator is what is required on this
               * matter.
               * Purpose :
               * 1) Should be able to decorate a true DOM Element Node.
               * 2) Should be able to decorate a dynamically written style rule.
               * 3) All utility API's viz _measureText, _applyFontProperties and
               *    _prepareElements should be moved to the fontDecorator.
               * Reason :
               *  This would add to reduce the maintainablity of this piece of
               *  code and would also introduce a component available for reuse.
               */

              // get the font family from the font manager
              if (_level.rpr.rFonts) {
                _fontProperties.family =
                  FontManager.family(_level.rpr.rFonts.ascii);
              }

              if (_level.rpr.size !== undefined) {
                // As the values are in Half Points divide it by 2
                _fontProperties.size = (Number(_level.rpr.size) / 2) + "pt";
              }

              if (_level.rpr.italics) {
                _fontProperties.italic = _level.rpr.italics;
              }

              if (_level.rpr.bold) {
                _fontProperties.bold = _level.rpr.bold;
              }

              if (_level.rpr.underline) {
                _fontProperties.underline = _level.rpr.underline;
              }

              if (_level.rpr.color) {
                _fontProperties.color = _level.rpr.color;
              }
            }

            // Prepare the CSS Selectors for the parent,pseudo and first child
            _pseudoSelector = '#' + elm.eid + ':before';
            _parentSelector = '#' + elm.eid;
            _childSelector = '#' + elm.eid + '>:first-child';

            _render(props.PseudoCSS); // _render the elements
          },
          getListNumber: function() {
            return _numInstanceId;
          },
          getLevelNumber: function() {
            return _level.level;
          },
          getLevel: function() {
            return _level;
          }

        };

        /**
         *
         * @param _pseudoCSS,
         * @type object literal
         * @description an Object containing the content, to be rendered
         *              to the level.
         * @private
         *
         * Prepares the various rules, and applies to the elements
         * via CSS selectors using the addRuleNow API
         */
        function _render(_pseudoCSS) {

          if (_pseudoCSS.content !== '""') {
            // check for suppressed content
            _checkUndesiredContent(_pseudoCSS);

            // get the font properties applied over the pseudo class.
            // this step applies customization to the level fonts
            _applyFontProperties(_pseudoCSS);

            // post application of the font Properties
            // we could measure the text width of the level
            // content
            _adjustTextIndentForContent();

            CssManager.addRuleNow(_pseudoSelector, _pseudoCSS);
          } else {
            _noContentLevel = true;
          }

          CssManager.addRuleNow(_parentSelector, _prepareElementIndent());

          CssManager.addRuleNow(_childSelector, _prepareChildEIndent());

        }

        /**
         *
         * @param fontProperties
         * @private
         *
         * Measures the width of the text, as applied with the
         * font Properties.
         */

        function _measureText(fontProperties) {

          // intialize the element
          DeprecatedUtils.setNumberTextMeasureElement();

          var numberTextMeasureElement =
            DeprecatedUtils.numberTextMeasureElement;
          var style = "";

          if (fontProperties.family) {
            style += ' font-family: ' + fontProperties.family + ';';
          }

          if (fontProperties.size) {
            style += ' font-size: ' + fontProperties.size + ';';
          } else {
            style += ' font-size: 11pt;';
          }

          if (fontProperties.italic) {
            style += ' font-style: italic;';
          }

          if (fontProperties.bold) {
            style += ' font-weight: bold;';
          }

          if (fontProperties.underline) {
            style += ' text-decoration: underline;';
          }

          if (fontProperties.color) {
            style += ' color: ' + fontProperties.color + ';';
          }

          if (fontProperties.content) {
            style += ' content: ' + fontProperties.content + ';';
          }
          numberTextMeasureElement._numberTextMeasureElement_Style.innerHTML =
            ".numberTextMeasureCss::before{ " + style + " }";

          // Element.clientWidth and Element.clientHeight return the size in
          // pixels. These need to be converted to points, for uniformity
          var lResult = {
            // convert the pixels to points
            width: _pixelToPoint(numberTextMeasureElement.
              _numberTextMeasureElement.clientWidth),
            // convert the pixels to points
            height: _pixelToPoint(numberTextMeasureElement.
              _numberTextMeasureElement.clientHeight)
          };

          // destroy the element and style
          DeprecatedUtils.
            stripNode(numberTextMeasureElement._numberTextMeasureElement);
          DeprecatedUtils.
            stripNode(numberTextMeasureElement._numberTextMeasureElement_Style);

          return lResult;
        }

        /**
         * The function prepares the various properties
         * to indent the list element.
         *
         * Properties are read from the level and later
         * from the Para element. Properties from the Para
         * override those present from the level.
         */
          function _calculateIndent() {
            var _firstLineIndentLevel;
            var _hangingIndentLevel = 0;
            var _leftIndentLevel = 0;

          if (_level.ppr) {
            // properties from the level
            _leftIndentLevel = _level.ppr.lin ? Number(_level.ppr.lin) : 0;

            // Undefined indicates that the First Line Indent doesn't arrives
            // from the level properties and as per the requirements couldn't be
            // set to zero, by default.
            _firstLineIndentLevel = _level.ppr.fli ? Number(_level.ppr.fli) :
              undefined;

            _hangingIndentLevel = _level.ppr.hin ? Number(_level.ppr.hin) : 0;
          }

          // properties from the element
          // in case level indent is unavailable pick it up from leftIndentLevel
          _leftIndent = elm.lin ? Number(elm.lin) : _leftIndentLevel;
          // right indent never appears in the level properties
          _rightIndent = elm.rin ? Number(elm.rin) : 0;

          //  hanging indent and first line indent are mutually exclusive cases
          _hangingIndent = elm.hin ? Number(elm.hin) : _hangingIndentLevel;

          // A value of zero for FirstLineIndent means noIndent should be
          // applied this is received in the response from DCP. Hence,
          // _firstLineIndent or _firstLineIndent shouldn't be initialized to
          // zero.
          // _firstLineIndentLevel if not provided, should remain undefined
          _firstLineIndent = elm.fli ? Number(elm.fli) : _firstLineIndentLevel;

        }

        /**
         *
         * @param content
         * @private
         * This API prepares the textIndentOffset for the content.
         * The TextIndentOffset is basically the width of the pseudoElement
         * where the content is rendered.
         *
         */
        function _adjustTextIndentForContent() {
          /**
           * DeltaLeftIndent needs to be adjusted,
           * on the occurence of the custom run properties
           * for a particular level.
           */
          var cached = ListStyleManager.
            getTextIndent(_numInstanceId, _level.level,_fontProperties.content);

          var value = cached ? cached : (function() {
            var cached2 = _measureText(_fontProperties);
            ListStyleManager.setTextIndent(_numInstanceId, _level.level,
              cached2, _fontProperties.content);
            return cached2;
          })();

          _textIndentOffset = value.width;
        }

        /**
         *
         * @param _pseudoCSS
         * @private
         *
         * Prepares the fontProperties to be
         * applied for the measuring the text
         * present at the level
         */
         function _applyFontProperties(_pseudoCSS) {
          if (_fontProperties) {
            if (_fontProperties.family) {
              _pseudoCSS['font-family'] = _fontProperties.family;
            }

            if (_fontProperties.size) {
              _pseudoCSS['font-size'] = _fontProperties.size;
            }

            if (_fontProperties.bold) {
              _pseudoCSS['font-weight'] = 'bold';
            }

            if (_fontProperties.underline) {
              _pseudoCSS['text-decoration'] = 'underline';
            }

            if (_fontProperties.italic) {
              _pseudoCSS['font-style'] = 'italic';
            }

            if (_fontProperties.color) {
              _pseudoCSS.color = _fontProperties.color;
            }

            // assign the content to the _fontProperties.content also
            _fontProperties.content = _pseudoCSS.content;
          }
        }

        /**
         * Prepares the CSS Properties, need to be applied
         * onto the LI element
         * @private
         */
        function _prepareElementIndent() {
          return {
            'margin-left': _leftIndent + "pt",
            'margin-right': _rightIndent + "pt",
            'text-indent': (function() {

              var value = 0;

              if (_firstLineIndent >= 0) {
                value = _firstLineIndent;
              } else {
                value = _hangingIndent;
                value *= -1;
              }
              return value;
            })() + "pt"
          };
        }

        /**
         * Prepares the CSS Properties, need to be applied
         * onto the first span of the Child Element
         * @private
         */
        function _prepareChildEIndent() {
          return {
            'margin-left': (function() {
              // populating the delta left indent
              // placing the check to avoid overlap on the pseduo element
              // This check would be removed post inclusion of tab calculation.
              var _difference = 0;
              var _deltaLeftIndent = 0;

              if (_hangingIndent > 0) {
                _difference = _hangingIndent - _textIndentOffset;
              }

              if (_noContentLevel || _difference < 0) {
                _deltaLeftIndent = 0; // set the delta-left-indent to be zero
              } else {
                _deltaLeftIndent = _difference;
              }

              return _deltaLeftIndent;
            })() + "pt"
          };
        }

        /**
         * API to swap the code of an undesired character,
         * with a required one.
         */
        function _checkUndesiredContent(_pseudoCSS){

          /**
           * Chrome Browser doesn't supports a few Unicode characters
           * and renders an altogether different character(A square with a '?'
           * in it). This problem is still under investigation.The worst part is
           * one such character occurs as the first character of the level
           * triplets for bullets. i.e every 1st,3rd and 7th level default
           * bullet would have this character.This represents a disc, in Symbol
           * font-family.
           *
           * The font-family check is also very specific in nature. This is
           * because the code is well supported in other families like
           * Wingdings, Wingdings2 and Wingdings3
           *
           * This replaced with a filled circle rendering character, to ensure
           * default bullets are rendered fine. A mechanism to detect, whether a
           * particular character code is supported by the browser is required
           * to design a fall back mechanism.
           */

          if (_level.bulleted &&
            _fontProperties &&
            _fontProperties.family &&
            _fontProperties.family.match(FontManager.family('Symbol')) &&
            _pseudoCSS.content.match('f0b7')){
              _pseudoCSS.content = '\'\\25cf\'';
          }

        }

        /**
         * Converts a value from pixel to point, factor of 0.75 offers the most
         * close approximation for converting between Pixel to Point. The actual
         * conversion factor though depends on variety of parameters like
         * Font-Family, browser any styling etc.
         *
         * This conversion API has been verified over Google Chrome Dev and
         * Stable channels for Mac.
         * The same has been tested over Google Chromebook.
         *
         * TODO Devise a general purpose API, which takes into account all the
         * parameters and computes a conversion factor.
         */
        function _pixelToPoint(value){
          return Math.floor(value * 0.75);
        }

        return _api;
      };


      // We create a new instance of the object by invoking
      // the module constructor function.
      var instance = module(_level, _numInstanceId);
      return instance;
    }
  };

  return _factory;
});
