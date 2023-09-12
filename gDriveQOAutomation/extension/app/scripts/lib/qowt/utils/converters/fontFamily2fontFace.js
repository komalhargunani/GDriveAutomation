define([
  'qowtRoot/utils/typeUtils'
], function(
    TypeUtils) {

  'use strict';

  var api_ = {
    from: 'fontFamily',
    to: 'fontFace',
    bidi: false,

    /**
     * @param {String} family the family of fonts
     * @return {String} the first font face in the list (stripped of quotes)
     */
    fontFamily2fontFace: function(family) {
      if (!TypeUtils.isString(family)) {
        throw new Error('Invalid non String input to fontFamily2fontFace');
      }

      // font families are comma separated
      var fonts = family.split(',');
      var face = fonts[0];

      // strip any quotes
      return face.replace(/['"]/g,'');
    }
  };


  return api_;
});
