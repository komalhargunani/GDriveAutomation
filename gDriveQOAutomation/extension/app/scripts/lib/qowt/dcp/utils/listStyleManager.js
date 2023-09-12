/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE: The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

/**
 * Numbered List Object Manager.
 *
 */
define([], function() {

  'use strict';

  var _numbering, _textIndentCache;

  var _api = {
    setNumbering : function(listStyle){
      if(listStyle){
        _numbering = listStyle;
        /**
         * _textIndentCache keeps track of the
         * cached textIndents at various levels.
         * For e.g. equal sized strings at various levels
         * with similar font-properties would have same width
         * and hence need not be measured again a off-screen div.
         */
        _textIndentCache = {
          numInstance: {

          }
        };
      }
    },
    /**
     *
     * @param numInstanceId
     * @param level
     * @return Level Object cached from the numbering information
     */
    getlevel: function(numInstanceId, level) {
      var _level;
      if (level >= 0 && level <= 8) {
        if (numInstanceId >= 1) {
          // JELTE TODO: this code is very difficult to read/follow...
          // what is .absnum versus .num in this case??
          // More to the point, this is causing uncaught exceptions where
          // elm is not a property of undefined... for pronto we'll need to
          // redo lists anyway, but for now i'm going to guard this exception
          // ultimately we should hopefully either remove this list manager
          // all together, or make it more readable
          try {
            _level =
              _numbering.absnum[_numbering.num[numInstanceId - 1].absnumid].
                elm[level];
          } catch (e) {}
        }
      }
      return _level;
    },
    /**
     *
     * @param numInstanceId
     * @param level
     * @param content
     * @return TextIndent value for a particular level, numInstanceId and
     * content
     *
     * Equi-sized strings in a particular level would have the same
     * text indent to be offset. These are cached and returned when the
     * parameters do match.
     *
     */
    getTextIndent: function(numInstanceId, level, content) {
      var value;

      if (_textIndentCache.
        numInstance[_numbering.num[numInstanceId - 1].absnumid] !== undefined) {
        if (_textIndentCache.
          numInstance[_numbering.num[numInstanceId - 1].absnumid].
          level !== undefined) {

          var levelKey = level + "-" + content.length;

          if (_textIndentCache.
            numInstance[_numbering.num[numInstanceId - 1].absnumid].
            level[levelKey] !== undefined) {
            value = _textIndentCache.
              numInstance[_numbering.num[numInstanceId - 1].absnumid].
              level[levelKey];
          }
        }
      }

      return value;
    },
    /**
     *
     * @param numInstancId
     * @param level
     * @param textIndent
     * @param content
     *
     * Text indent is cached for a particular content, on the basis of the
     * length of the string.
     * These could be queried by the getTextIndent API later.
     */
    setTextIndent: function(numInstancId, level, textIndent, content) {

      if (_textIndentCache.
        numInstance[_numbering.num[numInstancId - 1].absnumid] === undefined) {
        _textIndentCache.
          numInstance[_numbering.num[numInstancId - 1].absnumid] = {};
      }

      if (_textIndentCache.
        numInstance[_numbering.num[numInstancId - 1].absnumid].
        level === undefined) {
        _textIndentCache.
          numInstance[_numbering.num[numInstancId - 1].absnumid].level = {};
      }

      var levelKey = level + "-" + content.length;

      if (_textIndentCache.
        numInstance[_numbering.num[numInstancId - 1].absnumid].
        level[levelKey] === undefined) {
        _textIndentCache.
          numInstance[_numbering.num[numInstancId - 1].absnumid].
          level[levelKey] = textIndent;
      }

    }
  };

  return _api;
});
