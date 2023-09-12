define([
  'qowtRoot/utils/typeUtils'
], function(
    TypeUtils) {

  'use strict';

  var _api = {
    from: 'cssSize',
    to: 'pt',
    bidi: false,

    // keyword designated pt sizes
    keywordValues : {
      'x-small' : 7.5,
      'small' : 10,
      'medium' : 12,
      'large' : 13.5,
      'x-large' : 18,
      'xx-large' : 24
    },

    /**
     * @param {String} cssSize eg '345px' or '34mm'. Current supported units are
     *      'px', 'pt', 'mm', 'cm' and 'em'
     * @return {Number} value in pt (as float)
     */
    cssSize2pt: function(cssSize) {
      if (!TypeUtils.isString(cssSize)) {
        throw new Error(
            'Invalid non String input to cssSize2pt');
      }

      var ptVal;

      // check keyword values
      for (var keyword in _api.keywordValues) {
        if (keyword === cssSize) {
          ptVal = _api.keywordValues[keyword];
          return ptVal;
        }
      }

      // parseFloat will ignore 'px' etc..
      var sizeVal = parseFloat(cssSize);
      var unit = cssSize.substr(-2);


      switch (unit) {
        case 'pt':
          ptVal = sizeVal;
          break;

        case 'px':
          ptVal = this.px2pt(sizeVal);
          break;

        case 'mm':
          ptVal = this.mm2pt(sizeVal);
          break;

        case 'cm':
          var mm = sizeVal * 100;
          ptVal = this.mm2pt(mm);
          break;

        case 'em':
          ptVal = this.em2pt(sizeVal);
          break;

        default:
          throw new Error('Unsupported size unit for cssSize2pt: ' + unit);
      }
      return ptVal;
    }
  };


  return _api;
});
