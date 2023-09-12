define([
  'third_party/lo-dash/lo-dash.min'
], function() {

  'use strict';
  _.mixin({
    /**
     * @param {Integer} index - index to be validated
     * @return {boolean} True if the index is valid, false otherwise.
     */
    isValidIdx: function(index) {
      return (Number.isInteger(index) && (index >= 0));
    },


    /**
     * @return {boolean} True if all the arguments are valid indices, false
     *                   otherwise.
     */
    areValidIdx: function() {
      var args = [].slice.call(arguments);
      if (args.length === 1) {
        throw (new Error('Prefer using _.isValidIdx() to verify single idx, ' +
            'that\'ll be more readability'));
      }
      return !_.isEmpty(args) && args.every(function(idx) {
        return _.isValidIdx(idx);
      });
    },


    /**
     * @param {Object} cell - {rowIdx, colIdx} cell to be validated.
     * @return {boolean} True if the cell is valid, false otherwise.
     *
     * Note: This function does not ensure that the cell exists in the layout.
     *      Such a check should be explicitly carried out
     */
    isValidCell: function(cell) {
      return _.isValidIdx(cell.rowIdx) && _.isValidIdx(cell.colIdx);
    },


    /**
     * TODO(umesh.kadam) - move this to a meaningful file or submit to lodash
     * library
     * @return {Boolean} true if all arguments are undefined. false otherwise
     */
    areUndefined: function() {
      var args = [].slice.call(arguments);
      if (args.length === 1) {
        throw (new Error('Prefer using _.isUndefined() to verify single ' +
            'value, that\'ll be more readability'));
      }

      return !_.isEmpty(args) && args.every(function(arg) {
        return _.isUndefined(arg);
      });
    }
  });
});
