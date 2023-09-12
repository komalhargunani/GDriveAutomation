
define([
  'qowtRoot/utils/converters/colNum2colNameBidi',
  'qowtRoot/utils/converters/colorString2hex',
  'qowtRoot/utils/converters/cssSize2em',
  'qowtRoot/utils/converters/cssSize2pt',
  'qowtRoot/utils/converters/eighthpt2pt',
  'qowtRoot/utils/converters/fontFamily2fontFace',
  'qowtRoot/utils/converters/num2alpha',
  'qowtRoot/utils/converters/num2roman',
  'qowtRoot/utils/converters/number2fixed',
  'qowtRoot/utils/converters/pt2em',
  'qowtRoot/utils/converters/pt2mm',
  'qowtRoot/utils/converters/px2pt',
  'qowtRoot/utils/converters/rgb2hex',
  'qowtRoot/utils/converters/rgb2percentageRgbBidi',
  'qowtRoot/utils/converters/twip2mm',
  'qowtRoot/utils/converters/twip2pt',
  'qowtRoot/utils/converters/twip2px'
  ], function() {

  'use strict';


  var api_ = {};

  /**
   * query function to indicate if a particular conversion is
   * supported
   *
   * @param {string} from identifying what the caller wants to convert
   * @param {string} to identifying to what they want to convert to
   */
  api_.supports = function(from, to) {
    return api_[from + '2' + to] !== undefined;
  };

  // Add all our dependency (eg the converters) functions to our API the actual
  // converter module which must have api.from and api.to attributes and the
  // api.from2to function. If it has an api.bidi attribute which is set to true
  // then the converter must also have the api.to2from function
  for (var i = 0; i < arguments.length; i++) {
    var converter = arguments[i];

    if (converter.from && converter.to) {
      var conversionFunction = converter.from + '2' + converter.to;
      api_[conversionFunction] = converter[conversionFunction];

      // if the converter is bi-directional then add the converse function
      if(converter.bidi) {
        conversionFunction = converter.to + '2' + converter.from;
        api_[conversionFunction] = converter[conversionFunction];
      }
    }
  }


  return api_;
});
