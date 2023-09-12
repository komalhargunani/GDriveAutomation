/**
 * @fileoverview The formula utility methods provide ways
 * to interrogate, convert and find parts of a formula.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

 define([
    'qowtRoot/utils/converters/converter',
    'qowtRoot/configs/sheet'
   ], function(
    Converter,
    SheetConfig) {

  'use strict';

    var _api = {

      /**
       * Uses a regular expression to tokenize the formula text into cell
       * references (with prefixes) - e.g. "+M53".
       * The regular expression used identifies a 'token' as consisting of:
       *
       * [(,.:<>=\^!&*+-\/\u0020\u00A0] - One of the valid chars that can prefix
       *                                  a cell ref (see
       *                                  VALID_CELL_REF_PREFIX_CHARS in
       *                                  /src/configs/sheet.js), followed by
       * [$]? - Zero or one dollar signs, followed by
       * [A-Z]+ - One or more letters, followed by
       * [$]? - Zero or one dollar signs, followed by
       * [0-9]+ - One or more digits
       *
       * The modifiers used are:
       * g - Perform a global match (find all matches rather than only the
       *     first one)
       * m - Perform multiline matching
       * i - Perform case-insensitive matching (to find cell refs
       *     that have been entered with lower case column names)
       *
       * @param {string} text The text to be tokenized
       * @return {array or null or undefined} An array of tokens - e.g.
       *                                      ["+M35", "-B12"], or null if there
       *                                      are no tokens, or undefined if the
       *                                      specified text is not defined
       *
       * @method tokenizeIntoPrefixedCellRefs(text)
       */
      tokenizeIntoPrefixedCellRefs:  function(text) {
        var tokens;
        if(text) {
          var thePrefixChars = SheetConfig.VALID_CELL_REF_PREFIX_CHARS.join('');
          var theOptionalDollar = "[$]?";
          var theLetters = "[A-Z]+";
          var theDigits = "[0-9]+";
          var regExp = new RegExp("[" + thePrefixChars + "]" +
            theOptionalDollar + theLetters +
            theOptionalDollar + theDigits, "gmi");
          tokens = text.match(regExp);
        }
        return tokens;
      },

      /**
       * Determines whether the character at the specified position in the
       * given text is one of the valid characters that can prefix a cell
       * reference
       *
       * @param {string} text The text
       * @param {integer} charPos The character position to check
       * @return {boolean} A flag indicating whether the character at the
       *                   specified position is a valid cell ref prefix char -
       *                   true if so, otherwise false
       * @method charIsValidCellRefPrefix(text, charPos)
       */
      charIsValidCellRefPrefix: function(text, charPos) {
        var result = false;
        var targetChar = text ? text.charAt(charPos): undefined;
        if(targetChar && SheetConfig.VALID_CELL_REF_PREFIX_CHARS &&
          (SheetConfig.VALID_CELL_REF_PREFIX_CHARS.
            indexOf(targetChar) !== -1)) {
          result = true;
        }
        return result;
      },

      /**
       * Finds in the given string the final index of a valid cell
       * prefix character
       *
       * @param {string} text The text to search
       * @return {integer} The index of the final valid cell prefix character
       *                   or -1 if none was found
       * @method findFinalPrefixCharIndex(text)
       */
      findFinalPrefixCharIndex: function(text) {
        var index = -1;
        if(text) {
          var thePrefixChars = SheetConfig.VALID_CELL_REF_PREFIX_CHARS.join('');
          var regExp = new RegExp(".*[" + thePrefixChars + "]", "gm");
          var matchesArray = text.match(regExp);
          if(matchesArray && matchesArray.length) {
            index = matchesArray[matchesArray.length - 1].length - 1;
          }
        }
        return index;
      },

      /**
       * Finds in the given string the final cell area
       *
       * @param {string} text The text to search
       * @return {object or undefined} The final cell area
       *                               (e.g. {startCellRef: "D28"}, or
       *                               {startCellRef: "A13", endCellRef: "C15"})
       *                               or undefined if none was found
       * @method findFinalCellArea(text)
       */
      findFinalCellArea: function(text) {
        var obj;
        if(text) {
          var cellRefArray = _api.tokenizeIntoPrefixedCellRefs(text);
          if(cellRefArray && cellRefArray.length) {
            var cellRefCount = cellRefArray.length;
            var prefixedCellRef = cellRefArray[cellRefCount - 1];
            var prefixChar = prefixedCellRef.substring(0, 1);
            var cellRef = prefixedCellRef.substring(1); // strip out prefix char
            obj = {startCellRef: cellRef};
            if((prefixChar === ':') && (cellRefCount >= 2)) {
              prefixedCellRef = cellRefArray[cellRefCount - 2];
              cellRef = prefixedCellRef.substring(1); // strip out prefix char
              obj.endCellRef = obj.startCellRef;
              obj.startCellRef = cellRef;
            }
          }
        }
        return obj;
      },

      /**
       * Converts the given cell ref - e.g. "D18" - into an object
       * containing the corresponding row number and column number
       *
       * @param {string} cellRef The cell ref to convert
       * @return {object} An object containing the corresponding
       *                  row number and column number - e.g.
       *                  {rowNum: 4, colNum: 18}
       * @method cellRefToRowAndColNums(cellRef)
       */
      cellRefToRowAndColNums: function(cellRef) {
        var obj = {};
        if(cellRef) {
          // strip out any '$' chars from the cell ref
          cellRef = cellRef.replace(/\$/gm, '');
          var digitsStartIndex = cellRef.search(/[0-9]/m);
          if(digitsStartIndex >= 0) {
            var colName = cellRef.substring(0, digitsStartIndex);
            if(colName) {
              obj.rowNum = cellRef.substring(digitsStartIndex);
              obj.colNum = Converter.colName2colNum(colName);
            }
          }
        }
        return obj;
      },

      /**
       * Converts the given row and column numbers
       * into a cell ref - e.g. "D18"
       *
       * @param {object} An object containing a row
       *                 number and column number - e.g.
       *                 {rowNum: 4, colNum: 18}
       * @return {string} The corresponding cell ref
       * @method cellRowAndColNumsToRef(obj)
       */
      cellRowAndColNumsToRef: function(obj) {
        var cellRef;
        if(obj && obj.rowNum && obj.colNum) {
          var colName = Converter.colNum2colName(obj.colNum);
          if(colName) {
            cellRef = colName + obj.rowNum;
          }
        }
        return cellRef;
      },

      /**
       * Adds any missing closing parentheses to a formula, so that the
       * amended formula has a valid syntax.
       *
       * @param {string} text The uncommitted formula
       * @return {string} The amended formula where any missing closing
       *                  parentheses have been added
       */
      addClosingParentheses: function(text) {
        var numUnbalancedParentheses = _countUnbalancedParentheses(text);
        for (var i = 0; i < numUnbalancedParentheses; i++) {
          text += ')';
        }
        return text;
      },

      /**
       * Removes the whitespace in a formula.
       *
       * @param {string} text The uncommitted formula
       * @return {string} The amended formula where the whitespace has been
       *                  removed
       */
      removeWhitespace: function(text) {
        return text.replace(/\s+/g, '');
      }
    };

   /**
    * Returns the number of unbalanced opening parentheses (the opening
    * parenthesis that does not have a matching closing parenthesis).
    *
    * @param {string} text The uncommitted formula
    * @return {number} The number of unbalanced opening parentheses or -1 if a
    *                  closing parenthesis doesn't match any opening parenthesis
    */
    var _countUnbalancedParentheses = function(text) {
      var stack = [];

      for (var i = 0; i < text.length; i++) {
        if (text[i] === '(') {
          // push the opening parenthesis to stack
          stack.push(text[i]);
        }
        else if (text[i] === ')') {
          // check if the closing parenthesis matches an opening parenthesis
          if (stack[0] === '(') {
            stack.pop();
          }
          else {
            // if the closing parenthesis does not close anything previously
            // opened, return -1
            return -1;
          }
        }
      }
      // return the number of parentheses still open
      return stack.length;
    };

    return _api;
});
