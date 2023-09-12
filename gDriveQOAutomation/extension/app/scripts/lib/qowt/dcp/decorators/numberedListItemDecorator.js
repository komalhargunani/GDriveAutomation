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
 * NumberedListItemDecorator
 * =========================
 *
 * A module for generating new NumberedListItemDecorator instances on demand.
 *
 * The client asks this factory for a new decorator instance
 * and then calls the returned decorator to adorn the target
 * element with supplied formatting information.
 *
 * Typical usage:
 * var decorator = NumberedListItemDecorator.create(element);
 * decorator.decorate(formatting);
 *
 *
 * @author hussain.pithawala@quickoffice.com (Hussain Pithawala)
 */

define([
  'qowtRoot/dcp/decorators/baseListItemDecorator',
  'qowtRoot/models/word',
  'qowtRoot/dcp/utils/listStyleManager'
],
  function(BaseListItemDecorator, WordModel, ListStyleManager) {

  'use strict';


    var _factory = {

      /**
       * Create a new Paragraph Decorator instance.
       *
       * @param {Element} elm A valid dcp element, which helps in decoration
       *                      ( Refer to BaseListItemDecorator)
       * @return {NumberedListItemDecorator} A new decorator instance.
       */
      create: function(elm) {
        if (!elm) {
          throw ('createDecorator must be given an element.');
        }

        var _api = BaseListItemDecorator.create(elm);

        if(!_api){
          return undefined;
        }

        /**
         * BaseListItemDecorator.decorate() is overridden
         * in this module, however we need to delegate to the
         * base class API, from the overridden API.
         * In this case we need to shift the base class
         * API to the base
         */
        _api.base = {};

        _api.base.decorate  = _api.decorate;

        // use module pattern for instance object
        var module = function() {

            _api.decorate = function(props) {

              /**
               * Prepare the content to be displayed at
               * the level
               */
              var contentValue = '"' + _api.getLevel().lvltxt + '"';

              var _currentLevelNum = _api.getLevelNumber();

              var startLvl = 0;
              if (WordModel.renderListMultiLevel[_currentLevelNum] !== true) {
                // if its not multi level list then prepare contents for single
                // level list.
                startLvl = _currentLevelNum;
              }
              // For multilevel lists we have to set content manually as we
              // cannot use counters - pagination generates new counter
              // instances.

              for (var i = startLvl; i <= _currentLevelNum; i++) {
                var lvlCounter = WordModel.currentListLevelCounter[i];
                var lvl = ListStyleManager.getlevel(_api.getListNumber(), i);
                var textTobeReplaced = "%" + (i + 1);

                contentValue = _getDisplayContent(textTobeReplaced, lvl.numfmt,
                  contentValue, lvlCounter);
              }

              var _pseudoCSS = {
                'content': contentValue
              };

              props.PseudoCSS = _pseudoCSS;

              // call the base decorator
              _api.base.decorate(props);
            };



          /**
           * gets the numbering text.
           * used only for multilevel numbering text.
           *
           * @param {String} textTobeReplaced: text, which needs to be replaced
           *                                   in leveltext.
           * @param lst {string} list style type.
           * @param lvlTxt {string} level text.
           * @param lvlCounter {int} counter for list level.
           *
           * @returns {String} display content for numbering level.
           */
          function _getDisplayContent(textTobeReplaced, lst, lvlTxt,
                                      lvlCounter) {
            var computedNumText = _computeNumberingText(lst, lvlCounter);
            while (lvlTxt.indexOf(textTobeReplaced) !== -1) {
              lvlTxt = lvlTxt.replace(textTobeReplaced, computedNumText);
            }
            return lvlTxt;
          }


          /**
           * Compute the text to be diplayed depending on list type.
           *
           * @param lstType {string} list style type.
           * @param lvlCounter {int} counter for list level.
           */
          function _computeNumberingText(lstType, lvlCounter) {
            var result;
            if (lstType) {
              switch (lstType) {
                case 'romanU':
                  result = _getRomanValue(parseInt(lvlCounter, 10));
                  break;
                case 'romanL':
                  result = _getRomanValue(parseInt(lvlCounter, 10));
                  result = result.toLowerCase();
                  break;
                case 'alphaU':
                  if (lvlCounter <= 26) {
                    result = String.fromCharCode(64 + parseInt(lvlCounter, 10));
                  } else {
                    result = _getAlphabetValue(lvlCounter, 64);
                  }
                  break;
                case 'alphaL':
                  if (lvlCounter <= 26) {
                    result = String.fromCharCode(96 + parseInt(lvlCounter, 10));
                  } else {
                    result = _getAlphabetValue(lvlCounter, 96);
                  }
                  break;
                case 'none':

                  break;
                case 'arabicLZ':
                  if (lvlCounter <= 9) {
                    result = '0' + lvlCounter;
                  } else {
                    result = lvlCounter;
                  }
                  break;
                default:
                  // default is lstType 'arabic'
                  result = lvlCounter;
                  break;
              }
            }
            return result;
          }

          /**
           * Get the roman equivalent of int value.
           * @param num
           */
          function _getRomanValue(num) {
            var lookup = {M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90,
              L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1},
              roman = '',
              i;
            for (i in lookup) {
              while (num >= lookup[i]) {
                roman += i;
                num -= lookup[i];
              }
            }
            return roman;
          }

          /**
           * get the alphabet equvivalent of integer if its greater than 26
           * ( 26 maps to 'z' ). MSword considers 27 as 'aa' character.
           * usually alphabetic list go from a to z which is 26 counts, a count
           * more than 26 add a extraa character. which character to add and how
           * many times is decided by following formula
           *
           *
           *    repeatCount  = num / 26;
           *    charcterToRepear = num % 26  + 96(for lower case alphabets) or
           *    64 (for upper case alphabets)
           *
           * @param num {int} counter for list level.
           * @param charCode {int} charCode to be added to num to get uper case
           *                                or lower case values.
           */
          function _getAlphabetValue(num, charCode) {
            var result, repeatCount;
            if (num > 26) {
              repeatCount = Math.floor(num / 26);
              num = num % 26;
              if (num === 0) {
                // very sepecific case for multiple of 26 for exapmle --  'zz'
                // character for which num is equal to 52
                repeatCount = repeatCount - 1;
                num = 26;
              }
            }
            var alphabet = String.fromCharCode(charCode + parseInt(num, 10));
            result = alphabet;
            for (var i = 0; i < repeatCount; i++) {
              result += alphabet;
            }
            return result;
          }

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
