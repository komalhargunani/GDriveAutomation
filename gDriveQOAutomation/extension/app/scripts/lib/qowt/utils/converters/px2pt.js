define([
  'qowtRoot/utils/typeUtils'
], function(
    TypeUtils) {

  'use strict';

  var _api = {
    from: 'px',
    to: 'pt',
    bidi: true,

    /**
     * @param {Number} px css px value
     * @return {Number} point value
     */
    px2pt: function(px) {
      if (!TypeUtils.isNumber(px)) {
        throw new Error('Invalid non Number input to px2pt');
      }
      // relation between cssPx and points is 4:3. Note: css px is NOT the same
      // as a hardware pixel and thus we do not need to worry about dpi of the
      // device
      return px * (3/4);
    },

    /**
     * @param {Number} px css pt value
     * @return {Number} css px value
     */
    pt2px: function(pt) {
      if (!TypeUtils.isNumber(pt)) {
        throw new Error('Invalid non Number input to pt2px');
      }
      // relation between cssPx and points is 4:3. Note: css px is NOT the same
      // as a hardware pixel and thus we do not need to worry about dpi of the
      // device
      return pt * (4/3);
    }
  };

  return _api;
});
