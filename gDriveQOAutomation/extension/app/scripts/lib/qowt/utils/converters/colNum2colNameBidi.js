/**
 * @fileoverview bi-directional converter
 * between column numbers and column names.
 * NOTE: This follows MS Excel's algorithm:
 *   1 - A
 *   2 - B
 *   ...
 *   27 - AA
 *   28 - AB
 *
 * See src/utils/converters/converter for usage
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([], function() {

  'use strict';

  var _numOfLetters = 26,
  _uppercaseACharCode = 65;

  var _api = {
    from: 'colNum',
    to: 'colName',
    bidi: true,

    'colNum2colName': function(colNum) {
      var numberForRhsLetter = (colNum - 1) % _numOfLetters;
      var rhsLetter =
        String.fromCharCode(_uppercaseACharCode + numberForRhsLetter);
      var numberForLhs = parseInt(((colNum - 1) / _numOfLetters), 10);
      if (numberForLhs > 0) {
        return _api.colNum2colName(numberForLhs) + rhsLetter;
      }
      else {
        return rhsLetter;
      }
    },

    'colName2colNum': function(colName) {
      colName = colName.toUpperCase();
      var rhsLetterIndex = colName.length - 1;
      var rhsLetter = colName.substring(rhsLetterIndex);
      var number = rhsLetter.charCodeAt(0) - _uppercaseACharCode + 1;
      var lhsOfName = colName.substring(0, rhsLetterIndex);
      if(lhsOfName) {
        return (_numOfLetters * _api.colName2colNum(lhsOfName)) + number;
      }
      else {
        return number;
      }
    }
  };

  // vvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvv

  return _api;
});