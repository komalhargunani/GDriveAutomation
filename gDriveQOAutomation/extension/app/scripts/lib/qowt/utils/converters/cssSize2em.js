define([
  'qowtRoot/utils/typeUtils'
], function(
    TypeUtils) {

  'use strict';

  var _api = {
    from: 'cssSize',
    to: 'em',
    bidi: false,

    /**
     * @param {String} cssSize eg '345px' or '34mm'
     * @return {Number} value in em (as float)
     */
    cssSize2em: function(cssSize) {
      if (!TypeUtils.isString(cssSize)) {
        throw new Error(
            'Invalid non String input to cssSize2em');
      }
      var pt = this.cssSize2pt(cssSize);

      return this.pt2em(pt);
    }
  };

  // vvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvv

  return _api;
});
